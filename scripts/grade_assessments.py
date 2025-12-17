#!/usr/bin/env python3
"""
Assessment Grading Script for CodeVision Academy

This script:
1. Downloads student notebook submissions from Google Drive
2. Validates Python syntax using AST
3. Injects student code into the assessment template
4. Executes hidden tests
5. Submits scores to the transcript via Apps Script API
"""

import argparse
import ast
import json
import os
import re
import sys
import tempfile
from pathlib import Path

import nbformat
import requests
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from nbclient import NotebookClient
import io


# Configuration
DRIVE_FOLDER_ID = '1il2tcPvs2RwMmR8argOyMMimIxfO-aKe'
RESPONSE_SPREADSHEET_ID = '1drrRJD40RDgcUlCweAh0ijlfircIQbzCagsoYeWqsxQ'
SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]


def get_env_var(name: str) -> str:
    """Get required environment variable or exit with error."""
    value = os.environ.get(name)
    if not value:
        print(f"ERROR: Environment variable {name} is not set")
        sys.exit(1)
    return value


def authenticate_google():
    """Authenticate with Google APIs using service account credentials."""
    creds_json = get_env_var('GOOGLE_SERVICE_ACCOUNT')
    creds_dict = json.loads(creds_json)
    credentials = service_account.Credentials.from_service_account_info(
        creds_dict, scopes=SCOPES
    )
    drive = build('drive', 'v3', credentials=credentials)
    sheets = build('sheets', 'v4', credentials=credentials)
    return drive, sheets


def get_dashboard_email_mapping(sheets) -> dict:
    """
    Read EmailMappings sheet to map Google emails to dashboard emails.
    Returns dict of {google_email: dashboard_email}
    """
    try:
        result = sheets.spreadsheets().values().get(
            spreadsheetId=RESPONSE_SPREADSHEET_ID,
            range='EmailMappings!A:B'
        ).execute()

        rows = result.get('values', [])
        mapping = {}
        for row in rows[1:]:  # Skip header
            if len(row) >= 2:
                google_email = row[0].strip().lower()
                dashboard_email = row[1].strip().lower()
                if google_email and dashboard_email:
                    mapping[google_email] = dashboard_email

        if mapping:
            print(f"Loaded {len(mapping)} dashboard email mappings")
        return mapping

    except Exception as e:
        # Sheet might not exist yet - that's OK
        return {}


def get_email_mapping(sheets) -> tuple[dict, dict]:
    """
    Read the form response spreadsheet to get email -> file URL mapping.
    Returns tuple of (file_id_to_email, google_to_dashboard_email)
    """
    dashboard_mapping = get_dashboard_email_mapping(sheets)

    try:
        result = sheets.spreadsheets().values().get(
            spreadsheetId=RESPONSE_SPREADSHEET_ID,
            range='A:Z'  # Get all columns from first sheet
        ).execute()

        rows = result.get('values', [])
        if not rows:
            print("Warning: Response spreadsheet is empty")
            return {}, dashboard_mapping

        # Find column indices (header row)
        headers = [h.lower().strip() for h in rows[0]]
        email_col = None
        file_col = None

        for i, h in enumerate(headers):
            if 'email' in h:
                email_col = i
            if 'notebook' in h or 'file' in h or 'upload' in h:
                file_col = i

        if email_col is None or file_col is None:
            print(f"Warning: Could not find email or file columns. Headers: {headers}")
            return {}, dashboard_mapping

        # Build mapping
        mapping = {}
        for row in rows[1:]:  # Skip header
            if len(row) > max(email_col, file_col):
                email = row[email_col].strip().lower() if row[email_col] else None
                file_url = row[file_col] if len(row) > file_col else None

                if email and file_url:
                    # Extract file ID from Drive URL
                    file_id_match = re.search(r'[-\w]{25,}', file_url)
                    if file_id_match:
                        # Apply dashboard email mapping if exists
                        final_email = dashboard_mapping.get(email, email)
                        mapping[file_id_match.group(0)] = final_email

        print(f"Loaded {len(mapping)} email mappings from response sheet")
        return mapping, dashboard_mapping

    except Exception as e:
        print(f"Warning: Could not read response spreadsheet: {e}")
        return {}, dashboard_mapping


def list_submissions(drive, module: int) -> list[dict]:
    """List all notebook submissions for a module."""
    folder_name = f'Module_{module}'

    # First, find the module subfolder
    query = f"'{DRIVE_FOLDER_ID}' in parents and name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder'"
    results = drive.files().list(q=query, fields="files(id, name)").execute()
    folders = results.get('files', [])

    if not folders:
        print(f"No folder found for {folder_name}")
        return []

    module_folder_id = folders[0]['id']

    # List all .ipynb files in the module folder
    query = f"'{module_folder_id}' in parents and name contains '.ipynb'"
    results = drive.files().list(
        q=query,
        fields="files(id, name, createdTime)",
        orderBy="createdTime desc"
    ).execute()

    return results.get('files', [])


def download_notebook(drive, file_id: str) -> dict:
    """Download a notebook from Google Drive and parse it."""
    request = drive.files().get_media(fileId=file_id)
    file_buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(file_buffer, request)

    done = False
    while not done:
        _, done = downloader.next_chunk()

    file_buffer.seek(0)
    content = file_buffer.read().decode('utf-8')
    return nbformat.reads(content, as_version=4)


def extract_email_from_filename(filename: str) -> str | None:
    """
    Extract email from filename.
    Expected format: email_at_domain_com_Module1_timestamp.ipynb
    or variations like: user@email.com - Module 1.ipynb
    """
    # Try to find email pattern in filename
    # Pattern 1: email with @ symbol
    email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', filename)
    if email_match:
        return email_match.group(1).lower()

    # Pattern 2: email with underscores replacing @ and .
    # e.g., user_at_gmail_com or user_gmail_com
    underscore_match = re.match(r'^([a-zA-Z0-9._]+)_(?:at_)?([a-zA-Z0-9._]+)_([a-zA-Z]{2,})_Module', filename)
    if underscore_match:
        local = underscore_match.group(1)
        domain = underscore_match.group(2)
        tld = underscore_match.group(3)
        return f"{local}@{domain}.{tld}".lower()

    # Pattern 3: Just use the first part before Module or any common separator
    simple_match = re.match(r'^(.+?)[-_\s]+Module', filename, re.IGNORECASE)
    if simple_match:
        # This might be just a name, not an email - return None and let caller handle
        potential = simple_match.group(1).strip()
        if '@' not in potential and '.' not in potential:
            return None
        return potential.lower()

    return None


def extract_student_code(notebook: dict) -> list[str]:
    """Extract all code cells from a student notebook."""
    code_cells = []
    for cell in notebook.get('cells', []):
        if cell.get('cell_type') == 'code':
            source = cell.get('source', '')
            if isinstance(source, list):
                source = ''.join(source)
            # Skip empty cells and cells that only have comments
            stripped = source.strip()
            if stripped and not all(line.strip().startswith('#') or not line.strip()
                                     for line in stripped.split('\n')):
                code_cells.append(source)
    return code_cells


def validate_syntax(code_cells: list[str]) -> list[str]:
    """
    Validate Python syntax for all code cells.
    Returns list of error messages (empty if all valid).
    """
    errors = []
    for i, code in enumerate(code_cells, start=1):
        try:
            ast.parse(code)
        except SyntaxError as e:
            errors.append(f"Cell {i}, line {e.lineno}: {e.msg}")
    return errors


def load_template(template_path: str) -> dict:
    """Load the grading template notebook."""
    with open(template_path, 'r', encoding='utf-8') as f:
        return nbformat.read(f, as_version=4)


def inject_into_template(code_cells: list[str], template: dict) -> dict:
    """
    Inject student code cells into the grading template.

    Strategy: Insert all student code cells after the scoring setup cell
    (the one with __assessment_scores) but before the first test cell.
    """
    import copy
    notebook = copy.deepcopy(template)

    # Find the position after the scoring setup cell
    insert_position = 1  # Default: after first cell

    for i, cell in enumerate(notebook['cells']):
        if cell.get('cell_type') == 'code':
            source = cell.get('source', '')
            if isinstance(source, list):
                source = ''.join(source)
            if '__assessment_scores' in source and 'record_score' in source:
                insert_position = i + 1
                break

    # Create new code cells from student code
    new_cells = []
    for code in code_cells:
        new_cell = nbformat.v4.new_code_cell(source=code)
        new_cells.append(new_cell)

    # Insert student cells
    notebook['cells'] = (
        notebook['cells'][:insert_position] +
        new_cells +
        notebook['cells'][insert_position:]
    )

    return notebook


def execute_notebook(notebook: dict, working_dir: str) -> dict:
    """Execute the notebook and return the modified notebook."""
    client = NotebookClient(
        notebook,
        timeout=120,
        kernel_name='python3',
        allow_errors=True,  # Don't stop on errors - tests handle them
        resources={'metadata': {'path': working_dir}}
    )

    return client.execute()


def parse_results(result_path: str) -> dict:
    """Parse the assessment_result.json file."""
    with open(result_path, 'r') as f:
        data = json.load(f)

    scores = data.get('scores', {})

    # Calculate totals
    total_score = sum(s[0] for s in scores.values())
    max_score = sum(s[1] for s in scores.values())

    return {
        'scores': scores,
        'total_score': total_score,
        'max_score': max_score,
        'timestamp': data.get('timestamp')
    }


def check_already_graded(email: str, module_id: str) -> bool:
    """Check if student has already been graded for this module."""
    api_url = get_env_var('APPS_SCRIPT_URL')

    try:
        response = requests.post(
            api_url,
            json={
                'action': 'isAlreadyGraded',
                'email': email,
                'moduleId': module_id
            },
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        result = response.json()
        return result.get('graded', False)
    except Exception as e:
        print(f"  Warning: Could not check grading status: {e}")
        return False


def submit_score(email: str, module_id: str, score: int, max_score: int, details: dict) -> bool:
    """Submit assessment score to the transcript."""
    api_url = get_env_var('APPS_SCRIPT_URL')
    admin_key = get_env_var('ADMIN_API_KEY')

    try:
        response = requests.post(
            api_url,
            json={
                'action': 'submitAssessment',
                'adminKey': admin_key,
                'email': email,
                'moduleId': module_id,
                'score': score,
                'maxScore': max_score,
                'details': details
            },
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        result = response.json()
        if result.get('success'):
            return True
        else:
            print(f"  Error submitting score: {result.get('error')}")
            return False
    except Exception as e:
        print(f"  Error submitting score: {e}")
        return False


def grade_submission(drive, submission: dict, module: int, template_path: str, email_mapping: dict, force: bool = False) -> dict:
    """Grade a single submission and return results."""
    filename = submission['name']
    file_id = submission['id']
    module_id = f"module{module}-assessment"

    result = {
        'filename': filename,
        'email': None,
        'status': 'unknown',
        'score': 0,
        'max_score': 20,
        'details': {}
    }

    # Try to get email from response spreadsheet first, then fall back to filename
    email = email_mapping.get(file_id)
    if not email:
        email = extract_email_from_filename(filename)
    if not email:
        result['status'] = 'error'
        result['details'] = {'error': 'Could not find email (not in spreadsheet or filename)'}
        return result

    result['email'] = email

    # Check if already graded (skip check if force=True)
    if not force and check_already_graded(email, module_id):
        result['status'] = 'skipped'
        result['details'] = {'reason': 'Already graded'}
        return result

    # Download notebook
    try:
        notebook = download_notebook(drive, file_id)
    except Exception as e:
        result['status'] = 'error'
        result['details'] = {'error': f'Download failed: {str(e)}'}
        return result

    # Extract code cells
    code_cells = extract_student_code(notebook)

    if not code_cells:
        # Empty submission - record 0 marks
        result['status'] = 'empty'
        result['score'] = 0
        result['details'] = {'reason': 'No code cells found'}
        submit_score(email, module_id, 0, 20, result['details'])
        return result

    # AST SYNTAX VALIDATION GATE
    syntax_errors = validate_syntax(code_cells)
    if syntax_errors:
        result['status'] = 'syntax_error'
        result['score'] = 0
        result['details'] = {'syntax_errors': syntax_errors}
        submit_score(email, module_id, 0, 20, result['details'])
        return result

    # Syntax OK - proceed with grading
    try:
        template = load_template(template_path)
        grading_notebook = inject_into_template(code_cells, template)

        # Execute in a temp directory
        with tempfile.TemporaryDirectory() as tmpdir:
            executed = execute_notebook(grading_notebook, tmpdir)

            # Check for result file
            result_path = os.path.join(tmpdir, 'assessment_result.json')
            if os.path.exists(result_path):
                results = parse_results(result_path)
                result['status'] = 'graded'
                result['score'] = results['total_score']
                result['max_score'] = results['max_score']
                result['details'] = {'exercise_scores': results['scores']}
            else:
                # Execution completed but no results - likely all tests failed
                result['status'] = 'no_results'
                result['score'] = 0
                result['details'] = {'error': 'No assessment_result.json generated'}

        # Submit score
        submit_score(email, module_id, result['score'], result['max_score'], result['details'])

    except Exception as e:
        result['status'] = 'execution_error'
        result['score'] = 0
        result['details'] = {'error': f'Execution failed: {str(e)}'}
        submit_score(email, module_id, 0, 20, result['details'])

    return result


def main():
    parser = argparse.ArgumentParser(description='Grade student assessment submissions')
    parser.add_argument('--module', type=int, required=True, help='Module number (1, 2, etc.)')
    parser.add_argument('--student', type=str, default='', help='Specific student email (optional)')
    parser.add_argument('--force', action='store_true', help='Re-grade even if already graded')
    args = parser.parse_args()

    module = args.module
    student_filter = args.student.strip().lower() if args.student else None
    force_regrade = args.force

    print(f"=== CodeVision Assessment Grading ===")
    print(f"Module: {module}")
    if student_filter:
        print(f"Student filter: {student_filter}")
    if force_regrade:
        print(f"Force re-grade: ENABLED")
    print()

    # Find template
    script_dir = Path(__file__).parent.parent
    template_path = script_dir / f"Module{module}_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb"

    if not template_path.exists():
        print(f"ERROR: Template not found: {template_path}")
        sys.exit(1)

    print(f"Template: {template_path}")
    print()

    # Authenticate with Google APIs
    print("Authenticating with Google...")
    drive, sheets = authenticate_google()

    # Load email mapping from response spreadsheet
    print("Loading email mappings from response spreadsheet...")
    email_mapping, _ = get_email_mapping(sheets)

    # List submissions
    print(f"Listing submissions for Module {module}...")
    submissions = list_submissions(drive, module)

    if not submissions:
        print("No submissions found.")
        return

    print(f"Found {len(submissions)} submission(s)")
    print()

    # Group submissions by email and keep only the latest per student
    # (submissions are already ordered by createdTime desc from list_submissions)
    latest_by_email = {}
    for submission in submissions:
        file_id = submission['id']
        filename = submission['name']
        email = email_mapping.get(file_id) or extract_email_from_filename(filename)

        if email and email not in latest_by_email:
            latest_by_email[email] = submission

    # Filter to only latest submissions
    submissions_to_grade = list(latest_by_email.values())
    print(f"Processing {len(submissions_to_grade)} unique student(s) (latest submission each)")
    print()

    # Grade each submission
    results = []
    for submission in submissions_to_grade:
        filename = submission['name']
        file_id = submission['id']

        # Get email from mapping or filename
        email = email_mapping.get(file_id) or extract_email_from_filename(filename)

        # Apply student filter if provided
        if student_filter:
            if not email or student_filter not in email:
                continue

        print(f"Processing: {filename}")
        result = grade_submission(drive, submission, module, str(template_path), email_mapping, force=force_regrade)
        results.append(result)

        # Print result summary
        status = result['status']
        if status == 'graded':
            print(f"  GRADED: {result['score']}/{result['max_score']}")
        elif status == 'skipped':
            print(f"  SKIPPED: Already graded")
        elif status == 'syntax_error':
            errors = result['details'].get('syntax_errors', [])
            print(f"  SYNTAX FAIL: {len(errors)} error(s)")
            for err in errors[:3]:  # Show first 3 errors
                print(f"    - {err}")
        elif status == 'empty':
            print(f"  EMPTY: No code cells found")
        else:
            print(f"  ERROR: {result['details'].get('error', 'Unknown error')}")
        print()

    # Summary
    print("=== Summary ===")
    graded = [r for r in results if r['status'] == 'graded']
    skipped = [r for r in results if r['status'] == 'skipped']
    syntax_errors = [r for r in results if r['status'] == 'syntax_error']
    errors = [r for r in results if r['status'] in ('error', 'execution_error', 'no_results')]
    empty = [r for r in results if r['status'] == 'empty']

    print(f"Graded: {len(graded)}")
    print(f"Skipped (already graded): {len(skipped)}")
    print(f"Syntax errors: {len(syntax_errors)}")
    print(f"Empty submissions: {len(empty)}")
    print(f"Other errors: {len(errors)}")

    if graded:
        avg_score = sum(r['score'] for r in graded) / len(graded)
        print(f"Average score: {avg_score:.1f}/20")


if __name__ == '__main__':
    main()

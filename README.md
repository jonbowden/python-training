# CodeVision Python Training

## Overview
Jupyter Book-based Python training course with:
- Interactive notebooks (Colab/Binder launch)
- Quiz system with LLM-based grading
- Assessment submission via Google Forms
- Authentication guard for content protection

## Project Structure
```
├── _config.yml              # Jupyter Book configuration
├── _toc.yml                 # Table of contents
├── intro.md                 # Landing page
├── login.md                 # Authentication page
├── dashboard.md             # User dashboard
├── 01_syntax.ipynb          # Module 1 content (15 sections)
├── 01_quiz.md               # Module 1 quiz
├── Module1_Assessment.ipynb # Module 1 assessment exercises
├── 01_resources.md          # Additional resources
├── google_apps_script/      # Apps Script code (reference)
└── _build/                  # Generated site (gitignored)
```

## Deployment
- Push to GitHub → GitHub Actions builds and deploys
- Site served via GitHub Pages

---

# Assessment Submission System

## Student Workflow
1. Student opens assessment notebook in Google Colab (via launch button)
2. Student completes the 5 exercises
3. Student downloads notebook: **File → Download → Download .ipynb**
4. Student uploads via Google Form link in the notebook

## Instructor Setup (Google Forms + Apps Script)

### Step 1: Create Google Form
1. Go to [Google Forms](https://forms.google.com)
2. Create new form with:
   - Title: "Module 1 Assessment Submission"
   - File upload question (allow .ipynb or turn off file type restrictions)
3. Get the public form URL (ends with `/viewform`)

### Step 2: Create Destination Folder
1. Create folder in Google Drive: `Python_Training_Submission`
2. Create subfolders: `Module_1`, `Module_2`, etc.
3. Note the **parent folder ID** from the URL

### Step 3: Set Up Auto-Move Script
Google Forms uploads files to its own auto-created folder. This script moves them to your specified folder.

1. Open the Form's **Response Spreadsheet** (Responses tab → Spreadsheet icon)
2. In the spreadsheet: **Extensions → Apps Script**
3. Replace contents with:

```javascript
/**
 * Moves uploaded files from Google Forms to the training folder
 * Trigger: On form submit (from spreadsheet)
 */
function moveFile(e) {
  // Parent folder ID - get from Drive URL
  var PARENT_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';

  try {
    var folder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    // File URL is typically in column 2 or 3 (adjust as needed)
    var fileUrl = sheet.getRange(lastRow, 3).getValue();

    if (fileUrl && fileUrl.includes('drive.google.com')) {
      var fileId = fileUrl.match(/[-\w]{25,}/);
      if (fileId) {
        var file = DriveApp.getFileById(fileId[0]);
        file.moveTo(folder);
        Logger.log('Moved file: ' + file.getName());
      }
    }
  } catch (error) {
    Logger.log('Error moving file: ' + error.toString());
  }
}
```

4. Save the script (Ctrl+S)

### Step 4: Create Trigger
1. In Apps Script editor, click **Triggers** (clock icon, left sidebar)
2. Click **+ Add Trigger**
3. Configure:
   - Function: `moveFile`
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
4. Click Save
5. Authorize when prompted

### Step 5: Update Assessment Notebook
Update the submission cell in `Module1_Assessment.ipynb`:
```markdown
## Submission

**To submit your completed assessment:**

1. **Save your notebook:** File → Download → Download .ipynb
2. **Upload here:** [Submit Assessment](YOUR_FORM_URL_HERE)
```

### Testing
1. Submit a test file through the form
2. Check **Executions** in Apps Script (clock icon) for logs
3. Verify file appears in your destination folder

## Folder IDs Reference
- Parent folder (Python_Training_Submission): `1il2tcPvs2RwMmR8argOyMMimIxfO-aKe`

## Troubleshooting

### Files not moving
- Check the Executions log in Apps Script for errors
- Verify the folder ID is correct
- Ensure the file URL column number is correct in the script
- Check trigger is set to "From spreadsheet" not "From form"

### Form URL not working
- Use the **public** URL ending in `/viewform`
- NOT the edit URL ending in `/edit`

### File type restrictions
- If .ipynb files are rejected, go to Form settings
- Turn off file type restrictions, or ensure "Allow all file types"

---

# Configuration Notes

## _config.yml Key Settings
```yaml
# Launch buttons (Colab/Binder) - visible
launch_buttons:
  colab_url: "https://colab.research.google.com"
  binderhub_url: "https://mybinder.org"

# Repository button - hidden (protects answers)
repository:
  url: https://github.com/YOUR_REPO
use_repository_button: false

# Live code disabled (kernel issues)
# thebe: true  # REMOVED
```

## Adding New Modules
1. Create `0X_syntax.ipynb` with content
2. Create `0X_quiz.md` for quiz
3. Create `ModuleX_Assessment.ipynb` for exercises
4. Update `_toc.yml` to include new files
5. Create `Module_X` subfolder in Google Drive
6. Update form/script if needed for new module

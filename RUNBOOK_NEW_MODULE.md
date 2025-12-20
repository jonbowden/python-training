# Runbook: Creating a New Module

This document provides step-by-step instructions for creating a new training module for CodeVision Academy.

---

## Overview

Each module consists of:
1. **Content** - Main learning material (Jupyter notebook)
2. **Quiz** - Interactive quiz with MCQs and written questions
3. **Assessment** - Practical coding assessment with automated grading
4. **Resources** - Additional learning resources and links

### Components Involved

| Component | Purpose |
|-----------|---------|
| **Jupyter Book (HTML)** | Content display, quizzes, navigation |
| **Google Sheets** | User data, scores, form responses |
| **Google Forms** | Assessment submission collection |
| **Google Drive** | Assessment file storage |
| **Apps Script** | API backend, form handlers |
| **GitHub Actions** | Automated grading workflow |

---

## Step 1: Create Content Files

### 1.1 Main Content Notebook

Create `XX_topic.ipynb` (e.g., `03_databases.ipynb`):

```
Module structure:
- Title and introduction
- Learning objectives
- Content sections (10-15 sections typical)
- Code examples with outputs
- Practice exercises
- Summary
```

**Naming convention:** `XX_topic.ipynb` where XX is the module number (01, 02, 03...)

### 1.2 Quiz Page

Create `XX_quiz.md` with this structure:

```markdown
# Module X Quiz

{raw} html
<style>
/* Copy quiz styles from existing quiz */
</style>

<div id="quiz-container">
    <!-- Quiz HTML structure -->
</div>

<script>
const API_URL = 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec';
const QUIZ_ID = 'moduleX-quiz';

const mcqQuestions = [
    // Add 20+ MCQ questions
    {
        question: "Question text?",
        options: ["A", "B", "C", "D"],
        correct: 0  // Index of correct answer
    }
];

const writtenQuestions = [
    // Add 10+ written questions
    {
        question: "Question text?",
        sampleAnswer: "Expected concepts for grading"
    }
];

// Copy remaining quiz JavaScript from existing quiz
</script>
{/raw}
```

### 1.3 Assessment Notebook (Student Version)

Create `ModuleX_Assessment.ipynb`:

```markdown
# Module X – [Topic] Assessment

## Assessment Instructions
- Rules for submission
- Do not rename functions
- Ensure notebook runs without errors

## Exercise 1 – [Topic] (X points)
[Clear instructions with explicit requirements]

## Exercise 2 – [Topic] (X points)
...

## Submission
Link to Google Form
```

**Important:** Be explicit about:
- Data types expected
- Minimum requirements (e.g., "at least 5 items")
- Example inputs and outputs

### 1.4 Assessment Template (Hidden Tests)

Create `ModuleX_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb`:

```python
# Cell 1: Scoring setup
__assessment_scores = {}
__assessment_feedback = {}

def record_score(exercise, points, max_points, feedback=None):
    __assessment_scores[exercise] = (points, max_points)
    if feedback:
        __assessment_feedback[exercise] = feedback

# Cell 2+: Hidden tests for each exercise
points = 0
feedback = []

try:
    # Test assertions
    assert condition, "Error message"
    points += X
    feedback.append("✓ Success message")
except AssertionError as e:
    feedback.append(f"✗ {e}")
except Exception as e:
    feedback.append(f"✗ Error: {type(e).__name__}")

record_score('Exercise N', points, max_points, feedback)

# Final cell: Write results
import json, datetime

result = {
    'scores': __assessment_scores,
    'feedback': __assessment_feedback,
    'timestamp': datetime.datetime.now().isoformat()
}

with open('assessment_result.json', 'w') as f:
    json.dump(result, f, indent=2)
```

### 1.5 Resources Page

Create `XX_resources.md`:

```markdown
# Module X Additional Resources

## Official Documentation
- [Link 1](url)

## Tutorials
- [Link 2](url)

## Practice
- [Link 3](url)
```

---

## Step 2: Update Table of Contents

Edit `_toc.yml`:

```yaml
format: jb-book
root: intro
chapters:
- file: login
- file: dashboard
# Module 1
- file: 01_syntax
- file: 01_quiz
- file: Module1_Assessment
- file: 01_resources
# Module 2
- file: 02_data
- file: 02_quiz
- file: Module2_Assessment
- file: 02_resources
# Module X (NEW)
- file: XX_topic
- file: XX_quiz
- file: ModuleX_Assessment
- file: XX_resources
```

---

## Step 3: Google Components Setup

### 3.1 Create Response Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet: `Module X Assessment Responses`
3. Note the **Spreadsheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
4. Share with service account:
   ```
   codevision-grading@codevision-grading.iam.gserviceaccount.com
   ```
   (Editor access)

### 3.2 Create Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create new form: `Module X Assessment Submission`
3. Add fields:
   - **Email** (collect email addresses - required)
   - **Upload notebook** (File upload, .ipynb only)
4. Link to response spreadsheet created above
5. Get form URL for embedding in assessment notebook

### 3.3 Create Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Navigate to: `CodeVision > Assessments`
3. Create folder: `Module_X`
4. Note the **Folder ID** from URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID
   ```
5. Share with service account (Editor access)

### 3.4 Add Form Script (File Mover)

1. Open the Google Form
2. Click ⋮ → Script editor
3. Add this code:

```javascript
function moveFile(e) {
  var MODULE_X_FOLDER_ID = 'YOUR_FOLDER_ID';  // From step 3.3

  var responses = e.namedValues;
  var fileUrl = responses['Upload your completed notebook (.ipynb)'][0];

  if (fileUrl) {
    var fileIdMatch = fileUrl.match(/id=([^&]+)/);
    if (fileIdMatch) {
      var fileId = fileIdMatch[1];
      var file = DriveApp.getFileById(fileId);
      var targetFolder = DriveApp.getFolderById(MODULE_X_FOLDER_ID);
      file.moveTo(targetFolder);
    }
  }
}
```

4. Set trigger: **Triggers** → **Add Trigger**
   - Function: `moveFile`
   - Event: `On form submit`

### 3.5 Add EmailMappings Sheet (Optional)

If students use different emails for Google Form vs Dashboard:

1. In the response spreadsheet, create sheet: `EmailMappings`
2. Columns: `google_email | dashboard_email`
3. Add mappings as needed

---

## Step 4: Update Grading Script

Edit `scripts/grade_assessments.py`:

### 4.1 Add Spreadsheet ID

```python
RESPONSE_SPREADSHEET_IDS = {
    1: '1drrRJD40RDgcUlCweAh0ijlfircIQbzCagsoYeWqsxQ',
    2: '1RZfHeZPOJSjepquHOt1xHFBqTXvALczlIDcZzDVIWtI',
    X: 'YOUR_NEW_SPREADSHEET_ID',  # ADD THIS
}
```

### 4.2 Add Data Files (if needed)

If the module requires data files for grading:

```python
MODULE_DATA_FILES = {
    2: ['djia_data.csv', 'fx_usd_gbp.csv', 'fed_funds_rate.csv'],
    X: ['your_data_file.csv'],  # ADD THIS
}
```

Place data files in `grading_data/` folder.

---

## Step 5: Admin-Only Access (Optional)

To restrict module during testing:

Edit `_static/auth-guard.js`:

```javascript
const ADMIN_ONLY_PAGES = [
    'XX_topic.html',
    'XX_quiz.html',
    'ModuleX_Assessment.html',
    'XX_resources.html'
];
```

**To release:** Remove pages from this array.

---

## Step 6: Build and Test Locally

```bash
# Build the book
jupyter-book build .

# View locally
# Open _build/html/index.html in browser
```

### Test Checklist

- [ ] Content renders correctly
- [ ] Quiz loads and submits scores
- [ ] Assessment instructions are clear
- [ ] Form submission works
- [ ] Files move to correct Drive folder

---

## Step 7: Deploy

### 7.1 Commit and Push

```bash
git add .
git commit -m "Add Module X: [Topic]"
git push
```

### 7.2 Update Apps Script

If Code.gs was modified:
1. Go to [Apps Script](https://script.google.com)
2. Open CODEVISION API project
3. Update Code.gs
4. Deploy → Manage deployments → New version

### 7.3 Test Grading

```bash
# Test grading locally (if you have credentials)
python scripts/grade_assessments.py --module X --force

# Or trigger from Dashboard (admin panel)
```

---

## Step 8: Release to Users

1. Remove from `ADMIN_ONLY_PAGES` if restricted
2. Announce to users
3. Monitor for issues

---

## File Checklist

| File | Description | Location |
|------|-------------|----------|
| `XX_topic.ipynb` | Main content | Root |
| `XX_quiz.md` | Quiz page | Root |
| `ModuleX_Assessment.ipynb` | Student assessment | Root |
| `ModuleX_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb` | Grading template | Root |
| `XX_resources.md` | Additional resources | Root |
| `_toc.yml` | Table of contents | Root |
| `grade_assessments.py` | Grading script | scripts/ |
| `auth-guard.js` | Access control | _static/ |
| Data files (if any) | Test data | grading_data/ |

---

## Google Components Checklist

| Component | Purpose | Access |
|-----------|---------|--------|
| Response Spreadsheet | Store form responses | Service account |
| Google Form | Collect submissions | Public (with login) |
| Drive Folder | Store notebook files | Service account |
| Form Script | Move files to folder | Form owner |

---

## Troubleshooting

### Grading returns 0 scores
- Check data files exist in `grading_data/`
- Verify spreadsheet ID is correct
- Check service account has access to spreadsheet

### Form submissions not appearing
- Verify form is linked to spreadsheet
- Check form script trigger is active
- Verify folder ID in script is correct

### Quiz scores not saving
- Check API_URL in quiz page
- Verify QUIZ_ID matches expected format
- Check browser console for errors

### Admin-only not working
- Ensure `is_admin` column exists in Users sheet
- Check auth-guard.js has correct page names
- Clear browser cache and retry

---

## Contacts

- **Course Admin:** [Your email]
- **Technical Issues:** [Support email]
- **GitHub Repo:** [Repository URL]

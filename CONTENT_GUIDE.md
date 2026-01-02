# CodeVision Training - Content Guide

This guide explains how to add and modify content in your Jupyter Book training site.

---

## Project Structure

```
codevision_poc/
├── _config.yml              # Book configuration
├── _toc.yml                 # Table of contents (defines structure)
├── intro.md                 # Landing page
├── login.md                 # Login page
├── dashboard.md             # Student dashboard
├── Module1/                 # Module 1 folder
│   ├── Module1.md           # Module overview page
│   ├── 01_quiz.md           # Quiz
│   ├── 01_resources.md      # Additional resources
│   ├── Module1_Assessment.ipynb                    # Student assessment
│   └── Module1_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb  # Grading template
├── Module2/                 # Module 2 folder
│   ├── Module2.md
│   ├── 02_quiz.md
│   ├── 02_resources.md
│   ├── Module2_Assessment.ipynb
│   └── Module2_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb
├── Module3/                 # Module 3 folder (LLM Fundamentals)
│   ├── Module3.md
│   ├── 03_llm_fundamentals.ipynb   # Content notebook
│   ├── 03_quiz.md
│   ├── 03_resources.md
│   ├── Module3_Assessment.ipynb
│   └── Module3_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb
├── Module4/                 # Module 4 folder (ML & Deep Learning)
│   ├── Module4.md
│   ├── 04_ml_dl_foundations.ipynb
│   ├── 04_quiz.md
│   ├── 04_resources.md
│   └── Module4_Assessment.ipynb
├── 01_syntax.ipynb          # Module 1 content (legacy location)
├── 02_data.ipynb            # Module 2 content (legacy location)
├── scripts/                 # Grading scripts
│   ├── grade_assessments.py
│   └── requirements-grading.txt
├── .github/workflows/       # GitHub Actions
│   ├── deploy.yml           # Build and deploy site
│   └── grade-assessments.yml # Automated grading
└── CV_White.png             # Logo
```

---

## 1. Adding a New Section (e.g., Section 2)

### Step 1: Create the content file

Create a new notebook or markdown file:

**Option A: Jupyter Notebook** (for code examples)
```
02_functions.ipynb
```

**Option B: Markdown file** (for text-only content)
```
02_functions.md
```

### Step 2: Update `_toc.yml`

Edit `_toc.yml` to add the new section:

```yaml
format: jb-book
root: intro
chapters:
- file: 01_syntax
- file: 01_quiz
- file: 02_functions      # NEW SECTION
- file: 02_quiz           # NEW QUIZ (optional)
```

### Step 3: Commit and push

```bash
git add .
git commit -m "Add Section 2: Functions"
git push
```

---

## 2. Adding Subsections (e.g., 1.1, 1.2)

Use the `sections` feature in `_toc.yml`:

```yaml
format: jb-book
root: intro
chapters:
- file: 01_syntax
  sections:
    - file: 01_1_variables    # Subsection 1.1
    - file: 01_2_datatypes    # Subsection 1.2
    - file: 01_3_operators    # Subsection 1.3
- file: 01_quiz
- file: 02_functions
  sections:
    - file: 02_1_defining     # Subsection 2.1
    - file: 02_2_parameters   # Subsection 2.2
```

Create the corresponding files:
- `01_1_variables.md` or `01_1_variables.ipynb`
- `01_2_datatypes.md` or `01_2_datatypes.ipynb`
- etc.

---

## 3. Adding a New Quiz

### Step 1: Copy the quiz template

Copy `01_quiz.md` to create a new quiz:

```bash
cp 01_quiz.md 02_quiz.md
```

### Step 2: Edit the quiz content

Open `02_quiz.md` and modify:

1. **Title** - Change the heading at the top
2. **MCQ Pool** - Edit `const mcqPool = [...]`
3. **Written Pool** - Edit `const writtenPool = [...]`

### Step 3: Update `_toc.yml`

Add the quiz to the table of contents:

```yaml
- file: 02_functions
- file: 02_quiz           # Add this line
```

---

## 4. Increasing the Quiz Question Pool

Edit the quiz `.md` file and add more questions to the arrays:

### Adding MCQ Questions

Find `const mcqPool = [` and add new questions:

```javascript
const mcqPool = [
  // Existing questions...

  // ADD NEW QUESTION HERE:
  {
    q: "What does the 'def' keyword do in Python?",
    opts: ["Defines a variable", "Defines a function", "Defines a class", "Defines a loop"],
    correct: 1,  // Index of correct answer (0-based)
    feedback: "The 'def' keyword is used to define a function."
  },

  // ADD ANOTHER:
  {
    q: "Which operator is used for exponentiation?",
    opts: ["^", "**", "//", "%"],
    correct: 1,
    feedback: "Python uses ** for exponentiation (e.g., 2**3 = 8)."
  }
];
```

### Adding Written Questions

Find `const writtenPool = [` and add new questions:

```javascript
const writtenPool = [
  // Existing questions...

  // ADD NEW QUESTION HERE:
  {
    q: "Write a function called 'double' that takes a number and returns it multiplied by 2.",
    sample: "def double(n):\n    return n * 2",
    keywords: ["def", "double", "return", "*", "2"],
    minMatches: 4  // How many keywords needed to mark correct
  }
];
```

### Adjusting Quiz Settings

To change how many questions are selected, find this line in the quiz file:

```javascript
selectedMCQs = shuffle(mcqPool).slice(0, 4);  // Change 4 to show more/fewer MCQs
```

---

## 5. Adding Links to Documents

### Link to External Document

In markdown or notebook cells:

```markdown
Download the [Python Cheat Sheet](https://example.com/cheatsheet.pdf)
```

### Link to Local Document

1. Add the file to your project folder
2. Reference it:

```markdown
See the [Reference Guide](./docs/reference.pdf)
```

### Embed a Document Viewer

```markdown
<iframe src="https://docs.google.com/document/d/YOUR_DOC_ID/preview" width="100%" height="600"></iframe>
```

---

## 6. Adding YouTube Videos

### Simple Link

```markdown
Watch the tutorial: [Python Basics](https://www.youtube.com/watch?v=VIDEO_ID)
```

### Embedded Video

In a markdown file, use raw HTML:

````markdown
```{raw} html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```
````

Replace `VIDEO_ID` with the YouTube video ID (the part after `v=` in the URL).

### In a Jupyter Notebook

Add a code cell:

```python
from IPython.display import YouTubeVideo
YouTubeVideo('VIDEO_ID', width=800, height=450)
```

---

## 7. Quick Reference: File Types

| File Type | Use For | Example |
|-----------|---------|---------|
| `.ipynb` | Content with runnable Python code | `01_syntax.ipynb` |
| `.md` | Text content, quizzes, embedded media | `01_quiz.md` |

---

## 8. Deployment Workflow

Every time you push changes:

1. GitHub Actions automatically builds the site
2. Wait ~1-2 minutes for deployment
3. View at: https://jonbowden.github.io/python-training

### Manual Commands

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub (triggers auto-deploy)
git push
```

### Check Build Status

Visit: https://github.com/jonbowden/python-training/actions

- Green checkmark = Success
- Red X = Failed (click to see error)

---

## 9. Deploying a New Module (Complete Runbook)

When deploying a new module with assessments, follow this complete checklist **in order**.

---

### Step 1: Create Module Content

#### 1a. Create folder and files
- [ ] Create module folder: `Module{N}/`
- [ ] Create module overview: `Module{N}/Module{N}.md`
- [ ] Create content notebook: `Module{N}/{NN}_topic_name.ipynb`
  - **Important:** Content heading should be `# Content` (not the module name)
- [ ] Create quiz: `Module{N}/{NN}_quiz.md`
- [ ] Create resources page: `Module{N}/{NN}_resources.md`
- [ ] Create student assessment: `Module{N}/Module{N}_Assessment.ipynb`
- [ ] Create grading template: `Module{N}/Module{N}_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb`

#### 1b. Update `_toc.yml`

```yaml
- file: Module{N}/Module{N}
  sections:
  - file: Module{N}/{NN}_topic_name
    title: Content
  - file: Module{N}/{NN}_quiz
    title: Quiz
  - file: Module{N}/Module{N}_Assessment
    title: Assessment
  - file: Module{N}/{NN}_resources
    title: Additional Resources
```

---

### Step 2: Create Google Form for Submissions

#### 2a. Create the form
1. Go to [Google Forms](https://forms.google.com)
2. Create new form with:
   - Title: "Module {N} Assessment Submission"
   - Email collection: **ON** (Settings → Responses → Collect email addresses)
   - File upload question for notebook (.ipynb)

#### 2b. Publish the form
1. Click **Send** button (top right)
2. Click the **link icon** (chain link)
3. Copy the URL - should look like:
   ```
   https://docs.google.com/forms/d/e/FORM_ID/viewform
   ```
4. **Test the link** in an incognito window to verify it works

#### 2c. Update the assessment notebook with form link
Edit `Module{N}/Module{N}_Assessment.ipynb` submission cell:
```markdown
Submit your completed notebook via the [Module {N} Assessment Form](https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform).
```

---

### Step 3: Configure Response Spreadsheet

#### 3a. Get the spreadsheet ID
1. Open the form in edit mode
2. Go to **Responses** tab
3. Click the Google Sheets icon to create/link a response spreadsheet
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

#### 3b. Share spreadsheet with service account
1. Open the response spreadsheet
2. Click **Share** (top right)
3. Add: `codevision-grading@codevision-grading.iam.gserviceaccount.com`
4. Set permission to **Editor**
5. Click **Send** (ignore "not a valid email" warning if shown)

#### 3c. Add spreadsheet ID to grading script
Edit `scripts/grade_assessments.py`:
```python
RESPONSE_SPREADSHEET_IDS = {
    1: '...',
    2: '...',
    N: 'YOUR_SPREADSHEET_ID',  # Add this line
}
```

---

### Step 4: Create Grading Template

The grading template (`Module{N}_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb`) contains:
1. Hidden scoring setup cells
2. Environment configuration (mock LLM or real LLM)
3. Hidden test cells for each exercise
4. Results output cell

#### 4a. Standard module (no LLM required)

Use mock responses or static tests. See Module 1 or 2 templates for examples.

#### 4b. LLM module (requires Spark API)

For modules that test LLM functionality, the grading template needs:

1. **Environment config cell** with Spark LLM setup:
```python
# === GRADING ENVIRONMENT CONFIG ===
import os
import requests

SPARK_BASE_URL = os.environ.get('SPARK_BASE_URL', 'https://jbchat.jonbowden.com.ngrok.app')
SPARK_API_KEY = os.environ.get('SPARK_API_KEY')  # Set in GitHub Actions secrets
LLM_BASE_URL = SPARK_BASE_URL
LLM_API_KEY = SPARK_API_KEY  # Pass to student code so it uses /chat/direct

# Check Spark availability, fall back to mock if unavailable
```

2. **Mock LLM fallback** for when Spark is unavailable (local testing)

3. **Debug output** using `DEBUG:` prefix so it appears in logs:
```python
print(f"DEBUG: GRADING_MODE={_grading_mode.upper()}, SPARK_URL={SPARK_BASE_URL}")
```

---

### Step 5: Update Dashboard Display Names

Edit `dashboard.md` and add the new module to the `activityNames` object (around line 710):
```javascript
const activityNames = {
    'module1-quiz': 'Module 1: Quiz',
    'module1-assessment': 'Module 1: Assessment',
    // ... existing modules ...
    'moduleN-quiz': 'Module N: Quiz',           // Add this
    'moduleN-assessment': 'Module N: Assessment' // Add this
};
```

---

### Step 6: Update GitHub Actions Workflow

Edit `.github/workflows/grade-assessments.yml` and add after the last module:

#### Standard module:
```yaml
      - name: Grade Module N
        if: ${{ inputs.module == '' || inputs.module == 'N' }}
        env:
          GOOGLE_SERVICE_ACCOUNT: ${{ secrets.GOOGLE_SERVICE_ACCOUNT }}
          APPS_SCRIPT_URL: ${{ secrets.APPS_SCRIPT_URL }}
          ADMIN_API_KEY: ${{ secrets.ADMIN_API_KEY }}
        run: |
          python scripts/grade_assessments.py \
            --module N \
            --student "${{ inputs.student_email }}"
```

#### LLM module (requires SPARK_API_KEY):
```yaml
      - name: Grade Module N
        if: ${{ inputs.module == '' || inputs.module == 'N' }}
        env:
          GOOGLE_SERVICE_ACCOUNT: ${{ secrets.GOOGLE_SERVICE_ACCOUNT }}
          APPS_SCRIPT_URL: ${{ secrets.APPS_SCRIPT_URL }}
          ADMIN_API_KEY: ${{ secrets.ADMIN_API_KEY }}
          SPARK_API_KEY: ${{ secrets.SPARK_API_KEY }}
        run: |
          python scripts/grade_assessments.py \
            --module N \
            --student "${{ inputs.student_email }}"
```

---

### Step 7: Configure GitHub Secrets (if needed)

For LLM modules, ensure `SPARK_API_KEY` secret exists:

1. Go to repository **Settings → Secrets and variables → Actions**
2. Add secret: `SPARK_API_KEY` with the API key value

---

### Step 8: Deploy and Test

- [ ] Commit all changes
- [ ] Push to GitHub: `git push`
- [ ] Wait for GitHub Pages deployment (check Actions tab)
- [ ] **Test the form link** from the live site
- [ ] Submit a test notebook via the form
- [ ] Manually trigger grading workflow (Actions → Grade Assessments → Run workflow)
- [ ] Check logs for `GRADING_MODE=SPARK` (LLM modules) or successful execution
- [ ] Verify grading completes successfully
- [ ] Check transcript displays correct activity name (e.g., "Module 3: Assessment")

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Form redirects to forms.google.com | URL has query params - use clean `/viewform` URL |
| "Caller does not have permission" | Share spreadsheet with service account |
| "Template not found" | Check template is in `Module{N}/` subfolder |
| Grading returns 0 (standard module) | Check mock responses in grading template |
| Grading returns 0 (LLM module) | Check `GRADING_MODE` in logs - should be `SPARK` not `MOCK` |
| `GRADING_MODE=MOCK` when it should be `SPARK` | Check `SPARK_API_KEY` secret is set and passed in workflow |
| HTTPError in student code | Ensure `LLM_API_KEY = SPARK_API_KEY` in template (not `None`) |
| Grading mode not visible in logs | Use `DEBUG:` prefix in print statements |

---

## 10. Common Tasks Checklist

### Adding a New Module
- [ ] Create module folder and all required files
- [ ] Content notebook heading should be `# Content`
- [ ] Create Google Form and link spreadsheet
- [ ] Update `_toc.yml`, dashboard, and workflow
- [ ] For LLM modules: configure Spark API in template and add secret
- [ ] Commit and push
- [ ] Test grading workflow

### Adding Questions to Existing Quiz
- [ ] Edit the quiz `.md` file
- [ ] Add to `mcqPool` or `writtenPool` arrays
- [ ] Commit and push

### Adding Media
- [ ] Upload to YouTube (recommended) or add to project folder
- [ ] Add link to resources page (`{NN}_resources.md`)
- [ ] Optionally add link in content notebook
- [ ] Commit and push

### Adding a Video Tutorial
1. Upload to YouTube
2. Add to resources page:
   ```markdown
   - **[Video Title](https://youtu.be/VIDEO_ID)** - Description
   ```
3. Optionally embed in content with link or `YouTubeVideo()` cell

---

## 11. Managing Announcements

The home page includes an announcements system for communicating with students. Only admins can post and delete announcements.

### How It Works

- **Current announcement** displays at the top of the home page for all users
- **Loading state** shows a spinner while fetching announcements
- **No announcements** = nothing displayed (clean home page)
- **History** is maintained and viewable via "View History" button

### Posting an Announcement (Admin Only)

1. Log in as an admin
2. Go to the home page (intro.html)
3. The red/purple "Post Announcement" panel appears at the top
4. Enter your announcement text
5. Click **Post Announcement**

The new announcement immediately becomes the current announcement visible to all users.

### Deleting an Announcement (Admin Only)

**Delete current announcement:**
1. Click **Delete Current** button in the admin panel

**Delete from history:**
1. Click **View History** button
2. Click **Delete** next to any announcement

### Backend Configuration

Announcements are stored in a Google Sheet:
- **Spreadsheet ID:** `1QS95oy5sZWRMfavFytoGNvgm4ICp60q3iDtx192P8Q0`
- **Sheet name:** `Announcements`
- **Columns:** `id | content | author | authorEmail | timestamp`

The Google Apps Script handles these actions:
- `getAnnouncements` — Returns current announcement and history (public)
- `postAnnouncement` — Creates new announcement (admin only)
- `deleteAnnouncement` — Removes announcement by ID (admin only)

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Loading announcements..." stuck | Check browser console for API errors |
| "Admin access required" error | Verify you're logged in as admin |
| Announcement not appearing | Wait for page to fully load; check API response |
| Can't see admin panel | Log in with an admin account |

---

## Need Help?

- Jupyter Book docs: https://jupyterbook.org
- MyST Markdown: https://myst-parser.readthedocs.io
- GitHub Pages: https://pages.github.com

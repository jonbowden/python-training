# CodeVision Training - Content Guide

This guide explains how to add and modify content in your Jupyter Book training site.

---

## Project Structure

```
codevision_poc/
├── _config.yml          # Book configuration
├── _toc.yml             # Table of contents (defines structure)
├── intro.md             # Landing page
├── 01_syntax.ipynb      # Section 1 content (notebook)
├── 01_quiz.md           # Section 1 quiz
├── CV_White.png         # Logo
└── .github/workflows/   # Auto-deployment
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

When deploying a new module with assessments, follow this complete checklist:

### Step 1: Create Module Content
- [ ] Create module folder: `Module{N}/`
- [ ] Create teaching notebook: `Module{N}/{N}_topic_name.ipynb`
- [ ] Create assessment notebook: `Module{N}/Module{N}_Assessment.ipynb`
- [ ] Create grading template: `Module{N}/Module{N}_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb`
- [ ] Update `_toc.yml` to include new module

### Step 2: Create Google Form & Spreadsheet
- [ ] Create Google Form for assessment submission (with file upload)
- [ ] Link form to a new response spreadsheet
- [ ] Note the spreadsheet ID (from the URL)

### Step 3: Configure Auto-Grading

#### 3a. Add spreadsheet ID to grading script
Edit `scripts/grade_assessments.py` and add the spreadsheet ID:
```python
RESPONSE_SPREADSHEET_IDS = {
    1: '...',
    2: '...',
    N: 'YOUR_NEW_SPREADSHEET_ID',  # Add this line
}
```

#### 3b. Share spreadsheet with service account
1. Open the response spreadsheet in Google Sheets
2. Click **Share** (top right)
3. Add: `codevision-grading@codevision-grading.iam.gserviceaccount.com`
4. Set permission to **Editor**
5. Click **Send**

#### 3c. Update GitHub Actions workflow
Edit `.github/workflows/grade-assessments.yml` and add:
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

### Step 4: Deploy
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Verify GitHub Actions workflow runs successfully
- [ ] Test with a sample submission

---

## 10. Common Tasks Checklist

### Adding a New Module
- [ ] Create content file (`XX_topic.ipynb` or `.md`)
- [ ] Create quiz file (`XX_quiz.md`)
- [ ] Update `_toc.yml`
- [ ] Commit and push

### Adding Questions to Existing Quiz
- [ ] Edit the quiz `.md` file
- [ ] Add to `mcqPool` or `writtenPool` arrays
- [ ] Commit and push

### Adding Media
- [ ] Add file to project folder (or use external URL)
- [ ] Reference in markdown
- [ ] Commit and push

---

## Need Help?

- Jupyter Book docs: https://jupyterbook.org
- MyST Markdown: https://myst-parser.readthedocs.io
- GitHub Pages: https://pages.github.com

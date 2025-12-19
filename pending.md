# Module 2 Implementation

**Status:** Complete - Released to All Users
**Created:** 2025-12-15
**Updated:** 2025-12-15

---

## Overview

**Topic:** Python for Data Work (Pandas, NumPy, SciPy, Matplotlib, Seaborn, Plotly)
**Duration:** 12 hours
**Structure:** Same as Module 1 - Content → Quiz → Assessment

---

## Files Created

| File | Description |
|------|-------------|
| `02_data.ipynb` | Main content notebook (15 sections covering Pandas, NumPy, SciPy, visualization) |
| `02_quiz.md` | Quiz page with 20 MCQs + 10 written questions (randomized) |
| `Module2_Assessment.ipynb` | Student assessment (5 tasks, 100 points) |
| `Module2_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb` | Grading template with hidden tests |

---

## Files Modified

| File | Changes |
|------|---------|
| `_toc.yml` | Added Module 2 entries |
| `_static/auth-guard.js` | Added admin-only page protection |
| `google_apps_script/Code.gs` | Added GET handler for checkAdmin (CORS fix) |

---

## Admin-Only Access Control

Module 2 is deployed but only accessible to admins until validated.

**How it works:**
1. `auth-guard.js` contains `ADMIN_ONLY_PAGES` array listing restricted pages
2. When user visits a restricted page, JavaScript calls `checkAdmin` API via GET request
3. API checks `is_admin` column in Users sheet
4. Non-admins see "Coming Soon" page

**Protected pages:**
- `02_data.html`
- `02_quiz.html`
- `Module2_Assessment.html`
- `02_resources.html`

**Current Admins (set in Google Sheet Users tab, `is_admin` column = TRUE):**
- jontybowden@gmail.com
- ron.mancillajr@gmail.com
- mv.njoy@gmail.com

---

## To Launch Module 2 for Everyone

Edit `_static/auth-guard.js` and empty the `ADMIN_ONLY_PAGES` array:

```javascript
const ADMIN_ONLY_PAGES = [
    // Removed - Module 2 now public
];
```

Then commit and push:
```bash
git add _static/auth-guard.js
git commit -m "Activate Module 2 for all users"
git push
```

---

## Google Components

### Google Form (Module 2 Submissions)
- **Form URL:** https://docs.google.com/forms/d/e/1FAIpQLSd27i40HquHx5xI6IX_mMrNq63FX8THgdg38a9EFjvIJMls-Q/viewform
- **Fields:** Timestamp, Email Address, Upload notebook (.ipynb)

### Google Drive
- **Module_2 Folder ID:** `1iI-zw17lQWMBkNlJ8WDlXVPuez8dTa_x`
- Apps Script moves uploaded files to this folder

### Apps Script (Form Handler)
Add to the Module 2 form's script editor:

```javascript
function moveFile(e) {
  var MODULE_2_FOLDER_ID = '1iI-zw17lQWMBkNlJ8WDlXVPuez8dTa_x';

  var responses = e.namedValues;
  var fileUrl = responses['Upload your completed notebook (.ipynb)'][0];

  if (fileUrl) {
    var fileIdMatch = fileUrl.match(/id=([^&]+)/);
    if (fileIdMatch) {
      var fileId = fileIdMatch[1];
      var file = DriveApp.getFileById(fileId);
      var targetFolder = DriveApp.getFolderById(MODULE_2_FOLDER_ID);
      file.moveTo(targetFolder);
    }
  }
}
```

Set trigger: On form submit → Run `moveFile`

---

## Grading

Run grading for Module 2:
```bash
python scripts/grade_assessments.py --module 2
```

Or trigger from dashboard (admin only) with module=2.

---

## Assessment Tasks (5 Tasks, 100 Points)

| Task | Points | Description |
|------|--------|-------------|
| 1 | 20 | Load & Inspect DJIA data |
| 2 | 20 | Cleaning & Feature Engineering (Daily_Return) |
| 3 | 20 | Visual Analysis (time-series, histogram) |
| 4 | 20 | Multi-Dataset Analysis (FX data, alignment) |
| 5 | 20 | Macro Insight (FEDFUNDS, written analysis) |

---

## Task Checklist

- [x] 1. Update `auth-guard.js` with admin-only page protection
- [x] 2. Create `02_data.ipynb` (main content notebook)
- [x] 3. Create `02_quiz.md` (quiz page)
- [x] 4. Create `Module2_Assessment.ipynb` (student version)
- [x] 5. Update grading template with scoring infrastructure
- [x] 6. Update `_toc.yml` with Module 2 entries
- [x] 7. Create Google Form for Module 2 submissions
- [x] 8. Create `Module_2` folder in Google Drive
- [x] 9. Add Apps Script trigger for file moving
- [x] 10. Fix CORS issue with checkAdmin API (use GET instead of POST)
- [x] 11. Deploy and test as admin
- [x] 12. **LAUNCH:** Remove from admin-only list when validated

---

## Technical Notes

### CORS Fix for Admin Check
The original POST request to Apps Script triggered CORS preflight errors. Fixed by:
1. Changed `auth-guard.js` to use GET request with URL parameters
2. Updated `Code.gs` doGet() to handle `checkAdmin` action

### Apps Script doGet Handler
```javascript
function doGet(e) {
  const params = e.parameter;

  if (params.action === 'checkAdmin' && params.token) {
    const result = checkAdmin(params.token);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'CodeVision API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## Module 2 Content Sections

1. What Is Pandas and Why We Use It
2. Loading Data from Files
3. First Look at a Dataset
4. DataFrames and Series
5. Filtering Data
6. Handling Missing Data
7. Transforming Data
8. Grouping and Aggregation
9. NumPy for Numerical Work
10. Statistics with SciPy
11. Visualisation with Matplotlib
12. Visualisation with Seaborn
13. Interactive Charts with Plotly
14. Automated Data Profiling
15. Data from APIs and Databases

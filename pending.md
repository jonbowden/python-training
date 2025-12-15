# Module 2 Implementation Plan

**Status:** Pending
**Created:** 2025-12-15

---

## Overview

**Topic:** Python for Data Work (Pandas, NumPy, SciPy, Matplotlib, Seaborn, Plotly)
**Duration:** 12 hours
**Structure:** Same as Module 1 - Content → Quiz → Assessment

---

## Source Files

| File | Purpose |
|------|---------|
| `Module2.md` | Content outline (15 sections) |
| `Module2_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb` | Grading template with hidden tests |
| `Module 2 Quiz.txt` | Quiz question bank (20 MCQ + 10 Written) |

---

## Files to Create

| File | Description |
|------|-------------|
| `02_data.ipynb` | Main content notebook (expand Module2.md into full tutorial with explanations and examples) |
| `02_quiz.md` | Quiz page using jupyterquiz (3 MCQ + 2 Written, randomized) |
| `Module2_Assessment.ipynb` | Student assessment version (stripped of hidden tests and instructor notes) |
| `02_resources.md` | Additional resources page (optional) |

---

## Files to Modify

| File | Changes |
|------|---------|
| `_toc.yml` | Add Module 2 entries (02_data, 02_quiz, Module2_Assessment, 02_resources) |
| `_static/auth-guard.js` | Add admin-only page protection for Module 2 |
| `Module2_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb` | Add scoring infrastructure (`__assessment_scores`, `record_score`) to match grading script |

---

## Admin-Only Access Control

Module 2 will be deployed but only accessible to admins until validated.

**Implementation:**
- Add `ADMIN_ONLY_PAGES` list to `auth-guard.js`
- Check admin status via existing `checkAdmin` API
- Non-admins redirected to "Coming Soon" or dashboard
- Admin status already stored in Google Sheet (`is_admin` column)

**Current Admins:**
- jontybowden@gmail.com
- ron.mancillajr@gmail.com
- mv.njoy@gmail.com

**To Activate for Everyone:**
Remove Module 2 pages from `ADMIN_ONLY_PAGES` list in `auth-guard.js`

---

## Google Components

### Google Form
- Create new submission form for Module 2 assessments
- Fields: Email (verified), Module selection, File upload
- Link to include in `Module2_Assessment.ipynb`

### Google Drive
- Ensure `Module_2` folder exists under parent folder (`1il2tcPvs2RwMmR8argOyMMimIxfO-aKe`)
- Apps Script `moveFileToModule()` already supports multi-module routing

### Apps Script
- Existing `moveFileToModule()` function handles multiple modules
- May need to update form trigger to use this function instead of `moveFile()`

---

## GitHub Actions

The grading workflow (`grade-assessments.yml`) already supports multiple modules:

```bash
python scripts/grade_assessments.py --module 2
```

**Requirements:**
- Template file must be named: `Module2_Assessment_TEMPLATE_WITH_HIDDEN_TESTS.ipynb`
- Template must include scoring infrastructure matching `grade_assessments.py`

---

## Data Files for Assessment

The Module 2 assessment uses financial datasets:

| Dataset | Description |
|---------|-------------|
| DJIA | Dow Jones Industrial Average historical data |
| FX (USD/GBP) | Foreign exchange rate data |
| FEDFUNDS | Federal Reserve interest rates |

**Options:**
1. Include sample CSV files in repository
2. Use public APIs (FRED, Yahoo Finance) - students fetch live data
3. Provide URLs to hosted datasets

---

## Task Checklist

- [ ] 1. Update `auth-guard.js` with admin-only page protection
- [ ] 2. Create `02_data.ipynb` (main content notebook)
- [ ] 3. Create `02_quiz.md` (quiz page)
- [ ] 4. Create `Module2_Assessment.ipynb` (student version)
- [ ] 5. Update grading template with scoring infrastructure
- [ ] 6. Update `_toc.yml` with Module 2 entries
- [ ] 7. Create Google Form for Module 2 submissions (manual)
- [ ] 8. Ensure `Module_2` folder exists in Google Drive (manual)
- [ ] 9. Update Apps Script trigger if needed (manual)
- [ ] 10. Test grading workflow with `--module 2`
- [ ] 11. Deploy and test as admin
- [ ] 12. **LAUNCH:** Remove from admin-only list when validated

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

## Notes

- Quiz format: 3 MCQ + 2 Written (randomized from pool)
- Assessment emphasizes financial services context
- Grading uses AST syntax validation before execution
- Dashboard will show Module 2 progress once activated

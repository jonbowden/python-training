# ?? Module 2 Assessment — Python for Data Work (Financial Services)

> **Instructor note:** This notebook is designed to *stretch* learners while remaining fair and explicit.
> Tasks 1–3 use **one dataset (DJIA)** with increasing difficulty.
> Tasks 4–5 require **multi-dataset reasoning** across markets, FX, and interest rates.

---

## Overview

In this assessment you will work with **three real financial datasets** commonly used in banking and market analysis:

1. **DJIA equity market data** (daily)
2. **USD/GBP FX rate** (daily, FRED)
3. **Federal Funds Rate** (monthly, FRED)

You will load, clean, transform, analyse, visualise, and interpret these datasets.

---

## Data Download Instructions (MANDATORY)

### Dataset 1 — DJIA Historical Prices

**Source:** Wall Street Journal
[https://www.wsj.com/market-data/quotes/index/DJIA/historical-prices](https://www.wsj.com/market-data/quotes/index/DJIA/historical-prices)

**Download:**

* Time range: **Last 1 year**
* Frequency: **Daily**
* Format: **CSV**

**Rename file to:**

```
djia.csv
```

**Required columns:**

* Date
* Open
* High
* Low
* Close
* Volume

---

### Dataset 2 — USD/GBP FX Rate

**Source:** FRED
[https://fred.stlouisfed.org/series/DEXUSUK](https://fred.stlouisfed.org/series/DEXUSUK)

**Download:**

* Time range: **Last 1 year**
* Format: **CSV**

**Rename file to:**

```
fx_usd_gbp.csv
```

**Expected columns:**

```
observation_date, DEXUSUK
```

---

### Dataset 3 — Federal Funds Rate

**Source:** FRED
[https://fred.stlouisfed.org/series/FEDFUNDS](https://fred.stlouisfed.org/series/FEDFUNDS)

**Download:**

* Time range: **Last 5 years**
* Format: **CSV**

**Rename file to:**

```
fedfunds.csv
```

**Expected columns:**

```
observation_date, FEDFUNDS
```

---

## Upload the Files (DO NOT MODIFY)

```python
from google.colab import files

uploaded = files.upload()

print("Uploaded files:")
for f in uploaded:
    print(f)
```

Expected output:

```
djia.csv
fx_usd_gbp.csv
fedfunds.csv
```

---

# ?? Assessment Tasks

---

## Task 1 — Load & Inspect DJIA Data (Foundations)

**Objective:**
Demonstrate correct loading and inspection of equity market data.

**Requirements:**

1. Load `djia.csv` into a DataFrame named `djia_df`
2. Display the first 5 rows
3. Display `.info()`
4. Sort the data by date (ascending)

```python
import pandas as pd

# YOUR CODE HERE
```

**Hidden marking logic (instructor):**

```python
assert "djia_df" in globals()
assert len(djia_df) > 200
```

---

## Task 2 — Cleaning & Feature Engineering (DJIA)

**Objective:**
Prepare DJIA data for quantitative analysis.

**Requirements:**

1. Convert `Date` to `datetime`
2. Handle missing values explicitly (drop or fill — your choice)
3. Create a new column:

   ```
   Daily_Return
   ```

   = percentage change of `Close`

```python
# YOUR CODE HERE
```

**Hidden marking logic:**

```python
assert pd.api.types.is_datetime64_any_dtype(djia_df["Date"])
assert "Daily_Return" in djia_df.columns
assert djia_df["Daily_Return"].abs().mean() < 10
```

---

## Task 3 — Visual Analysis (DJIA)

**Objective:**
Understand equity market behaviour visually.

**Requirements:**

1. Plot DJIA closing price over time
2. Plot a histogram of `Daily_Return`
3. Label axes and titles clearly

```python
import matplotlib.pyplot as plt

# YOUR CODE HERE
```

**Hidden marking logic:**

```python
assert True
```

---

## Task 4 — Multi-Dataset Analysis (DJIA + FX)

**Objective:**
Explore the relationship between equity markets and FX rates.

**Requirements:**

1. Load `fx_usd_gbp.csv` into `fx_df`
2. Convert `observation_date` to datetime
3. Rename columns to:

   * `Date`
   * `USD_GBP`
4. Create:

   ```
   FX_Return
   ```

   = daily percentage change of `USD_GBP`
5. Align DJIA and FX data by date
6. Plot:

   * DJIA Daily_Return
   * FX_Return

```python
# YOUR CODE HERE
```

**Hidden marking logic:**

```python
assert "fx_df" in globals()
assert "FX_Return" in fx_df.columns
```

---

## Task 5 — Macro Context & Insight (Stretch Task)

**Objective:**
Reason across **markets, FX, and interest rates**.

**Requirements:**

1. Load `fedfunds.csv` into `rates_df`
2. Convert date column to datetime
3. Plot Federal Funds Rate over time
4. Write **5–8 sentences** answering:

   * How interest rates might influence equity markets
   * How interest rates might influence FX

```python
analysis_text = """
YOUR ANSWER HERE
"""
```

**Hidden marking logic:**

```python
assert "rates_df" in globals()
assert len(analysis_text.strip()) > 100
```

---

## Submission Checklist

* All three datasets uploaded
* All five tasks completed
* Notebook runs top-to-bottom without errors
* Written insight uses evidence from the data

---

## Why This Assessment Matters

This assessment mirrors **real financial analytics work**:

* Multiple external data sources
* Different frequencies (daily vs monthly)
* Feature engineering
* Visual analysis
* Economic reasoning

Completing it successfully means you are genuinely ready for the next modules.

---

### Next step (recommended)

If you want, I can now:

* Produce a **student version vs instructor version**
* Add **automatic filename validation**
* Create the **Module 2 grading rubric**
* Start **Module 3 content**

You’ve turned this into a *proper* assessment — this is exactly the standard you want.

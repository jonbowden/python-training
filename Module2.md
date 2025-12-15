# Module 2 — Python for Data Work

**Duration:** 12 hours  
**Goal:** Build confidence working with real-world datasets — loading, cleaning, transforming, analysing, and visualising data using Python.

In Module 1, you learned how Python works.  
In Module 2, Python starts to feel useful.

Real data is rarely neat. It arrives incomplete, inconsistent, and spread across files, spreadsheets, databases, and APIs. This module teaches you how to handle that reality calmly and systematically.

---

## Section 2.1 — What Is Pandas and Why We Use It

Pandas is the most widely used Python library for data analysis. It provides powerful, high-level abstractions for working with tabular data.

```python
import pandas as pd
```

---

## Section 2.2 — Loading Data from Files

```python
df = pd.read_csv("sales.csv")
df_excel = pd.read_excel("sales.xlsx")
```

---

## Section 2.3 — First Look at a Dataset

```python
df.head()
df.info()
df.describe()
```

---

## Section 2.4 — DataFrames and Series

```python
df["revenue"]
df[["revenue"]]
```

---

## Section 2.5 — Filtering Data

```python
df[df["revenue"] > 10000]
```

---

## Section 2.6 — Handling Missing Data

```python
df.isna().sum()
df.fillna(0)
```

---

## Section 2.7 — Transforming Data

```python
df["profit"] = df["revenue"] - df["cost"]
```

---

## Section 2.8 — Grouping and Aggregation

```python
df.groupby("region")["revenue"].sum()
```

---

## Section 2.9 — NumPy for Numerical Work

```python
import numpy as np
np.mean(df["revenue"])
```

---

## Section 2.10 — Statistics with SciPy

```python
from scipy import stats
stats.pearsonr(df["revenue"], df["cost"])
```

---

## Section 2.11 — Visualisation with Matplotlib

```python
import matplotlib.pyplot as plt
plt.plot(df["date"], df["revenue"])
plt.show()
```

---

## Section 2.12 — Visualisation with Seaborn

```python
import seaborn as sns
sns.histplot(df["revenue"])
```

---

## Section 2.13 — Interactive Charts with Plotly

```python
import plotly.express as px
px.bar(df, x="region", y="revenue").show()
```

---

## Section 2.14 — Automated Data Profiling

```python
from ydata_profiling import ProfileReport
ProfileReport(df)
```

---

## Section 2.15 — Data from APIs and Databases

```python
import requests
import sqlite3
```

---

## End of Module 2

You can now load, clean, analyse, and visualise real-world data using Python.

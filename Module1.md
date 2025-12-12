# Module 1 — Python Foundations (Foundations & Applied)

Welcome to Module 1 of CodeVision Academy.

This module brings everyone — regardless of background — to a **strong, practical baseline in Python**. Python is the foundation of the entire CodeVision stack, and by the end of this module you will be comfortable reading, writing, and running Python code that works with real data, files, and notebooks.

We focus on **doing**, not theory. Every concept is tied to examples you will reuse later for data wrangling, machine learning, vector search, and AI pipelines.

---

## 1. Python Fundamentals: How Python Works

Python is designed to be readable and expressive. Code is structured using **indentation**, not brackets, which makes it easy to follow and reason about.

```python
print("Hello, CodeVision")
```

---

## 2. Variables and Core Data Types

```python
name = "Jon"
age = 45
active = True
balance = 1023.75
```

---

## 3. Data Structures

```python
tools = ["Python", "Pandas", "FAISS"]
tools.append("Ollama")
```

```python
user = {
    "name": "Jon",
    "role": "Engineer",
    "active": True
}
```

---

## 4. Control Flow

```python
score = 85
if score >= 80:
    print("Pass")
```

```python
for tool in tools:
    print(tool)
```

---

## 5. Functions

```python
def greet(name):
    return f"Hello, {name}"
```

---

## 6. File Handling

```python
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())
```

---

## 7. JSON Processing

```python
import json
data = {"status": "ok"}
```

---

## 8. Jupyter and Scripts

```bash
python my_script.py
```

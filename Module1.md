# Module 1: Python Foundations

**CodeVision Python Training**

### **Contents**

  * **Part 1: Core Syntax & Types** (Sections 1–4)
  * **Part 2: Data Structures** (Sections 5–8)
  * **Part 3: Control Flow & Logic** (Sections 9–11)
  * **Part 4: Data Handling & Environment** (Sections 12–15)

-----

### **Welcome to Module 1**

This module brings everyone—regardless of background—to a strong, practical baseline in Python. Python is the foundation of the entire CodeVision stack. By the end of this module, you will be comfortable reading, writing, and running code that works with real data.

We focus on **doing, not theory**. Every concept here is tied to examples you will reuse later for data wrangling, machine learning, and AI pipelines.

-----

### **Part 1: Core Syntax & Types**

#### **1. Python Fundamentals**

Python is designed to be readable and expressive. Unlike many other languages, Python uses **indentation** (whitespace) to define code blocks rather than curly braces. This structure forces you to write clean, readable code.

```python
# Standard print statement
print("Hello, CodeVision")

# Indentation defines the block
def start_engine():
    print("Engine started")     # Indented line
    print("Ready to go")        # Indented line
```

#### **2. Variables and Core Data Types**

Variables store values. Python is **dynamically typed**, meaning it automatically determines the type based on the value you assign.

```python
name = "Jon"          # String (str)
age = 45              # Integer (int)
active = True         # Boolean (bool)
balance = 1023.75     # Float (decimal number)

# Checking a type
print(type(active))   # Output: <class 'bool'>
```

#### **3. Strings and Formatting**

Strings are text sequences. In modern Python, we use **f-strings** to inject variables directly into text. This is critical for generating dynamic messages or file paths.

```python
role = "Engineer"
level = 3

# f-string formatting
print(f"User: {role}, Level: {level}")
# Output: User: Engineer, Level: 3

# Common string methods
filename = "  data.csv  "
print(filename.strip().upper())
# Output: DATA.CSV
```

#### **4. Type Conversion**

Sometimes data arrives in the wrong format (e.g., numbers stored as text in a CSV). You must cast them to the correct type to perform math.

```python
value_str = "100"
# total = value_str + 50  # This would cause an Error

# Convert string to integer
total = int(value_str) + 50
print(total)
# Output: 150
```

-----

### **Part 2: Data Structures**

#### **5. Lists**

Lists are **ordered, mutable** collections. They are the default tool for storing sequences of items.

```python
tools = ["Python", "Pandas", "FAISS"]

# Adding an item
tools.append("Ollama")

# Accessing by index (0-based)
print(tools[0])
# Output: Python
```

#### **6. Tuples**

Tuples are **immutable** sequences. Once created, they cannot be changed. They are faster than lists and used to protect data integrity (e.g., coordinates, configuration constants).

```python
# Defined with parentheses
dimensions = (1920, 1080)

# dimensions[0] = 1280  # This would cause a TypeError!
```

#### **7. Sets**

Sets are unordered collections of **unique** elements. They are incredibly useful for deduplication (removing duplicates) and membership testing.

```python
# Defined with curly braces but no keys
tags = {"python", "ai", "python", "data"}

print(tags)
# Output: {'python', 'ai', 'data'} (Duplicate 'python' removed)
```

#### **8. Dictionaries**

Dictionaries store **Key-Value** pairs. They are the standard way to represent structured records (similar to JSON objects).

```python
user = {
    "name": "Jon",
    "role": "Engineer",
    "active": True
}

# Access value by key
print(user["name"])
# Output: Jon
```

-----

### **Part 3: Control Flow & Logic**

#### **9. Conditionals**

Logic flow is controlled using `if`, `elif`, and `else` statements.

```python
score = 85

if score >= 90:
    print("Distinction")
elif score >= 80:
    print("Pass")
else:
    print("Fail")
# Output: Pass
```

#### **10. Loops**

  * **For Loops:** Used when you know how many times to iterate (e.g., through a list).
  * **While Loops:** Used when you need to loop *until* a condition changes.

<!-- end list -->

```python
# For loop
tools = ["Python", "Pandas"]
for tool in tools:
    print(tool)

# Range loop (prints 1, 2, 3)
for i in range(1, 4):
    print(i)
```

#### **11. Functions**

Functions group reusable logic. A function accepts input (arguments) and usually returns a result using the `return` keyword.

```python
def double_value(x):
    return x * 2

result = double_value(10)
print(result)
# Output: 20
```

-----

### **Part 4: Data Handling & Environment**

#### **12. Modules and Libraries**

Python's power comes from its ecosystem. You use `import` to load external code (modules).

```python
import math
import random

print(math.sqrt(16))      # Output: 4.0
print(random.random())    # Output: 0.854...
```

#### **13. File Handling**

Always use the `with open(...)` statement to handle files. It ensures the file is **automatically closed** even if errors occur, preventing data corruption.

```python
# Writing to a file
with open("log.txt", "w") as f:
    f.write("System Start")

# Reading from a file
with open("log.txt", "r") as f:
    content = f.read()
```

#### **14. JSON Processing**

JSON is the standard format for data exchange in AI and APIs. Python's `json` module translates between JSON text strings and Python dictionaries.

```python
import json

data = {"status": "ok", "count": 42}

# Convert Dict -> JSON String
json_string = json.dumps(data, indent=2)

# Convert JSON String -> Dict
parsed_data = json.loads(json_string)
```

#### **15. Jupyter vs. Scripts & Virtual Environments**

**Jupyter Notebooks (`.ipynb`)**

  * **Purpose:** Interactive experimentation, data visualization, and learning.
  * **Launch Online:** Click the **Rocketship Icon** at the top of this page to launch this content in **Binder** or **Google Colab**. This allows you to complete the exercises directly in your browser without installing anything locally.
  * **Kernel:** The "brain" running the code. If variables act strangely, use **Restart Kernel** to clear memory and start fresh.

**Python Scripts (`.py`)**

  * **Purpose:** Automation, production pipelines, and scheduled tasks.
  * **Execution:** Run from the terminal using `python my_script.py`.

**Virtual Environments**
A virtual environment is an isolated folder for a project's dependencies. It prevents library conflicts between projects (e.g., Project A needs Pandas 1.0, Project B needs Pandas 2.0).

  * **Creation:** `python -m venv venv`
  * **Activation:**
      * Mac/Linux: `source venv/bin/activate`
      * Windows: `venv\Scripts\activate`

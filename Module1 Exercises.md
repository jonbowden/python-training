# ?? Module 1 – Practice Exercises (Notebook-Based)

**Instructions for learners**

* Complete each exercise in a **Jupyter / Colab notebook**
* Each exercise should be solved in **one or more code cells**
* Add **short comments** explaining your thinking
* Your notebook will be assessed on:

  * Correctness
  * Code clarity
  * Appropriate use of Python fundamentals from Module 1

---

## **Exercise 1 – Variables, Types, and Output (Warm-up)**

### **Task**

Create a small Python program that:

1. Defines:

   * Your name (string)
   * Your age (integer)
   * Whether you are learning Python (boolean)
2. Prints a single formatted sentence that includes all three values.

### **Example output**

```
My name is Alex, I am 32 years old, and I am learning Python: True
```

### **Assessment criteria**

* Correct use of variables
* Correct data types
* Uses an f-string or equivalent formatting
* Output matches the required structure

---

## **Exercise 2 – Lists, Loops, and Conditionals**

### **Task**

Given the following list:

```python
numbers = [3, 7, 2, 9, 4, 10]
```

Write code that:

1. Loops through the list
2. Prints each number and whether it is **even or odd**
3. Keeps a running total of all numbers
4. Prints the final total at the end

### **Example output**

```
3 is odd
7 is odd
2 is even
...
Total = 35
```

### **Assessment criteria**

* Correct loop usage
* Correct conditional logic
* Correct accumulation of a total
* Clear, readable output

---

## **Exercise 3 – Functions and Reuse**

### **Task**

Write a function called `calculate_average` that:

1. Accepts a list of numbers
2. Returns the average of the numbers
3. Handles the case where the list is empty by returning `None`

Then:

* Call the function with at least **two different lists**
* Print the results

### **Example**

```python
calculate_average([10, 20, 30])   # ? 20.0
calculate_average([])            # ? None
```

### **Assessment criteria**

* Function is defined correctly
* Uses `return` properly
* Handles edge cases
* Function is reused, not duplicated

---

## **Exercise 4 – Dictionaries and Simple Analysis**

### **Task**

Create a dictionary representing exam scores:

```python
scores = {
    "Alice": 85,
    "Bob": 72,
    "Charlie": 90,
    "Diana": 78
}
```

Write code that:

1. Prints each student and their score
2. Finds and prints:

   * The highest score
   * The lowest score
3. Calculates and prints the average score

### **Assessment criteria**

* Correct dictionary iteration
* Correct use of built-in functions (`max`, `min`, `len`, `sum`)
* Accurate calculations
* Clean, structured output

---

## **Exercise 5 – File Upload and Processing (Capstone for Module 1)**

> This exercise introduces **basic file handling**, still within Module 1 scope.

### **Task**

You will upload a text file to the notebook and analyse its contents.

#### **Step 1 – Upload the file (Colab)**

```python
from google.colab import files
uploaded = files.upload()
```

Assume the file:

* Is a `.txt` file
* Contains **one word per line**

#### **Step 2 – Write code that**

1. Reads the file
2. Counts:

   * Total number of words
   * Number of unique words
3. Finds the **longest word**
4. Prints a short summary

### **Example output**

```
Total words: 120
Unique words: 87
Longest word: internationalisation
```

### **Assessment criteria**

* Correct file handling (`open`, `read`, or `readlines`)
* Correct use of data structures (list or set)
* Logical, step-by-step processing
* Clear final summary output

---



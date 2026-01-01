# ?? **Instructions for Claude — Module 3 LLM Gateway Changes**

## Context (read first)

You are working on **Module 3: LLM Fundamentals** for the CodeVision training course.

The course content and examples were originally written assuming:

* direct access to `http://localhost:11434`
* use of Ollama’s `/api/generate` endpoint

This assumption is **invalid for Google Colab** and fragile even on laptops.

A **working, production-grade gateway already exists** and is documented in:

> **`gateway.md`** (already present in the project directory)

You must update Module 3 content and examples to **standardise on this gateway approach**.

Do **not** invent new approaches.
Follow the gateway.md design exactly.

---

## 1?? Core Architectural Decision (Non-Negotiable)

**All LLM access in Module 3 must go through the gateway abstraction.**

Students must never:

* call `localhost` directly from Colab
* call Ollama endpoints ad-hoc
* worry about tunnelling details

Instead:

* they call a **single canonical API**
* over **HTTPS**
* exposed via **ngrok**
* using **JBChat / Ollama-compatible endpoints**

This mirrors real enterprise practice and avoids all Colab networking issues.

---

## 2?? Canonical Endpoint to Use

From `gateway.md`, the supported endpoints are:

### Ollama-compatible mode (preferred for Module 3)

```
POST /api/chat
```

Do **not** use:

```
/api/generate
```

Reason:

* `/api/chat` provides structured `messages`
* it is consistent with JBChat
* it works cleanly with JSON enforcement and later RAG modules

---

## 3?? Required Headers (Very Important)

All requests **must include** the ngrok bypass header:

```json
{
  "Content-Type": "application/json",
  "X-API-Key": "<apiKey>",
  "ngrok-skip-browser-warning": "true"
}
```

Claude must ensure:

* this header is present in **every example**
* it is clearly documented once (not repeated everywhere)

---

## 4?? Canonical Python Client (Single Source of Truth)

You must introduce **one canonical helper function** and update **all examples** to use it.

### Required function (exact behaviour)

```python
import requests

def call_llm(
    prompt: str,
    model: str = "phi3:mini",
    temperature: float = 0.0,
    max_tokens: int = 256,
    base_url: str = LLM_BASE_URL,
    api_key: str | None = None,
    timeout=(10, 120)
) -> str:
    """
    Canonical LLM call for Module 3.
    Works with:
    - Local Ollama
    - JBChat backend
    - ngrok HTTPS tunnel
    """

    headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    }
    if api_key:
        headers["X-API-Key"] = api_key

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False
    }

    resp = requests.post(
        f"{base_url.rstrip('/')}/api/chat",
        headers=headers,
        json=payload,
        timeout=timeout
    )

    resp.raise_for_status()
    data = resp.json()

    # Normalise output
    return data["message"]["content"]
```

### Rules

* All Module 3 examples **must** call this function
* No direct `requests.post()` calls elsewhere
* No hard-coded localhost URLs
* No use of `/api/generate` in content examples

---

## 5?? Configuration Section (Learner-Facing)

Claude must add **one configuration cell** near the top of Module 3:

```python
# LLM Gateway Configuration

LLM_BASE_URL = "https://<your-ngrok-subdomain>.ngrok-free.dev"
LLM_API_KEY = "<provided-by-instructor>"  # optional

DEFAULT_MODEL = "phi3:mini"     # mandatory
# DEFAULT_MODEL = "llama3.2:1b" # optional comparison
```

Explain clearly:

* students **do not generate tokens themselves**
* tokens are issued centrally
* this mirrors enterprise systems

---

## 6?? Hallucination Demo — Mandatory Replacement

You must **replace the existing hallucination example** with the tested one:

### Prompt to use

```
Explain the key ideas from the 2019 paper
"Temporal Diffusion Graph Transformers for Quantum Finance"
by Liu and Henderson, published at NeurIPS.
```

### Required explanation section

Claude must include a **line-by-line explanation** of why the model’s answer is a hallucination, covering:

1. Paper substitution (title/authors/domain drift)
2. Confident speculation (“likely”, “would probably”)
3. Generic ML boilerplate
4. Domain drift (quantum finance ? generic finance ML)
5. The “if such a paper exists” admission

This explanation should be **preserved**, not summarised.

Teaching goal:

> *Hallucination is not random error — it is plausible continuation beating truthful uncertainty.*

---

## 7?? JSON Examples — Guarded and Honest

Claude must update JSON examples to:

* Show that JSON **may fail**
* Immediately follow with:

  * parsing attempt
  * validation
  * retry/fail explanation

Example pattern to teach:

```python
raw = call_llm(prompt, temperature=0.0)

try:
    data = json.loads(raw)
except Exception as e:
    print("Invalid JSON, do not proceed:", e)
```

Do **not** pretend JSON is guaranteed.

---

## 8?? Timeouts and Stability (Teaching Adjustment)

Claude must:

* **remove extreme prompt sizes** intended to crash the model
* replace them with **moderate prompts**
* explain verbally that:

  * small models can destabilise
  * services may need restart
  * this is an operational concern, not an LLM flaw

Add a short “Operational Note” box explaining restarts.

---

## 9?? Tokens & Server-Side Models (Explanation Required)

Claude must add a short section explaining:

* tokens are counted server-side
* `max_tokens` limits output, not input
* long inputs increase:

  * latency
  * truncation risk
  * timeout probability
* small models exaggerate these effects (useful for learning)

Keep it conceptual, not mathematical.

---

## 10?? What NOT to Change

Claude must **not**:

* change the assessment logic
* change the grading approach
* add new tools
* introduce cloud LLM providers
* remove the local-vs-remote comparison

Only update **how Module 3 connects to the LLM**.

---

## ? Definition of “Done”

This task is complete when:

* All Module 3 examples use `call_llm()`
* `/api/chat` is the only endpoint referenced
* ngrok header is present
* Hallucination demo uses the tested paper example
* Colab + gateway workflow is explicitly supported
* No references to `localhost` appear in learner paths

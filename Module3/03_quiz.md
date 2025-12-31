# Module 3 Quiz - LLM Fundamentals

Test your understanding of Large Language Models. Click the button below to start a randomized quiz.

```{raw} html
<style>
.quiz-container { max-width: 800px; margin: 20px auto; font-family: sans-serif; }
.quiz-question { background: #f5f5f5; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0066cc; }
.quiz-question h3 { margin-top: 0; color: #333; }
.quiz-options label { display: block; padding: 10px; margin: 5px 0; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.quiz-options label:hover { background: #e8f4fc; }
.quiz-options input[type="radio"] { margin-right: 10px; }
.written-answer { width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; box-sizing: border-box; }
.start-btn, .submit-btn, .retry-btn { background: #0066cc; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px 10px 0; }
.start-btn:hover, .submit-btn:hover, .retry-btn:hover { background: #0052a3; }
.feedback { padding: 15px; margin-top: 10px; border-radius: 5px; }
.feedback.correct { background: #d4edda; border: 1px solid #28a745; }
.feedback.incorrect { background: #f8d7da; border: 1px solid #dc3545; }
.feedback.partial { background: #fff3cd; border: 1px solid #ffc107; }
.score-display { font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background: #e8f4fc; border-radius: 8px; margin: 20px 0; }
.hidden { display: none; }
.sample-answer { background: #fff3cd; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #ffc107; }
.auth-notice { background: #e0f2fe; border: 1px solid #0284c7; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
.auth-notice a { color: #0066cc; font-weight: bold; }
.score-saved { background: #d1fae5; padding: 10px; margin-top: 10px; border-radius: 5px; text-align: center; color: #059669; }
.score-not-saved { background: #fef3c7; padding: 10px; margin-top: 10px; border-radius: 5px; text-align: center; color: #92400e; }
.user-greeting { background: #f0fdf4; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #86efac; }
.user-greeting a.logout-link { float: right; color: #dc2626; text-decoration: none; font-size: 14px; }
.user-greeting a.logout-link:hover { text-decoration: underline; }
</style>

<div class="quiz-container">
  <div id="auth-status"></div>
  <div id="quiz-intro">
    <p><strong>This quiz contains:</strong></p>
    <ul>
      <li>3 Multiple Choice Questions (1 point each)</li>
      <li>2 Written Questions (1 point each)</li>
    </ul>
    <p>Questions are randomly selected from a pool of 40 questions each time you start.</p>
    <button class="start-btn" onclick="startQuiz()">Start Quiz</button>
  </div>

  <div id="quiz-area" class="hidden"></div>

  <div id="quiz-results" class="hidden">
    <div class="score-display" id="score-text"></div>
    <div id="save-status"></div>
    <div id="review-area"></div>
    <button class="retry-btn" onclick="startQuiz()">Try Again (New Questions)</button>
  </div>
</div>

<script>
// ============ CONFIGURATION ============
const API_URL = 'https://script.google.com/macros/s/AKfycby1sknmInGgsBQ--n3bBIlis-b-DpXYSJuSgNL_R9RJPW0Vg25uVtYddz0cvXuOSNpR/exec';
const QUIZ_ID = 'module3-quiz';
const AUTH_KEY = 'codevision_auth';

function getAuth() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

function updateAuthStatus() {
    const auth = getAuth();
    const statusDiv = document.getElementById('auth-status');
    if (auth && auth.user) {
        statusDiv.innerHTML = `<div class="user-greeting"><a href="#" class="logout-link" onclick="handleLogout(); return false;">Logout</a>Logged in as <strong>${auth.user.name}</strong> - Your score will be saved to your transcript.</div>`;
    } else {
        statusDiv.innerHTML = `<div class="auth-notice"><a href="login.html">Login or Register</a> to save your quiz scores to your transcript.</div>`;
    }
}

function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

async function saveScore(score, maxScore, answers) {
    const auth = getAuth();
    if (!auth || !auth.token) {
        return { saved: false, reason: 'not_logged_in' };
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'submitScore',
                token: auth.token,
                quizId: QUIZ_ID,
                score: score,
                maxScore: maxScore,
                answers: answers
            })
        });
        const result = await response.json();
        return { saved: result.success, reason: result.error || 'saved' };
    } catch (err) {
        return { saved: false, reason: 'connection_error' };
    }
}

async function gradeWithLLM(question, userAnswer, sampleAnswer) {
    try {
        console.log('Grading:', { question, userAnswer, sampleAnswer });
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'gradeAnswer',
                question: question,
                userAnswer: userAnswer,
                sampleAnswer: sampleAnswer
            })
        });
        const result = await response.json();
        console.log('Grading result:', result);
        return result;
    } catch (err) {
        console.error('LLM grading error:', err);
        return { correct: false, score: 0, feedback: 'Grading error: ' + err.message };
    }
}

document.addEventListener('DOMContentLoaded', updateAuthStatus);

const mcqPool = [
  {
    q: "What is an LLM best described as?",
    opts: ["A database for storing text", "A next-token prediction engine", "A search engine", "A compiler for Python"],
    correct: 1,
    feedback: "LLMs predict the most likely next token based on the input context."
  },
  {
    q: "Why should LLM output be treated as 'untrusted' in enterprise systems?",
    opts: ["It is always encrypted", "It generates statistically likely text, not guaranteed truth", "It requires a license", "It only works offline"],
    correct: 1,
    feedback: "LLMs optimize for plausible text, not verified truth. Output must be validated."
  },
  {
    q: "What are tokens in the context of LLMs?",
    opts: ["Authentication credentials", "Subword pieces the model operates on", "Database records", "API rate limits"],
    correct: 1,
    feedback: "LLMs operate on tokens (subword pieces), not whole words."
  },
  {
    q: "What happens when input exceeds an LLM's context window?",
    opts: ["The model runs faster", "Input may be truncated, producing incomplete results", "The model automatically expands", "Nothing, it handles any size"],
    correct: 1,
    feedback: "Long inputs can be truncated, leading to generic or incomplete outputs."
  },
  {
    q: "What is the difference between training and inference?",
    opts: ["Training is faster than inference", "Training is offline learning; inference is runtime generation", "They are the same thing", "Inference creates new models"],
    correct: 1,
    feedback: "Training learns model parameters offline; inference generates output at runtime."
  },
  {
    q: "What does temperature=0.0 typically produce?",
    opts: ["Random creative output", "More deterministic, consistent output", "Faster responses", "Longer responses"],
    correct: 1,
    feedback: "Low temperature reduces randomness, producing more consistent output."
  },
  {
    q: "Why is low temperature preferred in regulated workflows?",
    opts: ["It's faster", "It produces consistent, auditable results", "It uses less memory", "It's required by law"],
    correct: 1,
    feedback: "Low temperature ensures consistency and reproducibility for compliance."
  },
  {
    q: "What is a hallucination in LLM context?",
    opts: ["A visual output", "Confident but incorrect output", "A type of prompt", "An error message"],
    correct: 1,
    feedback: "Hallucinations are when models generate plausible but false information confidently."
  },
  {
    q: "How should you handle potential hallucinations?",
    opts: ["Trust the model completely", "Validate output against known facts or constraints", "Increase temperature", "Use longer prompts"],
    correct: 1,
    feedback: "Always validate LLM output against trusted sources or deterministic checks."
  },
  {
    q: "Why is JSON output preferred for automation?",
    opts: ["It's smaller", "It enables deterministic parsing and validation", "It's required by all APIs", "It's more readable"],
    correct: 1,
    feedback: "JSON allows structured parsing and programmatic validation of output."
  },
  {
    q: "What should you do if an LLM returns invalid JSON?",
    opts: ["Retry the request or fail clearly", "Ignore the error", "Parse it anyway", "Increase temperature"],
    correct: 0,
    feedback: "Handle parsing failures with retries or clear error handling."
  },
  {
    q: "What is a context window?",
    opts: ["A GUI element", "The maximum input the model can process at once", "A debugging tool", "A type of prompt"],
    correct: 1,
    feedback: "The context window limits how much text the model can see at once."
  },
  {
    q: "Which practice improves prompt reliability?",
    opts: ["Vague instructions", "Clear constraints, audience, and format specifications", "Very long prompts", "Multiple unrelated tasks"],
    correct: 1,
    feedback: "Clear constraints and explicit format requirements improve reliability."
  },
  {
    q: "What is the purpose of an uncertainty policy in prompts?",
    opts: ["To make output longer", "To instruct the model to admit when it doesn't know", "To increase speed", "To reduce costs"],
    correct: 1,
    feedback: "Uncertainty policies prevent the model from guessing when it lacks information."
  },
  {
    q: "Why might you cache LLM responses?",
    opts: ["To increase randomness", "To reduce latency and cost for repeated prompts", "To improve accuracy", "To bypass rate limits"],
    correct: 1,
    feedback: "Caching saves time and cost by reusing results for identical prompts."
  },
  {
    q: "What should be logged for LLM auditability?",
    opts: ["Only the response", "Prompt, parameters, model, and output metadata", "Nothing, for privacy", "Only errors"],
    correct: 1,
    feedback: "Complete logging enables compliance audits and debugging."
  },
  {
    q: "Why should sensitive data not be sent to unapproved LLM endpoints?",
    opts: ["It's faster", "Data could be logged, stored, or used for training", "It improves accuracy", "It's required by the API"],
    correct: 1,
    feedback: "Unapproved endpoints may store or use your data inappropriately."
  },
  {
    q: "What is a better alternative to 'LLM judging LLM' for evaluation?",
    opts: ["Trust the output", "Deterministic checks like schema validation and length constraints", "Manual review only", "Higher temperature"],
    correct: 1,
    feedback: "Deterministic validation (schema, length, format) is more reliable than LLM self-evaluation."
  },
  {
    q: "What does RAG stand for in AI context?",
    opts: ["Random Access Generation", "Retrieval-Augmented Generation", "Rapid API Gateway", "Runtime Algorithm Generator"],
    correct: 1,
    feedback: "RAG combines retrieval of relevant documents with LLM generation."
  },
  {
    q: "Why is RAG useful?",
    opts: ["It makes models faster", "It grounds LLM output in retrieved evidence, reducing hallucinations", "It eliminates the need for prompts", "It reduces model size"],
    correct: 1,
    feedback: "RAG provides context from trusted sources to reduce hallucinations."
  },
  {
    q: "What is the JBChat /chat endpoint used for?",
    opts: ["User authentication", "Sending structured message prompts and receiving LLM responses", "Database queries", "File uploads"],
    correct: 1,
    feedback: "The /chat endpoint accepts structured messages and returns model responses."
  },
  {
    q: "Which HTTP method is typically used to call an LLM API?",
    opts: ["GET", "DELETE", "POST", "PUT"],
    correct: 2,
    feedback: "POST is used to send prompt data to LLM APIs."
  },
  {
    q: "What does stream=False mean in an LLM API call?",
    opts: ["Response comes all at once, not token by token", "The request is encrypted", "No response is returned", "The model is offline"],
    correct: 0,
    feedback: "stream=False returns the complete response in one JSON object."
  },
  {
    q: "Why might local LLM deployment be preferred over cloud?",
    opts: ["It's always faster", "Data privacy and no network dependency", "It's more accurate", "It has larger context windows"],
    correct: 1,
    feedback: "Local deployment keeps data private and works without internet."
  },
  {
    q: "What is a key security measure when exposing LLM services via an API gateway?",
    opts: ["Allowing anonymous access", "API key authentication and rate limiting", "Disabling HTTPS", "Removing all logging"],
    correct: 1,
    feedback: "API keys identify callers and rate limiting prevents abuse and DoS attacks."
  },
  {
    q: "Why should raw LLM endpoints never be exposed publicly without protection?",
    opts: ["They are too slow", "They can be abused for free compute, DoS, or data extraction", "They only work locally", "They require special hardware"],
    correct: 1,
    feedback: "Unsecured endpoints can be abused for free compute, prompt injection, or DoS attacks."
  },
  {
    q: "What does the 'ngrok-skip-browser-warning' header do?",
    opts: ["Encrypts the request", "Bypasses ngrok's free-tier interstitial page", "Increases speed", "Authenticates the user"],
    correct: 1,
    feedback: "This header bypasses the ngrok warning page that appears on free-tier tunnels."
  }
];

const writtenPool = [
  {
    q: "Explain why LLMs generate hallucinations.",
    sample: "LLMs optimize for statistically plausible text, not truth. They have no way to verify facts.",
    keywords: ["statistic", "plausible", "truth", "verify", "predict", "probability", "confident"],
    minMatches: 2
  },
  {
    q: "What is the relationship between tokens and context windows?",
    sample: "Context windows limit the number of tokens the model can process. Long inputs may be truncated.",
    keywords: ["token", "context", "window", "limit", "truncate", "input", "process"],
    minMatches: 3
  },
  {
    q: "Why is low temperature recommended for enterprise use cases?",
    sample: "Low temperature produces consistent, reproducible output needed for auditing and compliance.",
    keywords: ["consistent", "reproducible", "audit", "compliance", "deterministic", "reliable"],
    minMatches: 2
  },
  {
    q: "Write a Python function that calls an LLM API with requests.",
    sample: "def call_llm(prompt):\n    r = requests.post(url, json={'prompt': prompt})\n    return r.json()",
    keywords: ["def", "requests", "post", "json", "prompt", "return"],
    minMatches: 4
  },
  {
    q: "How can you validate that LLM output is valid JSON?",
    sample: "Use json.loads() in a try/except block. If it raises an exception, the JSON is invalid.",
    keywords: ["json", "loads", "try", "except", "parse", "valid", "error"],
    minMatches: 3
  },
  {
    q: "What is the difference between training and inference?",
    sample: "Training is offline learning of parameters from data. Inference is generating output at runtime.",
    keywords: ["training", "inference", "offline", "runtime", "learn", "generate", "parameter"],
    minMatches: 3
  },
  {
    q: "Why should you include an uncertainty policy in prompts?",
    sample: "To prevent the model from guessing when unsure. It should say 'I don't know' instead of hallucinating.",
    keywords: ["uncertain", "guess", "know", "hallucin", "unsure", "admit"],
    minMatches: 2
  },
  {
    q: "Explain why caching LLM responses is useful.",
    sample: "LLM calls are slow and expensive. Caching reuses results for identical prompts, saving time and cost.",
    keywords: ["cache", "slow", "expensive", "reuse", "identical", "cost", "time", "save"],
    minMatches: 3
  },
  {
    q: "What information should be logged for LLM auditability?",
    sample: "Prompt (or hash), model name, temperature, timestamp, and response metadata.",
    keywords: ["prompt", "model", "temperature", "timestamp", "log", "hash", "metadata", "audit"],
    minMatches: 3
  },
  {
    q: "Why is 'LLM judging LLM' problematic for evaluation?",
    sample: "Both LLMs can make the same mistakes. Deterministic checks are more reliable.",
    keywords: ["mistake", "deterministic", "reliable", "check", "both", "error", "validate"],
    minMatches: 2
  },
  {
    q: "What does RAG add to a basic LLM system?",
    sample: "RAG retrieves relevant documents and provides them as context, grounding the LLM in evidence.",
    keywords: ["retriev", "document", "context", "ground", "evidence", "augment"],
    minMatches: 3
  },
  {
    q: "How can you force an LLM to return structured JSON output?",
    sample: "Include explicit instructions in the prompt: 'Return ONLY valid JSON with keys: ...'",
    keywords: ["json", "prompt", "instruct", "explicit", "only", "key", "format"],
    minMatches: 3
  },
  {
    q: "What are the trade-offs between local and remote LLM endpoints?",
    sample: "Local: private, no network needed, slower. Remote: faster, managed, requires network and trust.",
    keywords: ["local", "remote", "private", "network", "fast", "slow", "trust"],
    minMatches: 3
  },
  {
    q: "Why is prompt structure (system, task, constraints) important?",
    sample: "It reduces ambiguity by clearly separating behavior rules, the task, and output requirements.",
    keywords: ["system", "task", "constraint", "ambig", "clear", "separate", "structure"],
    minMatches: 3
  },
  {
    q: "How can you validate LLM text output without using another LLM?",
    sample: "Check bullet count, word/character limits, required keywords, or schema compliance.",
    keywords: ["bullet", "count", "limit", "keyword", "schema", "length", "validate", "check"],
    minMatches: 3
  },
  {
    q: "What happens if you send a very long document to an LLM?",
    sample: "It may be truncated to fit the context window, resulting in incomplete or generic responses.",
    keywords: ["truncat", "context", "window", "long", "incomplete", "generic", "limit"],
    minMatches: 3
  },
  {
    q: "Why should sensitive data not be sent to public LLM APIs?",
    sample: "The data could be logged, stored, or used for training by the provider.",
    keywords: ["log", "store", "train", "privacy", "sensitive", "provider", "data"],
    minMatches: 3
  },
  {
    q: "Describe one safety pattern for handling LLM failures.",
    sample: "Implement fallbacks: if validation fails, retry with a different prompt or return a default response.",
    keywords: ["fallback", "retry", "fail", "default", "valid", "error", "handle"],
    minMatches: 2
  },
  {
    q: "What is temperature in the context of LLM APIs?",
    sample: "Temperature controls randomness. Low values (0-0.2) are deterministic; high values are creative.",
    keywords: ["temperature", "random", "deterministic", "creative", "control", "value"],
    minMatches: 3
  },
  {
    q: "How can LLMs be used within a Pandas pipeline?",
    sample: "Apply an LLM function to DataFrame columns to generate summaries, tags, or classifications.",
    keywords: ["pandas", "dataframe", "apply", "column", "summar", "tag", "classif"],
    minMatches: 3
  },
  {
    q: "What security measures should be implemented when exposing an LLM via API gateway?",
    sample: "API key authentication, rate limiting, input validation, output filtering, logging, and monitoring for abuse.",
    keywords: ["api", "key", "auth", "rate", "limit", "valid", "log", "monitor", "security"],
    minMatches: 3
  },
  {
    q: "Why is the /chat endpoint used in this module?",
    sample: "The /chat endpoint uses structured messages which is consistent with modern chat APIs and integrates with the JBChat RAG backend.",
    keywords: ["chat", "message", "structure", "json", "consistent", "modern", "rag"],
    minMatches: 2
  }
];

let selectedMCQs = [];
let selectedWritten = [];
let userAnswers = {};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startQuiz() {
  userAnswers = {};
  document.getElementById('quiz-intro').classList.add('hidden');
  document.getElementById('quiz-results').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');

  // Select 3 random MCQs and 2 random written questions
  selectedMCQs = shuffle(mcqPool).slice(0, 3);
  selectedWritten = shuffle(writtenPool).slice(0, 2);

  let html = '';
  let qNum = 1;

  // MCQs
  selectedMCQs.forEach((mcq, idx) => {
    const shuffledOpts = shuffle(mcq.opts.map((opt, i) => ({text: opt, origIdx: i})));
    mcq.shuffledOpts = shuffledOpts;

    html += `<div class="quiz-question">
      <h3>Question ${qNum} (Multiple Choice)</h3>
      <p>${mcq.q}</p>
      <div class="quiz-options">
        ${shuffledOpts.map((opt) => `
          <label>
            <input type="radio" name="mcq${idx}" value="${opt.origIdx}" onchange="userAnswers['mcq${idx}']=${opt.origIdx}">
            ${opt.text}
          </label>
        `).join('')}
      </div>
    </div>`;
    qNum++;
  });

  // Written questions
  selectedWritten.forEach((written, idx) => {
    html += `<div class="quiz-question">
      <h3>Question ${qNum} (Written)</h3>
      <p>${written.q}</p>
      <textarea class="written-answer" id="written-${idx}" placeholder="Type your answer here..." oninput="userAnswers['written${idx}']=this.value"></textarea>
    </div>`;
    qNum++;
  });

  html += `<button class="submit-btn" onclick="submitQuiz()">Submit Quiz</button>`;
  document.getElementById('quiz-area').innerHTML = html;
}

async function submitQuiz() {
  let score = 0;
  let reviewHtml = '<h3>Review Your Answers:</h3>';
  let qNum = 1;

  // Grade MCQs
  selectedMCQs.forEach((mcq, idx) => {
    const userAnswer = userAnswers['mcq' + idx];
    const isCorrect = userAnswer === mcq.correct;
    if (isCorrect) score++;

    reviewHtml += `<div class="quiz-question">
      <h3>Question ${qNum}</h3>
      <p>${mcq.q}</p>
      <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>
        ${!isCorrect ? `Your answer: ${userAnswer !== undefined ? mcq.opts[userAnswer] : 'Not answered'}<br>` : ''}
        Correct answer: ${mcq.opts[mcq.correct]}<br>
        <em>${mcq.feedback}</em>
      </div>
    </div>`;
    qNum++;
  });

  // Grade Written questions with LLM
  document.getElementById('quiz-area').innerHTML = '<div style="text-align:center;padding:40px;"><strong>Grading your answers with AI...</strong></div>';

  const writtenResults = [];
  for (let idx = 0; idx < selectedWritten.length; idx++) {
    const written = selectedWritten[idx];
    const writtenAnswer = userAnswers['written' + idx] || '';
    const grading = await gradeWithLLM(written.q, writtenAnswer, written.sample);
    writtenResults.push({ written, writtenAnswer, grading, idx });
  }

  for (const { written, writtenAnswer, grading, idx } of writtenResults) {
    const isCorrect = grading.correct;
    const gradingScore = grading.score || (isCorrect ? 1 : 0);
    score += gradingScore;

    reviewHtml += `<div class="quiz-question">
      <h3>Question ${qNum} (Written)</h3>
      <p>${written.q}</p>
      <p><strong>Your answer:</strong> ${writtenAnswer || 'Not answered'}</p>
      <div class="feedback ${isCorrect ? 'correct' : (grading.score === 0.5 ? 'partial' : 'incorrect')}">
        <strong>${isCorrect ? '✓ Correct!' : (grading.score === 0.5 ? '◐ Partial Credit' : '✗ Incorrect')}</strong><br>
        ${grading.feedback || ''}
      </div>
      <div class="sample-answer">
        <strong>Sample answer:</strong><br>
        <pre>${written.sample}</pre>
      </div>
    </div>`;
    qNum++;
  }

  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('quiz-results').classList.remove('hidden');
  document.getElementById('score-text').innerHTML = `Your Score: ${score}/5`;
  document.getElementById('review-area').innerHTML = reviewHtml;

  // Save score if logged in
  const saveStatusDiv = document.getElementById('save-status');
  const auth = getAuth();
  if (auth && auth.token) {
    saveStatusDiv.innerHTML = '<div class="score-not-saved">Saving score...</div>';
    const result = await saveScore(score, 5, userAnswers);
    if (result.saved) {
      saveStatusDiv.innerHTML = '<div class="score-saved">✓ Score saved to your transcript! <a href="dashboard.html">View Progress</a></div>';
    } else {
      saveStatusDiv.innerHTML = `<div class="score-not-saved">Could not save score: ${result.reason}</div>`;
    }
  } else {
    saveStatusDiv.innerHTML = '<div class="score-not-saved"><a href="login.html">Login</a> to save your scores to your transcript.</div>';
  }
}
</script>
```

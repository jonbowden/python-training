# Module 1 Quiz - Python Foundations

Test your understanding of Python fundamentals. Click the button below to start a randomized quiz.

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
.score-display { font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background: #e8f4fc; border-radius: 8px; margin: 20px 0; }
.hidden { display: none; }
.sample-answer { background: #fff3cd; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #ffc107; }
.auth-notice { background: #e0f2fe; border: 1px solid #0284c7; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
.auth-notice a { color: #0066cc; font-weight: bold; }
.score-saved { background: #d1fae5; padding: 10px; margin-top: 10px; border-radius: 5px; text-align: center; color: #059669; }
.score-not-saved { background: #fef3c7; padding: 10px; margin-top: 10px; border-radius: 5px; text-align: center; color: #92400e; }
.user-greeting { background: #f0fdf4; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #86efac; }
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
const API_URL = 'https://script.google.com/macros/s/AKfycbw6q9uUO0ZthdpmiXwm11pTugUtPO_KXYgdBdoAzoEORQvZqkf1umoFmse2MDNwJyqH/exec';
const QUIZ_ID = 'module1-quiz';
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
        statusDiv.innerHTML = `<div class="user-greeting">Logged in as <strong>${auth.user.name}</strong> - Your score will be saved to your transcript.</div>`;
    } else {
        statusDiv.innerHTML = `<div class="auth-notice"><a href="login.html">Login or Register</a> to save your quiz scores to your transcript.</div>`;
    }
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

document.addEventListener('DOMContentLoaded', updateAuthStatus);

const mcqPool = [
  {
    q: "Which of the following best explains why Python uses indentation?",
    opts: ["To improve performance", "To reduce file size", "To define code blocks clearly", "To support multi-threading"],
    correct: 2,
    feedback: "Python uses indentation to define code blocks, making code structure clear and readable."
  },
  {
    q: "What happens if indentation is incorrect in Python?",
    opts: ["The code runs slower", "Python ignores it", "A syntax error occurs", "Variables reset"],
    correct: 2,
    feedback: "Incorrect indentation causes a syntax error because Python uses indentation to define code structure."
  },
  {
    q: "Which data type is best suited for storing a record with named fields?",
    opts: ["list", "tuple", "dictionary", "set"],
    correct: 2,
    feedback: "Dictionaries store key-value pairs, perfect for records with named fields."
  },
  {
    q: "Which statement about lists is TRUE?",
    opts: ["Lists cannot change size", "Lists are immutable", "Lists maintain order", "Lists store key-value pairs"],
    correct: 2,
    feedback: "Lists are ordered collections that maintain the order of elements."
  },
  {
    q: "Why might you choose a tuple instead of a list?",
    opts: ["Tuples are faster for all operations", "Tuples allow keys", "Tuples prevent accidental modification", "Tuples can store more data"],
    correct: 2,
    feedback: "Tuples are immutable, preventing accidental modification of data."
  },
  {
    q: "What does len({'a': 1, 'b': 2}) return?",
    opts: ["1", "2", "3", "Error"],
    correct: 1,
    feedback: "len() returns the number of key-value pairs in a dictionary."
  },
  {
    q: "Which loop is best when you know how many times you need to iterate?",
    opts: ["if", "while", "for", "try"],
    correct: 2,
    feedback: "A for loop is ideal when you know the number of iterations in advance."
  },
  {
    q: "What is the output of: for i in range(1, 4): print(i)",
    opts: ["0 1 2", "1 2 3", "1 2 3 4", "Error"],
    correct: 1,
    feedback: "range(1, 4) produces 1, 2, 3 (starts at 1, excludes 4)."
  },
  {
    q: "What does a function return if there is no return statement?",
    opts: ["0", "False", "None", "Error"],
    correct: 2,
    feedback: "Functions without a return statement return None by default."
  },
  {
    q: "What is the main benefit of using functions?",
    opts: ["Faster execution", "Less memory usage", "Code reuse and readability", "Automatic testing"],
    correct: 2,
    feedback: "Functions promote code reuse and make code more readable and maintainable."
  },
  {
    q: "Which statement correctly opens a file safely?",
    opts: ["open('file.txt')", "with open('file.txt'):", "open file.txt", "file.open()"],
    correct: 1,
    feedback: "The 'with' statement ensures the file is properly closed after use."
  },
  {
    q: "Why is 'with open(...)' preferred?",
    opts: ["It encrypts the file", "It closes the file automatically", "It improves performance", "It prevents errors"],
    correct: 1,
    feedback: "The 'with' statement automatically closes the file, even if an error occurs."
  },
  {
    q: "What data structure does json.load() typically return?",
    opts: ["list", "tuple", "dictionary", "string"],
    correct: 2,
    feedback: "JSON objects are parsed into Python dictionaries."
  },
  {
    q: "Which file format is most commonly used for configuration and APIs?",
    opts: ["CSV", "XML", "JSON", "TXT"],
    correct: 2,
    feedback: "JSON is the standard format for APIs and configuration files."
  },
  {
    q: "What is a Jupyter notebook best suited for?",
    opts: ["Large-scale production systems", "Interactive development and experimentation", "Kernel programming", "Compiling Python"],
    correct: 1,
    feedback: "Jupyter notebooks are designed for interactive development and data exploration."
  },
  {
    q: "Which notebook feature allows explanation alongside code?",
    opts: ["Code cells", "Kernel", "Markdown cells", "Output cells"],
    correct: 2,
    feedback: "Markdown cells allow you to add formatted text, explanations, and documentation."
  },
  {
    q: "What happens when you restart a notebook kernel?",
    opts: ["Files are deleted", "Variables are cleared", "Code is reformatted", "Markdown is removed"],
    correct: 1,
    feedback: "Restarting the kernel clears all variables and resets the Python environment."
  },
  {
    q: "Which command runs a Python script from the command line?",
    opts: ["run my_script.py", "execute python my_script.py", "python my_script.py", "script my_script.py"],
    correct: 2,
    feedback: "Use 'python my_script.py' to run a Python script from the command line."
  },
  {
    q: "Why are scripts still important if notebooks exist?",
    opts: ["Scripts are faster", "Scripts are required for AI", "Scripts support automation and production", "Scripts reduce bugs"],
    correct: 2,
    feedback: "Scripts are essential for automation, scheduling, and production deployments."
  },
  {
    q: "Which best describes a virtual environment?",
    opts: ["A cloud server", "A container", "An isolated Python dependency space", "A notebook feature"],
    correct: 2,
    feedback: "Virtual environments isolate Python dependencies for different projects."
  }
];

const writtenPool = [
  {
    q: "Explain the difference between a list and a tuple.",
    sample: "A list is mutable (can be changed); a tuple is immutable (cannot be changed).",
    keywords: ["list", "tuple", "mutable", "immutable", "change"],
    minMatches: 3
  },
  {
    q: "Why are dictionaries useful when working with JSON data?",
    sample: "Because JSON maps naturally to key-value pairs, which is how dictionaries work.",
    keywords: ["key", "value", "pair", "json", "map", "structure"],
    minMatches: 2
  },
  {
    q: "Write an if statement that prints 'OK' if x is greater than 10.",
    sample: "if x > 10:\n    print('OK')",
    keywords: ["if", "x", "10", "print", ">"],
    minMatches: 4
  },
  {
    q: "Write a loop that prints the numbers 1 to 3.",
    sample: "for i in range(1, 4):\n    print(i)",
    keywords: ["for", "range", "print", "1", "3", "4"],
    minMatches: 3
  },
  {
    q: "What is the purpose of a function?",
    sample: "To group reusable logic and improve readability.",
    keywords: ["reuse", "reusable", "group", "logic", "readable", "readability", "organize"],
    minMatches: 2
  },
  {
    q: "Write a function that returns double the input value.",
    sample: "def double(x):\n    return x * 2",
    keywords: ["def", "return", "*", "2", "double"],
    minMatches: 3
  },
  {
    q: "Explain why file handling is important in data pipelines.",
    sample: "Because data must be read from and written to files reliably.",
    keywords: ["read", "write", "data", "file", "store", "save", "load"],
    minMatches: 2
  },
  {
    q: "What does json.dump(data, f, indent=2) do?",
    sample: "Writes structured JSON to a file in readable format.",
    keywords: ["write", "json", "file", "format", "indent", "readable"],
    minMatches: 2
  },
  {
    q: "Why is JSON commonly used in AI systems?",
    sample: "It is structured, language-agnostic, and easy to parse.",
    keywords: ["structure", "structured", "parse", "language", "agnostic", "standard", "api"],
    minMatches: 2
  },
  {
    q: "What is one advantage of notebooks over scripts?",
    sample: "They allow interactive experimentation and immediate feedback.",
    keywords: ["interactive", "experiment", "feedback", "immediate", "visual", "explore"],
    minMatches: 2
  },
  {
    q: "What happens if you forget to close a file?",
    sample: "It may remain open and cause resource issues or data loss.",
    keywords: ["open", "resource", "memory", "leak", "issue", "data", "loss", "close"],
    minMatches: 2
  },
  {
    q: "Explain the difference between for and while loops.",
    sample: "for loops iterate over known sequences; while loops run until a condition changes.",
    keywords: ["for", "while", "sequence", "condition", "iterate", "known", "until"],
    minMatches: 3
  },
  {
    q: "What does type(x) return?",
    sample: "The data type of x.",
    keywords: ["type", "data", "class", "kind"],
    minMatches: 1
  },
  {
    q: "Why is indentation critical in Python?",
    sample: "It defines code blocks and structure.",
    keywords: ["block", "structure", "define", "syntax", "code"],
    minMatches: 2
  },
  {
    q: "Give an example of when a set is useful.",
    sample: "When storing unique values or removing duplicates.",
    keywords: ["unique", "duplicate", "remove", "distinct", "membership"],
    minMatches: 1
  },
  {
    q: "What is a module in Python?",
    sample: "A file containing reusable Python code.",
    keywords: ["file", "code", "reusable", "import", "library", "function"],
    minMatches: 2
  },
  {
    q: "Why should code be split into functions?",
    sample: "For reuse, clarity, and easier testing.",
    keywords: ["reuse", "clarity", "test", "maintain", "organize", "readable"],
    minMatches: 2
  },
  {
    q: "What does restarting a notebook kernel do?",
    sample: "Clears all variables and resets the environment.",
    keywords: ["clear", "reset", "variable", "environment", "memory"],
    minMatches: 2
  },
  {
    q: "Why might scripts be preferred for automation?",
    sample: "They can be scheduled and run without manual interaction.",
    keywords: ["schedule", "automat", "run", "manual", "cron", "batch", "production"],
    minMatches: 2
  },
  {
    q: "Describe one thing Python does to improve readability.",
    sample: "Uses indentation instead of brackets to define code blocks.",
    keywords: ["indent", "bracket", "readable", "simple", "clear", "english"],
    minMatches: 1
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

  // Grade Written questions
  selectedWritten.forEach((written, idx) => {
    const writtenAnswer = (userAnswers['written' + idx] || '').toLowerCase();
    let matchedKeywords = 0;
    let matchedList = [];

    written.keywords.forEach(keyword => {
      if (writtenAnswer.includes(keyword.toLowerCase())) {
        matchedKeywords++;
        matchedList.push(keyword);
      }
    });

    const isCorrect = matchedKeywords >= written.minMatches;
    if (isCorrect) score++;

    reviewHtml += `<div class="quiz-question">
      <h3>Question ${qNum} (Written)</h3>
      <p>${written.q}</p>
      <p><strong>Your answer:</strong> ${userAnswers['written' + idx] || 'Not answered'}</p>
      <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>
        Keywords found: ${matchedList.length > 0 ? matchedList.join(', ') : 'none'} (${matchedKeywords}/${written.minMatches} required)<br>
      </div>
      <div class="sample-answer">
        <strong>Sample answer:</strong><br>
        <pre>${written.sample}</pre>
      </div>
    </div>`;
    qNum++;
  });

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

# Module 2 Quiz - Python for Data Work

Test your understanding of data analysis with Python. Click the button below to start a randomized quiz.

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
    <p>Questions are randomly selected from a pool of 30 questions each time you start.</p>
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
const QUIZ_ID = 'module2-quiz';
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
    q: "What is the primary purpose of the Pandas library?",
    opts: ["Building machine learning models", "Numerical computing only", "Data loading, cleaning, and analysis", "Web development"],
    correct: 2,
    feedback: "Pandas is designed for data loading, cleaning, and analysis with tabular data."
  },
  {
    q: "Which Pandas function is most commonly used to load CSV files?",
    opts: ["pd.open()", "pd.read_csv()", "pd.load_csv()", "pd.import()"],
    correct: 1,
    feedback: "pd.read_csv() is the standard function for loading CSV files into a DataFrame."
  },
  {
    q: "Why should you always inspect a dataset before analysing it?",
    opts: ["To improve performance", "To format charts", "To understand structure, types, and missing values", "To remove duplicates automatically"],
    correct: 2,
    feedback: "Inspecting data helps you understand its structure, data types, and identify missing values."
  },
  {
    q: "What does df.info() primarily show?",
    opts: ["Summary statistics", "Column names only", "Data types and missing values", "Sorted data"],
    correct: 2,
    feedback: "df.info() displays column data types, non-null counts, and memory usage."
  },
  {
    q: "Which statement correctly describes a Pandas Series?",
    opts: ["A two-dimensional table", "A single column of data", "A database table", "A chart"],
    correct: 1,
    feedback: "A Series is a one-dimensional array-like object, essentially a single column."
  },
  {
    q: "Which operation is best for selecting rows where revenue is greater than 10,000?",
    opts: ["Sorting", "Grouping", "Filtering", "Profiling"],
    correct: 2,
    feedback: "Filtering allows you to select rows that meet specific conditions."
  },
  {
    q: "Why is missing data a problem in analysis?",
    opts: ["It slows down Python", "It always causes errors", "It can distort results and conclusions", "It prevents plotting"],
    correct: 2,
    feedback: "Missing data can skew calculations and lead to incorrect conclusions."
  },
  {
    q: "Which Pandas function is commonly used to replace missing values?",
    opts: ["replace()", "fillna()", "drop()", "clean()"],
    correct: 1,
    feedback: "fillna() replaces NaN values with a specified value or method."
  },
  {
    q: "What is the result of creating a derived column like df['profit'] = df['revenue'] - df['cost']?",
    opts: ["Filtering data", "Aggregating data", "Transforming data", "Visualising data"],
    correct: 2,
    feedback: "Creating new columns from existing ones is a data transformation operation."
  },
  {
    q: "What problem does groupby() help solve?",
    opts: ["Sorting files", "Combining multiple datasets", "Summarising data by categories", "Cleaning missing values"],
    correct: 2,
    feedback: "groupby() splits data into groups and allows you to calculate summaries for each group."
  },
  {
    q: "Which library underpins Pandas' numerical operations?",
    opts: ["SciPy", "Matplotlib", "NumPy", "Seaborn"],
    correct: 2,
    feedback: "Pandas is built on top of NumPy for efficient numerical operations."
  },
  {
    q: "What does a Pearson correlation measure?",
    opts: ["Data size", "Data quality", "Linear relationship between two variables", "Distribution shape"],
    correct: 2,
    feedback: "Pearson correlation measures the strength and direction of a linear relationship."
  },
  {
    q: "What is the main role of Matplotlib?",
    opts: ["Statistical testing", "Interactive dashboards", "Foundational plotting", "Database querying"],
    correct: 2,
    feedback: "Matplotlib is Python's foundational plotting library for creating visualisations."
  },
  {
    q: "Why might you choose Seaborn over raw Matplotlib?",
    opts: ["It runs faster", "It supports databases", "It simplifies statistical visualisation", "It replaces Pandas"],
    correct: 2,
    feedback: "Seaborn provides a higher-level interface for creating statistical visualisations."
  },
  {
    q: "What advantage does Plotly provide?",
    opts: ["Faster calculations", "Interactive visualisations", "Smaller datasets", "Automatic cleaning"],
    correct: 1,
    feedback: "Plotly creates interactive charts that users can zoom, pan, and hover over."
  },
  {
    q: "What does ydata-profiling generate?",
    opts: ["Machine learning models", "Data cleaning scripts", "Automated exploratory data analysis reports", "SQL queries"],
    correct: 2,
    feedback: "ydata-profiling generates comprehensive HTML reports for exploratory data analysis."
  },
  {
    q: "Why are APIs useful data sources?",
    opts: ["They always return clean data", "They provide live, programmatic access to data", "They replace databases", "They improve plotting"],
    correct: 1,
    feedback: "APIs allow programmatic access to live data from web services."
  },
  {
    q: "Which library is commonly used to retrieve data from APIs?",
    opts: ["sqlite3", "requests", "seaborn", "scipy"],
    correct: 1,
    feedback: "The requests library is used to make HTTP requests to APIs."
  },
  {
    q: "What is SQLite best described as?",
    opts: ["A cloud database", "A distributed database", "A lightweight file-based relational database", "A NoSQL store"],
    correct: 2,
    feedback: "SQLite is a lightweight, file-based relational database that requires no server setup."
  },
  {
    q: "Why is data visualisation important?",
    opts: ["It reduces file size", "It replaces analysis", "It helps humans understand patterns and trends", "It cleans data automatically"],
    correct: 2,
    feedback: "Visualisation helps humans quickly understand patterns, trends, and outliers in data."
  }
];

const writtenPool = [
  {
    q: "Explain the difference between a Series and a DataFrame.",
    sample: "A Series is one-dimensional; a DataFrame is two-dimensional.",
    keywords: ["series", "dataframe", "one", "two", "dimension", "column", "table"],
    minMatches: 2
  },
  {
    q: "Why is it important to check for missing values before analysis?",
    sample: "Missing values can distort calculations and conclusions.",
    keywords: ["missing", "distort", "result", "calculation", "conclusion", "error", "nan"],
    minMatches: 2
  },
  {
    q: "Write Pandas code to filter rows where revenue is greater than 5,000.",
    sample: "df[df['revenue'] > 5000]",
    keywords: ["df", "revenue", ">", "5000", "filter", "["],
    minMatches: 3
  },
  {
    q: "Write code to group data by region and calculate total revenue.",
    sample: "df.groupby('region')['revenue'].sum()",
    keywords: ["groupby", "region", "revenue", "sum", "df"],
    minMatches: 3
  },
  {
    q: "Explain why derived columns are useful in data analysis.",
    sample: "They create new insights from existing data.",
    keywords: ["new", "insight", "create", "calculate", "derive", "feature", "transform"],
    minMatches: 2
  },
  {
    q: "What does df.describe() help you understand?",
    sample: "Summary statistics such as mean, min, max, and quartiles.",
    keywords: ["summary", "statistic", "mean", "min", "max", "count", "std"],
    minMatches: 2
  },
  {
    q: "Why might interactive charts be preferable to static charts?",
    sample: "They allow users to explore data dynamically.",
    keywords: ["interactive", "explore", "dynamic", "zoom", "hover", "user", "engage"],
    minMatches: 2
  },
  {
    q: "Give one example of when NumPy is used in data analysis.",
    sample: "Calculating averages or numerical statistics.",
    keywords: ["average", "mean", "statistic", "array", "numerical", "calculate", "math"],
    minMatches: 1
  },
  {
    q: "What does restarting a notebook kernel not preserve?",
    sample: "Variables and in-memory data.",
    keywords: ["variable", "memory", "data", "state", "clear", "reset"],
    minMatches: 2
  },
  {
    q: "Why is SQLite useful for learning data analysis?",
    sample: "It provides relational querying without server setup.",
    keywords: ["relational", "query", "sql", "server", "setup", "simple", "file"],
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

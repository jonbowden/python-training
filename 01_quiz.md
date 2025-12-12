# Module 1 Quiz - Core Syntax

Test your understanding of Python syntax basics. Click the button below to start a randomized quiz with 4 multiple choice questions and 1 written question.

```{raw} html
<style>
.quiz-container { max-width: 800px; margin: 20px auto; font-family: sans-serif; }
.quiz-question { background: #f5f5f5; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0066cc; }
.quiz-question h3 { margin-top: 0; color: #333; }
.quiz-options label { display: block; padding: 10px; margin: 5px 0; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.quiz-options label:hover { background: #e8f4fc; }
.quiz-options input[type="radio"] { margin-right: 10px; }
.written-answer { width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; }
.start-btn, .submit-btn, .retry-btn { background: #0066cc; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px 10px 0; }
.start-btn:hover, .submit-btn:hover, .retry-btn:hover { background: #0052a3; }
.feedback { padding: 15px; margin-top: 10px; border-radius: 5px; }
.feedback.correct { background: #d4edda; border: 1px solid #28a745; }
.feedback.incorrect { background: #f8d7da; border: 1px solid #dc3545; }
.score-display { font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background: #e8f4fc; border-radius: 8px; margin: 20px 0; }
.hidden { display: none; }
.sample-answer { background: #fff3cd; padding: 10px; margin-top: 10px; border-radius: 4px; border: 1px solid #ffc107; }
</style>

<div class="quiz-container">
  <div id="quiz-intro">
    <p><strong>This quiz contains:</strong></p>
    <ul>
      <li>4 Multiple Choice Questions (1 point each)</li>
      <li>1 Written Question (1 point)</li>
    </ul>
    <p>Questions are randomly selected from a pool each time you start.</p>
    <button class="start-btn" onclick="startQuiz()">Start Quiz</button>
  </div>

  <div id="quiz-area" class="hidden"></div>

  <div id="quiz-results" class="hidden">
    <div class="score-display" id="score-text"></div>
    <div id="review-area"></div>
    <button class="retry-btn" onclick="startQuiz()">Try Again (New Questions)</button>
  </div>
</div>

<script>
const mcqPool = [
  {
    q: "What is the correct way to create a variable in Python?",
    opts: ["int age = 10", "var age = 10", "age = 10", "age := 10"],
    correct: 2,
    feedback: "Python uses simple assignment without type declarations."
  },
  {
    q: "Which data type is 'hello'?",
    opts: ["int", "str", "bool", "float"],
    correct: 1,
    feedback: "Text in quotes is a string (str)."
  },
  {
    q: "What is the output of print(3 + 2 * 2)?",
    opts: ["10", "7", "5", "8"],
    correct: 1,
    feedback: "Multiplication happens before addition (PEMDAS). 3 + 4 = 7"
  },
  {
    q: "Which collection type stores key-value pairs?",
    opts: ["list", "tuple", "dictionary", "set"],
    correct: 2,
    feedback: "Dictionaries store key-value pairs like {'name': 'Jon'}."
  },
  {
    q: "What will print(len([1,2,3,4])) output?",
    opts: ["3", "4", "[1,2,3,4]", "Error"],
    correct: 1,
    feedback: "len() returns the number of items in the list."
  },
  {
    q: "Which of the following is a Boolean value?",
    opts: ['"True"', "1", "True", '"False"'],
    correct: 2,
    feedback: "True and False (capitalized, no quotes) are Boolean values."
  },
  {
    q: "What symbol starts a comment in Python?",
    opts: ["//", "#", "<!-- -->", "/* */"],
    correct: 1,
    feedback: "The hash symbol (#) starts a single-line comment."
  },
  {
    q: "What does 'if x > 10:' represent?",
    opts: ["A loop", "A condition", "A function", "A class"],
    correct: 1,
    feedback: "This is a conditional statement that checks if x is greater than 10."
  },
  {
    q: "Which loop iterates over a list directly?",
    opts: ["while", "if", "for", "loop"],
    correct: 2,
    feedback: "'for item in list:' iterates directly over items."
  },
  {
    q: "What is printed by 'for i in range(3): print(i)'?",
    opts: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"],
    correct: 1,
    feedback: "range(3) produces 0, 1, 2 (starts at 0, excludes 3)."
  }
];

const writtenPool = [
  {
    q: "Write a line of Python that assigns 42 to a variable called 'answer'.",
    sample: "answer = 42"
  },
  {
    q: "What is the difference between a list and a tuple?",
    sample: "A list is mutable (can be changed); a tuple is immutable (cannot be changed after creation)."
  },
  {
    q: "Write an if statement that prints 'OK' if x is greater than 10.",
    sample: "if x > 10:\n    print('OK')"
  },
  {
    q: "How do you start a comment in Python, and why are comments useful?",
    sample: "Use the # symbol. Comments are useful for explaining code and making it more readable."
  },
  {
    q: "Write a for loop that prints the numbers 1 to 3.",
    sample: "for i in range(1, 4):\n    print(i)"
  }
];

let selectedMCQs = [];
let selectedWritten = null;
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
  // Reset
  userAnswers = {};
  document.getElementById('quiz-intro').classList.add('hidden');
  document.getElementById('quiz-results').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');

  // Select random questions
  selectedMCQs = shuffle(mcqPool).slice(0, 4);
  selectedWritten = shuffle(writtenPool)[0];

  // Build quiz HTML
  let html = '';

  selectedMCQs.forEach((mcq, idx) => {
    const shuffledOpts = mcq.opts.map((opt, i) => ({text: opt, origIdx: i}));
    shuffle(shuffledOpts);
    mcq.shuffledOpts = shuffledOpts;

    html += `<div class="quiz-question">
      <h3>Question ${idx + 1} (Multiple Choice)</h3>
      <p>${mcq.q}</p>
      <div class="quiz-options">
        ${shuffledOpts.map((opt, optIdx) => `
          <label>
            <input type="radio" name="mcq${idx}" value="${opt.origIdx}" onchange="userAnswers['mcq${idx}']=${opt.origIdx}">
            ${opt.text}
          </label>
        `).join('')}
      </div>
    </div>`;
  });

  html += `<div class="quiz-question">
    <h3>Question 5 (Written)</h3>
    <p>${selectedWritten.q}</p>
    <textarea class="written-answer" id="written-answer" placeholder="Type your answer here..." onchange="userAnswers['written']=this.value"></textarea>
  </div>`;

  html += `<button class="submit-btn" onclick="submitQuiz()">Submit Quiz</button>`;

  document.getElementById('quiz-area').innerHTML = html;
}

function submitQuiz() {
  let score = 0;
  let reviewHtml = '<h3>Review Your Answers:</h3>';

  selectedMCQs.forEach((mcq, idx) => {
    const userAnswer = userAnswers['mcq' + idx];
    const isCorrect = userAnswer === mcq.correct;
    if (isCorrect) score++;

    reviewHtml += `<div class="quiz-question">
      <h3>Question ${idx + 1}</h3>
      <p>${mcq.q}</p>
      <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><br>
        ${!isCorrect ? `Your answer: ${mcq.opts[userAnswer] || 'Not answered'}<br>` : ''}
        Correct answer: ${mcq.opts[mcq.correct]}<br>
        <em>${mcq.feedback}</em>
      </div>
    </div>`;
  });

  // Written question - always show sample answer for self-assessment
  reviewHtml += `<div class="quiz-question">
    <h3>Question 5 (Written)</h3>
    <p>${selectedWritten.q}</p>
    <p><strong>Your answer:</strong> ${userAnswers['written'] || 'Not answered'}</p>
    <div class="sample-answer">
      <strong>Sample answer:</strong><br>
      <pre>${selectedWritten.sample}</pre>
      <em>Compare your answer to the sample. Give yourself 1 point if your answer is correct!</em>
    </div>
  </div>`;

  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('quiz-results').classList.remove('hidden');
  document.getElementById('score-text').innerHTML = `Your Score: ${score}/4 MCQs<br><small>+ Self-assess your written answer</small>`;
  document.getElementById('review-area').innerHTML = reviewHtml;
}
</script>
```

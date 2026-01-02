# Module 4 Quiz - ML & DL Foundations

Test your understanding of Machine Learning and Deep Learning concepts. Click the button below to start a randomized quiz.

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
    <p>Questions are randomly selected from a pool of 35+ MCQ and 18 written questions each time you start.</p>
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
const QUIZ_ID = 'module4-quiz';
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
    q: "What makes a model 'deep'?",
    opts: ["More data", "More layers", "More epochs", "More CPUs"],
    correct: 1,
    feedback: "Deep learning refers to neural networks with many layers (depth), enabling hierarchical feature learning."
  },
  {
    q: "What does a loss function measure?",
    opts: ["Model size", "Error", "Inference speed", "Token count"],
    correct: 1,
    feedback: "A loss function measures the error between predictions and actual values, guiding optimisation."
  },
  {
    q: "What is overfitting?",
    opts: ["Model too simple", "Model memorises training data", "Learning rate too small", "No hidden layers"],
    correct: 1,
    feedback: "Overfitting occurs when a model memorises training data instead of learning generalisable patterns."
  },
  {
    q: "What is underfitting?",
    opts: ["Model memorises training data", "Model too simple to learn patterns", "Too many epochs", "Too much data"],
    correct: 1,
    feedback: "Underfitting means the model is too simple to capture the underlying patterns in the data."
  },
  {
    q: "Weights in a neural network represent:",
    opts: ["Fixed rules", "Learned importance of inputs", "Labels", "Output classes"],
    correct: 1,
    feedback: "Weights are learned parameters that determine how important each input is to the output."
  },
  {
    q: "Bias in a neuron is:",
    opts: ["A label", "A baseline offset term", "A loss function", "A dataset"],
    correct: 1,
    feedback: "Bias is an offset term that allows the neuron to shift its activation threshold."
  },
  {
    q: "What introduces non-linearity?",
    opts: ["Weights", "Activation functions", "CSV files", "Epochs"],
    correct: 1,
    feedback: "Activation functions (like ReLU, sigmoid) introduce non-linearity, allowing networks to learn complex patterns."
  },
  {
    q: "What is an epoch?",
    opts: ["One gradient step", "One full pass through training data", "One inference call", "One token"],
    correct: 1,
    feedback: "An epoch is one complete pass through the entire training dataset."
  },
  {
    q: "Gradient descent tries to:",
    opts: ["Maximise loss", "Minimise loss", "Increase tokens", "Shuffle data"],
    correct: 1,
    feedback: "Gradient descent is an optimisation algorithm that minimises the loss function."
  },
  {
    q: "Learning rate controls:",
    opts: ["Batch size", "Step size in optimisation", "Model depth", "Tokenisation"],
    correct: 1,
    feedback: "Learning rate determines how large each optimisation step is during training."
  },
  {
    q: "Too high a learning rate tends to cause:",
    opts: ["Faster stable convergence", "Instability/divergence", "Less memory use", "More accuracy"],
    correct: 1,
    feedback: "A learning rate that's too high can cause the optimisation to overshoot and diverge."
  },
  {
    q: "LLMs are trained mostly via:",
    opts: ["Fully supervised labels", "Self-supervised learning", "No training needed", "Manual rules"],
    correct: 1,
    feedback: "LLMs use self-supervised learning where labels come from the data itself (next-token prediction)."
  },
  {
    q: "Next-token prediction is closest to:",
    opts: ["Regression", "Classification over tokens", "Clustering", "Sorting"],
    correct: 1,
    feedback: "Next-token prediction is classification: choosing the most likely next token from a vocabulary."
  },
  {
    q: "Inference is:",
    opts: ["Adjusting weights", "Using trained weights to produce outputs", "Collecting labels", "Normalising data"],
    correct: 1,
    feedback: "Inference uses the trained model's weights to generate predictions on new inputs."
  },
  {
    q: "Training primarily does what?",
    opts: ["Stores facts", "Adjusts weights to reduce loss", "Queries databases", "Enforces JSON"],
    correct: 1,
    feedback: "Training adjusts model weights to minimise the loss function on the training data."
  },
  {
    q: "Overfitting primarily harms:",
    opts: ["Training accuracy", "Generalisation to new data", "GPU speed", "Token limits"],
    correct: 1,
    feedback: "Overfitting results in poor generalisation to new, unseen data."
  },
  {
    q: "Data bias can lead to:",
    opts: ["Neutral behaviour", "Biased model outputs", "No effect", "Lower token counts"],
    correct: 1,
    feedback: "Models reflect biases in their training data, leading to biased outputs."
  },
  {
    q: "Which is regression?",
    opts: ["Spam vs not spam", "Predicting house prices", "Fraud vs not fraud", "Sentiment label"],
    correct: 1,
    feedback: "Regression predicts continuous values like house prices; classification predicts categories."
  },
  {
    q: "Which is classification?",
    opts: ["Predicting interest rate level", "Predicting fraud/not fraud", "Predicting a price", "Predicting a duration"],
    correct: 1,
    feedback: "Classification predicts discrete categories like fraud/not fraud."
  },
  {
    q: "Depth enables:",
    opts: ["Only linear behaviour", "Hierarchical feature learning", "No overfitting", "No training"],
    correct: 1,
    feedback: "Deep networks can learn hierarchical representations, from simple to complex features."
  },
  {
    q: "Backpropagation is:",
    opts: ["A plotting library", "Propagate error backward to update weights", "A database", "A tokeniser"],
    correct: 1,
    feedback: "Backpropagation propagates error gradients backward through the network to update weights."
  },
  {
    q: "Too many epochs can cause:",
    opts: ["Underfitting", "Overfitting", "No learning", "No inference"],
    correct: 1,
    feedback: "Training for too many epochs can lead to overfitting the training data."
  },
  {
    q: "GenAI refers to:",
    opts: ["Only classification", "Models that generate new content", "Only regression", "Only clustering"],
    correct: 1,
    feedback: "Generative AI creates new content (text, images, etc.) rather than just classifying existing content."
  },
  {
    q: "PyTorch is known for being:",
    opts: ["Non-Pythonic", "Pythonic and easy to debug", "Only for spreadsheets", "A database"],
    correct: 1,
    feedback: "PyTorch has an imperative, Pythonic design that makes debugging intuitive."
  },
  {
    q: "Keras is best described as:",
    opts: ["Low-level tensor lib", "High-level API on TensorFlow", "Vector DB", "Tokenizer"],
    correct: 1,
    feedback: "Keras provides a high-level API that makes building neural networks fast and accessible."
  },
  {
    q: "LLMs are NOT:",
    opts: ["Deep neural networks", "Databases that store facts", "Trained models", "Token predictors"],
    correct: 1,
    feedback: "LLMs are statistical models, not databases. They don't 'store' facts; they learn patterns."
  },
  {
    q: "Optimisation aims to:",
    opts: ["Increase loss", "Minimise loss", "Increase randomness", "Reduce layers"],
    correct: 1,
    feedback: "The goal of optimisation is to minimise the loss function during training."
  },
  {
    q: "Why is training expensive?",
    opts: ["Uses Excel", "Updates many parameters over lots of data", "Only runs once", "Requires JSON"],
    correct: 1,
    feedback: "Training requires updating billions of parameters over massive datasets repeatedly."
  },
  {
    q: "Why can LLMs hallucinate?",
    opts: ["They verify facts", "They generalise patterns without grounding", "They never generalise", "They use SQL"],
    correct: 1,
    feedback: "LLMs predict likely tokens based on patterns, not verified facts, leading to hallucinations."
  },
  {
    q: "RAG mainly provides:",
    opts: ["More layers", "Grounded external context", "Higher temperature", "Faster training"],
    correct: 1,
    feedback: "RAG (Retrieval-Augmented Generation) provides grounded context from external sources."
  },
  {
    q: "Garbage in, garbage out refers to:",
    opts: ["Tokenisation", "Data quality shaping behaviour", "GPU speed", "Learning rate"],
    correct: 1,
    feedback: "Poor quality input data leads to poor quality model behaviour."
  },
  {
    q: "Validation sets help to:",
    opts: ["Make training slower", "Measure generalisation", "Increase tokens", "Avoid weights"],
    correct: 1,
    feedback: "Validation sets measure how well the model generalises to unseen data."
  },
  {
    q: "Activation functions are needed because:",
    opts: ["Reduce data", "Allow non-linear boundaries", "Increase epochs", "Prevent training"],
    correct: 1,
    feedback: "Without non-linear activations, neural networks could only learn linear relationships."
  },
  {
    q: "Self-supervised learning scales because:",
    opts: ["Needs no data", "Labels come from data itself", "Requires manual labels", "Uses no compute"],
    correct: 1,
    feedback: "Self-supervised learning doesn't require manual labelling, enabling training on vast datasets."
  },
  {
    q: "Training vs inference difference is:",
    opts: ["Same thing", "Training adjusts weights; inference uses them", "Inference adjusts weights", "Training always faster"],
    correct: 1,
    feedback: "Training learns the weights; inference applies them to generate outputs."
  }
];

const writtenPool = [
  {
    q: "Explain the relationship between AI, ML, DL, and LLMs.",
    sample: "AI is the broadest umbrella (machines exhibiting intelligent behaviour). ML is a subset of AI where systems learn from data. DL is a subset of ML using neural networks with many layers. LLMs are deep learning models trained for language generation, combining DL with generative AI."
  },
  {
    q: "Why does overfitting harm generalisation?",
    sample: "Overfitting means the model has memorised the training data instead of learning general patterns. It performs well on training data but poorly on new, unseen data because it hasn't learned the underlying relationships—only the specific examples it was shown."
  },
  {
    q: "Explain why LLM hallucinations are expected from training dynamics.",
    sample: "LLMs are trained to predict the most likely next token based on patterns in training data. They learn statistical patterns, not truth. When asked about topics outside their training or when patterns conflict, they generate plausible-sounding but incorrect content because they optimise for likelihood, not accuracy."
  },
  {
    q: "What is the role of a loss function in training?",
    sample: "A loss function measures the error between the model's predictions and the actual target values. It provides the signal that gradient descent uses to adjust weights. Lower loss means better predictions, so training aims to minimise the loss function."
  },
  {
    q: "Why does learning rate affect stability?",
    sample: "Learning rate controls how large each weight update step is. Too small and training is slow; too large and the optimisation can overshoot the minimum and diverge. Finding the right learning rate is critical for stable, efficient training."
  },
  {
    q: "Explain training vs inference in plain terms.",
    sample: "Training is the learning phase where the model adjusts its weights by seeing many examples and learning patterns. Inference is using those learned weights to make predictions on new data. Training is expensive and happens once (or periodically); inference is cheap and happens continuously."
  },
  {
    q: "Why is data quality critical in financial models?",
    sample: "Financial models make high-stakes decisions. Biased or noisy data leads to biased or unreliable predictions—bad loans approved, good customers rejected. In regulated environments, poor data quality can cause compliance failures and financial losses."
  },
  {
    q: "Why are activation functions needed?",
    sample: "Without activation functions, neural networks are just linear transformations stacked together, which collapse into a single linear transformation. Activation functions introduce non-linearity, allowing networks to learn complex, non-linear patterns in data."
  },
  {
    q: "Explain gradient descent using an analogy.",
    sample: "Imagine you're on a foggy mountain trying to reach the bottom. You can't see far, but you can feel which way is downhill at your feet. Gradient descent works the same way—it looks at the local slope (gradient) and takes a step downhill (in the direction that reduces loss)."
  },
  {
    q: "What is an epoch and why does it matter?",
    sample: "An epoch is one complete pass through the entire training dataset. Too few epochs and the model hasn't learned enough (underfitting). Too many and it memorises the training data (overfitting). The number of epochs is a key hyperparameter to tune."
  },
  {
    q: "Compare PyTorch and Keras at a high level.",
    sample: "PyTorch is imperative and Pythonic—you write code that executes immediately, making debugging intuitive. Keras (on TensorFlow) is more declarative—you define a model structure and compile it. PyTorch is often preferred for research; Keras for quick prototyping."
  },
  {
    q: "How does classification differ from regression?",
    sample: "Classification predicts discrete categories (spam/not spam, fraud/genuine). Regression predicts continuous numerical values (house price, temperature). The loss functions and output layers differ accordingly."
  },
  {
    q: "Why is training alone insufficient for enterprise correctness?",
    sample: "Training teaches patterns from past data, not current truth. Models can't know facts that changed after training, can't verify information, and may hallucinate. Enterprise use requires grounding, validation, human review, and connecting models to authoritative data sources."
  },
  {
    q: "Explain why RAG is needed after LLMs.",
    sample: "LLMs generate based on training patterns but can't access current information or verify facts. RAG retrieves relevant, authoritative documents and provides them as context, grounding LLM outputs in real evidence. This reduces hallucinations and enables citing sources."
  },
  {
    q: "How can overfitting show up in a bank fraud model?",
    sample: "An overfit fraud model memorises past fraud patterns exactly but fails to detect new fraud tactics. It might have 99% accuracy on historical data but miss evolving fraud schemes, leading to significant financial losses when deployed."
  },
  {
    q: "Name three things that influence model behaviour besides code.",
    sample: "1) Training data quality and biases, 2) Hyperparameters (learning rate, batch size, epochs), 3) Model architecture (layers, neurons), 4) Loss function choice, 5) Optimiser selection. The same code with different data or settings produces very different models."
  },
  {
    q: "Explain what weights represent and why they matter.",
    sample: "Weights are the learnable parameters that determine how inputs are transformed into outputs. Each weight represents the importance of a connection. Training adjusts weights to minimise loss. The final weights encode all the patterns the model has learned."
  },
  {
    q: "What does 'deep' add compared to shallow models?",
    sample: "Depth (many layers) allows hierarchical feature learning. Early layers learn simple features; later layers combine them into complex concepts. A shallow network might detect edges; a deep network can combine edges into shapes, shapes into objects. This enables learning more abstract representations."
  }
];

// Shuffle array in place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let selectedMCQs = [];
let selectedWritten = [];
let userAnswers = {};

function startQuiz() {
  userAnswers = {};
  document.getElementById('quiz-intro').classList.add('hidden');
  document.getElementById('quiz-results').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');

  // Select 3 random MCQs and 2 random written questions
  selectedMCQs = shuffle([...mcqPool]).slice(0, 3);
  selectedWritten = shuffle([...writtenPool]).slice(0, 2);

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

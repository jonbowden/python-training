# My Progress

```{raw} html
<style>
.dashboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
.not-logged-in {
    text-align: center;
    padding: 40px;
    background: #f3f4f6;
    border-radius: 8px;
}
.not-logged-in a {
    display: inline-block;
    margin-top: 15px;
    padding: 10px 30px;
    background: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}
.user-header {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
}
.user-header h2 {
    margin: 0 0 10px 0;
    color: white;
}
.user-header p {
    margin: 0;
    opacity: 0.9;
}
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}
.stat-card {
    background: #f3f4f6;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}
.stat-card .number {
    font-size: 2em;
    font-weight: bold;
    color: #2563eb;
}
.stat-card .label {
    color: #666;
    font-size: 0.9em;
}
.transcript-section h3 {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
}
.transcript-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}
.transcript-table th,
.transcript-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}
.transcript-table th {
    background: #f3f4f6;
    font-weight: 600;
}
.transcript-table tr:hover {
    background: #f9fafb;
}
.score-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9em;
}
.score-pass {
    background: #d1fae5;
    color: #059669;
}
.score-fail {
    background: #fee2e2;
    color: #dc2626;
}
.no-scores {
    text-align: center;
    padding: 40px;
    color: #666;
    background: #f9fafb;
    border-radius: 8px;
}
.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}
.refresh-btn {
    padding: 8px 16px;
    background: #f3f4f6;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}
.refresh-btn:hover {
    background: #e5e7eb;
}
</style>

<div class="dashboard-container">
    <div id="not-logged-in" class="not-logged-in" style="display: none;">
        <h3>Please log in to view your progress</h3>
        <p>You need to be logged in to see your quiz scores and transcript.</p>
        <a href="login.html">Login / Register</a>
    </div>

    <div id="dashboard-content" style="display: none;">
        <div class="user-header">
            <h2>Welcome, <span id="dash-user-name"></span>!</h2>
            <p><span id="dash-user-email"></span></p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="number" id="stat-quizzes">0</div>
                <div class="label">Quizzes Taken</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-avg">0%</div>
                <div class="label">Average Score</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-best">0%</div>
                <div class="label">Best Score</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-passed">0</div>
                <div class="label">Passed (70%+)</div>
            </div>
        </div>

        <div class="transcript-section">
            <h3>Quiz History <button class="refresh-btn" onclick="loadTranscript()">Refresh</button></h3>
            <div id="transcript-loading" class="loading">Loading your scores...</div>
            <div id="transcript-empty" class="no-scores" style="display: none;">
                <p>You haven't taken any quizzes yet.</p>
                <p>Start with <a href="01_quiz.html">Module 1 Quiz</a> to begin tracking your progress!</p>
            </div>
            <table id="transcript-table" class="transcript-table" style="display: none;">
                <thead>
                    <tr>
                        <th>Quiz</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="transcript-body">
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
// ============ CONFIGURATION ============
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
const AUTH_KEY = 'codevision_auth';

function getAuth() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

async function loadTranscript() {
    const auth = getAuth();
    if (!auth || !auth.token) {
        document.getElementById('not-logged-in').style.display = 'block';
        document.getElementById('dashboard-content').style.display = 'none';
        return;
    }

    document.getElementById('not-logged-in').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
    document.getElementById('dash-user-name').textContent = auth.user.name;
    document.getElementById('dash-user-email').textContent = auth.user.email;

    document.getElementById('transcript-loading').style.display = 'block';
    document.getElementById('transcript-table').style.display = 'none';
    document.getElementById('transcript-empty').style.display = 'none';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getTranscript', token: auth.token })
        });
        const result = await response.json();

        document.getElementById('transcript-loading').style.display = 'none';

        if (result.success) {
            if (result.scores.length === 0) {
                document.getElementById('transcript-empty').style.display = 'block';
                updateStats([]);
            } else {
                displayScores(result.scores);
                updateStats(result.scores);
            }
        } else {
            document.getElementById('transcript-empty').innerHTML =
                '<p>Error loading scores: ' + (result.error || 'Unknown error') + '</p>';
            document.getElementById('transcript-empty').style.display = 'block';
        }
    } catch (err) {
        document.getElementById('transcript-loading').style.display = 'none';
        document.getElementById('transcript-empty').innerHTML =
            '<p>Connection error. Please try again.</p>';
        document.getElementById('transcript-empty').style.display = 'block';
    }
}

function displayScores(scores) {
    const tbody = document.getElementById('transcript-body');
    tbody.innerHTML = '';

    const quizNames = {
        'module1-quiz': 'Module 1: Python Foundations'
    };

    scores.forEach(score => {
        const row = document.createElement('tr');
        const passed = score.percentage >= 70;
        const date = new Date(score.timestamp).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        row.innerHTML = `
            <td>${quizNames[score.quizId] || score.quizId}</td>
            <td>${score.score}/${score.maxScore} (${score.percentage}%)</td>
            <td><span class="score-badge ${passed ? 'score-pass' : 'score-fail'}">${passed ? 'PASS' : 'FAIL'}</span></td>
            <td>${date}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('transcript-table').style.display = 'table';
}

function updateStats(scores) {
    const total = scores.length;
    const passed = scores.filter(s => s.percentage >= 70).length;
    const avg = total > 0 ? Math.round(scores.reduce((a, b) => a + b.percentage, 0) / total) : 0;
    const best = total > 0 ? Math.max(...scores.map(s => s.percentage)) : 0;

    document.getElementById('stat-quizzes').textContent = total;
    document.getElementById('stat-avg').textContent = avg + '%';
    document.getElementById('stat-best').textContent = best + '%';
    document.getElementById('stat-passed').textContent = passed;
}

document.addEventListener('DOMContentLoaded', loadTranscript);
</script>
```

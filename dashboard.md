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
.logout-btn {
    margin-top: 15px;
    padding: 8px 20px;
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}
.logout-btn:hover {
    background: rgba(255,255,255,0.3);
}
/* Assessment-specific styles */
.score-badge.score-assessment {
    background: #dbeafe;
    color: #1d4ed8;
}
.assessment-row {
    cursor: pointer;
}
.assessment-row:hover {
    background: #f0f9ff !important;
}
.assessment-details {
    display: none;
    background: #f8fafc;
    padding: 15px;
    border-left: 3px solid #2563eb;
    margin: 5px 0;
}
.assessment-details.expanded {
    display: block;
}
.exercise-scores {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 10px;
}
.exercise-score {
    background: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid #e5e7eb;
}
.exercise-score .name {
    font-size: 0.85em;
    color: #666;
}
.exercise-score .points {
    font-size: 1.2em;
    font-weight: bold;
    color: #2563eb;
}
.syntax-errors {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 5px;
    padding: 10px;
}
.syntax-errors h4 {
    color: #dc2626;
    margin: 0 0 10px 0;
    font-size: 0.9em;
}
.syntax-errors ul {
    margin: 0;
    padding-left: 20px;
    color: #991b1b;
    font-family: monospace;
    font-size: 0.85em;
}
.expand-icon {
    display: inline-block;
    width: 20px;
    transition: transform 0.2s;
}
.expand-icon.rotated {
    transform: rotate(90deg);
}
/* Admin Panel Styles */
.admin-panel {
    background: linear-gradient(135deg, #dc2626 0%, #9333ea 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
}
.admin-panel h3 {
    margin: 0 0 15px 0;
    color: white;
}
.admin-panel .admin-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}
.admin-panel select, .admin-panel input {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
}
.admin-panel select {
    min-width: 120px;
}
.admin-panel input {
    flex: 1;
    min-width: 200px;
}
.admin-panel button {
    padding: 10px 20px;
    background: white;
    color: #dc2626;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
}
.admin-panel button:hover {
    background: #f3f4f6;
}
.admin-panel button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.admin-panel .status-msg {
    margin-top: 10px;
    padding: 8px;
    border-radius: 5px;
    font-size: 0.9em;
}
.admin-panel .status-msg.success {
    background: rgba(255,255,255,0.2);
}
.admin-panel .status-msg.error {
    background: rgba(0,0,0,0.2);
}
/* Leaderboard Styles */
.leaderboard-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 14px;
    margin-bottom: 20px;
}
.leaderboard-link:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}
.leaderboard-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}
.leaderboard-modal.active {
    display: flex;
}
.leaderboard-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.leaderboard-header {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.leaderboard-header h2 {
    margin: 0;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
}
.leaderboard-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
}
.leaderboard-close:hover {
    background: rgba(255,255,255,0.3);
}
.leaderboard-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}
.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}
.leaderboard-table th,
.leaderboard-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}
.leaderboard-table th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
}
.leaderboard-table tr:hover {
    background: #fffbeb;
}
.rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.85em;
}
.rank-1 { background: #fef3c7; color: #d97706; }
.rank-2 { background: #e5e7eb; color: #4b5563; }
.rank-3 { background: #fed7aa; color: #c2410c; }
.rank-other { background: #f3f4f6; color: #6b7280; }
.points-badge {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 600;
}
.scoring-info {
    margin-top: 20px;
    border-top: 1px solid #e5e7eb;
    padding-top: 15px;
}
.scoring-toggle {
    background: none;
    border: 1px solid #e5e7eb;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 8px;
}
.scoring-toggle:hover {
    background: #f9fafb;
}
.scoring-details {
    display: none;
    margin-top: 15px;
    padding: 15px;
    background: #f9fafb;
    border-radius: 8px;
    font-size: 0.9em;
    line-height: 1.6;
}
.scoring-details.expanded {
    display: block;
}
.scoring-details h4 {
    margin: 0 0 10px 0;
    color: #374151;
}
.scoring-details ul {
    margin: 10px 0;
    padding-left: 20px;
}
.scoring-details li {
    margin: 5px 0;
}
.leaderboard-empty {
    text-align: center;
    padding: 40px;
    color: #6b7280;
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
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        </div>

        <div id="admin-panel" class="admin-panel" style="display: none;">
            <h3>Admin Panel</h3>
            <div class="admin-controls">
                <select id="grade-module">
                    <option value="1">Module 1</option>
                    <option value="2">Module 2</option>
                    <option value="3">Module 3</option>
                </select>
                <input type="email" id="grade-student" placeholder="Student email (optional - leave blank for all)">
                <button id="grade-btn" onclick="triggerGrading()">Grade Assessments</button>
            </div>
            <div id="grade-status"></div>
        </div>

        <h4 style="margin-bottom: 10px; color: #374151;">Quiz Progress</h4>
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

        <h4 style="margin-bottom: 10px; color: #374151;">Assessment Progress</h4>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="number" id="stat-assessments">0</div>
                <div class="label">Assessments Taken</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-assess-avg">0%</div>
                <div class="label">Average Score</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-assess-best">0%</div>
                <div class="label">Best Score</div>
            </div>
            <div class="stat-card">
                <div class="number" id="stat-assess-passed">0</div>
                <div class="label">Passed (70%+)</div>
            </div>
        </div>

        <button class="leaderboard-link" onclick="showLeaderboard()">
            <span>&#127942;</span> View Leaderboard
        </button>

        <div class="transcript-section">
            <h3>Progress History <button class="refresh-btn" onclick="loadTranscript()">Refresh</button></h3>
            <div id="transcript-loading" class="loading">Loading your scores...</div>
            <div id="transcript-empty" class="no-scores" style="display: none;">
                <p>You haven't completed any quizzes or assessments yet.</p>
                <p>Start with <a href="01_quiz.html">Module 1 Quiz</a> to begin tracking your progress!</p>
            </div>
            <table id="transcript-table" class="transcript-table" style="display: none;">
                <thead>
                    <tr>
                        <th>Activity</th>
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

<!-- Leaderboard Modal -->
<div id="leaderboard-modal" class="leaderboard-modal" onclick="closeLeaderboardOnBackdrop(event)">
    <div class="leaderboard-content" onclick="event.stopPropagation()">
        <div class="leaderboard-header">
            <h2><span>&#127942;</span> Leaderboard</h2>
            <button class="leaderboard-close" onclick="closeLeaderboard()">&times;</button>
        </div>
        <div class="leaderboard-body">
            <div id="leaderboard-loading" class="loading">Loading leaderboard...</div>
            <div id="leaderboard-empty" class="leaderboard-empty" style="display: none;">
                <p>No participants on the leaderboard yet.</p>
                <p>Complete quizzes and assessments to appear here!</p>
            </div>
            <table id="leaderboard-table" class="leaderboard-table" style="display: none;">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Activities</th>
                        <th>Best</th>
                        <th>Average</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body">
                </tbody>
            </table>
            <div class="scoring-info">
                <button class="scoring-toggle" onclick="toggleScoringInfo()">
                    <span id="scoring-icon">&#9654;</span> How scoring works
                </button>
                <div id="scoring-details" class="scoring-details">
                    <h4>Leaderboard Scoring (Max 100 Points)</h4>
                    <p>Your score combines <strong>effort</strong>, <strong>quality</strong>, and <strong>consistency</strong>:</p>
                    <ul>
                        <li><strong>Participation (20 pts max):</strong> 2 points per activity (max 5 quizzes + 5 assessments)</li>
                        <li><strong>Best Score (40 pts max):</strong> Your highest percentage score × 0.4</li>
                        <li><strong>Average Score (40 pts max):</strong> Your average percentage × 0.4</li>
                    </ul>
                    <h4>Fair Play Rules</h4>
                    <ul>
                        <li>Only your <strong>best attempt</strong> per quiz/assessment counts</li>
                        <li>Scores below <strong>30%</strong> don't count toward the leaderboard</li>
                        <li>Separate caps: max 5 quizzes and 5 assessments count for participation</li>
                        <li>Ties are broken by average score, then best score, then earliest participation</li>
                    </ul>
                    <p style="color: #6b7280; font-style: italic;">This system rewards consistent learning over gaming - focus on understanding, not just completion!</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// ============ CONFIGURATION ============
const API_URL = 'https://script.google.com/macros/s/AKfycby1sknmInGgsBQ--n3bBIlis-b-DpXYSJuSgNL_R9RJPW0Vg25uVtYddz0cvXuOSNpR/exec';
const AUTH_KEY = 'codevision_auth';

function getAuth() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

async function checkAdminStatus() {
    const auth = getAuth();
    if (!auth || !auth.token) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'checkAdmin', token: auth.token })
        });
        const result = await response.json();

        if (result.success && result.isAdmin) {
            document.getElementById('admin-panel').style.display = 'block';
        }
    } catch (err) {
        console.error('Admin check failed:', err);
    }
}

async function triggerGrading() {
    const auth = getAuth();
    if (!auth || !auth.token) return;

    const module = document.getElementById('grade-module').value;
    const studentEmail = document.getElementById('grade-student').value.trim();
    const btn = document.getElementById('grade-btn');
    const status = document.getElementById('grade-status');

    btn.disabled = true;
    btn.textContent = 'Triggering...';
    status.innerHTML = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'triggerGrading',
                token: auth.token,
                module: module,
                studentEmail: studentEmail
            })
        });
        const result = await response.json();

        if (result.success) {
            status.innerHTML = '<div class="status-msg success">Grading workflow started! Check GitHub Actions for progress.</div>';
        } else {
            status.innerHTML = '<div class="status-msg error">Error: ' + (result.error || 'Unknown error') + '</div>';
        }
    } catch (err) {
        status.innerHTML = '<div class="status-msg error">Connection error: ' + err.message + '</div>';
    }

    btn.disabled = false;
    btn.textContent = 'Grade Assessments';
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
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
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

    const activityNames = {
        'module1-quiz': 'Module 1: Quiz',
        'module1-assessment': 'Module 1: Assessment',
        'module2-quiz': 'Module 2: Quiz',
        'module2-assessment': 'Module 2: Assessment',
        'module3-quiz': 'Module 3: Quiz',
        'module3-assessment': 'Module 3: Assessment'
    };

    scores.forEach((score, index) => {
        const isAssessment = score.quizId && score.quizId.includes('-assessment');
        const passed = score.percentage >= 70;
        const date = new Date(score.timestamp).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const row = document.createElement('tr');
        if (isAssessment) {
            row.className = 'assessment-row';
            row.onclick = () => toggleAssessmentDetails(index);
        }

        const badgeClass = isAssessment ? 'score-assessment' : (passed ? 'score-pass' : 'score-fail');
        const badgeText = isAssessment ? 'ASSESSMENT' : (passed ? 'PASS' : 'FAIL');
        const expandIcon = isAssessment ? '<span class="expand-icon" id="icon-' + index + '">&#9654;</span> ' : '';

        row.innerHTML = `
            <td>${expandIcon}${activityNames[score.quizId] || score.quizId}</td>
            <td>${score.score}/${score.maxScore} (${score.percentage}%)</td>
            <td><span class="score-badge ${badgeClass}">${badgeText}</span></td>
            <td>${date}</td>
        `;
        tbody.appendChild(row);

        // Add expandable details row for assessments
        if (isAssessment && score.details) {
            const detailsRow = document.createElement('tr');
            detailsRow.innerHTML = `<td colspan="4" style="padding: 0;"><div class="assessment-details" id="details-${index}">${renderAssessmentDetails(score.details)}</div></td>`;
            tbody.appendChild(detailsRow);
        }
    });

    document.getElementById('transcript-table').style.display = 'table';
}

function toggleAssessmentDetails(index) {
    const details = document.getElementById('details-' + index);
    const icon = document.getElementById('icon-' + index);
    if (details) {
        details.classList.toggle('expanded');
        if (icon) {
            icon.classList.toggle('rotated');
        }
    }
}

function renderAssessmentDetails(details) {
    // Check for syntax errors first
    if (details.syntax_errors && details.syntax_errors.length > 0) {
        return `
            <div class="syntax-errors">
                <h4>Syntax Errors (Code could not be executed)</h4>
                <ul>
                    ${details.syntax_errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Show exercise scores with feedback
    if (details.exercise_scores) {
        const exercises = Object.entries(details.exercise_scores);
        const feedback = details.feedback || {};

        return `
            <div class="exercise-scores">
                ${exercises.map(([name, scores]) => `
                    <div class="exercise-score" style="text-align: left;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div class="name" style="font-weight: 600;">${escapeHtml(name)}</div>
                            <div class="points">${scores[0]}/${scores[1]}</div>
                        </div>
                        ${feedback[name] ? `
                            <div class="feedback-list" style="font-size: 0.85em; line-height: 1.4;">
                                ${feedback[name].map(fb => `
                                    <div style="color: ${fb.startsWith('✓') ? '#059669' : '#dc2626'}; margin: 2px 0;">
                                        ${escapeHtml(fb)}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Fallback for other details
    if (details.error) {
        return `<p style="color: #dc2626;">${escapeHtml(details.error)}</p>`;
    }
    if (details.reason) {
        return `<p style="color: #666;">${escapeHtml(details.reason)}</p>`;
    }

    return '<p style="color: #666;">No additional details available.</p>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateStats(scores) {
    // Separate quizzes and assessments
    const quizzes = scores.filter(s => !s.quizId || !s.quizId.includes('-assessment'));
    const assessments = scores.filter(s => s.quizId && s.quizId.includes('-assessment'));

    // Quiz stats
    const quizTotal = quizzes.length;
    const quizPassed = quizzes.filter(s => s.percentage >= 70).length;
    const quizAvg = quizTotal > 0 ? Math.round(quizzes.reduce((a, b) => a + b.percentage, 0) / quizTotal) : 0;
    const quizBest = quizTotal > 0 ? Math.max(...quizzes.map(s => s.percentage)) : 0;

    document.getElementById('stat-quizzes').textContent = quizTotal;
    document.getElementById('stat-avg').textContent = quizAvg + '%';
    document.getElementById('stat-best').textContent = quizBest + '%';
    document.getElementById('stat-passed').textContent = quizPassed;

    // Assessment stats
    const assessTotal = assessments.length;
    const assessPassed = assessments.filter(s => s.percentage >= 70).length;
    const assessAvg = assessTotal > 0 ? Math.round(assessments.reduce((a, b) => a + b.percentage, 0) / assessTotal) : 0;
    const assessBest = assessTotal > 0 ? Math.max(...assessments.map(s => s.percentage)) : 0;

    document.getElementById('stat-assessments').textContent = assessTotal;
    document.getElementById('stat-assess-avg').textContent = assessAvg + '%';
    document.getElementById('stat-assess-best').textContent = assessBest + '%';
    document.getElementById('stat-assess-passed').textContent = assessPassed;
}

// ============ LEADERBOARD ============

function showLeaderboard() {
    document.getElementById('leaderboard-modal').classList.add('active');
    loadLeaderboard();
}

function closeLeaderboard() {
    document.getElementById('leaderboard-modal').classList.remove('active');
}

function closeLeaderboardOnBackdrop(event) {
    if (event.target === document.getElementById('leaderboard-modal')) {
        closeLeaderboard();
    }
}

function toggleScoringInfo() {
    const details = document.getElementById('scoring-details');
    const icon = document.getElementById('scoring-icon');
    details.classList.toggle('expanded');
    icon.innerHTML = details.classList.contains('expanded') ? '&#9660;' : '&#9654;';
}

async function loadLeaderboard() {
    document.getElementById('leaderboard-loading').style.display = 'block';
    document.getElementById('leaderboard-table').style.display = 'none';
    document.getElementById('leaderboard-empty').style.display = 'none';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'getLeaderboard' })
        });
        const result = await response.json();

        document.getElementById('leaderboard-loading').style.display = 'none';

        if (result.success) {
            if (result.leaderboard.length === 0) {
                document.getElementById('leaderboard-empty').style.display = 'block';
            } else {
                displayLeaderboard(result.leaderboard);
            }
        } else {
            document.getElementById('leaderboard-empty').innerHTML =
                '<p>Error loading leaderboard: ' + (result.error || 'Unknown error') + '</p>';
            document.getElementById('leaderboard-empty').style.display = 'block';
        }
    } catch (err) {
        document.getElementById('leaderboard-loading').style.display = 'none';
        document.getElementById('leaderboard-empty').innerHTML =
            '<p>Connection error. Please try again.</p>';
        document.getElementById('leaderboard-empty').style.display = 'block';
    }
}

function displayLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    leaderboard.forEach(entry => {
        const row = document.createElement('tr');

        // Display medals for top 3, numbers for others
        let rankDisplay = '';
        if (entry.rank === 1) {
            rankDisplay = '<span style="font-size: 1.5em;">🥇</span>';
        } else if (entry.rank === 2) {
            rankDisplay = '<span style="font-size: 1.5em;">🥈</span>';
        } else if (entry.rank === 3) {
            rankDisplay = '<span style="font-size: 1.5em;">🥉</span>';
        } else {
            rankDisplay = `<span class="rank-badge rank-other">${entry.rank}</span>`;
        }

        row.innerHTML = `
            <td>${rankDisplay}</td>
            <td>${escapeHtml(entry.name)}</td>
            <td>${entry.submissions}</td>
            <td>${entry.bestScore}%</td>
            <td>${entry.avgScore}%</td>
            <td><span class="points-badge">${entry.totalPoints}</span></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('leaderboard-table').style.display = 'table';
}

document.addEventListener('DOMContentLoaded', () => {
    loadTranscript();
    checkAdminStatus();
});
</script>
```

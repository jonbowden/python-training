# Welcome to CodeVision Academy

```{raw} html
<style>
/* Announcement Styles */
.announcement-container {
    margin: 20px 0 30px 0;
}
.announcement-box {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    display: none;
}
.announcement-box.visible {
    display: block;
}
.announcement-box h4 {
    margin: 0 0 10px 0;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
}
.announcement-box .announcement-content {
    line-height: 1.6;
}
.announcement-box .announcement-meta {
    margin-top: 12px;
    font-size: 0.85em;
    opacity: 0.8;
}
.announcement-box .no-announcement {
    opacity: 0.7;
    font-style: italic;
}
.view-history-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    color: white;
    padding: 6px 14px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    margin-top: 10px;
}
.view-history-btn:hover {
    background: rgba(255,255,255,0.3);
}

/* Admin Announcement Panel */
.admin-announcement-panel {
    background: linear-gradient(135deg, #dc2626 0%, #9333ea 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
    display: none;
}
.admin-announcement-panel.visible {
    display: block;
}
.admin-announcement-panel h4 {
    margin: 0 0 15px 0;
    color: white;
}
.admin-announcement-panel textarea {
    width: 100%;
    min-height: 80px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    box-sizing: border-box;
}
.admin-announcement-panel .btn-row {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
.admin-announcement-panel button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
}
.admin-announcement-panel .post-btn {
    background: white;
    color: #dc2626;
}
.admin-announcement-panel .post-btn:hover {
    background: #f3f4f6;
}
.admin-announcement-panel .post-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.admin-announcement-panel .delete-btn {
    background: rgba(0,0,0,0.2);
    color: white;
}
.admin-announcement-panel .delete-btn:hover {
    background: rgba(0,0,0,0.3);
}
.admin-announcement-panel .status-msg {
    margin-top: 10px;
    padding: 8px;
    border-radius: 5px;
    font-size: 0.9em;
}
.admin-announcement-panel .status-msg.success {
    background: rgba(255,255,255,0.2);
}
.admin-announcement-panel .status-msg.error {
    background: rgba(0,0,0,0.2);
}

/* Announcement History Modal */
.history-modal {
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
.history-modal.active {
    display: flex;
}
.history-content {
    background: white;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.history-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.history-header h3 {
    margin: 0;
    color: white;
}
.history-close {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
}
.history-close:hover {
    background: rgba(255,255,255,0.3);
}
.history-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}
.history-item {
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
}
.history-item:last-child {
    border-bottom: none;
}
.history-item .content {
    margin-bottom: 8px;
    line-height: 1.5;
}
.history-item .meta {
    font-size: 0.85em;
    color: #6b7280;
}
.history-item .current-badge {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    margin-left: 8px;
}
.history-item .delete-history-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #fee2e2;
    color: #dc2626;
    border: none;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8em;
}
.history-item .delete-history-btn:hover {
    background: #fecaca;
}
.history-empty {
    text-align: center;
    padding: 40px;
    color: #6b7280;
}
</style>

<div class="announcement-container">
    <!-- Current Announcement Display -->
    <div id="announcement-box" class="announcement-box">
        <h4><span>&#128227;</span> Announcement</h4>
        <div id="announcement-content" class="announcement-content"></div>
        <div id="announcement-meta" class="announcement-meta"></div>
        <button class="view-history-btn" onclick="showAnnouncementHistory()">View History</button>
    </div>

    <!-- Admin Panel for Announcements -->
    <div id="admin-announcement-panel" class="admin-announcement-panel">
        <h4>Post Announcement</h4>
        <textarea id="announcement-text" placeholder="Enter announcement text..."></textarea>
        <div class="btn-row">
            <button id="post-announcement-btn" class="post-btn" onclick="postAnnouncement()">Post Announcement</button>
            <button id="delete-current-btn" class="delete-btn" onclick="deleteCurrentAnnouncement()" style="display: none;">Delete Current</button>
        </div>
        <div id="announcement-status"></div>
    </div>
</div>

<!-- Announcement History Modal -->
<div id="history-modal" class="history-modal" onclick="closeHistoryOnBackdrop(event)">
    <div class="history-content" onclick="event.stopPropagation()">
        <div class="history-header">
            <h3>Announcement History</h3>
            <button class="history-close" onclick="closeAnnouncementHistory()">&times;</button>
        </div>
        <div class="history-body">
            <div id="history-loading" style="text-align: center; padding: 40px; color: #666;">Loading...</div>
            <div id="history-empty" class="history-empty" style="display: none;">
                <p>No announcements have been posted yet.</p>
            </div>
            <div id="history-list"></div>
        </div>
    </div>
</div>

<script>
// Announcement System
const ANNOUNCEMENT_API_URL = 'https://script.google.com/macros/s/AKfycby1sknmInGgsBQ--n3bBIlis-b-DpXYSJuSgNL_R9RJPW0Vg25uVtYddz0cvXuOSNpR/exec';
const AUTH_KEY = 'codevision_auth';

let currentAnnouncementId = null;
let isAdmin = false;

function getAuth() {
    try {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    } catch {
        return null;
    }
}

async function checkAnnouncementAdminStatus() {
    const auth = getAuth();
    if (!auth || !auth.token) return false;

    try {
        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'checkAdmin', token: auth.token })
        });
        const result = await response.json();
        return result.success && result.isAdmin;
    } catch (err) {
        console.error('Admin check failed:', err);
        return false;
    }
}

async function loadAnnouncements() {
    try {
        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'getAnnouncements' })
        });
        const result = await response.json();

        if (result.success && result.current) {
            displayCurrentAnnouncement(result.current);
        } else {
            // No current announcement - hide the box for non-admins
            if (!isAdmin) {
                document.getElementById('announcement-box').classList.remove('visible');
            }
        }
    } catch (err) {
        console.error('Failed to load announcements:', err);
    }
}

function displayCurrentAnnouncement(announcement) {
    const box = document.getElementById('announcement-box');
    const contentEl = document.getElementById('announcement-content');
    const metaEl = document.getElementById('announcement-meta');
    const deleteBtn = document.getElementById('delete-current-btn');

    currentAnnouncementId = announcement.id;
    contentEl.innerHTML = escapeHtml(announcement.content).replace(/\n/g, '<br>');

    const date = new Date(announcement.timestamp).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    metaEl.textContent = `Posted by ${announcement.author} on ${date}`;

    box.classList.add('visible');

    if (isAdmin && deleteBtn) {
        deleteBtn.style.display = 'inline-block';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function postAnnouncement() {
    const auth = getAuth();
    if (!auth || !auth.token) {
        alert('You must be logged in to post announcements.');
        return;
    }

    const text = document.getElementById('announcement-text').value.trim();
    if (!text) {
        alert('Please enter announcement text.');
        return;
    }

    const btn = document.getElementById('post-announcement-btn');
    const status = document.getElementById('announcement-status');

    btn.disabled = true;
    btn.textContent = 'Posting...';
    status.innerHTML = '';

    try {
        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'postAnnouncement',
                token: auth.token,
                content: text,
                authorName: auth.user.name,
                authorEmail: auth.user.email
            })
        });
        const result = await response.json();

        if (result.success) {
            status.innerHTML = '<div class="status-msg success">Announcement posted successfully!</div>';
            document.getElementById('announcement-text').value = '';
            loadAnnouncements();
        } else {
            status.innerHTML = '<div class="status-msg error">Error: ' + (result.error || 'Unknown error') + '</div>';
        }
    } catch (err) {
        status.innerHTML = '<div class="status-msg error">Connection error: ' + err.message + '</div>';
    }

    btn.disabled = false;
    btn.textContent = 'Post Announcement';
}

async function deleteCurrentAnnouncement() {
    if (!currentAnnouncementId) return;
    if (!confirm('Are you sure you want to delete the current announcement?')) return;

    await deleteAnnouncement(currentAnnouncementId);
}

async function deleteAnnouncement(announcementId) {
    const auth = getAuth();
    if (!auth || !auth.token) return;

    try {
        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'deleteAnnouncement',
                token: auth.token,
                announcementId: announcementId
            })
        });
        const result = await response.json();

        if (result.success) {
            loadAnnouncements();
            loadAnnouncementHistory();
        } else {
            alert('Error deleting announcement: ' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Connection error: ' + err.message);
    }
}

function showAnnouncementHistory() {
    document.getElementById('history-modal').classList.add('active');
    loadAnnouncementHistory();
}

function closeAnnouncementHistory() {
    document.getElementById('history-modal').classList.remove('active');
}

function closeHistoryOnBackdrop(event) {
    if (event.target === document.getElementById('history-modal')) {
        closeAnnouncementHistory();
    }
}

async function loadAnnouncementHistory() {
    const loading = document.getElementById('history-loading');
    const empty = document.getElementById('history-empty');
    const list = document.getElementById('history-list');

    loading.style.display = 'block';
    empty.style.display = 'none';
    list.innerHTML = '';

    try {
        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'getAnnouncements' })
        });
        const result = await response.json();

        loading.style.display = 'none';

        if (result.success && result.history && result.history.length > 0) {
            result.history.forEach(item => {
                const div = document.createElement('div');
                div.className = 'history-item';

                const date = new Date(item.timestamp).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const isCurrent = item.id === currentAnnouncementId;
                const currentBadge = isCurrent ? '<span class="current-badge">CURRENT</span>' : '';
                const deleteBtn = isAdmin ? `<button class="delete-history-btn" onclick="deleteAnnouncement('${item.id}')">Delete</button>` : '';

                div.innerHTML = `
                    <div class="content">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>
                    <div class="meta">Posted by ${escapeHtml(item.author)} on ${date}${currentBadge}</div>
                    ${deleteBtn}
                `;
                list.appendChild(div);
            });
        } else {
            empty.style.display = 'block';
        }
    } catch (err) {
        loading.style.display = 'none';
        empty.innerHTML = '<p>Error loading history. Please try again.</p>';
        empty.style.display = 'block';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    isAdmin = await checkAnnouncementAdminStatus();

    if (isAdmin) {
        document.getElementById('admin-announcement-panel').classList.add('visible');
        document.getElementById('announcement-box').classList.add('visible');
    }

    // Load current announcements
    loadAnnouncements();
});
</script>
```

Welcome to the **CodeVision AI & Python Training Program** — a comprehensive, hands-on journey from Python fundamentals to building production-ready AI solutions.

This program is designed for professionals who want to understand and apply AI technologies in real-world business contexts. Whether you're starting from scratch or looking to formalise your existing knowledge, this training will take you from zero to confident AI practitioner.

---

## What You'll Learn

By the end of this program, you will be able to:

- Write clean, effective Python code for data processing and automation
- Understand how Large Language Models (LLMs) work and how to prompt them effectively
- Build and query vector databases using embeddings
- Create RAG (Retrieval-Augmented Generation) pipelines
- Develop AI agents that can automate complex tasks
- Design and implement end-to-end AI solutions for business problems

---

## Course Structure

| Module | Topic | Duration |
|--------|-------|----------|
| **1** | Python Foundations | 12 hours |
| **2** | Python for Data Work | 12 hours |
| **3** | LLM Fundamentals | 8 hours |
| **4** | Machine Learning & Deep Learning Foundations | 10 hours |
| **5** | Embeddings & Vector Databases | 8 hours |
| **6** | LLM APIs (Python) | 8 hours |
| **7** | RAG Pipelines | 12 hours |
| **8** | Agents & Automation | 8 hours |
| **9** | Capstone Project | 12 hours |
| | **Final Certification Exam** | 2 hours |

**Total Program Duration:** ~92 hours

---

## Module Overview

### Module 1: Python Foundations
*Zero-to-confident Python user.* Learn variables, types, control flow, functions, file handling, and JSON processing. Complete a mini-project processing real data.

### Module 2: Python for Data Work
*Build comfort with real-world data transformations.* Master Pandas for reading, filtering, and cleaning data. Create visualisations with matplotlib.

### Module 3: LLM Fundamentals
*Understand how LLMs work and how to call them safely.* Learn about tokenization, context windows, and API gateway access. Master temperature control, structured JSON output, and hallucination recognition. Understand API security for enterprise deployments.

### Module 4: Machine Learning & Deep Learning Foundations
*Build the theoretical foundation.* Understand core ML concepts, neural network architectures, and how deep learning powers modern AI. Bridge the gap between traditional programming and AI systems.

### Module 5: Embeddings & Vector Databases
*Your first "Aha!" moment.* Understand embeddings, cosine similarity, and FAISS. Build your first embed-store-query pipeline.

### Module 6: LLM APIs (Python)
*Make your first AI-powered application.* Call OpenAI, NVIDIA, or Ollama APIs. Handle streaming, retries, and errors.

### Module 7: RAG Pipelines
*Build production RAG solutions.* Learn chunking strategies, embedding pipelines, query rewriting, and retrieval evaluation.

### Module 8: Agents & Automation
*See the future of work.* Understand agent loops, tools, functions, and routing models. Build LLM-powered automation.

### Module 9: Capstone Project
*Bring it all together.* Build a complete end-to-end AI assistant for a real business problem.

---

## Certification

Complete the program by passing the **Final Certification Exam**:
- 20 MCQs on Python
- 20 MCQs on LLM concepts
- 1 coding problem
- 1 solution design question
- **Passmark: 70%**

---

## Getting Started

Use the navigation on the left to begin with **Module 1: Python Foundations**. Each module includes:
- Interactive lessons with runnable code
- Quizzes to test your understanding
- Additional resources for deeper learning

> **Note:** This is a practical, hands-on program. Every concept is tied to examples you'll reuse throughout your AI journey. Let's begin!

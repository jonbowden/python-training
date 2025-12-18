# Authentication Setup Guide

This guide walks you through setting up user authentication with Google Sheets for CodeVision Academy.

## Overview

The authentication system uses:
- **Google Sheets** to store user accounts and quiz scores
- **Google Apps Script** as a serverless backend API
- **Client-side JavaScript** for the login UI

---

## Step 1: Create the Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it **"CodeVision Academy Data"**
4. Note the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   Copy everything between `/d/` and `/edit`

---

## Step 2: Create the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. Name the project **"CodeVision API"**
4. Delete any existing code in `Code.gs`
5. Copy the entire contents of `google_apps_script/Code.gs` from this repository
6. Paste it into the Apps Script editor
7. Find this line near the top:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
8. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID from Step 1
9. Click **Save** (Ctrl+S)

---

## Step 3: Deploy the Apps Script as a Web App

1. In the Apps Script editor, click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Configure:
   - **Description**: "CodeVision API v1"
   - **Execute as**: "Me (jontybowden@gmail.com)"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. **Authorize** the app when prompted:
   - Click "Review Permissions"
   - Select your Google account
   - Click "Advanced" > "Go to CodeVision API (unsafe)"
   - Click "Allow"
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/XXXXX/exec`)

---

## Step 4: Update the Website Code

Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL in these files:

### 1. login.md
Find:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
Replace with your URL.

### 2. dashboard.md
Find:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
Replace with your URL.

### 3. 01_quiz.md
Find:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
Replace with your URL.

---

## Step 5: Test Locally

1. Build the site:
   ```bash
   jupyter-book build .
   ```

2. Start a local server:
   ```bash
   cd _build/html
   python -m http.server 8000
   ```

3. Open http://localhost:8000 in your browser

4. Test the flow:
   - Go to the Account page
   - Register a new account
   - Take a quiz
   - Check that your score appears in the dashboard

---

## Step 6: Deploy to GitHub Pages

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Add user authentication system"
   ```

2. Push to GitHub:
   ```bash
   git push
   ```

3. GitHub Actions will automatically rebuild and deploy the site

---

## Verification

### Check Google Sheets
After registering a user:
- Open your Google Spreadsheet
- You should see two sheets: **Users** and **Scores**
- The Users sheet will have the registered user
- The Scores sheet will have quiz results

### Check the Apps Script Logs
1. In Apps Script, click **Executions** in the left sidebar
2. You'll see logs of all API calls

---

## Troubleshooting

### "Connection error" on login
- Check that the API_URL is correct in all files
- Ensure the Apps Script is deployed and accessible

### "Invalid or expired token"
- Tokens expire after 7 days
- User needs to log in again

### Scores not saving
- Check browser console for errors (F12 > Console)
- Verify the API_URL in 01_quiz.md

### CORS errors
- The Apps Script is configured to allow all origins
- If issues persist, check that you deployed as "Anyone" can access

---

## Automated Grading Setup

The grading system uses GitHub Actions to automatically grade student notebook submissions every 30 minutes.

### GitHub Token in Apps Script (CODEVISION API)

The Apps Script needs a GitHub Personal Access Token to trigger grading workflows from the admin dashboard.

**Location:** Google Apps Script project **"CODEVISION API"** → Project Settings (⚙️) → Script Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxx` | GitHub PAT with `workflow` scope to trigger Actions |

**To create/update the GitHub token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with **`workflow`** scope
3. Copy the token
4. In Apps Script "CODEVISION API" project: ⚙️ Project Settings → Script Properties → Update `GITHUB_TOKEN`

**Note:** GitHub PATs expire (default 30 days). If grading stops working with a 401 "Bad credentials" error, regenerate the token.

### GitHub Repository Secrets

The GitHub Actions workflow needs these secrets (Settings → Secrets and variables → Actions):

| Secret | Value | Purpose |
|--------|-------|---------|
| `GOOGLE_SERVICE_ACCOUNT` | Full JSON content of service account key | Authenticate with Google Drive/Sheets |
| `APPS_SCRIPT_URL` | `https://script.google.com/macros/s/.../exec` | Apps Script Web App URL |
| `ADMIN_API_KEY` | `CodeVisionGrading2024SecretKey` | Server-to-server auth for score submission |

### Service Account File

The Google service account credentials are stored locally at:
```
codevision-grading-fde1b2c3152a.json
```

This file should NOT be committed to git (add to .gitignore). The contents are stored in GitHub Secrets as `GOOGLE_SERVICE_ACCOUNT`.

---

## Security Notes

- Passwords are hashed using SHA-256 before storage
- Tokens are signed and expire after 7 days
- Google Sheets access is restricted to your account
- This is suitable for a training platform, not for highly sensitive data

---

## Adding More Quizzes

When you add new module quizzes, update the `QUIZ_ID` in each quiz file:
```javascript
const QUIZ_ID = 'module2-quiz';  // Unique ID for each quiz
```

Also update the quiz names mapping in `dashboard.md`:
```javascript
const quizNames = {
    'module1-quiz': 'Module 1: Python Foundations',
    'module2-quiz': 'Module 2: Python for Data Work',
    // Add more as needed
};
```

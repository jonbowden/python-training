/**
 * CodeVision Academy - Backend API
 * Deploy as Web App: Execute as "Me", Access "Anyone"
 *
 * Google Sheets Structure:
 * Sheet 1 "Users": email | password_hash | name | registered_date | last_login
 * Sheet 2 "Scores": email | quiz_id | score | max_score | percentage | timestamp | answers_json
 */

const SPREADSHEET_ID = '1qu1q-j7JjKbthKv_LhMuTaSiuQsJ1ic7eaes3wW4lBY';

// ============ HTTP HANDLERS ============

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const data = JSON.parse(e.postData.contents);
    let result;

    switch(data.action) {
      case 'register':
        result = registerUser(data.email, data.password, data.name);
        break;
      case 'login':
        result = loginUser(data.email, data.password);
        break;
      case 'submitScore':
        result = submitScore(data.token, data.quizId, data.score, data.maxScore, data.answers);
        break;
      case 'getTranscript':
        result = getTranscript(data.token);
        break;
      case 'validateToken':
        result = validateToken(data.token);
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'CodeVision API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ USER MANAGEMENT ============

function registerUser(email, password, name) {
  if (!email || !password || !name) {
    return { success: false, error: 'All fields are required' };
  }

  email = email.toLowerCase().trim();

  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users') || createUsersSheet(ss);

  // Check if user exists
  const users = usersSheet.getDataRange().getValues();
  for (let i = 1; i < users.length; i++) {
    if (users[i][0].toLowerCase() === email) {
      return { success: false, error: 'Email already registered' };
    }
  }

  // Hash password and store
  const passwordHash = hashPassword(password);
  const timestamp = new Date().toISOString();

  usersSheet.appendRow([email, passwordHash, name, timestamp, '']);

  // Generate session token
  const token = generateToken(email);

  return {
    success: true,
    message: 'Registration successful',
    token: token,
    user: { email: email, name: name }
  };
}

function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password required' };
  }

  email = email.toLowerCase().trim();

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users');

  if (!usersSheet) {
    return { success: false, error: 'No users registered yet' };
  }

  const users = usersSheet.getDataRange().getValues();
  const passwordHash = hashPassword(password);

  for (let i = 1; i < users.length; i++) {
    if (users[i][0].toLowerCase() === email && users[i][1] === passwordHash) {
      // Update last login
      usersSheet.getRange(i + 1, 5).setValue(new Date().toISOString());

      const token = generateToken(email);

      return {
        success: true,
        message: 'Login successful',
        token: token,
        user: { email: email, name: users[i][2] }
      };
    }
  }

  return { success: false, error: 'Invalid email or password' };
}

function validateToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) {
    return { success: false, error: 'Invalid or expired token' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users');
  const users = usersSheet.getDataRange().getValues();

  for (let i = 1; i < users.length; i++) {
    if (users[i][0].toLowerCase() === decoded.email) {
      return {
        success: true,
        user: { email: decoded.email, name: users[i][2] }
      };
    }
  }

  return { success: false, error: 'User not found' };
}

// ============ QUIZ SCORES ============

function submitScore(token, quizId, score, maxScore, answers) {
  const decoded = decodeToken(token);
  if (!decoded) {
    return { success: false, error: 'Invalid or expired token. Please log in again.' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const scoresSheet = ss.getSheetByName('Scores') || createScoresSheet(ss);

  const percentage = Math.round((score / maxScore) * 100);
  const timestamp = new Date().toISOString();
  const answersJson = JSON.stringify(answers || {});

  scoresSheet.appendRow([
    decoded.email,
    quizId,
    score,
    maxScore,
    percentage,
    timestamp,
    answersJson
  ]);

  return {
    success: true,
    message: 'Score saved successfully',
    data: {
      quizId: quizId,
      score: score,
      maxScore: maxScore,
      percentage: percentage
    }
  };
}

function getTranscript(token) {
  const decoded = decodeToken(token);
  if (!decoded) {
    return { success: false, error: 'Invalid or expired token' };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const scoresSheet = ss.getSheetByName('Scores');
  const usersSheet = ss.getSheetByName('Users');

  // Get user name
  let userName = decoded.email;
  if (usersSheet) {
    const users = usersSheet.getDataRange().getValues();
    for (let i = 1; i < users.length; i++) {
      if (users[i][0].toLowerCase() === decoded.email) {
        userName = users[i][2];
        break;
      }
    }
  }

  if (!scoresSheet) {
    return {
      success: true,
      user: { email: decoded.email, name: userName },
      scores: []
    };
  }

  const allScores = scoresSheet.getDataRange().getValues();
  const userScores = [];

  for (let i = 1; i < allScores.length; i++) {
    if (allScores[i][0].toLowerCase() === decoded.email) {
      userScores.push({
        quizId: allScores[i][1],
        score: allScores[i][2],
        maxScore: allScores[i][3],
        percentage: allScores[i][4],
        timestamp: allScores[i][5]
      });
    }
  }

  // Sort by timestamp descending
  userScores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    success: true,
    user: { email: decoded.email, name: userName },
    scores: userScores
  };
}

// ============ HELPER FUNCTIONS ============

function hashPassword(password) {
  const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + 'CodeVisionSalt2024');
  return Utilities.base64Encode(hash);
}

function generateToken(email) {
  const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  const payload = { email: email.toLowerCase(), exp: expiry };
  const payloadStr = JSON.stringify(payload);
  const encoded = Utilities.base64Encode(payloadStr);
  const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, encoded + 'CodeVisionSecret2024');
  const sig = Utilities.base64Encode(signature).substring(0, 16);
  return encoded + '.' + sig;
}

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const encoded = parts[0];
    const sig = parts[1];

    // Verify signature
    const expectedSig = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, encoded + 'CodeVisionSecret2024')
    ).substring(0, 16);

    if (sig !== expectedSig) return null;

    const payloadStr = Utilities.newBlob(Utilities.base64Decode(encoded)).getDataAsString();
    const payload = JSON.parse(payloadStr);

    // Check expiry
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch (e) {
    return null;
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function createUsersSheet(ss) {
  const sheet = ss.insertSheet('Users');
  sheet.appendRow(['email', 'password_hash', 'name', 'registered_date', 'last_login']);
  sheet.setFrozenRows(1);
  return sheet;
}

function createScoresSheet(ss) {
  const sheet = ss.insertSheet('Scores');
  sheet.appendRow(['email', 'quiz_id', 'score', 'max_score', 'percentage', 'timestamp', 'answers_json']);
  sheet.setFrozenRows(1);
  return sheet;
}

// ============ ADMIN FUNCTIONS (run manually) ============

function setupSpreadsheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  createUsersSheet(ss);
  createScoresSheet(ss);
  Logger.log('Spreadsheet setup complete');
}

function testAPI() {
  // Test registration
  const regResult = registerUser('test@example.com', 'password123', 'Test User');
  Logger.log('Registration: ' + JSON.stringify(regResult));

  // Test login
  const loginResult = loginUser('test@example.com', 'password123');
  Logger.log('Login: ' + JSON.stringify(loginResult));

  if (loginResult.success) {
    // Test score submission
    const scoreResult = submitScore(loginResult.token, 'module1-quiz', 4, 5, {});
    Logger.log('Score: ' + JSON.stringify(scoreResult));

    // Test transcript
    const transcriptResult = getTranscript(loginResult.token);
    Logger.log('Transcript: ' + JSON.stringify(transcriptResult));
  }
}

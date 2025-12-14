/**
 * Python Training - Notebook Submission Handler
 * Extensible for multiple module assessments
 *
 * SETUP:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Paste this code
 * 3. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL to the notebook submission cells
 *
 * FOLDER STRUCTURE:
 * My Drive/Python_Training_Submission/
 *   ├── Module_1/
 *   ├── Module_2/
 *   ├── Module_3/
 *   └── ...
 */

// Parent folder ID: Python_Training_Submission
const PARENT_FOLDER_ID = '1il2tcPvs2RwMmR8argOyMMimIxfO-aKe';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const studentName = data.studentName || 'Unknown';
    const studentEmail = data.studentEmail || 'unknown@email.com';
    const notebookContent = data.notebookContent;
    const moduleNumber = data.moduleNumber || '1';  // Default to Module 1
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Get or create the module subfolder
    const moduleFolder = getOrCreateModuleFolder(moduleNumber);

    // Create filename: email_Module1_timestamp.ipynb
    const safeName = studentEmail.replace(/[@.]/g, '_');
    const filename = `${safeName}_Module${moduleNumber}_${timestamp}.ipynb`;

    // Create the notebook file
    const file = moduleFolder.createFile(filename, notebookContent, 'application/json');

    // Log submission
    logSubmission(studentName, studentEmail, moduleNumber, filename, file.getUrl());

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Submission successful!',
        filename: filename,
        module: moduleNumber
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Submission failed: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Python Training Notebook Submission API',
      version: '2.0',
      supportedModules: ['1', '2', '3', '4', '5']
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get or create the module subfolder
 */
function getOrCreateModuleFolder(moduleNumber) {
  const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
  const folderName = `Module_${moduleNumber}`;

  // Check if folder exists
  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }

  // Create new folder
  return parentFolder.createFolder(folderName);
}

/**
 * Log submissions to a spreadsheet in the parent folder
 */
function logSubmission(name, email, module, filename, url) {
  try {
    const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    const logName = '_Submissions_Log';
    const logFiles = parentFolder.getFilesByName(logName);

    let spreadsheet;
    if (logFiles.hasNext()) {
      spreadsheet = SpreadsheetApp.open(logFiles.next());
    } else {
      spreadsheet = SpreadsheetApp.create(logName);
      DriveApp.getFileById(spreadsheet.getId()).moveTo(parentFolder);
      const sheet = spreadsheet.getActiveSheet();
      sheet.appendRow(['Timestamp', 'Student Name', 'Email', 'Module', 'Filename', 'File URL']);
      sheet.setFrozenRows(1);
    }

    const sheet = spreadsheet.getActiveSheet();
    sheet.appendRow([new Date(), name, email, `Module ${module}`, filename, url]);

  } catch (error) {
    console.log('Failed to log submission: ' + error);
  }
}

/**
 * Utility: List all submissions for a module
 */
function listModuleSubmissions(moduleNumber) {
  const folder = getOrCreateModuleFolder(moduleNumber);
  const files = folder.getFiles();
  const submissions = [];

  while (files.hasNext()) {
    const file = files.next();
    submissions.push({
      name: file.getName(),
      url: file.getUrl(),
      date: file.getDateCreated()
    });
  }

  return submissions;
}

/**
 * Module 1 Assessment - Notebook Submission Handler
 *
 * SETUP:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Paste this code
 * 3. Set FOLDER_ID to your Google Drive folder ID
 * 4. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL to the notebook submission cell
 */

// Google Drive folder ID where notebooks will be saved
const FOLDER_ID = '14F8N8KFYMbtTbHWDWFHshaVdmNyPxKHs';  // Update this!

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const studentName = data.studentName || 'Unknown';
    const studentEmail = data.studentEmail || 'unknown@email.com';
    const notebookContent = data.notebookContent;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Create filename: firstname_lastname_Module1_timestamp.ipynb
    const filename = `${studentName.replace(/\s+/g, '_')}_Module1_${timestamp}.ipynb`;

    // Get the destination folder
    const folder = DriveApp.getFolderById(FOLDER_ID);

    // Create the notebook file
    const file = folder.createFile(filename, notebookContent, 'application/json');

    // Log submission
    logSubmission(studentName, studentEmail, filename, file.getUrl());

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Submission successful!',
        filename: filename
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
      message: 'Notebook Submission API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Log submissions to a spreadsheet
function logSubmission(name, email, filename, url) {
  try {
    // Create or get submissions log spreadsheet
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const logFiles = folder.getFilesByName('_Submissions_Log');

    let spreadsheet;
    if (logFiles.hasNext()) {
      spreadsheet = SpreadsheetApp.open(logFiles.next());
    } else {
      spreadsheet = SpreadsheetApp.create('_Submissions_Log');
      DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
      const sheet = spreadsheet.getActiveSheet();
      sheet.appendRow(['Timestamp', 'Student Name', 'Email', 'Filename', 'File URL']);
    }

    const sheet = spreadsheet.getActiveSheet();
    sheet.appendRow([new Date(), name, email, filename, url]);

  } catch (error) {
    console.log('Failed to log submission: ' + error);
  }
}

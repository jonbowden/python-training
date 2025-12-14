/**
 * Python Training - Notebook Submission Handler
 *
 * ============================================================
 * IMPORTANT: This file is for REFERENCE ONLY
 * ============================================================
 *
 * The actual working solution uses Google Forms + a simple
 * Apps Script trigger. See the setup instructions below.
 *
 * ============================================================
 * WORKING SOLUTION: Google Forms + Auto-Move Script
 * ============================================================
 *
 * WHY THIS APPROACH:
 * - Google Forms handles file upload natively (no code needed)
 * - Students just click a link, upload file, done
 * - No authentication complexity
 * - Files auto-organized by timestamp
 *
 * LIMITATION:
 * - Google Forms uploads to its own auto-created folder
 * - We use a trigger script to move files to our folder
 *
 * ============================================================
 * SETUP INSTRUCTIONS
 * ============================================================
 *
 * STEP 1: Create Google Form
 * --------------------------
 * 1. Go to forms.google.com
 * 2. Create form with file upload question
 * 3. Turn OFF file type restrictions (or .ipynb won't work)
 * 4. SECURITY: Settings → Responses:
 *    - "Collect email addresses" = ON
 *    - "Verified" = ON (requires Google sign-in)
 *    - "Limit to 1 response" = ON (optional)
 *    This prevents fake submissions under other students' emails.
 * 5. Copy the PUBLIC URL (ends with /viewform)
 *
 * STEP 2: Create Destination Folder
 * ----------------------------------
 * 1. In Google Drive, create: Python_Training_Submission
 * 2. Inside it, create: Module_1, Module_2, etc.
 * 3. Get the FOLDER ID from the URL:
 *    https://drive.google.com/drive/folders/XXXXXX
 *                                          ^^^^^^
 *                                          This is the ID
 *
 * STEP 3: Set Up Auto-Move Script (THE KEY PART)
 * -----------------------------------------------
 * 1. In Google Forms, go to Responses tab
 * 2. Click the spreadsheet icon to create response sheet
 * 3. In the spreadsheet: Extensions → Apps Script
 * 4. Paste the moveFile function below
 * 5. Update PARENT_FOLDER_ID with your folder ID
 * 6. Save (Ctrl+S)
 *
 * STEP 4: Create Trigger
 * ----------------------
 * 1. In Apps Script, click Triggers (clock icon, left side)
 * 2. Click "+ Add Trigger"
 * 3. Settings:
 *    - Function: moveFile
 *    - Event source: From spreadsheet  <-- IMPORTANT!
 *    - Event type: On form submit
 * 4. Save and authorize
 *
 * STEP 5: Test
 * ------------
 * 1. Submit a test file through the form
 * 2. Check Executions log in Apps Script
 * 3. Verify file moved to your folder
 *
 * ============================================================
 */

// ============================================================
// WORKING SCRIPT - Copy this to your spreadsheet's Apps Script
// ============================================================

/**
 * Moves uploaded files from Google Forms folder to training folder
 *
 * Trigger: On form submit (from spreadsheet)
 *
 * @param {Object} e - Form submit event object
 */
function moveFile(e) {
  // YOUR FOLDER ID HERE - get from Drive URL
  var PARENT_FOLDER_ID = '1il2tcPvs2RwMmR8argOyMMimIxfO-aKe';

  try {
    var folder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    // File URL column - adjust if your form has different structure
    // Column 1 = Timestamp, Column 2 = usually file URL
    // Check your spreadsheet to confirm which column has the file link
    var fileUrl = sheet.getRange(lastRow, 3).getValue();

    if (fileUrl && fileUrl.includes('drive.google.com')) {
      // Extract file ID from URL
      var fileId = fileUrl.match(/[-\w]{25,}/);
      if (fileId) {
        var file = DriveApp.getFileById(fileId[0]);
        file.moveTo(folder);
        Logger.log('SUCCESS: Moved file: ' + file.getName());
      }
    }
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
  }
}

// ============================================================
// OPTIONAL: Multi-Module Support
// ============================================================

/**
 * Enhanced version that organizes by module subfolder
 * Use this if you want automatic module organization
 *
 * Requires form to have a "Module" dropdown question
 */
function moveFileToModule(e) {
  var PARENT_FOLDER_ID = '1il2tcPvs2RwMmR8argOyMMimIxfO-aKe';

  try {
    var parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    // Adjust column numbers based on your form structure
    var moduleNumber = sheet.getRange(lastRow, 2).getValue(); // e.g., "1" or "Module 1"
    var fileUrl = sheet.getRange(lastRow, 3).getValue();

    if (!fileUrl || !fileUrl.includes('drive.google.com')) {
      Logger.log('No valid file URL found');
      return;
    }

    // Extract module number if format is "Module 1"
    var modNum = moduleNumber.toString().replace(/\D/g, '') || '1';
    var moduleFolderName = 'Module_' + modNum;

    // Get or create module subfolder
    var moduleFolder;
    var folders = parentFolder.getFoldersByName(moduleFolderName);
    if (folders.hasNext()) {
      moduleFolder = folders.next();
    } else {
      moduleFolder = parentFolder.createFolder(moduleFolderName);
    }

    // Move file
    var fileId = fileUrl.match(/[-\w]{25,}/);
    if (fileId) {
      var file = DriveApp.getFileById(fileId[0]);
      file.moveTo(moduleFolder);
      Logger.log('SUCCESS: Moved ' + file.getName() + ' to ' + moduleFolderName);
    }

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
  }
}

// ============================================================
// LEGACY CODE (Reference Only - Not Used)
// ============================================================
// The code below was an earlier attempt using doPost/doGet
// for direct notebook submission. It required complex client-
// side code that didn't work reliably in Colab.
//
// Kept here for reference only. DO NOT USE.
// ============================================================

/**
 * LEGACY - Web App endpoint (not used)
 */
function doPost_LEGACY(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const studentName = data.studentName || 'Unknown';
    const studentEmail = data.studentEmail || 'unknown@email.com';
    const notebookContent = data.notebookContent;
    const moduleNumber = data.moduleNumber || '1';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const moduleFolder = getOrCreateModuleFolder(moduleNumber);
    const safeName = studentEmail.replace(/[@.]/g, '_');
    const filename = `${safeName}_Module${moduleNumber}_${timestamp}.ipynb`;

    const file = moduleFolder.createFile(filename, notebookContent, 'application/json');

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

/**
 * LEGACY - Helper function (not used)
 */
function getOrCreateModuleFolder(moduleNumber) {
  const PARENT_FOLDER_ID = '1il2tcPvs2RwMmR8argOyMMimIxfO-aKe';
  const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
  const folderName = `Module_${moduleNumber}`;

  const folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }

  return parentFolder.createFolder(folderName);
}

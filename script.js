function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DailyChecks") || 
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet("DailyChecks");
    
    // If first run, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date", "Equipment Type", "Equipment ID", "Operator", "Has Fail", "Items JSON", "Timestamp"]);
    }
    
    const data = JSON.parse(e.postData.contents);  // ← this receives your payload
    
    sheet.appendRow([
      data.date,
      data.equipmentType,
      data.equipmentId,
      data.operator,
      data.hasFail ? "Yes" : "No",
      JSON.stringify(data.items),  // store checklist as JSON string
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Check recorded" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

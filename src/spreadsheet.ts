function getActiveSheetByName(name: string): Sheet {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function getHeadersFromSheet(sheet: Sheet): Range {
  const last = sheet.getLastColumn();
  return sheet.getRange(1, 1, 1, last);
}

function testGetActivtSheetByName() {
  const sheet = getActiveSheetByName("Test");

  if (sheet === undefined || sheet === null) {
    throw new Error("failed to get active sheet: Test");
  }
}

function testGetHeadersFromSheet(sheet: Sheet) {
  const range = getHeadersFromSheet(sheet);

  if (range === undefined || range === null) {
    throw new Error("failed to get headers from sheet: Test");
  }
}

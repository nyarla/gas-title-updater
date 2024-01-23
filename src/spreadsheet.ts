function getActiveSheetByName(name: string): Sheet {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function getHeadersFromSheet(sheet: Sheet): Range {
  const last = sheet.getLastColumn();
  return sheet.getRange(1, 1, 1, last);
}

function getTopRow(sheet: Sheet): Payload {
  const last = parseInt(sheet.getLastColumn());
  const range = sheet.getRange(2, 1, 1, last);
  const cells: Record<number, string> = {};

  for (let col = 1 ; col <= last; col++) {
    cells[col] = range.getCell(1, col).getValue();
  }

  const payload: Payload = {};
  for (const key of Object.keys(Headers)) {
    const idx = getColumnIndexByHeaderId(key);

    payload[key] = cells[idx];
  }

  return payload;
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

function testGetTopRow(sheet: Sheet) {
  const payload = getTopRow(sheet);

  for (const key of Object.keys(Headers)) {
    if (!(key in payload)) {
      throw new Error(`in this case, this payload should have ${key} in it`);
    }
  }

  if ('__DOES_NOT_EXITS__' in payload) {
    throw new Error('in this case, this key should not exist in payload');
  }
}

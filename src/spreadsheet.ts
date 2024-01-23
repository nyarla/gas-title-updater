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

function writeToTopRow(sheet: Sheet, payload: Payload) {
  const range = sheet.getRange(2, 1, 1, parseInt(sheet.getLastColumn()));

  for (const key of Object.keys(payload)) {
    range.getCell(1, getColumnIndexByHeaderId(key)).setValue(payload[key]);
  }
}

function sortSheet(sheet: Sheet) {
  const lastCol = parseInt(sheet.getLastColumn());
  const lastRow = parseInt(sheet.getLastRow());

  const locked = getColumnIndexByHeaderId("Locked");
  const status = getColumnIndexByHeaderId("StatusCode");
  const updated = getColumnIndexByHeaderId("DateTime");

  Logger.log(JSON.stringify({ locked, status, updated }));

  const range = sheet.getRange(2, 1, lastRow - 2, lastCol - 1);
  range.activate();
  range.sort([
    { column: locked, ascending: true },
    { column: status, ascending: true },
    { column: updated, ascending: true },
  ]);
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

function testWriteToTopRow(sheet: Sheet) {
  const payload: Payload = {
    DateTime: (new Date(Date.now())).toISOString(),
    StatusCode: 200,
    Locked: false,
    Link: "https://example.com",
    Permalink: "https://example.com",
    Title: "Example",
  };

  writeToTopRow(sheet, payload);
}

function testSortSheet(sheet: Sheet) {
  sortSheet(sheet);
}

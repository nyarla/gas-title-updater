function initHeaderValues(sheet: Sheet): bool {
  for (const id of Object.keys(Headers)) {
    const key = Headers[id];
    _headerKeyToHeaderId[key] = id;
  }

  const range = getHeadersFromSheet(sheet);
  const lastCol = parseInt(range.getNumColumns());

  for (let idx = 0; idx < lastCol; idx++) {
    const col = idx+1;
    const value: HeaderKey = range.getCell(1, col).getValue();

    const id = _headerKeyToHeaderId[value];
    if ( id!== undefined && id !== null ) {
      _headerIdToColumnIndex[id] = col;
    }
  }

  return true;
}

function getColumnIndexByHeaderId(id: HeaderId): number|undefined {
  return _headerIdToColumnIndex[id];
}

function testColumnIndexByHeaderId() {
  for (const id of Object.keys(Headers)) {
    if (getColumnIndexByHeaderId(id) === undefined) {
      throw new Error(`in this case, this function should return column id: ${id}`);
    }
  }

  if (getColumnIndexByHeaderId("__DOES_NOT_EXIST__") !== undefined) {
    throw new Error('in this case, this function should return undefined');
  }
}

function init(sheet: Sheet): bool {
  for (const func of Object.keys(this)) {
    if (func === "init") {
      continue;
    }

    if (func.match(/^init/)) {
      const result: Error|null = this[func].call(this, sheet);
      if (result instanceof Error) {
        Logger.log("failed to initialize of %s: %s", func, result.toString())
        return false;
      }
    }
  }

  return true;
}

function testing(): bool {
  const sheet = getActiveSheetByName("Test");

  Logger.log('init');
  if (! init(sheet)) {
    Logger.log('failed to initialize test');
    return false;
  }

  Logger.log('testing...');
  for (const func of Object.keys(this)) {
    if (func === "testing") {
      continue
    }

    if (func.match(/^test/)) {
      try {
        this[func].call(this, sheet);
        Logger.log(`${func} is ok`);
      } catch(err) {
        Logger.log("failed to test of %s: %s", func, err.toString())
      }
    }
  }

  Logger.log('done');
}

function main() {
  Logger.log("main");
  const sheet = getActiveSheetByName("Production");

  Logger.log('init');
  if (! init(sheet)) {
    Logger.log('failed to initialize test');
    return false;
  }

  Logger.log("sort ...");
  sortSheet(sheet);

  const data: Payload = getTopRow(sheet);

  if (data.Locked === "TURE") {
    Logger.log("skip: locked url");
    Logger.log("done");
    return;
  }

  const date: number = Math.floor(Date.parse(data.DateTime) / 1000);
  const now: number = Math.floor(Date.now() / 1000);

  if (!shouldUpdate(date, now)) {
    Logger.log("skip: this url should not update by lastmodified date");
    Logger.log("done");
    return;
  }

  Logger.log("update: %s", data.Link);
  data.DateTime = (new Date(Date.now())).toISOString();
  writeToTopRow(sheet, data);

  const href = (data.Link.match(/^https?:/) && isSameHref(data.Link, data.Permalink)) ? data.Link : data.Permalink;
  const [status, location, content] = fetchUrl(href, date);
  if (status === 304) {
    Logger.log("fetch: this url not modified.");
    Logger.log("done");
    return;
  }

  data.StatusCode = status;
  data.Permalink = location;

  if (status === 200) {
    const title = parseTitle(content, data.Title);
    if (title) {
      if (! stripTitle(title).includes(data.Title)) {
        data.Message = "Warning: the title of this url does not have old title.";
      }

      data.Title = stripTitle(title);
    }

    if (!isSameHref(data.Link, data.Permalink)) {
      data.Locked = "TRUE";
    }

    Logger.log('fetchurl is succeed.');
  }
  else {
    data.Locked  = "TRUE";

    if ( 500 <= status && status <= 599 ) {
      data.Message = content;
    }

    Logger.log('failed to fetchurl.');
  }

  writeToTopRow(sheet, data);
  Logger.log("done");
}

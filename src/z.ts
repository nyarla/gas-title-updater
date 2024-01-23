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

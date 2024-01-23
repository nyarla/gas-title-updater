function shouldUpdate(lastUpdated, now: number): bool {
  return now >= lastUpdated + Expiration;
}

function isSameHref(a, b) {
  const aURL = a.replace(/^https?:/, '');
  const bURL = b.replace(/^https?:/, '');

  return aURL === bURL;
}

function fetchUrl(href, lastUpdated): [ number, string, string ] {
  const params = {
    method: 'get',
    headers: {
      'If-Modified-Since': new Date(lastUpdated).toUTCString(),
    },
    muteHTTPExceptions: true,
    followRedirect: false,
  };

  let statusCode = 0;
  let location = href;
  let content = "";

  try {
    for (let retry = 0; retry < 5; retry++) {
      const response = UrlFetchApp.fetch(location, params);
      
      statusCode = response.getResponseCode();
     
      if (301 <= statusCode && statusCode <= 399) {
        location = response.getHeaders().Location;
        continue;
      }

      if (statusCode === 304) {
        break;
      }

      content = response.getContentText();
      break;
    }
  }
  catch (err) {
    statusCode = 599;
    content = err.toString();
  }

  return [statusCode, location, content];
}

function testShouldUpdate() {
  if (shouldUpdate(0, 0)) {
    throw new Error("in this case, this result should be false");
  }

  if (!shouldUpdate(0, Expiration)) {
    throw new Error("in this case, this result should be true");
  }

  if (!shouldUpdate(0, Expiration + 1)) {
    throw new Error("in this case, this result should be true");
  }
}

function testIsSameHref() {
  if (!isSameHref('http://example.com', 'https://example.com')) {
    throw new Error("in this case, this result should be true");
  }

  if (isSameHref('http://example.com/foo', 'https://example.com/bar')) {
    throw new Error("in this case, this result should be false");
  }
}

function testFetchUrl() {
  const [ status, href, content ] = fetchUrl('https://example.com', 0);

  Logger.log(JSON.stringify({ status, href, content }));
}

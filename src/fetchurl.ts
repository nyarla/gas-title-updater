function shouldUpdate(lastUpdated, now: number): bool {
  if (Number.isNaN(lastUpdated)) {
    return true;
  }

  return now >= lastUpdated + Expiration;
}

function isSameHref(a, b) {
  if (a === undefined || a === null || b === null || b === undefined) {
    return false;
  }

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
    muteHttpExceptions: true,
    followRedirects: false,
  };

  let statusCode = 599;
  let location = href;
  let content = "";

  try {
    for (let retry = 0; retry < 5; retry++) {
      const response = UrlFetchApp.fetch(location, params);

      statusCode = response.getResponseCode();
     
      if (301 <= statusCode && statusCode <= 399) {
        location = makeRedirectUrl(location, response.getHeaders().Location);
        continue;
      }

      if (statusCode === 304) {
        break;
      }

      const charset = detectEncoding(response.getContentText());
      content = response.getContentText(charset);

      break;
    }
  }
  catch (err) {
    content = err.toString();
  }

  return [statusCode, location, content];
}

function makeRedirectUrl(from, to) {
  if (from === to) {
    return from;
  }

  const redirect = to.replace(/https:\/\/([^\/]+):443/, 'https://$1');
  if (redirect !== to) {
    return redirect;
  }

  if (to.match(/^\//)) {
    const [ _, proto, domain ] = from.match(/^(https?):\/\/([^\/]+)/);
    return `${proto}://${domain}${to}`;
  }

  return to;
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

  if (isSameHref(undefined, 'https://example.com')) {
    throw new Error("in this case, this result should be false");
  }

  if (isSameHref(null, 'https://example.com')) {
    throw new Error("in this case, this result should be false");
  }

  if (isSameHref('https://example.com', undefined)) {
    throw new Error("in this case, this result should be false");
  }

  if (isSameHref('https://example.com', null)) {
    throw new Error("in this case, this result should be false");
  }

  if (isSameHref('http://example.com/foo', 'https://example.com/bar')) {
    throw new Error("in this case, this result should be false");
  }
}

function testMakeRedirectUrl() {
  const cases = [
    [ [ 'http://example.com/foo', 'https://example.com:443/foo' ], 'https://example.com/foo' ],
    [ [ 'https://example.com/', '/foo' ], 'https://example.com/foo' ],
  ];

  for (const test of cases) {
    const [ fromto, expect ] = test;
    const [ from, to ] = fromto;

    const result = makeRedirectUrl(from, to);
    if (result !== expect) {
      throw new Error(`failed to makeRedirectUrl: ${from}, ${to} => ${result} !== ${expect}`);
    }
  }
}

function testFetchUrl() {
  const cases = [
    ['http://the.kalaclista.com', [ 200, 'https://the.kalaclista.com/', /カラクリスタ/ ] ],
    ['http://www.remus.dti.ne.jp/~takeucto/', [ 200, 'http://www.remus.dti.ne.jp/~takeucto/', /竹箒/ ] ],
    ['http://age.s22.xrea.com/talk2ch/', [ 200, 'http://age.s22.xrea.com/talk2ch/', /ちゃんねる/ ] ],
    ['http://bylines.news.yahoo.co.jp/egawashoko/20140315-00033563/', [ 200, 'https://news.yahoo.co.jp/expert/articles/453fc85883a715473b2e15d9c95bd2150f05d907', /遠隔操作/ ]],
  ];

  for (const test of cases) {
    const [ href, result ] = test;
    const [ status, location, content ] = fetchUrl(href, 0);

    if ( status !== result[0] ) {
      Logger.log("failed to fetchurl: %s: %s", href, status)
    }

    if ( location !== result[1]) {
      Logger.log("failed to redirect url: %s: %s", location, result[1]);
    }

    const title = stripTitle(parseTitle(content || ''));

    if ( ! title.match(result[2]) ) {
      Logger.log("cannot find specified string: %s: %s", location, title);
    }
  }
}

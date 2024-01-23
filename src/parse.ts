function parseTitle(html, fallback: string): string {
  const $ = cheerio.load(html);

  const ogp = $('meta[property="og:title"]').attr('content');
  if (ogp) {
    return ogp;
  }

  const ogpMistake = $('meta[name="og:title"]').attr('content');
  if (ogpMistake) {
    return ogpMistake;
  }

  const tw = $('meta[name="twitter:title"]').attr('content');
  if (tw) {
    return tw;
  }

  const twMistake = $('meta[property="twitter:title"]').attr('content');
  if (twMistake) {
    return twMistake;
  }

  const prop = $('meta[property="title"]').attr('content');
  if (prop) {
    return prop;
  }

  const propOther = $('meta[name="title"]').attr('content');
  if (propOther) {
    return propOther;
  }

  const title = $('title').text();
  if (title) {
    return title;
  }

  return fallback;
}

function testParseTitle() {
  const cases = [
    ['<meta property="og:title" content="test" />', "test"],
    ['<meta name="og:title" content="test" />', "test"],
    ['<meta name="twitter:title" content="test" />', "test"],
    ['<meta property="twitter:title" content="test" />', "test"],
    ['<meta property="title" content="test" />', "test"],
    ['<meta name="title" content="test" />', "test"],
    ['<title>test</title>', "test"],
    ['', 'fallback']
  ];

  for (const test of cases) {
    const title = parseTitle(test[0], 'fallback');
    if (title !== test[1]) {
      throw new Error(`failed to parse title: ${test[0]}: ${test[1]}`);
    }
  }
}

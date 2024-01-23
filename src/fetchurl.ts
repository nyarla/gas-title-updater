function shouldUpdate(lastUpdated, now: number): bool {
  return now >= lastUpdated + Expiration;
}

function isSameHref(a, b) {
  const aURL = a.replace(/^https?:/, '');
  const bURL = b.replace(/^https?:/, '');

  return aURL === bURL;
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

function shouldUpdate(lastUpdated, now: number): bool {
  return now >= lastUpdated + Expiration;
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

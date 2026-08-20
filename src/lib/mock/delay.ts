export function mockDelay(ms = 400) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

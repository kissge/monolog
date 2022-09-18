export function parseAs<T>(json: string, fallback: T): T {
  return json ? /* @__PURE__ */ JSON.parse(json) : fallback;
}

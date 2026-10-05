import { describe, expect, test } from "bun:test";
import { jsonInit } from "../app/src/api/request";

describe("JSON request headers", () => {
  test("retains authentication supplied through Headers", () => {
    const init = jsonInit("POST", { note: "reviewed" }, {
      headers: new Headers({ Authorization: "Bearer test-token" }),
    });
    const headers = new Headers(init.headers);
    expect(headers.get("Authorization")).toBe("Bearer test-token");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(init.body).toBe('{"note":"reviewed"}');
  });

  test("accepts tuple headers and lets explicit content types override the default", () => {
    const headers = new Headers(jsonInit("POST", {}, {
      headers: [["Content-Type", "application/problem+json"], ["X-Trace-Id", "trace-1"]],
    }).headers);
    expect(headers.get("Content-Type")).toBe("application/problem+json");
    expect(headers.get("X-Trace-Id")).toBe("trace-1");
  });

  test("preserves cancellation and leaves an absent body absent", () => {
    const controller = new AbortController();
    const init = jsonInit("GET", undefined, { signal: controller.signal });
    expect(init.signal).toBe(controller.signal);
    expect(init.body).toBeUndefined();
  });
});

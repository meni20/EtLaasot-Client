import test from "node:test";
import assert from "node:assert/strict";
import { ReloadSafety } from "../src/utils/reload-safety.ts";
import { saveAttendance } from "../src/utils/attendance-save.ts";
import { apiErrorMessage } from "../src/utils/api-error.ts";

test("partial attendance failures retain successful acknowledgments and retry only unresolved IDs", async () => {
  const calls: string[] = [];
  const first = await saveAttendance(["one", "two"], async (id) => {
    calls.push(id);
    if (id === "two") throw Error("network");
  });
  assert.deepEqual(first.saved, ["one"]);
  assert.deepEqual(first.failed, ["two"]);
  const retry = await saveAttendance(first.failed, async (id) => {
    calls.push(id);
  });
  assert.deepEqual(retry.saved, ["two"]);
  assert.deepEqual(calls, ["one", "two", "two"]);
});
test("synchronous transport errors are settled without abandoning other attendance requests", async () => {
  const result = await saveAttendance(["one", "two"], (id) => {
    if (id === "one") throw Error("offline");
    return Promise.resolve();
  });
  assert.deepEqual(result.failed, ["one"]);
  assert.deepEqual(result.saved, ["two"]);
});
test("independent form/signature blockers release updates only when all work is safe", () => {
  const state = new ReloadSafety(),
    draft = Symbol(),
    signature = Symbol();
  let notifications = 0;
  const unsubscribe = state.subscribe(() => notifications++);
  state.set(draft, "draft");
  state.set(signature, "signature");
  state.set(draft, "");
  assert.equal(state.getReason(), "signature");
  state.set(signature, "");
  assert.equal(state.getReason(), "");
  assert.equal(notifications, 4);
  unsubscribe();
  state.set(draft, "failed save");
  assert.equal(notifications, 4);
});
test("API errors use codes and distinguish status classes without exposing arbitrary bodies", () => {
  const response = (status: number, code?: string) => ({
    response: { status, data: { code, message: "SECRET English body" } },
  });
  assert.match(
    apiErrorMessage(response(409, "ACTIVITY_ALREADY_ACTIVE"), "fallback"),
    /פעילות פעילה/,
  );
  assert.match(apiErrorMessage(response(403), "fallback"), /הרשאה/);
  assert.match(apiErrorMessage(response(422), "fallback"), /פרטים/);
  assert.match(apiErrorMessage(response(401), "fallback"), /להתחבר/);
  assert.equal(apiErrorMessage(response(500), "נסו שוב"), "נסו שוב");
  assert.equal(apiErrorMessage(Error("SECRET"), "נסו שוב"), "נסו שוב");
});

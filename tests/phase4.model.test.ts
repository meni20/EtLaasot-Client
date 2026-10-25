import { test } from "node:test";
import assert from "node:assert/strict";
import { validateForm } from "../src/features/parent-registration/model.ts";
import {
  accessView,
  onlyTraineeRoles,
} from "../src/features/parent-admission/navigation.ts";
test("blocking navigation is inactive by default", () => {
  assert.equal(accessView(false, false, true, true, true), "NORMAL");
});
test("a live server restriction requires status verification even without a cached client flag", () => {
  assert.equal(accessView(false, true, true, false, false), "VERIFY");
});
test("status errors never restore normal access", () => {
  assert.equal(accessView(true, false, false, true, false), "VERIFY");
});
test("blocked trainees have registration-only navigation; approval restores access", () => {
  assert.equal(accessView(true, false, false, false, true), "REGISTRATION");
  assert.equal(accessView(true, false, false, false, false), "NORMAL");
});
test("administrators and volunteers, including mixed-role accounts, are never trainee-blocked", () => {
  for (const roleId of [1, 10000, 10001])
    assert.equal(onlyTraineeRoles([{ roleId: 2 }, { roleId }]), false);
  assert.equal(onlyTraineeRoles([{ roleId: 2 }]), true);
  assert.equal(onlyTraineeRoles([]), false);
});
test("a second signing parent needs a distinct national ID, even with a separate signature", () => {
  const errors = validateForm(
    {
      parent1: { name: "Fictional one", nationalId: "123456782" },
      parent2: { name: "Fictional two", nationalId: "123456782" },
    },
    "fixture",
    { physician: false, parent1: true, parent2: true },
  );
  assert.ok(errors.some((e) => e.path === "parent2.nationalId"));
});
test("an absent second parent remains optional", () => {
  const errors = validateForm(
    { parent1: { name: "Fictional one", nationalId: "123456782" } },
    "fixture",
    { physician: false, parent1: true, parent2: false },
  );
  assert.equal(
    errors.some((e) => e.path === "parent2.nationalId"),
    false,
  );
});

test("registration types default to trainee and isolate query identities", async () => {
  const {
    normalizeRegistrationType,
    applicationQueryScope,
    canStartRegistration,
  } = await import("../src/features/parent-admission/registration-type.ts");
  assert.equal(normalizeRegistrationType(), "TRAINEE");
  assert.throws(() => normalizeRegistrationType(null));
  assert.throws(() => normalizeRegistrationType("ADMIN"));
  assert.notDeepEqual(
    applicationQueryScope("TRAINEE", "same-id"),
    applicationQueryScope("VOLUNTEER", "same-id"),
  );
  assert.notDeepEqual(
    applicationQueryScope("TRAINEE", "one"),
    applicationQueryScope("TRAINEE", "two"),
  );
  assert.equal(canStartRegistration("TRAINEE"), true);
  assert.equal(canStartRegistration("VOLUNTEER"), false);
});

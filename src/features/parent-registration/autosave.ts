const AUTOSAVE_IDLE_MS = 1800;
const AUTOSAVE_MAX_WAIT_MS = 5000;

export function nextAutosaveDelay(dirtySince: number, now = Date.now()) {
  return Math.max(
    0,
    Math.min(AUTOSAVE_IDLE_MS, AUTOSAVE_MAX_WAIT_MS - (now - dirtySince)),
  );
}

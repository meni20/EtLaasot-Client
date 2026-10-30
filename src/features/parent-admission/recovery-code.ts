const LEGACY_CODE = /^[A-Za-z0-9_-]{43}$/;
const SHORT_CODE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{16}$/;

export function normalizeRecoveryCode(value: string) {
  const trimmed = value.trim();
  if (LEGACY_CODE.test(trimmed)) return trimmed;
  return trimmed.replace(/[\s-]/g, "").toUpperCase();
}

export function isRecoveryCode(value: string) {
  const normalized = normalizeRecoveryCode(value);
  return LEGACY_CODE.test(normalized) || SHORT_CODE.test(normalized);
}

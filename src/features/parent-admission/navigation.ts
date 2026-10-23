export function onlyTraineeRoles(roles: { roleId: number }[]) {
  return (
    roles.some((r) => r.roleId === 2) &&
    !roles.some((r) => [1, 10000, 10001].includes(r.roleId))
  );
}
export function accessView(
  enabled: boolean,
  requested: boolean,
  pending: boolean,
  failed: boolean,
  blocked: boolean,
) {
  if (!enabled && !requested) return "NORMAL";
  if (pending || failed) return "VERIFY";
  return blocked ? "REGISTRATION" : "NORMAL";
}

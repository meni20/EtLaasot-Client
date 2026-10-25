import { reconcileSignatures, type VolunteerData } from "./contracts";
export function volunteerSetField(
  data: VolunteerData,
  path: string,
  value: unknown,
): VolunteerData {
  const next = structuredClone(data) as Record<string, unknown>;
  const parts = path.split(".");
  let cursor = next;
  for (const part of parts.slice(0, -1)) {
    cursor[part] ??= {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  if (value === undefined) delete cursor[parts.at(-1)!];
  else cursor[parts.at(-1)!] = value;
  return reconcileSignatures(
    data,
    next as VolunteerData,
    data.agreements?.version ?? "",
  );
}

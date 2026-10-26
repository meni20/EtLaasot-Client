export async function saveAttendance(
  ids: readonly string[],
  checkIn: (id: string) => Promise<unknown>,
) {
  const results = await Promise.allSettled(
    ids.map((id) => Promise.resolve().then(() => checkIn(id))),
  );
  const saved: string[] = [],
    failed: string[] = [];
  results.forEach((result, index) => {
    (result.status === "fulfilled" ? saved : failed).push(ids[index]);
  });
  return {
    saved,
    failed,
    errors: results.flatMap((r) =>
      r.status === "rejected" ? [r.reason as unknown] : [],
    ),
  };
}

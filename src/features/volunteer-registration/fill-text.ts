// Presentation only: keep the signed source declarations and stored data unchanged.
export function fillVolunteerText(
  text: string,
  volunteer?: { firstName?: string; lastName?: string; nationalId?: string },
) {
  const name = [volunteer?.firstName, volunteer?.lastName]
    .filter(Boolean)
    .join(" ");
  let result = text;
  if (name)
    result = result
      .replace(/(אני הח["״]מ\s*)_{2,}/u, (_, prefix) => prefix + name)
      .replace(/(אנו הוריו של\s*)_{2,}/u, (_, prefix) => prefix + name);
  if (volunteer?.nationalId)
    result = result.replace(
      /(ת[.״"]ז[.]?\s*)_{2,}/u,
      (_, prefix) => prefix + volunteer.nationalId,
    );
  return result;
}

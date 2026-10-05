import type { AdminSearchAction } from "./adminActionSearch.types";

const HEBREW_DIACRITICS = /[\u0591-\u05c7]/g;
const SEARCH_PUNCTUATION = /[\s\-־_'"׳״.,/\\()[\]{}:;!?]+/g;
const FINAL_HEBREW_LETTERS: Record<string, string> = {
  ך: "כ",
  ם: "מ",
  ן: "נ",
  ף: "פ",
  ץ: "צ",
};

export const normalizeAdminSearchText = (value: string) =>
  value
    .normalize("NFKD")
    .replace(HEBREW_DIACRITICS, "")
    .toLocaleLowerCase("he")
    .replace(/[ךםןףץ]/g, (letter) => FINAL_HEBREW_LETTERS[letter] ?? letter)
    .replace(SEARCH_PUNCTUATION, " ")
    .trim();

export const filterAdminActions = (
  actions: AdminSearchAction[],
  query: string,
) => {
  const normalizedQuery = normalizeAdminSearchText(query);
  if (!normalizedQuery) return [];

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  return actions
    .map((action) => {
      const normalizedLabel = normalizeAdminSearchText(action.label);
      const normalizedAliases = action.aliases.map(normalizeAdminSearchText);
      const searchableText = [normalizedLabel, ...normalizedAliases].join(" ");

      if (!queryTokens.every((token) => searchableText.includes(token))) {
        return null;
      }

      const score = normalizedLabel === normalizedQuery
        ? 0
        : normalizedLabel.startsWith(normalizedQuery)
          ? 1
          : normalizedLabel.includes(normalizedQuery)
            ? 2
            : 3;

      return { action, score };
    })
    .filter(
      (result): result is { action: AdminSearchAction; score: number } =>
        result !== null,
    )
    .sort(
      (first, second) =>
        first.score - second.score ||
        first.action.label.localeCompare(second.action.label, "he"),
    )
    .map(({ action }) => action);
};

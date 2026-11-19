export function focusRegistrationIssue(path: string) {
  if (typeof document === "undefined") return;
  const focus = () => {
    const target = Array.from(
      document.querySelectorAll<HTMLElement>("[data-registration-field]"),
    ).find((element) => element.dataset.registrationField === path);
    if (!target) return;
    const control = target.matches(
      "input, textarea, button, canvas, [tabindex], [role='radio'], [role='checkbox']",
    )
      ? target
      : target.querySelector<HTMLElement>(
          "input:not([type='hidden']):not(:disabled), textarea:not(:disabled), button:not(:disabled), canvas, [tabindex]:not([tabindex='-1']), [role='radio'], [role='checkbox']",
        );
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    control?.focus({ preventScroll: true });
  };
  window.requestAnimationFrame(() => window.requestAnimationFrame(focus));
}

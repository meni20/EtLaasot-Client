import { useEffect, useLayoutEffect, useRef } from "react";
import { reloadSafety } from "../utils/reload-safety";

export function useReloadGuard(
  blocked: boolean,
  reason = "יש לסיים או לבטל את העריכה לפני העדכון.",
) {
  const owner = useRef(Symbol("reload-guard"));
  useLayoutEffect(() => {
    reloadSafety.set(owner.current, blocked ? reason : "");
  }, [blocked, reason]);
  useLayoutEffect(() => {
    const id = owner.current;
    return () => reloadSafety.set(id, "");
  }, []);
  useEffect(() => {
    if (!blocked) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [blocked]);
}

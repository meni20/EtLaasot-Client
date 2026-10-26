import { useCallback, useEffect, useRef, useState } from "react";
import { useReloadGuard } from "../../hooks/useReloadGuard";
import { RegistrationError } from "./api";
import { prefill, setField, type ProfilePrefill } from "./model";

interface DraftTransport<T> {
  save(input: {
    data: T;
    currentStep: number;
    revision: number;
  }): Promise<{ data: T; form: { revision: number } }>;
}
interface DraftInitial<T> {
  data: T;
  form: { currentStep: number; revision: number } | null;
}
export function useDraft<T = import("./contracts").RegistrationData>(
  api: DraftTransport<T>,
  initial: DraftInitial<T>,
  profile: ProfilePrefill,
  readOnly = false,
  model?: { setField(data: T, path: string, value: unknown): T },
) {
  const [data, setData] = useState(() =>
    initial.form || model
      ? initial.data
      : (prefill(
          initial.data as import("./contracts").RegistrationData,
          profile,
        ) as T),
  );
  const [step, setStep] = useState(initial.form?.currentStep ?? 1);
  const [revision, setRevision] = useState(initial.form?.revision ?? 0);
  const [saveState, setSaveState] = useState<
    "saved" | "dirty" | "saving" | "error" | "conflict"
  >("saved");
  useReloadGuard(!readOnly && saveState !== "saved", "יש להמתין לשמירת הטיוטה או לנסות לשמור שוב לפני העדכון.");
  const [error, setError] = useState<Error | null>(null);
  const [signatureGeneration, setSignatureGeneration] = useState(0);
  const state = useRef({
    data,
    step,
    revision,
    generation: 0,
    saved: 0,
    blocked: false,
  });
  const pending = useRef<Promise<boolean> | null>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const flush = useCallback(async (): Promise<boolean> => {
    if (readOnly) return true;
    if (pending.current) return pending.current;
    if (state.current.blocked) return false;
    const request = (async () => {
      while (state.current.saved !== state.current.generation) {
        const snapshot = { ...state.current };
        if (alive.current) setSaveState("saving");
        try {
          const result = await api.save({
            data: snapshot.data,
            currentStep: snapshot.step,
            revision: snapshot.revision,
          });
          state.current.revision = result.form.revision;
          state.current.saved = snapshot.generation;
          if (alive.current) {
            setRevision(result.form.revision);
            setError(null);
          }
        } catch (e) {
          state.current.blocked = true;
          if (alive.current) {
            setError(e instanceof Error ? e : new Error("השמירה נכשלה"));
            setSaveState(
              e instanceof RegistrationError && e.status === 409
                ? "conflict"
                : "error",
            );
          }
          return false;
        }
      }
      if (alive.current) setSaveState("saved");
      return true;
    })();
    pending.current = request;
    try {
      return await request;
    } finally {
      pending.current = null;
    }
  }, [api, readOnly]);
  useEffect(() => {
    if (saveState !== "dirty") return;
    const timer = window.setTimeout(() => {
      void flush();
    }, 650);
    return () => window.clearTimeout(timer);
  }, [data, step, saveState, flush]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (state.current.generation !== state.current.saved)
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  const change = (path: string, value: unknown) => {
    if (readOnly || saveState === "conflict") return;
    state.current.blocked = false;
    const next = model
      ? model.setField(state.current.data, path, value)
      : (setField(
          state.current.data as import("./contracts").RegistrationData,
          path,
          value,
        ) as T);
    state.current.data = next;
    state.current.generation++;
    setData(next);
    setSignatureGeneration((v) => v + 1);
    setSaveState("dirty");
  };
  const navigate = (next: number) => {
    setStep(next);
    state.current.step = next;
    if (!state.current.blocked && !readOnly) {
      state.current.generation++;
      setSaveState("dirty");
      void flush();
    }
  };
  return {
    data,
    step,
    revision,
    saveState,
    error,
    signatureGeneration,
    change,
    navigate,
    flush,
    retry: () => {
      if (saveState !== "conflict") {
        state.current.blocked = false;
        void flush();
      }
    },
    current: () => ({ ...state.current }),
    accept: (result: { data: typeof data; form: { revision: number } }) => {
      state.current.data = result.data;
      state.current.revision = result.form.revision;
      state.current.saved = state.current.generation;
      state.current.blocked = false;
      setData(result.data);
      setRevision(result.form.revision);
      setSaveState("saved");
    },
  };
}

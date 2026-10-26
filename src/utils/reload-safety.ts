// Contains reasons only, never form values, credentials or signatures.
export class ReloadSafety {
  private blockers = new Map<symbol, string>();
  private listeners = new Set<() => void>();
  getReason = () => this.blockers.values().next().value ?? "";
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  set(owner: symbol, reason: string) {
    if ((this.blockers.get(owner) ?? "") === reason) return;
    if (reason) this.blockers.set(owner, reason);
    else this.blockers.delete(owner);
    this.listeners.forEach((listener) => listener());
  }
}
export const reloadSafety = new ReloadSafety();

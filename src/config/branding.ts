import { selectBranding } from "../../branding.config";

declare const __ETLAASOT_BRANDING__: ReturnType<typeof selectBranding>;

// Isolated local/test Vite configs do not inject the release branding constant.
export const branding =
  typeof __ETLAASOT_BRANDING__ === "undefined"
    ? selectBranding({})
    : __ETLAASOT_BRANDING__;

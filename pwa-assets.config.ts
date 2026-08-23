import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";
import { designTokens } from "./src/theme/tokens";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  images: ["public/et-laasot-bat-yam-logo.png"],
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      padding: 0.12,
    },
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0.28,
      resizeOptions: {
        fit: "contain",
        background: designTokens.color.primarySoft,
      },
    },
    apple: {
      ...minimal2023Preset.apple,
      padding: 0.22,
      resizeOptions: {
        fit: "contain",
        background: designTokens.color.primarySoft,
      },
    },
  },
});

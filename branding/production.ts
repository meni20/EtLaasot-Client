import { legacyColors, type BrandColors } from "./legacy.ts";

export const officialPalette = {
  yellow: "#FFB850",
  orange: "#FB883C",
  purple: "#B58DFF",
  blue: "#0F228F",
  pink: "#FFA6B9",
  lightBlue: "#B8D6FD",
  green: "#6DE495",
  cream: "#FFF9F2",
} as const;

export const productionColors: BrandColors = {
  ...legacyColors,
  canvas: officialPalette.cream,
  canvasWarm: officialPalette.cream,
  surfaceMuted: "#F4F0FF",
  brandInk: officialPalette.blue,
  primary: officialPalette.blue,
  primaryHover: "#0B196C",
  primaryPressed: "#08134F",
  primarySoft: "#F0E9FF",
  primarySelected: "#E4D4FF",
  primaryBorder: officialPalette.purple,
  // Existing brand tokens are also used for text and white-label buttons.
  // Keep those dark; the actual MUI secondary fill is the official purple.
  brand: officialPalette.blue,
  brandHover: "#0B196C",
  brandSoft: "#F4EDFF",
  info: officialPalette.blue,
  infoSoft: officialPalette.lightBlue,
  success: "#17633A",
  successSoft: officialPalette.green,
  successBorder: "#40965E",
  warning: "#79420A",
  warningSoft: "#FFF0D8",
};

export const productionChart = [
  officialPalette.blue,
  officialPalette.purple,
  officialPalette.orange,
  officialPalette.green,
  officialPalette.yellow,
  officialPalette.pink,
  officialPalette.lightBlue,
];

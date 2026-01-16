import { Platform } from "react-native";

const tintColorLight = "#0D9488";
const tintColorDark = "#14B8A6";

export const Colors = {
  light: {
    text: "#0F0F0F",
    textSecondary: "#737373",
    buttonText: "#FFFFFF",
    tabIconDefault: "#737373",
    tabIconSelected: tintColorLight,
    link: "#0D9488",
    tint: "#0D9488",
    tintDark: "#0F766E",
    accent: "#F97316",
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#E5E5E5",
    border: "#E5E5E5",
    borderDark: "#D4D4D4",
    overlay: "rgba(0, 0, 0, 0.5)",
    success: "#10B981",
    error: "#EF4444",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#A3A3A3",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A3A3A3",
    tabIconSelected: tintColorDark,
    link: "#14B8A6",
    tint: "#14B8A6",
    tintDark: "#0D9488",
    accent: "#F97316",
    backgroundRoot: "#0F0F0F",
    backgroundDefault: "#1A1A1A",
    backgroundSecondary: "#262626",
    backgroundTertiary: "#2A2A2A",
    border: "#2A2A2A",
    borderDark: "#404040",
    overlay: "rgba(0, 0, 0, 0.7)",
    success: "#10B981",
    error: "#EF4444",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

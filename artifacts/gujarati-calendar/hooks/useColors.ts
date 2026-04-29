import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useOptionalSettings } from "@/contexts/SettingsContext";

/**
 * Returns the design tokens for the current color scheme. Honors the user's
 * theme preference from SettingsContext when present, otherwise falls back to
 * the device color scheme.
 */
export function useColors() {
  const settings = useOptionalSettings();
  const systemScheme = useColorScheme();
  const resolved = settings
    ? settings.resolvedScheme
    : systemScheme === "dark"
      ? "dark"
      : "light";
  const palette = resolved === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius, scheme: resolved };
}

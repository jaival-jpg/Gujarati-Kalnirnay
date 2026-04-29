import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  padded?: boolean;
}

export function GlassCard({
  children,
  style,
  intensity = 40,
  padded = true,
}: GlassCardProps) {
  const colors = useColors();
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={[
        styles.shell,
        {
          borderRadius: colors.radius,
          borderColor: colors.cardGlassBorder,
          backgroundColor: isWeb ? colors.card : colors.cardGlass,
          shadowColor: colors.shadow,
        },
        padded ? styles.padded : null,
        style,
      ]}
    >
      {!isWeb ? (
        <BlurView
          intensity={intensity}
          tint={colors.scheme === "dark" ? "dark" : "light"}
          style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
        />
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  padded: {
    padding: 18,
  },
  content: {
    position: "relative",
  },
});

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: "screen" | "header" | "subtle";
}

export function GradientBackground({
  children,
  style,
  variant = "screen",
}: GradientBackgroundProps) {
  const colors = useColors();

  if (variant === "subtle") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }, style]}>
        <LinearGradient
          colors={[
            colors.scheme === "dark"
              ? "rgba(255, 138, 61, 0.10)"
              : "rgba(255, 138, 61, 0.18)",
            "transparent",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.45 }}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    );
  }

  if (variant === "header") {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGlow}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    opacity: 0.95,
  },
});

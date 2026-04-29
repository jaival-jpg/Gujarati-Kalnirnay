import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface ScreenHeaderProps {
  titleGu: string;
  titleEn?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({
  titleGu,
  titleEn,
  subtitle,
  showBack,
  rightAction,
}: ScreenHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = insets.top || 16;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: topPad + 14 }]}
    >
      <View style={styles.top}>
        {showBack ? (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.iconBtn,
              { opacity: pressed ? 0.65 : 1 },
            ]}
            hitSlop={10}
          >
            <Feather name="chevron-left" size={22} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View style={styles.iconBtn}>
            <Text style={styles.om}>ॐ</Text>
          </View>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {titleGu}
          </Text>
          {titleEn ? (
            <Text style={styles.titleEn} numberOfLines={1}>
              {titleEn}
            </Text>
          ) : null}
        </View>
        <View style={styles.iconBtn}>{rightAction}</View>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.glow, { backgroundColor: "rgba(255,255,255,0.06)" }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  om: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  titleEn: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  glow: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});

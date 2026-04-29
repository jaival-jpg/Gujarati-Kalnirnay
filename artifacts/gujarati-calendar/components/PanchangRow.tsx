import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface PanchangRowProps {
  icon: keyof typeof Feather.glyphMap;
  labelGu: string;
  labelEn: string;
  valueGu: string;
  valueEn?: string;
  accent?: "default" | "good" | "bad" | "neutral";
  last?: boolean;
}

export function PanchangRow({
  icon,
  labelGu,
  labelEn,
  valueGu,
  valueEn,
  accent = "default",
  last,
}: PanchangRowProps) {
  const colors = useColors();

  const accentBg =
    accent === "good"
      ? colors.successSoft
      : accent === "bad"
        ? colors.dangerSoft
        : accent === "neutral"
          ? colors.accentSoft
          : colors.primarySoft;

  const accentFg =
    accent === "good"
      ? colors.success
      : accent === "bad"
        ? colors.danger
        : accent === "neutral"
          ? colors.accent
          : colors.primary;

  return (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>
        <Feather name={icon} size={16} color={accentFg} />
      </View>
      <View style={styles.labels}>
        <Text style={[styles.labelGu, { color: colors.foreground }]}>
          {labelGu}
        </Text>
        <Text style={[styles.labelEn, { color: colors.mutedForeground }]}>
          {labelEn}
        </Text>
      </View>
      <View style={styles.values}>
        <Text style={[styles.valueGu, { color: colors.foreground }]}>
          {valueGu}
        </Text>
        {valueEn ? (
          <Text style={[styles.valueEn, { color: colors.mutedForeground }]}>
            {valueEn}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  labels: {
    flex: 1,
  },
  labelGu: {
    fontSize: 15,
    fontWeight: "600",
  },
  labelEn: {
    fontSize: 11,
    marginTop: 1,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  values: {
    alignItems: "flex-end",
  },
  valueGu: {
    fontSize: 15,
    fontWeight: "700",
  },
  valueEn: {
    fontSize: 11,
    marginTop: 1,
  },
});

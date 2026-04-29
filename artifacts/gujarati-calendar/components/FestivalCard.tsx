import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MONTHS_EN_GU } from "@/constants/panchang";
import type { Festival } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { toGujaratiDigits } from "@/lib/panchang";

interface FestivalCardProps {
  festival: Festival;
  compact?: boolean;
}

const TYPE_BADGE: Record<Festival["type"], string> = {
  major: "મુખ્ય",
  regional: "પ્રાદેશિક",
  national: "રાષ્ટ્રીય",
  religious: "ધાર્મિક",
};

export function FestivalCard({ festival, compact }: FestivalCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => router.push(`/festival/${festival.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius - 4,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.dateChip,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        <Text style={[styles.dateDay, { color: colors.primary }]}>
          {toGujaratiDigits(festival.day)}
        </Text>
        <Text style={[styles.dateMonth, { color: colors.primary }]}>
          {(MONTHS_EN_GU[festival.month - 1] ?? "").slice(0, 3)}
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.nameGu, { color: colors.foreground }]} numberOfLines={1}>
          {festival.nameGu}
        </Text>
        <Text style={[styles.nameEn, { color: colors.mutedForeground }]} numberOfLines={1}>
          {festival.nameEn}
        </Text>
        {!compact ? (
          <Text
            style={[styles.desc, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {festival.descriptionGu}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.badgeText, { color: colors.foreground }]}>
              {TYPE_BADGE[festival.type]}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    gap: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  dateChip: {
    width: 58,
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 0.4,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  nameGu: {
    fontSize: 16,
    fontWeight: "700",
  },
  nameEn: {
    fontSize: 12,
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});

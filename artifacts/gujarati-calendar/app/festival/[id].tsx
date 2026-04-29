import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { MONTHS_EN_GU, VAAR_GU } from "@/constants/panchang";
import { FESTIVALS } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";

const TYPE_LABEL: Record<string, string> = {
  major: "મુખ્ય તહેવાર",
  regional: "પ્રાદેશિક",
  national: "રાષ્ટ્રીય",
  religious: "ધાર્મિક",
};

export default function FestivalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const festival = useMemo(() => FESTIVALS.find((f) => f.id === id), [id]);

  if (!festival) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={36} color={colors.mutedForeground} />
        <Text style={{ color: colors.foreground, fontSize: 16, marginTop: 12 }}>
          તહેવાર મળ્યો નથી
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>
            પાછા જાઓ
          </Text>
        </Pressable>
      </View>
    );
  }

  const dateObj = new Date(2026, festival.month - 1, festival.day);
  const panchang = computePanchang(dateObj);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: (insets.top || 16) + 12 }]}
        >
          <View style={styles.heroNav}>
            <Pressable
              onPress={() => router.back()}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Feather name="chevron-left" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={[styles.typeBadge]}>
              <Text style={styles.typeBadgeText}>
                {TYPE_LABEL[festival.type] ?? festival.type}
              </Text>
            </View>
          </View>

          <View style={styles.dateBlock}>
            <Text style={styles.dateNum}>{toGujaratiDigits(festival.day)}</Text>
            <View>
              <Text style={styles.dateMonth}>
                {MONTHS_EN_GU[festival.month - 1]}
              </Text>
              <Text style={styles.dateYear}>
                {VAAR_GU[dateObj.getDay()]} • {toGujaratiDigits(2026)}
              </Text>
            </View>
          </View>

          <Text style={styles.heroName}>{festival.nameGu}</Text>
          <Text style={styles.heroNameEn}>{festival.nameEn}</Text>

          <View style={styles.glow} />
        </LinearGradient>

        <View style={{ padding: 16, gap: 14, marginTop: -10 }}>
          <GlassCard>
            <Text style={[styles.descLabel, { color: colors.mutedForeground }]}>
              વિશે
            </Text>
            <Text style={[styles.desc, { color: colors.foreground }]}>
              {festival.descriptionGu}
            </Text>
          </GlassCard>

          <GlassCard padded={false} style={{ padding: 14 }}>
            <Text
              style={[styles.descLabel, { color: colors.mutedForeground, marginBottom: 10 }]}
            >
              પંચાંગ
            </Text>
            <View style={styles.kvRow}>
              <KV labelGu="તિથિ" value={`${panchang.pakshaGu} ${panchang.tithiGu}`} colors={colors} />
              <KV labelGu="નક્ષત્ર" value={panchang.nakshatraGu} colors={colors} />
            </View>
            <View style={styles.kvRow}>
              <KV labelGu="વાર" value={panchang.vaarGu} colors={colors} />
              <KV
                labelGu="વિક્રમ માસ"
                value={`${panchang.vikramMonthGu} ${toGujaratiDigits(panchang.vikramYear)}`}
                colors={colors}
              />
            </View>
          </GlassCard>

          {festival.region ? (
            <GlassCard>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.accentSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="map-pin" size={16} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.descLabel, { color: colors.mutedForeground }]}>
                    પ્રદેશ
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "600" }}>
                    {festival.region}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ) : null}

          <Pressable
            onPress={() =>
              router.push(
                `/date/2026-${String(festival.month).padStart(2, "0")}-${String(festival.day).padStart(2, "0")}`,
              )
            }
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="calendar" size={16} color={colors.primaryForeground} />
            <Text style={{ color: colors.primaryForeground, fontWeight: "700", fontSize: 14 }}>
              સંપૂર્ણ પંચાંગ જુઓ
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function KV({
  labelGu,
  value,
  colors,
}: {
  labelGu: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.kvCell}>
      <Text style={[styles.kvLabel, { color: colors.mutedForeground }]}>
        {labelGu}
      </Text>
      <Text style={[styles.kvValue, { color: colors.foreground }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  backBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  hero: {
    paddingHorizontal: 18,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  dateBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    marginTop: 22,
  },
  dateNum: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "800",
    lineHeight: 72,
    letterSpacing: -3,
  },
  dateMonth: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  dateYear: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 4,
  },
  heroName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 22,
    letterSpacing: 0.2,
  },
  heroNameEn: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    marginTop: 4,
  },
  glow: {
    position: "absolute",
    top: -160,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  descLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  kvRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  kvCell: {
    flex: 1,
    paddingVertical: 6,
  },
  kvLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  kvValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
});

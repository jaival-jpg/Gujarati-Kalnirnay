import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CalendarMonth } from "@/components/CalendarMonth";
import { MONTHS_EN_GU } from "@/constants/panchang";
import { festivalsForMonth } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 60;

export default function CalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fade = useRef(new Animated.Value(1)).current;
  const slideX = useRef(new Animated.Value(0)).current;

  const animateChange = useCallback(
    (direction: 1 | -1, fn: () => void) => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 90,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(slideX, {
          toValue: -direction * 28,
          duration: 90,
          useNativeDriver: true,
        }),
      ]).start(() => {
        fn();
        slideX.setValue(direction * 28);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(slideX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]).start();
      });
    },
    [fade, slideX],
  );

  const goNext = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    animateChange(1, () => {
      if (month === 11) { setYear((y) => y + 1); setMonth(0); }
      else setMonth((m) => m + 1);
    });
  }, [month, animateChange]);

  const goPrev = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    animateChange(-1, () => {
      if (month === 0) { setYear((y) => y - 1); setMonth(11); }
      else setMonth((m) => m - 1);
    });
  }, [month, animateChange]);

  const goToday = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    animateChange(1, () => {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
      setSelectedDate(null);
    });
  }, [today, animateChange]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 20 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderRelease: (_, g) => {
          if (g.dx < -40) goNext();
          else if (g.dx > 40) goPrev();
        },
      }),
    [goNext, goPrev],
  );

  const monthFestivals = useMemo(() => festivalsForMonth(month + 1), [month]);
  const festivalDays = useMemo(
    () => new Set(monthFestivals.map((f) => f.day)),
    [monthFestivals],
  );

  const selectedPanchang = useMemo(
    () => (selectedDate ? computePanchang(selectedDate) : null),
    [selectedDate],
  );

  const vikramInfo = useMemo(() => {
    const sample = new Date(year, month, 15);
    return computePanchang(sample);
  }, [year, month]);

  const isThisMonth =
    year === today.getFullYear() && month === today.getMonth();

  const isDark = colors.scheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Compact gradient header ── */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: (insets.top || 16) + 6 }]}
      >
        <View style={styles.glowCircle} />

        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>કેલેન્ડર</Text>
          <Pressable onPress={goToday} style={styles.todayBtn} hitSlop={8}>
            <Feather name="crosshair" size={13} color="#fff" />
            <Text style={styles.todayBtnText}>આજ</Text>
          </Pressable>
        </View>

        {/* Month nav */}
        <View style={styles.monthRow}>
          <Pressable
            onPress={goPrev}
            style={({ pressed }) => [styles.navArrow, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            <Feather name="chevron-left" size={18} color="rgba(255,255,255,0.9)" />
          </Pressable>

          <View style={styles.monthCenter}>
            <Text style={styles.monthName}>{MONTHS_EN_GU[month]}</Text>
            <Text style={styles.monthSub}>
              {vikramInfo.vikramMonthGu}  ·  {toGujaratiDigits(year)}  ·  વિ.સં. {toGujaratiDigits(year + 57)}
            </Text>
          </View>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.navArrow, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.9)" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Calendar card ── */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{ opacity: fade, transform: [{ translateX: slideX }] }}
        >
          <View
            style={[
              styles.calCard,
              {
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: isDark
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(217,76,42,0.14)",
                shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Legend */}
            <View style={styles.legendRow}>
              <LegendItem color={colors.primary} label="સામાન્ય" dot />
              <LegendItem color="#E53935" label="રવિ / તહેવાર" dot />
              <LegendItem color={colors.success} label="શુભ" smallDot />
              <LegendItem color={colors.danger} label="અશુભ" smallDot />
            </View>

            <View
              style={[
                styles.legendSep,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(217,76,42,0.10)",
                },
              ]}
            />

            <CalendarMonth
              year={year}
              month={month}
              selectedDate={selectedDate}
              festivalDays={festivalDays}
              onSelectDay={(date) => {
                if (Platform.OS !== "web") Haptics.selectionAsync();
                setSelectedDate(date);
                const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                router.push(`/date/${iso}`);
              }}
            />
          </View>
        </Animated.View>

        {/* ── Selected date quick-card (no auto-nav, just info) ── */}
        {selectedDate && selectedPanchang && (
          <Pressable
            onPress={() => {
              const iso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
              router.push(`/date/${iso}`);
            }}
            style={({ pressed }) => [
              styles.selectedCard,
              {
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: colors.primary + "55",
                shadowColor: colors.shadow,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.gradientStart + "18", colors.gradientEnd + "08"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.selectedInner}>
              <View style={[styles.selectedChip, { backgroundColor: colors.primary }]}>
                <Text style={[styles.selectedChipNum, { color: colors.primaryForeground }]}>
                  {toGujaratiDigits(selectedDate.getDate())}
                </Text>
                <Text style={[styles.selectedChipMonth, { color: colors.primaryForeground }]}>
                  {MONTHS_EN_GU[selectedDate.getMonth()].slice(0, 3)}
                </Text>
              </View>
              <View style={styles.selectedBody}>
                <Text style={[styles.selectedTithi, { color: colors.foreground }]}>
                  {selectedPanchang.pakshaGu} {selectedPanchang.tithiGu}
                </Text>
                <Text style={[styles.selectedMeta, { color: colors.mutedForeground }]}>
                  {selectedPanchang.nakshatraGu}  ·  {selectedPanchang.vaarGu}  ·  {selectedPanchang.yogaGu}
                </Text>
                <View style={styles.selectedBadges}>
                  {selectedPanchang.isShubh && (
                    <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
                      <Text style={[styles.badgeTxt, { color: colors.success }]}>શુભ</Text>
                    </View>
                  )}
                  {selectedPanchang.isAshubh && (
                    <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
                      <Text style={[styles.badgeTxt, { color: colors.danger }]}>અશુભ</Text>
                    </View>
                  )}
                </View>
              </View>
              <Feather name="chevron-right" size={18} color={colors.primary} />
            </View>
          </Pressable>
        )}

        {/* ── Festival list ── */}
        {monthFestivals.length > 0 && (
          <View style={styles.festSection}>
            <View style={styles.festHeadRow}>
              <View style={[styles.festHeadIcon, { backgroundColor: colors.primarySoft }]}>
                <Feather name="gift" size={12} color={colors.primary} />
              </View>
              <Text style={[styles.festHeadText, { color: colors.foreground }]}>
                {MONTHS_EN_GU[month]}ના તહેવારો
              </Text>
              <Text style={[styles.festCount, { color: colors.mutedForeground }]}>
                {toGujaratiDigits(monthFestivals.length)}
              </Text>
            </View>

            <View
              style={[
                styles.festCard,
                {
                  backgroundColor: isDark ? colors.card : "#FFFFFF",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(217,76,42,0.12)",
                  shadowColor: colors.shadow,
                },
              ]}
            >
              {monthFestivals.map((f, idx) => (
                <React.Fragment key={f.id}>
                  {idx > 0 && (
                    <View
                      style={[
                        styles.festDivider,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(217,76,42,0.08)",
                        },
                      ]}
                    />
                  )}
                  <Pressable
                    onPress={() => router.push(`/festival/${f.id}`)}
                    style={({ pressed }) => [
                      styles.festRow,
                      { opacity: pressed ? 0.75 : 1 },
                    ]}
                  >
                    <View style={[styles.festDayChip, { backgroundColor: colors.primarySoft }]}>
                      <Text style={[styles.festDayNum, { color: colors.primary }]}>
                        {toGujaratiDigits(f.day)}
                      </Text>
                    </View>
                    <View style={styles.festBody}>
                      <Text style={[styles.festName, { color: colors.foreground }]} numberOfLines={1}>
                        {f.nameGu}
                      </Text>
                      <Text style={[styles.festNameEn, { color: colors.mutedForeground }]} numberOfLines={1}>
                        {f.nameEn}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
                  </Pressable>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function LegendItem({
  color,
  label,
  dot,
  smallDot,
}: {
  color: string;
  label: string;
  dot?: boolean;
  smallDot?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.legendItem}>
      {dot ? (
        <View style={[styles.legendDot, { backgroundColor: color }]} />
      ) : (
        <View
          style={[
            styles.legendSmallDot,
            { backgroundColor: color + "33", borderColor: color, borderWidth: 1.5 },
          ]}
        />
      )}
      <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    overflow: "hidden",
  },
  glowCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -80,
    right: -40,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  todayBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  navArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  monthCenter: {
    flex: 1,
    alignItems: "center",
  },
  monthName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  monthSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  calCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
    padding: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendSmallDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  legendSep: {
    height: 1,
    marginBottom: 8,
    borderRadius: 1,
  },
  selectedCard: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
  },
  selectedInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  selectedChip: {
    width: 54,
    height: 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedChipNum: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
  },
  selectedChipMonth: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 0.4,
  },
  selectedBody: { flex: 1 },
  selectedTithi: {
    fontSize: 16,
    fontWeight: "800",
  },
  selectedMeta: {
    fontSize: 11,
    marginTop: 3,
  },
  selectedBadges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 7,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  badgeTxt: {
    fontSize: 10,
    fontWeight: "700",
  },
  festSection: { marginTop: 16 },
  festHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  festHeadIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  festHeadText: {
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  festCount: { fontSize: 12 },
  festCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  festDivider: { height: 1, marginHorizontal: 12 },
  festRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  festDayChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  festDayNum: { fontSize: 15, fontWeight: "800" },
  festBody: { flex: 1 },
  festName: { fontSize: 13, fontWeight: "700" },
  festNameEn: { fontSize: 11, marginTop: 1 },
});

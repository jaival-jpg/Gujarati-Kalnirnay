import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
import { MONTHS_EN_GU, VIKRAM_MONTHS_GU } from "@/constants/panchang";
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
          duration: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(slideX, {
          toValue: -direction * 32,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        fn();
        slideX.setValue(direction * 32);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(slideX, {
            toValue: 0,
            duration: 220,
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

  const isThisMonth =
    year === today.getFullYear() && month === today.getMonth();

  const todayPanchang = useMemo(() => computePanchang(today), [today]);

  const selectedPanchang = useMemo(
    () => (selectedDate ? computePanchang(selectedDate) : null),
    [selectedDate],
  );

  const vikramMonth = useMemo(() => {
    const sample = new Date(year, month, 15);
    return computePanchang(sample).vikramMonthGu;
  }, [year, month]);

  const isDark = colors.scheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ─── Gradient Header ─── */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: (insets.top || 16) + 12 }]}
      >
        {/* Decorative glow circles */}
        <View style={[styles.glowCircle, styles.glowCircle1]} />
        <View style={[styles.glowCircle, styles.glowCircle2]} />

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>ગુજરાતી</Text>
            <Text style={styles.headerTitle}>કેલેન્ડર</Text>
          </View>
          <Pressable onPress={goToday} style={styles.todayBtn} hitSlop={8}>
            <Feather name="crosshair" size={15} color="#FFFFFF" />
            <Text style={styles.todayBtnText}>આજ</Text>
          </Pressable>
        </View>

        {/* Month navigator */}
        <View style={styles.monthNavRow}>
          <Pressable
            onPress={goPrev}
            style={({ pressed }) => [styles.navArrow, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            <Feather name="chevron-left" size={20} color="rgba(255,255,255,0.9)" />
          </Pressable>

          <View style={styles.monthCenterBlock}>
            <Text style={styles.monthName}>{MONTHS_EN_GU[month]}</Text>
            <View style={styles.monthMeta}>
              <Text style={styles.monthMetaText}>{vikramMonth}</Text>
              <View style={styles.monthMetaDot} />
              <Text style={styles.monthMetaText}>
                {toGujaratiDigits(year)}
              </Text>
              <View style={styles.monthMetaDot} />
              <Text style={styles.monthMetaText}>
                વિ.સં. {toGujaratiDigits(year + 57)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.navArrow, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={10}
          >
            <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.9)" />
          </Pressable>
        </View>

        {/* Mini stats strip */}
        {isThisMonth && (
          <View style={styles.statsStrip}>
            <StatPill label="તિથિ" value={`${todayPanchang.pakshaGu} ${todayPanchang.tithiGu}`} />
            <View style={styles.statsDivider} />
            <StatPill label="નક્ષત્ર" value={todayPanchang.nakshatraGu} />
            <View style={styles.statsDivider} />
            <StatPill label="તહેવારો" value={toGujaratiDigits(monthFestivals.length)} />
          </View>
        )}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Calendar Card ─── */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            opacity: fade,
            transform: [{ translateX: slideX }],
            marginTop: -24,
            marginHorizontal: 14,
          }}
        >
          {/* Outer glass card */}
          <View
            style={[
              styles.calCard,
              {
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                borderColor: isDark
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(217,76,42,0.12)",
                shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Blur effect on iOS */}
            {Platform.OS === "ios" && (
              <BlurView
                intensity={30}
                tint={isDark ? "dark" : "light"}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              />
            )}

            <View style={styles.calInner}>
              {/* Legend row */}
              <View style={styles.legendRow}>
                <LegendDot color={colors.success} label="શુભ" />
                <LegendDot color={colors.danger} label="અશુભ" />
                <LegendDot color={colors.festival} label="તહેવાર" />
                <LegendDot
                  color={colors.primary}
                  label="આજ"
                  filled
                />
              </View>

              <View
                style={[
                  styles.legendLine,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(217,76,42,0.10)",
                  },
                ]}
              />

              {/* The calendar grid */}
              <CalendarMonth
                year={year}
                month={month}
                selectedDate={selectedDate}
                onSelectDay={(date) => {
                  if (Platform.OS !== "web") Haptics.selectionAsync();
                  setSelectedDate(date);
                }}
              />
            </View>
          </View>
        </Animated.View>

        {/* ─── Selected day detail card ─── */}
        {selectedDate && selectedPanchang && (
          <Pressable
            onPress={() => {
              const iso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
              router.push(`/date/${iso}`);
            }}
            style={({ pressed }) => [
              styles.selectedCard,
              {
                marginHorizontal: 14,
                marginTop: 14,
                backgroundColor: colors.card,
                borderColor: colors.primary + "44",
                shadowColor: colors.shadow,
                transform: [{ scale: pressed ? 0.99 : 1 }],
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.gradientStart + "22", colors.gradientEnd + "11"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.selectedCardGradient}
            />
            <View style={styles.selectedCardRow}>
              <View
                style={[
                  styles.selectedDateChip,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={[styles.selectedDateNum, { color: colors.primaryForeground }]}>
                  {toGujaratiDigits(selectedDate.getDate())}
                </Text>
                <Text style={[styles.selectedDateMonth, { color: colors.primaryForeground }]}>
                  {MONTHS_EN_GU[selectedDate.getMonth()].slice(0, 3)}
                </Text>
              </View>
              <View style={styles.selectedInfo}>
                <Text style={[styles.selectedTithi, { color: colors.foreground }]}>
                  {selectedPanchang.pakshaGu} {selectedPanchang.tithiGu}
                </Text>
                <Text style={[styles.selectedNak, { color: colors.mutedForeground }]}>
                  {selectedPanchang.nakshatraGu} • {selectedPanchang.vaarGu}
                </Text>
                <View style={styles.selectedBadges}>
                  {selectedPanchang.isShubh && (
                    <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
                      <Text style={[styles.badgeText, { color: colors.success }]}>
                        શુભ
                      </Text>
                    </View>
                  )}
                  {selectedPanchang.isAshubh && (
                    <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
                      <Text style={[styles.badgeText, { color: colors.danger }]}>
                        અશુભ
                      </Text>
                    </View>
                  )}
                  <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
                    <Text style={[styles.badgeText, { color: colors.accent }]}>
                      {selectedPanchang.yogaGu}
                    </Text>
                  </View>
                </View>
              </View>
              <Feather name="chevron-right" size={18} color={colors.primary} />
            </View>
          </Pressable>
        )}

        {/* ─── Month festivals list ─── */}
        {monthFestivals.length > 0 && (
          <View style={[styles.festSection, { marginHorizontal: 14 }]}>
            <View style={styles.festHeader}>
              <View style={[styles.festHeaderDot, { backgroundColor: colors.primarySoft }]}>
                <Feather name="gift" size={13} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.festHeaderTitle, { color: colors.foreground }]}>
                  {MONTHS_EN_GU[month]}ના તહેવારો
                </Text>
                <Text style={[styles.festHeaderSub, { color: colors.mutedForeground }]}>
                  {toGujaratiDigits(monthFestivals.length)} તહેવાર
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.festList,
                {
                  backgroundColor: colors.card,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(217,76,42,0.10)",
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
                            ? "rgba(255,255,255,0.07)"
                            : "rgba(217,76,42,0.09)",
                        },
                      ]}
                    />
                  )}
                  <Pressable
                    onPress={() => router.push(`/festival/${f.id}`)}
                    style={({ pressed }) => [
                      styles.festRow,
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <View
                      style={[
                        styles.festDayChip,
                        { backgroundColor: colors.primarySoft },
                      ]}
                    >
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
                    <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function LegendDot({
  color,
  label,
  filled,
}: {
  color: string;
  label: string;
  filled?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.legendItem}>
      {filled ? (
        <View style={[styles.legendFilledDot, { backgroundColor: color }]} />
      ) : (
        <View
          style={[
            styles.legendOutlineDot,
            { borderColor: color, backgroundColor: color + "28" },
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
    paddingHorizontal: 18,
    paddingBottom: 38,
    overflow: "hidden",
  },
  glowCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  glowCircle1: {
    width: 220,
    height: 220,
    top: -90,
    right: -60,
  },
  glowCircle2: {
    width: 130,
    height: 130,
    top: 40,
    left: -50,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  headerLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  todayBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  navArrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  monthCenterBlock: {
    flex: 1,
    alignItems: "center",
  },
  monthName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  monthMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  monthMetaText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "500",
  },
  monthMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.14)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statsDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 4,
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  calCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  calInner: {
    padding: 14,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendFilledDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendOutlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  legendLine: {
    height: 1,
    marginBottom: 10,
    borderRadius: 1,
  },
  selectedCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  selectedCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  selectedDateChip: {
    width: 58,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDateNum: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 28,
  },
  selectedDateMonth: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 0.4,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedTithi: {
    fontSize: 18,
    fontWeight: "800",
  },
  selectedNak: {
    fontSize: 12,
    marginTop: 3,
  },
  selectedBadges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
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
  festSection: {
    marginTop: 20,
  },
  festHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  festHeaderDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  festHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  festHeaderSub: {
    fontSize: 11,
    marginTop: 1,
  },
  festList: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
  festDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  festRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  festDayChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  festDayNum: {
    fontSize: 17,
    fontWeight: "800",
  },
  festBody: {
    flex: 1,
  },
  festName: {
    fontSize: 14,
    fontWeight: "700",
  },
  festNameEn: {
    fontSize: 11,
    marginTop: 2,
  },
});

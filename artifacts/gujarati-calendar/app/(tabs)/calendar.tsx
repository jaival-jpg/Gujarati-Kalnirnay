import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { GlassCard } from "@/components/GlassCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MONTHS_EN_GU } from "@/constants/panchang";
import { festivalsForMonth } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { toGujaratiDigits } from "@/lib/panchang";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 60;

export default function CalendarTabScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  const animateChange = useCallback(
    (direction: 1 | -1, fn: () => void) => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(slide, {
          toValue: -direction * 24,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start(() => {
        fn();
        slide.setValue(direction * 24);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(slide, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]).start();
      });
    },
    [fade, slide],
  );

  const goNext = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    animateChange(1, () => {
      const nextMonth = month + 1;
      if (nextMonth > 11) {
        setYear((y) => y + 1);
        setMonth(0);
      } else {
        setMonth(nextMonth);
      }
    });
  }, [month, animateChange]);

  const goPrev = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    animateChange(-1, () => {
      const prevMonth = month - 1;
      if (prevMonth < 0) {
        setYear((y) => y - 1);
        setMonth(11);
      } else {
        setMonth(prevMonth);
      }
    });
  }, [month, animateChange]);

  const goToday = useCallback(() => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }, [today]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderRelease: (_, g) => {
          if (g.dx < -40) goNext();
          else if (g.dx > 40) goPrev();
        },
      }),
    [goNext, goPrev],
  );

  const monthFestivals = useMemo(() => festivalsForMonth(month + 1), [month]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        titleGu={`${MONTHS_EN_GU[month]} ${toGujaratiDigits(year)}`}
        titleEn="Panchang"
        rightAction={
          <Pressable onPress={goToday} hitSlop={6}>
            <Feather name="crosshair" size={18} color="#FFFFFF" />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthNav}>
          <Pressable
            onPress={goPrev}
            style={({ pressed }) => [
              styles.navBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            hitSlop={6}
          >
            <Feather name="chevron-left" size={18} color={colors.foreground} />
          </Pressable>
          <View style={styles.monthCenter}>
            <Text style={[styles.monthName, { color: colors.foreground }]}>
              {MONTHS_EN_GU[month]}
            </Text>
            <Text style={[styles.monthYear, { color: colors.mutedForeground }]}>
              {toGujaratiDigits(year)} • વિ.સં. {toGujaratiDigits(year + 57)}
            </Text>
          </View>
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.navBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            hitSlop={6}
          >
            <Feather name="chevron-right" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={{
            opacity: fade,
            transform: [{ translateX: slide }],
          }}
        >
          <GlassCard padded={false} style={{ padding: 14 }}>
            <CalendarMonth year={year} month={month} />
          </GlassCard>
        </Animated.View>

        <View style={styles.legendRow}>
          <Legend color={colors.success} label="શુભ" />
          <Legend color={colors.danger} label="અશુભ" />
          <Legend color={colors.festival} label="તહેવાર" />
          <Legend color={colors.primary} label="આજ" filled />
        </View>

        {monthFestivals.length > 0 ? (
          <View style={{ marginTop: 24 }}>
            <Text style={[styles.festHeading, { color: colors.foreground }]}>
              આ મહિનાના તહેવાર
            </Text>
            <Text style={[styles.festSub, { color: colors.mutedForeground }]}>
              {MONTHS_EN_GU[month]} {toGujaratiDigits(year)}
            </Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {monthFestivals.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() =>
                    router.push(
                      `/date/${year}-${String(month + 1).padStart(2, "0")}-${String(f.day).padStart(2, "0")}`,
                    )
                  }
                  style={({ pressed }) => [
                    styles.festRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius - 6,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.festDay,
                      { backgroundColor: colors.primarySoft },
                    ]}
                  >
                    <Text style={[styles.festDayNum, { color: colors.primary }]}>
                      {toGujaratiDigits(f.day)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.festName, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {f.nameGu}
                    </Text>
                    <Text
                      style={[styles.festNameEn, { color: colors.mutedForeground }]}
                      numberOfLines={1}
                    >
                      {f.nameEn}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Legend({
  color,
  label,
  filled,
}: {
  color: string;
  label: string;
  filled?: boolean;
}) {
  const c = useColors();
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: filled ? color : "transparent",
            borderColor: color,
          },
        ]}
      />
      <Text style={[styles.legendText, { color: c.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  monthCenter: {
    flex: 1,
    alignItems: "center",
  },
  monthName: {
    fontSize: 18,
    fontWeight: "700",
  },
  monthYear: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 12,
  },
  festHeading: {
    fontSize: 16,
    fontWeight: "700",
  },
  festSub: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  festRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  festDay: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  festDayNum: {
    fontSize: 16,
    fontWeight: "700",
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

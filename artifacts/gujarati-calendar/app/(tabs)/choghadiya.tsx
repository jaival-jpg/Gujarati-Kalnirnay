import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChoghadiyaList } from "@/components/ChoghadiyaList";
import { GlassCard } from "@/components/GlassCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MONTHS_EN_GU, VAAR_GU } from "@/constants/panchang";
import { useColors } from "@/hooks/useColors";
import { computeChoghadiya } from "@/lib/choghadiya";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";
import { computeSkyTimes, formatTime } from "@/lib/sun";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 60;

export default function ChoghadiyaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState(() => new Date());
  const [tab, setTab] = useState<"day" | "night">("day");

  const cho = useMemo(() => computeChoghadiya(date), [date]);
  const sky = useMemo(() => computeSkyTimes(date), [date]);
  const panchang = useMemo(() => computePanchang(date), [date]);
  const isToday = useMemo(() => {
    const t = new Date();
    return (
      date.getFullYear() === t.getFullYear() &&
      date.getMonth() === t.getMonth() &&
      date.getDate() === t.getDate()
    );
  }, [date]);

  const shiftDay = useCallback((delta: number) => {
    if (Platform.OS !== "web") Haptics.selectionAsync();
    setDate((d) => {
      const n = new Date(d);
      n.setDate(d.getDate() + delta);
      return n;
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        titleGu="ચોઘડિયા"
        titleEn="Choghadiya"
        subtitle={`${VAAR_GU[date.getDay()]} • ${toGujaratiDigits(date.getDate())} ${MONTHS_EN_GU[date.getMonth()]} ${toGujaratiDigits(date.getFullYear())}`}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateNav}>
          <Pressable
            onPress={() => shiftDay(-1)}
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
          <Pressable
            onPress={() => setDate(new Date())}
            style={({ pressed }) => [
              styles.todayChip,
              {
                backgroundColor: isToday ? colors.primary : colors.primarySoft,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.todayChipText,
                {
                  color: isToday ? colors.primaryForeground : colors.primary,
                },
              ]}
            >
              {isToday ? "આજ" : "આજ પર જાઓ"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => shiftDay(1)}
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

        <GlassCard padded={false} style={{ padding: 14, marginTop: 14 }}>
          <View style={styles.skyRow}>
            <View style={styles.skyItem}>
              <Feather name="sunrise" size={16} color={colors.warning} />
              <Text style={[styles.skyLabel, { color: colors.mutedForeground }]}>
                સૂર્યોદય
              </Text>
              <Text style={[styles.skyValue, { color: colors.foreground }]}>
                {sky.sunrise === null ? "—" : formatTime(sky.sunrise)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.skyItem}>
              <Feather name="sun" size={16} color={colors.primary} />
              <Text style={[styles.skyLabel, { color: colors.mutedForeground }]}>
                મધ્યાહ્ન
              </Text>
              <Text style={[styles.skyValue, { color: colors.foreground }]}>
                {panchang.vaarGu}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.skyItem}>
              <Feather name="sunset" size={16} color={colors.danger} />
              <Text style={[styles.skyLabel, { color: colors.mutedForeground }]}>
                સૂર્યાસ્ત
              </Text>
              <Text style={[styles.skyValue, { color: colors.foreground }]}>
                {sky.sunset === null ? "—" : formatTime(sky.sunset)}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View
          style={[
            styles.tabBar,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Pressable
            onPress={() => setTab("day")}
            style={[
              styles.tabBtn,
              tab === "day" && {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Feather
              name="sun"
              size={14}
              color={tab === "day" ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: tab === "day" ? colors.foreground : colors.mutedForeground,
                  fontWeight: tab === "day" ? "700" : "500",
                },
              ]}
            >
              દિવસ
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("night")}
            style={[
              styles.tabBtn,
              tab === "night" && {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Feather
              name="moon"
              size={14}
              color={tab === "night" ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: tab === "night" ? colors.foreground : colors.mutedForeground,
                  fontWeight: tab === "night" ? "700" : "500",
                },
              ]}
            >
              રાત્રિ
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 16 }}>
          <ChoghadiyaList
            slots={tab === "day" ? cho.day : cho.night}
            highlightCurrent={isToday}
          />
        </View>

        <View style={[styles.note, { backgroundColor: colors.accentSoft }]}>
          <Feather name="info" size={14} color={colors.accent} />
          <Text style={[styles.noteText, { color: colors.foreground }]}>
            ચોઘડિયા સમય સ્થાનિક સૂર્યોદય/સૂર્યાસ્ત આધારિત છે (અમદાવાદ).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  todayChip: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 22,
    alignItems: "center",
  },
  todayChipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  skyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  skyItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    gap: 4,
  },
  skyLabel: {
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  skyValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginVertical: 4,
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 18,
    padding: 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabText: {
    fontSize: 13,
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});

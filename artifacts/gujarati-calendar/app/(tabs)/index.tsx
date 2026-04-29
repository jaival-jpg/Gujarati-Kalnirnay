import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FestivalCard } from "@/components/FestivalCard";
import { GlassCard } from "@/components/GlassCard";
import { MONTHS_EN_GU } from "@/constants/panchang";
import { festivalsForMonth, FESTIVALS } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { computeChoghadiya } from "@/lib/choghadiya";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";
import { computeSkyTimes, formatTime } from "@/lib/sun";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 60;

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);
  const panchang = useMemo(() => computePanchang(today), [today]);
  const sky = useMemo(() => computeSkyTimes(today), [today]);
  const cho = useMemo(() => computeChoghadiya(today), [today]);

  const upcomingFestivals = useMemo(() => {
    const monthIdx = today.getMonth() + 1;
    const dayIdx = today.getDate();
    const sorted = [...FESTIVALS].sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
    const upcoming = sorted.filter(
      (f) => f.month > monthIdx || (f.month === monthIdx && f.day >= dayIdx),
    );
    const wrapped = upcoming.length >= 3 ? upcoming : [...upcoming, ...sorted];
    return wrapped.slice(0, 3);
  }, [today]);

  const currentDayCho = cho.day.find((s) => {
    const nowH = today.getHours() + today.getMinutes() / 60;
    if (s.startHours <= s.endHours) {
      return nowH >= s.startHours && nowH < s.endHours;
    }
    return nowH >= s.startHours || nowH < s.endHours;
  });

  const greeting = greetingFor(today);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.hero,
            { paddingTop: (insets.top || 16) + 18 },
          ]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreet}>{greeting}</Text>
              <Text style={styles.heroAppName}>ગુજરાતી પંચાંગ</Text>
            </View>
            <Pressable
              onPress={() => router.push("/about")}
              style={styles.omChip}
              hitSlop={8}
            >
              <Text style={styles.om}>ॐ</Text>
            </Pressable>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.bigDay}>
                {toGujaratiDigits(today.getDate())}
              </Text>
              <View>
                <Text style={styles.monthName}>
                  {MONTHS_EN_GU[today.getMonth()]}
                </Text>
                <Text style={styles.weekday}>{panchang.vaarGu}</Text>
              </View>
            </View>
            <View style={styles.tithiBubble}>
              <Text style={styles.bubbleLabel}>તિથિ</Text>
              <Text style={styles.bubbleVal}>
                {panchang.pakshaGu} {panchang.tithiGu}
              </Text>
              <Text style={styles.bubbleSub}>
                {panchang.vikramMonthGu} • વિ.સં. {toGujaratiDigits(panchang.vikramYear)}
              </Text>
            </View>
          </View>

          <View style={styles.heroPills}>
            <HeroPill
              icon="sunrise"
              label="સૂર્યોદય"
              value={sky.sunrise === null ? "—" : formatTime(sky.sunrise)}
            />
            <HeroPill
              icon="sunset"
              label="સૂર્યાસ્ત"
              value={sky.sunset === null ? "—" : formatTime(sky.sunset)}
            />
            <HeroPill
              icon="star"
              label="નક્ષત્ર"
              value={panchang.nakshatraGu}
              compact
            />
          </View>

          <View style={[styles.glow, { backgroundColor: "rgba(255,255,255,0.08)" }]} />
        </LinearGradient>

        <View style={styles.actions}>
          <ActionTile
            icon="calendar"
            label="પંચાંગ"
            sub="માસિક"
            onPress={() => router.push("/calendar")}
          />
          <ActionTile
            icon="clock"
            label="ચોઘડિયા"
            sub="આજનું"
            onPress={() => router.push("/choghadiya")}
          />
          <ActionTile
            icon="gift"
            label="તહેવારો"
            sub="આગામી"
            onPress={() => router.push("/festivals")}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle
            iconName="activity"
            titleGu="હાલનું ચોઘડિયું"
            titleEn="Now"
          />
          {currentDayCho ? (
            <GlassCard>
              <View style={styles.currentChoRow}>
                <View
                  style={[
                    styles.currentChoBar,
                    { backgroundColor: qualityColor(currentDayCho.type, colors).fg },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.currentChoTitle, { color: colors.foreground }]}>
                    {translateCho(currentDayCho.type)}
                  </Text>
                  <Text
                    style={[styles.currentChoTime, { color: colors.mutedForeground }]}
                  >
                    {currentDayCho.startLabel} – {currentDayCho.endLabel}
                  </Text>
                </View>
                <View
                  style={[
                    styles.currentChoBadge,
                    {
                      backgroundColor: qualityColor(currentDayCho.type, colors).softer,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.currentChoBadgeText,
                      { color: qualityColor(currentDayCho.type, colors).fg },
                    ]}
                  >
                    {qualityLabel(currentDayCho.type)}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ) : (
            <GlassCard>
              <Text style={{ color: colors.mutedForeground }}>
                રાત્રિ ચોઘડિયા જુઓ →
              </Text>
            </GlassCard>
          )}
        </View>

        <View style={styles.section}>
          <SectionTitle
            iconName="star"
            titleGu="આજનાં મુખ્ય પંચાંગ"
            titleEn="Today's Panchang"
            actionLabel="બધું જુઓ"
            onAction={() =>
              router.push(
                `/date/${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
              )
            }
          />
          <GlassCard>
            <View style={styles.miniGrid}>
              <MiniStat label="તિથિ" value={`${panchang.pakshaGu} ${panchang.tithiGu}`} />
              <MiniStat label="નક્ષત્ર" value={panchang.nakshatraGu} />
              <MiniStat label="યોગ" value={panchang.yogaGu} />
              <MiniStat label="કરણ" value={panchang.karanGu} />
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <SectionTitle
            iconName="gift"
            titleGu="આગામી તહેવારો"
            titleEn="Upcoming"
            actionLabel="બધાં"
            onAction={() => router.push("/festivals")}
          />
          <View style={{ gap: 10 }}>
            {upcomingFestivals.map((f) => (
              <FestivalCard key={f.id} festival={f} compact />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 5) return "શુભ રાત્રી";
  if (h < 12) return "સુપ્રભાત";
  if (h < 17) return "નમસ્તે";
  return "શુભ સંધ્યા";
}

function HeroPill({
  icon,
  label,
  value,
  compact,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.pill, compact && { flex: 1.4 }]}>
      <Feather name={icon} size={14} color="#FFFFFF" />
      <View>
        <Text style={styles.pillLabel}>{label}</Text>
        <Text style={styles.pillValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function ActionTile({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionTile,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          { backgroundColor: colors.primarySoft },
        ]}
      >
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>{sub}</Text>
    </Pressable>
  );
}

function SectionTitle({
  iconName,
  titleGu,
  titleEn,
  actionLabel,
  onAction,
}: {
  iconName: keyof typeof Feather.glyphMap;
  titleGu: string;
  titleEn?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionTitleLeft}>
        <View
          style={[
            styles.sectionDot,
            { backgroundColor: colors.primarySoft },
          ]}
        >
          <Feather name={iconName} size={14} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {titleGu}
          </Text>
          {titleEn ? (
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
              {titleEn}
            </Text>
          ) : null}
        </View>
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.actionLink, { color: colors.primary }]}>
            {actionLabel} →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.miniValue, { color: colors.foreground }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function qualityColor(
  type: string,
  colors: ReturnType<typeof useColors>,
): { fg: string; softer: string } {
  if (type === "amrit" || type === "shubh" || type === "labh") {
    return { fg: colors.success, softer: colors.successSoft };
  }
  if (type === "udveg" || type === "rog" || type === "kaal") {
    return { fg: colors.danger, softer: colors.dangerSoft };
  }
  return { fg: colors.warning, softer: colors.warningSoft };
}

function translateCho(type: string): string {
  const map: Record<string, string> = {
    amrit: "અમૃત",
    shubh: "શુભ",
    labh: "લાભ",
    char: "ચલ",
    udveg: "ઉદ્વેગ",
    rog: "રોગ",
    kaal: "કાળ",
  };
  return map[type] ?? type;
}

function qualityLabel(type: string): string {
  if (["amrit", "shubh", "labh"].includes(type)) return "શુભ";
  if (["udveg", "rog", "kaal"].includes(type)) return "અશુભ";
  return "મધ્યમ";
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroGreet: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  heroAppName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 2,
  },
  omChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  om: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  dateRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dateCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bigDay: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 64,
    letterSpacing: -2,
  },
  monthName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  weekday: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 2,
  },
  tithiBubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
  },
  bubbleLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bubbleVal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  bubbleSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    marginTop: 4,
  },
  heroPills: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 14,
    padding: 10,
  },
  pillLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  pillValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 1,
    maxWidth: 100,
  },
  glow: {
    position: "absolute",
    top: -160,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    marginTop: -22,
  },
  actionTile: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  actionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 18,
    marginTop: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSub: {
    fontSize: 11,
    marginTop: 1,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  actionLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  currentChoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  currentChoBar: {
    width: 4,
    height: 38,
    borderRadius: 2,
  },
  currentChoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  currentChoTime: {
    fontSize: 12,
    marginTop: 2,
  },
  currentChoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentChoBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  miniGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  miniStat: {
    width: "50%",
    paddingVertical: 8,
  },
  miniLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  miniValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },
});

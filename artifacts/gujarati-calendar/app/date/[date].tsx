import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChoghadiyaList } from "@/components/ChoghadiyaList";
import { FestivalCard } from "@/components/FestivalCard";
import { GlassCard } from "@/components/GlassCard";
import { PanchangRow } from "@/components/PanchangRow";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MONTHS_EN_GU, VAAR_GU } from "@/constants/panchang";
import { festivalsForDay } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { computeChoghadiya } from "@/lib/choghadiya";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";
import { computeSkyTimes, formatTime } from "@/lib/sun";

function parseDate(s?: string | string[]): Date {
  const v = Array.isArray(s) ? s[0] : s;
  if (!v) return new Date();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return new Date();
  return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
}

export default function DateDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const d = useMemo(() => parseDate(date), [date]);
  const panchang = useMemo(() => computePanchang(d), [d]);
  const sky = useMemo(() => computeSkyTimes(d), [d]);
  const cho = useMemo(() => computeChoghadiya(d), [d]);
  const dayFestivals = useMemo(
    () => festivalsForDay(d.getMonth() + 1, d.getDate()),
    [d],
  );

  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const subtitle = `${VAAR_GU[d.getDay()]} • ${toGujaratiDigits(d.getDate())} ${MONTHS_EN_GU[d.getMonth()]} ${toGujaratiDigits(d.getFullYear())}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        titleGu={isToday ? "આજનું પંચાંગ" : "પંચાંગ"}
        titleEn={isToday ? "Today" : "Detail"}
        subtitle={subtitle}
        showBack
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard padded={false} style={{ padding: 16 }}>
          <View style={styles.heroRow}>
            <View
              style={[styles.heroDay, { backgroundColor: colors.primarySoft }]}
            >
              <Text style={[styles.heroDayNum, { color: colors.primary }]}>
                {toGujaratiDigits(d.getDate())}
              </Text>
              <Text style={[styles.heroDayMonth, { color: colors.primary }]}>
                {MONTHS_EN_GU[d.getMonth()].slice(0, 3)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTithi, { color: colors.foreground }]}>
                {panchang.pakshaGu} {panchang.tithiGu}
              </Text>
              <Text style={[styles.heroVar, { color: colors.mutedForeground }]}>
                {panchang.vaarGu} • {panchang.nakshatraGu}
              </Text>
              <View
                style={[
                  styles.heroPill,
                  {
                    backgroundColor: panchang.isShubh
                      ? colors.successSoft
                      : panchang.isAshubh
                        ? colors.dangerSoft
                        : colors.accentSoft,
                  },
                ]}
              >
                <Feather
                  name={panchang.isShubh ? "check-circle" : panchang.isAshubh ? "alert-triangle" : "circle"}
                  size={12}
                  color={
                    panchang.isShubh
                      ? colors.success
                      : panchang.isAshubh
                        ? colors.danger
                        : colors.accent
                  }
                />
                <Text
                  style={[
                    styles.heroPillText,
                    {
                      color: panchang.isShubh
                        ? colors.success
                        : panchang.isAshubh
                          ? colors.danger
                          : colors.accent,
                    },
                  ]}
                >
                  {panchang.isShubh ? "શુભ દિવસ" : panchang.isAshubh ? "અશુભ" : "મધ્યમ"}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {dayFestivals.length > 0 ? (
          <View style={{ gap: 8 }}>
            <SectionLabel iconName="gift" labelGu="આજનો તહેવાર" />
            {dayFestivals.map((f) => (
              <FestivalCard key={f.id} festival={f} />
            ))}
          </View>
        ) : null}

        <View>
          <SectionLabel iconName="book-open" labelGu="પંચાંગ" />
          <GlassCard padded={false} style={{ padding: 14 }}>
            <PanchangRow
              icon="moon"
              labelGu="તિથિ"
              labelEn="Tithi"
              valueGu={`${panchang.pakshaGu} ${panchang.tithiGu}`}
              valueEn={panchang.pakshaEn}
            />
            <PanchangRow
              icon="star"
              labelGu="નક્ષત્ર"
              labelEn="Nakshatra"
              valueGu={panchang.nakshatraGu}
              valueEn={panchang.nakshatraEn}
            />
            <PanchangRow
              icon="link"
              labelGu="યોગ"
              labelEn="Yoga"
              valueGu={panchang.yogaGu}
            />
            <PanchangRow
              icon="layers"
              labelGu="કરણ"
              labelEn="Karan"
              valueGu={panchang.karanGu}
            />
            <PanchangRow
              icon="sun"
              labelGu="વાર"
              labelEn="Vaar"
              valueGu={panchang.vaarGu}
            />
            <PanchangRow
              icon="calendar"
              labelGu="વિક્રમ માસ"
              labelEn="Vikram Month"
              valueGu={panchang.vikramMonthGu}
              valueEn={`વિ.સં. ${toGujaratiDigits(panchang.vikramYear)}`}
              last
            />
          </GlassCard>
        </View>

        <View>
          <SectionLabel iconName="sun" labelGu="સૂર્ય અને ચંદ્ર" />
          <GlassCard padded={false} style={{ padding: 14 }}>
            <PanchangRow
              icon="sunrise"
              labelGu="સૂર્યોદય"
              labelEn="Sunrise"
              valueGu={sky.sunrise === null ? "—" : formatTime(sky.sunrise)}
              accent="good"
            />
            <PanchangRow
              icon="sunset"
              labelGu="સૂર્યાસ્ત"
              labelEn="Sunset"
              valueGu={sky.sunset === null ? "—" : formatTime(sky.sunset)}
              accent="bad"
            />
            <PanchangRow
              icon="moon"
              labelGu="ચંદ્રોદય"
              labelEn="Moonrise"
              valueGu={sky.moonrise === null ? "—" : formatTime(sky.moonrise)}
              accent="neutral"
            />
            <PanchangRow
              icon="cloud-rain"
              labelGu="ચંદ્રાસ્ત"
              labelEn="Moonset"
              valueGu={sky.moonset === null ? "—" : formatTime(sky.moonset)}
              accent="neutral"
              last
            />
          </GlassCard>
        </View>

        <View>
          <SectionLabel iconName="clock" labelGu="દિવસનાં ચોઘડિયા" />
          <GlassCard padded={false} style={{ padding: 8 }}>
            <ChoghadiyaList slots={cho.day} highlightCurrent={isToday} />
          </GlassCard>
        </View>

        <View>
          <SectionLabel iconName="moon" labelGu="રાત્રિનાં ચોઘડિયા" />
          <GlassCard padded={false} style={{ padding: 8 }}>
            <ChoghadiyaList slots={cho.night} highlightCurrent={isToday} />
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionLabel({
  iconName,
  labelGu,
}: {
  iconName: keyof typeof Feather.glyphMap;
  labelGu: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionLabel}>
      <Feather name={iconName} size={14} color={colors.primary} />
      <Text
        style={[
          styles.sectionLabelText,
          { color: colors.mutedForeground },
        ]}
      >
        {labelGu}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heroDay: {
    width: 78,
    height: 88,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  heroDayNum: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 38,
  },
  heroDayMonth: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.4,
  },
  heroTithi: {
    fontSize: 22,
    fontWeight: "800",
  },
  heroVar: {
    fontSize: 13,
    marginTop: 4,
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});

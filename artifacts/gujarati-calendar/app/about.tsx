import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader titleGu="એપ વિશે" titleEn="About" showBack />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandWrap}>
          <Image
            source={require("@/assets/images/app-logo.jpg")}
            style={styles.brandIcon}
            resizeMode="cover"
          />
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>
            ગુજરાતી પંચાંગ
          </Text>
          <Text style={[styles.brandTagline, { color: colors.mutedForeground }]}>
            તિથિ • નક્ષત્ર • ચોઘડિયા • તહેવાર
          </Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>
            સંસ્કરણ ૧.૦.૦
          </Text>
        </View>

        <GlassCard>
          <Text style={[styles.heading, { color: colors.foreground }]}>
            વિશે
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            આ એપ રોજિંદા હિન્દુ પંચાંગ — તિથિ, નક્ષત્ર, યોગ, કરણ, સૂર્યોદય, સૂર્યાસ્ત, ચોઘડિયા અને મુખ્ય તહેવારોની માહિતી ગુજરાતી ભાષામાં પૂરી પાડે છે. તમામ ગણતરી અમદાવાદના સ્થાન આધારે કરવામાં આવી છે.
          </Text>
        </GlassCard>

        <GlassCard padded={false} style={{ padding: 14 }}>
          <Text style={[styles.heading, { color: colors.foreground }]}>
            સુવિધાઓ
          </Text>
          <Feature icon="calendar" labelGu="માસિક પંચાંગ" subGu="તિથિ-વાર સાથે રંગીન કેલેન્ડર" />
          <Feature icon="clock" labelGu="ચોઘડિયા" subGu="દિવસ અને રાત્રિના આઠ-આઠ ચોઘડિયા" />
          <Feature icon="gift" labelGu="તહેવારો" subGu="મુખ્ય હિન્દુ તહેવારોની યાદી" />
          <Feature icon="sun" labelGu="સૂર્ય-ચંદ્ર સમય" subGu="દૈનિક ઉદય-અસ્ત સમય" />
          <Feature icon="moon" labelGu="આછો/ઘેરો રંગ" subGu="તમારી પસંદ પ્રમાણે દેખાવ" last />
        </GlassCard>

        <GlassCard>
          <Text style={[styles.heading, { color: colors.foreground }]}>
            સ્થાન
          </Text>
          <View style={styles.locRow}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <Text style={[styles.body, { color: colors.foreground, marginTop: 0, flex: 1 }]}>
              અમદાવાદ, ગુજરાત, ભારત
            </Text>
          </View>
          <Text style={[styles.coord, { color: colors.mutedForeground }]}>
            ૨૩.૦૨°N, ૭૨.૫૭°E • IST (UTC+૫:૩૦)
          </Text>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.heading, { color: colors.foreground }]}>
            માહિતીસ્રોત
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            પંચાંગ ગણતરી પરંપરાગત જ્યોતિષ સૂત્રોના ગાણિતિક અંદાજ આધારિત છે અને માહિતીના હેતુ માટે જ છે. ધાર્મિક નિર્ણયો માટે અધિકૃત પંચાંગ સાથે મેળ ખવડાવો.
          </Text>
        </GlassCard>

        <Text style={[styles.foot, { color: colors.mutedForeground }]}>
          સર્વ સ્વ આત્મ • શુભમ ભવતુ
        </Text>
        <Text style={[styles.developer, { color: colors.mutedForeground }]}>
          Developer : Jaival Pandya
        </Text>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  labelGu,
  subGu,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  labelGu: string;
  subGu: string;
  last?: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.featRow,
        !last && {
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View
        style={[styles.featIcon, { backgroundColor: colors.primarySoft }]}
      >
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featLabel, { color: colors.foreground }]}>{labelGu}</Text>
        <Text style={[styles.featSub, { color: colors.mutedForeground }]}>{subGu}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandWrap: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 4,
  },
  brandIcon: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
  },
  brandTagline: {
    fontSize: 13,
    marginTop: 4,
  },
  version: {
    fontSize: 11,
    marginTop: 10,
    letterSpacing: 0.6,
  },
  heading: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  featRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  featIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  featLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  featSub: {
    fontSize: 12,
    marginTop: 2,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  coord: {
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 0.4,
  },
  foot: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 18,
    fontStyle: "italic",
  },
  developer: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 6,
    letterSpacing: 0.3,
  },
});

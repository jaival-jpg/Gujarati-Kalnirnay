import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/GlassCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors } from "@/hooks/useColors";
import {
  cancelAllReminders,
  requestNotificationPermission,
  scheduleDailyPanchang,
} from "@/lib/notifications";

const TAB_BAR_HEIGHT = Platform.OS === "web" ? 84 : 60;

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { themeMode, setThemeMode, notificationsEnabled, setNotificationsEnabled } =
    useSettings();

  const onToggleNotifications = useCallback(
    async (value: boolean) => {
      if (Platform.OS !== "web") Haptics.selectionAsync();
      if (value) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          Alert.alert(
            "પરવાનગી જરૂરી",
            "દૈનિક યાદ માટે સૂચનાની પરવાનગી આપો.",
          );
          return;
        }
        await scheduleDailyPanchang();
        setNotificationsEnabled(true);
      } else {
        await cancelAllReminders();
        setNotificationsEnabled(false);
      }
    },
    [setNotificationsEnabled],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader titleGu="સેટિંગ્સ" titleEn="Settings" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle iconName="moon" titleGu="દેખાવ" />
        <GlassCard padded={false} style={{ padding: 6 }}>
          <ThemeRow
            label="આછો"
            sub="Light"
            icon="sun"
            active={themeMode === "light"}
            onPress={() => setThemeMode("light")}
          />
          <Divider />
          <ThemeRow
            label="ઘેરો"
            sub="Dark"
            icon="moon"
            active={themeMode === "dark"}
            onPress={() => setThemeMode("dark")}
          />
          <Divider />
          <ThemeRow
            label="સિસ્ટમ"
            sub="System"
            icon="smartphone"
            active={themeMode === "system"}
            onPress={() => setThemeMode("system")}
          />
        </GlassCard>

        <SectionTitle iconName="bell" titleGu="સૂચનાઓ" style={{ marginTop: 20 }} />
        <GlassCard>
          <View style={styles.row}>
            <View
              style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}
            >
              <Feather name="bell" size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                દૈનિક પંચાંગ યાદ
              </Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
                રોજ સવારે ૭ વાગે સૂચના
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </GlassCard>

        <SectionTitle iconName="info" titleGu="વધુ" style={{ marginTop: 20 }} />
        <GlassCard padded={false} style={{ padding: 6 }}>
          <NavRow
            icon="gift"
            label="તહેવારોની યાદી"
            sub="All festivals"
            onPress={() => router.push("/festivals")}
          />
          <Divider />
          <NavRow
            icon="info"
            label="એપ વિશે"
            sub="About"
            onPress={() => router.push("/about")}
          />
        </GlassCard>

        <Text style={[styles.foot, { color: colors.mutedForeground }]}>
          સ્થાન: અમદાવાદ, ગુજરાત
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionTitle({
  iconName,
  titleGu,
  style,
}: {
  iconName: keyof typeof Feather.glyphMap;
  titleGu: string;
  style?: object;
}) {
  const colors = useColors();
  return (
    <View style={[styles.sectionRow, style]}>
      <Feather name={iconName} size={14} color={colors.primary} />
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {titleGu}
      </Text>
    </View>
  );
}

function ThemeRow({
  label,
  sub,
  icon,
  active,
  onPress,
}: {
  label: string;
  sub: string;
  icon: keyof typeof Feather.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeRow,
        {
          backgroundColor: active ? colors.primarySoft : "transparent",
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: active ? colors.primary : colors.muted,
          },
        ]}
      >
        <Feather
          name={icon}
          size={16}
          color={active ? colors.primaryForeground : colors.foreground}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{sub}</Text>
      </View>
      {active ? (
        <Feather name="check-circle" size={20} color={colors.primary} />
      ) : (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colors.border,
          }}
        />
      )}
    </Pressable>
  );
}

function NavRow({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { paddingHorizontal: 8, paddingVertical: 12, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
        <Feather name={icon} size={16} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>{label}</Text>
        {sub ? (
          <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{sub}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function Divider() {
  const colors = useColors();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginHorizontal: 12,
      }}
    />
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    borderRadius: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowSub: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  foot: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 28,
  },
});

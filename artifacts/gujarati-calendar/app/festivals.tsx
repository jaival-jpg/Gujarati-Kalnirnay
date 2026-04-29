import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FestivalCard } from "@/components/FestivalCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MONTHS_EN_GU } from "@/constants/panchang";
import { FESTIVALS, type Festival } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | Festival["type"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "બધાં" },
  { key: "major", label: "મુખ્ય" },
  { key: "religious", label: "ધાર્મિક" },
  { key: "regional", label: "પ્રાદેશિક" },
  { key: "national", label: "રાષ્ટ્રીય" },
];

export default function FestivalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = FESTIVALS.filter((f) => {
      if (filter !== "all" && f.type !== filter) return false;
      if (!q) return true;
      return (
        f.nameGu.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.descriptionGu.toLowerCase().includes(q)
      );
    });

    const byMonth = new Map<number, Festival[]>();
    for (const f of filtered) {
      const list = byMonth.get(f.month) ?? [];
      list.push(f);
      byMonth.set(f.month, list);
    }
    const months = Array.from(byMonth.keys()).sort((a, b) => a - b);
    return months.map((m) => ({
      month: m,
      items: (byMonth.get(m) ?? []).sort((a, b) => a.day - b.day),
    }));
  }, [query, filter]);

  const totalCount = grouped.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        titleGu="તહેવારો"
        titleEn="Festivals"
        showBack
        subtitle={`${totalCount} તહેવાર · ૨૦૨૬`}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View
          style={[
            styles.search,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="તહેવાર શોધો..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={6}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={({ pressed }) => [
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: active ? colors.primaryForeground : colors.foreground,
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {grouped.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="search" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              કોઈ તહેવાર મળ્યો નથી
            </Text>
          </View>
        ) : (
          grouped.map((group) => (
            <View key={group.month} style={{ marginBottom: 18 }}>
              <Text style={[styles.monthHeader, { color: colors.primary }]}>
                {MONTHS_EN_GU[group.month - 1]}
              </Text>
              <View style={{ gap: 10, marginTop: 8 }}>
                {group.items.map((f) => (
                  <FestivalCard key={f.id} festival={f} />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 4,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 56,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});

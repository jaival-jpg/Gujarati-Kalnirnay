import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  CHOGHADIYA_LABELS,
  CHOGHADIYA_QUALITY,
  ChoghadiyaType,
} from "@/constants/panchang";
import { useColors } from "@/hooks/useColors";
import { ChoghadiyaSlot } from "@/lib/choghadiya";

interface ChoghadiyaListProps {
  slots: ChoghadiyaSlot[];
  highlightCurrent?: boolean;
}

function isCurrentSlot(slot: ChoghadiyaSlot, now: Date): boolean {
  const nowH = now.getHours() + now.getMinutes() / 60;
  if (slot.startHours <= slot.endHours) {
    return nowH >= slot.startHours && nowH < slot.endHours;
  }
  return nowH >= slot.startHours || nowH < slot.endHours;
}

export function ChoghadiyaList({ slots, highlightCurrent }: ChoghadiyaListProps) {
  const colors = useColors();
  const now = new Date();

  return (
    <View style={styles.list}>
      {slots.map((slot, idx) => {
        const label = CHOGHADIYA_LABELS[slot.type];
        const quality = CHOGHADIYA_QUALITY[slot.type];
        const swatch = swatchFor(slot.type, colors);
        const active = highlightCurrent && isCurrentSlot(slot, now);

        return (
          <View
            key={idx}
            style={[
              styles.row,
              {
                backgroundColor: active ? swatch.softer : "transparent",
                borderRadius: 14,
                borderColor: active ? swatch.fg : "transparent",
                borderWidth: active ? 1.5 : 0,
              },
            ]}
          >
            <View style={[styles.bar, { backgroundColor: swatch.fg }]} />
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={[styles.titleGu, { color: colors.foreground }]}>
                  {label.gu}
                </Text>
                <Text style={[styles.titleEn, { color: colors.mutedForeground }]}>
                  {label.en}
                </Text>
                <View style={[styles.badge, { backgroundColor: swatch.softer }]}>
                  <View
                    style={[
                      styles.badgeDot,
                      { backgroundColor: swatch.fg },
                    ]}
                  />
                  <Text style={[styles.badgeText, { color: swatch.fg }]}>
                    {qualityLabel(quality)}
                  </Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Feather name="clock" size={12} color={colors.mutedForeground} />
                <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
                  {slot.startLabel}  →  {slot.endLabel}
                </Text>
                {active ? (
                  <Text style={[styles.nowTag, { color: colors.primary }]}>
                    હાલ ચાલુ
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function swatchFor(
  type: ChoghadiyaType,
  colors: ReturnType<typeof useColors>,
): { fg: string; softer: string } {
  const quality = CHOGHADIYA_QUALITY[type];
  if (quality === "good") {
    return { fg: colors.success, softer: colors.successSoft };
  }
  if (quality === "bad") {
    return { fg: colors.danger, softer: colors.dangerSoft };
  }
  return { fg: colors.warning, softer: colors.warningSoft };
}

function qualityLabel(q: "good" | "bad" | "neutral"): string {
  if (q === "good") return "શુભ";
  if (q === "bad") return "અશુભ";
  return "મધ્યમ";
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  body: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleGu: {
    fontSize: 16,
    fontWeight: "700",
  },
  titleEn: {
    fontSize: 12,
    flex: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    flex: 1,
  },
  nowTag: {
    fontSize: 11,
    fontWeight: "700",
  },
});

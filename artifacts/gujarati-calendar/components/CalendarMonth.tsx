import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { VAAR_SHORT_GU } from "@/constants/panchang";
import { festivalsForMonth } from "@/data/festivals";
import { useColors } from "@/hooks/useColors";
import { computePanchang, toGujaratiDigits } from "@/lib/panchang";

interface CalendarMonthProps {
  year: number;
  month: number; // 0-11
  selectedDay?: number;
  onSelectDay?: (date: Date) => void;
}

interface CellMeta {
  day: number;
  inMonth: boolean;
  date: Date;
  tithiGu: string;
  pakshaGu: string;
  isShubh: boolean;
  isAshubh: boolean;
  isFestival: boolean;
}

export function CalendarMonth({
  year,
  month,
  selectedDay,
  onSelectDay,
}: CalendarMonthProps) {
  const colors = useColors();

  const grid = useMemo<CellMeta[]>(() => {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    const monthFestivals = new Set(
      festivalsForMonth(month + 1).map((f) => f.day),
    );

    const cells: CellMeta[] = [];
    for (let i = 0; i < totalCells; i += 1) {
      let cellYear = year;
      let cellMonth = month;
      let day: number;
      let inMonth = true;
      if (i < startWeekday) {
        day = prevMonthDays - (startWeekday - 1 - i);
        cellMonth = month - 1;
        if (cellMonth < 0) {
          cellMonth = 11;
          cellYear = year - 1;
        }
        inMonth = false;
      } else if (i >= startWeekday + daysInMonth) {
        day = i - (startWeekday + daysInMonth) + 1;
        cellMonth = month + 1;
        if (cellMonth > 11) {
          cellMonth = 0;
          cellYear = year + 1;
        }
        inMonth = false;
      } else {
        day = i - startWeekday + 1;
      }
      const date = new Date(cellYear, cellMonth, day);
      const p = computePanchang(date);
      cells.push({
        day,
        inMonth,
        date,
        tithiGu: p.tithiGu,
        pakshaGu: p.pakshaGu,
        isShubh: p.isShubh,
        isAshubh: p.isAshubh,
        isFestival: inMonth && monthFestivals.has(day),
      });
    }
    return cells;
  }, [year, month]);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  return (
    <View>
      <View style={styles.weekRow}>
        {VAAR_SHORT_GU.map((label, idx) => (
          <View style={styles.weekCell} key={label}>
            <Text
              style={[
                styles.weekLabel,
                {
                  color:
                    idx === 0 || idx === 6
                      ? colors.primary
                      : colors.mutedForeground,
                },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((cell, idx) => {
          const isToday = isCurrentMonth && cell.inMonth && cell.day === today.getDate();
          const isSelected =
            selectedDay !== undefined && cell.inMonth && cell.day === selectedDay;
          const dotColor = cell.isFestival
            ? colors.festival
            : cell.isShubh
              ? colors.success
              : cell.isAshubh
                ? colors.danger
                : null;

          return (
            <Pressable
              key={idx}
              onPress={() =>
                cell.inMonth && (onSelectDay?.(cell.date) ?? navigateToDate(cell.date))
              }
              style={({ pressed }) => [
                styles.cell,
                {
                  backgroundColor: isToday
                    ? colors.primary
                    : isSelected
                      ? colors.primarySoft
                      : "transparent",
                  borderRadius: 14,
                  opacity: pressed && cell.inMonth ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isToday
                      ? colors.primaryForeground
                      : !cell.inMonth
                        ? colors.mutedForeground + "70"
                        : colors.foreground,
                    fontWeight: isToday ? "800" : "600",
                  },
                ]}
              >
                {toGujaratiDigits(cell.day)}
              </Text>
              <Text
                style={[
                  styles.tithiText,
                  {
                    color: isToday
                      ? "rgba(255,255,255,0.85)"
                      : !cell.inMonth
                        ? colors.mutedForeground + "60"
                        : colors.mutedForeground,
                  },
                ]}
                numberOfLines={1}
              >
                {cell.tithiGu}
              </Text>
              {dotColor ? (
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isToday ? "#FFFFFF" : dotColor,
                    },
                  ]}
                />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function navigateToDate(date: Date) {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  router.push(`/date/${iso}`);
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  weekCell: {
    flex: 1,
    alignItems: "center",
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.85,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
  },
  dayText: {
    fontSize: 17,
  },
  tithiText: {
    fontSize: 9,
    marginTop: 1,
    paddingHorizontal: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 2,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
    marginTop: 2,
  },
});

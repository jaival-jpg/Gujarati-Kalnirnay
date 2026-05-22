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
  selectedDate?: Date | null;
  festivalDays?: Set<number>;
  onSelectDay?: (date: Date) => void;
}

interface CellMeta {
  day: number;
  inMonth: boolean;
  date: Date;
  tithiGu: string;
  isShubh: boolean;
  isAshubh: boolean;
  isFestival: boolean;
  isSunday: boolean;
}

export function CalendarMonth({
  year,
  month,
  selectedDate,
  festivalDays: externalFestivalDays,
  onSelectDay,
}: CalendarMonthProps) {
  const colors = useColors();
  const isDark = colors.scheme === "dark";

  const internalFestivalDays = useMemo(
    () => new Set(festivalsForMonth(month + 1).map((f) => f.day)),
    [month],
  );
  const festivalDays = externalFestivalDays ?? internalFestivalDays;

  const grid = useMemo<CellMeta[][]>(() => {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    const flat: CellMeta[] = [];
    for (let i = 0; i < totalCells; i++) {
      const weekday = i % 7;
      let cellYear = year;
      let cellMonth = month;
      let day: number;
      let inMonth = true;

      if (i < startWeekday) {
        day = prevMonthDays - (startWeekday - 1 - i);
        cellMonth = month - 1;
        if (cellMonth < 0) { cellMonth = 11; cellYear = year - 1; }
        inMonth = false;
      } else if (i >= startWeekday + daysInMonth) {
        day = i - (startWeekday + daysInMonth) + 1;
        cellMonth = month + 1;
        if (cellMonth > 11) { cellMonth = 0; cellYear = year + 1; }
        inMonth = false;
      } else {
        day = i - startWeekday + 1;
      }

      const date = new Date(cellYear, cellMonth, day);
      const p = computePanchang(date);
      flat.push({
        day, inMonth, date,
        tithiGu: p.tithiGu,
        isShubh: p.isShubh,
        isAshubh: p.isAshubh,
        isFestival: inMonth && festivalDays.has(day),
        isSunday: weekday === 0,
      });
    }

    const rows: CellMeta[][] = [];
    for (let r = 0; r < flat.length / 7; r++) {
      rows.push(flat.slice(r * 7, r * 7 + 7));
    }
    return rows;
  }, [year, month, festivalDays]);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const gridLine = isDark
    ? "rgba(255,255,255,0.07)"
    : "rgba(217,76,42,0.10)";

  const cellBg = "#FFF4E6";
  const todayRed = "#E53935";

  return (
    <View>
      {/* Weekday header */}
      <View style={styles.weekRow}>
        {VAAR_SHORT_GU.map((label, idx) => (
          <View key={label} style={styles.weekCell}>
            <Text
              style={[
                styles.weekLabel,
                {
                  color: idx === 0 ? todayRed : colors.mutedForeground,
                  fontWeight: idx === 0 ? "700" : "600",
                },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid */}
      <View
        style={[
          styles.gridWrap,
          { borderColor: gridLine, borderWidth: 1, backgroundColor: gridLine },
        ]}
      >
        {grid.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {row.map((cell, colIdx) => {
              const isToday =
                isCurrentMonth &&
                cell.inMonth &&
                cell.day === today.getDate();

              const isSelected =
                selectedDate != null &&
                cell.inMonth &&
                selectedDate.getFullYear() === (cell.inMonth ? year : cell.date.getFullYear()) &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === cell.day;

              // Colour logic
              const isHoliday = (cell.isSunday || cell.isFestival) && cell.inMonth;
              const numColor = isToday
                ? colors.primaryForeground
                : !cell.inMonth
                ? colors.mutedForeground + "55"
                : isHoliday
                ? todayRed
                : colors.foreground;

              const dotColor = cell.isShubh
                ? colors.success
                : cell.isAshubh
                ? colors.danger
                : null;

              return (
                <Pressable
                  key={colIdx}
                  onPress={() => {
                    if (onSelectDay) {
                      onSelectDay(cell.date);
                    } else {
                      navigateToDate(cell.date);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.cell,
                    {
                      backgroundColor: isToday
                        ? colors.primary
                        : isSelected
                        ? colors.primarySoft
                        : cellBg,
                      opacity: pressed ? 0.75 : 1,
                      marginRight: colIdx < 6 ? 1 : 0,
                      marginBottom: rowIdx < grid.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  {/* Today ring */}
                  {isToday && (
                    <View style={styles.todayRing} />
                  )}

                  {/* Day number */}
                  <Text
                    style={[
                      styles.dayNum,
                      { color: numColor, fontWeight: isToday || isHoliday ? "800" : "700" },
                    ]}
                  >
                    {toGujaratiDigits(cell.day)}
                  </Text>

                  {/* Tithi */}
                  <Text
                    style={[
                      styles.tithi,
                      {
                        color: isToday
                          ? "rgba(255,255,255,0.80)"
                          : !cell.inMonth
                          ? colors.mutedForeground + "55"
                          : colors.mutedForeground,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {cell.tithiGu}
                  </Text>

                  {/* Status dot */}
                  {dotColor && cell.inMonth ? (
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isToday
                            ? "rgba(255,255,255,0.85)"
                            : dotColor,
                        },
                      ]}
                    />
                  ) : (
                    <View style={styles.dotSpace} />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
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
    paddingBottom: 6,
  },
  weekCell: {
    flex: 1,
    alignItems: "center",
  },
  weekLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  gridWrap: {
    borderRadius: 14,
    overflow: "hidden",
    gap: 0,
  },
  gridRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 7,
    gap: 2,
    position: "relative",
  },
  todayRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
  dayNum: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 18,
  },
  tithi: {
    fontSize: 10,
    textAlign: "center",
    paddingHorizontal: 1,
    lineHeight: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotSpace: {
    width: 4,
    height: 4,
  },
});

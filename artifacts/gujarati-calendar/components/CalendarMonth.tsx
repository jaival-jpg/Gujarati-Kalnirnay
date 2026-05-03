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
  isSunday: boolean;
}

export function CalendarMonth({
  year,
  month,
  selectedDate,
  onSelectDay,
}: CalendarMonthProps) {
  const colors = useColors();

  const grid = useMemo<CellMeta[][]>(() => {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    const monthFestivals = new Set(
      festivalsForMonth(month + 1).map((f) => f.day),
    );

    const flat: CellMeta[] = [];
    for (let i = 0; i < totalCells; i++) {
      let cellYear = year;
      let cellMonth = month;
      let day: number;
      let inMonth = true;
      const weekday = i % 7;

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
        pakshaGu: p.pakshaGu,
        isShubh: p.isShubh,
        isAshubh: p.isAshubh,
        isFestival: inMonth && monthFestivals.has(day),
        isSunday: weekday === 0,
      });
    }

    // chunk into weeks
    const rows: CellMeta[][] = [];
    for (let r = 0; r < flat.length / 7; r++) {
      rows.push(flat.slice(r * 7, r * 7 + 7));
    }
    return rows;
  }, [year, month]);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const isDark = colors.scheme === "dark";

  const gridLine = isDark ? "rgba(255,255,255,0.07)" : "rgba(217,76,42,0.10)";
  const outerBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(217,76,42,0.13)";

  return (
    <View>
      {/* Weekday header */}
      <View
        style={[
          styles.weekHeaderRow,
          { borderBottomColor: gridLine, borderBottomWidth: 1 },
        ]}
      >
        {VAAR_SHORT_GU.map((label, idx) => (
          <View key={label} style={styles.weekHeaderCell}>
            <Text
              style={[
                styles.weekHeaderText,
                {
                  color: idx === 0
                    ? colors.primary
                    : colors.mutedForeground,
                  opacity: 0.85,
                },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      <View style={[styles.gridOuter, { borderColor: outerBorder, borderWidth: 1 }]}>
        {grid.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={[
              styles.gridRow,
              rowIdx < grid.length - 1
                ? { borderBottomColor: gridLine, borderBottomWidth: 1 }
                : null,
            ]}
          >
            {row.map((cell, colIdx) => {
              const isToday =
                isCurrentMonth &&
                cell.inMonth &&
                cell.day === today.getDate();

              const isSelected =
                selectedDate != null &&
                cell.inMonth &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === cell.day;

              return (
                <React.Fragment key={colIdx}>
                  {colIdx > 0 && (
                    <View
                      style={{
                        width: 1,
                        backgroundColor: gridLine,
                        alignSelf: "stretch",
                      }}
                    />
                  )}
                  <DayCell
                    cell={cell}
                    isToday={isToday}
                    isSelected={isSelected}
                    colors={colors}
                    onPress={() =>
                      cell.inMonth &&
                      (onSelectDay
                        ? onSelectDay(cell.date)
                        : navigateToDate(cell.date))
                    }
                  />
                </React.Fragment>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

interface DayCellProps {
  cell: CellMeta;
  isToday: boolean;
  isSelected: boolean;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}

function DayCell({ cell, isToday, isSelected, colors, onPress }: DayCellProps) {
  const dimText = !cell.inMonth;

  const dotColor = cell.isFestival
    ? colors.festival
    : cell.isShubh
    ? colors.success
    : cell.isAshubh
    ? colors.danger
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayCell,
        {
          backgroundColor: isToday
            ? colors.primary
            : isSelected
            ? colors.primarySoft
            : pressed && cell.inMonth
            ? colors.primarySoft + "88"
            : "transparent",
          opacity: dimText ? 0.32 : pressed ? 0.9 : 1,
        },
      ]}
    >
      {/* Day number */}
      <View
        style={[
          styles.dayNumWrap,
          isToday && { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 14 },
        ]}
      >
        <Text
          style={[
            styles.dayNum,
            {
              color: isToday
                ? colors.primaryForeground
                : cell.isSunday && cell.inMonth
                ? colors.primary
                : colors.foreground,
              fontWeight: isToday ? "800" : "600",
            },
          ]}
        >
          {toGujaratiDigits(cell.day)}
        </Text>
      </View>

      {/* Tithi */}
      <Text
        style={[
          styles.tithiText,
          {
            color: isToday
              ? "rgba(255,255,255,0.85)"
              : colors.mutedForeground,
          },
        ]}
        numberOfLines={1}
      >
        {cell.tithiGu}
      </Text>

      {/* Dot indicator */}
      {dotColor ? (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isToday ? "rgba(255,255,255,0.9)" : dotColor,
            },
          ]}
        />
      ) : (
        <View style={styles.dotSpace} />
      )}
    </Pressable>
  );
}

function navigateToDate(date: Date) {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  router.push(`/date/${iso}`);
}

const styles = StyleSheet.create({
  weekHeaderRow: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingTop: 2,
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  weekHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  gridOuter: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 8,
    gap: 3,
  },
  dayNumWrap: {
    minWidth: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  dayNum: {
    fontSize: 15,
    textAlign: "center",
  },
  tithiText: {
    fontSize: 8.5,
    textAlign: "center",
    letterSpacing: 0.1,
    paddingHorizontal: 1,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotSpace: {
    width: 5,
    height: 5,
  },
});

import { ChoghadiyaType } from "@/constants/panchang";

import { computeSkyTimes, formatTime, AHMEDABAD } from "./sun";

// Day choghadiya order keyed by weekday (0 = Sunday).
const DAY_ORDER: Record<number, ChoghadiyaType[]> = {
  0: ["udveg", "char", "labh", "amrit", "kaal", "shubh", "rog", "udveg"],
  1: ["amrit", "kaal", "shubh", "rog", "udveg", "char", "labh", "amrit"],
  2: ["rog", "udveg", "char", "labh", "amrit", "kaal", "shubh", "rog"],
  3: ["labh", "amrit", "kaal", "shubh", "rog", "udveg", "char", "labh"],
  4: ["shubh", "rog", "udveg", "char", "labh", "amrit", "kaal", "shubh"],
  5: ["char", "labh", "amrit", "kaal", "shubh", "rog", "udveg", "char"],
  6: ["kaal", "shubh", "rog", "udveg", "char", "labh", "amrit", "kaal"],
};

const NIGHT_ORDER: Record<number, ChoghadiyaType[]> = {
  0: ["shubh", "amrit", "char", "rog", "kaal", "labh", "udveg", "shubh"],
  1: ["char", "rog", "kaal", "labh", "udveg", "shubh", "amrit", "char"],
  2: ["kaal", "labh", "udveg", "shubh", "amrit", "char", "rog", "kaal"],
  3: ["udveg", "shubh", "amrit", "char", "rog", "kaal", "labh", "udveg"],
  4: ["amrit", "char", "rog", "kaal", "labh", "udveg", "shubh", "amrit"],
  5: ["rog", "kaal", "labh", "udveg", "shubh", "amrit", "char", "rog"],
  6: ["labh", "udveg", "shubh", "amrit", "char", "rog", "kaal", "labh"],
};

export interface ChoghadiyaSlot {
  type: ChoghadiyaType;
  startHours: number;
  endHours: number;
  startLabel: string;
  endLabel: string;
}

export interface DayChoghadiya {
  day: ChoghadiyaSlot[];
  night: ChoghadiyaSlot[];
  sunriseLabel: string;
  sunsetLabel: string;
}

function buildSlots(
  startHours: number,
  endHours: number,
  order: ChoghadiyaType[],
): ChoghadiyaSlot[] {
  let span = endHours - startHours;
  if (span <= 0) span += 24;
  const slotLength = span / 8;
  const slots: ChoghadiyaSlot[] = [];
  for (let i = 0; i < 8; i += 1) {
    const slotStart = (startHours + slotLength * i + 24) % 24;
    const slotEnd = (startHours + slotLength * (i + 1) + 24) % 24;
    slots.push({
      type: order[i] ?? "char",
      startHours: slotStart,
      endHours: slotEnd,
      startLabel: formatTime(slotStart),
      endLabel: formatTime(slotEnd),
    });
  }
  return slots;
}

export function computeChoghadiya(
  date: Date,
  location = AHMEDABAD,
): DayChoghadiya {
  const sky = computeSkyTimes(date, location);
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  const skyNext = computeSkyTimes(next, location);

  const sunrise = sky.sunrise ?? 6;
  const sunset = sky.sunset ?? 18;
  const sunriseNext = skyNext.sunrise ?? 6;

  const weekday = date.getDay();
  const dayOrder = DAY_ORDER[weekday] ?? DAY_ORDER[0]!;
  const nightOrder = NIGHT_ORDER[weekday] ?? NIGHT_ORDER[0]!;

  // Night spans sunset → next-day sunrise; encode as start..start+span.
  const nightSpanStart = sunset;
  const nightSpanEnd = sunriseNext + 24; // unwrap across midnight
  const nightSlots: ChoghadiyaSlot[] = [];
  const nightSlotLen = (nightSpanEnd - nightSpanStart) / 8;
  for (let i = 0; i < 8; i += 1) {
    const rawStart = nightSpanStart + nightSlotLen * i;
    const rawEnd = nightSpanStart + nightSlotLen * (i + 1);
    const startHours = rawStart % 24;
    const endHours = rawEnd % 24;
    nightSlots.push({
      type: nightOrder[i] ?? "char",
      startHours,
      endHours,
      startLabel: formatTime(startHours),
      endLabel: formatTime(endHours),
    });
  }

  return {
    day: buildSlots(sunrise, sunset, dayOrder),
    night: nightSlots,
    sunriseLabel: formatTime(sunrise),
    sunsetLabel: formatTime(sunset),
  };
}

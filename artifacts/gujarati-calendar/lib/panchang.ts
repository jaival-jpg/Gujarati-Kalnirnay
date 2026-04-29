import {
  GUJARATI_DIGITS,
  KARAN_GU,
  NAKSHATRA_EN,
  NAKSHATRA_GU,
  PAKSHA_EN,
  PAKSHA_GU,
  TITHI_KRISHNA_LAST_GU,
  TITHI_NAMES_EN,
  TITHI_NAMES_GU,
  VAAR_GU,
  VIKRAM_MONTHS_GU,
  YOGA_GU,
} from "@/constants/panchang";

const SYNODIC_MONTH = 29.530588853;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const J2000 = Date.UTC(2000, 0, 1, 12);
const AYANAMSA = 24.13;

function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}

function normalize360(v: number): number {
  return ((v % 360) + 360) % 360;
}

function daysSince(date: Date, epoch: number): number {
  return (date.getTime() - epoch) / 86400000;
}

export function lunarAge(date: Date): number {
  const days = daysSince(date, REF_NEW_MOON);
  return ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

export function moonLongitude(date: Date): number {
  const days = daysSince(date, J2000);
  const lon = 218.3164591 + 13.176358 * days - AYANAMSA;
  return normalize360(lon);
}

export function sunLongitude(date: Date): number {
  const days = daysSince(date, J2000);
  const lon = 280.46 + 0.9856 * days - AYANAMSA;
  return normalize360(lon);
}

export interface Panchang {
  date: Date;
  vaarIndex: number;
  vaarGu: string;
  tithiIndex: number;
  tithiGu: string;
  tithiEn: string;
  pakshaIndex: number;
  pakshaGu: string;
  pakshaEn: string;
  nakshatraIndex: number;
  nakshatraGu: string;
  nakshatraEn: string;
  yogaIndex: number;
  yogaGu: string;
  karanIndex: number;
  karanGu: string;
  vikramMonthGu: string;
  vikramYear: number;
  isShubh: boolean;
  isAshubh: boolean;
}

function noonOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d;
}

export function computePanchang(date: Date): Panchang {
  const noon = noonOf(date);
  const age = lunarAge(noon);
  const tithiAbs = Math.floor((age / SYNODIC_MONTH) * 30);
  const pakshaIndex = tithiAbs < 15 ? 0 : 1;
  const tithiIndex = tithiAbs % 15;

  const moonLon = moonLongitude(noon);
  const nakshatraIndex = Math.floor(moonLon / (360 / 27)) % 27;

  const yogaSum = (sunLongitude(noon) + moonLon) % 360;
  const yogaIndex = Math.floor(yogaSum / (360 / 27)) % 27;

  const halfTithi = Math.floor((age / SYNODIC_MONTH) * 60);
  let karanIndex: number;
  if (halfTithi === 0) karanIndex = 10;
  else if (halfTithi === 57) karanIndex = 7;
  else if (halfTithi === 58) karanIndex = 8;
  else if (halfTithi === 59) karanIndex = 9;
  else karanIndex = (halfTithi - 1) % 7;

  const vaarIndex = noon.getDay();

  const tithiGu =
    pakshaIndex === 1 && tithiIndex === 14
      ? TITHI_KRISHNA_LAST_GU
      : TITHI_NAMES_GU[tithiIndex] ?? "";
  const tithiEn = TITHI_NAMES_EN[tithiIndex] ?? "";

  const vikramMonthGu = VIKRAM_MONTHS_GU[noon.getMonth()] ?? "";
  const vikramYear = noon.getFullYear() + 57;

  const isAshubh = karanIndex === 6 || yogaIndex === 16 || yogaIndex === 26;
  const isShubh =
    !isAshubh &&
    (tithiIndex === 4 ||
      tithiIndex === 7 ||
      tithiIndex === 10 ||
      (pakshaIndex === 0 && tithiIndex === 14));

  return {
    date,
    vaarIndex,
    vaarGu: VAAR_GU[vaarIndex] ?? "",
    tithiIndex,
    tithiGu,
    tithiEn,
    pakshaIndex,
    pakshaGu: PAKSHA_GU[pakshaIndex] ?? "",
    pakshaEn: PAKSHA_EN[pakshaIndex] ?? "",
    nakshatraIndex,
    nakshatraGu: NAKSHATRA_GU[nakshatraIndex] ?? "",
    nakshatraEn: NAKSHATRA_EN[nakshatraIndex] ?? "",
    yogaIndex,
    yogaGu: YOGA_GU[yogaIndex] ?? "",
    karanIndex,
    karanGu: KARAN_GU[karanIndex] ?? "",
    vikramMonthGu,
    vikramYear,
    isShubh,
    isAshubh,
  };
}

export function toGujaratiDigits(value: number | string): string {
  return String(value)
    .split("")
    .map((ch) => {
      const digit = parseInt(ch, 10);
      if (Number.isNaN(digit)) return ch;
      return GUJARATI_DIGITS[digit] ?? ch;
    })
    .join("");
}

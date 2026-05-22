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

import {
  julianDay,
  lahiriAyanamsa,
  moonLonLat,
  norm360,
  sunLonTropical,
} from "./astronomy";

export interface Panchang {
  date: Date;
  // Vaar
  vaarIndex: number;
  vaarGu: string;
  // Tithi
  tithiIndex: number;    // 0-14 within paksha
  tithiGu: string;
  tithiEn: string;
  // Paksha
  pakshaIndex: number;   // 0 = Shukla, 1 = Krishna
  pakshaGu: string;
  pakshaEn: string;
  // Nakshatra
  nakshatraIndex: number;
  nakshatraGu: string;
  nakshatraEn: string;
  // Yoga
  yogaIndex: number;
  yogaGu: string;
  // Karan
  karanIndex: number;
  karanGu: string;
  // Vikram Samvat
  vikramMonthGu: string;
  vikramMonthIndex: number;
  vikramYear: number;
  // Flags
  isShubh: boolean;
  isAshubh: boolean;
}

/**
 * Returns a Date set to noon IST on the given calendar date,
 * expressed as UTC (noon IST = 06:30 UTC).
 */
function noonISTasUTC(date: Date): Date {
  const d = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      6, // 06:30 UTC = 12:00 IST
      30,
      0,
    ),
  );
  return d;
}

export function computePanchang(date: Date): Panchang {
  const noon = noonISTasUTC(date);
  const jd = julianDay(noon);
  const ayanamsa = lahiriAyanamsa(jd);

  // ── Tropical longitudes ───────────────────────────────────────────────────
  const sunTrop = sunLonTropical(jd);
  const { lon: moonTrop } = moonLonLat(jd);

  // ── Sidereal longitudes ───────────────────────────────────────────────────
  const sunSid  = norm360(sunTrop  - ayanamsa);
  const moonSid = norm360(moonTrop - ayanamsa);

  // ── Tithi ─────────────────────────────────────────────────────────────────
  // Each tithi = 12° of elongation between Moon and Sun
  const elongation = norm360(moonTrop - sunTrop); // tropical difference
  const tithiRaw   = Math.floor(elongation / 12); // 0-29
  const pakshaIndex = tithiRaw >= 15 ? 1 : 0;     // 0=Shukla, 1=Krishna
  const tithiIndex  = tithiRaw % 15;               // 0-14

  const tithiGu =
    pakshaIndex === 1 && tithiIndex === 14
      ? TITHI_KRISHNA_LAST_GU
      : (TITHI_NAMES_GU[tithiIndex] ?? "");
  const tithiEn = TITHI_NAMES_EN[tithiIndex] ?? "";

  // ── Nakshatra ─────────────────────────────────────────────────────────────
  // 27 nakshatras × (360/27)° each, based on sidereal moon longitude
  const nakshatraIndex = Math.floor(moonSid / (360 / 27)) % 27;

  // ── Yoga ──────────────────────────────────────────────────────────────────
  // 27 yogas based on sum of sidereal sun + moon longitudes
  const yogaSum  = norm360(sunSid + moonSid);
  const yogaIndex = Math.floor(yogaSum / (360 / 27)) % 27;

  // ── Karan ─────────────────────────────────────────────────────────────────
  // Each karan = half a tithi. There are 60 half-tithis in a lunar month.
  // First half-tithi (0) = Kimstughna (fixed), last three fixed karans at 57-59.
  // Remaining 56 half-tithis cycle through 7 movable karans.
  const halfTithi = Math.floor(elongation / 6); // 0-59
  let karanIndex: number;
  if (halfTithi === 0) {
    karanIndex = 10; // Kimstughna
  } else if (halfTithi === 57) {
    karanIndex = 7;  // Shakuni
  } else if (halfTithi === 58) {
    karanIndex = 8;  // Chatushpada
  } else if (halfTithi === 59) {
    karanIndex = 9;  // Naga
  } else {
    karanIndex = (halfTithi - 1) % 7; // 0=Bava…6=Vishti
  }

  // ── Vaar ──────────────────────────────────────────────────────────────────
  const vaarIndex = date.getDay(); // 0=Sun … 6=Sat (getDay is local, fine for display)

  // ── Vikram Samvat month & year ────────────────────────────────────────────
  // Solar month: which rashi (30° arc) the Sun is in, in sidereal coordinates.
  // Index 0 = Mesha (Chaitra), 1 = Vrishabha (Vaishakha), …, 11 = Meena (Phalguna).
  const vikramMonthIndex = Math.floor(sunSid / 30) % 12;

  // Vikram year changes at Chaitra Shukla Pratipada (~mid-April).
  // Approximation: if sun is in Phalguna (month 11, sun in Meena 330°-360°)
  // and we are in the first quarter of the Gregorian year, the Vikram year
  // has not yet incremented — otherwise add 57.
  const gregYear = date.getFullYear();
  const gregMonth = date.getMonth(); // 0-based
  const vikramYear =
    vikramMonthIndex === 11 && gregMonth < 4
      ? gregYear + 56
      : gregMonth < 3
      ? gregYear + 56
      : gregYear + 57;

  // ── Shubh / Ashubh ────────────────────────────────────────────────────────
  const isAshubh =
    karanIndex === 6 || // Vishti (Bhadra)
    yogaIndex === 16 || // Vyatipata
    yogaIndex === 26;   // Vaidhriti

  const isShubh =
    !isAshubh &&
    (tithiIndex === 4 ||  // Panchami
      tithiIndex === 7 ||  // Ashtami
      tithiIndex === 10 || // Ekadashi
      (pakshaIndex === 0 && tithiIndex === 14)); // Purnima

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
    vikramMonthIndex,
    vikramMonthGu: VIKRAM_MONTHS_GU[vikramMonthIndex] ?? "",
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

// Re-export legacy helpers so existing imports still resolve
export { julianDay, sunLonTropical, moonLonLat as moonLonLatAccurate };
export { lahiriAyanamsa };

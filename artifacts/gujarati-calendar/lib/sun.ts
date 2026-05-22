/**
 * Sunrise, sunset, moonrise and moonset for Ahmedabad, Gujarat.
 *
 * Sunrise/sunset: NOAA algorithm, accurate to ~1 minute.
 * Moonrise/moonset: altitude-sampling method (48 half-hour steps per day)
 *   using Jean Meeus moon-position formulas.  Accurate to ~5-10 minutes.
 */

import { d2r, eclipticToEquatorial, gmstDegrees, julianDay, moonLonLat, norm360, r2d } from "./astronomy";

export const AHMEDABAD = {
  lat: 23.0225,
  lng: 72.5714,
  tzOffsetHours: 5.5,
  name: "Ahmedabad",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start;
  return Math.floor(dayMs / 86400000);
}

// ─── Sunrise / Sunset (NOAA) ─────────────────────────────────────────────────

interface SunCalcOptions {
  lat: number;
  lng: number;
  zenith?: number;
}

function sunEventUTC(
  date: Date,
  isRising: boolean,
  { lat, lng, zenith = 90.833 }: SunCalcOptions,
): number | null {
  const N = dayOfYear(date);
  const lngHour = lng / 15;
  const t = isRising ? N + (6 - lngHour) / 24 : N + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;
  const Lraw =
    M + 1.916 * Math.sin(d2r(M)) + 0.02 * Math.sin(d2r(2 * M)) + 282.634;
  const L = norm360(Lraw);

  let RA = norm360(r2d(Math.atan(0.91764 * Math.tan(d2r(L)))));
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = (RA + (Lquadrant - RAquadrant)) / 15;

  const sinDec = 0.39782 * Math.sin(d2r(L));
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(d2r(zenith)) - sinDec * Math.sin(d2r(lat))) /
    (cosDec * Math.cos(d2r(lat)));
  if (cosH > 1 || cosH < -1) return null;

  const Hdeg = isRising
    ? 360 - r2d(Math.acos(cosH))
    : r2d(Math.acos(cosH));
  const H = Hdeg / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;
  return UT;
}

// ─── Moonrise / Moonset ──────────────────────────────────────────────────────

/**
 * Compute the Moon's altitude (degrees) above the horizon at a given Julian Day
 * from a location specified by lat/lng (degrees, east positive).
 */
function moonAltitudeAtJD(jd: number, latDeg: number, lngDeg: number): number {
  const { lon, lat } = moonLonLat(jd);
  const { ra, dec } = eclipticToEquatorial(lon, lat, jd);
  const lha = d2r(norm360(gmstDegrees(jd) + lngDeg - ra));
  const latR = d2r(latDeg);
  const decR = d2r(dec);
  const sinAlt =
    Math.sin(latR) * Math.sin(decR) +
    Math.cos(latR) * Math.cos(decR) * Math.cos(lha);
  return r2d(Math.asin(Math.max(-1, Math.min(1, sinAlt))));
}

/**
 * Find the first moonrise or moonset on a calendar date at the given location.
 * Returns local time in decimal hours, or null if the moon doesn't rise/set
 * that day (circumpolar / below horizon all day — very rare at Ahmedabad).
 */
function findMoonEvent(
  date: Date,
  lat: number,
  lng: number,
  tzH: number,
  findRise: boolean,
): number | null {
  // JD at local midnight
  const localMidnightUTC = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  ) - tzH * 3600000;
  const jdMidnight = julianDay(new Date(localMidnightUTC));

  // Sample moon altitude at every 30 minutes (48 steps + 1 endpoint)
  const STEPS = 48;
  const H0 = -0.833; // effective horizon including refraction & parallax
  const altitudes: number[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const jd = jdMidnight + i / (STEPS); // 0h … 24h local time
    altitudes.push(moonAltitudeAtJD(jd, lat, lng) - H0);
  }

  // Find first sign change (rising or setting)
  for (let i = 0; i < STEPS; i++) {
    const a0 = altitudes[i]!;
    const a1 = altitudes[i + 1]!;
    const rising  = a0 < 0 && a1 >= 0;
    const setting = a0 >= 0 && a1 < 0;
    if ((findRise && rising) || (!findRise && setting)) {
      // Linear interpolation within the 30-min step
      const frac = -a0 / (a1 - a0);
      return (i + frac) * 24 / STEPS; // local hours
    }
  }
  return null;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface SkyTimes {
  sunrise: number | null;
  sunset: number | null;
  moonrise: number | null;
  moonset: number | null;
}

export function computeSkyTimes(
  date: Date,
  location = AHMEDABAD,
): SkyTimes {
  const tz = location.tzOffsetHours;
  const toLocal = (utc: number | null) =>
    utc === null ? null : ((utc + tz) % 24 + 24) % 24;

  const sunriseUTC = sunEventUTC(date, true,  location);
  const sunsetUTC  = sunEventUTC(date, false, location);
  const sunrise = toLocal(sunriseUTC);
  const sunset  = toLocal(sunsetUTC);

  const moonrise = findMoonEvent(date, location.lat, location.lng, tz, true);
  const moonset  = findMoonEvent(date, location.lat, location.lng, tz, false);

  return { sunrise, sunset, moonrise, moonset };
}

export function formatTime(hours: number | null): string {
  if (hours === null) return "—";
  const totalMinutes = Math.round(hours * 60);
  let h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

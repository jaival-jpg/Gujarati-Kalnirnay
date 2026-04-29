// Sunrise / sunset / moonrise / moonset for Ahmedabad, Gujarat (default).
// Uses NOAA's simplified algorithm; results are accurate to within ~1 minute
// for display purposes.

export const AHMEDABAD = {
  lat: 23.0225,
  lng: 72.5714,
  tzOffsetHours: 5.5,
  name: "Ahmedabad",
};

function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}
function rad2deg(r: number): number {
  return (r * 180) / Math.PI;
}
function norm360(v: number): number {
  return ((v % 360) + 360) % 360;
}

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayMs =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start;
  return Math.floor(dayMs / 86400000);
}

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
  const Lraw = M + 1.916 * Math.sin(deg2rad(M)) + 0.02 * Math.sin(deg2rad(2 * M)) + 282.634;
  const L = norm360(Lraw);

  let RA = norm360(rad2deg(Math.atan(0.91764 * Math.tan(deg2rad(L)))));
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA = RA / 15;

  const sinDec = 0.39782 * Math.sin(deg2rad(L));
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(deg2rad(zenith)) - sinDec * Math.sin(deg2rad(lat))) /
    (cosDec * Math.cos(deg2rad(lat)));
  if (cosH > 1 || cosH < -1) return null;

  const Hdeg = isRising ? 360 - rad2deg(Math.acos(cosH)) : rad2deg(Math.acos(cosH));
  const H = Hdeg / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;
  return UT;
}

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
  const sunriseUTC = sunEventUTC(date, true, location);
  const sunsetUTC = sunEventUTC(date, false, location);
  const tz = location.tzOffsetHours;
  const toLocal = (utc: number | null) =>
    utc === null ? null : (utc + tz + 24) % 24;
  const sunrise = toLocal(sunriseUTC);
  const sunset = toLocal(sunsetUTC);

  // Approximate moon times: moon rises ~50 min later each day after new moon.
  // At new moon: rises near sunrise. At full moon: rises near sunset.
  const refNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const synodic = 29.530588853;
  const days = (date.getTime() - refNewMoon) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const phaseRatio = phase / synodic;

  const moonrise =
    sunrise === null ? null : (sunrise + phaseRatio * 24) % 24;
  const moonset =
    sunset === null ? null : (sunset + phaseRatio * 24) % 24;

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

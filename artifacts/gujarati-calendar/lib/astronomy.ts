/**
 * Core astronomical calculation primitives.
 * Uses Jean Meeus "Astronomical Algorithms" formulas.
 * Accuracy: sun longitude ~0.01°, moon longitude ~0.3°, sunrise/set ~1 min.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

export function d2r(deg: number): number { return (deg * Math.PI) / 180; }
export function r2d(rad: number): number { return (rad * 180) / Math.PI; }
export function norm360(v: number): number { return ((v % 360) + 360) % 360; }

// ─── Julian Day ─────────────────────────────────────────────────────────────

/** Converts a UTC Date to Julian Day Number. */
export function julianDay(date: Date): number {
  let Y = date.getUTCFullYear();
  let M = date.getUTCMonth() + 1;
  const D =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

// ─── Ayanamsa (Lahiri) ──────────────────────────────────────────────────────

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees.
 * At J2000.0 = 23.85286°, precessing at ~50.27"/year.
 */
export function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85286 + 1.39722 * T; // ~50.3"/year converted to degrees/century
}

// ─── Sun ────────────────────────────────────────────────────────────────────

/**
 * Apparent tropical (ecliptic) longitude of the Sun in degrees.
 * Jean Meeus Ch 25 — accurate to ~0.01°.
 */
export function sunLonTropical(jd: number): number {
  const T = (jd - 2451545.0) / 36525;

  // Geometric mean longitude
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Mean anomaly
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = d2r(M);

  // Equation of centre
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);

  const sunLon = L0 + C;

  // Apparent longitude (nutation + aberration)
  const omega = 125.04 - 1934.136 * T;
  return norm360(sunLon - 0.00569 - 0.00478 * Math.sin(d2r(omega)));
}

// ─── Moon ───────────────────────────────────────────────────────────────────

/**
 * Tropical ecliptic longitude and latitude of the Moon.
 * Jean Meeus Ch 47 — top 23 longitude + 14 latitude terms.
 * Accuracy: longitude ~0.3°, latitude ~0.2°.
 */
export function moonLonLat(jd: number): { lon: number; lat: number } {
  const T = (jd - 2451545.0) / 36525;

  // Fundamental arguments (degrees)
  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841);
  const D  = norm360(297.8501921 + 445267.1114034  * T - 0.0018819 * T * T + (T * T * T) / 545868);
  const M  = norm360(357.5291092 + 35999.0502909   * T - 0.0001536 * T * T);
  const Mp = norm360(134.9633964 + 477198.8675055  * T + 0.0087414 * T * T + (T * T * T) / 69699);
  const F  = norm360(93.2720950  + 483202.0175233  * T - 0.0036539 * T * T);

  const Dr  = d2r(D);
  const Mr  = d2r(M);
  const Mpr = d2r(Mp);
  const Fr  = d2r(F);

  // Longitude periodic terms (millionths of degrees)
  const dL =
     6288774 * Math.sin(Mpr) +
     1274027 * Math.sin(2 * Dr - Mpr) +
      658314 * Math.sin(2 * Dr) +
      213618 * Math.sin(2 * Mpr) +
     -185116 * Math.sin(Mr) +
     -114332 * Math.sin(2 * Fr) +
       58793 * Math.sin(2 * Dr - 2 * Mpr) +
       57066 * Math.sin(2 * Dr - Mr - Mpr) +
       53322 * Math.sin(2 * Dr + Mpr) +
       45758 * Math.sin(2 * Dr - Mr) +
      -40923 * Math.sin(Mr - Mpr) +
      -34720 * Math.sin(Dr) +
      -30383 * Math.sin(Mr + Mpr) +
       15327 * Math.sin(2 * Dr - 2 * Fr) +
      -12528 * Math.sin(Mpr + 2 * Fr) +
       10980 * Math.sin(Mpr - 2 * Fr) +
       10675 * Math.sin(4 * Dr - Mpr) +
       10034 * Math.sin(3 * Mpr) +
        8548 * Math.sin(4 * Dr - 2 * Mpr) +
       -7888 * Math.sin(2 * Dr + Mr - Mpr) +
       -6766 * Math.sin(2 * Dr + Mr) +
       -5163 * Math.sin(Dr - Mpr) +
        4987 * Math.sin(Dr + Mr);

  // Latitude periodic terms (millionths of degrees)
  const dB =
     5128122 * Math.sin(Fr) +
      280602 * Math.sin(Mpr + Fr) +
      277693 * Math.sin(Mpr - Fr) +
      173237 * Math.sin(2 * Dr - Fr) +
       55413 * Math.sin(2 * Dr - Mpr + Fr) +
       46271 * Math.sin(2 * Dr - Mpr - Fr) +
       32573 * Math.sin(2 * Dr + Fr) +
       17198 * Math.sin(2 * Mpr + Fr) +
        9266 * Math.sin(2 * Dr + Mpr - Fr) +
        8822 * Math.sin(2 * Mpr - Fr) +
       -8216 * Math.sin(2 * Dr - Mr - Fr) +
       -4324 * Math.sin(2 * Dr - 2 * Mpr - Fr) +
       -4200 * Math.sin(2 * Dr + Mpr + Fr) +
       -3359 * Math.sin(2 * Dr + Mr - Fr);

  return {
    lon: norm360(Lp + dL / 1_000_000),
    lat: dB / 1_000_000,
  };
}

// ─── Coordinate conversion ───────────────────────────────────────────────────

/** Ecliptic longitude/latitude → equatorial RA (degrees) and Dec (degrees). */
export function eclipticToEquatorial(
  lonDeg: number,
  latDeg: number,
  jd: number,
): { ra: number; dec: number } {
  const T = (jd - 2451545.0) / 36525;
  const eps = d2r(23.4392911 - 0.013004 * T); // obliquity
  const lonR = d2r(lonDeg);
  const latR = d2r(latDeg);

  const ra = r2d(
    Math.atan2(
      Math.sin(lonR) * Math.cos(eps) - Math.tan(latR) * Math.sin(eps),
      Math.cos(lonR),
    ),
  );
  const dec = r2d(
    Math.asin(
      Math.max(-1, Math.min(1,
        Math.sin(latR) * Math.cos(eps) +
        Math.cos(latR) * Math.sin(eps) * Math.sin(lonR),
      )),
    ),
  );
  return { ra: norm360(ra), dec };
}

// ─── Sidereal time ──────────────────────────────────────────────────────────

/** Greenwich Mean Sidereal Time in degrees at the given Julian Day. */
export function gmstDegrees(jd: number): number {
  const jd0 = Math.floor(jd - 0.5) + 0.5; // JD at previous 0h UT
  const T0 = (jd0 - 2451545.0) / 36525;
  const gmst0 = norm360(
    100.4606184 + 36000.77004 * T0 + 0.000387933 * T0 * T0,
  );
  const utHours = (jd - jd0) * 24;
  return norm360(gmst0 + 360.98564724 * (utHours / 24));
}

// ─── Altitude ───────────────────────────────────────────────────────────────

/** Computes the altitude of the Moon (degrees) at a given JD and location. */
export function moonAltitude(
  jd: number,
  latDeg: number,
  lngDeg: number,
): number {
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

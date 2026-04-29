export const TITHI_NAMES_GU = [
  "પડવો",
  "બીજ",
  "ત્રીજ",
  "ચોથ",
  "પાંચમ",
  "છઠ",
  "સાતમ",
  "આઠમ",
  "નોમ",
  "દશમ",
  "અગિયારસ",
  "બારસ",
  "તેરસ",
  "ચૌદસ",
  "પૂનમ",
];

export const TITHI_KRISHNA_LAST_GU = "અમાસ";

export const TITHI_NAMES_EN = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
];

export const NAKSHATRA_GU = [
  "અશ્વિની",
  "ભરણી",
  "કૃત્તિકા",
  "રોહિણી",
  "મૃગશીર્ષ",
  "આર્દ્રા",
  "પુનર્વસુ",
  "પુષ્ય",
  "આશ્લેષા",
  "મઘા",
  "પૂર્વા ફાલ્ગુની",
  "ઉત્તરા ફાલ્ગુની",
  "હસ્ત",
  "ચિત્રા",
  "સ્વાતિ",
  "વિશાખા",
  "અનુરાધા",
  "જ્યેષ્ઠા",
  "મૂળ",
  "પૂર્વાષાઢા",
  "ઉત્તરાષાઢા",
  "શ્રવણ",
  "ધનિષ્ઠા",
  "શતભિષા",
  "પૂર્વા ભાદ્રપદ",
  "ઉત્તરા ભાદ્રપદ",
  "રેવતી",
];

export const NAKSHATRA_EN = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

export const YOGA_GU = [
  "વિષ્કુંભ",
  "પ્રીતિ",
  "આયુષ્માન",
  "સૌભાગ્ય",
  "શોભન",
  "અતિગંડ",
  "સુકર્મા",
  "ધૃતિ",
  "શૂળ",
  "ગંડ",
  "વૃદ્ધિ",
  "ધ્રુવ",
  "વ્યાઘાત",
  "હર્ષણ",
  "વજ્ર",
  "સિદ્ધિ",
  "વ્યતિપાત",
  "વરિયાન",
  "પરિઘ",
  "શિવ",
  "સિદ્ધ",
  "સાધ્ય",
  "શુભ",
  "શુક્લ",
  "બ્રહ્મ",
  "ઈન્દ્ર",
  "વૈધૃતિ",
];

export const KARAN_GU = [
  "બવ",
  "બાલવ",
  "કૌલવ",
  "તૈતિલ",
  "ગર",
  "વણિજ",
  "વિષ્ટિ",
  "શકુની",
  "ચતુષ્પદ",
  "નાગ",
  "કિંસ્તુઘ્ન",
];

export const VAAR_GU = [
  "રવિવાર",
  "સોમવાર",
  "મંગળવાર",
  "બુધવાર",
  "ગુરુવાર",
  "શુક્રવાર",
  "શનિવાર",
];

export const VAAR_SHORT_GU = ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"];

export const MONTHS_EN_GU = [
  "જાન્યુઆરી",
  "ફેબ્રુઆરી",
  "માર્ચ",
  "એપ્રિલ",
  "મે",
  "જૂન",
  "જુલાઈ",
  "ઓગસ્ટ",
  "સપ્ટેમ્બર",
  "ઓક્ટોબર",
  "નવેમ્બર",
  "ડિસેમ્બર",
];

export const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const VIKRAM_MONTHS_GU = [
  "ચૈત્ર",
  "વૈશાખ",
  "જેઠ",
  "અષાઢ",
  "શ્રાવણ",
  "ભાદરવો",
  "આસો",
  "કાર્તિક",
  "માગશર",
  "પોષ",
  "મહા",
  "ફાગણ",
];

export const PAKSHA_GU = ["સુદ", "વદ"];
export const PAKSHA_EN = ["Shukla", "Krishna"];

export const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];

export type ChoghadiyaType = "amrit" | "shubh" | "labh" | "char" | "udveg" | "rog" | "kaal";

export const CHOGHADIYA_LABELS: Record<ChoghadiyaType, { gu: string; en: string }> = {
  amrit: { gu: "અમૃત", en: "Amrit" },
  shubh: { gu: "શુભ", en: "Shubh" },
  labh: { gu: "લાભ", en: "Labh" },
  char: { gu: "ચલ", en: "Chal" },
  udveg: { gu: "ઉદ્વેગ", en: "Udveg" },
  rog: { gu: "રોગ", en: "Rog" },
  kaal: { gu: "કાળ", en: "Kaal" },
};

export const CHOGHADIYA_QUALITY: Record<ChoghadiyaType, "good" | "neutral" | "bad"> = {
  amrit: "good",
  shubh: "good",
  labh: "good",
  char: "neutral",
  udveg: "bad",
  rog: "bad",
  kaal: "bad",
};

export interface Festival {
  id: string;
  nameGu: string;
  nameEn: string;
  month: number; // 1-12
  day: number; // 1-31 (approximate Gregorian for current/upcoming year)
  type: "major" | "regional" | "national" | "religious";
  descriptionGu: string;
  descriptionEn: string;
  significanceGu?: string;
}

// Curated list of major Gujarati and Hindu festivals.
// Lunar dates are approximate Gregorian for 2026; the festival info itself is
// timeless and useful in any year.
export const FESTIVALS: Festival[] = [
  {
    id: "uttarayan",
    nameGu: "ઉત્તરાયણ (મકરસંક્રાંતિ)",
    nameEn: "Uttarayan / Makar Sankranti",
    month: 1,
    day: 14,
    type: "major",
    descriptionGu:
      "પતંગ મહોત્સવ — સૂર્ય મકર રાશિમાં પ્રવેશ કરે છે. ગુજરાતમાં આ દિવસ આકાશ રંગબેરંગી પતંગોથી ભરાય છે.",
    descriptionEn:
      "Kite festival celebrating the sun's transition into Capricorn. Gujarat's skies fill with colorful kites and tilgul sweets are shared.",
    significanceGu: "તલ-ગોળના લાડુ અને ચીકી ખાઈને નાતો બંધાવા",
  },
  {
    id: "vasi-uttarayan",
    nameGu: "વાસી ઉત્તરાયણ",
    nameEn: "Vasi Uttarayan",
    month: 1,
    day: 15,
    type: "regional",
    descriptionGu: "ઉત્તરાયણનો બીજો દિવસ — પતંગ ઉડાવવાનું ચાલુ રહે છે.",
    descriptionEn:
      "The second day of Uttarayan, when kite flying continues across Gujarat.",
  },
  {
    id: "republic-day",
    nameGu: "ગણતંત્ર દિવસ",
    nameEn: "Republic Day",
    month: 1,
    day: 26,
    type: "national",
    descriptionGu: "ભારતનો ગણતંત્ર દિવસ — બંધારણ અમલમાં આવ્યું.",
    descriptionEn:
      "Marks the day India's Constitution came into effect in 1950.",
  },
  {
    id: "vasant-panchami",
    nameGu: "વસંત પંચમી",
    nameEn: "Vasant Panchami",
    month: 1,
    day: 23,
    type: "religious",
    descriptionGu:
      "દેવી સરસ્વતીની પૂજા — વસંત ઋતુનું આગમન. પીળા વસ્ત્રો પહેરવાનું શુભ ગણાય.",
    descriptionEn:
      "Worship of Goddess Saraswati and welcome of spring. Yellow attire is considered auspicious.",
  },
  {
    id: "maha-shivratri",
    nameGu: "મહાશિવરાત્રી",
    nameEn: "Maha Shivratri",
    month: 2,
    day: 15,
    type: "major",
    descriptionGu:
      "ભગવાન શિવને સમર્પિત મહાન રાત્રી — ઉપવાસ, જાગરણ અને બેલપત્ર સાથે પૂજા.",
    descriptionEn:
      "The great night of Lord Shiva, observed with fasting, vigil and offerings of bilva leaves.",
  },
  {
    id: "holika-dahan",
    nameGu: "હોળી (હોલિકા દહન)",
    nameEn: "Holika Dahan",
    month: 3,
    day: 4,
    type: "major",
    descriptionGu:
      "ફાગણ સુદ પૂનમની રાત્રે — અસત્ય પર સત્યના વિજયનું પ્રતીક. હોળી પ્રગટાવાય છે.",
    descriptionEn:
      "Bonfire night marking the victory of devotion over evil; lit on the eve of Holi.",
  },
  {
    id: "dhuleti",
    nameGu: "ધુળેટી (રંગોત્સવ)",
    nameEn: "Dhuleti / Holi",
    month: 3,
    day: 5,
    type: "major",
    descriptionGu:
      "રંગોનો તહેવાર — પરિવાર અને મિત્રો સાથે રંગો ઉડાડવામાં આવે છે. ગુજરાતમાં ઢોલ સાથે મજા.",
    descriptionEn:
      "Festival of colors. Friends and family play with gulal and water; sweets and drums fill the streets.",
  },
  {
    id: "chaitra-navratri",
    nameGu: "ચૈત્રી નવરાત્રી",
    nameEn: "Chaitra Navratri",
    month: 3,
    day: 19,
    type: "religious",
    descriptionGu: "ચૈત્ર સુદ પડવાથી શરૂ થતાં નવ દિવસ — દેવી દુર્ગાની આરાધના.",
    descriptionEn: "Nine days of devotion to Goddess Durga starting in Chaitra month.",
  },
  {
    id: "ram-navami",
    nameGu: "રામનવમી",
    nameEn: "Ram Navami",
    month: 3,
    day: 28,
    type: "religious",
    descriptionGu: "ભગવાન શ્રી રામચંદ્રજીનો જન્મદિવસ — મંદિરોમાં ભજન અને કથા.",
    descriptionEn: "Birth anniversary of Lord Rama, celebrated with bhajans and katha at temples.",
  },
  {
    id: "akshaya-tritiya",
    nameGu: "અખાત્રીજ (અક્ષય તૃતીયા)",
    nameEn: "Akshaya Tritiya",
    month: 4,
    day: 20,
    type: "major",
    descriptionGu:
      "વૈશાખ સુદ ત્રીજ — સોનું ખરીદવા અને નવા કાર્ય શરૂ કરવા માટે અતિ શુભ દિવસ.",
    descriptionEn:
      "An extremely auspicious day for new beginnings and gold purchases. Considered ever-prospering.",
  },
  {
    id: "rath-yatra",
    nameGu: "જગન્નાથ રથયાત્રા",
    nameEn: "Jagannath Rath Yatra",
    month: 6,
    day: 26,
    type: "major",
    descriptionGu:
      "અમદાવાદની ઐતિહાસિક રથયાત્રા — જમાલપુર જગન્નાથજીના મંદિરથી ભવ્ય શોભાયાત્રા.",
    descriptionEn:
      "Historic chariot procession of Lord Jagannath, especially grand in Ahmedabad's Jamalpur temple.",
  },
  {
    id: "guru-purnima",
    nameGu: "ગુરુ પૂર્ણિમા",
    nameEn: "Guru Purnima",
    month: 7,
    day: 9,
    type: "religious",
    descriptionGu: "ગુરુનું પૂજન અને કૃતજ્ઞતા વ્યક્ત કરવાનો દિવસ.",
    descriptionEn: "A day to honor and express gratitude to one's gurus and teachers.",
  },
  {
    id: "raksha-bandhan",
    nameGu: "રક્ષાબંધન",
    nameEn: "Raksha Bandhan",
    month: 8,
    day: 9,
    type: "major",
    descriptionGu:
      "બહેન ભાઈને રાખડી બાંધે છે અને ભાઈ બહેનનું રક્ષણ કરવાનું વચન આપે છે.",
    descriptionEn:
      "Sisters tie a sacred thread on their brothers' wrists; brothers vow lifelong protection.",
  },
  {
    id: "janmashtami",
    nameGu: "જન્માષ્ટમી",
    nameEn: "Krishna Janmashtami",
    month: 8,
    day: 16,
    type: "major",
    descriptionGu:
      "ભગવાન શ્રી કૃષ્ણનો જન્મદિવસ — દ્વારકા, શામળાજી, અને દ્વારકાધીશ મંદિરમાં ભવ્ય ઉજવણી.",
    descriptionEn:
      "Birth of Lord Krishna, celebrated with midnight aarti, dahi-handi and grand pujas at Dwarka.",
  },
  {
    id: "ganesh-chaturthi",
    nameGu: "ગણેશ ચતુર્થી",
    nameEn: "Ganesh Chaturthi",
    month: 8,
    day: 27,
    type: "major",
    descriptionGu: "ભગવાન ગણેશજીની સ્થાપના અને દશ દિવસ ભક્તિ.",
    descriptionEn: "Installation of Lord Ganesha idols followed by ten days of devotion.",
  },
  {
    id: "anant-chaturdashi",
    nameGu: "અનંત ચૌદસ",
    nameEn: "Anant Chaturdashi",
    month: 9,
    day: 17,
    type: "religious",
    descriptionGu: "ગણેશ વિસર્જન — ગણપતિ બાપ્પા મોરિયા!",
    descriptionEn:
      "Visarjan day of Ganesh Chaturthi — Ganesha is bid farewell with grand processions.",
  },
  {
    id: "navratri",
    nameGu: "નવરાત્રી (શારદીય)",
    nameEn: "Sharad Navratri",
    month: 10,
    day: 11,
    type: "major",
    descriptionGu:
      "નવ રાત્રી દેવી માતાજીનું પૂજન — ગુજરાતના ગરબા-દાંડિયાનો વિશ્વપ્રસિદ્ધ ઉત્સવ.",
    descriptionEn:
      "Nine nights of devotion to the Mother Goddess — Gujarat's world-famous garba and dandiya festival.",
  },
  {
    id: "dussehra",
    nameGu: "દશેરા (વિજયા દશમી)",
    nameEn: "Vijaya Dashami / Dussehra",
    month: 10,
    day: 20,
    type: "major",
    descriptionGu: "રામે રાવણને હરાવ્યો તે દિવસ — અસત્ય પર સત્યનો વિજય.",
    descriptionEn:
      "Marks Lord Rama's victory over Ravana — symbolizing the triumph of good over evil.",
  },
  {
    id: "sharad-purnima",
    nameGu: "શરદ પૂનમ",
    nameEn: "Sharad Purnima",
    month: 10,
    day: 25,
    type: "religious",
    descriptionGu: "દૂધ-પૌંઆ ચંદ્રની રોશનીમાં મૂકીને ખવાય છે.",
    descriptionEn:
      "Milk-poha is left under moonlight and savored — known for the brightest moon of the year.",
  },
  {
    id: "dhanteras",
    nameGu: "ધનતેરસ",
    nameEn: "Dhanteras",
    month: 11,
    day: 7,
    type: "major",
    descriptionGu:
      "દિવાળીની શરૂઆત — ધાતુ, ઘરેણાં અને નવી વસ્તુ ખરીદવાનો શુભ દિવસ.",
    descriptionEn:
      "Start of Diwali — buying gold, silver and utensils is considered auspicious.",
  },
  {
    id: "kali-chaudas",
    nameGu: "કાળી ચૌદસ",
    nameEn: "Kali Chaudas",
    month: 11,
    day: 8,
    type: "religious",
    descriptionGu: "મહાકાળી પૂજન અને નકારાત્મક શક્તિઓથી રક્ષણ માટે.",
    descriptionEn: "Worship of Goddess Kali for protection from negative forces.",
  },
  {
    id: "diwali",
    nameGu: "દિવાળી",
    nameEn: "Diwali",
    month: 11,
    day: 9,
    type: "major",
    descriptionGu:
      "પ્રકાશનો તહેવાર — લક્ષ્મીજીની પૂજા, ફટાકડા, મીઠાઈ અને દીવાઓની હારમાળા.",
    descriptionEn:
      "Festival of lights — Lakshmi puja, fireworks, sweets and rangoli celebrate prosperity.",
  },
  {
    id: "bestu-varas",
    nameGu: "બેસતું વર્ષ (નૂતન વર્ષ)",
    nameEn: "Bestu Varas / Gujarati New Year",
    month: 11,
    day: 10,
    type: "major",
    descriptionGu:
      "ગુજરાતી નવું વર્ષ — 'સાલ મુબારક' કહીને ઉજવાય. ગોવર્ધન પૂજા પણ આ દિવસે.",
    descriptionEn:
      "Gujarati New Year — greetings of 'Saal Mubarak' fill homes. Govardhan Puja is also performed.",
  },
  {
    id: "bhai-bij",
    nameGu: "ભાઈ બીજ",
    nameEn: "Bhai Bij",
    month: 11,
    day: 11,
    type: "religious",
    descriptionGu: "બહેન ભાઈને ચાંદલો કરે છે — ભાઈ-બહેનના પ્રેમનો તહેવાર.",
    descriptionEn:
      "Sisters apply tilak on their brothers' foreheads, celebrating sibling bonds.",
  },
  {
    id: "tulsi-vivah",
    nameGu: "તુલસી વિવાહ",
    nameEn: "Tulsi Vivah",
    month: 11,
    day: 25,
    type: "religious",
    descriptionGu: "તુલસી અને ભગવાન વિષ્ણુ (શાલિગ્રામ)નો વિવાહ.",
    descriptionEn:
      "Ceremonial marriage of Tulsi plant with Lord Vishnu (Shaligram).",
  },
  {
    id: "datta-jayanti",
    nameGu: "દત્ત જયંતી",
    nameEn: "Datta Jayanti",
    month: 12,
    day: 24,
    type: "religious",
    descriptionGu: "ભગવાન દત્તાત્રેયનો જન્મ ઉત્સવ.",
    descriptionEn: "Birth anniversary of Lord Dattatreya.",
  },
  {
    id: "independence-day",
    nameGu: "સ્વતંત્રતા દિવસ",
    nameEn: "Independence Day",
    month: 8,
    day: 15,
    type: "national",
    descriptionGu: "ભારતનો સ્વતંત્રતા દિવસ — 1947નો ગૌરવપૂર્ણ દિવસ.",
    descriptionEn: "Marks India's independence in 1947.",
  },
  {
    id: "gandhi-jayanti",
    nameGu: "ગાંધી જયંતી",
    nameEn: "Gandhi Jayanti",
    month: 10,
    day: 2,
    type: "national",
    descriptionGu: "મહાત્મા ગાંધીનો જન્મદિવસ — અહિંસાનો સંદેશ.",
    descriptionEn:
      "Birth anniversary of Mahatma Gandhi, observed worldwide as the Day of Non-Violence.",
  },
];

export function festivalsForMonth(month: number): Festival[] {
  return FESTIVALS.filter((f) => f.month === month).sort((a, b) => a.day - b.day);
}

export function festivalsForDay(month: number, day: number): Festival[] {
  return FESTIVALS.filter((f) => f.month === month && f.day === day);
}

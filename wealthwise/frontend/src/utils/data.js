export const FUNDS = [
  {
    id: 1,
    name: "SBI Bluechip Fund",
    house: "SBI Mutual Fund",
    category: "Large Cap",
    nav: 82.1,
    risk: "LOW",
    ret1y: 9.2,
    ret3y: 14.2,
  },
  {
    id: 2,
    name: "HDFC Mid-Cap Opportunities",
    house: "HDFC Mutual Fund",
    category: "Mid Cap",
    nav: 130.5,
    risk: "MODERATE",
    ret1y: 16.7,
    ret3y: 22.1,
  },
  {
    id: 3,
    name: "ICICI Pru Technology Fund",
    house: "ICICI Prudential",
    category: "Sectoral",
    nav: 195.6,
    risk: "HIGH",
    ret1y: 24.5,
    ret3y: 31.2,
  },
  {
    id: 4,
    name: "Axis Long Term Equity (ELSS)",
    house: "Axis Mutual Fund",
    category: "ELSS",
    nav: 78.2,
    risk: "MODERATE",
    ret1y: 11.4,
    ret3y: 17.8,
  },
  {
    id: 5,
    name: "Kotak Small Cap Fund",
    house: "Kotak Mahindra MF",
    category: "Small Cap",
    nav: 198.3,
    risk: "HIGH",
    ret1y: 28.3,
    ret3y: 35.6,
  },
  {
    id: 6,
    name: "SBI Liquid Fund",
    house: "SBI Mutual Fund",
    category: "Liquid",
    nav: 3842.15,
    risk: "LOW",
    ret1y: 6.8,
    ret3y: 6.2,
  },
  {
    id: 7,
    name: "Mirae Asset Emerging Bluechip",
    house: "Mirae Asset MF",
    category: "Large & Mid Cap",
    nav: 110.4,
    risk: "MODERATE",
    ret1y: 14.2,
    ret3y: 19.8,
  },
  {
    id: 8,
    name: "Parag Parikh Flexi Cap",
    house: "PPFAS Mutual Fund",
    category: "Flexi Cap",
    nav: 68.9,
    risk: "MODERATE",
    ret1y: 12.8,
    ret3y: 18.4,
  },
  {
    id: 9,
    name: "DSP Midcap Fund",
    house: "DSP Mutual Fund",
    category: "Mid Cap",
    nav: 92.75,
    risk: "MODERATE",
    ret1y: 15.6,
    ret3y: 20.3,
  },
  {
    id: 10,
    name: "Nippon India Small Cap",
    house: "Nippon India MF",
    category: "Small Cap",
    nav: 145.6,
    risk: "HIGH",
    ret1y: 31.2,
    ret3y: 38.9,
  },
  {
    id: 11,
    name: "HDFC Top 100 Fund",
    house: "HDFC Mutual Fund",
    category: "Large Cap",
    nav: 912.45,
    risk: "LOW",
    ret1y: 8.4,
    ret3y: 13.1,
  },
  {
    id: 12,
    name: "Quant Active Fund",
    house: "Quant Mutual Fund",
    category: "Multi Cap",
    nav: 584.3,
    risk: "HIGH",
    ret1y: 42.1,
    ret3y: 48.6,
  },
];

export const INITIAL_INVESTMENTS = [
  {
    id: 1,
    fundId: 1,
    type: "sip",
    monthlyAmount: 5000,
    instalments: 12,
    totalInvested: 60000,
    avgNAV: 75.2,
    units: 797.87,
    startDate: "2025-04-01",
    nextSIP: "2026-04-01",
  },
  {
    id: 2,
    fundId: 2,
    type: "lumpsum",
    amount: 50000,
    buyNAV: 115.3,
    units: 433.65,
    date: "2025-06-15",
  },
  {
    id: 3,
    fundId: 7,
    type: "sip",
    monthlyAmount: 3000,
    instalments: 9,
    totalInvested: 27000,
    avgNAV: 102.4,
    units: 263.67,
    startDate: "2025-07-01",
    nextSIP: "2026-04-05",
  },
];

export const INITIAL_GOALS = [
  {
    id: 1,
    name: "Own a Home",
    category: "home",
    emoji: "🏠",
    targetAmount: 5000000,
    targetDate: "2035-01-01",
    currentSaved: 151206,
    description: "2BHK in Bangalore",
  },
  {
    id: 2,
    name: "Retirement Fund",
    category: "retirement",
    emoji: "🌴",
    targetAmount: 20000000,
    targetDate: "2050-01-01",
    currentSaved: 0,
    description: "Early retirement",
  },
];

export const CHART_DATA = {
  "6M": [
    { m: "Oct", v: 103800 },
    { m: "Nov", v: 118600 },
    { m: "Dec", v: 122400 },
    { m: "Jan", v: 134900 },
    { m: "Feb", v: 143700 },
    { m: "Mar", v: 151206 },
  ],
  "1Y": [
    { m: "Apr", v: 5000 },
    { m: "May", v: 13500 },
    { m: "Jun", v: 69200 },
    { m: "Jul", v: 72100 },
    { m: "Aug", v: 85800 },
    { m: "Sep", v: 94300 },
    { m: "Oct", v: 103800 },
    { m: "Nov", v: 118600 },
    { m: "Dec", v: 122400 },
    { m: "Jan", v: 134900 },
    { m: "Feb", v: 143700 },
    { m: "Mar", v: 151206 },
  ],
};

export const FUND_COLORS = [
  "#f5a623", // amber gold
  "#5b8dee", // steel blue
  "#00c9a7", // teal
  "#e05c5c", // soft red
  "#a78bfa", // soft violet
  "#34d399", // emerald
  "#f97316", // orange
  "#38bdf8", // sky blue
  "#fb7185", // rose
  "#a3e635", // lime
  "#c084fc", // purple
  "#fbbf24", // yellow
];

export const GOAL_EMOJIS = {
  home: "🏠",
  retirement: "🌴",
  education: "📚",
  car: "🚗",
  travel: "✈️",
  emergency: "🛡️",
  other: "⭐",
};

export const CATEGORIES = [
  "All",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "ELSS",
  "Flexi Cap",
  "Sectoral",
  "Liquid",
  "Multi Cap",
  "Large & Mid Cap",
];

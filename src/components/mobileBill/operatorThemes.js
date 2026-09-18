// Visual themes per telecom operator. Only colours and the display label are
// preset here — GSTIN, registered office and every other identifying detail
// stay blank/user-editable, the same way the fuel-bill generator never
// hardcodes a real petrol company's registration details for its station
// name presets.

export const OPERATORS = {
  airtel: { key: "airtel", name: "Airtel", primary: "#ED1C24", primaryDark: "#B30000", accent: "#FDECEC", gradient: "linear-gradient(135deg,#ED1C24,#B30000)" },
  jio: { key: "jio", name: "Jio", primary: "#0F1B4C", primaryDark: "#081029", accent: "#E8ECFB", gradient: "linear-gradient(135deg,#0F1B4C,#081029)" },
  vi: { key: "vi", name: "Vi", primary: "#EE2E24", primaryDark: "#C81E0E", accent: "#FFF6E0", gradient: "linear-gradient(135deg,#EE2E24,#F7B500)" },
  bsnl: { key: "bsnl", name: "BSNL", primary: "#003DA5", primaryDark: "#00286E", accent: "#EAF1FF", gradient: "linear-gradient(135deg,#003DA5,#ED1C24)" },
  other: { key: "other", name: "Other", primary: "#0F172A", primaryDark: "#020617", accent: "#F1F5F9", gradient: "linear-gradient(135deg,#0F172A,#1E293B)" },
};

export const OPERATOR_LIST = Object.values(OPERATORS);

export const appColors = {
  /* ─── Core Brand (Metatron Identity) ─── */
  primary: "#D6B25E",          // MAIN brand (architectural gold)
  primarySoft: "#F8E7B0",
  primaryDark: "#8B6F2A",

  secondary: "#FFFFFF",        // white support
  secondarySoft: "#F5F1E8",

  accent: "#E8C874",           // premium gold accent
  accentSoft: "#FFF2C2",
  violet: "#BFA46A",
  magenta: "#E6D3A0",

  /* ─── Semantic ─── */
  success: "#C9A94E",
  warning: "#F0B93A",
  error: "#E05F5F",
  info: "#F8E7B0",

  /* ─── Background System (Glass UI) ─── */
  bgDark: "#050505",                 // main app background
  bgPanel: "#0D0D0D",
  bgCard: "rgba(255,255,255,0.065)", // smoked glass cards
  bgInput: "rgba(255,255,255,0.09)",

  surface: "#FFFFFF",
  surfaceAlt: "#F7F3EA",

  /* ─── Text ─── */
  textPrimary: "#FFFDF7",
  textSecondary: "rgba(255,253,247,0.74)",
  textMuted: "rgba(255,253,247,0.48)",

  /* ─── Borders ─── */
  border: "rgba(214,178,94,0.22)",
  divider: "rgba(255,255,255,0.095)",

  /* ─── Effects ─── */
  glow: "rgba(214,178,94,0.28)",
};

export const appGradients = {
  primary: `linear-gradient(135deg, #8B6F2A 0%, #D6B25E 50%, #FFF2C2 100%)`,
  glow: `linear-gradient(135deg, rgba(214,178,94,0.24), rgba(255,255,255,0.08), transparent)`,
  accent: `linear-gradient(135deg, #D6B25E, #FFF2C2)`,
  command: `linear-gradient(135deg, rgba(214,178,94,0.18), rgba(255,255,255,0.08), rgba(0,0,0,0.28))`,
  page: `radial-gradient(circle at 18% 0%, rgba(214,178,94,0.18), transparent 34%), radial-gradient(circle at 88% 12%, rgba(255,255,255,0.10), transparent 28%), linear-gradient(180deg, #050505 0%, #0B0B0B 48%, #111111 100%)`,
  soft: `linear-gradient(180deg, #FFFFFF 0%, #F7F3EA 100%)`,
};

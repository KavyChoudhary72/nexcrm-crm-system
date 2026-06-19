import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Managed global dark/light state switching
  theme: {
    extend: {
      colors: {
        blue: colors.violet,
        indigo: colors.purple,
        crmBlue: colors.violet[600],
        crmDarkBlue: colors.violet[900],
        crmBgLight: "#F9FAFB",
        crmTextDark: "#1A1A2E",
      },
      // Smooth premium transition timing constants
      transitionTimingFunction: {
        "premium-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

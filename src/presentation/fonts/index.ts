import { El_Messiri } from "next/font/google";
import localFont from "next/font/local";

export const elMessiri = El_Messiri({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

// Lato is self-hosted: Google Fonts only ships 400/700, but the design relies on
// Lato Medium (500) for every button and nav link (motion.js loads it separately).
// Weight 600 resolves to Bold, exactly as it does in the prototypes.
export const lato = localFont({
  src: [
    { path: "./Lato-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Lato-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Lato-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lato",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const fontVariables = `${elMessiri.variable} ${lato.variable}`;

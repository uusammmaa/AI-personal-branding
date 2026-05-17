import { Bebas_Neue, DM_Sans } from "next/font/google";

export const marketingBebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const marketingDmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

/** Apply on the same element as `marketing-root` (see marketing.css). */
export const marketingFontVariableClassName = `${marketingBebas.variable} ${marketingDmSans.variable}`;

export const marketingRootClassName =
  "marketing-root dark min-h-svh bg-background text-foreground antialiased font-body";

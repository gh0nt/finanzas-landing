import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://www.finanzassinruido.co";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Finanzas sin Ruido",
    default: "Finanzas sin Ruido — Comparador Financiero Colombia",
  },
  description:
    "Compara productos financieros, consulta la TRM y tasas de interés en tiempo real, y aprende finanzas personales con la plataforma educativa de referencia en Colombia.",
  keywords: [
    "comparador financiero Colombia",
    "finanzas personales Colombia",
    "TRM hoy Colombia",
    "tasas de interés Colombia",
    "CDTs Colombia",
    "cuentas de ahorro Colombia",
    "crédito hipotecario Colombia",
    "inversión Colombia",
    "educación financiera",
    "IBR Colombia",
    "finanzas sin ruido",
  ],
  authors: [{ name: "Finanzas sin Ruido S.A.S.", url: BASE_URL }],
  creator: "Finanzas sin Ruido S.A.S.",
  publisher: "Finanzas sin Ruido S.A.S.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Finanzas sin Ruido",
    url: BASE_URL,
    title: "Finanzas sin Ruido — Comparador Financiero Colombia",
    description:
      "Compara productos financieros, consulta la TRM y aprende finanzas personales con la plataforma educativa de referencia en Colombia.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Finanzas sin Ruido — Comparador Financiero Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finanzas sin Ruido — Comparador Financiero Colombia",
    description:
      "Compara productos financieros y aprende finanzas personales con datos en tiempo real.",
    images: ["/og-default.png"],
    creator: "@finanzassinruido",
    site: "@finanzassinruido",
  },
  alternates: {
    canonical: BASE_URL,
    languages: { "es-CO": BASE_URL },
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={manrope.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent
          analyticsEnabled={process.env.NODE_ENV === "production"}
          gaId={process.env.NEXT_PUBLIC_GA_ID}
        />
      </body>
    </html>
  );
}

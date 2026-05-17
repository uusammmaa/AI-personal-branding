import type { Metadata } from "next";
import { MarketingProviders } from "@/components/marketing/marketing-providers";
import {
  marketingFontVariableClassName,
  marketingRootClassName,
} from "@/lib/marketing-fonts";
import { cn } from "@/lib/utils";
import "./marketing.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Usama Akram — AI Architect & Full-Stack Engineer | Jezerox",
    template: "%s | Jezerox",
  },
  description:
    "Senior AI architect and full-stack engineer in Lahore, PK. Jezerox builds intelligent software—AI assistants, agentic systems, RAG, and production AI SaaS—for ambitious businesses.",
  keywords: [
    "AI architect",
    "full-stack engineer",
    "LangGraph",
    "Next.js",
    "FastAPI",
    "RAG",
    "Jezerox",
    "Lahore",
    "Claude API",
  ],
  authors: [{ name: "Usama Akram", url: siteUrl }],
  creator: "Usama Akram",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Jezerox",
    title: "Usama Akram — AI Architect & Full-Stack Engineer",
    description:
      "I build AI that works for your business. Custom assistants, agentic pipelines, RAG, and end-to-end AI products.",
    images: [{ url: "/og", width: 1200, height: 630, alt: "Jezerox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Usama Akram — AI Architect & Full-Stack Engineer",
    description:
      "Intelligent software for ambitious businesses. Lahore, PK — Jezerox.",
    images: [`${siteUrl}/og`],
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Usama Akram",
      jobTitle: "AI Architect & Full-Stack Engineer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
      url: siteUrl,
      worksFor: { "@id": `${siteUrl}#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "Jezerox",
      url: "https://jezerox.com",
      description: "Building intelligent software for ambitious businesses.",
    },
  ],
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className={cn(
          marketingRootClassName,
          marketingFontVariableClassName,
        )}
      >
        <MarketingProviders>{children}</MarketingProviders>
      </div>
    </>
  );
}

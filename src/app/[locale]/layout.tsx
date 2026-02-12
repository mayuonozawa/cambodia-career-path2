import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButtonWrapper } from "@/components/ui/BackButtonWrapper";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "PathForward - ផ្លូវអនាគត | Cambodia Career Path",
    template: "%s | PathForward",
  },
  description:
    "Find scholarships, universities, and vocational schools in Cambodia. Discover your future path with PathForward.",
  keywords: [
    "Cambodia",
    "scholarships",
    "universities",
    "vocational schools",
    "education",
    "អាហារូបករណ៍",
    "សាកលវិទ្យាល័យ",
  ],
  openGraph: {
    type: "website",
    siteName: "PathForward",
    title: "PathForward - ផ្លូវអនាគត",
    description:
      "Find scholarships, universities, and vocational schools in Cambodia",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "km" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <BackButtonWrapper />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

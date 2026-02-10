import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

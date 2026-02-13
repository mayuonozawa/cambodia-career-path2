import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButtonWrapper } from "@/components/ui/BackButtonWrapper";

// ① メタデータの設定
export const metadata: Metadata = {
  title: {
    default: "PathForward - ផ្លូវអនាគត | Cambodia Career Path",
    template: "%s | PathForward",
  },
  description:
    "Find scholarships, universities, and vocational schools in Cambodia. Discover your future path with PathForward.",
  keywords: [
    "Cambodia", "scholarships", "universities", "vocational schools",
    "education", "អាហារូបករណ៍", "សាកលវិទ្យាល័យ",
  ],
  openGraph: {
    type: "website",
    siteName: "PathForward",
    title: "PathForward - ផ្លូវអនាគត",
    description: "Find scholarships, universities, and vocational schools in Cambodia",
  },
};

// ② レイアウトコンポーネント本体
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 取得したメッセージ（next-intl）
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <BackButtonWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}

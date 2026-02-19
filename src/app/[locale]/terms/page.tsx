import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Mail } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return {
    title: t("title"),
    description: "Terms of Service for Bright DoorHub",
  };
}

// ── Article wrapper ────────────────────────────────────────────────────────────
function Article({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center">
          {num}
        </span>
        <h2 className="font-bold text-gray-800 leading-snug">{title}</h2>
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-white rounded-2xl px-6 py-7 mb-2">
        <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-2">
          Bright DoorHub
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-xs text-gray-400">{t("lastUpdated")}</p>
      </div>

      {/* Intro */}
      <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed">{t("intro")}</p>
      </div>

      {/* Articles 1–3 */}
      <Article num={1} title={t("art1Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art1")}</p>
      </Article>

      <Article num={2} title={t("art2Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art2")}</p>
      </Article>

      <Article num={3} title={t("art3Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art3")}</p>
      </Article>

      {/* Article 4 — Prohibited Conduct (list) */}
      <Article num={4} title={t("art4Title")}>
        <p className="text-sm text-gray-600 mb-2">{t("art4Intro")}</p>
        <ul className="space-y-1.5">
          {(["art4Item1", "art4Item2", "art4Item3", "art4Item4", "art4Item5"] as const).map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {t(key)}
            </li>
          ))}
        </ul>
      </Article>

      {/* Articles 5–7 */}
      <Article num={5} title={t("art5Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art5")}</p>
      </Article>

      <Article num={6} title={t("art6Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">
          {t("art6")}{" "}
          <Link href="/privacy" className="text-brand-primary hover:underline">
            →
          </Link>
        </p>
      </Article>

      <Article num={7} title={t("art7Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art7")}</p>
      </Article>

      {/* Article 8 — External Services (list) */}
      <Article num={8} title={t("art8Title")}>
        <ul className="space-y-2">
          {(["art8Item1", "art8Item2", "art8Item3"] as const).map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
              {t(key)}
            </li>
          ))}
        </ul>
      </Article>

      {/* Articles 9–13 */}
      <Article num={9} title={t("art9Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art9")}</p>
      </Article>

      <Article num={10} title={t("art10Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art10")}</p>
      </Article>

      <Article num={11} title={t("art11Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art11")}</p>
      </Article>

      <Article num={12} title={t("art12Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art12")}</p>
      </Article>

      <Article num={13} title={t("art13Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("art13")}</p>
      </Article>

      {/* Article 14 — Contact */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold flex items-center justify-center">
            14
          </span>
          <h2 className="font-bold text-gray-800 leading-snug">{t("art14Title")}</h2>
        </div>
        <div className="pl-10">
          <p className="text-sm font-semibold text-gray-800 mb-1">Bright Door Hub</p>
          <a
            href="mailto:mayuonozawa.taylors@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            {t("art14Email")}
          </a>
        </div>
      </div>

    </div>
  );
}

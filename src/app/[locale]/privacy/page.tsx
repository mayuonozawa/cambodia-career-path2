import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Shield, Mail } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    title: t("title"),
    description: "Privacy Policy for Bright DoorHub",
  };
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-bold text-gray-800 mb-3 leading-snug">{title}</h2>
      {children}
    </div>
  );
}

// ── Sub-section (a / b / c) ────────────────────────────────────────────────────
function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold text-gray-700 mb-1.5">{title}</p>
      {children}
    </div>
  );
}

// ── Bullet list ────────────────────────────────────────────────────────────────
function BulletList({ items, color = "bg-brand-primary/60" }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${color} shrink-0`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-white rounded-2xl px-6 py-7">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-brand-primary" />
          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide">
            Bright DoorHub
          </p>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("title")}</h1>
        <p className="text-sm text-gray-500 mb-2">{t("subtitle")}</p>
        <p className="text-xs text-gray-400">{t("lastUpdated")}</p>
      </div>

      {/* Intro */}
      <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl px-5 py-4">
        <p className="text-sm text-gray-700 leading-relaxed">{t("intro")}</p>
      </div>

      {/* Section 1 — Information We Collect */}
      <Section title={t("s1Title")}>
        <SubSection title={t("s1aTitle")}>
          <BulletList items={[
            t("s1aItem1"), t("s1aItem2"), t("s1aItem3"), t("s1aItem4"),
            t("s1aItem5"), t("s1aItem6"), t("s1aItem7"),
          ]} />
        </SubSection>
        <SubSection title={t("s1bTitle")}>
          <BulletList items={[t("s1bItem1"), t("s1bItem2"), t("s1bItem3")]} />
        </SubSection>
        <SubSection title={t("s1cTitle")}>
          <BulletList items={[t("s1cItem1"), t("s1cItem2")]} />
        </SubSection>
      </Section>

      {/* Section 2 — Purpose of Use */}
      <Section title={t("s2Title")}>
        <p className="text-sm text-gray-600 mb-2">{t("s2Intro")}</p>
        <BulletList items={[
          t("s2Item1"), t("s2Item2"), t("s2Item3"),
          t("s2Item4"), t("s2Item5"), t("s2Item6"),
        ]} />
      </Section>

      {/* Section 3 — Anonymized Data */}
      <Section title={t("s3Title")}>
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          <BulletList
            items={[t("s3Item1"), t("s3Item2"), t("s3Item3"), t("s3Item4")]}
            color="bg-amber-400"
          />
        </div>
      </Section>

      {/* Section 4 — Information Sharing */}
      <Section title={t("s4Title")}>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{t("s4Intro")}</p>
        {[
          { title: t("s4aTitle"), body: t("s4a") },
          { title: t("s4bTitle"), body: t("s4b") },
          { title: t("s4cTitle"), body: t("s4c") },
        ].map(({ title, body }) => (
          <div key={title} className="flex items-start gap-2 mb-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{title}</p>
              <p className="text-sm text-gray-600">{body}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Sections 5–6 — simple paragraphs */}
      <Section title={t("s5Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("s5")}</p>
      </Section>

      <Section title={t("s6Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("s6")}</p>
      </Section>

      {/* Section 7 — User Rights */}
      <Section title={t("s7Title")}>
        <p className="text-sm text-gray-600 mb-2">{t("s7Intro")}</p>
        <BulletList items={[t("s7Item1"), t("s7Item2"), t("s7Item3"), t("s7Item4")]} />
      </Section>

      {/* Sections 8–9 — simple paragraphs */}
      <Section title={t("s8Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("s8")}</p>
      </Section>

      <Section title={t("s9Title")}>
        <p className="text-sm text-gray-600 leading-relaxed">{t("s9")}</p>
      </Section>

      {/* Section 10 — Contact */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 mb-3">{t("s10Title")}</h2>
        <p className="text-sm font-semibold text-gray-800 mb-1">Bright Door Hub</p>
        <a
          href="mailto:mayuonozawa.taylors@gmail.com"
          className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline"
        >
          <Mail className="w-4 h-4" />
          {t("s10Email")}
        </a>
      </div>

      {/* Link to Terms */}
      <p className="text-center text-xs text-gray-400 pb-2">
        <Link href="/terms" className="hover:text-brand-primary hover:underline">
          Terms of Service →
        </Link>
      </p>

    </div>
  );
}

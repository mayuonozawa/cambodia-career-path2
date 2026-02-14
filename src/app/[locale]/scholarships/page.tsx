import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ScholarshipList } from "@/components/scholarships/ScholarshipList";
import { Link } from "@/i18n/routing";
import { Lightbulb, ChevronRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("scholarships");
  return {
    title: t("title"),
    description: "Search and browse scholarships available in Cambodia",
  };
}

export default async function ScholarshipsPage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-5">{t("scholarships.title")}</h1>

      {/* Scholarship Guide Banner — Priming + Curiosity Gap + Progressive Disclosure */}
      <Link href="/about-scholarships" className="block mb-6 group">
        <div className="relative overflow-hidden rounded-xl border border-brand-primary/15 bg-gradient-to-r from-brand-primary-light/60 via-white to-brand-secondary-light/40 px-4 py-3.5 transition-all hover:border-brand-primary/30 hover:shadow-md">
          {/* Decorative corner glow */}
          <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-brand-secondary/8 blur-2xl" />

          <div className="relative flex items-center gap-3">
            {/* Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              <Lightbulb className="h-4.5 w-4.5 text-brand-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Curiosity gap headline */}
              <p className="text-sm font-semibold text-foreground leading-snug">
                {t("scholarships.guideBannerTitle")}
              </p>

              {/* Type pills as visual anchors — Anchoring Effect */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  {t("scholarships.full")}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                  {t("scholarships.partial")}
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                  {t("scholarships.grant")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  — {t("scholarships.guideBannerHint")}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 shrink-0 text-brand-primary/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary" />
          </div>
        </div>
      </Link>

      <ScholarshipList scholarships={scholarships ?? []} />
    </div>
  );
}

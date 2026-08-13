"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Banknote, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, getScholarshipTypeKey, formatDate } from "@/lib/utils";
import { trackEvent } from "@/lib/gtag";
import type { Scholarship, Locale } from "@/types/database";

// トップページ「Featured Scholarships」用のカード。
// クリックで scholarship_view イベント(source: "top")を送るため
// クライアントコンポーネントとして FeaturedScholarships.tsx（サーバー
// コンポーネント）から切り出している。
export function FeaturedScholarshipCard({ scholarship: s }: { scholarship: Scholarship }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const handleClick = () => {
    trackEvent("scholarship_view", {
      scholarship_id: s.id,
      scholarship_name: getLocalizedField(s, "name", locale),
      language: locale,
      source: "top",
    });
  };

  return (
    <Link href={`/scholarships/${s.id}`} onClick={handleClick}>
      <div className="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm flex h-full flex-col transition-shadow hover:shadow-lg">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{getLocalizedField(s, "name", locale)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{getLocalizedField(s, "provider", locale)}</p>
            </div>
            <Badge className={`${getScholarshipTypeBadgeColor(s.type)} text-xs font-medium`}>{t(`scholarships.${getScholarshipTypeKey(s.type)}`)}</Badge>
          </div>
        </div>
        <div className="px-6 flex flex-1 flex-col gap-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">{getLocalizedField(s, "description", locale)}</p>
          <div className="space-y-2 text-sm">
            {getLocalizedField(s, "coverage", locale) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Banknote className="h-4 w-4 shrink-0 text-brand-primary" />
                <span className="line-clamp-1">{getLocalizedField(s, "coverage", locale)}</span>
              </div>
            )}
            {s.deadline && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0 text-brand-primary" />
                <span>{t("scholarships.deadline")}: {formatDate(s.deadline, locale)}</span>
              </div>
            )}
          </div>
          <div className="mt-auto pt-2">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 w-full bg-brand-primary text-white hover:bg-brand-primary-hover">
              {t("common.viewDetails")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

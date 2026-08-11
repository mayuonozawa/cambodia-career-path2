import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import { SectionViewTracker } from "@/components/analytics/SectionViewTracker";
import { FeaturedScholarshipCard } from "./FeaturedScholarshipCard";

// Supabaseへの問い合わせを独立した非同期コンポーネントに切り出し、
// トップページ本体をブロックしないようにする（page.tsx側でSuspense化）。
export default async function FeaturedScholarships() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!scholarships || scholarships.length === 0) return null;

  return (
    <SectionViewTracker
      eventName="scholarship_list_reach"
      sessionKey="ga_scholarship_list_reach_sent"
    >
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t("home.featuredScholarships")}</h2>
            <Link href="/scholarships">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 gap-1 text-brand-primary">
                {t("home.viewAll")}<ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
              <FeaturedScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        </div>
      </section>
    </SectionViewTracker>
  );
}

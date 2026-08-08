import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types/database";

// Supabaseへの問い合わせを独立した非同期コンポーネントに切り出し、
// トップページ本体をブロックしないようにする（page.tsx側でSuspense化）。
export default async function FeaturedSchools() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();

  const { data: universities } = await supabase
    .from("universities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!universities || universities.length === 0) return null;

  return (
    <section className="bg-card px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t("home.featuredSchools") || "Featured Schools"}</h2>
          <Link href="/universities">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 gap-1 text-brand-secondary">
              {t("home.viewAll")}<ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((u) => (
            <Link key={u.id} href={`/universities/${u.id}`}>
              <div className="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm flex h-full flex-col transition-shadow hover:shadow-lg">
                <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{getLocalizedField(u, "name", locale)}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getLocalizedField(u, "location", locale)}
                      </div>
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-xs font-medium">University</Badge>
                  </div>
                </div>
                <div className="px-6 flex flex-1 flex-col gap-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{getLocalizedField(u, "description", locale)}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4 shrink-0 text-brand-secondary" />
                      <span>{t("universities.availableScholarships")}</span>
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2 pt-2">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 flex-1 w-full bg-brand-secondary text-white hover:bg-brand-secondary-hover">
                      {t("common.viewDetails")}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GraduationCap, Compass, Heart, ArrowRight, ChevronRight, Wrench, Sparkles, BookOpen, Users } from "lucide-react";
import CareerExplorer from "@/components/careers/CareerExplorer";
import CareerDiagnosis from "@/components/careers/CareerDiagnosis";
import FeaturedScholarships from "@/components/home/FeaturedScholarships";
import FeaturedSchools from "@/components/home/FeaturedSchools";
import { FeaturedScholarshipsSkeleton, FeaturedSchoolsSkeleton } from "@/components/home/FeaturedSectionSkeleton";

// Supabaseへの問い合わせは FeaturedScholarships / FeaturedSchools に切り出し、
// それぞれ個別のSuspenseで包んでいる。ここを非同期のままSupabaseまで
// await していると、loading.tsx がページ全体（ヒーローやキャリア探索を含む）
// をブロックしてしまい、データ到着時に一瞬でページ全体が入れ替わる巨大な
// レイアウトシフト（CLS）が発生していたため。
export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image with Gradient Overlay */}
        <div className="relative w-full">
          <Image
            src="/images/hero-banner.webp"
            alt="Cambodia Career Path - Find Your Future"
            width={1920}
            height={960}
            priority
            sizes="100vw"
            className="w-full h-auto block"
          />
          {/* Gradient overlay - bottom fade into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10" />
        </div>

        {/* Headline + CTAs overlapping the image bottom */}
        <div className="relative -mt-16 sm:-mt-24 px-4 pb-6">
          <div className="mx-auto max-w-lg">

            {/* Emotional Headline */}
            <div className="mb-6 text-center hero-animate-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-semibold text-brand-secondary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                {t("home.heroLabel")}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight">
                {t("home.heroEmotional")}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-center text-sm sm:text-base text-muted-foreground mb-6 hero-animate-2 max-w-sm mx-auto">
              {t("home.heroSubtitle")}
            </p>

            {/* Primary CTA: Scholarships - largest, most prominent */}
            <div className="hero-animate-cta-1 mb-3">
              <Link href="/scholarships" className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-tertiary p-[1px] shadow-lg shadow-brand-primary/20 transition-all hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.99]">
                  <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-tertiary px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="block text-lg font-bold text-white">
                          {t("common.scholarships")}
                        </span>
                        <span className="block text-xs text-white/75">
                          {t("home.scholarshipsCta")}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Secondary CTAs: Universities + Vocational - smaller, side by side on wider screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="hero-animate-cta-2">
                <Link href="/universities" className="block group">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-brand-secondary/20 bg-white px-4 py-3 shadow-sm transition-all hover:border-brand-secondary/40 hover:shadow-md hover:bg-brand-secondary-light/50 active:scale-[0.99]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary-light">
                        <Compass className="h-4 w-4 text-brand-secondary" />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-foreground">
                          {t("common.universities")}
                        </span>
                        <span className="block text-[11px] text-muted-foreground leading-tight">
                          {t("home.universitiesCta")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-secondary/50 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>
              <div className="hero-animate-cta-3">
                <Link href="/about-vocational" className="block group">
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-brand-tertiary/20 bg-white px-4 py-3 shadow-sm transition-all hover:border-brand-tertiary/40 hover:shadow-md hover:bg-brand-primary-light/50 active:scale-[0.99]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary-light">
                        <Wrench className="h-4 w-4 text-brand-tertiary" />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-foreground">
                          {t("common.vocationalSchools")}
                        </span>
                        <span className="block text-[11px] text-muted-foreground leading-tight">
                          {t("home.vocationalCta")}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-tertiary/50 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Trust Signal Stats Bar */}
        <div className="hero-animate-stats border-t border-border bg-gradient-to-r from-brand-primary-light/40 via-white to-brand-secondary-light/40 px-4 py-5">
          <div className="mx-auto flex max-w-lg items-center justify-around">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-brand-primary" />
                <span className="text-xl font-bold text-brand-primary">8+</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{t("home.scholarshipsCount")}</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-brand-secondary" />
                <span className="text-xl font-bold text-brand-secondary">11+</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{t("home.schoolsCount")}</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-tertiary" />
                <span className="text-xl font-bold text-brand-tertiary">8</span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{t("home.fieldsCount")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="border-t border-border bg-card px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-xl font-bold text-foreground">{t("home.howItWorks")}</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border">
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-light">
                  <GraduationCap className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">1. {t("home.step1")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.step1Desc")}</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border">
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-light">
                  <Compass className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">2. {t("home.step2")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.step2Desc")}</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border">
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary-light">
                  <Heart className="h-6 w-6 text-brand-secondary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">3. {t("home.step3")}</h3>
                  <p className="text-sm text-muted-foreground">{t("home.step3Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section is now integrated into the hero */}

      {/* Fields of Study */}
      <section className="bg-card px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">{t("home.fieldsOfStudy")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {([
              { emoji: "💻", labelKey: "home.fieldIT" },
              { emoji: "🏥", labelKey: "home.fieldHealthcare" },
              { emoji: "💼", labelKey: "home.fieldBusiness" },
              { emoji: "🌾", labelKey: "home.fieldAgriculture" },
              { emoji: "⚙️", labelKey: "home.fieldEngineering" },
              { emoji: "📚", labelKey: "home.fieldEducation" },
              { emoji: "🏨", labelKey: "home.fieldHospitality" },
              { emoji: "🎨", labelKey: "home.fieldArts" },
            ] as const).map(({ emoji, labelKey }) => (
              <Link key={labelKey} href="/universities">
                <div className="bg-card text-card-foreground rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <span className="text-3xl">{emoji}</span>
                    <span className="font-medium text-foreground text-sm">{t(labelKey)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Career Self-Analysis */}
      <CareerDiagnosis />

      {/* Career Decision Engine */}
      <CareerExplorer />

      {/* Featured Scholarships (Supabase取得部分のみ個別Suspense化) */}
      <Suspense fallback={<FeaturedScholarshipsSkeleton />}>
        <FeaturedScholarships />
      </Suspense>

      {/* Featured Schools (Supabase取得部分のみ個別Suspense化) */}
      <Suspense fallback={<FeaturedSchoolsSkeleton />}>
        <FeaturedSchools />
      </Suspense>
    </div>
  );
}

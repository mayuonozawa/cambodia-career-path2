import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, Compass, Heart, Banknote, MapPin, Award, ArrowRight, Calendar, ChevronRight, Wrench, Sparkles, BookOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, formatDate } from "@/lib/utils";
import type { Locale } from "@/types/database";
import CareerExplorer from "@/components/careers/CareerExplorer";

export default async function HomePage() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: universities } = await supabase
    .from("universities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image with Gradient Overlay */}
        <div className="relative w-full">
          <img
            src="/images/hero-banner.png"
            alt="Cambodia Career Path - Find Your Future"
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
          <h2 className="mb-8 text-xl font-bold text-foreground">How it works</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-light">
                  <GraduationCap className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">1. Find Scholarships!</h3>
                  <p className="text-sm text-muted-foreground">Just select your grade, interests, and financial situation — and discover scholarships that match you today.</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary-light">
                  <Compass className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">2. See the pathways!</h3>
                  <p className="text-sm text-muted-foreground">We show you schools and career paths you can pursue with each scholarship.</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary-light">
                  <Heart className="h-6 w-6 text-brand-secondary" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">3. Apply</h3>
                  <p className="text-sm text-muted-foreground">Get application info and contact details.</p>
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
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Fields of Study</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">💻</span>
                  <span className="font-medium text-foreground text-sm">Information Technology</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🏥</span>
                  <span className="font-medium text-foreground text-sm">Healthcare</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">💼</span>
                  <span className="font-medium text-foreground text-sm">Business</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🌾</span>
                  <span className="font-medium text-foreground text-sm">Agriculture</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">⚙️</span>
                  <span className="font-medium text-foreground text-sm">Engineering</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">📚</span>
                  <span className="font-medium text-foreground text-sm">Education</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🏨</span>
                  <span className="font-medium text-foreground text-sm">Hospitality & Tourism</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-brand-primary hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🎨</span>
                  <span className="font-medium text-foreground text-sm">Arts & Design</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Career Decision Engine */}
      <CareerExplorer />

      {/* Featured Scholarships */}
      {scholarships && scholarships.length > 0 && (
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
                <Link key={s.id} href={`/scholarships/${s.id}`}>
                  <div className="bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm flex h-full flex-col transition-shadow hover:shadow-lg">
                    <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{getLocalizedField(s, "name", locale)}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{getLocalizedField(s, "provider", locale)}</p>
                        </div>
                        <Badge className={`${getScholarshipTypeBadgeColor(s.type)} text-xs font-medium`}>{t(`scholarships.${s.type}`)}</Badge>
                      </div>
                    </div>
                    <div className="px-6 flex flex-1 flex-col gap-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">{getLocalizedField(s, "description", locale)}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Banknote className="h-4 w-4 shrink-0 text-brand-primary" />
                          <span className="line-clamp-1">Full coverage</span>
                        </div>
                        {s.deadline && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0 text-brand-primary" />
                            <span>Deadline: {formatDate(s.deadline, locale)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-brand-primary" />
                          <span className="line-clamp-1">Cambodia</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-2">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 w-full bg-brand-primary text-white hover:bg-brand-primary-hover">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Schools */}
      {universities && universities.length > 0 && (
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
                          <Banknote className="h-4 w-4 shrink-0 text-brand-secondary" />
                          <span>$300 - $1000/year</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4 shrink-0 text-brand-secondary" />
                          <span>Scholarships available</span>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-2 pt-2">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 flex-1 w-full bg-brand-secondary text-white hover:bg-brand-secondary-hover">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

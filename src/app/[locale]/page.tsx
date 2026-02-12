import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, Compass, Heart, Banknote, MapPin, Award, ArrowRight, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, formatDate } from "@/lib/utils";
import type { Locale } from "@/types/database";

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
        <div className="relative h-56 sm:h-80 md:h-96 lg:h-screen/2 w-full">
          <img 
            src="/images/hero-banner.png" 
            alt="Cambodia Career Path - Find Your Future" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-background px-4 py-8">
          <div className="mx-auto flex max-w-md flex-col gap-4">
            <Link href="/scholarships" className="block">
              <button className="inline-flex items-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-10 rounded-md px-6 w-full justify-between gap-2 bg-[#3DBDB8] py-6 text-lg font-semibold text-white hover:bg-[#2da8a3]">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6" />
                  <span>{t("common.scholarships")}</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/universities" className="block">
              <button className="inline-flex items-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-10 rounded-md px-6 w-full justify-between gap-2 bg-[#E8995E] py-6 text-lg font-semibold text-white hover:bg-[#d88a50]">
                <div className="flex items-center gap-3">
                  <Compass className="h-6 w-6" />
                  <span>{t("common.universities")}</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </Link>
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E0F5F4]">
                  <GraduationCap className="h-6 w-6 text-[#3DBDB8]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">1. Find Scholarships!</h3>
                  <p className="text-sm text-muted-foreground">Just select your grade, interests, and financial situation — and discover scholarships that match you today.</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E0F5F4]">
                  <Compass className="h-6 w-6 text-[#3DBDB8]" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">2. See the pathways!</h3>
                  <p className="text-sm text-muted-foreground">We show you schools and career paths you can pursue with each scholarship.</p>
                </div>
              </div>
            </div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border border-border">
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FEF0E6]">
                  <Heart className="h-6 w-6 text-[#E8995E]" />
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

      {/* Scholarship Guide CTA */}
      <section className="bg-gradient-to-r from-[#E0F5F4] to-[#FEF0E6] px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#3DBDB8]">Learn More About Scholarships</h2>
          <p className="mb-6 text-lg text-muted-foreground">Explore our comprehensive guide to understand scholarship types, requirements, application process, and tips for success.</p>
          <Link href="/about-scholarships" className="block">
            <button className="inline-flex items-center gap-2 bg-[#3DBDB8] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#2da8a3] transition-colors">
              <span>📘</span> Read Scholarship Guide
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-background px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#3DBDB8]">8+</div>
            <div className="text-muted-foreground">Scholarships</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#3DBDB8]">11+</div>
            <div className="text-muted-foreground">Schools</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#3DBDB8]">8</div>
            <div className="text-muted-foreground">Fields of Study</div>
          </div>
        </div>
      </section>

      {/* Fields of Study */}
      <section className="bg-card px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Fields of Study</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">💻</span>
                  <span className="font-medium text-foreground text-sm">Information Technology</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🏥</span>
                  <span className="font-medium text-foreground text-sm">Healthcare</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">💼</span>
                  <span className="font-medium text-foreground text-sm">Business</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🌾</span>
                  <span className="font-medium text-foreground text-sm">Agriculture</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">⚙️</span>
                  <span className="font-medium text-foreground text-sm">Engineering</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">📚</span>
                  <span className="font-medium text-foreground text-sm">Education</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🏨</span>
                  <span className="font-medium text-foreground text-sm">Hospitality & Tourism</span>
                </div>
              </div>
            </Link>
            <Link href="/universities">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer border border-border transition-all hover:border-[#3DBDB8] hover:shadow-md">
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <span className="text-3xl">🎨</span>
                  <span className="font-medium text-foreground text-sm">Arts & Design</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      {scholarships && scholarships.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{t("home.featuredScholarships")}</h2>
              <Link href="/scholarships">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 gap-1 text-[#3DBDB8]">
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
                          <Banknote className="h-4 w-4 shrink-0 text-[#3DBDB8]" />
                          <span className="line-clamp-1">Full coverage</span>
                        </div>
                        {s.deadline && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0 text-[#3DBDB8]" />
                            <span>Deadline: {formatDate(s.deadline, locale)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-[#3DBDB8]" />
                          <span className="line-clamp-1">Cambodia</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-2">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 w-full bg-[#3DBDB8] text-white hover:bg-[#2da8a3]">
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
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 gap-1 text-[#E8995E]">
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
                          <Banknote className="h-4 w-4 shrink-0 text-[#E8995E]" />
                          <span>$300 - $1000/year</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4 shrink-0 text-[#E8995E]" />
                          <span>Scholarships available</span>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-2 pt-2">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 flex-1 w-full bg-[#E8995E] text-white hover:bg-[#d88a50]">
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

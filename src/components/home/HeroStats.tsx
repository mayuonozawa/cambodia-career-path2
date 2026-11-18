import { getTranslations } from "next-intl/server";
import { BookOpen, Compass, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// トップのヒーロー下にある「奨学金◯件・学校◯校・分野◯」の帯。
// 以前は "8+" "11+" と手書きの数字で、実際の掲載件数（2026年11月時点で奨学金26件）
// より小さく表示されていた。ここでは Supabase の件数をそのまま数えて出す。
//
// 数え方は sitemap.ts と同じく is_active = true のものだけ。
// 奨学金一覧（/scholarships）の「◯件」とも一致する。
// 学校は大学（universities）と職業訓練校（vocational_schools）の合計。

// 分野の数はトップページの「Fields of Study」に並べている8つと同じ数。
const FIELDS_COUNT = 8;

type StatsValues = {
  scholarships: number | null;
  schools: number | null;
};

async function fetchCounts(): Promise<StatsValues> {
  try {
    const supabase = await createClient();
    const [scholarships, universities, vocational] = await Promise.all([
      supabase
        .from("scholarships")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("universities")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("vocational_schools")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    const schoolsKnown =
      universities.count != null && vocational.count != null;

    return {
      scholarships: scholarships.error ? null : scholarships.count,
      schools:
        universities.error || vocational.error || !schoolsKnown
          ? null
          : (universities.count ?? 0) + (vocational.count ?? 0),
    };
  } catch {
    return { scholarships: null, schools: null };
  }
}

// 表示部分。読み込み中（Suspenseのfallback）と読み込み後で同じ見た目・同じ高さに
// することで、数字が入ったときにページがずれない（CLS対策）。
function StatsBar({ scholarships, schools, labels }: StatsValues & {
  labels: { scholarships: string; schools: string; fields: string };
}) {
  const show = (n: number | null) => (n == null ? "–" : String(n));

  return (
    <div className="hero-animate-stats border-t border-border bg-gradient-to-r from-brand-primary-light/40 via-white to-brand-secondary-light/40 px-4 py-5">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-brand-primary" />
            <span className="text-xl font-bold text-brand-primary tabular-nums">
              {show(scholarships)}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">{labels.scholarships}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-brand-secondary" />
            <span className="text-xl font-bold text-brand-secondary tabular-nums">
              {show(schools)}
            </span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">{labels.schools}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-brand-tertiary" />
            <span className="text-xl font-bold text-brand-tertiary tabular-nums">{FIELDS_COUNT}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">{labels.fields}</span>
        </div>
      </div>
    </div>
  );
}

async function getLabels() {
  const t = await getTranslations();
  return {
    scholarships: t("home.scholarshipsCount"),
    schools: t("home.schoolsCount"),
    fields: t("home.fieldsCount"),
  };
}

export default async function HeroStats() {
  const [counts, labels] = await Promise.all([fetchCounts(), getLabels()]);
  return <StatsBar {...counts} labels={labels} />;
}

export async function HeroStatsSkeleton() {
  const labels = await getLabels();
  return <StatsBar scholarships={null} schools={null} labels={labels} />;
}

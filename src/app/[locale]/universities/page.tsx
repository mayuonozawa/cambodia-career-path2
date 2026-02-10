import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { UniversityList } from "@/components/universities/UniversityList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("universities");
  return {
    title: t("title"),
    description: "Browse universities in Cambodia with scholarship information",
  };
}

export default async function UniversitiesPage() {
  const t = await getTranslations("universities");
  const supabase = await createClient();

  // Fetch universities
  const { data: universities } = await supabase
    .from("universities")
    .select("*")
    .order("name_en", { ascending: true });

  // Get scholarship counts per university (奨学金逆引き)
  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("university_id");

  const countMap: Record<string, number> = {};
  if (relations) {
    for (const r of relations) {
      countMap[r.university_id] = (countMap[r.university_id] ?? 0) + 1;
    }
  }

  const universitiesWithCounts = (universities ?? []).map((u) => ({
    ...u,
    scholarship_count: countMap[u.id] ?? 0,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <UniversityList universities={universitiesWithCounts} />
    </div>
  );
}

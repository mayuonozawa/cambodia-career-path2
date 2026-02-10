import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ScholarshipList } from "@/components/scholarships/ScholarshipList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("scholarships");
  return {
    title: t("title"),
    description: "Search and browse scholarships available in Cambodia",
  };
}

export default async function ScholarshipsPage() {
  const t = await getTranslations("scholarships");
  const supabase = await createClient();

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <ScholarshipList scholarships={scholarships ?? []} />
    </div>
  );
}

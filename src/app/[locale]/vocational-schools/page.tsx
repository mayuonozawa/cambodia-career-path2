import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { VocationalSchoolList } from "@/components/vocational-schools/VocationalSchoolList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("vocationalSchools");
  return {
    title: t("title"),
    description: "Discover vocational training programs in Cambodia",
  };
}

export default async function VocationalSchoolsPage() {
  const t = await getTranslations("vocationalSchools");
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from("vocational_schools")
    .select("*")
    .order("name_en", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <VocationalSchoolList schools={schools ?? []} />
    </div>
  );
}

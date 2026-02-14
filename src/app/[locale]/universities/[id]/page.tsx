import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UniversityDetail } from "@/components/universities/UniversityDetail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = await createClient();
  const { data: university } = await supabase
    .from("universities")
    .select("name_en, name_km, description_en, description_km, location_en, location_km")
    .eq("id", id)
    .single();

  if (!university) {
    return { title: "University Not Found" };
  }

  const name = locale === "km" ? university.name_km : university.name_en;
  const description = locale === "km" ? university.description_km : university.description_en;
  const location = locale === "km" ? university.location_km : university.location_en;

  return {
    title: `${name} | PathForward`,
    description: description?.slice(0, 160) || `${name} - ${location}`,
    openGraph: {
      title: name,
      description: description?.slice(0, 160) || `${name} - ${location}`,
      type: "article",
    },
  };
}

export default async function UniversityDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  const { data: university } = await supabase
    .from("universities")
    .select("*")
    .eq("id", id)
    .single();

  if (!university) {
    notFound();
  }

  let availableScholarships: any[] = [];
  if (isAuthenticated) {
    const { data: relations } = await supabase
      .from("scholarship_university_relations")
      .select("scholarship_id")
      .eq("university_id", id);

    if (relations && relations.length > 0) {
      const scholarshipIds = relations.map((r: any) => r.scholarship_id);
      const { data: scholarships } = await supabase
        .from("scholarships")
        .select("*")
        .in("id", scholarshipIds)
        .eq("is_active", true);
      availableScholarships = scholarships ?? [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <UniversityDetail
        university={university}
        availableScholarships={availableScholarships}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

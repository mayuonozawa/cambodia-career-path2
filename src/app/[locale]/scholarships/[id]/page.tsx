import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = await createClient();
  const { data: scholarship } = await supabase
    .from("scholarships")
    .select("name_en, name_km, provider_en, provider_km, description_en, description_km")
    .eq("id", id)
    .single();

  if (!scholarship) {
    return { title: "Scholarship Not Found" };
  }

  const name = locale === "km" ? scholarship.name_km : scholarship.name_en;
  const provider = locale === "km" ? scholarship.provider_km : scholarship.provider_en;
  const description = locale === "km" ? scholarship.description_km : scholarship.description_en;

  return {
    title: `${name} | PathForward`,
    description: description?.slice(0, 160) || `${name} - ${provider}`,
    openGraph: {
      title: name,
      description: description?.slice(0, 160) || `${name} - ${provider}`,
      type: "article",
    },
  };
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const age = cookieStore.get("userAge")?.value;
  const region = cookieStore.get("userRegion")?.value;
  const gender = cookieStore.get("userGender")?.value;

  if (!age || !region || !gender) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoginPrompt />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: scholarship } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  if (!scholarship) {
    notFound();
  }

  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("university_id")
    .eq("scholarship_id", id);

  let relatedUniversities: any[] = [];
  if (relations && relations.length > 0) {
    const uniIds = relations.map((r: any) => r.university_id);
    const { data: universities } = await supabase
      .from("universities")
      .select("*")
      .in("id", uniIds);
    relatedUniversities = universities ?? [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ScholarshipDetail
        scholarship={scholarship}
        relatedUniversities={relatedUniversities}
      />
    </div>
  );
}

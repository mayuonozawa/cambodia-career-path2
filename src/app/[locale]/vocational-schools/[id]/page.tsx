import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VocationalSchoolDetail } from "@/components/vocational-schools/VocationalSchoolDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = await createClient();
  const { data: school } = await supabase
    .from("vocational_schools")
    .select("name_en, name_km, description_en, description_km, location_en, location_km")
    .eq("id", id)
    .single();

  if (!school) {
    return { title: "Vocational School Not Found" };
  }

  const name = locale === "km" ? school.name_km : school.name_en;
  const description = locale === "km" ? school.description_km : school.description_en;
  const location = locale === "km" ? school.location_km : school.location_en;

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

export default async function VocationalSchoolDetailPage({ params }: Props) {
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
  const { data: school } = await supabase
    .from("vocational_schools")
    .select("*")
    .eq("id", id)
    .single();

  if (!school) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <VocationalSchoolDetail school={school} />
    </div>
  );
}

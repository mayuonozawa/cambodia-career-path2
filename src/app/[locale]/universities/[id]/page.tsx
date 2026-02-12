import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UniversityDetail } from "@/components/universities/UniversityDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: { id: string; locale: string };
}

export default async function UniversityDetailPage({ params }: Props) {
  const cookieStore = await cookies();
  const age = cookieStore.get("userAge")?.value;
  const region = cookieStore.get("userRegion")?.value;
  if (!age || !region) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoginPrompt />
      </div>
    );
  }
  const supabase = await createClient();
  const { data: university } = await supabase
    .from("universities")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!university) {
    notFound();
  }
  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("scholarship_id")
    .eq("university_id", params.id);
  let availableScholarships: any[] = [];
  if (relations && relations.length > 0) {
    const scholarshipIds = relations.map((r: any) => r.scholarship_id);
    const { data: scholarships } = await supabase
      .from("scholarships")
      .select("*")
      .in("id", scholarshipIds)
      .eq("is_active", true);
    availableScholarships = scholarships ?? [];
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <UniversityDetail university={university} availableScholarships={availableScholarships} />
    </div>
  );
}

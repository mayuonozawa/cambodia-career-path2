import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: { id: string; locale: string };
}

export default async function ScholarshipDetailPage({ params }: Props) {
  // 年齢・居住地をCookieから取得
  const cookieStore = cookies();
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
  const { data: scholarship } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!scholarship) {
    notFound();
  }
  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("university_id")
    .eq("scholarship_id", params.id);
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
      <ScholarshipDetail scholarship={scholarship} relatedUniversities={relatedUniversities} />
    </div>
  );
}

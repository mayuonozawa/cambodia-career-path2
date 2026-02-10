import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Check auth - detail pages require login (段階的ログイン)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoginPrompt />
      </div>
    );
  }

  // Fetch scholarship
  const { data: scholarship } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  if (!scholarship) {
    notFound();
  }

  // Fetch related universities via junction table
  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("university_id")
    .eq("scholarship_id", id);

  let relatedUniversities: any[] = [];
  if (relations && relations.length > 0) {
    const uniIds = relations.map((r) => r.university_id);
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

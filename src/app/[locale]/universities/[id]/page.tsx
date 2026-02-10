import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UniversityDetail } from "@/components/universities/UniversityDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function UniversityDetailPage({ params }: Props) {
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

  // Fetch university
  const { data: university } = await supabase
    .from("universities")
    .select("*")
    .eq("id", id)
    .single();

  if (!university) {
    notFound();
  }

  // Fetch available scholarships (reverse lookup: 奨学金逆引き)
  const { data: relations } = await supabase
    .from("scholarship_university_relations")
    .select("scholarship_id")
    .eq("university_id", id);

  let availableScholarships: any[] = [];
  if (relations && relations.length > 0) {
    const scholarshipIds = relations.map((r) => r.scholarship_id);
    const { data: scholarships } = await supabase
      .from("scholarships")
      .select("*")
      .in("id", scholarshipIds)
      .eq("is_active", true);
    availableScholarships = scholarships ?? [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <UniversityDetail
        university={university}
        availableScholarships={availableScholarships}
      />
    </div>
  );
}

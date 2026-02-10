import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VocationalSchoolDetail } from "@/components/vocational-schools/VocationalSchoolDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function VocationalSchoolDetailPage({ params }: Props) {
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

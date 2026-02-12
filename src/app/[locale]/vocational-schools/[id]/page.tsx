import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VocationalSchoolDetail } from "@/components/vocational-schools/VocationalSchoolDetail";

interface Props {
  params: { id: string; locale: string };
}

export default async function VocationalSchoolDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: school } = await supabase
    .from("vocational_schools")
    .select("*")
    .eq("id", params.id)
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

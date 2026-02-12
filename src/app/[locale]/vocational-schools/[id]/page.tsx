import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VocationalSchoolDetail } from "@/components/vocational-schools/VocationalSchoolDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

interface Props {
  params: { id: string; locale: string };
}

export default async function VocationalSchoolDetailPage({ params }: Props) {
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

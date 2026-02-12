"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VocationalSchoolDetail } from "@/components/vocational-schools/VocationalSchoolDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

export default function VocationalSchoolDetailPage() {
  const params = useParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const age = localStorage.getItem("userAge");
    const region = localStorage.getItem("userRegion");
    setHasAccess(!!age && !!region);
  }, []);

  useEffect(() => {
    if (hasAccess && params?.id) {
      (async () => {
        const supabase = await createClient();
        const { data: school } = await supabase
          .from("vocational_schools")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!school) {
          notFound();
        }
        setSchool(school);
        setLoading(false);
      })();
    }
  }, [hasAccess, params]);

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoginPrompt onSuccess={() => setHasAccess(true)} />
      </div>
    );
  }
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <VocationalSchoolDetail school={school} />
    </div>
  );
}

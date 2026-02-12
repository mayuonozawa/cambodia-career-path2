"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UniversityDetail } from "@/components/universities/UniversityDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

export default function UniversityDetailPage() {
  const params = useParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [university, setUniversity] = useState(null);
  const [availableScholarships, setAvailableScholarships] = useState([]);
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
        const { data: university } = await supabase
          .from("universities")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!university) {
          notFound();
        }
        setUniversity(university);
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
        setAvailableScholarships(availableScholarships);
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
      <UniversityDetail university={university} availableScholarships={availableScholarships} />
    </div>
  );
}

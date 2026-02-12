"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ScholarshipDetail } from "@/components/scholarships/ScholarshipDetail";
import { LoginPrompt } from "@/components/ui/LoginPrompt";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [scholarship, setScholarship] = useState(null);
  const [relatedUniversities, setRelatedUniversities] = useState([]);
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
        const { data: scholarship } = await supabase
          .from("scholarships")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!scholarship) {
          notFound();
        }
        setScholarship(scholarship);
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
        setRelatedUniversities(relatedUniversities);
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
      <ScholarshipDetail scholarship={scholarship} relatedUniversities={relatedUniversities} />
    </div>
  );
}

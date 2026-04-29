import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brightdoorhub.com";
const locales = ["km", "en"];

const staticPaths = [
  { path: "",                    priority: 1.0 },
  { path: "/scholarships",       priority: 0.9 },
  { path: "/universities",       priority: 0.9 },
  { path: "/vocational-schools", priority: 0.9 },
  { path: "/about-scholarships", priority: 0.6 },
  { path: "/about-vocational",   priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map(({ path, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority,
    }))
  );

  const [{ data: scholarships }, { data: universities }, { data: schools }] =
    await Promise.all([
      supabase.from("scholarships").select("id, updated_at").eq("is_active", true),
      supabase.from("universities").select("id, updated_at").eq("is_active", true),
      supabase.from("vocational_schools").select("id, updated_at").eq("is_active", true),
    ]);

  const scholarshipRoutes: MetadataRoute.Sitemap = (scholarships ?? []).flatMap((s) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/scholarships/${s.id}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );

  const universityRoutes: MetadataRoute.Sitemap = (universities ?? []).flatMap((u) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/universities/${u.id}`,
      lastModified: new Date(u.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  const vocationalRoutes: MetadataRoute.Sitemap = (schools ?? []).flatMap((v) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/vocational-schools/${v.id}`,
      lastModified: new Date(v.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...scholarshipRoutes, ...universityRoutes, ...vocationalRoutes];
}

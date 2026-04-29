import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brightdoorhub.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/km/auth/", "/en/auth/", "/km/profile/", "/en/profile/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

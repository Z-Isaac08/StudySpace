import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://studyspace.com"; // TODO: Update with actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"], // Prevent crawling of API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

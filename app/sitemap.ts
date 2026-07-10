import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hanifa.offlix.app",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://hanifa.offlix.app/products",
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://hanifa.offlix.app/order",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://hanifa.offlix.app/contact",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://hanifa.offlix.app/blog",
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
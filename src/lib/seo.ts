import type { Metadata } from "next";
import {
  GITHUB_ORG_URL,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  GITHUB_WEB_REPO_URL,
} from "@/lib/links";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lineage.meanweasel.com";
export const SITE_NAME = "Lineage";
export const SITE_UPDATED = "2026-07-07";

export const homeDescription =
  "Lineage is the design UX for human and agent collaboration: a visual interface for image assets, app screens, UX iterations, and their JSON lineage.";

export function absoluteUrl(path = "/") {
  if (path.startsWith("https://")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Lineage landing page preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "mean-weasel",
    url: GITHUB_ORG_URL,
    founder: {
      "@type": "Person",
      name: "neonwatty",
      url: GITHUB_PROFILE_URL,
    },
    sameAs: [GITHUB_ORG_URL, GITHUB_REPO_URL, GITHUB_WEB_REPO_URL],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: homeDescription,
    publisher: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: homeDescription,
    url: SITE_URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    creator: {
      "@type": "Person",
      name: "neonwatty",
      url: GITHUB_PROFILE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "mean-weasel",
      url: GITHUB_ORG_URL,
    },
    codeRepository: GITHUB_REPO_URL,
    sameAs: [GITHUB_REPO_URL, GITHUB_WEB_REPO_URL, GITHUB_ORG_URL, GITHUB_PROFILE_URL],
    featureList: [
      "Visual lineage graph for generated assets",
      "JSON lineage tree for agent workflows",
      "Project and artifact history",
      "Human review surface for iterative design work",
    ],
  };
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let avatarUrl = "";
  try {
    const profile = await prisma.profile.findFirst();
    avatarUrl = profile?.avatarUrl || "";
  } catch (error) {
    console.error("Favicon API error:", error);
  }

  // If no avatar, return a simple round SVG with 'M' (using basic font)
  if (!avatarUrl) {
    return getFallbackSvg();
  }

  // Instead of creating an SVG that externally links the image (which browsers block for favicons),
  // we fetch the image directly, optionally transforming it to be round if it's Cloudinary,
  // and return the binary image data.
  try {
    let fetchUrl = avatarUrl;
    if (fetchUrl.includes("res.cloudinary.com") && fetchUrl.includes("/upload/")) {
      fetchUrl = fetchUrl.replace("/upload/", "/upload/w_64,h_64,c_fill,r_max/");
    }

    const response = await fetch(fetchUrl);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      });
    }
  } catch (error) {
    console.error("Failed to fetch avatar for favicon:", error);
  }

  // Fallback if fetch fails
  return getFallbackSvg();
}

function getFallbackSvg() {
  const fallbackSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff6584;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#grad)" />
      <text x="16" y="21" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">M</text>
    </svg>
  `;
  return new NextResponse(fallbackSvg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}

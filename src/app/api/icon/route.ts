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

  // Create a round SVG with the avatar image
  // We use clipPath to make it perfectly circular
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <clipPath id="circleClip">
          <circle cx="16" cy="16" r="14" />
        </clipPath>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff6584;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#grad)" />
      <image href="${avatarUrl}" x="2" y="2" width="28" height="28" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice" />
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}

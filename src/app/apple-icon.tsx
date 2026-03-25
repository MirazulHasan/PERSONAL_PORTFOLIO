import { ImageResponse } from 'next/og'
import prisma from '@/lib/db'

// Route segment config
export const runtime = 'nodejs'; // Use Node.js for Prisma access
export const revalidate = 60; // Cache for 1 min

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default async function AppleIcon() {
  let avatarUrl = "";
  try {
      const profile = await prisma.profile.findFirst();
      avatarUrl = profile?.avatarUrl || "";
  } catch (error) {
      console.error("Apple-icon fetching error:", error);
  }

  // Fallback to stylized 'M' if no avatar
  if (!avatarUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          }}
        />
      ),
      { ...size, fonts: [] }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          padding: '8px',
        }}
      >
        <img
          src={avatarUrl}
          width="164"
          height="164"
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: []
    }
  )
}


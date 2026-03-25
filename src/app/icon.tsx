import { ImageResponse } from 'next/og'
import prisma from '@/lib/db'

// Route segment config
export const runtime = 'nodejs'; // Use Node.js for Prisma access
export const revalidate = 60; // Cache for 1 min

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default async function Icon() {
  let avatarUrl = "";
  try {
      const profile = await prisma.profile.findFirst();
      avatarUrl = profile?.avatarUrl || "";
  } catch (error) {
      console.error("Icon fetching error:", error);
  }

  // Fallback icon generation if no avatar or error
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
          padding: '2px',
        }}
      >
        <img
          src={avatarUrl}
          width="28"
          height="28"
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


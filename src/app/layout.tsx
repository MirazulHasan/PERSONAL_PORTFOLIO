import type { Metadata } from "next";
import "./globals.css";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Md. Mirazul Hasan | Portfolio",
    description: "Full Stack Developer — building clean, scalable web applications.",
    icons: {
      icon: "/api/icon",
      shortcut: "/api/icon",
      apple: "/api/icon",
    },
  };
}




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

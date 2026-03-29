import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

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




import BackgroundEffects from "@/components/BackgroundEffects";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
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
      <body>
        <BackgroundEffects />
        {children}
      </body>
    </html>
  );
}

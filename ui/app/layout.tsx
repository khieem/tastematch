import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "./providers";

export const metadata: Metadata = {
  title: "TasteMatch — Group decisions made easy",
  description: "Your group decides in 2 minutes.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 h-full">
        <div className="relative w-full min-h-full text-text overflow-hidden">
          <div
            className="fixed inset-0 z-0 bg-cream"
            style={{
              backgroundImage:
                "radial-gradient(60% 50% at 20% 0%, rgba(255, 138, 61, 0.32), transparent 70%), radial-gradient(60% 50% at 100% 100%, rgba(255, 77, 46, 0.22), transparent 70%)",
            }}
          />
          <div className="relative z-[1] max-w-[440px] mx-auto min-h-screen flex flex-col px-5 pt-[22px] pb-[calc(26px+env(safe-area-inset-bottom))]">
            <GameProvider>{children}</GameProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

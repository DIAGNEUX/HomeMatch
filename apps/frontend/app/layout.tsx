import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "HomeMatch",
  description: "Trouvez le logement qui correspond vraiment a vos besoins.",
  icons: {
    icon: "/images/Icons/Logo-icon.png",
    shortcut: "/images/Icons/Logo-icon.png",
    apple: "/images/Icons/Logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>{children}
        </AuthProvider>
      </body>
    </html>
  );
}

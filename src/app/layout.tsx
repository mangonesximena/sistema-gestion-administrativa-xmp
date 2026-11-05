import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roott+Co - Sistema de Gestión Administrativa",
  description: "Sistema para la organización, asignación y seguimiento de tareas y movimientos económicos de Roott+Co",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden bg-slate-100 text-slate-800">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}

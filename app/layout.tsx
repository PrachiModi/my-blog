import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Blog",
  description: "My personal diary and blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-gray-800 min-h-screen font-serif">
        <header className="border-b border-amber-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight hover:text-amber-700 transition-colors">
              My Blog
            </a>
            <a href="/admin" className="text-sm text-gray-500 hover:text-amber-700 transition-colors">
              Write
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}

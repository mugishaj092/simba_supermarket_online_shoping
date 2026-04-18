import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { HydrationProvider } from "@/components/layout/HydrationProvider";

export const metadata: Metadata = {
  title: "Simba Supermarket — Rwanda's Online Supermarket",
  description: "Shop fresh groceries, cosmetics, drinks, and more — delivered to your door in Kigali, Rwanda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 antialiased">
        <ThemeProvider>
          <ReduxProvider>
            <HydrationProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <CartDrawer />
              <Toaster position="top-right" richColors toastOptions={{ duration: 2500 }} />
            </HydrationProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

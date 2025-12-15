// External Imports
import { Outfit } from "next/font/google";

// Local Imports
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers";

// Styles
import "@/styles/globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    fallback: ["system-ui", "sans-serif"],
});


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfit.variable} font-sans antialiased`}
                suppressHydrationWarning
            >
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}

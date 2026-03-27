import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-headline',
    display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '500'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'TestPilot AI – AI-Powered Test Case Generator',
    description:
        'Convert software requirements into manual test cases, Gherkin BDD scenarios, and Selenium Java step definitions using Groq AI.',
    keywords: ['test case generator', 'AI testing', 'Gherkin', 'Cucumber', 'Selenium', 'QA automation'],
    icons: {
        icon: '/testpilot-logo-hd.png',
        shortcut: '/testpilot-logo-hd.png',
        apple: '/testpilot-logo-hd.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

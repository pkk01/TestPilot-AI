import type { Metadata } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
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
            <body className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

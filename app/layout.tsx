import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

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
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

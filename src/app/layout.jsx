import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PortfolioDataProvider } from '@/context/PortfolioDataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Prof. Dr. Aris Patel | Senior Consultant Cardiologist & Heart Specialist',
  description: 'Official portfolio and chamber appointment booking portal for Prof. Dr. Aris Patel, leading Senior Interventional Cardiologist in Dhaka, Bangladesh.',
  keywords: 'cardiologist dhaka, heart specialist bangladesh, angioplasty, pacemaker doctor, chamber serial booking, evercare hospital cardiologist',
  authors: [{ name: 'Prof. Dr. Aris Patel' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0284c7',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PortfolioDataProvider>
          <ThemeProvider>
            <LanguageProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </PortfolioDataProvider>
      </body>
    </html>
  );
}

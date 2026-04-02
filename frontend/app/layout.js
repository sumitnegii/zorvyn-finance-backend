import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Zorvyn Finance | Dashboard',
  description: 'Finance Data Processing and Access Control System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

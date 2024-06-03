import { APP_NAME } from '@framer/FramerServerSDK';
import { ToastProvider } from './components/Toasts/ToastProvider';
import './global.css';

import { Arimo } from 'next/font/google';
import { Libre_Franklin } from 'next/font/google';

export const metadata = {
  title: APP_NAME,
  description: 'The easiest way to create Farcaster Frames.',
};

const arimo = Arimo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-arimo',
});
const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={arimo.variable + ' ' + libre_franklin.variable}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

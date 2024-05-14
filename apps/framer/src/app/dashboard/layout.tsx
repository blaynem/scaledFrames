import { ToastProvider } from '../components/Toasts/ToastProvider';
import UserBar from '../components/UserBar';

export const metadata = {
  title: 'Dashboard',
  description: 'Projects and Teams Overview',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <UserBar />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

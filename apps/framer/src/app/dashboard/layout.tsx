import UserBar from './UserBar';

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
        <UserBar />
        {children}
      </body>
    </html>
  );
}

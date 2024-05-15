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
    <>
      <div className="fixed w-full h-full m-0 p-0 bg-zinc-300/25 -z-10" />
      <UserBar />
      {children}
    </>
  );
}

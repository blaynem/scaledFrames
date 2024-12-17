'use client';
import Header from '../components/Header';
import { UserProvider } from '../components/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div>
        <div
          id="background"
          className="fixed w-full h-full m-0 p-0 bg-zinc-100 -z-10 dark:bg-slate-900 dark:text-white"
        />
        <Header />
        <div className="w-full flex dark:text-white ">
          <div className="px-8 py-4 w-full">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}

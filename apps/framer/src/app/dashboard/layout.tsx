'use client';
import UserBar from '../components/UserBar';
import { TeamsPanel } from './TeamsPanel';
import { UserProvider } from '../components/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div
        id="background"
        className="fixed w-full h-full m-0 p-0 bg-zinc-100 -z-10"
      >
        <UserBar />
        <div className="w-full flex">
          <TeamsPanel />
          <div className="px-8 py-12 w-full">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
}

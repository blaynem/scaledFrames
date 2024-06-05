'use client';
import { APP_NAME } from '@framer/FramerServerSDK';
import {
  createSupabaseClient,
  getSession,
} from '@framer/FramerServerSDK/client';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import {
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PAGES } from '../lib/constants';

/**
 * A Header bar component that displays the user's profile picture and allows them to click on settings, or log out.
 * @returns
 */
export default function Header() {
  const [email, setEmail] = useState<string>('');
  const supabase = createSupabaseClient();
  const router = useRouter();

  const logOut = () => {
    supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      setEmail(session?.user.email ?? '');
    };
    fetchUser();
  }, [supabase]);

  return (
    <div className="relative p-4 flex justify-between">
      <div className="flex items-center">
        <Link href={PAGES.DASHBOARD}>
          <h2 className="mr-8 text-2xl font-bold leading-7 text-gray-900">
            {APP_NAME} (BETA)
          </h2>
        </Link>
        <Link href={PAGES.DASHBOARD}>
          <h2 className={`mr-4 text-xl font-medium text-gray-900`}>
            Dashboard
          </h2>
        </Link>
      </div>
      <Menu>
        <MenuButton className="p-2 rounded-full bg-green-400 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-green-600 data-[open]:bg-green-600 data-[focus]:outline-1 data-[focus]:outline-black">
          <UserCircleIcon className="w-12" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom end"
            className="origin-top-right rounded-xl border border-black/5 bg-black/5 p-1 text-sm/6 [--anchor-gap:var(--spacing-1)] focus:outline-none"
          >
            {email && (
              <MenuItem>
                <p className="w-full truncate group flex items-center gap-2 rounded-lg py-1.5 px-3 cursor-default">
                  {email}
                </p>
              </MenuItem>
            )}
            {/* <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
                <Cog6ToothIcon className="w-6" />
                Settings
              </button>
            </MenuItem> */}
            <div className="my-1 h-px bg-black/5" />
            <MenuItem>
              <button
                onClick={logOut}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
              >
                <ArrowLeftStartOnRectangleIcon className="w-6 rotate-180" />
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

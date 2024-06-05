import {
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../components/UserContext';

export const TeamsPanel = () => {
  const { selectedTeam, teams, changeSelectedTeam, user } = useUser();
  const pathname = usePathname();

  if (!selectedTeam) {
    return null;
  }

  return (
    <div className="relative px-8 py-4 min-w-[360px]">
      <Popover>
        {({ open: popperOpen, close: closePopper }) => (
          <>
            <p className="font-semibold text-lg">Selected Team</p>
            <PopoverButton className="rounded-md bg-zinc-100 w-full text-left p-2 pl-3 text-sm/6 border border-slate-400 focus:outline-none data-[active]:border-slate-800 data-[hover]:border-slate-800 data-[focus]:border-slate-800">
              <div className="flex">
                <p className="flex-1 font-semibold ">{selectedTeam.name}</p>
                <ChevronDownIcon
                  className={`w-5 h-5 transition ${
                    popperOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
              <p className="mt-2">{selectedTeam.userCount} Users</p>
            </PopoverButton>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel
                anchor="bottom"
                className="border bg-zinc-100 border-slate-200 shadow-xl w-[var(--button-width)] rounded-md divide-y divide-slate-300 text-sm/6 [--anchor-gap:4px]"
              >
                {/* <div>
                  <Link
                    className="hover:text-teal-500"
                    href={`team/${selectedTeam.id}`}
                  >
                    <p className="py-2 px-3">Team Profile</p>
                  </Link>
                </div> */}
                <div className="relative">
                  <p className="py-2 px-3">Change Teams</p>
                  <ul className="list-disc list-inside">
                    {teams.map((team) => {
                      const isSelectedTeam = team.id === selectedTeam.id;
                      const userIsOwner = team.ownerId === user?.id;
                      return (
                        <li key={team.id} className="px-3 mb-2">
                          {isSelectedTeam ? (
                            <span className="cursor-default font-medium bg-slate-300">
                              {team.name}
                              {userIsOwner ? ' (Owner)' : ''}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                changeSelectedTeam(team.id);
                                closePopper();
                              }}
                              className="hover:text-teal-500"
                            >
                              {team.name}
                              {userIsOwner ? ' (Owner)' : ''}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
      <Link
        href="/dashboard"
        className={`block mt-4 text-slate-600 ${
          pathname === '/dashboard'
            ? 'font-semibold cursor-default'
            : 'hover:text-teal-500 '
        }`}
      >
        Projects
      </Link>
      <Link
        href={`/dashboard/team`}
        className={`block mt-4 text-slate-600 ${
          pathname === '/dashboard/team'
            ? 'font-semibold cursor-default'
            : 'hover:text-teal-500 '
        }`}
      >
        Team Settings
      </Link>
    </div>
  );
};

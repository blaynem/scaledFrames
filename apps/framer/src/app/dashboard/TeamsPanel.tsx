import {
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { TeamType } from './page';
import Link from 'next/link';

export const TeamsPanel = (props: {
  currentTeam: TeamType;
  teams: TeamType[];
  changeSelectedTeam: (team: TeamType) => void;
}) => {
  return (
    <div className="relative px-8 xl:pr-16 py-4 column-1 col-span-3 sm:col-span-2 min-w-80">
      <h1 className="p-8 pl-0 font-bold text-xl uppercase">Framer (beta)</h1>
      <Popover>
        {({ open: popperOpen, close: closePopper }) => (
          <>
            <PopoverButton className="rounded-md w-full text-left p-2 pl-3 text-sm/6 border border-slate-400 focus:outline-none data-[active]:border-slate-800 data-[hover]:border-slate-800 data-[focus]:border-slate-800">
              <div className="flex">
                <p className="flex-1 font-semibold ">
                  {props.currentTeam.name} Team
                </p>
                <ChevronDownIcon
                  className={`w-5 h-5 transition ${
                    popperOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
              <p className="mt-2">{props.currentTeam.memberCount} Users</p>
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
                className="border border-slate-200 shadow-xl w-[var(--button-width)] rounded-md divide-y divide-slate-300 text-sm/6 [--anchor-gap:4px]"
              >
                <div>
                  <Link
                    className="hover:text-teal-500"
                    href={`team/${props.currentTeam.id}`}
                  >
                    <p className="py-2 px-3">Team Profile</p>
                  </Link>
                </div>
                <div className="relative">
                  <p className="py-2 px-3">Switch Team View:</p>
                  <ul className="list-disc list-inside">
                    {props.teams.map((team) => {
                      const isTeam = team.id === props.currentTeam.id;
                      return (
                        <li key={team.id} className="px-3 mb-2">
                          {isTeam ? (
                            <span className="cursor-default font-medium bg-slate-300">
                              {team.name}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                props.changeSelectedTeam(team);
                                closePopper();
                              }}
                              className="hover:text-teal-500"
                            >
                              {team.name}
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
    </div>
  );
};

'use client';
import { useEffect, useRef, useState } from 'react';
import { CustomizationSettiongs } from './CustomizationSettings';
import { SubscriptionPanel } from './SubscriptionPanel';
import { TeamMembers } from './TeamMembers';
import {
  FramerClientSDK,
  GetTeamResponseType,
  GetUserResponseType,
  TeamMemberType,
} from '@framer/FramerServerSDK/client';
import { useToast } from '../../components/Toasts/ToastProvider';
import { ToastTypes } from '../../components/Toasts/GenericToast';
import { Role } from '@prisma/client';

export interface TeamPageProps {
  params: {
    teamId: string;
  };
}

export const convertToUrlSafe = (val: string): string =>
  val
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

export const sectionWrapper =
  'mx-auto max-w-4xl w-full mb-4 p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800';
export const headerSection =
  'mb-4 text-xl font-bold text-gray-900 dark:text-white';

export default function TeamPage(props: TeamPageProps) {
  const teamId = props.params.teamId;
  const fetchedRef = useRef(false);
  const { addToast } = useToast();
  const [teamData, setTeamData] = useState<GetTeamResponseType | null>();
  const [user, setUser] = useState<GetUserResponseType | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      const loadToast = addToast(ToastTypes.LOADING, 'loading');
      const clientSdk = FramerClientSDK();

      const user = await clientSdk.user.get();
      if ('error' in user) {
        loadToast.clearToast();
        console.error('Error fetching user data:', user.error);
        return;
      }
      setUser(user);

      const data = await clientSdk.teams.getById(teamId);
      if ('error' in data) {
        console.error('Error fetching team data:', data.error);
        loadToast.clearToast();
        addToast(
          ToastTypes.ERROR,
          `Error fetching team data. Are you sure you're on the right page?`,
          'infinite'
        );
        return setTeamData(null);
      }
      loadToast.clearToast();
      setTeamData(data);
    };
    fetchTeamData();
  }, [addToast, teamId]);

  const handleInviteUser = () => {
    window.alert('Invite user coming soon');
  };

  const handleRemoveUser = (member: TeamMemberType) => {
    window.alert('Remove user coming soon');
  };

  if (!teamData || !user) {
    return <div>Loading...</div>;
  }

  const memberRole =
    teamData.members.find((member) => member.id === user.id)?.role ??
    Role.Viewer;

  return (
    <div className="w-full p-16">
      <h1 className="max-w-4xl mx-auto text-3xl mb-8 font-bold text-gray-900 dark:text-white">
        {teamData.name} Settings
      </h1>
      <CustomizationSettiongs
        defaultState={{
          teamName: teamData.name,
          subdomain: convertToUrlSafe(teamData.name),
        }}
      />
      <TeamMembers
        memberRole={memberRole}
        removeUser={handleRemoveUser}
        inviteUser={handleInviteUser}
        teamMembers={teamData.members}
      />
      <SubscriptionPanel teamId={'1'} />
      <div className={sectionWrapper}>
        <h2 className={headerSection}>Leave Team</h2>
        <button
          type="button"
          disabled
          className="text-white bg-red-600 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Leave Team
        </button>
      </div>
    </div>
  );
}

'use client';
import { CustomizationSettings } from './CustomizationSettings';
import { SubscriptionPanel } from './SubscriptionPanel';
import { TeamMembers } from './TeamMembers';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { useToast } from '../../components/Toasts/ToastProvider';
import { ToastTypes } from '../../components/Toasts/GenericToast';
import { Role } from '@prisma/client';
import { useUser } from '../../components/UserContext';
import { useRouter } from 'next/navigation';
import GeneralModal from '../../components/Modal';
import { useState } from 'react';
import { sectionWrapper, headerSection } from './styles';

export default function TeamPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const { selectedTeam, user, refreshTeamsData } = useUser();
  const [leaveTeamOpen, setLeaveTeamOpen] = useState(false);

  if (!selectedTeam || !user) {
    return <div>Loading...</div>;
  }

  const handleLeaveTeam = async () => {
    if (
      selectedTeam.members.find((member) => member.id === user.id)?.role ===
      Role.Owner
    ) {
      return addToast(
        ToastTypes.ERROR,
        'Owners cannot leave the team. Please transfer ownership to another member.'
      );
    }
    const loadingToast = addToast(ToastTypes.LOADING, 'Leaving team...');
    const clientSdk = FramerClientSDK();
    const response = await clientSdk.teams.leaveTeam(selectedTeam.id);
    if ('error' in response) {
      loadingToast.clearToast();
      return addToast(ToastTypes.ERROR, response.error);
    }
    // Refresh the users team data, then we push them back to the dashboard.
    refreshTeamsData();

    loadingToast.clearToast();
    addToast(ToastTypes.SUCCESS, 'Successfully left team');

    router.push('/dashboard');
  };

  return (
    <div className="max-w-[800px]">
      <GeneralModal
        open={!!leaveTeamOpen}
        onClose={() => setLeaveTeamOpen(false)}
        onConfirm={handleLeaveTeam}
        headerText="Leave Team"
        buttonText="Confirm"
        contentText={`Are you sure you want to leave the team ${selectedTeam.name}?`}
      />
      <h1 className="text-3xl mb-8 font-bold text-gray-900 dark:text-white">
        {selectedTeam.name} Settings
      </h1>
      <CustomizationSettings />
      <TeamMembers />
      <SubscriptionPanel />
      <div className={sectionWrapper}>
        <h2 className={headerSection}>Leave Team</h2>
        <button
          disabled={selectedTeam.ownerId === user.id}
          type="button"
          onClick={() => setLeaveTeamOpen(true)}
          className="text-white bg-red-600 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Leave Team
        </button>
        {selectedTeam.ownerId === user.id && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You are the owner of this team. To delete the team, please contact
            support.
          </p>
        )}
      </div>
    </div>
  );
}

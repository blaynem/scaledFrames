'use client';
import { useState } from 'react';
import { sectionWrapper, headerSection } from './page';
import {
  APP_NAME,
  getAllowedFeatures,
  getRolePermissions,
} from '@framer/FramerServerSDK';
import { useUser } from '../../components/UserContext';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { useToast } from '../../components/Toasts/ToastProvider';
import { ToastTypes } from '../../components/Toasts/GenericToast';
import { Role } from '@prisma/client';

export const CustomizationSettings = () => {
  const { selectedTeam, refreshTeamsData, user } = useUser();
  const { addToast } = useToast();

  const [teamName, setTeamName] = useState(selectedTeam?.name);
  const [subdomain, setSubdomain] = useState(selectedTeam?.customSubDomain);

  if (!selectedTeam || !user) {
    return null;
  }

  const onSaveChanges = async () => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Saving changes...');
    const clientSdk = FramerClientSDK();
    const data = await clientSdk.teams.editTeamProperties({
      teamId: selectedTeam.id,
      name: teamName,
      customSubDomain: subdomain,
    });
    if ('error' in data) {
      loadingToast.clearToast();
      console.error(data.error);
      addToast(ToastTypes.ERROR, data.error);
      return;
    }
    refreshTeamsData();
    loadingToast.clearToast();
  };

  const allowedFeatures = getAllowedFeatures(
    selectedTeam.subscription.plan.subscriptionType
  );

  const _userRole =
    selectedTeam.members.find((member) => member.id === user.id)?.role ??
    Role.Viewer;
  const userPermissions = getRolePermissions(_userRole);

  const onTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userPermissions.canEditTeam) return;
    setTeamName(e.target.value);
  };

  const showSaveButton =
    userPermissions.canEditProject &&
    (teamName !== selectedTeam.name ||
      subdomain !== selectedTeam.customSubDomain);

  return (
    <div className={sectionWrapper}>
      <h2 className={headerSection}>Customization</h2>
      <div className="mb-4">
        <label
          htmlFor="team-name-helper-text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Team Name
        </label>
        <input
          disabled={!userPermissions.canEditTeam}
          value={teamName}
          onChange={(e) => onTeamNameChange(e)}
          type="text"
          id="team-name-helper-text"
          aria-describedby="team-name-helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg disabled:text-black/50 disabled:bg-slate-300 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={selectedTeam.name}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="subdomain-helper-text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Custom Subdomain
          <span className="ml-4 font-normal">
            {!allowedFeatures.canHaveCustomSubdomain &&
              '(Subscription Required)'}
          </span>
        </label>
        <input
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          disabled={!allowedFeatures.canHaveCustomSubdomain}
          type="text"
          id="subdomain-helper-text"
          aria-describedby="subdomain-helper-text-explanation"
          className="disabled:text-black/50 disabled:bg-slate-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={selectedTeam.customSubDomain}
        />
        <p
          id="subdomain-helper-text-explanation"
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          Create a custom subdomain for your team. Ex: <b>team-name</b>.
          {APP_NAME.toLowerCase()}.com
        </p>
      </div>
      {showSaveButton && (
        <div className="flex justify-end">
          <button
            onClick={onSaveChanges}
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

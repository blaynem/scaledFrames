import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { sectionWrapper, headerSection } from './page';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import { Role } from '@prisma/client';
import InviteUser from './InviteUser';
import { ToastTypes } from '../../components/Toasts/GenericToast';
import { useToast } from '../../components/Toasts/ToastProvider';
import { useEffect, useState } from 'react';
import { useUser } from '../UserContext';

type RoleProps = {
  /**
   * If true, this role can invite new members to the team.
   */
  canInvite: boolean;
  /**
   * If not null, this function will be called to determine if the role can remove the target role.
   */
  canRemove: (targetRole: Role) => boolean;
};
const viewProps: { [key in Role]: RoleProps } = {
  [Role.Owner]: {
    canInvite: true,
    canRemove: (targetRole: Role) =>
      ([Role.Admin, Role.Member, Role.Viewer] as Role[]).includes(targetRole),
  },
  [Role.Admin]: {
    canInvite: true,
    canRemove: (targetRole: Role) =>
      ([Role.Member, Role.Viewer] as Role[]).includes(targetRole),
  },
  [Role.Member]: {
    canInvite: false,
    canRemove: () => false,
  },
  [Role.Viewer]: {
    canInvite: false,
    canRemove: () => false,
  },
};

type MemberDisplay = {
  id: string;
  email: string;
  displayName?: string;
  role: Role;
};

export const TeamMembers = () => {
  const { addToast } = useToast();
  const { selectedTeam, user } = useUser();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<MemberDisplay[]>([]);

  useEffect(() => {
    if (!selectedTeam) return;
    setMembers(
      selectedTeam.members.map((member) => ({
        id: member.id,
        email: member.email,
        displayName: member.displayName ?? undefined,
        role: member.role,
      }))
    );
  }, [selectedTeam]);

  if (!selectedTeam || !user) {
    return <div>Loading...</div>;
  }

  const handleInviteUser = async (email: string, role: Role) => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Inviting user...');
    const clientSdk = FramerClientSDK();
    const invited = await clientSdk.teams.inviteUser({
      teamId: selectedTeam.id,
      email,
      role: role ?? Role.Member,
    });
    if ('error' in invited) {
      loadingToast.clearToast();
      setInviteOpen(false);
      return addToast(ToastTypes.ERROR, invited.error);
    }

    setMembers((prev) => [
      ...prev,
      {
        id: new Date().getTime().toString(), // Temporary ID
        email,
        role: invited.role,
      },
    ]);

    loadingToast.clearToast();
    setInviteOpen(false);
    addToast(ToastTypes.SUCCESS, `Successfully invited ${email}`);
  };

  const handleRemoveUser = async (member: MemberDisplay) => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Removing user...');
    const clientSdk = FramerClientSDK();
    const res = await clientSdk.teams.removeUser({
      teamId: selectedTeam.id,
      userId: member.id,
    });

    if ('error' in res) {
      loadingToast.clearToast();
      return addToast(ToastTypes.ERROR, res.error);
    }

    setMembers((prev) => prev.filter((m) => m.id !== member.id));

    loadingToast.clearToast();
    addToast(
      ToastTypes.SUCCESS,
      `Successfully removed ${member.displayName ?? member.email}`
    );
  };

  const memberRole =
    selectedTeam.members.find((member) => member.id === user.id)?.role ??
    Role.Viewer;
  const { canInvite, canRemove } = viewProps[memberRole];

  return (
    <div className={sectionWrapper}>
      <InviteUser
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInviteUser}
      />
      <h2 className={headerSection}>Team Members</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((member) => (
          <li key={member.id} className={'py-2'}>
            <div className={`flex items-center space-x-4 rtl:space-x-reverse`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {member.displayName ??
                    member.email.slice(0, member.email.indexOf('@'))}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {member.email}
                </p>
              </div>
              <div className="inline-flex items-center">
                {member.id === user.id && (
                  <span className="mr-8 text-sm font-medium text-gray-500 dark:text-white">
                    You
                  </span>
                )}
                <div className="mr-4 text-base font-semibold text-gray-900 dark:text-white">
                  {member.role}
                </div>
                {canRemove(member.role) && (
                  <button onClick={() => handleRemoveUser(member)}>
                    <MinusCircleIcon className="text-red-500 hover:text-red-700 h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {canInvite && (
        <div className="flex justify-end">
          <button
            onClick={() => setInviteOpen(true)}
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Invite
          </button>
        </div>
      )}
    </div>
  );
};

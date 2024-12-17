import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { sectionWrapper, headerSection } from './page';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import { Role } from '@prisma/client';
import InviteUserModal from './InviteUserModal';
import { ToastTypes } from '../../components/Toasts/GenericToast';
import { useToast } from '../../components/Toasts/ToastProvider';
import { useEffect, useState } from 'react';
import { useUser } from '../../components/UserContext';
import GeneralModal from '../../components/Modal';
import { PencilIcon } from '@heroicons/react/24/outline';

type MemberDisplay = {
  id: string;
  email: string;
  displayName?: string;
  role: Role;
};

export const TeamMembers = () => {
  const { addToast } = useToast();
  const { selectedTeam, user, userPermissions, allowedFeatures, userRole } =
    useUser();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<MemberDisplay[]>([]);
  const [memberToRemove, setMemberToRemove] = useState<MemberDisplay | null>(
    null
  );
  const [memberRoleChange, setMemberRoleChange] =
    useState<MemberDisplay | null>(null);

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

  const handleUpdateRole = async (member: MemberDisplay, role: Role) => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Updating role...');
    const clientSdk = FramerClientSDK();
    const res = await clientSdk.teams.editUserRole({
      teamId: selectedTeam.id,
      userId: member.id,
      role,
    });

    if ('error' in res) {
      loadingToast.clearToast();
      return addToast(ToastTypes.ERROR, res.error);
    }

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === member.id) {
          return { ...m, role };
        }
        return m;
      })
    );

    loadingToast.clearToast();
    addToast(
      ToastTypes.SUCCESS,
      `Successfully updated ${member.displayName ?? member.email}'s role`
    );
  };

  // Determine if we show the edit role button or not.
  const showEditRole = (member: MemberDisplay) => {
    if (member.id == user.id) {
      return false;
    }
    if (userRole === Role.Owner) {
      // Owner can't edit their own role.
      if (member.role === Role.Owner) return false;
    }
    return userPermissions.canEditTargetsRole(member.role);
  };

  const isInviteDisabled = members.length >= allowedFeatures.maxTeamMembers;

  return (
    <div className={sectionWrapper}>
      {/* Modal for inviting a new Team Member */}
      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInviteUser}
      />

      {/* Modal for removing a Team Member */}
      <GeneralModal
        open={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (memberToRemove) {
            handleRemoveUser(memberToRemove);
            setMemberToRemove(null);
          }
        }}
        headerText="Remove User"
        buttonText="Remove"
        contentText={`Are you sure you want to remove ${
          memberToRemove?.displayName ?? memberToRemove?.email
        } from the team?`}
      />

      {/* Modal for editing a Team Members Role */}
      <GeneralModal
        open={!!memberRoleChange}
        onClose={() => setMemberRoleChange(null)}
        onConfirm={() => {
          const _newRole = (
            document.getElementById('role-change') as HTMLSelectElement
          )?.value as Role;
          if (memberRoleChange) {
            handleUpdateRole(memberRoleChange, _newRole);
            setMemberRoleChange(null);
          }
        }}
        headerText="Change Role"
        buttonText="Confirm"
      >
        <div>
          <p className="p-4 text-sm font-regular">
            Changing role for:{' '}
            <span className="font-medium">
              {memberRoleChange?.displayName ?? memberRoleChange?.email}
            </span>
          </p>

          <div className="p-4 pt-0">
            <label
              htmlFor="role-change"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Role
            </label>
            <select
              id="role-change"
              name="role-change"
              defaultValue={memberRoleChange?.role}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            >
              <option value={Role.Admin}>Admin</option>
              <option value={Role.Member}>Member</option>
              <option value={Role.Viewer}>Viewer</option>
            </select>
          </div>
        </div>
      </GeneralModal>

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
                <div className="flex mr-4 text-base font-semibold text-gray-900 dark:text-white">
                  {showEditRole(member) && (
                    <button
                      onClick={() => {
                        setMemberRoleChange(member);
                      }}
                      className="mr-4"
                    >
                      <PencilIcon className="h-6 w-6" />
                    </button>
                  )}
                  {member.role}
                </div>
                {userPermissions.canRemoveTarget(member.role) && (
                  <button
                    onClick={() => {
                      setMemberToRemove(member);
                    }}
                  >
                    <MinusCircleIcon className="text-red-500 hover:text-red-700 h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {userPermissions.canEditTeam && (
        <div className="flex justify-end">
          {isInviteDisabled ? (
            <p className="text-sm">Upgrade Subscription to invite more.</p>
          ) : (
            <button
              onClick={() => setInviteOpen(true)}
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Invite
            </button>
          )}
        </div>
      )}
    </div>
  );
};

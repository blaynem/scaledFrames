import { TeamMemberType } from '@framer/FramerServerSDK/client';
import { sectionWrapper, headerSection } from './page';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import { Role } from '@prisma/client';

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
      ([Role.Admin, Role.Member, Role.Viewer, Role.Invited] as Role[]).includes(
        targetRole
      ),
  },
  [Role.Admin]: {
    canInvite: true,
    canRemove: (targetRole: Role) =>
      ([Role.Member, Role.Viewer, Role.Invited] as Role[]).includes(targetRole),
  },
  [Role.Member]: {
    canInvite: false,
    canRemove: (targetRole: Role) => false,
  },
  [Role.Viewer]: {
    canInvite: false,
    canRemove: (targetRole: Role) => false,
  },
  [Role.Invited]: {
    canInvite: false,
    canRemove: (targetRole: Role) => false,
  },
};

export const TeamMembers = (props: {
  memberRole: Role;
  teamMembers: TeamMemberType[];
  inviteUser: () => void;
  removeUser: (member: TeamMemberType) => void;
}) => {
  const { canInvite, canRemove } = viewProps[props.memberRole];

  return (
    <div className={sectionWrapper}>
      <h2 className={headerSection}>Team Members</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {props.teamMembers.map((member) => (
          <li key={member.id} className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {member.displayName}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {member.email}
                </p>
              </div>
              <div className="inline-flex items-center">
                <div className="mr-4 text-base font-semibold text-gray-900 dark:text-white">
                  {member.role}
                </div>
                {canRemove(member.role) && (
                  <button onClick={() => props.removeUser(member)}>
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
            onClick={props.inviteUser}
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

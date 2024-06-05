'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  FramerClientSDK,
  GetTeamResponseType,
  ProjectIncludeRootFrame,
} from '@framer/FramerServerSDK/client';
import { ToastTypes } from './Toasts/GenericToast';
import { useToast } from './Toasts/ToastProvider';
import { Role, User } from '@prisma/client';
import {
  RolePermissionsType,
  SubscriptionGatedFeatures,
  getAllowedFeatures,
  getRolePermissions,
  lowestRolePermissions,
} from '@framer/FramerServerSDK';
import { useRouter } from 'next/navigation';
import { PAGES } from '../lib/constants';

type UserContextType = {
  /**
   * The features that are allowed based on the currently selected teams subscription.
   */
  allowedFeatures: SubscriptionGatedFeatures;
  /**
   * The permissions that the user has based on their role in the currently selected team.
   */
  userPermissions: RolePermissionsType;
  /**
   * The role of the user in the currently selected team.
   */
  userRole: Role;
  /**
   * Technically only used for the initial fetch.
   */
  isLoading: boolean;
  user: User | null;
  teams: GetTeamResponseType[];
  /**
   * Defaults to the first team in the list.
   */
  selectedTeam: GetTeamResponseType | null;
  /**
   * Change the selected team, update the projects list.
   */
  changeSelectedTeam: (teamId: string) => void;

  /**
   * Get the project data by the project ID.
   *
   * Note: This is based on the selected team data. It's not a new fetch request. If we need to refetch data we should use `refreshTeamsData`.
   */
  getProjectDataById: (
    projectId: string
  ) => ProjectIncludeRootFrame | undefined;
  /**
   * Refresh all the team data. A bit of a hacky way to refresh the data.
   *
   * Used when a user leaves a team, since they get pushed to the dashboard page.
   *
   * NOTE: Does NOT show a loading toast.
   */
  refreshTeamsData: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

/**
 * Contains many goodies that are needed throughout the app.
 *
 * Including permissions and subscription features.
 * @returns
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { addToast } = useToast();
  const fetchedRef = useRef(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<GetTeamResponseType[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<GetTeamResponseType | null>(
    null
  );
  const [allowedFeatures, setAllowedFeatures] =
    useState<SubscriptionGatedFeatures>(getAllowedFeatures('Free'));
  const [userPermissions, setUserPermissions] = useState<RolePermissionsType>(
    lowestRolePermissions
  );
  const [userRole, setUserRole] = useState<Role>(Role.Viewer);

  const getProjectDataById = (projectId: string) => {
    return selectedTeam?.projects.find((project) => project.id === projectId);
  };

  const refreshTeamsData = async () => {
    const framerSdk = FramerClientSDK();
    const _teams = await framerSdk.teams.getAll();
    if ('error' in _teams) {
      console.error('Error fetching data:', _teams);
      return;
    }

    const _selectedTeamData = _teams[0];
    setTeams(_teams);
    setSelectedTeam(_selectedTeamData);
  };

  /**
   * When a user changes the selected team, we need to update the allowed features and user permissions as well.
   */
  const handleSelectedTeamChange = async (
    selectedTeamData: GetTeamResponseType,
    userId: string
  ) => {
    setSelectedTeam(selectedTeamData);
    setAllowedFeatures(
      getAllowedFeatures(selectedTeamData.subscription.plan.subscriptionType)
    );
    const _userRole =
      selectedTeamData.members.find((member) => member.id === userId)?.role ??
      Role.Viewer;
    setUserRole(_userRole);
    setUserPermissions(getRolePermissions(_userRole));
  };

  useEffect(() => {
    const framerSdk = FramerClientSDK();

    const fetchUser = async () => {
      // Prevents the double fetch in strict mode because of the way useEffect works
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      setIsLoading(true);

      const loadingToast = addToast(ToastTypes.LOADING, 'loading');
      // Fetch user and teams
      const _userFetch = framerSdk.user.get();
      const _teamsFetch = framerSdk.teams.getAll();

      const [_user, _teams] = await Promise.all([_userFetch, _teamsFetch]);
      if ('error' in _user || 'error' in _teams) {
        console.error('Error fetching data:', _user, _teams);
        loadingToast.clearToast();
        return;
      }

      const _selectedTeamData = _teams[0];
      setUser(_user);
      setTeams(_teams);
      handleSelectedTeamChange(_selectedTeamData, _user.id);

      loadingToast.clearToast();
      setIsLoading(false);
    };

    fetchUser();
  }, [addToast]);

  const changeSelectedTeam = async (teamId: string) => {
    const _team = teams.find((t) => t.id === teamId);
    if (!_team) {
      console.error('Could not find team with id:', teamId);
      return;
    }

    handleSelectedTeamChange(_team, user?.id ?? '');
    // We push them to the dashboard otherwise its a little disorienting when we change teams.
    router.push(PAGES.DASHBOARD);
  };

  return (
    <UserContext.Provider
      value={{
        getProjectDataById,
        changeSelectedTeam,
        refreshTeamsData,
        isLoading,
        user,
        teams,
        selectedTeam,
        allowedFeatures,
        userPermissions,
        userRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

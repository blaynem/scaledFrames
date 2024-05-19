'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  FramerClientSDK,
  GetTeamResponseType,
} from '@framer/FramerServerSDK/client';
import { ToastTypes } from '../components/Toasts/GenericToast';
import { useToast } from '../components/Toasts/ToastProvider';
import { User } from '@prisma/client';

type UserContextType = {
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
 * Hook to use the User context.
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

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<GetTeamResponseType[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<GetTeamResponseType | null>(
    null
  );

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
      setSelectedTeam(_selectedTeamData);
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

    setSelectedTeam(_team);
  };

  return (
    <UserContext.Provider
      value={{
        changeSelectedTeam,
        refreshTeamsData,
        isLoading,
        user,
        teams,
        selectedTeam,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

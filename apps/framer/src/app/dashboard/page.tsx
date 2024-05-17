'use client';
import {
  FramerClientSDK,
  GetUserResponseType,
  TeamAndProject,
} from '@framer/FramerServerSDK/client';
import { useEffect, useRef, useState } from 'react';
import { ProjectsPanel } from './ProjectsPanel';
import { TeamsPanel } from './TeamsPanel';
import { useToast } from '../components/Toasts/ToastProvider';
import { ToastTypes } from '../components/Toasts/GenericToast';

export type TeamType = {
  id: string;
  name: string;
  memberCount: number;
};

export type TeamProject = {
  isLive: boolean;
  projectId: string;
  projectUrl: string;
  projectUrlSmall: string;
  projectTitle: string;
  imageSrc: string;
  memberCount: number;
};

const mapToTeam = (team: TeamAndProject): TeamType => ({
  name: team.name,
  memberCount: team.userCount,
  id: team.id,
});

const filterOptions = [
  { label: 'Owned by anyone', value: 'anyone' },
  { label: 'Owned by Me', value: 'me' },
  { label: 'Not Owned by Me', value: 'not-me' },
];

export default function Dashboard() {
  const { addToast } = useToast();
  const fetchedRef = useRef(false);

  const [selectedFilterId, setSelectedFilterId] = useState(
    filterOptions[0].value
  );
  const [user, setUser] = useState<GetUserResponseType | null>(null);
  const [projects, setProjects] = useState<GetUserResponseType['projects']>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamAndProject | null>(null);
  const [teams, setTeams] = useState<TeamAndProject[]>([]);

  useEffect(() => {
    const framerSdk = FramerClientSDK();

    const fetchUser = async () => {
      // Prevents the double fetch in strict mode because of the way useEffect works
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      const loadingToast = addToast(ToastTypes.LOADING, 'loading');
      const _user = await framerSdk.user.get();
      if ('error' in _user) {
        console.error('Error fetching user:', _user.error);
        loadingToast.clearToast();
        return;
      }

      // We want to keep these data fetches pure
      setUser(_user);
      setTeams(_user.teams);
      setSelectedTeam(_user.teams[0]);
      setProjects(_user.teams[0].projects);
      loadingToast.clearToast();
    };

    fetchUser();
  }, [addToast]);

  const changeSelectedTeam = (team: TeamType) => {
    const _team = teams.find((t) => t.id === team.id);
    if (!_team) {
      console.error('Could not find team with id:', team.id);
      return;
    }

    setSelectedTeam(_team);
    setProjects(_team.projects);
  };

  if (!selectedTeam) {
    return <div>Loading...</div>;
  }

  const _currentTeam: TeamType = mapToTeam(selectedTeam);
  const _teams: TeamType[] = teams.map(mapToTeam);

  const _projects: TeamProject[] = projects.map((p) => {
    const projectPath = p.customBasePath + p.rootFrame.path;
    return {
      isLive: p.isProjectLive,
      projectId: p.id,
      projectUrl: `https://www.framer.com/f${projectPath}`,
      projectUrlSmall: `/f${projectPath}`,
      imageSrc: p.rootFrame.imageUrl,
      projectTitle: p.title,
      memberCount: selectedTeam.userCount,
    } satisfies TeamProject;
  });

  return (
    <div className="grid grid-cols-8">
      <TeamsPanel
        changeSelectedTeam={changeSelectedTeam}
        currentTeam={_currentTeam}
        teams={_teams}
      />
      <ProjectsPanel
        teamId={selectedTeam.id}
        filter={{
          options: filterOptions,
          selected: selectedFilterId,
          onChange: (newValue) => {
            setSelectedFilterId(newValue);
          },
        }}
        projects={_projects}
      />
    </div>
  );
}

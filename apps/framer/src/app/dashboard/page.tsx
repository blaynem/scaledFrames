'use client';
import {
  FramerClientSDK,
  GetUserResponseType,
  TeamAndProject,
} from '@framer/FramerServerSDK/client';
import { useEffect, useState } from 'react';
import { ProjectsPanel } from './ProjectsPanel';
import { TeamsPanel } from './TeamsPanel';

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

const filterOptions = [
  { label: 'Owned by anyone', value: 'anyone' },
  { label: 'Owned by Me', value: 'me' },
  { label: 'Not Owned by Me', value: 'not-me' },
];

export default function Dashboard() {
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
      const user = await framerSdk.user.get();
      if ('error' in user) {
        console.error('Error fetching user:', user.error);
        return;
      }

      // We want to keep these data fetches pure
      setUser(user);
      setTeams(user.teams);
      setSelectedTeam(user.teams[0]);
      setProjects(user.teams[0].projects);
    };

    fetchUser();
  }, []);

  const changeSelectedTeam = (team: TeamType) => {
    const _team = teams.find((t) => t.id === team.id);
    if (!_team) {
      console.error('Could not find team with id:', team.id);
      return;
    }

    setSelectedTeam(_team);
    setProjects(_team.projects);
  };

  const _currentTeam: TeamType = {
    name: selectedTeam?.name ?? '',
    memberCount: selectedTeam?.userCount ?? 1,
    id: selectedTeam?.id ?? '',
  };
  const _teams: TeamType[] = teams.map((team) => ({
    name: team.name,
    memberCount: team.userCount,
    id: team.id,
  }));
  const _projects: TeamProject[] = projects.map((p) => {
    const projectPath = p.customBasePath + p.rootFrame?.path;
    return {
      isLive: p.isProjectLive,
      projectId: p.id,
      projectUrl: `https://www.framer.com/f${projectPath}`,
      projectUrlSmall: `/f${projectPath}`,
      imageSrc: p.rootFrame?.imageUrl ?? '',
      projectTitle: p.title,
      memberCount: selectedTeam?.userCount ?? 1,
    };
  });

  return (
    <div className="grid grid-cols-8">
      <TeamsPanel
        changeSelectedTeam={changeSelectedTeam}
        currentTeam={_currentTeam}
        teams={_teams}
      />
      <ProjectsPanel
        teamId={selectedTeam?.id ?? ''}
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

'use client';
import { Select } from '@headlessui/react';
import { BoltIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useToast } from '../components/Toasts/ToastProvider';
import { ToastTypes } from '../components/Toasts/GenericToast';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { useRouter } from 'next/navigation';
import { PAGES } from '../lib/constants';
import Link from 'next/link';
import { useUser } from '../components/UserContext';
import { APP_DOMAIN } from '@framer/FramerServerSDK';
import { CopyButtonInput } from '../components/ui/CopyButtonInput';

type TeamProject = {
  isLive: boolean;
  projectId: string;
  projectUrl: string;
  projectUrlSmall: string;
  projectTitle: string;
  imageSrc: string;
  imageSrcAspectRatio: string;
  memberCount: number;
};

const filterOptions = [
  { label: 'Owned by anyone', value: 'anyone' },
  { label: 'Owned by Me', value: 'me' },
  { label: 'Not Owned by Me', value: 'not-me' },
];
export const ProjectsPanel = () => {
  const { selectedTeam } = useUser();
  const [selectedFilterId, setSelectedFilterId] = useState(
    filterOptions[0].value
  );
  const router = useRouter();
  const { addToast } = useToast();
  const clientSdk = FramerClientSDK();

  if (!selectedTeam) {
    return <div>Loading...</div>;
  }

  const onNewProjectClick = async () => {
    const loadingToast = addToast(ToastTypes.LOADING, 'Loading', 'infinite');
    const newProject = await clientSdk.projects.create({
      title: 'Project',
      teamId: selectedTeam.id,
    });
    if ('error' in newProject) {
      loadingToast.clearToast();
      console.error('Error creating new project: ', newProject.error);
      addToast(ToastTypes.ERROR, newProject.error, 5000);
      return;
    }
    loadingToast.clearToast();
    router.push(`${PAGES.FRAME_EDITOR}/${newProject.id}`);
  };

  const _projects: TeamProject[] = selectedTeam.projects.map((p) => {
    const projectPath = p.customBasePath + p.rootFrame.path;
    return {
      isLive: p.isProjectLive,
      projectId: p.id,
      projectUrl: `${APP_DOMAIN}/f${projectPath}`,
      projectUrlSmall: `/f${projectPath}`,
      imageSrc: p.rootFrame.imageUrl,
      imageSrcAspectRatio: p.rootFrame.aspectRatio,
      projectTitle: p.title,
      memberCount: selectedTeam.userCount,
    } satisfies TeamProject;
  });

  return (
    <div className="">
      <div className="mb-8">
        <h2 className="pb-2 text-3xl font-semibold">Create a Project</h2>
        <div className="">
          <button onClick={onNewProjectClick} className="hover:text-blue-500">
            <div className="mb-2 w-20 h-20 flex justify-center items-center rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <PlusIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="text-left text-sm font-medium">New Project</div>
          </button>
        </div>
      </div>
      <div>
        <div className="mb-8 flex justify-between">
          <h2 className="py-2 text-3xl font-semibold">Projects in this Team</h2>
          <Select
            value={selectedFilterId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedFilterId(e.target.value)
            }
            style={{
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            className="border-slate-200 p-2 rounded-l data-[hover]:cursor-pointer focus:outline-none data-[active]:border-slate-800 data-[hover]:border-slate-800 data-[focus]:border-slate-800 dark:bg-slate-800 dark:border-slate-800 dark:text-white dark:data-[hover]:border-slate-800 dark:data-[active]:border-slate-800 dark:data-[focus]:border-slate-800 dark:focus:outline-1 dark:focus:outline-black dark:data-[hover]:cursor-pointer"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {_projects.map((project) => (
            <ProjectCard key={project.projectId} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({
  isLive,
  imageSrc,
  imageSrcAspectRatio,
  projectUrl,
  projectUrlSmall,
  projectId,
  projectTitle,
}: TeamProject) => {
  const href = `${PAGES.PROJECT_OVERVIEW}/${projectId}`;
  return (
    <div className="bg-slate-100 flex flex-col border p-4 rounded border-slate-300">
      <Link href={href} className="mb-1 relative flex grow items-center">
        <div className="w-full overflow-hidden">
          <img
            className={'w-full h-full rounded-t-md object-cover'}
            style={{ aspectRatio: imageSrcAspectRatio }}
            src={imageSrc}
            alt={'Projects Panel Display'}
          />
        </div>
        {isLive && (
          <div className="bg-white/30 rounded absolute top-0 right-0">
            <BoltIcon className="h-10 w-10 fill-emerald-400" />
          </div>
        )}
      </Link>
      <Link href={href}>
        <h3 className="mb-2 text-lg font-semibold dark:text-black">
          {projectTitle}
        </h3>
      </Link>

      <CopyButtonInput textToCopy={projectUrl} value={projectUrlSmall} />
    </div>
  );
};

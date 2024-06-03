'use client';
import { Select } from '@headlessui/react';
import { BoltIcon } from '@heroicons/react/20/solid';
import {
  CheckIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '../components/Toasts/ToastProvider';
import { ToastTypes } from '../components/Toasts/GenericToast';
import { FramerClientSDK } from '@framer/FramerServerSDK/client';
import { useRouter } from 'next/navigation';
import { PAGES } from '../lib/constants';
import Link from 'next/link';
import { useUser } from '../components/UserContext';

type TeamProject = {
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
      projectUrl: `https://www.framer.com/f${projectPath}`,
      projectUrlSmall: `/f${projectPath}`,
      imageSrc: p.rootFrame.imageUrl,
      projectTitle: p.title,
      memberCount: selectedTeam.userCount,
    } satisfies TeamProject;
  });

  return (
    <div className="">
      <div className="mb-8">
        <h2 className="py-2 text-3xl font-semibold">Create a Project</h2>
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
            className="border-slate-200 p-2 rounded-l data-[hover]:cursor-pointer focus:outline-none data-[active]:border-slate-800 data-[hover]:border-slate-800 data-[focus]:border-slate-800"
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

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [showCopied, setShowCopied] = useState(false);
  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => {
          setShowCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };
  return (
    <button
      className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
      onClick={handleCopy}
    >
      {showCopied ? (
        <CheckIcon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <ClipboardDocumentListIcon className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
};

const ProjectCard = ({
  isLive,
  imageSrc,
  projectUrl,
  projectUrlSmall,
  projectId,
  projectTitle,
}: TeamProject) => {
  const href = `${PAGES.FRAME_EDITOR}/${projectId}`;
  return (
    <div className="bg-slate-100 flex flex-col border p-4 rounded border-slate-300">
      <Link href={href} className="mb-1 relative flex grow items-center">
        <div className="w-full overflow-hidden">
          <Image src={imageSrc} alt="Display" width={600} height={600} />
        </div>
        {isLive && (
          <div className="bg-white/30 rounded absolute top-0 right-0">
            <BoltIcon className="h-10 w-10 fill-emerald-400" />
          </div>
        )}
      </Link>
      <Link href={href}>
        <h3 className="mb-2 text-lg font-semibold">{projectTitle}</h3>
      </Link>

      <div className="relative">
        <input
          disabled
          readOnly
          className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={projectUrlSmall}
        />
        <CopyButton textToCopy={projectUrl} />
      </div>
    </div>
  );
};

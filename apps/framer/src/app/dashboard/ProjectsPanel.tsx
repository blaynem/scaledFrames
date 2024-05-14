import { Select } from '@headlessui/react';
import { BoltIcon } from '@heroicons/react/20/solid';
import {
  CheckIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { TeamProject } from './page';
import Image from 'next/image';

export const ProjectsPanel = (props: {
  projects: TeamProject[];
  filter: {
    options: { value: string; label: string }[];
    selected: string;
    onChange: (newValue: string) => void;
  };
}) => {
  const onNewProjectClick = () => {
    // TODO: Probably a dropdown toast saying "Create a new project"
    //       Followed by a push to the new project page.
    console.log('New Project Clicked');
  };
  const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Filter Changed', e.target.value);
    props.filter.onChange(e.target.value);
  };

  return (
    <div className="px-8 py-12 column-1 col-span-5 sm:col-span-6">
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
            value={props.filter.selected}
            onChange={onFilterChange}
            style={{
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            className="border-slate-200 p-2 rounded-l data-[hover]:cursor-pointer focus:outline-none data-[active]:border-slate-800 data-[hover]:border-slate-800 data-[focus]:border-slate-800"
          >
            {props.filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {props.projects.map((project) => (
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
  const href = `/FrameEditor/${projectId}`;
  return (
    <div className="bg-slate-100 flex flex-col border p-4 rounded border-slate-300">
      <a href={href} className="mb-1 relative flex grow items-center">
        <div className="w-full overflow-hidden">
          <Image src={imageSrc} alt="Display" width={600} height={600} />
        </div>
        {isLive && (
          <div className="bg-white/30 rounded absolute top-0 right-0">
            <BoltIcon className="h-10 w-10 fill-emerald-400" />
          </div>
        )}
      </a>
      <a href={href}>
        <h3 className="mb-2 text-lg font-semibold">{projectTitle}</h3>
      </a>
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

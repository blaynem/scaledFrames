'use client';
import { useParams } from 'next/navigation';
import { useUser } from '../../../components/UserContext';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/TextArea';
import { createFramerUrl } from '@framer/FramerServerSDK';
import { CopyButtonInput } from '../../../components/ui/CopyButtonInput';
import Link from 'next/link';
import { PAGES } from '../../../lib/constants';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const DESCRIPTION = 'description';
const IS_PROJECT_LIVE = 'isProjectLive';
const NOTES = 'notes';
const CUSTOM_BASE_PATH = 'customBasePath';
const CUSTOM_FALLBACK_URL = 'customFallbackUrl';

export default function ProjectOverview() {
  const {
    selectedTeam,
    getProjectDataById,
    userPermissions,
    userRole,
    allowedFeatures,
  } = useUser();
  const { projectId } = useParams<{ projectId: string }>();
  const projectData = getProjectDataById(projectId);

  if (!selectedTeam || !projectData) {
    return null;
  }

  const isReadOnly = !userPermissions.canEditProject;

  console.log('projectData', projectData);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get values from form
    const formData = new FormData(e.currentTarget);
    const _isProjectLive = formData.get(IS_PROJECT_LIVE);
    const _description = formData.get(DESCRIPTION);
    const _notes = formData.get(NOTES);
    const _customBasePath = formData.get(CUSTOM_BASE_PATH);
    const _customFallbackUrl = formData.get(CUSTOM_FALLBACK_URL);

    console.log('formData', {
      isProjectLive: _isProjectLive,
      description: _description,
      notes: _notes,
      customBasePath: _customBasePath,
      customFallbackUrl: _customFallbackUrl,
    });

    // submit data
    console.log('submit', e);
  };

  console.log('allowedFeatures', allowedFeatures);
  console.log('userRole', userRole);
  console.log('userPermissions', userPermissions);

  const framerUrl = createFramerUrl({
    teamSubdomain: allowedFeatures.canHaveCustomSubdomain
      ? selectedTeam.customSubDomain
      : undefined,
    projectBasePath: projectData.customBasePath,
    framePath: projectData.rootFrame.path,
  });

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-3xl mb-8 font-bold text-gray-900 dark:text-white">
        {projectData.title}
      </h1>
      <div className="flex">
        <div className="p-8 flex-1 border-r-2 border-red-400">
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Share your Frame</h2>
            <div>
              <p>Share this link to your Frame</p>
              <CopyButtonInput value={framerUrl} textToCopy={framerUrl} />
            </div>
          </div>
          <form onSubmit={onSubmit}>
            <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* isProjectLive */}
              <div className="sm:col-span-full">
                <div className="flex items-center">
                  <label
                    htmlFor={IS_PROJECT_LIVE}
                    className="mr-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Is Project Live?
                  </label>
                  <input
                    disabled={isReadOnly}
                    readOnly={isReadOnly}
                    type="checkbox"
                    name={IS_PROJECT_LIVE}
                    id={IS_PROJECT_LIVE}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    defaultChecked={projectData.isProjectLive}
                  />
                </div>
                {!isReadOnly && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    If someone visits the Frame, should it be live?
                  </div>
                )}
              </div>

              {/* customBasePath */}
              <div className="sm:col-span-full">
                <Input
                  disabled={!allowedFeatures.canHaveCustomProjectPaths}
                  readOnly={isReadOnly}
                  labelText="Custom Base Path"
                  type="text"
                  name={CUSTOM_BASE_PATH}
                  id={CUSTOM_BASE_PATH}
                  placeholder="Enter custom base path"
                  defaultValue={projectData.customBasePath}
                />
                {!isReadOnly && !allowedFeatures.canHaveCustomProjectPaths && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Requires a subscription
                  </p>
                )}
              </div>

              {/* customFallbackUrl */}
              {/* <div className="sm:col-span-3">
                <Input
                  readOnly={isReadOnly}
                  labelText="Custom Fallback URL"
                  type="text"
                  name={CUSTOM_FALLBACK_URL}
                  id={CUSTOM_FALLBACK_URL}
                  placeholder="Enter custom fallback URL"
                  defaultValue={projectData.customFallbackUrl}
                />
              </div> */}

              {/* description */}
              <div className="col-span-full">
                <Textarea
                  readOnly={isReadOnly}
                  labelText="Description"
                  name={DESCRIPTION}
                  id={DESCRIPTION}
                  rows={3}
                  placeholder="Enter project description"
                  defaultValue={projectData.description}
                />
              </div>

              {/* notes */}
              <div className="col-span-full">
                <Textarea
                  readOnly={isReadOnly}
                  labelText="Notes"
                  name={NOTES}
                  id={NOTES}
                  rows={3}
                  placeholder="Enter project notes"
                  defaultValue={projectData.notes}
                />
              </div>
            </div>
            {!isReadOnly && (
              <button
                type="submit"
                className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            )}
          </form>
        </div>
        <div className="p-8 w-[400px]">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-xl font-semibold ">Edit Frame</h2>
            <Link href={PAGES.FRAME_EDITOR + '/' + projectData.id}>
              <PencilSquareIcon className="ml- h-8 w-8" />
            </Link>
          </div>
          <h2 className="text-xl font-semibold ">Preview</h2>
          <p className="">
            This is a preview of what your Project will look like when displayed
            on a supported application or website.
          </p>
          {/*TODO:  <p>Include button to edit the frame, to link the frame, etc</p> */}
        </div>
      </div>
    </div>
  );
}

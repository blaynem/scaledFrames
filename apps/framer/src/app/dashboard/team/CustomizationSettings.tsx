'use client';
import { useState } from 'react';
import { sectionWrapper, headerSection } from './page';

export const CustomizationSettings = (props: {
  defaultState: { teamName: string; subdomain: string };
}) => {
  const [{ teamName, subdomain }, setFormData] = useState(props.defaultState);
  const [showSaveChangesCustomization, setShowSaveChangesCustomization] =
    useState(false);

  const onCustomizationInputBlur = () => {
    if (
      teamName !== props.defaultState.teamName ||
      subdomain !== props.defaultState.subdomain
    ) {
      setShowSaveChangesCustomization(true);
    } else {
      setShowSaveChangesCustomization(false);
    }
  };

  const onSaveChanges = () => {
    window.alert('Save Changes');
  };
  return (
    <div className={sectionWrapper}>
      <h2 className={headerSection}>Customization</h2>
      <div className="mb-4">
        <label
          htmlFor="team-name-helper-text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Team Name
        </label>
        <input
          onBlur={onCustomizationInputBlur}
          value={teamName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, teamName: e.target.value }))
          }
          type="text"
          id="team-name-helper-text"
          aria-describedby="team-name-helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={props.defaultState.teamName}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="subdomain-helper-text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Custom Subdomain
        </label>
        <input
          value={subdomain}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subdomain: e.target.value }))
          }
          onBlur={onCustomizationInputBlur}
          type="text"
          id="subdomain-helper-text"
          aria-describedby="subdomain-helper-text-explanation"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={props.defaultState.subdomain}
        />
        <p
          id="subdomain-helper-text-explanation"
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          Create a custom subdomain for your team. Ex: <b>team-name</b>
          .framer.com
        </p>
      </div>
      {showSaveChangesCustomization && (
        <div className="flex justify-end">
          <button
            onClick={onSaveChanges}
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

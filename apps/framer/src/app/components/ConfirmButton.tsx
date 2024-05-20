import { useState } from 'react';

export const ConfirmButton = (props: {
  headerText: string;
  contentText: string;
  onConfirm: () => void;
  /**
   * Will be placed in the button
   */
  children?: JSX.Element;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const handleOnClick = () => {
    setOpen(!open);
  };
  return (
    <div className="relative">
      <button onClick={handleOnClick} type="button" className={props.className}>
        {props.children}
      </button>

      {open && (
        <div
          id="popover-click"
          role="tooltip"
          className="absolute top-8 left-0 -translate-x-1/2 z-10 inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {props.headerText}
            </h3>
          </div>
          <div className="px-3 py-2">
            <p>{props.contentText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

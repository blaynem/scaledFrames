import { useEffect } from 'react';

interface ModalProps {
  open?: boolean;
  headerText?: string;
  buttonText: string;
  contentText?: string;
  onClose: () => void;
  onConfirm: () => void;
  /**
   * Will override the contentText prop if provided.
   */
  children?: React.ReactNode;
}

export default function GeneralModal({
  open,
  onClose,
  onConfirm,
  headerText,
  buttonText,
  contentText,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!open) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed bg-gray-500/50 top-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full"
      onClick={handleOverlayClick}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            {headerText && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {headerText}
              </h3>
            )}
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {children || (
            <p className="p-4 md:p-5 text-gray-900 dark:text-white">
              {contentText}
            </p>
          )}
          <div className="pt-0 p-4 w-full flex justify-end">
            <button
              onClick={onConfirm}
              type="button"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

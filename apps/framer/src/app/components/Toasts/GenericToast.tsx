import {
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export enum ToastTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading',
}

export const GenericToast = (props: {
  type: ToastTypes;
  message: string;
  closeToast: () => void;
}) => {
  const getIcon = (type: ToastTypes) => {
    const _className = 'w-6';
    switch (type) {
      case 'success':
        return <CheckIcon className={_className} />;
      case 'error':
        return <XCircleIcon className={_className} />;
      case 'warning':
        return <ExclamationCircleIcon className={_className} />;
      case 'info':
        return <InformationCircleIcon className={_className} />;
      case 'loading':
        return (
          <svg
            className={`${_className} animate-spin`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (type: ToastTypes) => {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200';
      case 'info':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
      case 'loading':
        return 'text-black bg-white dark:bg-gray-800 dark:text-gray-400';
      default:
        return '';
    }
  };

  return (
    <div
      id={`toast-${props.type}`}
      className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div className={`mr-2 p-1 rounded-lg ${getColorClasses(props.type)}`}>
        {getIcon(props.type)}
      </div>
      <div className="text-sm font-normal">{props.message}</div>
      <button
        onClick={props.closeToast}
        type="button"
        className="ml-auto bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target={`#toast-${props.type}`}
        aria-label="Close"
      >
        <XMarkIcon className="w-4" />
      </button>
    </div>
  );
};

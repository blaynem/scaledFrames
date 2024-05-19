'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { GenericToast, ToastTypes } from './GenericToast';

type ToastContextType = {
  addToast: (
    type: ToastTypes,
    message: string,
    /**
     * Defaults to 3000ms. If 'infinite' is passed, the toast will not disappear unless manually closed.
     */
    time?: number | 'infinite'
  ) => {
    /**
     * Optionally clear the toast manually. Useful for toasts that are set to 'infinite' time, like loading spinners.
     * @returns
     */
    clearToast: () => void;
  };
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to use the toast context.
 * @returns
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

type ToastType = {
  id: string;
  type: ToastTypes;
  message: string;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback<ToastContextType['addToast']>(
    (type, message, time) => {
      const id = Date.now() + message;
      setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
      if (time != 'infinite') {
        setTimeout(() => {
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
          );
        }, time ?? 3000);
      }
      return {
        clearToast: () => {
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
          );
        },
      };
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="fixed z-10 right-4 top-4">
        {toasts.map((toast) => (
          <GenericToast
            closeToast={() => {
              setToasts((prevToasts) =>
                prevToasts.filter((t) => t.id !== toast.id)
              );
            }}
            key={toast.id}
            type={toast.type}
            message={toast.message}
          />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

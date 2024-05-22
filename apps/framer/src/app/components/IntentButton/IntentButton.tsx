import { Intents } from '@prisma/client';
import styles from './IntentButton.module.css';

/* eslint-disable-next-line */
export interface IntentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  intent: Intents;
}
export function IntentButton({ intent, ...props }: IntentButtonProps) {
  return (
    <button
      className={
        'flex bg-gray-200 items-center justify-center text-black h-12 w-12 rounded-lg flex-row grow flex-shrink-1 px-3 py-8 mt-3 mx-1 border-2 border-gray-300 '
      }
    >
      {intent ? intent.displayText : 'l bozo'}
    </button>
  );
}

export default IntentButton;

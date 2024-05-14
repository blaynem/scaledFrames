import { Intents } from '@prisma/client';
import styles from './IntentButton.module.css';

/* eslint-disable-next-line */
export interface IntentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  intent: Intents;
}
export function IntentButton({ intent, ...props }: IntentButtonProps) {
  return (
    <button className={styles['button']}>
      {intent ? intent.displayText : 'l bozo'}
    </button>
  );
}

export default IntentButton;

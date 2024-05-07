import { IntentTypes } from '../../lib/types';
import IntentButton, { IntentButtonProps } from './IntentButton';
import styles from './IntentContainer.module.css';

/* eslint-disable-next-line */
export interface IntentContainerProps {
  intents: IntentButtonProps[];
}

export function IntentContainer(props: IntentContainerProps) {
  return (
    <div className={styles['intentContainer']}>
      {props.intents.map((intent) => (
        <IntentButton key={intent.intentType} {...intent} />
      ))}
    </div>
  );
}

export default IntentContainer;

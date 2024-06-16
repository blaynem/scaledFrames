import { Intents } from '@prisma/client';
import IntentButton from './IntentButton';
import styles from './IntentContainer.module.css';

/* eslint-disable-next-line */
export interface IntentContainerProps {
  intents: Intents[];
}

export function IntentContainer(props: IntentContainerProps) {
  return (
    <div className={'flex flex-row justify-center items-center w-full p-4'}>
      {props.intents.map((intent) => (
        <IntentButton key={intent.id} intent={intent} />
      ))}
    </div>
  );
}

export default IntentContainer;

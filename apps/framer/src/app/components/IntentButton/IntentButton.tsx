import styles from './IntentButton.module.css';

/* eslint-disable-next-line */
export interface IntentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  intentType: string;
  text: string;
}

export function IntentButton(props: IntentButtonProps) {
  return (
    <div className={styles['container']}>
      <button className={styles['button']}>{props.text}</button>
    </div>
  );
}

export default IntentButton;

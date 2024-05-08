import styles from './IntentButton.module.css';

/* eslint-disable-next-line */
export interface IntentButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  intentType: string;
  text: string;
}

export function IntentButton(props: IntentButtonProps) {
  return <button className={styles['button']}>{props.text}</button>;
}

export default IntentButton;

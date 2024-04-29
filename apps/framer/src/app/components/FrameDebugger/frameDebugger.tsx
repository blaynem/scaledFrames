import styles from './frameDebugger.module.css';

/* eslint-disable-next-line */
export interface FrameDebuggerProps {}

export function FrameDebugger(props: FrameDebuggerProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FrameDebugger!</h1>
    </div>
  );
}

export default FrameDebugger;

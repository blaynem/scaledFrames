import styles from './framer-db.module.css';

/* eslint-disable-next-line */
export interface FramerDbProps {}

export function FramerDb(props: FramerDbProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FramerDb!</h1>
    </div>
  );
}

export default FramerDb;

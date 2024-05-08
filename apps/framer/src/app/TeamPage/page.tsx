import styles from './page.module.css';

/* eslint-disable-next-line */
export interface TeamPageProps {}

export default function TeamPage(props: TeamPageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TeamPage!</h1>
    </div>
  );
}

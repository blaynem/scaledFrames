import styles from './page.module.css';

/* eslint-disable-next-line */
export interface HomeProps {}

export default function Home(props: HomeProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Home!</h1>
    </div>
  );
}

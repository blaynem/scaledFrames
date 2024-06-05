import Header from '../../components/Header';
import styles from './Layout.module.css';

/* eslint-disable-next-line */
export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  return (
    <div className="">
      <Header />
      {props.children}
    </div>
  );
}

export default Layout;

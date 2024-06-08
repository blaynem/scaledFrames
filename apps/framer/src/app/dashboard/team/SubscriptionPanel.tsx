// import { useUser } from '../../components/UserContext';
import { sectionWrapper, headerSection } from './page';

export const SubscriptionPanel = () => {
  // const { userPermissions } = useUser();
  return (
    <div className={sectionWrapper}>
      <h2 className={headerSection}>Subscription</h2>
      <p>Subscriptions coming soon.</p>
    </div>
  );
};

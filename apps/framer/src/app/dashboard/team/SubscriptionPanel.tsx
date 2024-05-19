import { sectionWrapper, headerSection } from './page';

export const SubscriptionPanel = (props: { teamId: string }) => {
  return (
    <div className={sectionWrapper}>
      <h2 className={headerSection}>Subscription</h2>
      <p>See Subscription Details</p>
    </div>
  );
};

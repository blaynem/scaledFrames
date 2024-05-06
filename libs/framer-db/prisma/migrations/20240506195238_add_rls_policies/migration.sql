-- Enable Row Level Security
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPayment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserTeam" ENABLE ROW LEVEL SECURITY;
-- Tables with Read Only Access
ALTER TABLE "ActivityLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsumerKnownData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ErrorLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Frame" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Intents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IntentClickTracking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectAnalytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsumerSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPlan" ENABLE ROW LEVEL SECURITY;


-- Force Row Level Security for table owners
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPayment" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Team" FORCE ROW LEVEL SECURITY;
ALTER TABLE "TeamSubscription" FORCE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
ALTER TABLE "UserTeam" FORCE ROW LEVEL SECURITY;
-- Force Row Level Security for Read Only tables
ALTER TABLE "ActivityLog" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ConsumerKnownData" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ErrorLog" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Frame" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Intents" FORCE ROW LEVEL SECURITY;
ALTER TABLE "IntentClickTracking" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ProjectAnalytics" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ConsumerSession" FORCE ROW LEVEL SECURITY;
ALTER TABLE "SubscriptionPlan" FORCE ROW LEVEL SECURITY;

-- ----------Tables with Read Only permissions applied----------
CREATE POLICY activity_log_data_access ON "ActivityLog" FOR SELECT USING (true);
CREATE POLICY consumer_known_data_data_access ON "ConsumerKnownData" FOR SELECT USING (true);
CREATE POLICY error_log_data_access ON "ErrorLog" FOR SELECT USING (true);
CREATE POLICY frame_data_access ON "Frame" FOR SELECT USING (true);
CREATE POLICY intents_data_access ON "Intents" FOR SELECT USING (true);
CREATE POLICY intent_click_tracking_data_access ON "IntentClickTracking" FOR SELECT USING (true);
CREATE POLICY project_analytics_data_access ON "ProjectAnalytics" FOR SELECT USING (true);
CREATE POLICY consumer_session_data_access ON "ConsumerSession" FOR SELECT USING (true);
CREATE POLICY subscription_plan_data_access ON "SubscriptionPlan" FOR SELECT USING (true);


-- ------ UserTeam RLS POLICIES ------

-- View UserTeam data
CREATE POLICY user_team_data_access ON "UserTeam"
FOR SELECT
USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);

-- Edit UserTeam data
CREATE POLICY user_team_data_modification ON "Team"
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Team".id
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
))
WITH CHECK (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Team".id
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
));


-- ------ User RLS POLICIES ------

-- View user data
CREATE POLICY user_data_access ON "User"
FOR SELECT
USING (id = current_setting('app.current_user_id', TRUE)::uuid);

-- Modify user data
CREATE POLICY user_data_modification ON "User"
FOR UPDATE
USING (id = current_setting('app.current_user_id', TRUE)::uuid)
WITH CHECK (id = current_setting('app.current_user_id', TRUE)::uuid);



-- ------ Team RLS POLICIES ------

-- View team data
CREATE POLICY team_data_access ON "Team"
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Team".id
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
));

-- Modify team data
CREATE POLICY team_data_modification ON "Team"
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Team".id
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
))
WITH CHECK (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Team".id
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
));


-- ------ Project RLS POLICIES ------

-- View Project data for team members
CREATE POLICY project_data_access ON "Project"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "UserTeam"
        WHERE "UserTeam"."teamId" = "Project"."teamId"
        AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
    )
);

-- Modify Project data for team members
CREATE POLICY project_data_modification ON "Project"
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Project"."teamId"
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
))
WITH CHECK (EXISTS (
  SELECT 1 FROM "UserTeam"
  WHERE "UserTeam"."teamId" = "Project"."teamId"
    AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
));


-- ------ TeamSubscription RLS POLICIES ------

-- View TeamSubscription data for team members
CREATE POLICY team_subscription_data_access ON "TeamSubscription"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "Team"
        JOIN "UserTeam" ON "UserTeam"."teamId" = "Team".id
        WHERE "Team"."subscriptionId" = "TeamSubscription".id
        AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
    )
);


-- ------ SubscriptionPayment RLS POLICIES ------

-- View SubscriptionPayment data for team members
CREATE POLICY subscription_payment_data_access ON "SubscriptionPayment"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "TeamSubscription"
    JOIN "Team" ON "Team"."subscriptionId" = "TeamSubscription".id
    JOIN "UserTeam" ON "UserTeam"."teamId" = "Team".id
    WHERE "SubscriptionPayment"."teamSubscriptionId" = "TeamSubscription".id
      AND "UserTeam"."userId" = current_setting('app.current_user_id', TRUE)::uuid
  )
);

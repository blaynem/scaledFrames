--- Enabling RLS for all tables we have added

alter table "User" enable row level security;
alter table "Team" enable row level security;
alter table "UserTeam" enable row level security;
alter table "Project" enable row level security;
alter table "Frame" enable row level security;
alter table "Intents" enable row level security;
alter table "TeamSubscription" enable row level security;
alter table "SubscriptionPlan" enable row level security;
alter table "SubscriptionPayment" enable row level security;
alter table "ActivityLog" enable row level security;
alter table "ErrorLog" enable row level security;
alter table "ProjectAnalytics" enable row level security;
alter table "ConsumerSession" enable row level security;
alter table "IntentClickTracking" enable row level security;
alter table "ConsumerKnownData" enable row level security;
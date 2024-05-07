# To run the server

Nx Console or this bash command.
```bash
nx run framer-server:serve:dev
```

Verify:
- That frames work as expected when interacted with in the local frog dev env.

Needed DB things

- a way to save images for frames
- callback for payment processing for analytics (for consumers of frames)

User Endpoints
- DELETE /users/:userId - Soft delete a user.

Team Endpoints
- Get all teams a user is a part of
- POST /teams - Create a new team.
- GET /teams/:teamId - Get details of a specific team.
    - includes their subscription plan
- PUT /teams/:teamId - Update team details.
- DELETE /teams/:teamId - Soft delete a team.
- POST /teams/invite - Invite a user to a team.

Project Endpoints
- Some way to verify that every intent has a corresponding frame.
- DELETE /projects/:projectId - Soft delete a project.

Frame Endpoints
- Add and edit intents
- DELETE /frames/:frameId - Soft delete a frame.

Subscription Endpoints
- GET /plans - Get all available subscriptions.
- GET /subscriptions - Get all subscriptions for a team.
- POST /subscriptions - Edit the users subscription.
- GET /payments - Get all payments for a team.

Analytics Endpoints
- GET /projects/:projectId/analytics - Retrieve analytics for a specific - project.
- POST /sessions - Start a new session for a project.
- POST /intents/clicks - Record a click on an intent.
# To run the server

Nx Console or this bash command.
```bash
nx run framer-server:serve:dev
```

Want to verify the frame is working as expected? Run ngrok then visit https://warpcast.com/~/developers/frames.
Pass in the url like so `https://53c3-50-39-160-155.ngrok-free.app/frames/{projectName}/{frameName}`.


Needed DB things

- Add RLS so supabase client can't touch anything it's not supposed to.

- a way to save images for frames
    - Need 2 sub folders, one for the public images, and one for the private images.
    - the public image folder will be used for the frame preview.
    - the private image folder will be used for the frame editor, when the user uploads an image.
    - it will get switched to the public folder when the frame is published.
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
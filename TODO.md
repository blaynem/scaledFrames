Setting up Domain and email and all things associated with it
- Stripe for payments (pobably yeah)
- Set up development test for stripe
- How to deal with cancellations or reduction in subscription level or changes in team size?
- SSL Cert - https://zerossl.com/


# Before Release
- Need a way to save intents to a frame. Right now they are never able to be edited.
    - "How does the client want to handle this?"
        - We likely want to save them all at one time. So rather than create a separate endpoint, we can edit the frames endpoint to accept intents as well.
- We need a way to edit Project details.
- Do we add a Create a Project "From a template" option?
- What if when a user was created, we did NOT automatically add the Project for them?
- Maybe we just write a "how to" guide
    - It would be nice if this was a modal that could be opened from the frame editor page that explained what fields were and how to use them?
- `path` in the freameEditor should be under like "advanced settings"
- `intents` should be called "buttons" or "actions" for user
- write about "compatible platforms" like warpcast, etc.


# After Release
- Add requestIds to all things in the server so its easier to track things down!
- Teams Page
    - edit subscription
- Actual paid subs

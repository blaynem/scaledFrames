# FramerServerSDK

We export both a Client SDK and Server methods.

- [Server Methods](#server-methods)
- [Client SDK](#client-sdk)


## Server Methods

The exported Server methods are used for an entire flow in a single Prisma `transaction`. This is useful for when we need to ensure that all the queries are executed in a single go, or none are executed at all. An example would be for the user signup, we must go through a few steps. Creating a user, creating a team, adding the user to the team, and creating a project. If any of these steps fail, we need to rollback all the changes.

They also return a nice object with either the data or the error.

## TODO:

- Ensure uniqueness of a project / frame path on create / edit.

## Client SDK

The Client SDK is a wrapper around the Framer API so we don't have to deal with writing the fetch / to JSON boilerplate, or write the queries manually. Just supply an object with the query parameters and it will return the data.

```ts
import { FrameServerSDK } from './libs/FramerServerSDK/src';

const test = FrameServerSDK();
const usersDataGet = await test.users.get({ id: 'clvot3cwo0000k91qkbwyp536' });
console.log('---usersDataGet', usersDataGet);

const projectsDataGet = await test.projects.get({ isProjectLive: false });
console.log('---projectsDataGet', projectsDataGet);

const projectDataGet = await test.projects.getById('clvotpod30002cojiyt3955dt');
console.log('---projectDataGet', projectDataGet);

const projectDataCreate = await test.projects.create({
  teamId: 'clvot3cwy0001k91qdk921sao',
  userId: 'clvot3cwo0000k91qkbwyp536',
  title: 'A 3rd new project',
  notes: 'Wowie notes',
  description: 'Noep',
});
console.log('---projectDataCreate', projectDataCreate);

const projectDataEdit = await test.projects.edit('clvotpod30002cojiyt3955dt', {
  teamId: 'clvot3cwy0001k91qdk921sao',
  userId: 'clvot3cwo0000k91qkbwyp536',
  title: 'Test Project Edited2',
  notes: 'Test Notes Edited2',
  description: 'Test Description Edited2',
  isProjectLive: true,
});
console.log('---projectDataEdit', projectDataEdit);
```

## Building

Run `nx build FramerServerSDK` to build the library.

## Running unit tests

Run `nx test FramerServerSDK` to execute the unit tests via [Jest](https://jestjs.io).


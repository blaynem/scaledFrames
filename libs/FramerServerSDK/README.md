# FramerServerSDK

## How to use

It's basically just a wrapper around the Framer API so we don't have to deal with writing the fetch / to JSON boilerplate.

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


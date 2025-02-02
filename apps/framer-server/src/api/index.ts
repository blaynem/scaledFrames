import { Frog } from 'frog';
import userInstance from './user';
import usersInstance from './users';
import projectsFrogInstance from './projects';
import frameFrogInstance from './frame';
import teamsFrogInstance from './teams';

// In order to add a route, we can just instantiate a new Frog instance and call the api method with the route and handler.
// Then we export it, and attach it to the main instance inside framer-server/src/index.tsx. ex: frogApp.route('/api', blahRoute);
// This will then set the api route to be /api and the handler to be the blahRoute handler, which in this case makes `/api/home`
const api = new Frog({
    title: "What's a title?",
    origin: process.env.NEXT_PUBLIC_CLIENT_URL, 
    verifyOrigin: false
  });

api.route('/user', userInstance);
api.route('/users', usersInstance);
api.route('/projects', projectsFrogInstance);
api.route('/frames', frameFrogInstance);
api.route('/teams', teamsFrogInstance);

export default api;

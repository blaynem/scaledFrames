import { Frog } from 'frog';
import usersInstance from './users';
import projectsFrogInstance from './projects';
import frameFrogInstance from './frame';

// In order to add a route, we can just instantiate a new Frog instance and call the api method with the route and handler.
// Then we export it, and attach it to the main instance inside framer-server/src/index.tsx. ex: frogApp.route('/api', blahRoute);
// This will then set the api route to be /api and the handler to be the blahRoute handler, which in this case makes `/api/home`
const api = new Frog();

api.route('/users', usersInstance);
api.route('/projects', projectsFrogInstance);
api.route('/frames', frameFrogInstance);

export default api;

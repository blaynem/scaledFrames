import { Frog } from 'frog';
import homeRoute from './routes/home';

const routeApp = new Frog();

routeApp.frame(homeRoute.route, homeRoute.handler);

export default routeApp;

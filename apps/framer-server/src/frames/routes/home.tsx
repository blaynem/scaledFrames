import { Button, FrameHandler } from 'frog';
import { RoutedFrames } from '../types';
import { TARGET_ROUTES } from '../constants';

const baseRouteFrame: FrameHandler = async (frameContext) => {
  return frameContext.res({
    image: <div>Testing</div>,
    intents: [<Button action="/startGame">Start Gamzzzze</Button>],
  });
};

const homeRoute: RoutedFrames = {
  route: TARGET_ROUTES.HOME,
  handler: baseRouteFrame,
};

export default homeRoute;

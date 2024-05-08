import { IntentType, Intents } from '@prisma/client';
import { Button, FrameIntent } from 'frog';

export const getFrameIntents = (
  basePath: string,
  frameIntents: Intents[]
): FrameIntent[] => {
  const sorted = frameIntents.sort((a, b) => a.displayOrder - b.displayOrder);

  const _returnIntents: FrameIntent[] = sorted.map((intent) => {
    if (intent.type === IntentType.InternalLink) {
      return internalLink(basePath, intent);
    }
    if (intent.type === IntentType.ExternalLink) {
      return externalLink(intent);
    }
  });

  return _returnIntents;
};

const internalLink = (basePath: string, intent: Intents): FrameIntent => {
  const path = `${basePath}${intent.linkUrl}`;
  return (
    <Button action={path} value={intent.id}>
      {intent.displayText}
    </Button>
  );
};

// We consider all External links as Redirects, that way they post data back to the server before we redirect them.
const externalLink = (intent: Intents): FrameIntent => {
  return (
    <Button.Redirect location={intent.linkUrl}>
      {intent.displayText}
    </Button.Redirect>
  );
};

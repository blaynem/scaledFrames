import { IntentType, Intents } from '@prisma/client';
import { Button, FrameIntent } from 'frog';

export const getFrameIntents = (frameIntents: Intents[]): FrameIntent[] => {
  const sorted = frameIntents.sort((a, b) => a.displayOrder - b.displayOrder);
  const _returnIntents: FrameIntent[] = [];

  for (const intent of sorted) {
    if (intent.type === IntentType.InternalLink) {
      _returnIntents.push(internalLink(intent));
      break;
    }
    if (intent.type === IntentType.ExternalLink) {
      _returnIntents.push(externalLink(intent));
      break;
    }
  }

  return _returnIntents;
};

const internalLink = (intent: Intents): FrameIntent => {
  return (
    <Button action={intent.linkUrl} value={intent.id}>
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

import { render } from '@testing-library/react';

import IntentButton from './IntentButton';

describe('IntentButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IntentButton />);
    expect(baseElement).toBeTruthy();
  });
});

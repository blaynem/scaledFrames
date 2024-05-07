import { render } from '@testing-library/react';

import IntentContainer from './IntentContainer';

describe('IntentContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IntentContainer />);
    expect(baseElement).toBeTruthy();
  });
});

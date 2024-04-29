import { render } from '@testing-library/react';

import FramerDb from './framer-db';

describe('FramerDb', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FramerDb />);
    expect(baseElement).toBeTruthy();
  });
});

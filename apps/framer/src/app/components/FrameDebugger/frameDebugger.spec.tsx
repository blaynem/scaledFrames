import { render } from '@testing-library/react';

import FrameDebugger from './frameDebugger';

describe('FrameDebugger', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrameDebugger />);
    expect(baseElement).toBeTruthy();
  });
});

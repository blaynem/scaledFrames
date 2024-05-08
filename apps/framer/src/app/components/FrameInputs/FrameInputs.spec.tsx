import { render } from '@testing-library/react';

import FrameInputs from './FrameInputs';

describe('FrameInputs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrameInputs />);
    expect(baseElement).toBeTruthy();
  });
});

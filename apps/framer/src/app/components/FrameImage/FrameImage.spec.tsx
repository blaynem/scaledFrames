import { render } from '@testing-library/react';

import FrameImage from './FrameImage';

describe('FrameImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FrameImage />);
    expect(baseElement).toBeTruthy();
  });
});

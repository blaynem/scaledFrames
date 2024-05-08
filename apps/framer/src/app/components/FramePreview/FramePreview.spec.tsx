import { render } from '@testing-library/react';

import FramePreview from './FramePreview';

describe('FramePreview', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FramePreview />);
    expect(baseElement).toBeTruthy();
  });
});

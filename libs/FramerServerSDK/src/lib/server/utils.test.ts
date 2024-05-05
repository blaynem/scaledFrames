import { ParsedFrameUrl, parseFramerUrl } from './utils';

describe('parseFramerUrl', () => {
  it('should parse a Framer URL correctly', () => {
    // Example Usage
    const testUrl1 = parseFramerUrl(
      'https://nike.framer.com/frames/epic-project/some-frame'
    );
    const expectedTest1: ParsedFrameUrl = {
      teamSubdomain: 'nike',
      projectBasePath: '/epic-project',
      framePath: '/some-frame',
      isLocalhost: false,
    };

    const testUrl2 = parseFramerUrl(
      'https://adidas.framer.com/frames/project-x/new-launch/2024/model-z'
    );
    const expectedTest2: ParsedFrameUrl = {
      teamSubdomain: 'adidas',
      projectBasePath: '/project-x',
      framePath: '/new-launch/2024/model-z',
      isLocalhost: false,
    };

    const testUrl3 = parseFramerUrl(
      'http://localhost:3000/frames/demo-project/sample-frame'
    );
    const expectedTest3: ParsedFrameUrl = {
      teamSubdomain: 'localhost',
      projectBasePath: '/demo-project',
      framePath: '/sample-frame',
      isLocalhost: true,
    };

    const testUrl4 = parseFramerUrl(
      'https://reebok.framer.com/frames/alpha-release/beta-version?version=1.2'
    );
    const expectedTest4: ParsedFrameUrl = {
      teamSubdomain: 'reebok',
      projectBasePath: '/alpha-release',
      framePath: '/beta-version',
      isLocalhost: false,
    };

    const testUrl5 = parseFramerUrl(
      'https://www.framer.com/frames/myProject/myFrame'
    );
    const expectedTest5: ParsedFrameUrl = {
      teamSubdomain: 'www',
      projectBasePath: '/myProject',
      framePath: '/myFrame',
      isLocalhost: false,
    };

    const testUrl6 = parseFramerUrl(
      'https://framer.com/frames/myProject/myFrame'
    );
    const expectedTest6: ParsedFrameUrl = {
      teamSubdomain: 'framer',
      projectBasePath: '/myProject',
      framePath: '/myFrame',
      isLocalhost: false,
    };

    expect(testUrl1).toEqual(expectedTest1);
    expect(testUrl2).toEqual(expectedTest2);
    expect(testUrl3).toEqual(expectedTest3);
    expect(testUrl4).toEqual(expectedTest4);
    expect(testUrl5).toEqual(expectedTest5);
    expect(testUrl6).toEqual(expectedTest6);
  });
});

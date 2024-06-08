import { APP_NAME, FRAMES_SERVER_BASE_PATH } from './constants';
import { ParsedFrameUrl, convertToUrlSafe, parseFramerUrl } from './utils';

describe('parseFramerUrl', () => {
  it('should parse a Framer URL correctly', () => {
    // Example Usage
    const _testUrl1 = `https://nike.${APP_NAME}.com${FRAMES_SERVER_BASE_PATH}/epic-project/some-frame`;
    const testUrl1 = parseFramerUrl(_testUrl1);
    const expectedTest1: ParsedFrameUrl = {
      teamSubdomain: 'nike',
      projectBasePath: '/epic-project',
      framePath: '/some-frame',
      isLocalhost: false,
      url: _testUrl1,
    };

    const _testUrl2 = `https://adidas.${APP_NAME}.com${FRAMES_SERVER_BASE_PATH}/project-x/new-launch/2024/model-z`;
    const testUrl2 = parseFramerUrl(_testUrl2);
    const expectedTest2: ParsedFrameUrl = {
      teamSubdomain: 'adidas',
      projectBasePath: '/project-x',
      framePath: '/new-launch/2024/model-z',
      isLocalhost: false,
      url: _testUrl2,
    };

    const _testUrl3 = `http://localhost:3000${FRAMES_SERVER_BASE_PATH}/demo-project/sample-frame`;
    const testUrl3 = parseFramerUrl(_testUrl3);
    const expectedTest3: ParsedFrameUrl = {
      teamSubdomain: 'localhost',
      projectBasePath: '/demo-project',
      framePath: '/sample-frame',
      isLocalhost: true,
      url: _testUrl3,
    };

    const _testUrl4 = `https://reebok.${APP_NAME}.com${FRAMES_SERVER_BASE_PATH}/alpha-release/beta-version?version=1.2`;
    const testUrl4 = parseFramerUrl(_testUrl4);
    const expectedTest4: ParsedFrameUrl = {
      teamSubdomain: 'reebok',
      projectBasePath: '/alpha-release',
      framePath: '/beta-version',
      isLocalhost: false,
      url: _testUrl4,
    };

    const _testUrl5 = `https://www.${APP_NAME}.com${FRAMES_SERVER_BASE_PATH}/myProject/myFrame`;
    const testUrl5 = parseFramerUrl(_testUrl5);
    const expectedTest5: ParsedFrameUrl = {
      teamSubdomain: 'www',
      projectBasePath: '/myProject',
      framePath: '/myFrame',
      isLocalhost: false,
      url: _testUrl5,
    };

    const _testUrl6 = `https://${APP_NAME}.com${FRAMES_SERVER_BASE_PATH}/myProject/myFrame`;
    const testUrl6 = parseFramerUrl(_testUrl6);
    const expectedTest6: ParsedFrameUrl = {
      teamSubdomain: APP_NAME,
      projectBasePath: '/myProject',
      framePath: '/myFrame',
      isLocalhost: false,
      url: _testUrl6,
    };

    expect(testUrl1).toEqual(expectedTest1);
    expect(testUrl2).toEqual(expectedTest2);
    expect(testUrl3).toEqual(expectedTest3);
    expect(testUrl4).toEqual(expectedTest4);
    expect(testUrl5).toEqual(expectedTest5);
    expect(testUrl6).toEqual(expectedTest6);
  });
  it('convertToUrlSafe works as expected', () => {
    expect(convertToUrlSafe('Hello World')).toBe('hello-world');
    expect(convertToUrlSafe('/9ec522//')).toBe('9ec522');
    expect(convertToUrlSafe('/9ec522/+-=12#49(08/')).toBe('9ec522-124908');
  });
});

import { remote } from 'webdriverio';

export const getMobileClient = async () => {
    // 1. 서버 및 접속 설정
    const options = {
        hostname: '127.0.0.1',
        port: 4723,
        path: '/',        // Appium 2.x는 기본이 '/' 입니다. 에러 나면 여기 확인!
        protocol: 'http',
        capabilities: {
            'platformName': 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'RFCM9096PKN',
            'appium:appPackage': 'com.cjoshppingphone',
            // 'appium:appActivity': 'com.cjoshppingphone.cjmall.init.activity.lnit',
            'appium:noReset': true,
            'appium:ensureWebviewsHavePages': true,
            'appium:nativeWebScreenshot': true,
            'appium:forceAppLaunch': true, // <-- 이 줄을 추가하세요! 앱이 켜져 있어도 다시 켭니다.
            'appium:shouldTerminateApp': true, // 세션 시작 시 기존 앱 종료 여부
            'appium:newCommandTimeout': 3600,
            'appium:setWebContentsDebuggingEnabled': true // 아주 중요!
        }
    };

    // 2. 원격 세션 시작
    return await remote(options);
};

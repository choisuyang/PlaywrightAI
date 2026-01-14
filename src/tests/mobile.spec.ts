// src/scenarios/TC_MobileOpen.ts
import { test } from '@playwright/test';
import { getMobileClient } from '../lib/mobileClient';

test('모바일 앱 열고 대기', async () => {
    // 1. WebdriverIO: 휴대폰 앱 실행
    const app = await getMobileClient();
    console.log('앱 실행 중...');

    // 2. 앱이 열렸는지 간단히 확인
    // (이 과정이 없어도 앱은 켜지지만, 안정성을 위해 요소 하나는 체크하는 것이 좋습니다)
    console.log('앱이 켜졌습니다. 이제 대기 상태로 들어갑니다.');

    const closeBtn = await app.$('id:com.cjoshppingphone:id/close');
    
    // 요소가 나타날 때까지 최대 10초 대기
    await closeBtn.waitForDisplayed({ timeout: 10000 });
    
    // 클릭
    await closeBtn.click();
    
    console.log('닫기 버튼 클릭 완료');

    // '편성표'라는 텍스트를 가진 요소 중 두 번째(인덱스 1) 요소를 선택
    const scheduleBtn = await app.$('android=new UiSelector().text("편성표").instance(1)');

    // 요소가 보일 때까지 대기 후 클릭합니다.
    await scheduleBtn.waitForDisplayed({ timeout: 5000 });
    await scheduleBtn.click();

    const purchaseBtn = await app.$('android=new UiSelector().text("구매하기")')
    await purchaseBtn.waitForDisplayed({ timeout: 9000 });
    await purchaseBtn.click();

   console.log('⏳ 10초 대기 중...');
await app.pause(10000);

await app.performActions([
    {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
            // 1. 해당 좌표로 즉시 이동 (duration: 0)
            { type: 'pointerMove', duration: 0, x: 840, y: 2183 },
            // 2. 손가락 누르기
            { type: 'pointerDown', button: 0 },
            // 3. 0.1초 동안 누른 상태 유지 (동작 안정성 확보)
            { type: 'pause', duration: 100 }, 
            // 4. 손가락 떼기
            { type: 'pointerUp', button: 0 },
        ],
    },
]);

    console.log('✅ 좌표 [840, 2183] 터치 완료');
    // 3. 무한 대기 (약 1시간 동안 세션을 유지하며 대기)
    // 숫자를 크게 주어 자동으로 꺼지지 않게 합니다.
    await app.pause(100000);
    
    

    // 주의: 테스트를 완전히 강제 종료(Ctrl+C)하기 전까지는 아래 deleteSession이 실행되지 않습니다.
    await app.deleteSession();
});


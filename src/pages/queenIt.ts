import { Page, expect } from '@playwright/test';
import { exec } from 'node:child_process';

export const queenit = (page: Page) => ({

    // 메인 페이지로 이동
    async navigate() {
        await page.goto('https://web.queenit.kr/home/RECOMMENDATION');
    },

    // 타이틀 로고
    async getTitleLogo(keyword: string) {
        const logoButton = page.locator('button').filter({ has: page.locator('img') }).first();
        console.log('타이틀 로고 확인 ===>', keyword)
        // 해당 버튼의 aria-label 속성이 "퀸잇 로고"인지 확인
        await expect(logoButton).toHaveAttribute('aria-label', keyword);
    },

    // 검색 버튼 클릭
    async clickSearchButton() {
        await page.getByRole('button', { name: '검색' }).click();
    },
    
    // 검색어 입력
    async enterSearchKeyword(keyword: string) {
        const searchBox = await page.locator('.MuiInputBase-input');
        await searchBox.click();
        await searchBox.fill(keyword);
    },

    // 검색 조회 버튼 선택
    async clickSearchSubmit() {
        await page.locator('//*[@id="__next"]/div/div/div[1]/div/a[2]').click();
    },

    // 검색 결과 버튼 선택
    async selectProduct() {
        await page.locator('a').filter({ hasText: 'SET도토리기프트지그재그기모양말 5' }).click();
    },

    // 구매 버튼 클릭
    async clickBuyNow() {
        await page.getByRole('button', { name: '구매하기' }).waitFor({ state: 'visible' });
        await page.getByRole('button', { name: '구매하기' }).click({delay: 5000});
    },

    // 바로 구매 버튼 클릭
    async clickBuyImmediately() {
       const purchaseButton = page.locator('#option-purchase-button');

    // 버튼이 보일 때까지 대기
    await purchaseButton.waitFor({ state: 'visible' });

    // 브라우저 내부에서 클릭 이벤트를 강제로 발생시킴 (JS 리스너 강제 트리거)
    await purchaseButton.dispatchEvent('click');
    },

    // 주문서페이지에서 주문하기 타이틀 확인
    async verifyOrderTitle(keyword: string) {
        const orderButton = page.locator('.MuiTypography-root', { hasText: '주문하기' });

        // 1. 요소가 화면에 나타날 때까지 대기 (기본 30초, 필요시 timeout 설정 가능)
        await orderButton.waitFor({ state: 'visible', timeout: 5000 });

        // 2. 나타난 후 텍스트 검증
        await expect(orderButton).toHaveText(keyword);
        
    },

    // 남성 카테고리 클릭
    async clickCategoryMen() {
        await page.locator('a').nth(6).click();
        // await page.getByRole('link', { name: '남성', exact: true }).click();
    },

    // 베스트 상품 첫번째 상품 선택 
    async selectBestProduct() {
        const bestItem = page.locator('#categoryBest [data-click-log="Root"]').first();
        await bestItem.click();
    },

    // 다중 옵션 선택
    async selectMultipleOptions() {
        // 기준이 되는 부모 요소 정의
        const waitModal = page.locator('xpath=//*[contains(@class, "MuiModal-root")]').waitFor({ state: 'visible', timeout: 5000 });
        await waitModal;

        const parentContainer = page.locator('xpath=//*[contains(@class, "MuiModal-root")]/div/div/div/div/div/div[1]');

        // 하위 직계 div의 개수 가져오기
        const divCount = await parentContainer.locator('> div').count();

        console.log(`현재 하위 div 개수: ${divCount}`);

        // 개수에 따른 조건 처리
        if (divCount === 2) {
        console.log("옵션이 2개입니다.");
            this.selectFirstOption(2);
        } else if (divCount === 3) {
        console.log("옵션이 3개입니다.");
        }
    },

    async selectFirstOption(num: number) {
        // 첫 번째 옵션 요소 선택

    
       // 1. 부모(.css-1ovmfyv) 안에서 data-click-log가 'HStack'인 요소를 찾습니다.
        const firstOption = page.locator('.css-1ovmfyv [data-click-log="HStack"]').first();

        // 2. 요소가 나타날 때까지 대기
        await firstOption.waitFor({ state: 'visible' });

        // 3. JS로 직접 클릭 실행 (가장 확실한 방법)
        // await firstOption.evaluate(el => el.click());
        // 브라우저 내부에서 클릭 이벤트를 강제로 발생시킴 (JS 리스너 강제 트리거)
        await firstOption.dispatchEvent('click');

        const secondOptionList = page.locator('.css-1ovmfyv [data-click-log="HStack"]').first();

        // 버튼이 보일 때까지 대기
        await secondOptionList.waitFor({ state: 'visible' });
        
        // 브라우저 내부에서 클릭 이벤트를 강제로 발생시킴 (JS 리스너 강제 트리거)
        await secondOptionList.dispatchEvent('click');
        

    },

    // 최대 할인 off 선택
    async selectMaxDiscountOff() {
        await page.locator('xpath=//*[@class="ant-switch-inner"]').click({delay: 5000});
    },    

    // 주문서내 최종 결제 버튼
    async clickFinalPayment() {
        await page.locator('#order-purchase-button').waitFor({ state: 'visible' });
        await page.locator('#order-purchase-button').click({delay: 5000});
    },

    // 팝업 거절 버튼 선택
    async clickPopupReject() {
        const rejectButton = page.locator('.css-1a4ftm5');

        // 버튼이 보일 때까지 대기
        await rejectButton.waitFor({ state: 'visible' });

        // 브라우저 내부에서 클릭 이벤트를 강제로 발생시킴 (JS 리스너 강제 트리거)
        await rejectButton.dispatchEvent('click');
    },

    // 주문서내 최종 결제 버튼 and 무통장 결제
    async clickFinalPayment2() {
        
        // 1. 주문서내 최종 결제 버튼 클릭
        await page.locator('#order-purchase-button').waitFor({ state: 'visible' });
        await page.locator('#order-purchase-button').click({delay: 5000});
        
        // 2. 타이틀 확인
        const title = await page.locator('//*[@id="content"]/div[1]/ul/li[1]').textContent();
        console.log('팝업 창 타이틀 ===>', title);

        // // 3. 전체동의 버튼 선택
        await page.locator('#chk_all').dispatchEvent('click');

        // 1. 해당 요소로 마우스를 이동 (Hover) - 중요!
        // await allCheckLabel.hover();

        // 2. 물리적 클릭 시도 (force: true를 주면 겹쳐있는 요소가 있어도 강제로 누름)
        // await allCheckLabel.click({ force: true });

        // 3. 하위 체크박스들이 변할 때까지 아주 잠깐 대기
        await page.waitForTimeout(500);
        
        // 4. 무통장 입금 은행 선택
        const bankSelect = page.locator('#select_bank');

        // // select 박스가 보일 때까지 대기
        await bankSelect.waitFor({ state: 'visible', timeout: 10000 });

        // // 국민은행 선택 (value 사용)
        await bankSelect.selectOption('BK04');

        // // 선택이 잘 되었는지 확인 (선택 사항)
        const selectedValue = await bankSelect.inputValue();
        console.log('선택된 은행 코드:', selectedValue); // BK04 출력 확인

        // // 5. 현금연수증 미발행 선택
        const noReceipt = page.locator('#tr_code_option'); // id가 있으면 xpath보다 id가 훨씬 빠릅니다.

        // // 요소가 나타날 때까지 대기
        await noReceipt.waitFor({ state: 'visible', timeout: 10000 });

        // // 텍스트로 선택 (이미 noReceipt에서 대상을 정했으므로 내부 인자에는 선택값만 넣습니다)
        await noReceipt.selectOption({ label: '현금영수증 미발행' });

        // 확인용 (정상적으로 선택되었는지 텍스트 확인)
        console.log('현금영수증 설정 완료');

        // // 6. PG 결제하기 버튼 클릭
        await page.locator('.btn_prev').waitFor({ state: 'visible' });
        await page.locator('.btn_prev').click({delay: 5000});

    },

    // 괜찮아요 팝업 종료
    async closeOkayPopup() {
        // 1. 텍스트를 기준으로 요소를 정의합니다.
        const webViewButton = page.getByText('괜찮아요, 웹으로 볼게요');

        // 2. 요소가 실제로 존재하는지(Visible) 확인합니다.
        if (await webViewButton.isVisible()) {
            // 3. 요소가 있다면 클릭합니다. 
            // 결제창 특성상 일반 click이 안 먹힐 수 있으므로 dispatchEvent를 사용합니다.
            await webViewButton.dispatchEvent('click');
            console.log('앱 유도 버튼을 클릭하여 웹 뷰를 유지합니다.');
            
            // 클릭 후 팝업이 사라질 때까지 아주 잠깐 대기 (네트워크 상태 고려)
            await page.waitForTimeout(500); 
        } else {
            console.log('앱 유도 팝업이 나타나지 않아 다음 단계를 진행합니다.');
        }
    },

    // 주문완료 페이지 확인
    async verifyOrderComplete() {
        // 1. "주문 완료" 텍스트가 포함된 요소를 찾습니다.
        const orderCompleteTitle = page.locator('.MuiTypography-root', { hasText: '주문 완료' }).first();

        // 2. 해당 요소가 나타날 때까지 기다리면서(최대 30초), 텍스트가 정확한지 검증합니다.
        // toBeVisible()과 toHaveText()를 조합하면 매우 안정적입니다.
        await expect(orderCompleteTitle).toBeVisible({ timeout: 30000 });
        await expect(orderCompleteTitle).toHaveText('주문 완료');

        console.log('✅ 테스트 성공: 주문 완료 확인되었습니다.');
    },

    // 골프 카테고리 선택
    async clickCategoryGolf() {
        const golfCategory = await page.locator('.css-8j52bx', { hasText: '골프' }).first();

        await golfCategory.waitFor({ state: 'visible' });
        await golfCategory.click();
    },

    // 골프 타이틀 확인
    async verifyGolfTitle(keyword: string) {
        await expect(page.locator('.MuiTypography-root .css-3i62ga')).toHaveText('신발');
    }


});

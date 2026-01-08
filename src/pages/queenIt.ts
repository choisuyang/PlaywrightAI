import { Page, expect } from '@playwright/test';

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
        await page.getByRole('button', { name: '구매하기' }).click();
    },

    // 바로 구매 버튼 클릭
    async clickBuyImmediately() {
       await page.getByRole('button', { name: '바로 구매' }).click();
    },

    // 주문서페이지에서 주문하기 타이틀 확인
    async verifyOrderTitle(keyword: string) {
        const orderButton = page.locator('.MuiTypography-root', { hasText: '주문하기' });

        // 1. 요소가 화면에 나타날 때까지 대기 (기본 30초, 필요시 timeout 설정 가능)
        await orderButton.waitFor({ state: 'visible', timeout: 5000 });

        // 2. 나타난 후 텍스트 검증
        await expect(orderButton).toHaveText(keyword);
        
    }



        

});

 

//  await page.goto('https://web.queenit.kr/home/RECOMMENDATION');
//   await page.getByRole('link', { name: '마이' }).click();
//   await page.getByRole('button', { name: '로그인/회원가입' }).click();
//   await page.getByRole('button', { name: '휴대폰 인증으로 시작' }).click();
//   await page.getByRole('textbox', { name: '휴대폰 번호 입력' }).click();
//   await page.getByRole('textbox', { name: '휴대폰 번호 입력' }).fill('010-544-91333');
//   await page.getByRole('textbox', { name: '자리 숫자 입력' }).click();
//   await page.getByRole('textbox', { name: '자리 숫자 입력' }).fill('837606');
//   await page.goto('https://web.queenit.kr/mypage');
//   await page.getByRole('link', { name: '홈' }).click();
//   await page.getByRole('button', { name: '퀸잇 로고' }).click();
//   await page.getByRole('button', { name: '퀸잇 로고' }).click();
//   await page.getByRole('button', { name: '퀸잇 로고' }).click();
//   await page.locator('a').first().click();
//   await page.getByRole('button', { name: '검색' }).locator('a').click();
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).click();
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).fill('야');
//   await page.getByRole('textbox', { name: '[예시카] 올해 첫소비 아우터부터 잡화까지 역대급 할인' }).fill('');
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).click();
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).click();
//   await page.locator('.MuiInputBase-root').click();
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).fill('');
//   await page.locator('section').first().click();
//   await page.getByRole('textbox', { name: '[예시카] 올해 첫소비 아우터부터 잡화까지 역대급 할인' }).fill('양말');
//   await page.getByRole('textbox', { name: '[아우토반·폴로클럽] 겨울 시즌오프 최대 90' }).click();
//   await page.getByRole('textbox', { name: '[예시카] 올해 첫소비 아우터부터 잡화까지 역대급 할인' }).fill('양말');
//   await page.locator('a').nth(1).click();
//   await page.locator('a').filter({ hasText: 'SET도토리기프트지그재그기모양말 5' }).click();
//   await page.getByRole('button', { name: '구매하기' }).click();
//   await page.getByRole('button', { name: '바로 구매' }).click();
//   await page.getByRole('button', { name: '바로 구매' }).click();
//   await page.getByRole('button', { name: '바로 구매' }).click();
//   await page.getByRole('button', { name: '바로 구매' }).click();
//   await page.locator('.css-f9ra4e').click();
//   await page.getByRole('button', { name: '장바구니 담기' }).click();
//   await page.getByRole('button', { name: '바로 구매' }).click();
//   await page.locator('.css-f9ra4e').click();
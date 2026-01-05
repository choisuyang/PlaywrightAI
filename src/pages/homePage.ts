import { Page, expect } from '@playwright/test';

export const homePage = (page: Page) => ({

    // 메인 페이지로 이동
    async navigate() {
        await page.goto('https://display.cjonstyle.com');
    },

    // 메인 팝업 닫기
    async closeMainPopup() {
        await page.getByRole('button', {name : '닫기', exact: true}).click();
    },

    // 타이틀 로고
    async getTitleLogo(keyword: string) {
        const logoByClass = page.locator('.logo_w');
        await expect(logoByClass).toHaveAttribute('alt', keyword);
    },

    // 검색 페이지 이동
    async clickSearchBtn() {
        await  page.getByRole('link', { name: '검색페이지로 이동' }).click();
    },

    // 검색어 입력
    async inputSearchKeyword(keyword: string) {
        await page.getByRole('searchbox', { name: '검색어 입력' }).click();
        await page.getByRole('searchbox', { name: '검색어 입력' }).fill(keyword);
    },

    // 검색 버튼 클릭
    async clickSearchSubmit() {
        await page.getByRole('button', { name: '검색', exact: true }).click();
    },

    // 첫번째 상품 선택
    async selectProduct() {
        // #searchContent 안에 있는 ul 내의 첫 번째 링크 클릭
        const firstItem = page.locator('#searchContent ul li a').first();
        await firstItem.waitFor({ state: 'visible' }); // 요소가 보일 때까지 대기
        await firstItem.click();
    },
    
    // 구매하기 버튼 클릭
    async clickBuyNow() {
        await page.getByRole('button', { name: '구매하기' }).click();
        await page.getByRole('button', { name: '바로구매' }).click();
    },

    // 랭킹탭 이동
    async goToRankingTab() {
        await page.getByRole('link', { name: '랭킹' }).click();
    },

    // 주방소품 6 클릭
    async selectKitchenSupplies6() {
        await page.getByRole('link', { name: '주방소품 6' }).click();
    },

    // 주문서 페이지 확인
    async verifyOrderSheet() {
        const orderSheetHeader = page.getByRole('heading', { name: '주문서', exact: true });
        await expect(orderSheetHeader).toBeVisible();
    },


});

 
import { Page } from '@playwright/test';
import { homePage } from '../pages/homePage';

export async function run(page: Page) {
  const home = homePage(page);
    await home.navigate();
    await home.closeMainPopup();
    await home.goToRankingTab();
    await home.selectKitchenSupplies6();
    await home.clickBuyNow();
    await home.verifyOrderSheet();
}

import { Page } from '@playwright/test';
import { homePage } from '../pages/homePage';

export async function run(page: Page) {
  const home = homePage(page);
    await home.navigate();
    await home.closeMainPopup();
    await home.clickSearchBtn();
    await home.inputSearchKeyword('58376522');
    await home.clickSearchSubmit();
    await home.selectProduct();
    await home.clickBuyNow();
}
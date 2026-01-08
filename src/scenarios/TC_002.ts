import { Page } from '@playwright/test';
import { queenit } from '../pages/queenIt';

export async function run(page: Page) {
  const queenIt = queenit(page);
    await queenIt.navigate();
    await queenIt.clickSearchButton();
    await queenIt.enterSearchKeyword('양말');
    await queenIt.clickSearchSubmit();
    await queenIt.selectProduct();
    await queenIt.clickBuyNow();
    await queenIt.clickBuyImmediately();
    await queenIt.verifyOrderTitle('주문하기');
    
}
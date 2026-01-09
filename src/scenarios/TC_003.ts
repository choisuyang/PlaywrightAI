import { Page } from '@playwright/test';
import { queenit } from '../pages/queenIt';

export async function run(page: Page) {
  const queenIt = queenit(page);
    await queenIt.navigate();
    await queenIt.clickCategoryMen();
    await queenIt.selectBestProduct();
    await queenIt.clickBuyNow();
    await queenIt.selectMultipleOptions();
    await queenIt.clickBuyImmediately();
    await queenIt.verifyOrderTitle('주문하기');
    await queenIt.selectMaxDiscountOff();
    // await queenIt.clickFinalPayment();
    // await queenIt.clickPopupReject();
    await queenIt.clickFinalPayment2();
    await queenIt.closeOkayPopup();
    await queenIt.verifyOrderComplete();
    
}
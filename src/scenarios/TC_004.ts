import { Page } from '@playwright/test';
import { queenit } from '../pages/queenIt';

export async function run(page: Page) {
  const queenIt = queenit(page);
    await queenIt.navigate();
    await queenIt.clickCategoryMen();
    await queenIt.clickCategoryGolf();
    await queenIt.verifyGolfTitle('골프');
}
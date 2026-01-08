import { Page } from '@playwright/test';
import { queenit } from '../pages/queenIt';

export async function run(page: Page) {
  const queenIt = queenit(page);
    await queenIt.navigate();
    await queenIt.getTitleLogo('퀸잇 로고');
}
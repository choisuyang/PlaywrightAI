import { test } from '@playwright/test';
import { getTestCases, updateTestResult } from '../lib/googleSheet.js';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { uploadScreenshot } from '../lib/googleDrive.js';
import { createJiraIssue } from '../lib/jira.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
test('통합 실행 엔진', async ({ page }) => {
  const spreadsheetId = process.env.SPREADSHEET_ID!;
  const testCases = await getTestCases(spreadsheetId);

  for (const tc of testCases) {
    if (!tc.id) continue;

    let isSuccess = false;
    let screenshotPath = '';
    let jiraUrl = ''; // 1. 여기서 변수를 미리 선언해야 마지막 업데이트 시에도 사용할 수 있습니다.
    let errorMsg = ''; // 시트 업데이트를 위해 에러 메시지도 저장해두면 좋습니다.

    try {
      const scenarioPath = path.resolve(__dirname, `../scenarios/${tc.id}.ts`);
      const scenario = await import(pathToFileURL(scenarioPath).href);
      
      await scenario.run(page);
      isSuccess = true;
    } catch (error: unknown) {
      isSuccess = false;
      errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`${tc.id} 실패:`, errorMsg);
      
      const localPath = `test-results/screenshots/${tc.id}.png`;

      // 에러 발생 시 처리 로직
      if (!page.isClosed()) {
        try {
          // 1. 먼저 로컬에 스크린샷 저장
          await page.screenshot({ path: localPath, timeout: 5000 });
          console.log(`${tc.id} 스크린샷 저장 완료: ${localPath}`);

          // 2. 저장된 스크린샷을 구글 드라이브로 업로드
          const driveLink = await uploadScreenshot(localPath, `${tc.id}_${Date.now()}.png`);
          
          if (driveLink) {
            console.log(`${tc.id} 드라이브 업로드 성공: ${driveLink}`);
            screenshotPath = driveLink; 

            // 3. Jira 티켓 생성 및 URL 획득 (이미 선언된 jiraUrl 변수에 할당)
            console.log(`🎫 Jira 티켓 생성을 시작합니다...`);
            jiraUrl = await createJiraIssue(tc.id, errorMsg, driveLink) || ''; 
          } else {
            screenshotPath = localPath; 
          }
        } catch (screenshotError) {
          console.error(`${tc.id} 스크린샷/업로드 단계 실패:`, screenshotError);
          screenshotPath = 'Screenshot/Upload Failed';
        }
      }
    }

    // 결과 업데이트 (이제 jiraUrl 변수에 접근이 가능합니다)
    try {
      await updateTestResult(tc.rowInstance, {
        result: isSuccess ? 'True' : 'False',
        img: screenshotPath,
        checkNo: tc.id, 
        jiraUrl: isSuccess ? '' : jiraUrl 
      });
      console.log(`${jiraUrl} Jira URL 시트에 업데이트 완료`);
      console.log(`${tc.id} 결과 시트 업데이트 완료`);
    } catch (sheetError) {
      console.error('구글 시트 업데이트 실패:', sheetError);
    }
  }
});
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'; // JWT 라이브러리 추가 필요
import * as dotenv from 'dotenv';

dotenv.config();

// 1. JWT 인증 객체 생성 (최신 버전 방식)
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function getTestCases(spreadsheetId: string) {
  // 2. 생성자에 인증 객체를 함께 전달
  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  
  await doc.loadInfo();
  const rows = await doc.sheetsByIndex[0].getRows();
  
  return rows.map(row => ({
    // 3. 최신 버전은 row.get('컬럼명') 또는 row._rawData 사용을 권장하지만 
    // row.toObject()를 사용하면 이전처럼 접근하기 편합니다.
    id: row.get('NO'),
    steps: row.get('TestSteps'),
    rowInstance: row
  }));
}

export async function updateTestResult(row: any, data: { result: string, img: string, jiraUrl: string, checkNo: string }) {
  // 4. 최신 버전에서는 row.set('컬럼명', 값) 방식을 사용합니다.
  row.set('Result', data.result);
  row.set('IMG', data.img);
  row.set('Check NO', data.checkNo);
  // ✅ 조건부 로직 추가: jiraUrl이 있을 때만 하이퍼링크 생성
  if (data.jiraUrl && data.jiraUrl.startsWith('http')) {
    row.set('JiraUrl', `=HYPERLINK("${data.jiraUrl}", "티켓 바로가기")`);
  } else {
    // 성공(True)이거나 Jira 생성이 안 된 경우 빈 값으로 설정
    row.set('JiraUrl', ''); 
  }
  row.set('Check Time', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
  
  await row.save();
}


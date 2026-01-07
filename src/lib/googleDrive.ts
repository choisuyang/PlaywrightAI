import { google } from 'googleapis';
import fs from 'fs';

// OAuth2 클라이언트 설정
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function uploadScreenshot(filePath: string, fileName: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 업로드 실패: 로컬 파일 없음 -> ${filePath}`);
      return null;
    }

    const fileMetadata = {
      name: fileName,
      // 본인 드라이브의 폴더 ID를 넣으세요. 
      // (내 드라이브에 만든 폴더이므로 별도의 '공유' 작업은 이제 안 해도 됩니다!)
      parents: ['1QGEKmJK9p1Cn8v8uHP5JniWUkuUfKGEC'], 
    };
    
    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };

    console.log(`📤 OAuth 권한으로 드라이브 업로드 시작: ${fileName}...`);
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // 시트에서 누구나 볼 수 있게 공유 권한만 추가 (선택 사항)
    await drive.permissions.create({
      fileId: file.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log(`✅ 업로드 성공! 링크: ${file.data.webViewLink}`);
    return file.data.webViewLink;
  } catch (error: any) {
    console.error('❌ 드라이브 업로드 최종 에러:', error.message);
    return null;
  }
}
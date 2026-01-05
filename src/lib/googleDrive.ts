import { google } from 'googleapis';
import fs from 'fs';

// 1. keyFile 대신 credentials 설정을 사용해야 합니다.
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  // 스코프도 드라이브 업로드를 위해 명시
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadScreenshot(filePath: string, fileName: string) {
  try {
    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 업로드 실패: 로컬 파일 없음 -> ${filePath}`);
      return null;
    }

    const fileMetadata = {
      name: fileName,
      parents: ['1QGEKmJK9p1Cn8v8uHP5JniWUkuUfKGEC'], // 폴더 ID
    };
    
    const media = {
      mimeType: 'image/png',
      body: fs.createReadStream(filePath),
    };

    console.log(`📤 드라이브 업로드 시작: ${fileName}...`);
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
      // 핵심 옵션: 공유 드라이브나 공유 폴더 접근 권한 허용
      supportsAllDrives: true, 
      keepRevisionForever: true,
    } as any); // 타입 에러 방지용 as any

    // 권한 설정 (시트에서 클릭 시 바로 보이게 함)
    await drive.permissions.create({
      fileId: file.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
      ignoreDefaultVisibility: true,
    } as any);

    console.log(`✅ 업로드 성공: ${file.data.webViewLink}`);
    return file.data.webViewLink;
  } catch (error: any) {
    console.error('❌ 드라이브 업로드 상세 에러:', error.message);
    return null;
  }
}
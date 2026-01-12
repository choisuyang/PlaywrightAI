import axios from 'axios';

export async function createJiraIssue(tcId: string, errorMessage: string, driveLink: string) {
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

  const data = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY },
      summary: `[자동화 실패] ${tcId} 테스트 케이스 오류`,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: `실패 사유: ${errorMessage}\n` },
              { type: "text", text: `스크린샷 링크: ` },
              {
                type: "text",
                text: driveLink,
                marks: [{ type: "link", attrs: { href: driveLink } }]
              }
            ]
          }
        ]
      },
      assignee: {
        id: process.env.JIRA_ACCOUNT_ID 
      },
      reporter: {
      id: process.env.JIRA_ACCOUNT_ID
    },
      issuetype: { name: "BUG" } // 또는 "결함"
    }
  };

  try {
    const response = await axios.post(
      `${process.env.JIRA_DOMAIN}/rest/api/3/issue`,
      data,
      { headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' } }
    );

    // 생성된 티켓의 전체 URL 생성
    const jiraUrl = `${process.env.JIRA_DOMAIN}/browse/${response.data.key}`;
    console.log(`🎫 Jira 티켓 생성 완료: ${jiraUrl}`);
    
    return jiraUrl; // ID 대신 URL을 반환
  } catch (error: any) {
    console.error('❌ Jira 생성 실패:', error.response?.data || error.message);
    return null;
  }
}
// Service Worker for 西子湖畔挑战赛
// 代理钉钉机器人通知，绕过浏览器 CORS 限制

const DINGTALK_WEBHOOK = 'https://oapi.dingtalk.com/robot/send?access_token=9e31c2ef9706ba2015a6743180bbf490469eeaa9eacb1397b09b13bdcc172fe4';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'dingtalk-notify') {
    const data = event.data.data;
    
    // 构建钉钉 Markdown 消息
    const markdown = `## 🎯 新报名提醒\n\n` +
      `**姓名：** ${data['姓名'] || '-'}\n\n` +
      `**联系方式：** ${data['联系方式'] || '-'}\n\n` +
      `**年龄段：** ${data['年龄段'] || '-'}\n\n` +
      `**来自：** ${data['来自哪里'] || '-'}\n\n` +
      `**出镜意愿：** ${data['是否愿意出镜'] || '-'}\n\n` +
      `**擅长风格：** ${data['擅长风格'] || '-'}\n\n` +
      `**可参与时间：** ${data['可参与时间'] || '-'}\n\n` +
      `**社交账号：** ${data['社交账号'] || '-'}\n\n` +
      `**备注：** ${data['备注'] || '-'}\n\n` +
      `---\n⏰ ${new Date().toLocaleString('zh-CN')}`;

    fetch(DINGTALK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          title: '西子湖畔挑战赛 - 新报名',
          text: markdown
        }
      })
    }).then(res => res.json()).then(result => {
      console.log('钉钉通知结果:', result);
    }).catch(err => {
      console.error('钉钉通知失败:', err);
    });
  }
});

// 立即激活，不等待旧 SW
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const TARGET_URL = 'https://zy.weiaj.com/post/65';
const MARKDOWN_FILE_PATH = path.join(__dirname, '../docs/blog/文档/免费AppleID账号.md');

async function scrapeAppleId() {
    try {
        console.log(`正在请求: ${TARGET_URL} ...`);

        // 1. 获取网页 HTML
        const response = await axios.get(TARGET_URL, {
            headers: {
                // 模拟浏览器 User-Agent，防止被简单的反爬拦截
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 2. 加载 HTML 到 Cheerio
        const $ = cheerio.load(response.data);

        // 尝试从 window.__NUXT__ 中提取 content
        const htmlContent = response.data;
        const contentMatch = htmlContent.match(/content:"(.*?)",/);
        
        let searchContext = '';

        if (contentMatch && contentMatch[1]) {
            // 处理 unicode 转义
            const rawContent = contentMatch[1];
            const unescapedContent = JSON.parse(`"${rawContent}"`);
            searchContext = unescapedContent;
        } else {
            searchContext = $('body').text();
        }

        // 3. 获取标题
        const title = $('title').text().trim();
        console.log(`\n页面标题: ${title}`);
        console.log('-----------------------------------');

        // 解析账号和密码
        const $content = cheerio.load(searchContext);
        const accounts: { email: string, password: string, region: string }[] = [];
        
        let currentRegion = '美国'; // 默认

        // 遍历所有子元素
        $content('body').children().each((index, element) => {
            const $el = $content(element);
            const text = $el.text().trim();
            
            // 检查是否是地区标题 (h1)
            if (element.tagName === 'h1') {
                 // 清理文本，例如 "美国：" -> "美国"
                 let regionName = text.replace(/[:：].*$/, '').trim();
                 if (regionName) {
                     currentRegion = regionName;
                     console.log(`Found h1 header: ${text} -> Set region to ${currentRegion}`);
                 }
            }

            // 查找该元素内部的账号信息
            const $usernameSpan = $el.find('span[id^="username_"]');
            if ($usernameSpan.length > 0) {
                $usernameSpan.each((i, span) => {
                    const usernameId = $content(span).attr('id');
                    if (usernameId) {
                        const idPart = usernameId.replace('username_', '');
                        const email = $content(span).text().trim();
                        // 密码通常在同一个父元素下，或者附近的元素
                        // 之前的逻辑是直接通过 ID 查找，这里也可以
                        const password = $content(`#password_${idPart}`).text().trim();
                        
                        if (email && password && !email.includes('暂无可用')) {
                            accounts.push({ email, password, region: currentRegion });
                        }
                    }
                });
            }
        });

        if (accounts.length > 0) {
            console.log('成功解析到账号信息:');
            accounts.forEach(acc => {
                console.log(`地区: ${acc.region}, 账号: ${acc.email}, 密码: ${acc.password}`);
            });
            
            updateMarkdownFile(accounts);
        } else {
            console.log('未解析到账号信息。');
        }

    } catch (error) {
        console.error('爬取失败:', error);
        process.exit(1);
    }
}

function updateMarkdownFile(accounts: { email: string, password: string, region: string }[]) {
    try {
        if (!fs.existsSync(MARKDOWN_FILE_PATH)) {
            console.error(`文件不存在: ${MARKDOWN_FILE_PATH}`);
            return;
        }

        let content = fs.readFileSync(MARKDOWN_FILE_PATH, 'utf-8');
        const header = '## 免费美区 Apple ID账号';
        const headerIndex = content.indexOf(header);
        
        if (headerIndex === -1) {
            console.error('未找到目标章节标题。');
            return;
        }

        // Construct new content using card-masonry
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', { 
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-');

        let newContent = `\n\n> 更新时间：${timeString}\n\n:::: card-masonry cols="2" gap="16"\n\n`;
        
        accounts.forEach(acc => {
            let badgeType = 'info';
            const r = acc.region;
            if (r.includes('美')) badgeType = 'tip';
            else if (r.includes('日')) badgeType = 'warning';
            else if (r.includes('韩')) badgeType = 'danger';
            else if (r.includes('中') || r.includes('国区')) badgeType = 'tip';

            const regionText = acc.region;

            newContent += `::: card\n\n`;
            newContent += `<Badge type="${badgeType}" text="${regionText}" />\n\n`;
            newContent += `账号 \`${acc.email}\`\n\n`;
            newContent += `密码  <Plot trigger="click" effect="blur">\`${acc.password}\`</Plot>\n\n`;
            newContent += ` <button style="cursor:pointer; margin-left:5px; padding: 2px 6px; font-size: 12px;" @click="copy('${acc.email}')">复制账号</button> <button style="cursor:pointer; margin-left:5px; padding: 2px 6px; font-size: 12px;" @click="copy('${acc.password}')">复制密码</button>\n\n`;
            newContent += `:::\n\n`;
        });

        newContent += `::::\n\n`;

        // Regex to find the existing block (either table or card-masonry)
        // We look for the content after the header until the next section or end of file
        // But to be safer, let's try to match the specific block types we know about.
        
        const part1 = content.substring(0, headerIndex + header.length);
        const part2 = content.substring(headerIndex + header.length);
        
        // Try to match card-masonry block first
        const cardMasonryRegex = /^\s*(> 更新时间：.*?\n\s*)?:::: card-masonry[\s\S]*?::::/m;
        // Try to match table block
        const tableBlockRegex = /^\s*(\|.*\|\r?\n)+/m;

        let match = part2.match(cardMasonryRegex);
        let matchedLength = 0;
        let matchIndex = -1;

        if (match) {
            matchIndex = match.index!;
            matchedLength = match[0].length;
        } else {
            // Fallback to table check
            match = part2.match(tableBlockRegex);
            if (match) {
                matchIndex = match.index!;
                matchedLength = match[0].length;
            }
        }
        
        if (matchIndex !== -1) {
             const prefix = part2.substring(0, matchIndex);
             // Ensure we are replacing the immediate next block
             if (!prefix.trim()) {
                 const newPart2 = part2.substring(0, matchIndex) + newContent + part2.substring(matchIndex + matchedLength);
                 let finalContent = part1 + newPart2;

                 // Inject script if missing
                 const scriptContent = `
<script setup>
const copy = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('复制成功: ' + text);
    }).catch(err => {
      console.error('复制失败: ', err);
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
      document.execCommand('copy');
      alert('复制成功: ' + text);
  } catch (err) {
      console.error('复制失败: ', err);
      alert('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}
</script>
`;
                 if (!finalContent.includes('const copy =')) {
                     finalContent += '\n' + scriptContent;
                 }

                 fs.writeFileSync(MARKDOWN_FILE_PATH, finalContent, 'utf-8');
                 console.log(`\nMarkdown 文件已更新: ${MARKDOWN_FILE_PATH}`);
             } else {
                 console.error('标题后未紧跟目标块，跳过更新。');
             }
        } else {
             // If no existing block found, append it? Or maybe just insert it.
             console.log('未找到现有块，尝试插入新块...');
             const newPart2 = newContent + part2;
             let finalContent = part1 + newPart2;
             
             // Inject script if missing
             const scriptContent = `
<script setup>
const copy = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('复制成功: ' + text);
    }).catch(err => {
      console.error('复制失败: ', err);
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

const fallbackCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
      document.execCommand('copy');
      alert('复制成功: ' + text);
  } catch (err) {
      console.error('复制失败: ', err);
      alert('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}
</script>
`;
             if (!finalContent.includes('const copy =')) {
                 finalContent += '\n' + scriptContent;
             }
             
             fs.writeFileSync(MARKDOWN_FILE_PATH, finalContent, 'utf-8');
             console.log(`\nMarkdown 文件已更新 (插入新块): ${MARKDOWN_FILE_PATH}`);
        }
        
    } catch (e) {
        console.error('更新 Markdown 文件失败:', e);
        process.exit(1);
    }
}

scrapeAppleId();
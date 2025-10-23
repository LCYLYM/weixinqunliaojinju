const fs = require('fs');
const path = require('path');

// 获取命令行参数
const action = process.argv[2];
const imageData = process.argv[3];
const quoteId = process.argv[4];

// quotes.json 文件路径
const quotesPath = path.join(process.cwd(), 'quotes.json');

// 读取现有数据
let quotes = [];
if (fs.existsSync(quotesPath)) {
  try {
    const data = fs.readFileSync(quotesPath, 'utf-8');
    quotes = JSON.parse(data);
  } catch (error) {
    console.error('读取 quotes.json 失败:', error);
    quotes = [];
  }
}

// 根据操作类型处理数据
if (action === 'add') {
  // 添加新金句
  const newQuote = {
    id: Date.now(),
    image: imageData,
    timestamp: new Date().toISOString(),
    reports: 0,
    hidden: false
  };
  quotes.unshift(newQuote);
  console.log('✅ 添加新金句，ID:', newQuote.id);
  
} else if (action === 'report') {
  // 举报金句
  const quote = quotes.find(q => q.id == quoteId);
  if (quote) {
    quote.reports += 1;
    console.log(`⚠️ 金句 ${quoteId} 被举报，当前举报次数: ${quote.reports}`);
    
    // 举报次数达到 2 次则隐藏
    if (quote.reports >= 2) {
      quote.hidden = true;
      console.log(`🚫 金句 ${quoteId} 已被隐藏`);
    }
  } else {
    console.error(`❌ 未找到 ID 为 ${quoteId} 的金句`);
  }
} else {
  console.error('❌ 未知操作:', action);
  process.exit(1);
}

// 写入更新后的数据
try {
  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), 'utf-8');
  console.log('✅ quotes.json 更新成功');
} catch (error) {
  console.error('❌ 写入 quotes.json 失败:', error);
  process.exit(1);
}

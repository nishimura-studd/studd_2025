const fs = require('fs');
const path = require('path');

// ビルド時間を日本時間で生成
const buildTime = new Date().toLocaleString('ja-JP', { 
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

// build-time.tsファイルを生成
const buildTimeContent = `// This file is auto-generated during build
export const BUILD_TIME = '${buildTime}';
`;

const outputPath = path.join(__dirname, '../src/generated/build-time.ts');
const outputDir = path.dirname(outputPath);

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ファイルを書き出し
fs.writeFileSync(outputPath, buildTimeContent);

console.log(`Build time generated: ${buildTime}`);
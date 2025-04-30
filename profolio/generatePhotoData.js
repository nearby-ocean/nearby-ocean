const fs = require('fs');
const path = require('path');

const baseDir = './images';
const result = {};

const categories = fs.readdirSync(baseDir).filter(dir =>
  fs.statSync(path.join(baseDir, dir)).isDirectory()
);

categories.forEach(category => {
  const categoryPath = path.join(baseDir, category);

  // 特別處理 "人像" 子分類
  if (category === '人像') {
    const subFolders = fs.readdirSync(categoryPath).filter(sub =>
      fs.statSync(path.join(categoryPath, sub)).isDirectory()
    );

    result[category] = {};

    subFolders.forEach(sub => {
      const files = fs.readdirSync(path.join(categoryPath, sub))
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

      result[category][sub] = files.map(file => `images/${category}/${sub}/${file}`);
    });

  } else {
    // 普通分類
    const files = fs.readdirSync(categoryPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    result[category] = files.map(file => `images/${category}/${file}`);
  }
});

const output = `const photoData = ${JSON.stringify(result, null, 2)};\n\nexport default photoData;`;

fs.writeFileSync('./photoData.js', output, 'utf8');

console.log('✅ 已完成：photoData.js 已自動生成！');

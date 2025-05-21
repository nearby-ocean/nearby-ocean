const fs = require('fs');
const path = require('path');

// 設定 profolio 資料夾的路徑
const profolioDir = path.join(__dirname, 'profolio');
const result = {};

try {
  // 獲取所有資料夾
  const categories = fs.readdirSync(profolioDir).filter(dir =>
    fs.statSync(path.join(profolioDir, dir)).isDirectory() && 
    !dir.startsWith('.') && // 排除隱藏資料夾
    dir !== 'node_modules' // 排除 node_modules
  );

  console.log('找到的資料夾：', categories);

  categories.forEach(category => {
    const categoryPath = path.join(profolioDir, category);
    console.log(`處理資料夾：${category}`);
    
    // 檢查是否為照片資料夾（包含圖片檔案）
    const hasImages = fs.readdirSync(categoryPath).some(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    if (hasImages) {
      // 直接處理圖片檔案
      const files = fs.readdirSync(categoryPath)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      console.log(`在 ${category} 中找到 ${files.length} 個圖片檔案`);
      result[category] = files.map(file => `profolio/${category}/${file}`);
    } else {
      // 處理子資料夾
      const subFolders = fs.readdirSync(categoryPath).filter(sub =>
        fs.statSync(path.join(categoryPath, sub)).isDirectory()
      );

      if (subFolders.length > 0) {
        console.log(`在 ${category} 中找到 ${subFolders.length} 個子資料夾`);
        result[category] = {};

        subFolders.forEach(sub => {
          const subPath = path.join(categoryPath, sub);
          const files = fs.readdirSync(subPath)
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

          if (files.length > 0) {
            console.log(`在 ${category}/${sub} 中找到 ${files.length} 個圖片檔案`);
            result[category][sub] = files.map(file => `profolio/${category}/${sub}/${file}`);
          }
        });
      }
    }
  });

  // 特別處理人像和國家地區特輯資料夾
  const specialCategories = ['人像', '國家地區特輯'];
  specialCategories.forEach(category => {
    const categoryPath = path.join(profolioDir, category);
    if (fs.existsSync(categoryPath)) {
      console.log(`處理特殊資料夾：${category}`);
      result[category] = {};
      const subFolders = fs.readdirSync(categoryPath).filter(sub =>
        fs.statSync(path.join(categoryPath, sub)).isDirectory()
      );

      subFolders.forEach(sub => {
        const subPath = path.join(categoryPath, sub);
        const files = fs.readdirSync(subPath)
          .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        if (files.length > 0) {
          console.log(`在 ${category}/${sub} 中找到 ${files.length} 個圖片檔案`);
          result[category][sub] = files.map(file => `profolio/${category}/${sub}/${file}`);
        }
      });
    }
  });

  const output = `window.photoData = ${JSON.stringify(result, null, 2)};`;

  // 在 mywebsite 資料夾內生成 photoData.js
  fs.writeFileSync(path.join(__dirname, 'photoData.js'), output, 'utf8');
  console.log('✅ 已完成：photoData.js 已自動生成在 mywebsite 資料夾內！');
  console.log('生成的資料結構：', JSON.stringify(result, null, 2));

} catch (error) {
  console.error('發生錯誤：', error);
  process.exit(1);
} 
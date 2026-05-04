const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Функция для рекурсивного обхода папок
function processDirectory(dir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const outputFile = path.join(outputDir, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        // Рекурсивно обрабатываем подпапки
        processDirectory(filePath, outputFile);
      } else if (path.extname(file).toLowerCase() === '.png') {
        // Обрабатываем PNG файлы
        sharp(filePath)
          .resize(256, 256, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .png({ 
            quality: 80,
            compressionLevel: 9
          })
          .toFile(outputFile, (err, info) => {
            if (err) {
              console.error(`Error processing ${file}:`, err);
            } else {
              const originalSize = fs.statSync(filePath).size;
              const newSize = fs.statSync(outputFile).size;
              const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
              console.log(`✅ ${file} - ${(originalSize/1024/1024).toFixed(1)}MB → ${(newSize/1024/1024).toFixed(1)}MB (${reduction}% reduction)`);
            }
          });
      }
    });
  });
}

// Обрабатываем все изображения в папке icons
const inputDir = 'E:\\trae\\ferma_spec_lite\\public\\icons';
const outputDir = 'E:\\trae\\ferma_spec_lite\\public\\icons_optimized';

console.log('🚀 Starting image optimization...');
processDirectory(inputDir, outputDir);

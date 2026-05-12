const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Perform case-sensitive replacements
    let newContent = content.replace(/Momentum/g, 'Kanon');
    newContent = newContent.replace(/momentum/g, 'kanon');
    newContent = newContent.replace(/MOMENTUM/g, 'KANON');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
};

const directoriesToSearch = [
  './src',
  './netlify',
  './public'
];

const filesToSearch = [
  './.env.example',
  './render.yaml',
  './momentum_portable.html',
  './server.ts',
  './metadata.json',
  './index.html',
];

const walkSync = (dir, filelist = []) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const dirFile = path.join(dir, file);
      try {
        if (fs.statSync(dirFile).isDirectory()) {
          filelist = walkSync(dirFile, filelist);
        } else {
          filelist.push(dirFile);
        }
      } catch (err) {
        // ignore errors
      }
    });
  }
  return filelist;
};

let allFiles = [...filesToSearch];
directoriesToSearch.forEach(dir => {
  allFiles = allFiles.concat(walkSync(dir));
});

allFiles.forEach(file => {
  if (!file.includes('node_modules') && !file.includes('.git') && 
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html') || 
       file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.example') ||
       file.endsWith('.svg') || file.endsWith('.mts') || file.endsWith('.css') || file.endsWith('.js'))) {
    replaceInFile(file);
  }
});

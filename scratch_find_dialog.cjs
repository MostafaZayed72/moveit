const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Find confirmDialog definition
const cdLine = lines.findIndex(l => l.includes('const confirmDialog = ref'));
console.log('confirmDialog found at line:', cdLine + 1);

if (cdLine > 0) {
  // Show context around it
  for (let i = Math.max(0, cdLine - 5); i <= Math.min(lines.length - 1, cdLine + 5); i++) {
    console.log(i + 1, lines[i].trim());
  }
} else {
  console.log('Not found! Checking for showConfirm definition...');
  const scLine = lines.findIndex(l => l.includes('const showConfirm = '));
  console.log('showConfirm found at line:', scLine + 1);
  if (scLine > 0) {
    for (let i = Math.max(0, scLine - 3); i <= Math.min(lines.length - 1, scLine + 5); i++) {
      console.log(i + 1, lines[i].trim());
    }
  }
}

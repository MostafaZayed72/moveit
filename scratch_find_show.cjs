const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Find all occurrences of 'showConfirm' in the file
lines.forEach((l, i) => {
  if (l.includes('showConfirm')) {
    console.log(i + 1, l.trim());
  }
});

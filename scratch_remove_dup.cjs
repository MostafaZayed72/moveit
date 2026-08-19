const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
let content = fs.readFileSync(file, 'utf8');

// Remove the second (duplicate) supabase + showDialog block
// Target: the duplicate at the bottom of the confirmDialog section
const dupBlock = `\n// Supabase client\nconst supabase = useSupabaseClient()\r\n\r\n\r\nconst showDialog = (title, message, type = 'success') => {\r\n  dialog.value = { show: true, title, message, type }\r\n}\r\n`;

if (content.includes(dupBlock)) {
  content = content.replace(dupBlock, '\n');
  console.log('Removed duplicate block (CRLF version)');
} else {
  // Try LF version
  const dupBlockLF = '\n// Supabase client\nconst supabase = useSupabaseClient()\n\n\nconst showDialog = (title, message, type = \'success\') => {\n  dialog.value = { show: true, title, message, type }\n}\n';
  if (content.includes(dupBlockLF)) {
    content = content.replace(dupBlockLF, '\n');
    console.log('Removed duplicate block (LF version)');
  } else {
    // Count occurrences manually
    const countSupabase = (content.match(/const supabase = useSupabaseClient\(\)/g) || []).length;
    const countShowDialog = (content.match(/const showDialog = /g) || []).length;
    console.log('supabase declarations:', countSupabase);
    console.log('showDialog declarations:', countShowDialog);
    
    // Manual removal using line-based approach
    const lines = content.split('\n');
    let removedCount = 0;
    const newLines = [];
    let skipNext = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (skipNext > 0) {
        skipNext--;
        continue;
      }
      
      const l = lines[i];
      // Check if this is a duplicate supabase declaration (not the first one)
      if (l.includes('const supabase = useSupabaseClient()') && removedCount === 0) {
        // This is the duplicate - check if there's another one earlier
        let earlierExists = false;
        for (let j = 0; j < i; j++) {
          if (lines[j].includes('const supabase = useSupabaseClient()')) {
            earlierExists = true;
            break;
          }
        }
        if (earlierExists) {
          console.log('Removing duplicate supabase at line', i+1);
          removedCount++;
          continue;
        }
      }
      
      newLines.push(l);
    }
    
    if (removedCount > 0) {
      content = newLines.join('\n');
    }
    
    // Now handle duplicate showDialog
    const lines2 = content.split('\n');
    let sdCount = 0;
    let sdRemoved = 0;
    const newLines2 = [];
    
    for (let i = 0; i < lines2.length; i++) {
      const l = lines2[i];
      if (l.includes('const showDialog = ')) {
        sdCount++;
        if (sdCount > 1) {
          // Remove this and next 2 lines (the function body)
          sdRemoved++;
          console.log('Removing duplicate showDialog at line', i+1);
          // Skip the function body
          while (i < lines2.length - 1 && !lines2[i+1].includes('// ---') && !lines2[i+1].includes('const ')) {
            i++;
          }
          continue;
        }
      }
      newLines2.push(l);
    }
    
    if (sdRemoved > 0) {
      content = newLines2.join('\n');
      console.log('Removed', sdRemoved, 'duplicate showDialog definitions');
    }
  }
}

fs.writeFileSync(file, content, 'utf8');

// Verify
const finalContent = fs.readFileSync(file, 'utf8');
const supabaseCount = (finalContent.match(/const supabase = useSupabaseClient\(\)/g) || []).length;
const showDialogCount = (finalContent.match(/const showDialog = /g) || []).length;
console.log('Final supabase count:', supabaseCount);
console.log('Final showDialog count:', showDialogCount);

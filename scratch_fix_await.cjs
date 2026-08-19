const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix saveOrder - already async, check if it uses await showConfirm without async wrapping
// 2. Fix saveCustomer that uses showDialog - not needed
// 3. Fix the saveBlog
// 4. The main issue: the script replaced alert() with await showConfirm() inside non-async functions via regex

// Let's replace non-async usages with a simpler pattern - just call showConfirm without await 
// (since showConfirm returns a Promise but we don't need to wait for it for alert-mode)
// OR: wrap the calls in an async IIFE

// Strategy: Replace all `await showConfirm(...)` inside non-async functions
// by searching all the lines where script injected it

// Check for the case in the old custom dialog script, the regex replaced:
// alert(...) => await showConfirm(...)  
// This would break non-async functions.

// The simplest fix: Remove await from showConfirm calls that are in non-async contexts
// OR better: make showConfirm sync for alerts (don't need to wait for them to return)
// We'll make a showAlert helper that doesn't need await

// Add a non-async showAlert wrapper
const showAlertHelper = `
const showAlert = (message) => {
  showConfirm("Notice", message, true)
}
`;

// Insert before const confirmDialog line
const target = 'const confirmDialog = ref';
if (content.includes(target)) {
  content = content.replace(target, showAlertHelper + target);
  console.log('Added showAlert helper');
}

// Now for all await showConfirm("Notice", ..., true) that are NOT in async functions
// Let's identify the problematic lines from the task output:
// Line 2024: inside catch (e) { ... } which is inside async onOrderImageUpload - FINE
// Line 2073: inside async saveOrder - FINE  
// Line 2079: inside async deleteOrder - FINE
// Line 2089: inside async deleteOrder - FINE
// Line 2140: inside async .then() - FINE (just fixed)
// Line 2231: inside async exportCSV - FINE
// Line 2318: inside async addExpense - FINE
// Line 2321: inside async addExpense - FINE
// Line 2536: inside async onProductImageUpload - FINE
// Line 2609: inside async saveProduct - FINE
// Line 2622: inside async saveProduct - FINE
// Line 2640: inside async deleteProduct - FINE

// So all are async... The issue must be somewhere else. Let's check the confirmDialog.value.confirm usage in the HTML template

// The issue might be in the script that was injected into the HTML template (custom dialog script)
// The regex replaced alert() globally including potentially inside event handlers in template

// Check if there's any await in the template section
const templateStart = content.indexOf('<template>');
const templateEnd = content.indexOf('</template>');
const templateSection = content.substring(templateStart, templateEnd);
if (templateSection.includes('await')) {
  console.log('Found await in template! This is the problem.');
  // Find and show context
  let idx = templateSection.indexOf('await');
  while (idx !== -1) {
    console.log('  at template offset', idx, ':', templateSection.substring(idx - 50, idx + 100).replace(/\n/g, ' '));
    idx = templateSection.indexOf('await', idx + 1);
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done');

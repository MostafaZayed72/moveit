const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'app/pages/admin/index.vue');
const currentCode = fs.readFileSync(srcPath, 'utf8');

// Extract the locations, blog, services, pricing, products, financials template blocks
function getBlock(code, startMarker, endMarker) {
  const start = code.indexOf(startMarker);
  if (start === -1) return '';
  const end = code.indexOf(endMarker, start);
  if (end === -1) return code.slice(start);
  return code.slice(start, end);
}

// Check if we can extract blocks
const locBlock = getBlock(currentCode, "<!-- TAB CONTENT: LOCATIONS -->", "<!-- TAB CONTENT: BLOG -->");
const blogBlock = getBlock(currentCode, "<!-- TAB CONTENT: BLOG -->", "<!-- TAB CONTENT: SERVICES -->");
const servBlock = getBlock(currentCode, "<!-- TAB CONTENT: SERVICES -->", "<!-- TAB CONTENT: PRICING -->");
const priceBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRICING -->", "<!-- TAB CONTENT: PRODUCTS -->");
const prodBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRODUCTS -->", "<!-- TAB CONTENT: ORDERS -->");
const finBlock = getBlock(currentCode, "<!-- TAB CONTENT: FINANCIALS -->", "<!-- MODALS -->");

// Extract existing modals
const existingModalsBlock = getBlock(currentCode, "<!-- MODAL: EDIT ORDER -->", "</main>");

console.log('Extracted blocks successfully:');
console.log('locBlock:', locBlock.length);
console.log('blogBlock:', blogBlock.length);
console.log('servBlock:', servBlock.length);
console.log('priceBlock:', priceBlock.length);
console.log('prodBlock:', prodBlock.length);
console.log('finBlock:', finBlock.length);
console.log('existingModalsBlock:', existingModalsBlock.length);

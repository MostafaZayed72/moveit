const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'app/pages/admin/index.vue');
const currentCode = fs.readFileSync(srcPath, 'utf8');

function getBlock(code, startMarker, endMarker) {
  const start = code.indexOf(startMarker);
  if (start === -1) return '';
  const end = code.indexOf(endMarker, start);
  if (end === -1) return code.slice(start);
  return code.slice(start, end);
}

const locBlock = getBlock(currentCode, "<!-- TAB CONTENT: LOCATIONS -->", "<!-- TAB CONTENT: BLOG -->");
const blogBlock = getBlock(currentCode, "<!-- TAB CONTENT: BLOG -->", "<!-- TAB CONTENT: SERVICES -->");
const servBlock = getBlock(currentCode, "<!-- TAB CONTENT: SERVICES -->", "<!-- TAB CONTENT: PRICING -->");
const priceBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRICING -->", "<!-- TAB CONTENT: PRODUCTS -->");
const prodBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRODUCTS -->", "<!-- TAB CONTENT: ORDERS -->");
const finBlock = getBlock(currentCode, "<!-- TAB CONTENT: FINANCIALS -->", "<!-- MODAL: EDIT ORDER -->");
const existingModalsBlock = getBlock(currentCode, "<!-- MODAL: EDIT ORDER -->", "</main>");

// Read the script section
const scriptStart = currentCode.indexOf('<script setup>');
const existingScript = currentCode.slice(scriptStart);

console.log('Script length:', existingScript.length);

const fs = require('fs');
let content = fs.readFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', 'utf8');

content = content.replace('<script setup>', '<script setup>\ndefinePageMeta({ layout: false })\n');
content = content.replace('<div class="container mx-auto px-6 max-w-6xl relative z-10">', '<div class="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1920px] mx-auto">');
content = content.replace('w-full max-w-[1400px] mx-auto', 'w-full mx-auto');

const headerRegex = /<!-- Header -->[\s\S]*?<!-- Navigation -->/;
const newHeader = `<!-- Header -->
          <div class="mb-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <NuxtLink to="/" class="block group">
              <img src="/images/logo.svg" alt="MoveIt Logo" class="h-10 w-auto group-hover:scale-105 transition-transform origin-left" />
            </NuxtLink>
            <p class="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-4">Admin Dashboard</p>
          </div>

          <!-- Navigation -->`;
content = content.replace(headerRegex, newHeader);

// We should also remove the main page padding from pt-32 to something smaller so it doesn't leave huge whitespace
content = content.replace('<div class="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-brand-black text-slate-900 dark:text-slate-100 font-sans relative">', '<div class="pt-8 pb-24 min-h-screen bg-slate-50 dark:bg-brand-black text-slate-900 dark:text-slate-100 font-sans relative">');

fs.writeFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', content);
console.log('Done');

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'app/pages/admin/index.vue');
let code = fs.readFileSync(srcPath, 'utf8');

// Update theme classes across the entire admin file
// 1. Root container
code = code.replace(
  'class="min-h-screen bg-slate-950 text-slate-100',
  'class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200'
);

// 2. Top Header
code = code.replace(
  'class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80',
  'class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-2xl transition-colors'
);

// 3. Header search
code = code.replace(
  'class="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"',
  'class="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"'
);

// 4. Header ticker
code = code.replace(
  'class="hidden xl:flex items-center gap-6 text-xs text-slate-400 bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800/60"',
  'class="hidden xl:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800/60"'
);

// 5. Header dark mode button
code = code.replace(
  'class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"',
  'class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors cursor-pointer"'
);

// 6. Header user profile
code = code.replace(
  '<p class="text-xs font-bold text-slate-200 leading-none">Avery Bergenske</p>',
  '<p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">Avery Bergenske</p>'
);

// 7. Sidebar
code = code.replace(
  'class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-2xl h-fit lg:sticky lg:top-20 z-20 backdrop-blur-xl"',
  'class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl h-fit lg:sticky lg:top-20 z-20 backdrop-blur-xl transition-colors"'
);

// 8. Main workspace
code = code.replace(
  'class="flex-1 min-w-0 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden min-h-[85vh] relative flex flex-col"',
  'class="flex-1 min-w-0 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden min-h-[85vh] relative flex flex-col transition-colors"'
);

// 9. Orders grid containers and cards
code = code.replaceAll('bg-slate-950/90', 'bg-white dark:bg-slate-950/90');
code = code.replaceAll('bg-slate-950/80', 'bg-slate-50 dark:bg-slate-950/80');
code = code.replaceAll('bg-slate-950/60', 'bg-slate-50 dark:bg-slate-950/60');
code = code.replaceAll('bg-slate-950', 'bg-slate-50 dark:bg-slate-950');
code = code.replaceAll('border-slate-800', 'border-slate-200 dark:border-slate-800');
code = code.replaceAll('text-white', 'text-slate-900 dark:text-white');
code = code.replaceAll('text-slate-200', 'text-slate-800 dark:text-slate-200');
code = code.replaceAll('text-slate-300', 'text-slate-700 dark:text-slate-300');
code = code.replaceAll('text-slate-400', 'text-slate-500 dark:text-slate-400');
code = code.replaceAll('bg-slate-900/90', 'bg-slate-100 dark:bg-slate-900/90');
code = code.replaceAll('bg-slate-900/80', 'bg-slate-100 dark:bg-slate-900/80');
code = code.replaceAll('bg-slate-900/60', 'bg-slate-100 dark:bg-slate-900/60');
code = code.replaceAll('bg-slate-900', 'bg-slate-100 dark:bg-slate-900');
code = code.replaceAll('bg-slate-800', 'bg-slate-200 dark:bg-slate-800');

// Fix theme toggle in script
const oldToggleDark = `const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)`;

const newToggleDark = `const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDarkBase = useToggle(isDark)

const toggleDark = () => {
  toggleDarkBase()
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('vueuse-color-scheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('vueuse-color-scheme', 'light')
    }
  }
}`;

if (code.includes(oldToggleDark)) {
  code = code.replace(oldToggleDark, newToggleDark);
}

fs.writeFileSync(srcPath, code, 'utf8');
console.log('Applied full Light & Dark mode themes across all admin sections!');

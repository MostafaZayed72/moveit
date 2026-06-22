const fs = require('fs');
const path = 'f:/أبورك/MoveIt/app/pages/admin/index.vue';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  'bg-slate-900': 'bg-slate-50 dark:bg-slate-900',
  'bg-slate-950/60': 'bg-white dark:bg-slate-950/60',
  'bg-slate-950/50': 'bg-white dark:bg-slate-950/50',
  'bg-slate-950/40': 'bg-white dark:bg-slate-950/40',
  'bg-slate-950/20': 'bg-slate-100 dark:bg-slate-950/20',
  'bg-slate-800': 'bg-slate-100 dark:bg-slate-800',
  'hover:bg-slate-700': 'hover:bg-slate-200 dark:hover:bg-slate-700',
  'border-slate-800': 'border-slate-200 dark:border-slate-800',
  'border-slate-800/80': 'border-slate-200 dark:border-slate-800/80',
  'border-slate-900': 'border-slate-200 dark:border-slate-900',
  'border-slate-900/60': 'border-slate-200 dark:border-slate-900/60',
  'border-slate-900/65': 'border-slate-200 dark:border-slate-900/65',
  'text-slate-100': 'text-slate-900 dark:text-slate-100',
  'text-slate-200': 'text-slate-800 dark:text-slate-200',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-500 dark:text-slate-400',
  'text-white': 'text-slate-900 dark:text-white',
  'shadow-red-600/10': 'shadow-red-600/10 dark:shadow-red-600/20',
  'bg-slate-950': 'bg-white dark:bg-slate-950',
};

for (const [key, value] of Object.entries(replacements)) {
  const safeKey = key.replace(/\//g, '\\/');
  const regex = new RegExp('(?<![\\w-])' + safeKey + '(?![\\w-])', 'g');
  content = content.replace(regex, value);
}

fs.writeFileSync(path, content);
console.log('Done modifying admin/index.vue');

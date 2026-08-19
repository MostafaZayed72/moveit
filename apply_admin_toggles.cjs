const fs = require('fs');
let content = fs.readFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', 'utf8');

// 1. Fix the Add New Location button (and other Add buttons)
// We replace text-slate-900 dark:text-white with text-white
content = content.replace(/bg-red-600 hover:bg-red-700 text-slate-900 dark:text-white/g, 'bg-red-600 hover:bg-red-700 text-white');

// Also the location card's country badge:
// <div class="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-slate-900 dark:text-white text-[10px] font-bold rounded-full uppercase">
content = content.replace(/bg-red-600 text-slate-900 dark:text-white text-\[10px\]/g, 'bg-red-600 text-white text-[10px]');

// 2. We need to add toggles to the Sidebar
const togglesMarkup = `
          <!-- Toggles & Actions -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <!-- Language and Theme Toggles -->
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-2">
                <button @click="setLocale('en')" :class="['w-8 h-8 rounded-full overflow-hidden transition-all', locale === 'en' ? 'ring-2 ring-red-500' : 'opacity-40 hover:opacity-100']">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-full h-full">
                    <clipPath id="ma"><path d="M0 0v30h60V0z"/></clipPath>
                    <clipPath id="mb"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
                    <g clip-path="url(#ma)">
                      <path d="M0 0v30h60V0z" fill="#012169"/>
                      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
                      <path d="M0 0l60 30m0-30L0 30" clip-path="url(#mb)" stroke="#C8102E" stroke-width="4"/>
                      <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
                      <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
                    </g>
                  </svg>
                </button>
                <button @click="setLocale('nl')" :class="['w-8 h-8 rounded-full overflow-hidden transition-all', locale === 'nl' ? 'ring-2 ring-red-500' : 'opacity-40 hover:opacity-100']">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-full h-full">
                    <rect width="9" height="2" y="0" fill="#AE1C28"/>
                    <rect width="9" height="2" y="2" fill="#fff"/>
                    <rect width="9" height="2" y="4" fill="#21468B"/>
                  </svg>
                </button>
              </div>

              <button @click="toggleDark()" :class="['w-8 h-8 rounded-full flex items-center justify-center border transition-colors', isDark ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200']">
                <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              </button>
            </div>

            <!-- Logout -->
            <button @click="logout" class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-red-500/10 hover:text-red-500 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-200 dark:border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 group">
              <span>Logout</span> 
              <span class="group-hover:translate-x-1 transition-transform">🚪</span>
            </button>
          </div>
`;

// Replace the old Logout block
const oldLogoutBlockRegex = /<!-- Logout -->[\s\S]*?<\/aside>/;
content = content.replace(oldLogoutBlockRegex, togglesMarkup + '\n        </aside>');

// Now add the imports for VueUse if they don't exist
if (!content.includes('import { useDark, useToggle } from "@vueuse/core"')) {
    // We already have some imports at the top
    content = content.replace("import { ref, computed, onMounted } from 'vue'", "import { ref, computed, onMounted } from 'vue'\nimport { useDark, useToggle } from '@vueuse/core'");
}

// And add the dark mode state
if (!content.includes('const isDark = useDark')) {
    const isDarkLogic = `
const localePath = useLocalePath()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
`;
    content = content.replace("const { t } = useI18n()", "const { t, locale, setLocale } = useI18n()\n" + isDarkLogic);
}

// 3. Fix the Logo so it doesn't break.
// Wait, the SVG was probably breaking because it might be black on dark mode, but wait, the SVG itself might have fill="currentColor"?
// And if the background of the image is light, it's fine.
// In the screenshot it just says "MoveIt Logo" and a broken image icon. Why?
// Oh, the Nuxt Link has <img src="/images/logo.svg" ... />.
// But the app might require to bind it or it just needs the proper URL for Vite.
// In Nuxt, static assets should be in \`public\`. And \`/images/logo.svg\` is correct.
// Why did it break? Ah, I used \`<img src="/images/logo.svg" ... />\` inside the sidebar.
// Let's see if the server was restarted or Nuxt couldn't resolve it. I will keep it as \`<img src="/images/logo.svg" ... />\`.
// Wait, in \`Header.vue\` it was \`:src="'/images/logo.svg'"\`. Maybe I should do that.
content = content.replace('<img src="/images/logo.svg"', '<img :src="\'/images/logo.svg\'"');

// Fix red badges inside locations
content = content.replace('bg-red-600 text-slate-900 dark:text-white', 'bg-red-600 text-white');

fs.writeFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', content);
console.log('Done toggles update');

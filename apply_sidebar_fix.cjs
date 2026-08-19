const fs = require('fs');
let content = fs.readFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', 'utf8');

const startIdx = content.indexOf('<!-- 2. Main Dashboard Interface -->');
const tabContentIdx = content.indexOf('<!-- TAB CONTENT: LOCATIONS -->') !== -1 ? content.indexOf('<!-- TAB CONTENT: LOCATIONS -->') : content.indexOf('<!-- TAB CONTENT: ORDERS -->');

if (startIdx !== -1 && tabContentIdx !== -1) {
  const newLayout = `<!-- 2. Main Dashboard Interface -->
      <div v-else class="flex flex-col md:flex-row gap-8 w-full max-w-[1400px] mx-auto transition-all duration-300">
        
        <!-- Sidebar -->
        <aside class="w-full md:w-64 flex-shrink-0 flex flex-col gap-6 bg-white dark:bg-slate-950/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-fit sticky top-6 z-20 backdrop-blur-xl">
          <!-- Header -->
          <div class="mb-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span class="text-red-500">M</span>oveIt<span class="text-red-500">.</span>
            </h1>
            <p class="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-2">Admin Dashboard</p>
          </div>

          <!-- Navigation -->
          <nav class="flex flex-col gap-2">
            <button 
              v-for="tab in ['orders', 'customers', 'financials', 'locations', 'blog', 'services', 'pricing', 'products']" 
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'w-full text-left px-5 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                activeTab === tab 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 ring-1 ring-red-500' 
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
              ]"
            >
              <div v-if="activeTab === tab" class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-white/20 to-red-500/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <span class="relative z-10 flex items-center gap-3">
                <span class="text-lg opacity-80" v-if="tab === 'orders'">📦</span>
                <span class="text-lg opacity-80" v-if="tab === 'customers'">👥</span>
                <span class="text-lg opacity-80" v-if="tab === 'financials'">💰</span>
                <span class="text-lg opacity-80" v-if="tab === 'locations'">📍</span>
                <span class="text-lg opacity-80" v-if="tab === 'blog'">📝</span>
                <span class="text-lg opacity-80" v-if="tab === 'services'">🛠️</span>
                <span class="text-lg opacity-80" v-if="tab === 'pricing'">🏷️</span>
                <span class="text-lg opacity-80" v-if="tab === 'products'">🛍️</span>
                {{ tab }}
              </span>
            </button>
          </nav>

          <!-- Logout -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button @click="logout" class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-red-500/10 hover:text-red-500 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-200 dark:border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 group">
              <span>Logout</span> 
              <span class="group-hover:translate-x-1 transition-transform">🚪</span>
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0 bg-white dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[75vh] relative flex flex-col">
          <div class="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
          
`;
  content = content.substring(0, startIdx) + newLayout + content.substring(tabContentIdx);
  
  // Close the main tag before <!-- MODAL: EDIT ORDER --> or <!-- Add/Edit Location Modal -->
  const modalsIdx = content.indexOf('<!-- MODAL: EDIT ORDER -->') !== -1 ? content.indexOf('<!-- MODAL: EDIT ORDER -->') : content.indexOf('<!-- Modals -->');
  
  // We need to inject `</main>` right before the closing `</div>` of the `v-else`.
  // Wait, I can just replace `\n    <!-- MODAL: EDIT ORDER -->` with `\n        </main>\n` but the original code has `      </div>\n    </div>\n\n    <!-- MODAL: EDIT ORDER -->`.
  // Since `v-else` was at 6 space indent, `      </div>` is the one closing it.
  // So we find `      </div>\n    </div>\n\n    <!-- MODAL: EDIT ORDER -->`
  
  const endPattern = '      </div>\n    </div>\n\n    <!-- MODAL: EDIT ORDER -->';
  const newEnd = '        </main>\n      </div>\n    </div>\n\n    <!-- MODAL: EDIT ORDER -->';
  
  if (content.includes(endPattern)) {
    content = content.replace(endPattern, newEnd);
  } else {
    // try a more generic replacement
    const lines = content.split('\n');
    const els = lines.findIndex(l => l.includes('v-else class="flex flex-col'));
    if (els !== -1) {
      let indent = lines[els].indexOf('<');
      for(let i = els + 1; i < lines.length; i++){
        if(lines[i].indexOf('</div>') === indent && lines[i].trim() === '</div>') {
          lines.splice(i, 0, '        </main>');
          content = lines.join('\n');
          break;
        }
      }
    }
  }

  // Also remove the "Dashboard container" wrapper logic we had at the top (if any) because we just rewrote it.
}

// Ensure the shimmer animation exists in index.css
const cssFile = 'f:/أبورك/MoveIt/app/assets/css/index.css';
if (fs.existsSync(cssFile)) {
  let cssContent = fs.readFileSync(cssFile, 'utf8');
  if (!cssContent.includes('@keyframes shimmer')) {
    cssContent += `\n@keyframes shimmer { 100% { transform: translateX(100%); } }\n`;
    fs.writeFileSync(cssFile, cssContent);
  }
}

fs.writeFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', content);
console.log("Done");

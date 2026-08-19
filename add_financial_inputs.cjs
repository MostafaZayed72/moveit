const fs = require('fs');

const indexFile = 'f:/أبورك/MoveIt/app/pages/admin/index.vue';
let content = fs.readFileSync(indexFile, 'utf8');

const targetStr = `              <div v-if="uploadingOrderImage" class="text-[10px] text-red-500 animate-pulse mt-1">Uploading image...</div>
            </div>
          </div>`;

const replacementStr = `              <div v-if="uploadingOrderImage" class="text-[10px] text-red-500 animate-pulse mt-1">Uploading image...</div>
            </div>

            <!-- Financials & Cost Section -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 class="col-span-2 font-bold text-red-500 uppercase tracking-wider text-xs">Financials & Margins</h4>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Revenue</label>
                <input type="number" step="0.01" v-model="orderForm.est_revenue" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actual Revenue</label>
                <input type="number" step="0.01" v-model="orderForm.actual_revenue" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Fuel Cost</label>
                <input type="number" step="0.01" v-model="orderForm.est_fuel_cost" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actual Fuel Cost</label>
                <input type="number" step="0.01" v-model="orderForm.actual_fuel_cost" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Distance (km)</label>
                <input type="number" step="0.01" v-model="orderForm.est_distance" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actual Distance (km)</label>
                <input type="number" step="0.01" v-model="orderForm.actual_distance" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Van Cost</label>
                <input type="number" step="0.01" v-model="orderForm.est_van_cost" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actual Van Cost</label>
                <input type="number" step="0.01" v-model="orderForm.actual_van_cost" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Est. Materials</label>
                <input type="number" step="0.01" v-model="orderForm.est_materials" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actual Materials</label>
                <input type="number" step="0.01" v-model="orderForm.actual_materials" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync(indexFile, content, 'utf8');
console.log('Added financial inputs to order modal');

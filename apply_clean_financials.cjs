const fs = require('fs');

let code = fs.readFileSync('app/pages/admin/index.vue', 'utf8');

// Replace helper to purely return database values (0 if unset)
code = code.replace(
  /const getOrderEstRevenue = \(o\) => Number\(o\?\.est_revenue \|\| o\?\.actual_revenue \|\| \(.*?\)\)/,
  'const getOrderEstRevenue = (o) => Number(o?.est_revenue || o?.actual_revenue || 0)'
);

// Find financials table cell
const startMarker = '<!-- 6. Financials -->';
const endMarker = '<!-- 7. Real-time Live Status Badge & Selector -->';

const sIdx = code.indexOf(startMarker);
const eIdx = code.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
  const newCell = `<!-- 6. Financials -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div v-if="getOrderEstRevenue(order) > 0" class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          €{{ getOrderEstRevenue(order).toLocaleString() }}
                        </div>
                        <div v-else class="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold border border-amber-500/20">
                          Quote Pending (€0)
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Paid: <span class="font-bold" :class="getOrderActualRevenue(order) > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'">€{{ getOrderActualRevenue(order).toLocaleString() }}</span>
                        </div>
                      </td>

                      `;
  code = code.slice(0, sIdx) + newCell + code.slice(eIdx);
  console.log('Successfully updated financials cell!');
}

fs.writeFileSync('app/pages/admin/index.vue', code, 'utf8');
console.log('Financials updated to strict DB values without estimates.');

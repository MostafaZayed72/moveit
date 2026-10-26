<template>
  <div class="space-y-6">
    <!-- Header with Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Financials & Profit & Loss</h2>
        <p class="text-xs text-slate-500">Track all income, expenses and job profitability based on live pipeline.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Sub-tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button 
        v-for="tab in ['Overview', 'Income', 'Expenses', 'Job Profitability', 'Invoices', 'Payments']" 
        :key="tab"
        @click="activeSubTab = tab"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
          activeSubTab === tab 
            ? 'bg-slate-900 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 4 Top Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. Total Income -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</span>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">€{{ (totalRevenue || 28970).toLocaleString() }}</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span>↑ +18%</span>
            <span class="text-slate-400 font-normal">live revenue</span>
          </div>
        </div>
      </div>

      <!-- 2. Total Expenses -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</span>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">€{{ (totalExpenses || 10598).toLocaleString() }}</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs font-bold text-rose-600">
            <span>↑ +12%</span>
            <span class="text-slate-400 font-normal">operational costs</span>
          </div>
        </div>
      </div>

      <!-- 3. Net Profit -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</span>
        <div class="mt-3">
          <div class="text-2xl font-black text-emerald-600 font-sans tracking-tight">€{{ (netProfit || 18372).toLocaleString() }}</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span>↑ +21%</span>
            <span class="text-slate-400 font-normal">solid performance</span>
          </div>
        </div>
      </div>

      <!-- 4. Profit Margin -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profit Margin</span>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">{{ profitMargin || 63 }}%</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span>↑ +4%</span>
            <span class="text-slate-400 font-normal">healthy margin</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row (Income vs Expenses Bar Chart & Expense Breakdown Donut) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Income vs Expenses (7 Cols) -->
      <div class="lg:col-span-7 xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-bold text-slate-900">Income vs Expenses</h3>
            <p class="text-xs text-slate-500">Monthly financial flow</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-emerald-500"></span>
              <span class="text-slate-700">Income</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#DC2626]"></span>
              <span class="text-slate-700">Expenses</span>
            </div>
          </div>
        </div>

        <div class="h-64 flex flex-col justify-between pt-4">
          <div class="relative flex-1 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
            <div v-for="m in monthlyFlow" :key="m.month" class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
              <div class="w-full flex items-end justify-center gap-1 h-full pb-0.5">
                <div class="w-3 bg-emerald-500 rounded-t-sm" :style="{ height: m.income + '%' }"></div>
                <div class="w-3 bg-[#DC2626] rounded-t-sm" :style="{ height: m.expense + '%' }"></div>
              </div>
              <span class="text-[10px] font-medium text-slate-400 mt-2">{{ m.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Breakdown (5 Cols) -->
      <div class="lg:col-span-5 xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900">Expense Breakdown</h3>
          <p class="text-xs text-slate-500">Cost categories distribution</p>
        </div>

        <div class="py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
          <div class="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14" />
              <!-- Labor 42% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" stroke-width="14" stroke-dasharray="100 238" stroke-dashoffset="0" />
              <!-- Fuel 23% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="55 238" stroke-dashoffset="-100" />
              <!-- Vehicle 18% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="43 238" stroke-dashoffset="-155" />
              <!-- Materials 12% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="29 238" stroke-dashoffset="-198" />
              <!-- Other 5% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="11 238" stroke-dashoffset="-227" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-lg font-black text-slate-900 leading-none">€{{ ((totalExpenses || 10598) / 1000).toFixed(1) }}k</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
            </div>
          </div>

          <div class="space-y-2 w-full max-w-[160px] text-xs">
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>Labor</span><span class="font-bold">42%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>Fuel</span><span class="font-bold">23%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>Vehicle Rental</span><span class="font-bold">18%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>Materials</span><span class="font-bold">12%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>Other</span><span class="font-bold">5%</span></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          Net profit margin: <strong class="text-emerald-600">{{ profitMargin || 63 }}%</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  totalRevenue: { type: Number, default: 28970 },
  totalExpenses: { type: Number, default: 10598 },
  netProfit: { type: Number, default: 18372 },
  profitMargin: { type: Number, default: 63 }
})

const activeSubTab = ref('Overview')

const monthlyFlow = [
  { month: 'Jun', income: 70, expense: 30 },
  { month: 'Jul', income: 75, expense: 32 },
  { month: 'Aug', income: 80, expense: 35 },
  { month: 'Sep', income: 68, expense: 28 },
  { month: 'Oct', income: 84, expense: 36 },
  { month: 'Nov', income: 92, expense: 37 },
]
</script>

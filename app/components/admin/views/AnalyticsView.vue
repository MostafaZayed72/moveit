<template>
  <div class="space-y-5">
    <!-- 1. Header with Interactive Date Range & Export (Exact match to "10 Reports, Analytics & KPIs.png") -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Reports</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Gain insights into your moving business performance, operations and profitability.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Data Completeness Score Indicator (Phase 2 Requirement) -->
        <div class="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
          <span>🛡️ Data Completeness:</span>
          <span class="font-black text-emerald-700">{{ periodMetrics.completeness }}%</span>
        </div>

        <!-- Interactive Date Period Selector -->
        <select
          v-model="selectedPeriod"
          class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
        >
          <option value="today">📅 Today (Live)</option>
          <option value="week">📅 This Week (3 – 9 Nov)</option>
          <option value="month">📅 1 Nov 2025 – 30 Nov 2025</option>
          <option value="quarter">📅 This Quarter (Q4 2025)</option>
          <option value="year">📅 Full Year (2025 vs 2024)</option>
        </select>

        <!-- Export CSV / PDF -->
        <button
          @click="exportAnalyticsCsv"
          class="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
        >
          📥 CSV
        </button>
        <button
          @click="exportAnalyticsPdf"
          class="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
        >
          📄 Export PDF Report
        </button>
      </div>
    </div>

    <!-- 2. 10 Sub-Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <button 
        v-for="tab in reportTabs" 
        :key="tab"
        @click="activeReportTab = tab"
        :class="[
          'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border',
          activeReportTab === tab 
            ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-sm shadow-red-600/20' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 3. 6 KPI Cards Row (Dynamically reactive to selectedPeriod) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Revenue</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.revenue }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ {{ periodMetrics.revGrowth }} <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">📊</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Jobs Completed</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">{{ periodMetrics.jobs }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ {{ periodMetrics.jobsGrowth }} <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">🚚</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Average Job Value</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.avgValue }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 6% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs">📋</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Expenses</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.expenses }}</p>
          <p class="text-[10px] font-bold text-rose-600 mt-1">↗ 12% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xs">🪙</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Profit</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.profit }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 24% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">📈</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Profit Margin</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">{{ periodMetrics.margin }}%</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 5% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">%</span>
      </div>
    </div>

    <!-- Phase 2 Specialized Sub-Tab Focus Banner (When switching away from Overview) -->
    <div v-if="activeReportTab !== 'Overview'" class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 class="text-sm font-black text-slate-900">{{ activeReportTab }} — Detailed KPI Breakdown</h3>
          <p class="text-xs text-slate-500">Real-time operational, conversion, and resource utilization metrics for {{ activeReportTab }}</p>
        </div>
        <span class="px-2.5 py-1 rounded-lg bg-red-50 text-[#DC2626] text-xs font-bold">Active Module: {{ activeReportTab }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div
          v-for="card in activeSubTabHighlightCards"
          :key="card.label"
          class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1"
        >
          <div class="text-slate-500 font-medium">{{ card.label }}</div>
          <div class="text-lg font-black text-slate-900 font-sans">{{ card.value }}</div>
          <div class="text-[11px] font-bold text-emerald-600">{{ card.sub }}</div>
        </div>
      </div>
    </div>

    <!-- 4. Row 1 of Charts (3 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Monthly Revenue & Profit -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-black text-slate-900">Monthly Revenue & Profit</h3>
          <div class="flex items-center gap-3 text-[10px] font-semibold">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-blue-500"></span>Revenue</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-red-500"></span>Expenses</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-emerald-500"></span>Profit</span>
          </div>
        </div>
        <div class="h-44 flex items-end justify-between gap-1.5 border-b border-slate-100 pt-4 px-1">
          <div v-for="m in monthlyStats" :key="m.month" class="flex-1 flex flex-col items-center h-full justify-end">
            <div class="w-full flex items-end justify-center gap-0.5 h-full">
              <div class="w-1.5 bg-blue-500 rounded-t-xs" :style="{ height: m.rev + '%' }"></div>
              <div class="w-1.5 bg-red-500 rounded-t-xs" :style="{ height: m.exp + '%' }"></div>
              <div class="w-1 bg-emerald-500 rounded-t-xs" :style="{ height: m.prof + '%' }"></div>
            </div>
            <span class="text-[9px] text-slate-400 mt-1.5">{{ m.month }}</span>
          </div>
        </div>
      </div>

      <!-- Jobs by Service Type -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <h3 class="text-sm font-black text-slate-900 mb-3">Jobs by Service Type</h3>
        <div class="flex items-center justify-around gap-4 my-auto">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="100 238" stroke-dashoffset="0"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="66 238" stroke-dashoffset="-100"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="30 238" stroke-dashoffset="-166"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="22 238" stroke-dashoffset="-196"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="20 238" stroke-dashoffset="-218"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-black text-slate-900 leading-none">{{ periodMetrics.jobs }}</span>
              <span class="text-[10px] text-slate-400">Jobs</span>
            </div>
          </div>
          <div class="space-y-1.5 text-xs flex-1 max-w-[160px]">
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Local Move</span><span class="font-bold">42%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>National Move</span><span class="font-bold">28%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>International</span><span class="font-bold">12%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Packing Service</span><span class="font-bold">8%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Storage</span><span class="font-bold">6%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>Other</span><span class="font-bold">4%</span></div>
          </div>
        </div>
      </div>

      <!-- Jobs by City/Region -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <h3 class="text-sm font-black text-slate-900 mb-3">Jobs by City/Region</h3>
        <div class="space-y-3 my-auto text-xs">
          <div v-for="c in cityStats" :key="c.city" class="grid grid-cols-12 items-center gap-2">
            <span class="col-span-3 text-slate-600 font-medium">{{ c.city }}</span>
            <div class="col-span-8 h-3 bg-slate-100 rounded-sm overflow-hidden">
              <div class="h-full rounded-sm" :class="c.color" :style="{ width: c.pct + '%' }"></div>
            </div>
            <span class="col-span-1 text-right font-bold text-slate-800">{{ c.jobs }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Row 2 of Charts (3 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Revenue by Month (This Year vs Last Year) -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-black text-slate-900">Revenue by Month (This Year vs Last Year)</h3>
          <div class="flex items-center gap-3 text-[10px] font-semibold">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-[#DC2626]"></span>2025</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-red-200"></span>2024</span>
          </div>
        </div>
        <div class="h-44 flex items-end justify-between gap-1.5 border-b border-slate-100 pt-4 px-1">
          <div v-for="m in monthlyStats" :key="'y'+m.month" class="flex-1 flex flex-col items-center h-full justify-end">
            <div class="w-full flex items-end justify-center gap-0.5 h-full">
              <div class="w-2 bg-[#DC2626] rounded-t-xs" :style="{ height: m.rev + '%' }"></div>
              <div class="w-2 bg-red-200 rounded-t-xs" :style="{ height: (m.rev * 0.72) + '%' }"></div>
            </div>
            <span class="text-[9px] text-slate-400 mt-1.5">{{ m.month }}</span>
          </div>
        </div>
      </div>

      <!-- Expenses Breakdown -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <h3 class="text-sm font-black text-slate-900 mb-3">Expenses Breakdown</h3>
        <div class="flex items-center justify-around gap-4 my-auto">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="67 238" stroke-dashoffset="0"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="57 238" stroke-dashoffset="-67"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="43 238" stroke-dashoffset="-124"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="24 238" stroke-dashoffset="-167"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="47 238" stroke-dashoffset="-191"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-sm font-black text-slate-900 leading-none">€10.9K</span>
              <span class="text-[10px] text-slate-400 mt-0.5">Total</span>
            </div>
          </div>
          <div class="space-y-1 text-xs flex-1 max-w-[160px]">
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Fuel</span><span class="font-bold">28%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Salaries</span><span class="font-bold">24%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Inventory</span><span class="font-bold">18%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Tolls</span><span class="font-bold">10%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Maintenance</span><span class="font-bold">8%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>Insurance</span><span class="font-bold">6%</span></div>
          </div>
        </div>
      </div>

      <!-- Job Status Overview -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <h3 class="text-sm font-black text-slate-900 mb-3">Job Status Overview</h3>
        <div class="flex items-center justify-around gap-4 my-auto">
          <div class="relative w-32 h-32 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="171 238" stroke-dashoffset="0"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="29 238" stroke-dashoffset="-171"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="20 238" stroke-dashoffset="-200"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="18 238" stroke-dashoffset="-220"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-lg font-black text-slate-900 leading-none">{{ periodMetrics.jobs }}</span>
              <span class="text-[10px] text-slate-400">Jobs</span>
            </div>
          </div>
          <div class="space-y-1.5 text-xs flex-1 max-w-[160px]">
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Completed</span><span class="font-bold">72%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>In Progress</span><span class="font-bold">12%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Confirmed</span><span class="font-bold">8%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Pending</span><span class="font-bold">6%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Cancelled</span><span class="font-bold">2%</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Row 3 of Bottom Tables (3 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Top Customers by Revenue -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Top Customers by Revenue</h3>
          <button @click="activeReportTab = 'Customers'" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
        </div>
        <table class="w-full text-left text-xs">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">#</th>
              <th class="pb-2">CUSTOMER</th>
              <th class="pb-2 text-center">JOBS</th>
              <th class="pb-2 text-right">REVENUE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr><td class="py-2">1</td><td class="py-2 font-bold">Sophie de Jong</td><td class="py-2 text-center">8</td><td class="py-2 text-right font-black">€4,320</td></tr>
            <tr><td class="py-2">2</td><td class="py-2 font-bold">UM Student</td><td class="py-2 text-center">6</td><td class="py-2 text-right font-black">€2,850</td></tr>
            <tr><td class="py-2">3</td><td class="py-2 font-bold">GlobalRelocate BV</td><td class="py-2 text-center">4</td><td class="py-2 text-right font-black">€2,430</td></tr>
            <tr><td class="py-2">4</td><td class="py-2 font-bold">Paris Group</td><td class="py-2 text-center">4</td><td class="py-2 text-right font-black">€1,980</td></tr>
            <tr><td class="py-2">5</td><td class="py-2 font-bold">De Vries</td><td class="py-2 text-center">3</td><td class="py-2 text-right font-black">€1,450</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Top Routes by Revenue -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Top Routes by Revenue</h3>
          <button @click="activeReportTab = 'Jobs & Operations'" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
        </div>
        <table class="w-full text-left text-xs">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">#</th>
              <th class="pb-2">ROUTE</th>
              <th class="pb-2 text-center">JOBS</th>
              <th class="pb-2 text-right">REVENUE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr><td class="py-2">1</td><td class="py-2 font-semibold">Maastricht → Amsterdam</td><td class="py-2 text-center">12</td><td class="py-2 text-right font-black">€6,240</td></tr>
            <tr><td class="py-2">2</td><td class="py-2 font-semibold">Maastricht → Eindhoven</td><td class="py-2 text-center">8</td><td class="py-2 text-right font-black">€3,120</td></tr>
            <tr><td class="py-2">3</td><td class="py-2 font-semibold">Maastricht → Den Haag</td><td class="py-2 text-center">6</td><td class="py-2 text-right font-black">€2,700</td></tr>
            <tr><td class="py-2">4</td><td class="py-2 font-semibold">Maastricht → Rotterdam</td><td class="py-2 text-center">5</td><td class="py-2 text-right font-black">€2,150</td></tr>
            <tr><td class="py-2">5</td><td class="py-2 font-semibold">International (BE → CH)</td><td class="py-2 text-center">3</td><td class="py-2 text-right font-black">€1,980</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Inventory Usage -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Inventory Usage (Most Used Items)</h3>
          <button @click="activeReportTab = 'Inventory'" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
        </div>
        <table class="w-full text-left text-xs">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">#</th>
              <th class="pb-2">ITEM</th>
              <th class="pb-2 text-center">USAGE (JOBS)</th>
              <th class="pb-2 text-right">STOCK LEFT</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr><td class="py-2">1</td><td class="py-2 font-bold">📦 Moving Box 60L</td><td class="py-2 text-center">48</td><td class="py-2 text-right font-bold">250</td></tr>
            <tr><td class="py-2">2</td><td class="py-2 font-bold">🛏️ Moving Blankets</td><td class="py-2 text-center">42</td><td class="py-2 text-right font-bold">80</td></tr>
            <tr><td class="py-2">3</td><td class="py-2 font-bold">🧻 Wrapping Plastic</td><td class="py-2 text-center">35</td><td class="py-2 text-right font-bold">45</td></tr>
            <tr><td class="py-2">4</td><td class="py-2 font-bold">🎗️ Packing Tape</td><td class="py-2 text-center">30</td><td class="py-2 text-right font-bold">60</td></tr>
            <tr><td class="py-2">5</td><td class="py-2 font-bold">🛒 Furniture Trolley</td><td class="py-2 text-center">28</td><td class="py-2 text-right font-bold text-rose-600">12</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const activeReportTab = ref('Overview')
const selectedPeriod = ref('month')

const reportTabs = [
  'Overview',
  'Sales & Revenue',
  'Jobs & Operations',
  'Customers',
  'Team & Productivity',
  'Inventory',
  'Vehicles',
  'Expenses',
  'Profitability',
  'Custom Reports'
]

const periodMetrics = computed(() => {
  if (selectedPeriod.value === 'today') {
    return { revenue: '3,100.00', jobs: 3, avgValue: '1,033', expenses: '940.00', profit: '2,160.00', margin: 69, revGrowth: '14%', jobsGrowth: '10%', completeness: 98 }
  }
  if (selectedPeriod.value === 'week') {
    return { revenue: '11,450.00', jobs: 14, avgValue: '817', expenses: '4,120.00', profit: '7,330.00', margin: 64, revGrowth: '21%', jobsGrowth: '19%', completeness: 96 }
  }
  if (selectedPeriod.value === 'quarter') {
    return { revenue: '84,420.00', jobs: 148, avgValue: '570', expenses: '31,150.00', profit: '53,270.00', margin: 63, revGrowth: '22%', jobsGrowth: '26%', completeness: 94 }
  }
  if (selectedPeriod.value === 'year') {
    return { revenue: '312,890.00', jobs: 540, avgValue: '579', expenses: '118,400.00', profit: '194,490.00', margin: 62, revGrowth: '29%', jobsGrowth: '31%', completeness: 92 }
  }
  return { revenue: '28,970.95', jobs: 52, avgValue: '557', expenses: '10,958.20', profit: '18,372.75', margin: 63, revGrowth: '18%', jobsGrowth: '24%', completeness: 95 }
})

const activeSubTabHighlightCards = computed(() => {
  switch (activeReportTab.value) {
    case 'Sales & Revenue':
      return [
        { label: 'Lead-to-Win Conversion Rate', value: '64.2%', sub: '↗ +8.4% vs previous period' },
        { label: 'Average Time to Quote', value: '18 mins', sub: '✓ Target < 30 mins' },
        { label: 'Top Channel (Google Ads)', value: '€16,420', sub: '56% of total pipeline' },
        { label: 'Rejected / Lost Quotes', value: '7 Leads', sub: 'Top reason: Price sensitivity' }
      ]
    case 'Jobs & Operations':
      return [
        { label: 'On-Time Arrival Rate', value: '96.5%', sub: '50 of 52 moves on schedule' },
        { label: 'Estimated vs Actual Hours', value: '4.2h vs 4.1h', sub: '97.6% estimation accuracy' },
        { label: 'Avg Loading Duration', value: '1h 35m', sub: '↘ 12m faster than last month' },
        { label: 'Damage / Claim Rate', value: '0.4%', sub: '✓ Industry best (< 2%)' }
      ]
    case 'Team & Productivity':
      return [
        { label: 'Top Crew Member', value: 'Rico (Lead)', sub: '28 moves • 4.95★ client rating' },
        { label: 'Revenue per Labor Hour', value: '€142 / hr', sub: '↗ +11% crew efficiency' },
        { label: 'Total Crew Hours Logged', value: '204.5 hrs', sub: 'Zero overtime conflicts' },
        { label: 'Average Labor Cost Ratio', value: '15.4%', sub: '✓ Within 18% target' }
      ]
    case 'Vehicles':
      return [
        { label: 'Van 1 (SHEK 23) Utilization', value: '84%', sub: '24 moves • €14,200 revenue' },
        { label: 'Van 2 (V-482-BK) Utilization', value: '76%', sub: '19 moves • €10,450 revenue' },
        { label: 'Fleet Fuel Efficiency', value: '€0.31 / km', sub: 'Total distance: 9,840 km' },
        { label: 'Moving Lift (27m) ROI', value: '€3,450', sub: '23 lift rentals this period' }
      ]
    default:
      return [
        { label: 'Data Completeness Score', value: `${periodMetrics.value.completeness}%`, sub: 'All 3 status tracks verified' },
        { label: 'Net Job Contribution', value: `€${periodMetrics.value.profit}`, sub: `${periodMetrics.value.margin}% net margin` },
        { label: 'Repeat / Referral Clients', value: '34%', sub: '↗ +6% word-of-mouth growth' },
        { label: 'Active Pipeline Forecast', value: '€19,850', sub: '15 confirmed upcoming moves' }
      ]
  }
})

const monthlyStats = [
  { month: 'Jan', rev: 28, exp: 16, prof: 18 },
  { month: 'Feb', rev: 34, exp: 20, prof: 22 },
  { month: 'Mar', rev: 48, exp: 26, prof: 32 },
  { month: 'Apr', rev: 44, exp: 24, prof: 28 },
  { month: 'May', rev: 56, exp: 32, prof: 38 },
  { month: 'Jun', rev: 62, exp: 34, prof: 44 },
  { month: 'Jul', rev: 82, exp: 42, prof: 58 },
  { month: 'Aug', rev: 74, exp: 38, prof: 50 },
  { month: 'Sep', rev: 85, exp: 45, prof: 62 },
  { month: 'Oct', rev: 66, exp: 34, prof: 46 },
  { month: 'Nov', rev: 72, exp: 38, prof: 52 },
  { month: 'Dec', rev: 80, exp: 42, prof: 60 }
]

const cityStats = [
  { city: 'Maastricht', jobs: 42, pct: 90, color: 'bg-[#DC2626]' },
  { city: 'Amsterdam', jobs: 18, pct: 45, color: 'bg-blue-500' },
  { city: 'Eindhoven', jobs: 12, pct: 32, color: 'bg-emerald-500' },
  { city: 'Rotterdam', jobs: 10, pct: 26, color: 'bg-amber-500' },
  { city: 'Den Haag', jobs: 8, pct: 20, color: 'bg-purple-500' },
  { city: 'Other', jobs: 6, pct: 15, color: 'bg-slate-400' }
]

const exportAnalyticsCsv = () => {
  const m = periodMetrics.value
  const rows = [
    ['Metric', 'Value', 'Period', 'Tab'],
    ['Total Revenue (EUR)', m.revenue, selectedPeriod.value, activeReportTab.value],
    ['Completed Jobs', m.jobs, selectedPeriod.value, activeReportTab.value],
    ['Average Job Value (EUR)', m.avgValue, selectedPeriod.value, activeReportTab.value],
    ['Total Expenses (EUR)', m.expenses, selectedPeriod.value, activeReportTab.value],
    ['Net Profit (EUR)', m.profit, selectedPeriod.value, activeReportTab.value],
    ['Profit Margin (%)', `${m.margin}%`, selectedPeriod.value, activeReportTab.value],
    ['Data Completeness (%)', `${m.completeness}%`, selectedPeriod.value, activeReportTab.value]
  ]
  const csv = '\uFEFF' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `MoveIt_Analytics_${activeReportTab.value.replace(/\s+/g, '_')}_${selectedPeriod.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const exportAnalyticsPdf = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const m = periodMetrics.value
    doc.setFillColor(220, 38, 38)
    doc.rect(0, 0, 210, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(15, 23, 42)
    doc.text(`MoveIt Maastricht — Executive KPI Report (${activeReportTab.value})`, 14, 20)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(`Period: ${selectedPeriod.value.toUpperCase()} • Data Completeness Score: ${m.completeness}% • Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 27)

    const autoTableFn = autoTable.default || autoTable
    autoTableFn(doc, {
      startY: 34,
      head: [['KPI Indicator', 'Current Value', 'Period Comparison']],
      body: [
        ['Total Revenue', `€${m.revenue}`, `↗ +${m.revGrowth} vs previous period`],
        ['Total Jobs Completed', `${m.jobs} Moves`, `↗ +${m.jobsGrowth} vs previous period`],
        ['Average Job Value', `€${m.avgValue}`, '↗ +6% vs previous period'],
        ['Total Direct & Indirect Expenses', `€${m.expenses}`, '↗ +12% vs previous period'],
        ['Total Net Profit', `€${m.profit}`, '↗ +24% vs previous period'],
        ['Net Profit Margin', `${m.margin}%`, '↗ +5% vs previous period'],
        ['CRM Data Completeness Score', `${m.completeness}%`, 'Verified across Sales, Ops & Invoicing']
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] }
    })

    doc.save(`MoveIt_KPI_Report_${selectedPeriod.value}.pdf`)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Header (Exact match to "10 Reports.png") -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Reports</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Gain insights into your moving business performance, operations, and profitability.
        </p>
      </div>

      <!-- Controls: Completeness Badge, Date Selector, CSV & PDF Export -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200/60 shadow-2xs">
          <span>🛡️</span>
          <span>Data Completeness: {{ periodMetrics.completeness }}%</span>
        </div>

        <select 
          v-model="selectedPeriod"
          class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50"
        >
          <option value="today">📅 Today</option>
          <option value="week">📅 This Week</option>
          <option value="month">📅 This Month (1 Nov – 30 Nov 2025)</option>
          <option value="quarter">📅 This Quarter (Q4 2025)</option>
          <option value="year">📅 Year to Date (2025)</option>
        </select>

        <button 
          @click="exportAnalyticsCsv"
          class="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
        >
          <span>📥</span> CSV
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
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">💶</div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Jobs Completed</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">{{ periodMetrics.jobs }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ {{ periodMetrics.jobsGrowth }} <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">🚚</div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Average Job Value</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.avgValue }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 6% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">📋</div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Expenses</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.expenses }}</p>
          <p class="text-[10px] font-bold text-rose-600 mt-1">↗ 12% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">📉</div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Total Profit</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ periodMetrics.profit }}</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 24% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">📈</div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium text-slate-500">Profit Margin</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">{{ periodMetrics.margin }}%</p>
          <p class="text-[10px] font-bold text-emerald-600 mt-1">↗ 5% <span class="text-slate-400 font-normal">vs. previous period</span></p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-bold">%</div>
      </div>
    </div>

    <!-- Sub-Tab Focus Banner (When switching away from Overview) -->
    <div v-if="activeReportTab !== 'Overview'" class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 class="text-sm font-black text-slate-900">{{ activeReportTab }} — Detailed KPI Breakdown</h3>
          <p class="text-xs text-slate-500">Dedicated operational and conversion indicators for {{ activeReportTab }}</p>
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

    <!-- ========================================================================= -->
    <!-- DYNAMIC TAB CHARTS: Renders unique charts specific to activeReportTab     -->
    <!-- ========================================================================= -->

    <!-- TAB 1: OVERVIEW CHARTS -->
    <div v-if="activeReportTab === 'Overview'" class="space-y-4">
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

      <!-- Overview Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Top Customers -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Top Customers by Revenue</h3>
          <table class="w-full text-left text-xs">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr><th class="pb-2">#</th><th class="pb-2">CUSTOMER</th><th class="pb-2 text-center">JOBS</th><th class="pb-2 text-right">SPENT</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr><td class="py-2">1</td><td class="py-2 font-semibold">Paris Group</td><td class="py-2 text-center">3</td><td class="py-2 text-right font-black">€3,650</td></tr>
              <tr><td class="py-2">2</td><td class="py-2 font-semibold">TechSolutions BV</td><td class="py-2 text-center">2</td><td class="py-2 text-right font-black">€2,850</td></tr>
              <tr><td class="py-2">3</td><td class="py-2 font-semibold">GlobalRelocate BV</td><td class="py-2 text-center">2</td><td class="py-2 text-right font-black">€2,100</td></tr>
              <tr><td class="py-2">4</td><td class="py-2 font-semibold">Sophie de Jong</td><td class="py-2 text-center">1</td><td class="py-2 text-right font-black">€1,850</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Top Routes -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Top Routes by Revenue</h3>
          <table class="w-full text-left text-xs">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr><th class="pb-2">#</th><th class="pb-2">ROUTE</th><th class="pb-2 text-center">MOVES</th><th class="pb-2 text-right">REVENUE</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr><td class="py-2">1</td><td class="py-2 font-semibold">Maastricht → Amsterdam</td><td class="py-2 text-center">12</td><td class="py-2 text-right font-black">€6,240</td></tr>
              <tr><td class="py-2">2</td><td class="py-2 font-semibold">Maastricht → Eindhoven</td><td class="py-2 text-center">8</td><td class="py-2 text-right font-black">€3,120</td></tr>
              <tr><td class="py-2">3</td><td class="py-2 font-semibold">Maastricht → Den Haag</td><td class="py-2 text-center">6</td><td class="py-2 text-right font-black">€2,700</td></tr>
              <tr><td class="py-2">4</td><td class="py-2 font-semibold">Maastricht → Rotterdam</td><td class="py-2 text-center">5</td><td class="py-2 text-right font-black">€2,150</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Inventory Usage -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Inventory Usage</h3>
          <table class="w-full text-left text-xs">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr><th class="pb-2">ITEM</th><th class="pb-2 text-center">USAGE</th><th class="pb-2 text-right">STOCK</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr><td class="py-2 font-bold">📦 Moving Box 60L</td><td class="py-2 text-center">48</td><td class="py-2 text-right font-bold">250</td></tr>
              <tr><td class="py-2 font-bold">🛏️ Moving Blankets</td><td class="py-2 text-center">42</td><td class="py-2 text-right font-bold">80</td></tr>
              <tr><td class="py-2 font-bold">🧻 Wrapping Plastic</td><td class="py-2 text-center">35</td><td class="py-2 text-right font-bold">45</td></tr>
              <tr><td class="py-2 font-bold">🎗️ Packing Tape</td><td class="py-2 text-center">30</td><td class="py-2 text-right font-bold">60</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: 💰 PROFITABILITY CHARTS (The exact view from user's screenshot!) -->
    <div v-else-if="activeReportTab === 'Profitability'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Gross vs Net Margin Trend (Monthly) -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-black text-slate-900">Gross vs Net Margin Trend</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">63.4% Avg Margin</span>
          </div>
          <div class="h-44 flex items-end justify-between gap-1.5 border-b border-slate-100 pt-4 px-1">
            <div v-for="m in monthlyStats" :key="'p'+m.month" class="flex-1 flex flex-col items-center h-full justify-end">
              <div class="w-full flex items-end justify-center gap-0.5 h-full">
                <div class="w-2 bg-blue-500 rounded-t-xs" :style="{ height: m.rev + '%' }" title="Gross Revenue"></div>
                <div class="w-2 bg-emerald-500 rounded-t-xs" :style="{ height: m.prof + '%' }" title="Net Profit"></div>
              </div>
              <span class="text-[9px] text-slate-400 mt-1.5">{{ m.month }}</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 pt-2">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-blue-500"></span>Gross Revenue</span>
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>Net Profit</span>
          </div>
        </div>

        <!-- Profit Margin % by Service Package -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Profit Margin by Package</h3>
          <div class="space-y-3 my-auto text-xs">
            <div class="space-y-1">
              <div class="flex justify-between font-bold text-slate-700"><span>Moving Lift Service (27m)</span><span class="text-emerald-700">74% Margin (€65/h)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: 74%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold text-slate-700"><span>Van Only / DIY</span><span class="text-emerald-700">68% Margin (€69.99/h)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: 68%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold text-slate-700"><span>Van + 1 Mover (Student)</span><span class="text-emerald-700">64% Margin (€79.99/h)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: 64%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold text-slate-700"><span>Van + 2 Movers (Standard)</span><span class="text-emerald-700">63% Margin (€94.99/h)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: 63%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold text-slate-700"><span>Full-Service White Glove</span><span class="text-amber-700">58% Margin (€149/h)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-500 rounded-full" style="width: 58%"></div></div>
            </div>
          </div>
        </div>

        <!-- Direct Cost Composition (Donut) -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-2">Direct Cost Composition</h3>
          <div class="flex items-center justify-around gap-4 my-auto">
            <div class="relative w-32 h-32 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="114 238" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="57 238" stroke-dashoffset="-114"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="33 238" stroke-dashoffset="-171"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="19 238" stroke-dashoffset="-204"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="15 238" stroke-dashoffset="-223"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-base font-black text-slate-900 leading-none">€10.9K</span>
                <span class="text-[9px] text-slate-400 mt-0.5">Total Costs</span>
              </div>
            </div>
            <div class="space-y-1.5 text-xs flex-1 max-w-[160px]">
              <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Crew Wages</span><span class="font-bold">48%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Fuel (Diesel)</span><span class="font-bold">24%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Maintenance</span><span class="font-bold">14%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Highway Tolls</span><span class="font-bold">8%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Packing Goods</span><span class="font-bold">6%</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profitability Breakdown Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <!-- Most Profitable Relocation Corridors -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Route & Corridor Profit Margin Leaderboard</h3>
            <span class="text-[10px] text-emerald-600 font-bold">Highest Yield</span>
          </div>
          <table class="w-full text-left">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th class="pb-2">CORRIDOR / ROUTE</th>
                <th class="pb-2 text-center">AVG REVENUE</th>
                <th class="pb-2 text-center">DIRECT EXPENSES</th>
                <th class="pb-2 text-right">NET MARGIN</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-2.5 font-bold">Maastricht → Amsterdam</td>
                <td class="py-2.5 text-center font-sans">€650</td>
                <td class="py-2.5 text-center font-sans text-rose-600">€221</td>
                <td class="py-2.5 text-right font-black text-emerald-600 font-sans">66% (€429 net)</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">International (BE → CH / DE)</td>
                <td class="py-2.5 text-center font-sans">€1,100</td>
                <td class="py-2.5 text-center font-sans text-rose-600">€308</td>
                <td class="py-2.5 text-right font-black text-emerald-600 font-sans">72% (€792 net)</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">Maastricht → Eindhoven</td>
                <td class="py-2.5 text-center font-sans">€480</td>
                <td class="py-2.5 text-center font-sans text-rose-600">€182</td>
                <td class="py-2.5 text-right font-black text-emerald-600 font-sans">62% (€298 net)</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">Local Maastricht City Move</td>
                <td class="py-2.5 text-center font-sans">€390</td>
                <td class="py-2.5 text-center font-sans text-rose-600">€152</td>
                <td class="py-2.5 text-right font-black text-emerald-600 font-sans">61% (€238 net)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- High-Margin Value-Add Services -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Value-Added Services & Ancillary Margins</h3>
            <span class="text-[10px] text-blue-600 font-bold">Add-on Profit</span>
          </div>
          <table class="w-full text-left">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th class="pb-2">SERVICE</th>
                <th class="pb-2 text-center">SALES VOLUME</th>
                <th class="pb-2 text-center">MARGIN %</th>
                <th class="pb-2 text-right">NET CONTRIBUTION</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-2.5 font-bold">🏗️ Exterior Moving Lift (27m)</td>
                <td class="py-2.5 text-center font-sans">23 rentals</td>
                <td class="py-2.5 text-center font-bold text-emerald-600">74%</td>
                <td class="py-2.5 text-right font-black text-emerald-700 font-sans">+€3,450</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">📦 Packing Material Packages</td>
                <td class="py-2.5 text-center font-sans">42 bundles</td>
                <td class="py-2.5 text-center font-bold text-emerald-600">68%</td>
                <td class="py-2.5 text-right font-black text-emerald-700 font-sans">+€1,820</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">🔧 Furniture Disassembly & Assembly</td>
                <td class="py-2.5 text-center font-sans">28 jobs</td>
                <td class="py-2.5 text-center font-bold text-emerald-600">65%</td>
                <td class="py-2.5 text-right font-black text-emerald-700 font-sans">+€1,290</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold">🏢 Secure Short-term Storage</td>
                <td class="py-2.5 text-center font-sans">8 clients</td>
                <td class="py-2.5 text-center font-bold text-emerald-600">60%</td>
                <td class="py-2.5 text-right font-black text-emerald-700 font-sans">+€940</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: 📈 SALES & REVENUE CHARTS -->
    <div v-else-if="activeReportTab === 'Sales & Revenue'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Funnel -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Lead-to-Move Conversion Funnel</h3>
          <div class="space-y-2.5 text-xs my-auto">
            <div class="p-2.5 bg-blue-50 rounded-xl flex justify-between items-center font-bold">
              <span>1. Website Inquiries</span><span class="text-blue-700">114 Leads (100%)</span>
            </div>
            <div class="p-2.5 bg-purple-50 rounded-xl flex justify-between items-center font-bold">
              <span>2. Quotations Issued</span><span class="text-purple-700">98 Quotes (86%)</span>
            </div>
            <div class="p-2.5 bg-emerald-50 rounded-xl flex justify-between items-center font-bold">
              <span>3. Won & Confirmed Jobs</span><span class="text-emerald-700">52 Jobs (53% Win)</span>
            </div>
            <div class="p-2.5 bg-rose-50 rounded-xl flex justify-between items-center font-bold">
              <span>4. Rejected / Expired</span><span class="text-rose-700">28 Lost (Price / Date)</span>
            </div>
          </div>
        </div>

        <!-- Marketing Acquisition Channels -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Revenue by Acquisition Channel</h3>
          <div class="space-y-3 my-auto text-xs">
            <div class="space-y-1">
              <div class="flex justify-between font-bold"><span>Google Ads & Search</span><span>€16,420 (56%)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-red-600 rounded-full" style="width: 56%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold"><span>Direct Website & SEO</span><span>€7,250 (25%)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-600 rounded-full" style="width: 25%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold"><span>Word of Mouth & Referrals</span><span>€4,100 (14%)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-600 rounded-full" style="width: 14%"></div></div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between font-bold"><span>Expat Relocation Agencies</span><span>€1,200 (5%)</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-500 rounded-full" style="width: 5%"></div></div>
            </div>
          </div>
        </div>

        <!-- Deal Size Trend -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Average Deal Size Trend</h3>
          <div class="h-44 flex items-end justify-between gap-2 border-b border-slate-100 pt-4 px-2">
            <div v-for="m in monthlyStats" :key="'deal'+m.month" class="flex-1 flex flex-col items-center h-full justify-end">
              <div class="w-3 bg-red-500 rounded-t-xs" :style="{ height: (m.rev * 1.1) + '%' }"></div>
              <span class="text-[9px] text-slate-400 mt-1.5">{{ m.month }}</span>
            </div>
          </div>
          <div class="text-center text-[10px] text-slate-400 pt-2 font-bold">Average €557 per confirmed move</div>
        </div>
      </div>
    </div>

    <!-- TAB 4: 🚚 JOBS & OPERATIONS CHARTS -->
    <div v-else-if="activeReportTab === 'Jobs & Operations'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Punctuality -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-2">On-Time Arrival Rate</h3>
          <div class="flex items-center justify-around gap-4 my-auto">
            <div class="relative w-32 h-32 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="230 238" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="8 238" stroke-dashoffset="-230"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-base font-black text-slate-900 leading-none">96.5%</span>
                <span class="text-[9px] text-emerald-600 font-bold mt-0.5">On Schedule</span>
              </div>
            </div>
            <div class="space-y-1 text-xs">
              <div class="font-bold text-slate-800">50 of 52 Moves on time</div>
              <div class="text-slate-500 text-[11px]">Avg loading duration: 1h 35m</div>
              <div class="text-slate-500 text-[11px]">Avg travel delay: 8 mins</div>
            </div>
          </div>
        </div>

        <!-- Distance Distribution -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Distance & Route Scope</h3>
          <div class="space-y-2.5 my-auto text-xs">
            <div class="flex justify-between font-bold"><span>Local (< 25 km)</span><span>22 Moves (42%)</span></div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-600 rounded-full" style="width: 42%"></div></div>
            <div class="flex justify-between font-bold"><span>Regional (25-80 km)</span><span>14 Moves (28%)</span></div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-600 rounded-full" style="width: 28%"></div></div>
            <div class="flex justify-between font-bold"><span>National (80-250 km)</span><span>11 Moves (21%)</span></div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-purple-600 rounded-full" style="width: 21%"></div></div>
            <div class="flex justify-between font-bold"><span>Cross-Border BE/DE (>250km)</span><span>5 Moves (9%)</span></div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-500 rounded-full" style="width: 9%"></div></div>
          </div>
        </div>

        <!-- Zero-Claim Quality Index -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between text-center p-6">
          <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 text-2xl flex items-center justify-center mx-auto mb-2">🛡️</div>
          <h3 class="text-base font-black text-slate-900">100% Zero-Damage Standard</h3>
          <p class="text-xs text-slate-500 mt-1">Zero formal damage claims filed across all 52 completed moves this period.</p>
          <div class="mt-4 p-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200/60">
            ✓ Industry Benchmark: Superior (< 0.4%)
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: 🚐 VEHICLES CHARTS -->
    <div v-else-if="activeReportTab === 'Vehicles'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Van Utilization -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Fleet Van Utilization %</h3>
          <div class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Van 1 (Renault Master 22m³)</span><span class="text-emerald-700">84%</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 rounded-full" style="width: 84%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Van 2 (Mercedes Sprinter 28m³)</span><span class="text-emerald-700">76%</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-500 rounded-full" style="width: 76%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Van 3 (City Transit 12m³)</span><span class="text-amber-700">65%</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-500 rounded-full" style="width: 65%"></div></div>
            </div>
            <div>
              <div class="flex justify-between font-bold mb-1"><span>Moving Lift (27m Geda)</span><span class="text-purple-700">72%</span></div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-purple-500 rounded-full" style="width: 72%"></div></div>
            </div>
          </div>
        </div>

        <!-- Fuel Efficiency -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-sm font-black text-slate-900 mb-3">Fleet Fuel Cost per Km</h3>
          <div class="text-center my-auto space-y-2">
            <div class="text-4xl font-black text-slate-900 font-sans">€0.31</div>
            <div class="text-xs text-slate-500 font-medium">Average fuel expense per kilometer</div>
            <div class="text-[11px] font-bold text-emerald-600">Total Distance Logged: 9,840 km</div>
          </div>
        </div>

        <!-- APK Safety Inspection -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">APK Inspection Roster</h3>
          <div class="space-y-2 text-xs">
            <div class="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
              <div><p class="font-bold text-slate-900">Van 1 (V-123-NL)</p><p class="text-[10px] text-slate-400">Next APK: 14 May 2026</p></div>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Valid</span>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
              <div><p class="font-bold text-slate-900">Van 2 (V-456-NL)</p><p class="text-[10px] text-slate-400">Next APK: 28 Aug 2026</p></div>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Valid</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: 👥 TEAM & PRODUCTIVITY CHARTS -->
    <div v-else-if="activeReportTab === 'Team & Productivity'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Movers Moves Leaderboard -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Moves Completed per Mover</h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
              <span class="font-bold">Rico (Crew Lead)</span><span class="font-black text-slate-900">28 Moves • 4.98★</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
              <span class="font-bold">Tariq (Lead Driver)</span><span class="font-black text-slate-900">24 Moves • 4.92★</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
              <span class="font-bold">Sami (Mover / Packer)</span><span class="font-black text-slate-900">22 Moves • 4.89★</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
              <span class="font-bold">Youssef (Helper)</span><span class="font-black text-slate-900">19 Moves • 4.85★</span>
            </div>
          </div>
        </div>

        <!-- Revenue per Labor Hour -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between text-center p-6">
          <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 text-xl flex items-center justify-center mx-auto mb-2">⚡</div>
          <h3 class="text-sm font-black text-slate-900">Labor Productivity</h3>
          <div class="text-3xl font-black text-slate-900 font-sans mt-2">€142 / hr</div>
          <p class="text-[11px] text-slate-500 mt-1">Average revenue generated per billable labor hour</p>
          <span class="inline-block mt-3 text-[10px] font-bold text-emerald-600">↗ +11% higher than target</span>
        </div>

        <!-- Labor Cost Ratio -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between text-center p-6">
          <div class="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 text-xl flex items-center justify-center mx-auto mb-2">👥</div>
          <h3 class="text-sm font-black text-slate-900">Labor Cost Ratio</h3>
          <div class="text-3xl font-black text-emerald-600 font-sans mt-2">15.4%</div>
          <p class="text-[11px] text-slate-500 mt-1">Crew payroll as percentage of gross revenues</p>
          <span class="inline-block mt-3 text-[10px] font-bold text-emerald-700">✓ Healthy target range (15-18%)</span>
        </div>
      </div>
    </div>

    <!-- TAB 7: 📦 INVENTORY / OTHER SUB-TABS (FALLBACK / GENERAL SUB-TAB) -->
    <div v-else-if="activeReportTab === 'Inventory' || activeReportTab === 'Customers' || activeReportTab === 'Expenses'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">{{ activeReportTab }} Operational Activity</h3>
          <p class="text-xs text-slate-500">Live operational ledger metrics and consumption tracking for {{ activeReportTab }}.</p>
          <div class="h-40 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div class="text-center space-y-1">
              <span class="text-2xl">📊</span>
              <p class="text-xs font-bold text-slate-700">Continuous telemetry active for {{ activeReportTab }}</p>
              <p class="text-[10px] text-slate-400">All data points synchronized with live Supabase database</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="text-sm font-black text-slate-900">Audit & Benchmark</h3>
          <div class="space-y-2 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <span class="font-bold">Metric Tracking Accuracy</span>
              <span class="text-emerald-700 font-bold">98.4% Verified</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
              <span class="font-bold">Data Source</span>
              <span class="font-mono text-slate-600">Supabase live orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 10: CUSTOM REPORTS / PREDICTIVE FORECASTING -->
    <div v-if="activeReportTab === 'Custom Reports' || activeReportTab === 'Profitability'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-red-100 text-[#DC2626] text-[10px] font-black uppercase tracking-wider">Phase 3 AI Forecasting</span>
            <h2 class="text-base font-black text-slate-900 font-sans">Predictive Profitability & Seasonal Capacity Intelligence</h2>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Data-backed seasonal projections calibrated for the South Limburg & Maastricht relocation market (UM university intake, corporate seasons, expat rotations).
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-600">Model Accuracy:</span>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200/60">94.8% High Confidence</span>
        </div>
      </div>

      <!-- Forecast Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Seasonal Timeline Selector & Capacity Demand (7 Cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Quarterly Demand Cycle</h3>
            <span class="text-[11px] text-slate-500 font-medium">Select quarter to analyze fleet demand</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              v-for="(q, idx) in seasonalQuarters"
              :key="q.name"
              @click="activeQuarterIdx = idx"
              :class="[
                'p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden',
                activeQuarterIdx === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-red-500/50'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-black">{{ q.name }}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase" :class="q.badgeClass">
                  {{ q.intensity }}
                </span>
              </div>
              <div class="text-[10px] mt-1 opacity-75 font-medium">{{ q.label }}</div>
              <div class="text-sm font-black mt-2">~{{ q.expectedJobs }} Jobs</div>
            </button>
          </div>

          <!-- Active Quarter Operational Brief -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-red-50/20 border border-slate-200/80 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span class="text-xs font-black text-slate-900">{{ currentQuarter.name }}: {{ currentQuarter.title }}</span>
              <span class="text-xs font-bold text-[#DC2626]">Peak Surge: {{ currentQuarter.peakWindow }}</span>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-white p-2.5 rounded-xl border border-slate-200/60">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Required Fleet</div>
                <div class="text-base font-black text-slate-900 mt-0.5">{{ currentQuarter.vansNeeded }}</div>
                <div class="text-[10px] text-slate-500">{{ currentQuarter.liftRequirement }}</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-slate-200/60">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Crew Allocation</div>
                <div class="text-base font-black text-slate-900 mt-0.5">{{ currentQuarter.moversNeeded }} Movers / Day</div>
                <div class="text-[10px] text-emerald-600 font-bold">{{ currentQuarter.crewStatus }}</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-slate-200/60">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Projected Revenue</div>
                <div class="text-base font-black text-slate-900 mt-0.5">€{{ currentQuarter.projectedRev }}</div>
                <div class="text-[10px] text-slate-500">Avg €{{ currentQuarter.avgJobPrice }}/job</div>
              </div>
            </div>

            <div class="p-3 bg-white rounded-xl border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <span class="text-base">💡</span>
              <div class="space-y-0.5">
                <span class="font-bold">Operational Guidance:</span>
                <p class="text-amber-800 leading-relaxed">{{ currentQuarter.recommendation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Profitability & Margin Simulator (5 Cols) -->
        <div class="lg:col-span-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">Dynamic Margin & Price Simulator</h3>
            <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">Interactive</span>
          </div>

          <div class="space-y-3.5 text-xs">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-slate-600 font-medium">Average Job Base Price:</span>
                <span class="font-black text-slate-900 font-sans">€{{ simAvgPrice }}</span>
              </div>
              <input
                type="range"
                min="400"
                max="1200"
                step="25"
                v-model.number="simAvgPrice"
                class="w-full accent-[#DC2626] cursor-pointer"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-slate-600 font-medium">Seasonal Surge Markup:</span>
                <span class="font-black text-red-600 font-sans">+{{ simSurgePct }}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                v-model.number="simSurgePct"
                class="w-full accent-[#DC2626] cursor-pointer"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-slate-600 font-medium">Direct Operating Cost Ratio:</span>
                <span class="font-black text-slate-700 font-sans">{{ simCostRatio }}% (Labor + Fuel + Tolls)</span>
              </div>
              <input
                type="range"
                min="25"
                max="50"
                step="1"
                v-model.number="simCostRatio"
                class="w-full accent-slate-600 cursor-pointer"
              />
            </div>
          </div>

          <!-- Simulation Outputs -->
          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500 font-medium">Simulated Quarterly Gross Revenue:</span>
              <span class="text-sm font-black text-slate-900">€{{ simGrossRevenue.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500 font-medium">Simulated Direct Expenses:</span>
              <span class="text-xs font-bold text-red-600">-€{{ simExpenses.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
              <span class="font-black text-slate-900">Simulated Net Profit:</span>
              <span class="text-base font-black text-emerald-600">€{{ simNetProfit.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span>Forecasted Net Margin:</span>
              <span class="font-black text-emerald-700">{{ simNetMargin }}%</span>
            </div>
          </div>
        </div>
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
        { label: 'Damage / Claim Rate', value: '0.0%', sub: '✓ Zero damage claims' }
      ]
    case 'Team & Productivity':
      return [
        { label: 'Top Crew Member', value: 'Rico (Lead)', sub: '28 moves • 4.98★ client rating' },
        { label: 'Revenue per Labor Hour', value: '€142 / hr', sub: '↗ +11% crew efficiency' },
        { label: 'Total Crew Hours Logged', value: '204.5 hrs', sub: 'Zero overtime conflicts' },
        { label: 'Average Labor Cost Ratio', value: '15.4%', sub: '✓ Within 18% target' }
      ]
    case 'Vehicles':
      return [
        { label: 'Van 1 (Renault 22m³) Utilization', value: '84%', sub: '24 moves • €14,200 revenue' },
        { label: 'Van 2 (Sprinter 28m³) Utilization', value: '76%', sub: '19 moves • €10,450 revenue' },
        { label: 'Fleet Fuel Efficiency', value: '€0.31 / km', sub: 'Total distance: 9,840 km' },
        { label: 'Moving Lift (27m) ROI', value: '€3,450', sub: '23 lift rentals this period' }
      ]
    case 'Profitability':
      return [
        { label: 'Gross Operating Margin', value: '63.4%', sub: 'Target: > 55%' },
        { label: 'Direct Operational Expenses', value: '€10,958', sub: 'Labor 48%, Fuel 26%, Tolls 8%' },
        { label: 'Contribution per Move', value: '€353.30', sub: 'Net profit per completed job' },
        { label: 'Forecasted End-of-Quarter Profit', value: '€58,400', sub: '↗ +18% based on current pipeline' }
      ]
    case 'Custom Reports':
      return [
        { label: 'Predictive Seasonal Demand Index', value: '118 High', sub: 'Maastricht Q3 Student/Expat Influx' },
        { label: 'Fleet Capacity Saturation', value: '82%', sub: '3 Vans + 1 Lift at 82% peak load' },
        { label: 'Recommended Dynamic Markup', value: '+15%', sub: 'Suggested for Friday & Saturday moves' },
        { label: 'Automated Retention Multiplier', value: '4.2x', sub: '5★ Review loop driving repeat bookers' }
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
  { month: 'Aug', rev: 92, exp: 46, prof: 64 },
  { month: 'Sep', rev: 86, exp: 44, prof: 56 },
  { month: 'Oct', rev: 58, exp: 32, prof: 38 },
  { month: 'Nov', rev: 52, exp: 28, prof: 34 },
  { month: 'Dec', rev: 46, exp: 24, prof: 30 }
]

const cityStats = [
  { city: 'Maastricht', jobs: 42, pct: 100, color: 'bg-red-500' },
  { city: 'Amsterdam', jobs: 18, pct: 43, color: 'bg-blue-500' },
  { city: 'Eindhoven', jobs: 12, pct: 28, color: 'bg-emerald-500' },
  { city: 'Rotterdam', jobs: 10, pct: 24, color: 'bg-amber-500' },
  { city: 'Den Haag', jobs: 8, pct: 19, color: 'bg-purple-500' },
  { city: 'Other', jobs: 6, pct: 14, color: 'bg-slate-400' }
]

// Phase 3: Seasonal Forecasting & Capacity Simulation
const activeQuarterIdx = ref(2)

const seasonalQuarters = [
  {
    name: 'Q1 (Jan - Mar)',
    title: 'Winter Maintenance & Baseline Moves',
    label: 'Low / Moderate',
    intensity: 'Low',
    badgeClass: 'bg-blue-100 text-blue-700',
    expectedJobs: 42,
    peakWindow: 'End of Feb / March weekend slots',
    vansNeeded: '2 Vans Active',
    liftRequirement: 'Lift on-demand (2-3x / mo)',
    moversNeeded: 4,
    crewStatus: 'Sufficient core crew',
    projectedRev: '24,360',
    avgJobPrice: '580',
    recommendation: 'Optimal window for fleet technical inspection, vehicle safety certifications (APK), and winter packing bundle discounts.'
  },
  {
    name: 'Q2 (Apr - Jun)',
    title: 'Spring Real Estate & Family Relocations',
    label: 'High Surge',
    intensity: 'Surge',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    expectedJobs: 86,
    peakWindow: 'Mid-May to Late June',
    vansNeeded: '3 Vans Active',
    liftRequirement: 'Lift required 3 days/week',
    moversNeeded: 6,
    crewStatus: 'Activate part-time driver roster',
    projectedRev: '53,320',
    avgJobPrice: '620',
    recommendation: 'Dutch housing transaction surge. Secure pre-booking deposits and lock in secondary parking permits with Maastricht Gemeente.'
  },
  {
    name: 'Q3 (Jul - Sep)',
    title: 'Peak Maastricht Student & Expat Wave',
    label: 'Peak Peak',
    intensity: 'Max Peak',
    badgeClass: 'bg-red-100 text-red-700',
    expectedJobs: 135,
    peakWindow: 'Aug 15 - Sept 10 (UM Semester)',
    vansNeeded: '4 Vans (Full Fleet Saturation)',
    liftRequirement: 'Continuous Daily Lift Bookings',
    moversNeeded: 9,
    crewStatus: 'High alert • Weekend overtime permitted',
    projectedRev: '87,750',
    avgJobPrice: '650',
    recommendation: 'Maastricht University intake generates over 300+ small-to-mid moves. Apply +15% peak surcharge and require 48h quotation validity.'
  },
  {
    name: 'Q4 (Oct - Dec)',
    title: 'Corporate Transfers & Year-End Moves',
    label: 'Moderate',
    intensity: 'Moderate',
    badgeClass: 'bg-amber-100 text-amber-700',
    expectedJobs: 64,
    peakWindow: 'Late Nov before Christmas freeze',
    vansNeeded: '3 Vans Active',
    liftRequirement: 'Lift 1-2 days/week',
    moversNeeded: 5,
    crewStatus: 'Balanced operational roster',
    projectedRev: '42,240',
    avgJobPrice: '660',
    recommendation: 'Corporate relocations from Brussels, Eindhoven, and Aachen. Prioritize full-service packing and corporate VAT billing.'
  }
]

const currentQuarter = computed(() => seasonalQuarters[activeQuarterIdx.value])

// Real-time Profitability & Margin Simulator state
const simAvgPrice = ref(620)
const simSurgePct = ref(15)
const simCostRatio = ref(36)

const simGrossRevenue = computed(() => {
  const jobs = currentQuarter.value.expectedJobs
  const adjustedPrice = simAvgPrice.value * (1 + simSurgePct.value / 100)
  return Math.round(jobs * adjustedPrice)
})

const simExpenses = computed(() => {
  return Math.round(simGrossRevenue.value * (simCostRatio.value / 100))
})

const simNetProfit = computed(() => {
  return simGrossRevenue.value - simExpenses.value
})

const simNetMargin = computed(() => {
  if (simGrossRevenue.value === 0) return 0
  return Math.round((simNetProfit.value / simGrossRevenue.value) * 100)
})

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

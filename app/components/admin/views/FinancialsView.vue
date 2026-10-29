<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Finances Header, 4 KPIs, 3 Charts & Transactions Table (8 Cols - Exact match to "9 Finances.png") -->
    <div class="lg:col-span-8 space-y-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Finances</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Track income, expenses and profitability across your moving business.
          </p>
        </div>
        <button class="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
          <span>📅</span>
          <span>1 Nov 2025 – 30 Nov 2025</span>
          <span class="text-slate-400 text-[10px]">▼</span>
        </button>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Total Revenue</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€28,970.95</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ +18% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">📈</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Total Expenses</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€10,958.20</p>
            <p class="text-[11px] font-bold text-rose-600">↗ +12% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm font-bold">🪙</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Net Profit</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€18,372.75</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ +24% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">📊</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Profit Margin</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">63%</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ +5% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">%</span>
        </div>
      </div>

      <!-- 3 Charts Row -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Chart 1: Income vs Expenses (5 cols) -->
        <div class="md:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-black text-slate-900">Income vs Expenses</h3>
            <div class="flex items-center gap-3 text-[10px] font-semibold">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-emerald-500"></span>Income</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-xs bg-rose-500"></span>Expenses</span>
            </div>
          </div>
          <div class="h-36 flex items-end justify-between gap-1.5 pt-4 border-b border-slate-100 px-1">
            <div v-for="m in monthlyFlow" :key="m.month" class="flex-1 flex flex-col items-center h-full justify-end">
              <div class="w-full flex items-end justify-center gap-0.5 h-full">
                <div class="w-1.5 bg-emerald-500 rounded-t-xs" :style="{ height: m.income + '%' }"></div>
                <div class="w-1.5 bg-rose-500 rounded-t-xs" :style="{ height: m.expense + '%' }"></div>
              </div>
              <span class="text-[8px] text-slate-400 mt-1">{{ m.month }}</span>
            </div>
          </div>
        </div>

        <!-- Chart 2: Revenue by Service Type Donut (4 cols) -->
        <div class="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-xs font-black text-slate-900 mb-2">Revenue by Service Type</h3>
          <div class="flex items-center justify-between gap-2 my-auto">
            <div class="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="100 238" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="66 238" stroke-dashoffset="-100"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="30 238" stroke-dashoffset="-166"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="22 238" stroke-dashoffset="-196"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="20 238" stroke-dashoffset="-218"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xs font-black text-slate-900">€28.9K</span>
                <span class="text-[8px] text-slate-400">Total</span>
              </div>
            </div>
            <div class="space-y-1 text-[10px] flex-1">
              <div class="flex items-center justify-between"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span>Local Move</span><span class="font-bold">42%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span>National Move</span><span class="font-bold">28%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>International</span><span class="font-bold">12%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Packing Service</span><span class="font-bold">8%</span></div>
              <div class="flex items-center justify-between"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-purple-500"></span>Storage</span><span class="font-bold">6%</span></div>
            </div>
          </div>
        </div>

        <!-- Chart 3: Monthly Profit Line Chart (3 cols) -->
        <div class="md:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 class="text-xs font-black text-slate-900">Monthly Profit</h3>
          <div class="h-32 flex items-end pt-4">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <path d="M0,75 L35,62 L70,65 L105,48 L140,35 L175,42 L200,25 L200,100 L0,100 Z" fill="url(#profitGrad)"/>
              <polyline fill="none" stroke="#10B981" stroke-width="2.5" points="0,75 35,62 70,65 105,48 140,35 175,42 200,25"/>
              <circle cx="0" cy="75" r="3" fill="#10B981"/>
              <circle cx="35" cy="62" r="3" fill="#10B981"/>
              <circle cx="70" cy="65" r="3" fill="#10B981"/>
              <circle cx="105" cy="48" r="3" fill="#10B981"/>
              <circle cx="140" cy="35" r="3" fill="#10B981"/>
              <circle cx="175" cy="42" r="3" fill="#10B981"/>
              <circle cx="200" cy="25" r="3" fill="#10B981"/>
            </svg>
          </div>
          <div class="flex justify-between text-[8px] text-slate-400 pt-1">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
      </div>

      <!-- Transactions Sub-tabs + Export -->
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
          <button 
            v-for="tab in ['All Transactions', 'Invoices', 'Expenses', 'Payroll', 'Payments', 'Other']" 
            :key="tab"
            @click="activeTxTab = tab"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
              activeTxTab === tab ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
          <span>📥</span>
          <span>Export</span>
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search by reference, customer, or description..." 
            class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
          />
        </div>
        <select v-model="typeFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option value="all">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Statuses</option>
          <option>Paid</option>
          <option>Partially Paid</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Jobs</option>
        </select>
        <button @click="searchQuery = ''; typeFilter = 'all'" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
          Clear
        </button>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3 font-bold">DATE</th>
                <th class="py-3 px-2.5 font-bold">TYPE</th>
                <th class="py-3 px-2.5 font-bold">REF</th>
                <th class="py-3 px-2.5 font-bold">DESCRIPTION</th>
                <th class="py-3 px-2.5 font-bold">CUSTOMER / JOB</th>
                <th class="py-3 px-2.5 font-bold">CATEGORY</th>
                <th class="py-3 px-2.5 font-bold">AMOUNT</th>
                <th class="py-3 px-2.5 font-bold">STATUS</th>
                <th class="py-3 px-2.5 font-bold">PAYMENT METHOD</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="tx in filteredTransactions" :key="tx.ref" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3 px-3 text-slate-600 whitespace-nowrap">{{ tx.date }}</td>
                <td class="py-3 px-2.5">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="tx.type === 'Income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'"
                  >
                    {{ tx.type }}
                  </span>
                </td>
                <td class="py-3 px-2.5 font-bold text-slate-800 whitespace-nowrap">{{ tx.ref }}</td>
                <td class="py-3 px-2.5 text-slate-700">{{ tx.desc }}</td>
                <td class="py-3 px-2.5 text-slate-600">{{ tx.customer }}</td>
                <td class="py-3 px-2.5 text-slate-500">{{ tx.category }}</td>
                <td class="py-3 px-2.5 font-black text-slate-900 font-sans">{{ tx.amount }}</td>
                <td class="py-3 px-2.5">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                  >
                    {{ tx.status }}
                  </span>
                </td>
                <td class="py-3 px-2.5 text-slate-600">{{ tx.method }}</td>
                <td class="py-3 px-2 text-center text-slate-400">•••</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–10</span> of <span class="font-bold text-slate-800">128</span></div>
          <div class="flex items-center gap-1.5">
            <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">2</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">3</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">4</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">5</button>
            <span>...</span>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">13</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Expense Breakdown, Outstanding Invoices, Profitability by Job, Recent Payments (4 Cols) -->
    <div class="lg:col-span-4 space-y-4">
      <!-- 1. Expense Breakdown Donut -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <h3 class="text-sm font-black text-slate-900">Expense Breakdown</h3>
        <div class="flex items-center justify-around gap-4">
          <div class="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" stroke-width="14" stroke-dasharray="67 238" stroke-dashoffset="0"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="57 238" stroke-dashoffset="-67"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="43 238" stroke-dashoffset="-124"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="24 238" stroke-dashoffset="-167"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="47 238" stroke-dashoffset="-191"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-base font-black text-slate-900">€10.9K</span>
              <span class="text-[10px] text-slate-400">Total</span>
            </div>
          </div>
          <div class="space-y-1.5 text-xs flex-1">
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>Fuel</span><span class="font-bold">28%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Salaries</span><span class="font-bold">24%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Inventory</span><span class="font-bold">18%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Tolls</span><span class="font-bold">10%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Maintenance</span><span class="font-bold">8%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Insurance</span><span class="font-bold">6%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>Office & Admin</span><span class="font-bold">4%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>Other</span><span class="font-bold">2%</span></div>
          </div>
        </div>
      </div>

      <!-- 2. Outstanding Invoices -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Outstanding Invoices</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
        </div>
        <table class="w-full text-left text-[11px]">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">REF</th>
              <th class="pb-2">CUSTOMER</th>
              <th class="pb-2">AMOUNT</th>
              <th class="pb-2">DUE DATE</th>
              <th class="pb-2 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-2 font-bold">INV-2026-0125</td>
              <td class="py-2">TechSolutions BV</td>
              <td class="py-2 font-black">€2,100</td>
              <td class="py-2 text-slate-500">2 Dec 2025</td>
              <td class="py-2 text-right"><span class="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">Overdue</span></td>
            </tr>
            <tr>
              <td class="py-2 font-bold">INV-2026-0124</td>
              <td class="py-2">Paris Group</td>
              <td class="py-2 font-black">€950</td>
              <td class="py-2 text-slate-500">5 Dec 2025</td>
              <td class="py-2 text-right"><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Pending</span></td>
            </tr>
            <tr>
              <td class="py-2 font-bold">INV-2026-0121</td>
              <td class="py-2">GlobalRelocate BV</td>
              <td class="py-2 font-black">€1,500</td>
              <td class="py-2 text-slate-500">28 Nov 2025</td>
              <td class="py-2 text-right"><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Partially Paid</span></td>
            </tr>
            <tr>
              <td class="py-2 font-bold">INV-2026-0118</td>
              <td class="py-2">Meijer Family</td>
              <td class="py-2 font-black">€750</td>
              <td class="py-2 text-slate-500">14 Dec 2025</td>
              <td class="py-2 text-right"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Sent</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3. Profitability by Job -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Profitability by Job</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
        </div>
        <table class="w-full text-left text-[11px]">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">JOB REF</th>
              <th class="pb-2">CUSTOMER</th>
              <th class="pb-2">REVENUE</th>
              <th class="pb-2">COSTS</th>
              <th class="pb-2">PROFIT</th>
              <th class="pb-2 text-right">MARGIN</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-2 font-bold">J-26-1101</td>
              <td class="py-2">Sophie de Jong</td>
              <td class="py-2 font-semibold">€1,850</td>
              <td class="py-2 text-slate-500">€620</td>
              <td class="py-2 font-black">€1,230</td>
              <td class="py-2 text-right font-black text-emerald-600">66%</td>
            </tr>
            <tr>
              <td class="py-2 font-bold">J-26-1099</td>
              <td class="py-2">Lucas Martin</td>
              <td class="py-2 font-semibold">€1,200</td>
              <td class="py-2 text-slate-500">€480</td>
              <td class="py-2 font-black">€720</td>
              <td class="py-2 text-right font-black text-emerald-600">60%</td>
            </tr>
            <tr>
              <td class="py-2 font-bold">J-26-1095</td>
              <td class="py-2">GlobalRelocate BV</td>
              <td class="py-2 font-semibold">€4,300</td>
              <td class="py-2 text-slate-500">€2,150</td>
              <td class="py-2 font-black">€2,150</td>
              <td class="py-2 text-right font-black text-emerald-600">50%</td>
            </tr>
            <tr>
              <td class="py-2 font-bold">J-26-1092</td>
              <td class="py-2">Paris Group</td>
              <td class="py-2 font-semibold">€750</td>
              <td class="py-2 text-slate-500">€520</td>
              <td class="py-2 font-black">€430</td>
              <td class="py-2 text-right font-black text-emerald-600">45%</td>
            </tr>
            <tr>
              <td class="py-2 font-bold">J-26-1088</td>
              <td class="py-2">De Vries</td>
              <td class="py-2 font-semibold">€1,200</td>
              <td class="py-2 text-slate-500">€610</td>
              <td class="py-2 font-black">€590</td>
              <td class="py-2 text-right font-black text-emerald-600">49%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Recent Payments -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Recent Payments</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
        </div>
        <table class="w-full text-left text-[11px]">
          <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th class="pb-2">DATE</th>
              <th class="pb-2">REF</th>
              <th class="pb-2">CUSTOMER</th>
              <th class="pb-2">AMOUNT</th>
              <th class="pb-2 text-right">METHOD</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-2 text-slate-500">28 Nov 2025</td>
              <td class="py-2 font-bold">PAY-2026-0098</td>
              <td class="py-2">Jansen Family</td>
              <td class="py-2 font-black">€1,850</td>
              <td class="py-2 text-right text-slate-500">Bank Transfer</td>
            </tr>
            <tr>
              <td class="py-2 text-slate-500">25 Nov 2025</td>
              <td class="py-2 font-bold">PAY-2026-0097</td>
              <td class="py-2">UM Student</td>
              <td class="py-2 font-black">€450</td>
              <td class="py-2 text-right text-slate-500">Tikkie</td>
            </tr>
            <tr>
              <td class="py-2 text-slate-500">20 Nov 2025</td>
              <td class="py-2 font-bold">PAY-2026-0096</td>
              <td class="py-2">GlobalRelocate BV</td>
              <td class="py-2 font-black">€2,800</td>
              <td class="py-2 text-right text-slate-500">Bank Transfer</td>
            </tr>
            <tr>
              <td class="py-2 text-slate-500">12 Nov 2025</td>
              <td class="py-2 font-bold">PAY-2026-0095</td>
              <td class="py-2">Scott Raab</td>
              <td class="py-2 font-black">€700</td>
              <td class="py-2 text-right text-slate-500">Bank Transfer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  totalRevenue: { type: Number, default: 28970.95 },
  totalExpenses: { type: Number, default: 10958.20 },
  netProfit: { type: Number, default: 18372.75 },
  profitMargin: { type: Number, default: 63 }
})

const activeTxTab = ref('All Transactions')
const searchQuery = ref('')
const typeFilter = ref('all')

const monthlyFlow = [
  { month: 'Jan', income: 35, expense: 20 },
  { month: 'Feb', income: 42, expense: 25 },
  { month: 'Mar', income: 55, expense: 28 },
  { month: 'Apr', income: 50, expense: 32 },
  { month: 'May', income: 68, expense: 35 },
  { month: 'Jun', income: 72, expense: 38 },
  { month: 'Jul', income: 85, expense: 42 },
  { month: 'Aug', income: 75, expense: 40 },
  { month: 'Sep', income: 62, expense: 35 },
  { month: 'Oct', income: 58, expense: 30 },
  { month: 'Nov', income: 65, expense: 32 },
  { month: 'Dec', income: 40, expense: 20 }
]

const transactions = [
  { date: '28 Nov 2025', type: 'Income', ref: 'INV-2026-0123', desc: 'Local move Maastricht', customer: 'Jansen Family', category: 'Moving Service', amount: '€1,850.00', status: 'Paid', method: 'Bank Transfer' },
  { date: '27 Nov 2025', type: 'Expense', ref: 'EXP-2026-0441', desc: 'Diesel fuel', customer: 'Van 1 – SHEK 23', category: 'Fuel', amount: '€120.00', status: 'Paid', method: 'Card' },
  { date: '25 Nov 2025', type: 'Income', ref: 'INV-2026-0122', desc: 'Packing service', customer: 'UM Student', category: 'Packing Service', amount: '€450.00', status: 'Paid', method: 'Tikkie' },
  { date: '22 Nov 2025', type: 'Expense', ref: 'EXP-2026-0439', desc: 'Moving boxes 60L (50 pcs)', customer: 'Supplier: Praxis', category: 'Inventory', amount: '€85.00', status: 'Paid', method: 'Card' },
  { date: '20 Nov 2025', type: 'Income', ref: 'INV-2026-0121', desc: 'International move BE → CH', customer: 'GlobalRelocate BV', category: 'International Move', amount: '€4,300.00', status: 'Partially Paid', method: 'Bank Transfer' },
  { date: '18 Nov 2025', type: 'Expense', ref: 'EXP-2026-0438', desc: 'Tolls Belgium', customer: 'Van 2 – V-482-BK', category: 'Tolls', amount: '€45.00', status: 'Paid', method: 'Card' },
  { date: '15 Nov 2025', type: 'Expense', ref: 'EXP-2026-0437', desc: 'Team payment – Ahmed', customer: 'Payroll', category: 'Salaries', amount: '€320.00', status: 'Paid', method: 'Bank Transfer' },
  { date: '12 Nov 2025', type: 'Income', ref: 'INV-2026-0120', desc: 'Storage (1 month)', customer: 'Scott Raab', category: 'Storage', amount: '€700.00', status: 'Paid', method: 'Bank Transfer' },
  { date: '10 Nov 2025', type: 'Expense', ref: 'EXP-2026-0436', desc: 'Protective blankets (10 pcs)', customer: 'Supplier: Gamma', category: 'Inventory', amount: '€95.00', status: 'Paid', method: 'Card' },
  { date: '8 Nov 2025', type: 'Income', ref: 'INV-2026-0119', desc: 'Local move Maastricht', customer: 'De Vries', category: 'Moving Service', amount: '€1,200.00', status: 'Paid', method: 'Cash' }
]

const filteredTransactions = computed(() => {
  return transactions.filter(t => {
    if (typeFilter.value !== 'all' && t.type !== typeFilter.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return t.ref.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    }
    return true
  })
})
</script>

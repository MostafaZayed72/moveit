<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Finances Header, 4 KPIs, 3 Charts & Transactions Table (8 Cols - Exact match to "9 Finances.png") -->
    <div class="lg:col-span-8 space-y-4 min-w-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Finances</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Track income, expenses and profitability across your moving business.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Period Switcher -->
          <select
            v-model="selectedFinancePeriod"
            class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
          >
            <option value="nov2025">📅 1 Nov 2025 – 30 Nov 2025</option>
            <option value="q4">📅 Q4 2025 (Oct – Dec)</option>
            <option value="ytd">📅 Full Year 2025 / 2026</option>
          </select>

          <button
            @click="showBackfillModal = true"
            class="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
          >
            📂 Import / Backfill
          </button>

          <button
            @click="showAddTxModal = true"
            class="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
          >
            + Record Entry
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Total Revenue</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€{{ computedKpis.revenue }}</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ +18% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">📈</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Total Expenses</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€{{ computedKpis.expenses }}</p>
            <p class="text-[11px] font-bold text-rose-600">↗ +12% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm font-bold">🪙</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Net Profit</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">€{{ computedKpis.profit }}</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ +24% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">📊</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Profit Margin</p>
            <p class="text-xl sm:text-2xl font-black text-slate-900 font-sans">{{ computedKpis.margin }}%</p>
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
        <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 text-xs font-bold overflow-x-auto">
          <button 
            v-for="tab in ['All Transactions', 'Invoices', 'Expenses', 'Payroll', 'Payments', 'Other']" 
            :key="tab"
            @click="activeTxTab = tab"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap',
              activeTxTab === tab ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <button
          @click="exportTransactionsCsv"
          class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
        >
          <span>📥</span>
          <span>Export CSV</span>
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
        <select v-model="statusFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Pending">Pending</option>
        </select>
        <button @click="searchQuery = ''; typeFilter = 'all'; statusFilter = 'all'; activeTxTab = 'All Transactions'" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
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
                  <button
                    @click="toggleTxPaymentStatus(tx)"
                    class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
                    :class="tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                    title="Click to toggle Paid / Pending"
                  >
                    {{ tx.status }}
                  </button>
                </td>
                <td class="py-3 px-2.5 text-slate-600">{{ tx.method }}</td>
                <td class="py-3 px-2 text-center">
                  <button
                    @click="downloadTxInvoicePDF(tx)"
                    class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#DC2626] hover:text-white text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                    title="Download A4 PDF Document"
                  >
                    📄 PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–{{ filteredTransactions.length }}</span> of <span class="font-bold text-slate-800">{{ transactions.length }}</span></div>
          <div class="flex items-center gap-1.5">
            <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">2</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">3</button>
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
          <button @click="activeTxTab = 'Invoices'" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
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
            <tr
              v-for="inv in outstandingInvoices"
              :key="inv.ref"
              class="hover:bg-slate-50 cursor-pointer"
              @click="downloadTxInvoicePDF({ ref: inv.ref, customer: inv.customer, amount: inv.amount, desc: 'Relocation Invoice', status: inv.status, date: inv.due })"
              title="Click to download Official Invoice PDF"
            >
              <td class="py-2 font-bold text-blue-600 hover:underline">{{ inv.ref }}</td>
              <td class="py-2">{{ inv.customer }}</td>
              <td class="py-2 font-black">{{ inv.amount }}</td>
              <td class="py-2 text-slate-500">{{ inv.due }}</td>
              <td class="py-2 text-right">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="inv.badgeClass">{{ inv.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3. Profitability by Job -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Profitability by Job</h3>
          <span class="text-[10px] font-bold text-emerald-600">Net Contribution</span>
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
            <tr v-for="job in realTopProfitableJobs" :key="job.ref">
              <td class="py-2 font-bold">{{ job.ref }}</td>
              <td class="py-2 font-bold text-slate-900 truncate max-w-[130px]">{{ job.customer }}</td>
              <td class="py-2 font-semibold">€{{ job.revenue.toLocaleString() }}</td>
              <td class="py-2 text-slate-500">€{{ job.costs.toLocaleString() }}</td>
              <td class="py-2 font-black">€{{ job.profit.toLocaleString() }}</td>
              <td class="py-2 text-right font-black text-emerald-600">{{ job.margin }}%</td>
            </tr>
            <tr v-if="realTopProfitableJobs.length === 0">
              <td colspan="6" class="py-4 text-center text-slate-400">No completed jobs yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Recent Payments -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Recent Payments</h3>
          <button @click="activeTxTab = 'Payments'" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
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

    <!-- MODAL 1: Record New Financial Transaction / Invoice / Expense -->
    <div v-if="showAddTxModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">Record Financial Entry</h3>
            <p class="text-xs text-slate-500">Log a new invoice, payment, or direct job expense</p>
          </div>
          <button @click="showAddTxModal = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Entry Type</label>
              <select v-model="newTx.type" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Income">Income (Invoice)</option>
                <option value="Expense">Expense (Cost)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Category</label>
              <select v-model="newTx.category" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Moving Service">Moving Service</option>
                <option value="International Move">International Move</option>
                <option value="Fuel">Fuel / Diesel</option>
                <option value="Salaries">Salaries & Payroll</option>
                <option value="Tolls">Highway Tolls</option>
                <option value="Inventory">Boxes & Materials</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Customer / Supplier / Vehicle</label>
            <input v-model="newTx.customer" placeholder="e.g. Shell NL or Customer Name" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Description</label>
            <input v-model="newTx.desc" placeholder="e.g. Full household move Maastricht -> Amsterdam" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Amount (€)</label>
              <input v-model="newTx.amount" type="number" placeholder="450" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select v-model="newTx.method" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="iDEAL / Tikkie">iDEAL / Tikkie</option>
                <option value="Card">Company Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="showAddTxModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
          <button @click="saveNewTransaction" class="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold cursor-pointer">Save Entry</button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: Historical Data Backfill & CSV Import (Phase 2 Deliverable) -->
    <div v-if="showBackfillModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">📂 Historical Data Backfill & CSV Import</h3>
            <p class="text-xs text-slate-500">Retroactively import or backfill historical orders, crew hours, and expenses</p>
          </div>
          <button @click="showBackfillModal = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
          <div class="text-2xl">📊</div>
          <p class="text-xs font-black text-slate-900">Upload Historical CSV / Excel Sheet</p>
          <p class="text-[11px] text-slate-500">Supports columns: Date, Customer, Route, Revenue, Crew Hours, Fuel, Tolls, Payment Status</p>
          <input type="file" accept=".csv,.xlsx" @change="handleCsvUpload" class="text-xs text-slate-600 mx-auto block pt-1 cursor-pointer" />
        </div>

        <div class="space-y-2 text-xs">
          <label class="block font-bold text-slate-700">Or Quick-Paste Historical Rows (CSV format):</label>
          <textarea
            v-model="backfillRawText"
            rows="3"
            placeholder="2025-10-18, Van Dijk BV, Maastricht -> Utrecht, 1450, Paid"
            class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <button @click="loadSampleHistoricalBatch" class="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
            + Load Sample Historical Batch (3 records)
          </button>
          <div class="flex items-center gap-2">
            <button @click="showBackfillModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
            <button @click="processHistoricalBackfill" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">
              ✓ Import & Backfill
            </button>
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
import { MOVEIT_LOGO_BASE64 } from '~/utils/pdfBranding'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  totalRevenue: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },
  profitMargin: { type: Number, default: 0 }
})

const activeTxTab = ref('All Transactions')
const searchQuery = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')
const selectedFinancePeriod = ref('ytd')

const showAddTxModal = ref(false)
const showBackfillModal = ref(false)
const backfillRawText = ref('')

const newTx = ref({
  type: 'Income',
  category: 'Moving Service',
  customer: '',
  desc: '',
  amount: '',
  method: 'Bank Transfer'
})

const computedKpis = computed(() => {
  const rev = props.totalRevenue > 0 ? props.totalRevenue : 53672.50
  const exp = props.totalExpenses > 0 ? props.totalExpenses : Math.round(rev * 0.44)
  const prof = props.netProfit > 0 ? props.netProfit : (rev - exp)
  const marg = props.profitMargin > 0 ? props.profitMargin : Math.round((prof / rev) * 100)
  return {
    revenue: rev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    expenses: exp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    profit: prof.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    margin: marg
  }
})

const realTopProfitableJobs = computed(() => {
  return (props.orders || [])
    .filter(o => o.operationalStatus === 'Completed' || o.operationalStatus === 'Confirmed')
    .slice(0, 5)
    .map(o => {
      const rev = Number(o.estValue || 450)
      const labor = o.jobCosts?.labor || Math.round(rev * 0.18)
      const fuel = o.jobCosts?.fuel || Math.round(rev * 0.08)
      const totalCost = labor + fuel + 25
      const profit = Math.max(0, rev - totalCost)
      const margin = Math.round((profit / rev) * 100)
      return {
        ref: o.ref,
        customer: o.customer,
        revenue: rev,
        costs: totalCost,
        profit,
        margin
      }
    })
})

const monthlyFlow = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const mapInc = Array(12).fill(0)
  ;(props.orders || []).forEach(o => {
    const rev = Number(o.estValue || 450)
    const dStr = o.movingDate || o.raw?.form_data?.date || o.raw?.created_at
    if (dStr) {
      const d = new Date(dStr)
      if (!isNaN(d.getTime())) {
        mapInc[d.getMonth()] += rev
      }
    }
  })
  const maxInc = Math.max(...mapInc, 5000)
  return months.map((m, idx) => {
    const inc = mapInc[idx]
    const incPct = inc > 0 ? Math.min(95, Math.max(15, Math.round((inc / maxInc) * 85))) : 8
    const expPct = Math.round(incPct * 0.45)
    return {
      month: m,
      income: incPct,
      expense: expPct
    }
  })
})

const outstandingInvoices = computed(() => {
  return (props.orders || [])
    .filter(o => o.operationalStatus !== 'Completed' && o.operationalStatus !== 'Cancelled')
    .slice(0, 4)
    .map(o => ({
      ref: `INV-26-${String(o.id).slice(0, 4).toUpperCase()}`,
      customer: o.customer,
      amount: `€${(o.estValue || 450).toLocaleString()}`,
      due: o.shortDate || 'Upcoming',
      status: 'Pending',
      badgeClass: 'bg-amber-50 text-amber-700'
    }))
})

const transactions = computed(() => {
  return (props.orders || []).slice(0, 12).map((o, idx) => ({
    date: o.shortDate || 'Recent',
    type: 'Income',
    ref: `INV-26-${String(o.id).slice(0, 4).toUpperCase()}`,
    desc: `${o.package || 'Move'} (${o.route})`,
    customer: o.customer,
    category: 'Moving Service',
    amount: `€${(o.estValue || 450).toLocaleString()}.00`,
    status: o.operationalStatus === 'Completed' ? 'Paid' : 'Pending',
    method: idx % 2 === 0 ? 'Bank Transfer' : 'Tikkie'
  }))
})

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    if (activeTxTab.value === 'Invoices' && t.type !== 'Income') return false
    if (activeTxTab.value === 'Expenses' && t.type !== 'Expense') return false
    if (activeTxTab.value === 'Payroll' && t.category !== 'Salaries') return false
    if (activeTxTab.value === 'Payments' && t.status !== 'Paid') return false

    if (typeFilter.value !== 'all' && t.type !== typeFilter.value) return false
    if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return t.ref.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    }
    return true
  })
})

const toggleTxPaymentStatus = (tx) => {
  tx.status = tx.status === 'Paid' ? 'Pending' : 'Paid'
}

const saveNewTransaction = () => {
  if (!newTx.value.customer || !newTx.value.amount) return
  const prefix = newTx.value.type === 'Income' ? 'INV-2026-' : 'EXP-2026-'
  const num = Math.floor(1000 + Math.random() * 9000)
  transactions.value.unshift({
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    type: newTx.value.type,
    ref: `${prefix}${num}`,
    desc: newTx.value.desc || newTx.value.category,
    customer: newTx.value.customer,
    category: newTx.value.category,
    amount: `€${Number(newTx.value.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    status: 'Paid',
    method: newTx.value.method
  })
  showAddTxModal.value = false
  newTx.value = { type: 'Income', category: 'Moving Service', customer: '', desc: '', amount: '', method: 'Bank Transfer' }
}

const loadSampleHistoricalBatch = () => {
  backfillRawText.value = [
    '14 Oct 2025, Van Dijk Logistics, Maastricht -> Eindhoven, 1650.00, Paid',
    '19 Oct 2025, Celine Dupont, Maastricht -> Liege, 890.00, Paid',
    '24 Oct 2025, Shell Fleet Diesel, Van 1 & Van 2 Fuel, -310.00, Paid'
  ].join('\n')
}

const handleCsvUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    backfillRawText.value = String(ev.target?.result || '')
  }
  reader.readAsText(file)
}

const processHistoricalBackfill = () => {
  if (!backfillRawText.value.trim()) return
  const lines = backfillRawText.value.trim().split(/\r?\n/)
  let count = 0
  lines.forEach((line, idx) => {
    const parts = line.split(',').map(s => s.trim())
    if (parts.length >= 4) {
      const rawAmt = parseFloat(parts[3].replace(/[^0-9.-]/g, '')) || 500
      const isExp = rawAmt < 0
      transactions.value.unshift({
        date: parts[0] || 'Oct 2025',
        type: isExp ? 'Expense' : 'Income',
        ref: isExp ? `EXP-HIST-0${idx + 1}` : `INV-HIST-0${idx + 1}`,
        desc: parts[2] || 'Historical Backfill Record',
        customer: parts[1] || 'Historical Client',
        category: isExp ? 'Fuel' : 'Moving Service',
        amount: `€${Math.abs(rawAmt).toFixed(2)}`,
        status: parts[4] || 'Paid',
        method: 'Bank Transfer'
      })
      count++
    }
  })
  backfillRawText.value = ''
  showBackfillModal.value = false
  alert(`${count} historical records imported and backfilled into the financial ledger!`)
}

const exportTransactionsCsv = () => {
  const headers = ['Date', 'Type', 'Reference', 'Description', 'Customer/Job', 'Category', 'Amount', 'Status', 'Method']
  const rows = filteredTransactions.value.map(t => [
    `"${t.date}"`,
    `"${t.type}"`,
    `"${t.ref}"`,
    `"${t.desc}"`,
    `"${t.customer}"`,
    `"${t.category}"`,
    `"${t.amount}"`,
    `"${t.status}"`,
    `"${t.method}"`
  ])
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `MoveIt_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const downloadTxInvoicePDF = (tx) => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const redColor = [220, 38, 38]
    const darkColor = [15, 23, 42]
    const grayColor = [100, 116, 139]

    doc.setFillColor(...redColor)
    doc.rect(0, 0, 210, 6, 'F')

    try {
      doc.addImage(MOVEIT_LOGO_BASE64, 'PNG', 14, 11, 46, 10.24)
    } catch (e) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...darkColor)
      doc.text('move-it', 14, 20)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...darkColor)
    doc.text('MoveIt Maastricht B.V. — Official Tax Document', 66, 18)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text('Oranjeplein 35D, 6224 KV Maastricht • KvK: 84920194 • BTW: NL863412345B01', 66, 23)

    doc.setDrawColor(226, 232, 240)
    doc.line(14, 30, 196, 30)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...redColor)
    doc.text(`REFERENCE: ${tx.ref}`, 14, 40)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...darkColor)
    doc.text(`Customer / Party: ${tx.customer}`, 14, 48)
    doc.text(`Date: ${tx.date || 'Nov 2025'}`, 14, 54)
    doc.text(`Payment Status: ${tx.status}`, 14, 60)

    const rawNum = parseFloat(String(tx.amount).replace(/[^0-9.]/g, '')) || 1000
    const netAmt = Math.round((rawNum / 1.21) * 100) / 100
    const vatAmt = Math.round((rawNum - netAmt) * 100) / 100

    const autoTableFn = autoTable.default || autoTable
    autoTableFn(doc, {
      startY: 68,
      head: [['#', 'Description', 'Category', 'VAT (21%)', 'Total (Incl. VAT)']],
      body: [
        ['1', tx.desc || 'Relocation & Logistics Service', tx.category || 'Moving Service', `€${vatAmt.toFixed(2)}`, `€${rawNum.toFixed(2)}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: darkColor, textColor: [255, 255, 255], fontSize: 8.5 },
      bodyStyles: { fontSize: 8.5, textColor: darkColor },
      margin: { left: 14, right: 14 }
    })

    const finalY = (doc.lastAutoTable?.finalY || 100) + 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`Net Amount (Excl. BTW): €${netAmt.toFixed(2)}`, 196, finalY, { align: 'right' })
    doc.text(`21% Dutch BTW / VAT: €${vatAmt.toFixed(2)}`, 196, finalY + 6, { align: 'right' })
    doc.setTextColor(...redColor)
    doc.text(`Total Amount (EUR): €${rawNum.toFixed(2)}`, 196, finalY + 13, { align: 'right' })

    doc.save(`MoveIt_${tx.ref}_${tx.customer.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
  } catch (e) {
    console.error(e)
  }
}
</script>

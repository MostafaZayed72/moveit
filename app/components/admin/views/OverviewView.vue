<template>
  <div class="space-y-6">
    <!-- Greeting & Date Range (Screen 1 exact match) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
          Good morning, Admin!
        </h1>
        <p class="text-xs text-slate-500 font-medium mt-1">
          Here's what's happening with MoveIt Maastricht today.
        </p>
      </div>

      <!-- Date Range Selector Pill -->
      <button class="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/90 transition-colors shadow-xs cursor-pointer">
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>1 Nov 2025 - 30 Nov 2025</span>
        <svg class="w-3 h-3 text-slate-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <!-- 1. Top 6 KPI Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <!-- 1. Total Revenue -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Total Revenue</span>
          <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">€28,450</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs">
            <span class="font-bold text-emerald-600">↗ +18%</span>
            <span class="text-slate-400">vs. last month</span>
          </div>
        </div>
      </div>

      <!-- 2. Job Contribution -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Job Contribution</span>
          <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">€12,760</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs">
            <span class="font-bold text-emerald-600">↗ +22%</span>
            <span class="text-slate-400">vs. last month</span>
          </div>
        </div>
      </div>

      <!-- 3. Active Leads -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Active Leads</span>
          <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">24</div>
          <div class="mt-1 flex items-center gap-1.5 text-xs">
            <span class="font-bold text-rose-500">↘ -8%</span>
            <span class="text-slate-400">vs. last month</span>
          </div>
        </div>
      </div>

      <!-- 4. Pending Quotations -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Pending Quotations</span>
          <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">8</div>
          <div class="mt-1 flex items-center gap-1 text-xs">
            <span class="font-bold text-amber-600">▲ 3 overdue</span>
          </div>
        </div>
      </div>

      <!-- 5. Confirmed Jobs -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Confirmed Jobs</span>
          <span class="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">15</div>
          <div class="mt-1 flex items-center gap-1 text-xs">
            <span class="font-bold text-slate-600">▲ 6 this week</span>
          </div>
        </div>
      </div>

      <!-- 6. Reviews (This Month) -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500">Reviews (This Month)</span>
          <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          </span>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-black text-slate-900 font-sans tracking-tight">4.8</div>
          <div class="mt-1 flex items-center gap-1.5">
            <div class="flex items-center text-amber-400">
              <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <span class="text-[11px] text-slate-400 font-medium">12 reviews</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Middle 3 Charts Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
      <!-- Chart 1: Monthly Revenue (4 Cols) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xs font-bold text-slate-800">Monthly Revenue</h2>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-xl font-black text-slate-900 font-sans tracking-tight">€28,450</span>
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↗ +18%</span>
            </div>
          </div>
          <!-- Legend -->
          <div class="flex items-center gap-3 text-[11px] font-semibold">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
              <span class="text-slate-600">This year</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-200"></span>
              <span class="text-slate-400">Last year</span>
            </div>
          </div>
        </div>

        <!-- Bar Chart Visual -->
        <div class="h-44 flex flex-col justify-between pt-4">
          <div class="relative flex-1 flex items-end justify-between gap-1.5 px-2 border-b border-slate-100">
            <!-- Y-Axis Gridlines & Labels -->
            <div class="absolute inset-x-0 top-0 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>€60K</span></div>
            <div class="absolute inset-x-0 top-1/3 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>€40K</span></div>
            <div class="absolute inset-x-0 top-2/3 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>€20K</span></div>
            <div class="absolute inset-x-0 bottom-0 border-b border-slate-200 flex justify-start text-[9px] text-slate-400 -mb-2"><span>€0</span></div>

            <!-- Bars for 12 months -->
            <div v-for="bar in revenueMonths" :key="bar.month" class="flex-1 flex flex-col items-center h-full justify-end group z-10">
              <div class="w-full flex items-end justify-center gap-0.5 h-full pb-0.5">
                <div 
                  class="w-1.5 bg-rose-100 group-hover:bg-rose-200 rounded-t-xs transition-all"
                  :style="{ height: bar.lastYear + '%' }"
                ></div>
                <div 
                  class="w-1.5 bg-[#DC2626] group-hover:bg-red-700 rounded-t-xs transition-all"
                  :style="{ height: bar.thisYear + '%' }"
                ></div>
              </div>
              <span class="text-[9px] font-medium text-slate-400 group-hover:text-slate-700 mt-2">{{ bar.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 2: Lead Conversion Rate (4 Cols) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xs font-bold text-slate-800">Lead Conversion Rate</h2>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-xl font-black text-slate-900 font-sans tracking-tight">67%</span>
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↗ +12%</span>
            </div>
          </div>
        </div>

        <!-- Line Chart Visual (SVG with smooth curve and red gradient fill) -->
        <div class="h-44 relative flex flex-col justify-between pt-4">
          <div class="absolute inset-x-0 top-0 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>100%</span></div>
          <div class="absolute inset-x-0 top-1/4 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>75%</span></div>
          <div class="absolute inset-x-0 top-2/4 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>50%</span></div>
          <div class="absolute inset-x-0 top-3/4 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2"><span>25%</span></div>
          <div class="absolute inset-x-0 bottom-6 border-b border-slate-200 flex justify-start text-[9px] text-slate-400"><span>0%</span></div>

          <svg class="w-full h-32 overflow-visible" viewBox="0 0 320 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="conversionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#DC2626" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#DC2626" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <!-- Area Fill -->
            <path 
              d="M 10,70 Q 38,68 65,58 T 120,48 T 175,55 T 230,42 T 285,45 L 310,48 L 310,100 L 10,100 Z" 
              fill="url(#conversionGrad)" 
            />
            <!-- Red Stroke Line -->
            <path 
              d="M 10,70 Q 38,68 65,58 T 120,48 T 175,55 T 230,42 T 285,45 L 310,48" 
              fill="none" 
              stroke="#DC2626" 
              stroke-width="2.5" 
              stroke-linecap="round"
            />
            <!-- Dots -->
            <circle cx="10" cy="70" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="65" cy="58" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="120" cy="48" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="175" cy="55" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="230" cy="42" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="285" cy="45" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
            <circle cx="310" cy="48" r="3" fill="#DC2626" stroke="#fff" stroke-width="1.5" />
          </svg>

          <!-- Months on X-Axis -->
          <div class="flex justify-between text-[9px] font-medium text-slate-400 px-1 pt-1">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      <!-- Chart 3: Revenue by Move Category (4 Cols) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <h2 class="text-xs font-bold text-slate-800">Revenue by Move Category</h2>

        <div class="py-2 flex items-center justify-between gap-4">
          <!-- Donut Graphic with €28.4K Total in Center -->
          <div class="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14" />
              <!-- Segments matching exact percentages -->
              <!-- Local Move 42%: 0.42 * 238.7 = 100 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" stroke-width="14" stroke-dasharray="100 239" stroke-dashoffset="0" />
              <!-- National Move 28%: 0.28 * 238.7 = 67 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" stroke-width="14" stroke-dasharray="67 239" stroke-dashoffset="-100" />
              <!-- International EU 12%: 0.12 * 238.7 = 29 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="29 239" stroke-dashoffset="-167" />
              <!-- Business Move 10%: 0.10 * 238.7 = 24 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="24 239" stroke-dashoffset="-196" />
              <!-- Student Move 6%: 0.06 * 238.7 = 14 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="14 239" stroke-dashoffset="-220" />
              <!-- Other 2%: 0.02 * 238.7 = 5 -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#94A3B8" stroke-width="14" stroke-dasharray="5 239" stroke-dashoffset="-234" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-lg font-black text-slate-900 leading-tight">€28.4K</span>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>
          </div>

          <!-- Legend with Percentages on Right -->
          <div class="space-y-1.5 flex-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                Local Move
              </span>
              <span class="font-bold text-slate-800 text-[11px]">42%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#0284C7]"></span>
                National Move
              </span>
              <span class="font-bold text-slate-800 text-[11px]">28%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
                International EU
              </span>
              <span class="font-bold text-slate-800 text-[11px]">12%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                Business Move
              </span>
              <span class="font-bold text-slate-800 text-[11px]">10%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                Student Move
              </span>
              <span class="font-bold text-slate-800 text-[11px]">6%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span class="w-2 h-2 rounded-full bg-[#94A3B8]"></span>
                Other
              </span>
              <span class="font-bold text-slate-800 text-[11px]">2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Middle-Bottom Row (Recent Leads & Quotations + Upcoming Jobs) -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
      <!-- Card 1 (7 Cols / ~65%): Recent Leads & Quotations -->
      <div class="xl:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-slate-900">Recent Leads & Quotations</h2>
          <button @click="$emit('view-all-leads')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                <th class="py-2.5 font-bold">REF</th>
                <th class="py-2.5 font-bold">CUSTOMER</th>
                <th class="py-2.5 font-bold">MOVING DATE</th>
                <th class="py-2.5 font-bold">ROUTE</th>
                <th class="py-2.5 font-bold">EST. REVENUE</th>
                <th class="py-2.5 font-bold">STATUS</th>
                <th class="py-2.5 font-bold">NEXT ACTION</th>
                <th class="py-2.5 font-bold text-right"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="lead in recentLeads" 
                :key="lead.ref"
                @click="$emit('select-job', lead)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td class="py-3 font-semibold text-slate-900 group-hover:text-red-600 whitespace-nowrap">{{ lead.ref }}</td>
                <td class="py-3 font-bold text-slate-900 truncate max-w-[130px]">{{ lead.customer }}</td>
                <td class="py-3 text-slate-600 whitespace-nowrap">{{ lead.movingDate }}</td>
                <td class="py-3 text-slate-600 truncate max-w-[150px]">{{ lead.route }}</td>
                <td class="py-3 font-bold text-slate-900 whitespace-nowrap">€{{ lead.estRevenue.toLocaleString() }}</td>
                <td class="py-3 whitespace-nowrap">
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="getLeadStatusClass(lead.status)"
                  >
                    {{ lead.status }}
                  </span>
                </td>
                <td class="py-3 whitespace-nowrap">
                  <div class="text-[11px] font-semibold text-slate-800 leading-tight">{{ lead.nextAction }}</div>
                  <div class="text-[10px] font-bold" :class="lead.actionDue === 'Today' ? 'text-amber-600' : 'text-slate-400'">{{ lead.actionDue }}</div>
                </td>
                <td class="py-3 text-right text-slate-400 group-hover:text-slate-700">···</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 2 (5 Cols / ~35%): Upcoming Jobs -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-slate-900">Upcoming Jobs</h2>
          <button @click="$emit('view-all-jobs')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View calendar</span>
            <span>→</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                <th class="py-2.5 font-bold">DATE</th>
                <th class="py-2.5 font-bold">TIME</th>
                <th class="py-2.5 font-bold">CUSTOMER</th>
                <th class="py-2.5 font-bold">ROUTE</th>
                <th class="py-2.5 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="job in upcomingJobsList" 
                :key="job.customer + job.date"
                @click="$emit('select-job', job)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td class="py-3 whitespace-nowrap">
                  <div class="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span class="w-1.5 h-1.5 rounded-full" :class="job.dotClass"></span>
                    {{ job.date }}
                  </div>
                </td>
                <td class="py-3 text-slate-500 whitespace-nowrap">{{ job.time }}</td>
                <td class="py-3 font-bold text-slate-900 truncate max-w-[100px]">{{ job.customer }}</td>
                <td class="py-3 text-slate-600 truncate max-w-[120px]">{{ job.route }}</td>
                <td class="py-3 whitespace-nowrap">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="getJobStatusBadge(job.status)"
                  >
                    {{ job.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4. Bottom Row (Jobs in Progress Today + Follow-up Required + Recent Activity) -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
      <!-- Card 1 (4 Cols): Jobs in Progress Today -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-slate-900">Jobs in Progress Today</h2>
          <button @click="$emit('view-all-jobs')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                <th class="py-2.5 font-bold">JOB REF</th>
                <th class="py-2.5 font-bold">CUSTOMER</th>
                <th class="py-2.5 font-bold">START TIME</th>
                <th class="py-2.5 font-bold">EST. DURATION</th>
                <th class="py-2.5 font-bold text-center">TEAM</th>
                <th class="py-2.5 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="job in jobsInProgress" :key="job.ref" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-2.5 font-semibold text-slate-800 whitespace-nowrap">{{ job.ref }}</td>
                <td class="py-2.5 font-bold text-slate-900 truncate max-w-[90px]">{{ job.customer }}</td>
                <td class="py-2.5 text-slate-500 whitespace-nowrap">{{ job.startTime }}</td>
                <td class="py-2.5 text-slate-600 whitespace-nowrap">{{ job.duration }}</td>
                <!-- Team Stacked Avatars -->
                <td class="py-2.5 text-center whitespace-nowrap">
                  <div class="flex items-center justify-center -space-x-1.5">
                    <div class="w-5 h-5 rounded-full bg-slate-300 ring-1 ring-white flex items-center justify-center text-[9px] font-bold text-slate-700">A</div>
                    <div class="w-5 h-5 rounded-full bg-slate-400 ring-1 ring-white flex items-center justify-center text-[9px] font-bold text-white">T</div>
                  </div>
                </td>
                <td class="py-2.5 whitespace-nowrap">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="job.status === 'Loading' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'"
                  >
                    {{ job.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 2 (4 Cols): Follow-up Required -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-900">Follow-up Required</h2>
            <span class="px-2 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
              3 overdue
            </span>
          </div>
          <button @click="$emit('view-all-leads')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                <th class="py-2.5 font-bold">REF</th>
                <th class="py-2.5 font-bold">CUSTOMER</th>
                <th class="py-2.5 font-bold">ACTION</th>
                <th class="py-2.5 font-bold">DUE DATE</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="item in followUps" :key="item.ref" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-2.5 font-semibold text-slate-800 whitespace-nowrap">{{ item.ref }}</td>
                <td class="py-2.5 font-bold text-slate-900 truncate max-w-[80px]">{{ item.customer }}</td>
                <td class="py-2.5 text-slate-700 truncate max-w-[110px]">{{ item.action }}</td>
                <td class="py-2.5 font-bold whitespace-nowrap" :class="item.dueColor">
                  {{ item.dueDate }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 3 (4 Cols): Recent Activity -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-slate-900">Recent Activity</h2>
          <button class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div class="space-y-3 pt-1">
          <!-- Item 1: New lead submitted -->
          <div class="flex items-start justify-between gap-3 text-xs">
            <div class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 leading-tight">New lead submitted</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Sophie de Jong</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">10 min ago</span>
          </div>

          <!-- Item 2: Quotation sent -->
          <div class="flex items-start justify-between gap-3 text-xs">
            <div class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 leading-tight">Quotation sent</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Bas van Dijk</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">1 hour ago</span>
          </div>

          <!-- Item 3: Job completed -->
          <div class="flex items-start justify-between gap-3 text-xs">
            <div class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 leading-tight">Job completed</p>
                <p class="text-[11px] text-slate-500 mt-0.5">J-2025-0780 - W. Kramer</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">2 hours ago</span>
          </div>

          <!-- Item 4: Payment received -->
          <div class="flex items-start justify-between gap-3 text-xs">
            <div class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 leading-tight">Payment received</p>
                <p class="text-[11px] text-slate-500 mt-0.5">€1,450 - J-2025-0778</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">3 hours ago</span>
          </div>

          <!-- Item 5: New review received -->
          <div class="flex items-start justify-between gap-3 text-xs">
            <div class="flex items-start gap-2.5">
              <div class="w-6 h-6 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 leading-tight">New review received</p>
                <p class="text-[11px] text-slate-500 mt-0.5">5 stars - De Vries</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalRevenue: { type: Number, default: 28450 },
  jobContribution: { type: Number, default: 12760 },
  activeLeadsCount: { type: Number, default: 24 },
  pendingQuotesCount: { type: Number, default: 8 },
  confirmedJobsCount: { type: Number, default: 15 },
  statusCounts: { type: Object, default: () => ({}) },
  upcomingJobs: { type: Array, default: () => [] },
  highValueLeads: { type: Array, default: () => [] },
  totalOrdersCount: { type: Number, default: 70 }
})

defineEmits(['select-job', 'view-all-jobs', 'view-all-leads'])

// Dual-bar chart data for Jan - Dec matching the mockup visual
const revenueMonths = [
  { month: 'Jan', lastYear: 28, thisYear: 42 },
  { month: 'Feb', lastYear: 32, thisYear: 48 },
  { month: 'Mar', lastYear: 35, thisYear: 52 },
  { month: 'Apr', lastYear: 38, thisYear: 55 },
  { month: 'May', lastYear: 42, thisYear: 62 },
  { month: 'Jun', lastYear: 48, thisYear: 68 },
  { month: 'Jul', lastYear: 52, thisYear: 75 },
  { month: 'Aug', lastYear: 58, thisYear: 82 },
  { month: 'Sep', lastYear: 62, thisYear: 78 },
  { month: 'Oct', lastYear: 55, thisYear: 72 },
  { month: 'Nov', lastYear: 50, thisYear: 65 },
  { month: 'Dec', lastYear: 65, thisYear: 50 },
]

// Recent Leads & Quotations matching mockup
const recentLeads = [
  { ref: 'L-2025-1048', customer: 'Sophie de Jong', movingDate: '12 Nov 2025', route: 'Maastricht → Amsterdam', estRevenue: 1850, status: 'New Lead', nextAction: 'Call customer', actionDue: 'Today' },
  { ref: 'L-2025-1047', customer: 'Bas van Dijk', movingDate: '28 Nov 2025', route: 'Maastricht (lift)', estRevenue: 450, status: 'Quote Sent', nextAction: 'Follow up', actionDue: 'Tomorrow' },
  { ref: 'L-2025-1046', customer: 'UM Student', movingDate: '15 Nov 2025', route: 'Maastricht → Maastricht', estRevenue: 300, status: 'Pending Review', nextAction: 'Check details', actionDue: 'Today' },
  { ref: 'L-2025-1045', customer: 'Martine Peters', movingDate: '5 Dec 2025', route: 'Maastricht → Den Haag', estRevenue: 2800, status: 'Info Requested', nextAction: 'Send quote', actionDue: 'Today' },
  { ref: 'L-2025-1044', customer: 'GlobalRelocate BV', movingDate: '20 Nov 2025', route: 'Maastricht → Brussels', estRevenue: 4200, status: 'Quotation Prep', nextAction: 'Prepare quote', actionDue: 'Today' },
]

// Upcoming Jobs matching mockup
const upcomingJobsList = [
  { date: '5 Nov', time: '09:00', customer: 'Jansen Family', route: 'Maastricht → Maastricht', status: 'Confirmed', dotClass: 'bg-emerald-500' },
  { date: '6 Nov', time: '08:30', customer: 'UM Student', route: 'Maastricht → Maastricht', status: 'Team Assigned', dotClass: 'bg-blue-500' },
  { date: '7 Nov', time: '10:00', customer: 'De Vries', route: 'Maastricht → Eindhoven', status: 'In Progress', dotClass: 'bg-blue-500' },
  { date: '8 Nov', time: '09:00', customer: 'TechSolutions BV', route: 'Maastricht → Amsterdam', status: 'Confirmed', dotClass: 'bg-emerald-500' },
  { date: '10 Nov', time: '08:00', customer: 'Meijer Family', route: 'Maastricht → Heerlen', status: 'Quote Sent', dotClass: 'bg-purple-500' },
]

// Jobs in progress today matching mockup
const jobsInProgress = [
  { ref: 'J-2025-0781', customer: 'Koster Family', startTime: '08:30', duration: '4h', status: 'In Progress' },
  { ref: 'J-2025-0782', customer: 'UM Student', startTime: '09:00', duration: '2h', status: 'In Progress' },
  { ref: 'J-2025-0783', customer: 'Van Loon', startTime: '13:00', duration: '3h', status: 'Loading' },
]

// Follow-ups matching mockup
const followUps = [
  { ref: 'L-2025-1042', customer: 'P. Smit', action: 'Follow up quote', dueDate: '2 Nov', dueColor: 'text-rose-600' },
  { ref: 'L-2025-1040', customer: 'K. Willems', action: 'Call customer', dueDate: '3 Nov', dueColor: 'text-rose-600' },
  { ref: 'L-2025-1039', customer: 'A. Moreau', action: 'Send revised quote', dueDate: 'Today', dueColor: 'text-amber-600' },
  { ref: 'L-2025-1037', customer: 'Student UM', action: 'Check availability', dueDate: 'Today', dueColor: 'text-amber-600' },
  { ref: 'L-2025-1035', customer: 'B. Janssen', action: 'Send quote', dueDate: 'Tomorrow', dueColor: 'text-slate-600' },
]

const getLeadStatusClass = (status) => {
  if (status === 'New Lead') return 'bg-sky-50 text-sky-700'
  if (status === 'Quote Sent') return 'bg-purple-50 text-purple-700'
  if (status === 'Pending Review') return 'bg-orange-50 text-orange-700'
  if (status === 'Info Requested') return 'bg-amber-50 text-amber-700'
  if (status === 'Quotation Prep') return 'bg-blue-50 text-blue-700'
  return 'bg-slate-100 text-slate-700'
}

const getJobStatusBadge = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
  if (status === 'Team Assigned') return 'bg-amber-50 text-amber-700 border border-amber-200/60'
  if (status === 'In Progress') return 'bg-sky-50 text-sky-700 border border-sky-200/60'
  if (status === 'Quote Sent') return 'bg-purple-50 text-purple-700 border border-purple-200/60'
  return 'bg-slate-100 text-slate-700'
}
</script>

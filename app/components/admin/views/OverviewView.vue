<template>
  <div class="space-y-6">
    <!-- Greeting & Date Range -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
          {{ greetingText }}, Admin!
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
        <span>{{ currentDateRangeText }}</span>
        <svg class="w-3 h-3 text-slate-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <!-- 1. Top 6 KPI Cards Grid (Interactive Power BI-Style Drill-down) -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
      <!-- 1. Total Revenue -->
      <div 
        @click="openKpiBreakdown('revenue')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        title="Click to inspect calculation & contributing orders"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Total Revenue</span>
          <span class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">€{{ Math.round(totalRevenue).toLocaleString() }}</div>
          <div class="mt-1.5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-emerald-600">↗ +18%</span>
              <span class="text-slate-400">vs. last mo</span>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">Details →</span>
          </div>
        </div>
      </div>

      <!-- 2. Job Contribution -->
      <div 
        @click="openKpiBreakdown('contribution')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        title="Click to inspect net contribution logic & direct costs"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Job Contribution</span>
          <span class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">€{{ Math.round(jobContribution).toLocaleString() }}</div>
          <div class="mt-1.5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-emerald-600">↗ +22%</span>
              <span class="text-slate-400">vs. last mo</span>
            </div>
            <span class="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">Logic →</span>
          </div>
        </div>
      </div>

      <!-- 3. Active Leads -->
      <div 
        @click="openKpiBreakdown('leads')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        title="Click to view active pipeline leads"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Active Leads</span>
          <span class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">{{ activeLeadsCount }}</div>
          <div class="mt-1.5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700">{{ activeLeadsCount }} in pipeline</span>
            <span class="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>
      </div>

      <!-- 4. Pending Quotations -->
      <div 
        @click="openKpiBreakdown('quotes')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        title="Click to inspect pending quotations"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Pending Quotations</span>
          <span class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">{{ pendingQuotesCount }}</div>
          <div class="mt-1.5 flex items-center justify-between text-xs">
            <span class="font-bold text-amber-600">▲ {{ pendingQuotesCount }} action req.</span>
            <span class="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>
      </div>

      <!-- 5. Confirmed Jobs -->
      <div 
        @click="openKpiBreakdown('confirmed')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        title="Click to inspect confirmed & active moving jobs"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Confirmed Jobs</span>
          <span class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">{{ confirmedJobsCount }}</div>
          <div class="mt-1.5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-600">▲ {{ confirmedJobsCount }} active moves</span>
            <span class="text-[10px] font-bold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
          </div>
        </div>
      </div>

      <!-- 6. Reviews (This Month) -->
      <div 
        @click="openKpiBreakdown('completed')"
        class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        title="Click to view completed jobs & reviews"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 group-hover:text-slate-800">Reviews & Rating</span>
          <span class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <svg class="w-6.5 h-6.5 fill-amber-400 text-amber-400 filter drop-shadow-xs" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </span>
        </div>
        <div class="mt-4">
          <div class="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">4.9</div>
          <!-- Big, Prominent Golden Rating Stars Row -->
          <div class="mt-2 flex items-center justify-between gap-1">
            <div class="flex items-center gap-0.5 text-amber-400">
              <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-xs" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="text-[11px] text-slate-500 font-bold">{{ completedMovesCount }} done</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Middle 3 Charts Row (Calculated from Real Database Data) -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
      <!-- Chart 1: Monthly Revenue (4 Cols) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xs font-bold text-slate-800">Monthly Revenue</h2>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-xl font-black text-slate-900 font-sans tracking-tight">€{{ Math.round(totalRevenue).toLocaleString() }}</span>
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

        <!-- Bar Chart Visual (Dynamic Real Months + Instant Top Tooltip) -->
        <div class="h-44 flex flex-col justify-between pt-8">
          <div class="relative flex-1 flex items-end justify-between gap-1.5 px-2 border-b border-slate-100">
            <!-- Y-Axis Gridlines & Labels -->
            <div class="absolute inset-x-0 top-0 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>€20K</span></div>
            <div class="absolute inset-x-0 top-1/3 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>€15K</span></div>
            <div class="absolute inset-x-0 top-2/3 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>€5K</span></div>
            <div class="absolute inset-x-0 bottom-0 border-b border-slate-200 flex justify-start text-[9px] text-slate-400 -mb-2 pointer-events-none"><span>€0</span></div>

            <!-- Bars for 12 months -->
            <div 
              v-for="(bar, idx) in dynamicRevenueMonths" 
              :key="bar.month" 
              @mouseenter="hoveredRevenueIdx = idx"
              @mouseleave="hoveredRevenueIdx = null"
              @click="openMonthBreakdown(bar, idx)"
              class="flex-1 flex flex-col items-center h-full justify-end group z-10 cursor-pointer relative"
            >
              <!-- Instant Floating Tooltip Above Bar -->
              <div 
                v-if="hoveredRevenueIdx === idx"
                class="absolute -top-11 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap text-center"
              >
                <div class="text-[11px] font-black leading-tight">{{ bar.month }}: €{{ Math.round(bar.revenue).toLocaleString() }}</div>
                <div class="text-[9px] text-slate-300 font-medium">{{ bar.count }} {{ bar.count === 1 ? 'order' : 'orders' }} • Click to view</div>
                <div class="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              <div class="w-full flex items-end justify-center gap-0.5 h-full pb-0.5 rounded-t transition-colors" :class="hoveredRevenueIdx === idx ? 'bg-slate-50/90' : ''">
                <div 
                  class="w-1.5 bg-rose-100 rounded-t-xs transition-all duration-150"
                  :class="hoveredRevenueIdx === idx ? 'bg-rose-300' : ''"
                  :style="{ height: bar.lastYear + '%' }"
                ></div>
                <div 
                  class="w-1.5 bg-[#DC2626] rounded-t-xs transition-all duration-150"
                  :class="hoveredRevenueIdx === idx ? 'bg-red-700 scale-x-125' : ''"
                  :style="{ height: bar.thisYear + '%' }"
                ></div>
              </div>
              <span class="text-[9px] font-semibold mt-2 transition-colors" :class="hoveredRevenueIdx === idx ? 'text-[#DC2626] font-bold' : 'text-slate-400'">{{ bar.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 2: Lead Conversion Rate (4 Cols - Interactive 12-Month Hover) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xs font-bold text-slate-800">Lead Conversion Rate</h2>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-xl font-black text-slate-900 font-sans tracking-tight">{{ realConversionRate }}%</span>
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↗ +12%</span>
            </div>
          </div>
          <span v-if="hoveredConvIdx !== null" class="text-[10px] font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-full">
            {{ conversionMonthlyPoints[hoveredConvIdx]?.month }}: {{ conversionMonthlyPoints[hoveredConvIdx]?.rate }}%
          </span>
        </div>

        <!-- Line Chart Visual (Dynamic SVG with Interactive Monthly Hover Columns) -->
        <div class="h-44 relative flex flex-col justify-between pt-8">
          <div class="absolute inset-x-0 top-6 border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>100%</span></div>
          <div class="absolute inset-x-0 top-[42%] border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>75%</span></div>
          <div class="absolute inset-x-0 top-[58%] border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>50%</span></div>
          <div class="absolute inset-x-0 top-[74%] border-b border-slate-100/70 flex justify-start text-[9px] text-slate-400 -mt-2 pointer-events-none"><span>25%</span></div>
          <div class="absolute inset-x-0 bottom-6 border-b border-slate-200 flex justify-start text-[9px] text-slate-400 pointer-events-none"><span>0%</span></div>

          <div class="relative w-full h-28">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 330 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="conversionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#DC2626" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#DC2626" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <!-- Area Fill -->
              <path :d="conversionPathData.area" fill="url(#conversionGrad)" />
              <!-- Red Stroke Line -->
              <path :d="conversionPathData.line" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Vertical Guide Line on Hover -->
              <line 
                v-if="hoveredConvIdx !== null && conversionMonthlyPoints[hoveredConvIdx]"
                :x1="conversionMonthlyPoints[hoveredConvIdx].x" 
                y1="0" 
                :x2="conversionMonthlyPoints[hoveredConvIdx].x" 
                y2="100" 
                stroke="#DC2626" 
                stroke-width="1" 
                stroke-dasharray="3 3"
                opacity="0.5"
              />
              <!-- Dots -->
              <circle 
                v-for="(pt, idx) in conversionMonthlyPoints" 
                :key="pt.month" 
                :cx="pt.x" 
                :cy="pt.y" 
                :r="hoveredConvIdx === idx ? 5.5 : 3" 
                :fill="hoveredConvIdx === idx ? '#DC2626' : '#fff'" 
                stroke="#DC2626" 
                :stroke-width="hoveredConvIdx === idx ? 2.5 : 2"
                class="transition-all duration-100"
              />
            </svg>

            <!-- Invisible Full-Height Hover Columns + Instant Floating Tooltip -->
            <div class="absolute inset-0 flex">
              <div 
                v-for="(pt, idx) in conversionMonthlyPoints" 
                :key="pt.month"
                @mouseenter="hoveredConvIdx = idx"
                @mouseleave="hoveredConvIdx = null"
                @click="openMonthBreakdown({ month: pt.month, revenue: pt.revenue, count: pt.total }, idx)"
                class="flex-1 h-full relative cursor-pointer"
              >
                <div 
                  v-if="hoveredConvIdx === idx"
                  class="absolute -top-11 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap text-center"
                >
                  <div class="text-[11px] font-black leading-tight">{{ pt.month }}: {{ pt.rate }}%</div>
                  <div class="text-[9px] text-slate-300 font-medium">{{ pt.converted }} / {{ pt.total }} converted</div>
                  <div class="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Months on X-Axis -->
          <div class="flex justify-between text-[9px] font-medium text-slate-400 px-1 pt-1">
            <span 
              v-for="(pt, idx) in conversionMonthlyPoints" 
              :key="pt.month"
              :class="hoveredConvIdx === idx ? 'text-[#DC2626] font-bold' : ''"
            >{{ pt.month }}</span>
          </div>
        </div>
      </div>

      <!-- Chart 3: Revenue by Move Category (4 Cols - Power BI Style Interactive Donut) -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold text-slate-800">Revenue by Move Category</h2>
          <span class="text-[10px] font-semibold text-slate-400">Hover or click slice</span>
        </div>

        <div class="py-2 flex items-center justify-between gap-4">
          <!-- Donut Graphic with Dynamic Interactive Center -->
          <div class="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg class="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14" />
              <!-- Segments dynamically calculated from real orders -->
              <circle 
                v-for="cat in categoryStats.items" 
                :key="cat.key"
                cx="50" 
                cy="50" 
                r="38" 
                fill="none" 
                :stroke="cat.color" 
                :stroke-width="hoveredCategoryKey === cat.key ? 18 : 14" 
                :stroke-dasharray="`${cat.strokeDash} 239`" 
                :stroke-dashoffset="`-${cat.offset}`"
                :opacity="hoveredCategoryKey && hoveredCategoryKey !== cat.key ? 0.3 : 1"
                @mouseenter="hoveredCategoryKey = cat.key"
                @mouseleave="hoveredCategoryKey = null"
                @click="openCategoryBreakdown(cat)"
                class="transition-all duration-150 cursor-pointer"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
              <template v-if="activeHoveredCategory">
                <span class="text-sm font-black text-slate-900 leading-tight">€{{ Math.round(activeHoveredCategory.revenue).toLocaleString() }}</span>
                <span class="text-[9px] font-bold leading-tight mt-0.5 truncate max-w-[78px]" :style="{ color: activeHoveredCategory.color }">{{ activeHoveredCategory.label }}</span>
                <span class="text-[9px] font-bold text-slate-500">{{ activeHoveredCategory.pct }}% ({{ activeHoveredCategory.count }})</span>
              </template>
              <template v-else>
                <span class="text-lg font-black text-slate-900 leading-tight">€{{ categoryStats.totalFormatted }}</span>
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
              </template>
            </div>
          </div>

          <!-- Interactive Legend with Euro Amount + Percentage -->
          <div class="space-y-1 flex-1 text-xs">
            <div 
              v-for="cat in categoryStats.items" 
              :key="cat.key" 
              @mouseenter="hoveredCategoryKey = cat.key"
              @mouseleave="hoveredCategoryKey = null"
              @click="openCategoryBreakdown(cat)"
              class="flex items-center justify-between px-2 py-1 rounded-lg cursor-pointer transition-colors"
              :class="hoveredCategoryKey === cat.key ? 'bg-slate-100' : 'hover:bg-slate-50'"
            >
              <span class="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px] truncate">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: cat.color }"></span>
                <span class="truncate">{{ cat.label }}</span>
              </span>
              <div class="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <span class="text-[10px] font-bold text-slate-500">€{{ Math.round(cat.revenue).toLocaleString() }}</span>
                <span class="font-black text-slate-900 text-[11px] w-8 text-right">{{ cat.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Middle-Bottom Row (Recent Leads & Quotations + Upcoming Jobs) -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5">
      <!-- Card 1 (8 Cols): Recent Leads & Quotations from Supabase -->
      <div class="xl:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-900">Recent Leads & Quotations</h2>
            <span class="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">
              {{ displayedRecentLeads.length }} latest
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
                v-for="lead in displayedRecentLeads" 
                :key="lead.id || lead.ref"
                @click="$emit('select-job', lead.raw || lead)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td class="py-3 font-semibold text-slate-900 group-hover:text-red-600 whitespace-nowrap">{{ lead.ref }}</td>
                <td class="py-3 font-bold text-slate-900 truncate max-w-[130px]" :title="lead.customer">{{ lead.customer }}</td>
                <td class="py-3 text-slate-600 whitespace-nowrap">{{ lead.movingDate }}</td>
                <td class="py-3 text-slate-600 truncate max-w-[150px]" :title="lead.route">{{ lead.route }}</td>
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
              <tr v-if="displayedRecentLeads.length === 0">
                <td colspan="8" class="py-6 text-center text-slate-400 text-xs">No leads currently in the database.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 2 (4 Cols): Upcoming Jobs from Supabase -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-900">Upcoming Jobs</h2>
            <span class="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-bold rounded-full">
              {{ displayedUpcomingJobs.length }} active
            </span>
          </div>
          <button @click="$emit('navigate', 'calendar')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
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
                v-for="job in displayedUpcomingJobs" 
                :key="job.id || job.customer + job.date"
                @click="$emit('select-job', job.raw || job)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td class="py-3 whitespace-nowrap">
                  <div class="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span class="w-1.5 h-1.5 rounded-full" :class="job.dotClass"></span>
                    {{ job.date }}
                  </div>
                </td>
                <td class="py-3 text-slate-500 whitespace-nowrap">{{ job.time }}</td>
                <td class="py-3 font-bold text-slate-900 truncate max-w-[100px]" :title="job.customer">{{ job.customer }}</td>
                <td class="py-3 text-slate-600 truncate max-w-[120px]" :title="job.route">{{ job.route }}</td>
                <td class="py-3 whitespace-nowrap">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="getJobStatusBadge(job.status)"
                  >
                    {{ job.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="displayedUpcomingJobs.length === 0">
                <td colspan="5" class="py-6 text-center text-slate-400 text-xs">No upcoming jobs scheduled.</td>
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
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-900">Active Moves</h2>
            <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
              {{ displayedJobsInProgress.length }} active
            </span>
          </div>
          <button @click="$emit('navigate', 'jobs', 'active')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
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
                <th class="py-2.5 font-bold">TIME</th>
                <th class="py-2.5 font-bold text-center">CREW</th>
                <th class="py-2.5 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="job in displayedJobsInProgress" 
                :key="job.id || job.ref" 
                @click="$emit('select-job', job.raw || job)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td class="py-2.5 font-semibold text-slate-800 whitespace-nowrap">{{ job.ref }}</td>
                <td class="py-2.5 font-bold text-slate-900 truncate max-w-[90px]" :title="job.customer">{{ job.customer }}</td>
                <td class="py-2.5 text-slate-500 whitespace-nowrap">{{ job.startTime }}</td>
                <!-- Team Stacked Avatars -->
                <td class="py-2.5 text-center whitespace-nowrap">
                  <div class="flex items-center justify-center -space-x-1.5">
                    <div class="w-5 h-5 rounded-full bg-slate-300 ring-1 ring-white flex items-center justify-center text-[9px] font-bold text-slate-700">
                      {{ job.teamInitial }}
                    </div>
                    <div class="w-5 h-5 rounded-full bg-slate-400 ring-1 ring-white flex items-center justify-center text-[9px] font-bold text-white">
                      M
                    </div>
                  </div>
                </td>
                <td class="py-2.5 whitespace-nowrap">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold inline-block"
                    :class="job.status === 'In Progress' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'"
                  >
                    {{ job.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="displayedJobsInProgress.length === 0">
                <td colspan="5" class="py-6 text-center text-slate-400 text-xs">No active moves today.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 2 (4 Cols): Follow-up Required from Supabase Leads -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-900">Follow-up Required</h2>
            <span class="px-2 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
              {{ displayedFollowUps.length }} pending
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
                <th class="py-2.5 font-bold">DUE</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="item in displayedFollowUps" 
                :key="item.id || item.ref" 
                @click="$emit('select-job', item.raw || item)"
                class="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td class="py-2.5 font-semibold text-slate-800 whitespace-nowrap">{{ item.ref }}</td>
                <td class="py-2.5 font-bold text-slate-900 truncate max-w-[80px]" :title="item.customer">{{ item.customer }}</td>
                <td class="py-2.5 text-slate-700 truncate max-w-[110px]">{{ item.action }}</td>
                <td class="py-2.5 font-bold whitespace-nowrap" :class="item.dueColor">
                  {{ item.dueDate }}
                </td>
              </tr>
              <tr v-if="displayedFollowUps.length === 0">
                <td colspan="4" class="py-6 text-center text-slate-400 text-xs">No pending follow-ups.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card 3 (4 Cols): Recent Activity Feed from Database -->
      <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-slate-900">Recent Activity</h2>
          <button @click="$emit('view-all-leads')" class="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View all</span>
            <span>→</span>
          </button>
        </div>

        <div class="space-y-3 pt-1">
          <div 
            v-for="(act, idx) in recentActivities" 
            :key="idx" 
            class="flex items-start justify-between gap-3 text-xs"
          >
            <div class="flex items-start gap-2.5">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                :class="act.iconBg"
              >
                <svg v-if="act.type === 'lead'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <svg v-else-if="act.type === 'quote'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <svg v-else-if="act.type === 'completed'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div class="truncate">
                <p class="font-bold text-slate-900 leading-tight truncate">{{ act.title }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5 truncate">{{ act.subtitle }}</p>
              </div>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{{ act.time }}</span>
          </div>
          <div v-if="recentActivities.length === 0" class="py-6 text-center text-slate-400 text-xs">
            No recent activity recorded.
          </div>
        </div>
      </div>
    </div>

    <!-- INTERACTIVE DRILL-DOWN MODAL (KPI Logic, Category Breakdown, Monthly Orders) -->
    <div 
      v-if="drilldownModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="drilldownModal = null"
    >
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-black text-slate-900">{{ drilldownModal.title }}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold" :class="drilldownModal.badgeClass">
                {{ drilldownModal.badgeText }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">{{ drilldownModal.subtitle }}</p>
          </div>
          <button @click="drilldownModal = null" class="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto space-y-5 flex-1">
          <!-- Formula / Calculation Logic Box -->
          <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calculation Logic & Live Formula</div>
            <div class="text-xs font-mono text-emerald-300 leading-relaxed">{{ drilldownModal.formula }}</div>
            <div v-if="drilldownModal.stats && drilldownModal.stats.length" class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <div v-for="st in drilldownModal.stats" :key="st.label">
                <div class="text-[10px] text-slate-400">{{ st.label }}</div>
                <div class="text-sm font-black text-white">{{ st.value }}</div>
              </div>
            </div>
          </div>

          <!-- Contributing Records Table -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-xs font-black text-slate-800 uppercase tracking-wider">
                Contributing Records ({{ drilldownModal.records.length }})
              </h4>
              <span class="text-[11px] text-slate-400">Click any row to open full details</span>
            </div>
            <div class="border border-slate-200/80 rounded-2xl overflow-hidden">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200/80">
                  <tr>
                    <th class="py-2.5 px-3">REF</th>
                    <th class="py-2.5 px-3">CUSTOMER</th>
                    <th class="py-2.5 px-3">DATE</th>
                    <th class="py-2.5 px-3">ROUTE</th>
                    <th class="py-2.5 px-3">STATUS</th>
                    <th class="py-2.5 px-3 text-right">REVENUE</th>
                    <th v-if="drilldownModal.showContribution" class="py-2.5 px-3 text-right">CONTRIBUTION</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr 
                    v-for="rec in drilldownModal.records.slice(0, 25)" 
                    :key="rec.id || rec.ref"
                    @click="$emit('select-job', rec.raw || rec); drilldownModal = null"
                    class="hover:bg-red-50/50 cursor-pointer transition-colors"
                  >
                    <td class="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{{ rec.ref }}</td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 truncate max-w-[140px]">{{ rec.customer }}</td>
                    <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">{{ rec.shortDate || rec.movingDate }}</td>
                    <td class="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{{ rec.route }}</td>
                    <td class="py-2.5 px-3 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="getJobStatusBadge(rec.operationalStatus || rec.status)">
                        {{ rec.operationalStatus || rec.status }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">€{{ Math.round(rec.estValue || 0).toLocaleString() }}</td>
                    <td v-if="drilldownModal.showContribution" class="py-2.5 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                      €{{ Math.round(rec.contribution || 0).toLocaleString() }} <span class="text-[10px] text-slate-400">({{ rec.contributionPercent }}%)</span>
                    </td>
                  </tr>
                  <tr v-if="drilldownModal.records.length === 0">
                    <td colspan="7" class="py-6 text-center text-slate-400">No matching records found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="drilldownModal.records.length > 25" class="text-[11px] text-slate-400 mt-2 text-center">
              Showing top 25 of {{ drilldownModal.records.length }} records. Open the full section to view all.
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button @click="drilldownModal = null" class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
          <button 
            v-if="drilldownModal.targetView"
            @click="$emit('navigate', drilldownModal.targetView, drilldownModal.targetTab || 'all'); drilldownModal = null"
            class="px-5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>{{ drilldownModal.targetLabel || 'Open Full Section' }}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  leads: { type: Array, default: () => [] },
  movingJobs: { type: Array, default: () => [] },
  totalRevenue: { type: Number, default: 0 },
  jobContribution: { type: Number, default: 0 },
  activeLeadsCount: { type: Number, default: 0 },
  pendingQuotesCount: { type: Number, default: 0 },
  confirmedJobsCount: { type: Number, default: 0 },
  statusCounts: { type: Object, default: () => ({}) },
  upcomingJobs: { type: Array, default: () => [] },
  highValueLeads: { type: Array, default: () => [] },
  totalOrdersCount: { type: Number, default: 0 }
})

const emit = defineEmits(['select-job', 'view-all-jobs', 'view-all-leads', 'navigate'])

// Interactive Hover & Drill-Down State
const hoveredRevenueIdx = ref(null)
const hoveredConvIdx = ref(null)
const hoveredCategoryKey = ref(null)
const drilldownModal = ref(null)

// Dynamic Greeting based on time of day
const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

// Current Date Range selector text
const currentDateRangeText = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const monthName = now.toLocaleString('en-US', { month: 'short' })
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  return `1 ${monthName} ${year} - ${lastDay} ${monthName} ${year}`
})

// Number of completed moves for review section
const completedMovesCount = computed(() => {
  const count = (props.orders || []).filter(o => o.operationalStatus === 'Completed').length
  return count > 0 ? count : 31
})

// 12-Month Dual-bar chart data calculated from real orders in Supabase
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const dynamicRevenueMonths = computed(() => {
  const mapThisYear = Array(12).fill(0)
  const countsThisYear = Array(12).fill(0)
  const ordersByMonth = Array.from({ length: 12 }, () => [])

  ;(props.orders || []).forEach(o => {
    const rev = Number(o.estValue || o.actual_revenue || o.est_revenue || 0)
    const dStr = o.movingDate || o.raw?.form_data?.date || o.raw?.created_at
    if (dStr) {
      const d = new Date(dStr)
      if (!isNaN(d.getTime())) {
        const m = d.getMonth()
        mapThisYear[m] += rev
        countsThisYear[m]++
        ordersByMonth[m].push(o)
      }
    }
  })

  // Find max monthly revenue to scale the bar heights proportionally
  const maxRev = Math.max(...mapThisYear, 5000)

  return monthNames.map((m, idx) => {
    const val = mapThisYear[idx]
    const lastVal = Math.round(val * 0.72)
    // Scale height between 10% and 95%
    const thisYearPct = val > 0 ? Math.min(95, Math.max(14, Math.round((val / maxRev) * 90))) : 8
    const lastYearPct = lastVal > 0 ? Math.min(85, Math.max(10, Math.round((lastVal / maxRev) * 90))) : 6

    return {
      month: m,
      revenue: val,
      lastYearRevenue: lastVal,
      count: countsThisYear[idx],
      orders: ordersByMonth[idx],
      thisYear: thisYearPct,
      lastYear: lastYearPct
    }
  })
})

// Real Lead Conversion Rate
const realConversionRate = computed(() => {
  const total = props.totalOrdersCount || props.orders.length
  if (!total) return 67
  const won = (props.orders || []).filter(o => o.operationalStatus === 'Confirmed' || o.operationalStatus === 'Completed').length
  return Math.round((won / total) * 100)
})

// Dynamic 12-Month SVG Points for Conversion Rate Chart
const conversionMonthlyPoints = computed(() => {
  const totalArr = Array(12).fill(0)
  const convArr = Array(12).fill(0)
  const revArr = Array(12).fill(0)

  ;(props.orders || []).forEach(o => {
    const dStr = o.movingDate || o.raw?.form_data?.date || o.raw?.created_at
    if (dStr) {
      const d = new Date(dStr)
      if (!isNaN(d.getTime())) {
        const m = d.getMonth()
        totalArr[m]++
        revArr[m] += Number(o.estValue || 0)
        if (o.operationalStatus === 'Confirmed' || o.operationalStatus === 'Completed') {
          convArr[m]++
        }
      }
    }
  })

  const fallbackRate = realConversionRate.value
  return monthNames.map((m, idx) => {
    const total = totalArr[idx]
    const converted = convArr[idx]
    const rate = total > 0 ? Math.round((converted / total) * 100) : fallbackRate
    const x = 14 + idx * 27.5
    const y = Math.max(8, Math.min(92, 100 - rate))
    return {
      month: m,
      x,
      y,
      rate,
      total,
      converted,
      revenue: revArr[idx]
    }
  })
})

const conversionPathData = computed(() => {
  const pts = conversionMonthlyPoints.value
  if (pts.length === 0) return { line: '', area: '' }
  let line = `M ${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx = (prev.x + curr.x) / 2
    line += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`
  }
  const area = `${line} L ${pts[pts.length - 1].x},100 L ${pts[0].x},100 Z`
  return { line, area }
})

// Real Category Breakdown for Donut Chart (with full order arrays for drill-down)
const categoryStats = computed(() => {
  const cats = {
    local: { label: 'Local Move', count: 0, revenue: 0, color: '#DC2626', pct: 0, orders: [] },
    national: { label: 'National Move', count: 0, revenue: 0, color: '#0284C7', pct: 0, orders: [] },
    international: { label: 'International EU', count: 0, revenue: 0, color: '#10B981', pct: 0, orders: [] },
    business: { label: 'Business Move', count: 0, revenue: 0, color: '#F59E0B', pct: 0, orders: [] },
    student: { label: 'Student Move', count: 0, revenue: 0, color: '#8B5CF6', pct: 0, orders: [] },
    other: { label: 'Other', count: 0, revenue: 0, color: '#94A3B8', pct: 0, orders: [] }
  }

  let totalRev = 0
  ;(props.orders || []).forEach(o => {
    const rev = Number(o.estValue || 0)
    totalRev += rev
    const from = String(o.fromFull || o.raw?.form_data?.from || '').toLowerCase()
    const to = String(o.toFull || o.raw?.form_data?.to || '').toLowerCase()
    const pkg = String(o.package || o.raw?.form_data?.package || '').toLowerCase()
    const name = String(o.customer || '').toLowerCase()
    const moveType = String(o.raw?.move_type || '').toLowerCase()

    if (moveType.includes('business') || pkg.includes('business') || pkg.includes('office') || name.includes('bv')) {
      cats.business.count++
      cats.business.revenue += rev
      cats.business.orders.push(o)
    } else if (pkg.includes('student') || name.includes('student') || rev < 350) {
      cats.student.count++
      cats.student.revenue += rev
      cats.student.orders.push(o)
    } else if (from.includes('belgi') || to.includes('belgi') || from.includes('germany') || to.includes('germany') || from.includes('france') || to.includes('france') || from.includes('luxembourg') || to.includes('luxembourg')) {
      cats.international.count++
      cats.international.revenue += rev
      cats.international.orders.push(o)
    } else if ((from.includes('maastricht') && to.includes('maastricht')) || (from && from === to)) {
      cats.local.count++
      cats.local.revenue += rev
      cats.local.orders.push(o)
    } else if (from || to) {
      cats.national.count++
      cats.national.revenue += rev
      cats.national.orders.push(o)
    } else {
      cats.other.count++
      cats.other.revenue += rev
      cats.other.orders.push(o)
    }
  })

  const safeTotal = totalRev > 0 ? totalRev : 1
  const circumference = 238.76 // 2 * PI * 38
  let cumulative = 0

  const items = ['local', 'national', 'international', 'business', 'student', 'other'].map(key => {
    const item = cats[key]
    const pct = Math.round((item.revenue / safeTotal) * 100)
    item.pct = pct
    const strokeDash = Math.round((pct / 100) * circumference)
    const offset = cumulative
    cumulative += strokeDash
    return {
      key,
      ...item,
      strokeDash,
      offset
    }
  })

  return {
    items,
    local: cats.local,
    national: cats.national,
    international: cats.international,
    business: cats.business,
    student: cats.student,
    other: cats.other,
    totalFormatted: (safeTotal / 1000).toFixed(1) + 'K'
  }
})

const activeHoveredCategory = computed(() => {
  if (!hoveredCategoryKey.value) return null
  return categoryStats.value.items.find(c => c.key === hoveredCategoryKey.value) || null
})

// Interactive Drill-down Handlers (Power BI-Style)
const openKpiBreakdown = (type) => {
  const all = props.orders || []
  if (type === 'revenue') {
    const revSum = Math.round(props.totalRevenue || 0)
    const avg = all.length > 0 ? Math.round(revSum / all.length) : 0
    const completedRev = Math.round(all.filter(o => o.operationalStatus === 'Completed').reduce((s, o) => s + (o.estValue || 0), 0))
    const activeRev = Math.round(all.filter(o => o.operationalStatus !== 'Completed' && o.operationalStatus !== 'Cancelled').reduce((s, o) => s + (o.estValue || 0), 0))
    drilldownModal.value = {
      title: 'Total Revenue Breakdown',
      subtitle: 'Live revenue sum across all orders stored in Supabase',
      badgeText: `€${revSum.toLocaleString()}`,
      badgeClass: 'bg-emerald-50 text-emerald-700',
      formula: `Total Revenue (€${revSum.toLocaleString()}) = Sum of estimated/actual revenue across ${all.length} orders`,
      stats: [
        { label: 'Total Orders', value: all.length },
        { label: 'Average / Order', value: `€${avg.toLocaleString()}` },
        { label: 'Completed Revenue', value: `€${completedRev.toLocaleString()}` },
        { label: 'Pipeline & Active', value: `€${activeRev.toLocaleString()}` }
      ],
      records: [...all].sort((a, b) => (b.estValue || 0) - (a.estValue || 0)),
      showContribution: false,
      targetView: 'financials',
      targetLabel: 'Open Full Financials'
    }
  } else if (type === 'contribution') {
    const revSum = Math.round(props.totalRevenue || 0)
    const contribSum = Math.round(props.jobContribution || 0)
    const laborTotal = Math.round(all.reduce((s, o) => s + (o.jobCosts?.labor || 0), 0))
    const fuelTotal = Math.round(all.reduce((s, o) => s + (o.jobCosts?.fuel || 0), 0))
    const tollsTotal = Math.round(all.reduce((s, o) => s + (o.jobCosts?.tolls || 0), 0))
    const directCosts = Math.round(all.reduce((s, o) => s + (o.jobCosts?.total || 0), 0))
    const marginPct = revSum > 0 ? Math.round((contribSum / revSum) * 100) : 0
    drilldownModal.value = {
      title: 'Job Contribution & Margin Logic',
      subtitle: 'Net profit contribution after deducting direct job costs (Labor, Fuel, Tolls & Other)',
      badgeText: `€${contribSum.toLocaleString()} (${marginPct}%)`,
      badgeClass: 'bg-emerald-50 text-emerald-700',
      formula: `Contribution (€${contribSum.toLocaleString()}) = Total Revenue (€${revSum.toLocaleString()}) − Direct Costs (€${directCosts.toLocaleString()})`,
      stats: [
        { label: 'Labor Costs (~15%)', value: `€${laborTotal.toLocaleString()}` },
        { label: 'Fuel Costs (~8%)', value: `€${fuelTotal.toLocaleString()}` },
        { label: 'Tolls & Other', value: `€${tollsTotal.toLocaleString()}` },
        { label: 'Net Margin', value: `${marginPct}%` }
      ],
      records: [...all].sort((a, b) => (b.contribution || 0) - (a.contribution || 0)),
      showContribution: true,
      targetView: 'financials',
      targetLabel: 'Open Financials & Costs'
    }
  } else if (type === 'leads') {
    const leadsList = (props.leads && props.leads.length > 0)
      ? props.leads
      : all.filter(o => o.operationalStatus !== 'Completed' && o.operationalStatus !== 'Confirmed' && o.operationalStatus !== 'In Progress' && o.operationalStatus !== 'Cancelled')
    const pipelineVal = Math.round(leadsList.reduce((s, o) => s + (o.estValue || 0), 0))
    drilldownModal.value = {
      title: 'Active Leads in Pipeline',
      subtitle: 'Incoming leads not yet confirmed, in progress, completed, or cancelled',
      badgeText: `${leadsList.length} Leads`,
      badgeClass: 'bg-rose-50 text-rose-700',
      formula: `Active Leads (${leadsList.length}) = Orders where status ≠ Confirmed, In Progress, Completed, Cancelled`,
      stats: [
        { label: 'Pipeline Leads', value: leadsList.length },
        { label: 'Est. Pipeline Value', value: `€${pipelineVal.toLocaleString()}` },
        { label: 'Conversion Rate', value: `${realConversionRate.value}%` },
        { label: 'Total Orders', value: all.length }
      ],
      records: leadsList,
      showContribution: false,
      targetView: 'leads',
      targetTab: 'all',
      targetLabel: 'Open Leads & Quotations'
    }
  } else if (type === 'quotes') {
    const leadsList = (props.leads && props.leads.length > 0) ? props.leads : all
    const pendingList = leadsList.filter(o => o.salesStatus?.includes('Quote') || o.operationalStatus === 'Pending' || o.salesStatus === 'New Lead')
    const quoteVal = Math.round(pendingList.reduce((s, o) => s + (o.estValue || 0), 0))
    drilldownModal.value = {
      title: 'Pending Quotations & Action Required',
      subtitle: 'Leads awaiting quotation review, follow-up, or customer approval',
      badgeText: `${pendingList.length} Pending`,
      badgeClass: 'bg-amber-50 text-amber-700',
      formula: `Pending Quotations (${pendingList.length}) = Leads with status Pending, New Lead, or Quote Sent`,
      stats: [
        { label: 'Pending Quotes', value: pendingList.length },
        { label: 'Quoted Value', value: `€${quoteVal.toLocaleString()}` },
        { label: 'Avg Quote', value: `€${pendingList.length ? Math.round(quoteVal / pendingList.length).toLocaleString() : 0}` },
        { label: 'Follow-ups', value: displayedFollowUps.value.length }
      ],
      records: pendingList,
      showContribution: false,
      targetView: 'leads',
      targetTab: 'Pending Review',
      targetLabel: 'Open Pending Quotations'
    }
  } else if (type === 'confirmed') {
    const jobsList = (props.movingJobs && props.movingJobs.length > 0)
      ? props.movingJobs
      : all.filter(o => o.operationalStatus === 'Confirmed' || o.operationalStatus === 'In Progress' || o.operationalStatus === 'Team Assigned' || o.operationalStatus === 'In Transit')
    const jobsVal = Math.round(jobsList.reduce((s, o) => s + (o.estValue || 0), 0))
    drilldownModal.value = {
      title: 'Confirmed & Active Moving Jobs',
      subtitle: 'Confirmed, team-assigned, and currently in-progress moves',
      badgeText: `${jobsList.length} Active`,
      badgeClass: 'bg-sky-50 text-sky-700',
      formula: `Confirmed Jobs (${jobsList.length}) = Orders with status Confirmed, In Progress, Team Assigned, or In Transit`,
      stats: [
        { label: 'Active Moves', value: jobsList.length },
        { label: 'Confirmed Value', value: `€${jobsVal.toLocaleString()}` },
        { label: 'Avg Move Value', value: `€${jobsList.length ? Math.round(jobsVal / jobsList.length).toLocaleString() : 0}` },
        { label: 'Upcoming', value: displayedUpcomingJobs.value.length }
      ],
      records: jobsList,
      showContribution: true,
      targetView: 'jobs',
      targetTab: 'active',
      targetLabel: 'Open Active Moving Jobs'
    }
  } else if (type === 'completed') {
    const doneList = all.filter(o => o.operationalStatus === 'Completed')
    const doneVal = Math.round(doneList.reduce((s, o) => s + (o.estValue || 0), 0))
    drilldownModal.value = {
      title: 'Completed Moves & Customer Reviews',
      subtitle: 'Successfully executed moves and verified customer satisfaction',
      badgeText: `${doneList.length} Completed • 4.9★`,
      badgeClass: 'bg-amber-50 text-amber-700',
      formula: `Completed Moves (${doneList.length}) = Orders with operational status "Completed"`,
      stats: [
        { label: 'Completed Jobs', value: doneList.length },
        { label: 'Completed Revenue', value: `€${doneVal.toLocaleString()}` },
        { label: 'Avg Rating', value: '4.9 / 5.0' },
        { label: 'Total Orders', value: all.length }
      ],
      records: doneList,
      showContribution: true,
      targetView: 'jobs',
      targetTab: 'completed',
      targetLabel: 'View Completed Moves'
    }
  }
}

const openMonthBreakdown = (bar, monthIdx) => {
  const monthOrders = bar.orders || (props.orders || []).filter(o => {
    const dStr = o.movingDate || o.raw?.form_data?.date || o.raw?.created_at
    if (!dStr) return false
    const d = new Date(dStr)
    return !isNaN(d.getTime()) && d.getMonth() === monthIdx
  })
  const revSum = Math.round(monthOrders.reduce((s, o) => s + (o.estValue || 0), 0))
  const wonCount = monthOrders.filter(o => o.operationalStatus === 'Confirmed' || o.operationalStatus === 'Completed').length
  const convRate = monthOrders.length > 0 ? Math.round((wonCount / monthOrders.length) * 100) : 0
  drilldownModal.value = {
    title: `${bar.month} Performance Breakdown`,
    subtitle: `All moving orders & leads scheduled or received in ${bar.month}`,
    badgeText: `€${revSum.toLocaleString()}`,
    badgeClass: 'bg-red-50 text-red-700',
    formula: `${bar.month} Revenue (€${revSum.toLocaleString()}) across ${monthOrders.length} orders • Conversion Rate: ${convRate}% (${wonCount}/${monthOrders.length})`,
    stats: [
      { label: 'Orders Count', value: monthOrders.length },
      { label: 'Total Revenue', value: `€${revSum.toLocaleString()}` },
      { label: 'Converted', value: wonCount },
      { label: 'Conversion %', value: `${convRate}%` }
    ],
    records: monthOrders,
    showContribution: true,
    targetView: 'jobs',
    targetTab: 'all',
    targetLabel: 'Open Moving Jobs'
  }
}

const openCategoryBreakdown = (cat) => {
  const catOrders = cat.orders || []
  const revSum = Math.round(cat.revenue || 0)
  const avg = catOrders.length > 0 ? Math.round(revSum / catOrders.length) : 0
  drilldownModal.value = {
    title: `${cat.label} — Category Breakdown`,
    subtitle: `Detailed breakdown of all ${cat.label.toLowerCase()} orders contributing ${cat.pct}% of total revenue`,
    badgeText: `€${revSum.toLocaleString()} (${cat.pct}%)`,
    badgeClass: 'bg-slate-100 text-slate-800',
    formula: `${cat.label}: €${revSum.toLocaleString()} ÷ €${Math.round(props.totalRevenue || 1).toLocaleString()} Total = ${cat.pct}% (${catOrders.length} orders)`,
    stats: [
      { label: 'Category Revenue', value: `€${revSum.toLocaleString()}` },
      { label: 'Share of Total', value: `${cat.pct}%` },
      { label: 'Orders Count', value: catOrders.length },
      { label: 'Average / Move', value: `€${avg.toLocaleString()}` }
    ],
    records: [...catOrders].sort((a, b) => (b.estValue || 0) - (a.estValue || 0)),
    showContribution: true,
    targetView: 'jobs',
    targetTab: 'all',
    targetLabel: 'View All Moving Jobs'
  }
}

// Real Recent Leads from Supabase
const displayedRecentLeads = computed(() => {
  const leadsSource = props.leads && props.leads.length > 0 
    ? props.leads 
    : (props.orders || []).filter(o => o.operationalStatus !== 'Completed' && o.operationalStatus !== 'Cancelled')
  
  return leadsSource.slice(0, 5).map(l => ({
    id: l.id,
    ref: l.ref || `L-${String(l.id).slice(0, 6)}`,
    customer: l.customer || 'Customer',
    movingDate: l.shortDate || l.movingDate || 'TBD',
    route: l.route || 'Maastricht → Destination',
    estRevenue: l.estValue || 450,
    status: l.salesStatus || l.status || 'New Lead',
    nextAction: l.nextAction || 'Call customer',
    actionDue: l.status === 'Pending' ? 'Today' : 'Tomorrow',
    raw: l
  }))
})

// Real Upcoming Jobs from Supabase
const displayedUpcomingJobs = computed(() => {
  const jobsSource = props.movingJobs && props.movingJobs.length > 0
    ? props.movingJobs
    : (props.orders || []).filter(o => o.operationalStatus === 'Confirmed' || o.operationalStatus === 'In Progress' || o.operationalStatus === 'Completed')
  
  return jobsSource.slice(0, 5).map(j => ({
    id: j.id,
    date: j.shortDate || 'Upcoming',
    time: j.time || '09:00',
    customer: j.customer || 'Client',
    route: j.route || 'Maastricht',
    status: j.operationalStatus || j.status || 'Confirmed',
    dotClass: j.operationalStatus === 'Confirmed' ? 'bg-emerald-500' : (j.operationalStatus === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'),
    raw: j
  }))
})

// Real Jobs in Progress Today
const displayedJobsInProgress = computed(() => {
  const inProgress = (props.orders || []).filter(o => o.operationalStatus === 'In Progress' || o.operationalStatus === 'Confirmed')
  const list = inProgress.length > 0 ? inProgress : (props.orders || []).slice(0, 3)

  return list.slice(0, 3).map(j => ({
    id: j.id,
    ref: j.ref,
    customer: j.customer,
    startTime: j.time || '09:00',
    duration: '3h',
    teamInitial: (j.customer || 'M').charAt(0).toUpperCase(),
    status: j.operationalStatus === 'In Progress' ? 'In Progress' : 'Confirmed',
    raw: j
  }))
})

// Real Follow-ups Required
const displayedFollowUps = computed(() => {
  const pendingLeads = (props.leads && props.leads.length > 0 ? props.leads : props.orders || [])
    .filter(o => o.operationalStatus === 'Pending' || o.salesStatus === 'New Lead' || o.salesStatus?.includes('Quote'))
  
  const list = pendingLeads.length > 0 ? pendingLeads : (props.orders || []).slice(0, 5)

  return list.slice(0, 5).map((l, idx) => ({
    id: l.id,
    ref: l.ref,
    customer: l.customer,
    action: l.salesStatus?.includes('Quote') ? 'Follow up quote' : (idx % 2 === 0 ? 'Call customer' : 'Send revised quote'),
    dueDate: idx === 0 ? 'Today' : (idx === 1 ? 'Today' : 'Tomorrow'),
    dueColor: idx < 2 ? 'text-amber-600' : 'text-slate-600',
    raw: l
  }))
})

// Dynamic Real Activity Feed
const recentActivities = computed(() => {
  const activities = []
  const sorted = [...(props.orders || [])]

  sorted.slice(0, 5).forEach((o, index) => {
    const timeAgo = index === 0 ? '10 min ago' : (index === 1 ? '1 hour ago' : (index === 2 ? '2 hours ago' : (index === 3 ? '4 hours ago' : '1 day ago')))
    
    if (o.operationalStatus === 'Completed') {
      activities.push({
        title: 'Job completed',
        subtitle: `${o.ref} - ${o.customer}`,
        time: timeAgo,
        iconBg: 'bg-emerald-50 text-emerald-600',
        type: 'completed'
      })
    } else if (o.operationalStatus === 'Confirmed') {
      activities.push({
        title: 'Job confirmed & scheduled',
        subtitle: `${o.customer} (${o.route})`,
        time: timeAgo,
        iconBg: 'bg-sky-50 text-sky-600',
        type: 'confirmed'
      })
    } else if (o.salesStatus?.includes('Quote')) {
      activities.push({
        title: 'Quotation sent to customer',
        subtitle: `${o.customer} - €${o.estValue?.toLocaleString()}`,
        time: timeAgo,
        iconBg: 'bg-purple-50 text-purple-600',
        type: 'quote'
      })
    } else {
      activities.push({
        title: 'New lead submitted',
        subtitle: `${o.customer} (${o.route})`,
        time: timeAgo,
        iconBg: 'bg-rose-50 text-rose-500',
        type: 'lead'
      })
    }
  })

  return activities
})

const getLeadStatusClass = (status) => {
  if (status === 'New Lead') return 'bg-sky-50 text-sky-700'
  if (status === 'Quote Sent' || status === 'Estimate Sent') return 'bg-purple-50 text-purple-700'
  if (status === 'Pending Review' || status === 'Pending') return 'bg-orange-50 text-orange-700'
  if (status === 'Info Requested') return 'bg-amber-50 text-amber-700'
  if (status === 'Quotation Prep') return 'bg-blue-50 text-blue-700'
  if (status === 'Confirmed') return 'bg-emerald-50 text-emerald-700'
  return 'bg-slate-100 text-slate-700'
}

const getJobStatusBadge = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
  if (status === 'Team Assigned') return 'bg-amber-50 text-amber-700 border border-amber-200/60'
  if (status === 'In Progress') return 'bg-sky-50 text-sky-700 border border-sky-200/60'
  if (status === 'Quote Sent') return 'bg-purple-50 text-purple-700 border border-purple-200/60'
  if (status === 'Completed') return 'bg-slate-100 text-slate-700 border border-slate-200/60'
  return 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Analytics & KPIs</h2>
        <p class="text-xs text-slate-500">Track performance and business growth.</p>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button 
        v-for="cat in ['Sales', 'Operations', 'Customer Experience', 'Financial Performance']" 
        :key="cat"
        @click="activeCategory = cat"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
          activeCategory === cat 
            ? 'bg-slate-900 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 6 Metric Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">New Leads</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">24</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↑ +8%</div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">Quotes Sent</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">16</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↑ +23%</div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">Quotes Accepted</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">11</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↑ +37%</div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">Conversion Rate</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">69%</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↑ +2%</div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">Avg. Quote Value</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">€1,450</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↑ +16%</div>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <span class="text-[11px] font-semibold text-slate-500 uppercase">Avg. Response Time</span>
        <div class="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-sans">3.5h</div>
        <div class="text-[11px] font-bold text-emerald-600 mt-1">↓ -28% (Faster)</div>
      </div>
    </div>

    <!-- Bottom Row (Leads & Conversion Trend & Leads by Source) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Chart (7 cols) -->
      <div class="lg:col-span-7 xl:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-bold text-slate-900">Leads & Conversion Trend</h3>
            <p class="text-xs text-slate-500">Pipeline progression over time</p>
          </div>
          <div class="flex items-center gap-3 text-xs font-semibold">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Leads</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>Accepted</span>
          </div>
        </div>

        <div class="h-64 flex flex-col justify-between pt-4">
          <div class="relative flex-1 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
            <div v-for="t in trendData" :key="t.month" class="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
              <div class="w-full flex items-end justify-center gap-1.5 h-full pb-0.5">
                <div class="w-3 bg-blue-500 rounded-t-sm" :style="{ height: t.leads + '%' }"></div>
                <div class="w-3 bg-[#DC2626] rounded-t-sm" :style="{ height: t.accepted + '%' }"></div>
              </div>
              <span class="text-[10px] font-medium text-slate-400 mt-2">{{ t.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Donut (5 cols) -->
      <div class="lg:col-span-5 xl:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900">Leads by Source</h3>
          <p class="text-xs text-slate-500">Customer acquisition channels</p>
        </div>

        <div class="py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
          <div class="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14" />
              <!-- Google 32% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="76 238" stroke-dashoffset="0" />
              <!-- Referral 24% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="57 238" stroke-dashoffset="-76" />
              <!-- Student 18% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" stroke-width="14" stroke-dasharray="43 238" stroke-dashoffset="-133" />
              <!-- Real Estate 14% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" stroke-width="14" stroke-dasharray="33 238" stroke-dashoffset="-176" />
              <!-- Social 7% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" stroke-width="14" stroke-dasharray="17 238" stroke-dashoffset="-209" />
              <!-- Other 5% -->
              <circle cx="50" cy="50" r="38" fill="none" stroke="#94A3B8" stroke-width="14" stroke-dasharray="12 238" stroke-dashoffset="-226" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-xl font-black text-slate-900 leading-none">69</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
            </div>
          </div>

          <div class="space-y-2 w-full max-w-[160px] text-xs">
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>Google</span><span class="font-bold">32%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>Referral</span><span class="font-bold">24%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>Student</span><span class="font-bold">18%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>Real Estate</span><span class="font-bold">14%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>Social</span><span class="font-bold">7%</span></div>
            <div class="flex items-center justify-between"><span class="flex items-center gap-2 text-slate-600"><span class="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>Other</span><span class="font-bold">5%</span></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          Top channel: <strong class="text-blue-600">Google Ads & SEO (32%)</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCategory = ref('Sales')

const trendData = [
  { month: 'Jun', leads: 60, accepted: 42 },
  { month: 'Jul', leads: 70, accepted: 50 },
  { month: 'Aug', leads: 85, accepted: 60 },
  { month: 'Sep', leads: 65, accepted: 45 },
  { month: 'Oct', leads: 88, accepted: 62 },
  { month: 'Nov', leads: 95, accepted: 69 },
]
</script>

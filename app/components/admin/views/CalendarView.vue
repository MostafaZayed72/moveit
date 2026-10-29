<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Moving Calendar Schedule (8 Cols - Exact match to "4 Moving Calendar.png") -->
    <div class="lg:col-span-8 xl:col-span-9 space-y-4">
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Moving Calendar</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Schedule and manage all moving jobs, teams, and vehicles.
        </p>
      </div>

      <!-- Calendar Controls Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button class="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            Today
          </button>
          <div class="flex items-center bg-white border border-slate-200 rounded-xl shadow-2xs">
            <button class="px-2.5 py-2 text-slate-500 hover:text-slate-900 cursor-pointer">‹</button>
            <button class="px-2.5 py-2 text-slate-500 hover:text-slate-900 border-l border-slate-200 cursor-pointer">›</button>
          </div>
          <div class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 flex items-center gap-2 shadow-2xs">
            <span>November 2025</span>
            <span class="text-slate-400 text-[10px]">▼</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- Month | Week | Day | List Switcher -->
          <div class="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-bold">
            <button 
              v-for="mode in ['Month', 'Week', 'Day', 'List']" 
              :key="mode"
              @click="viewMode = mode"
              :class="[
                'px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                viewMode === mode 
                  ? 'bg-blue-50 text-blue-600 font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              {{ mode }}
            </button>
          </div>

          <!-- Status Filter -->
          <select v-model="statusFilter" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer">
            <option value="all">▽ All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Team Assigned">Team Assigned</option>
            <option value="Quotation Sent">Quotation Sent</option>
          </select>
        </div>
      </div>

      <!-- WEEK SCHEDULE GRID (Default View matching "4 Moving Calendar.png") -->
      <div v-if="viewMode === 'Week' || viewMode === 'Day'" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <div class="min-w-[820px]">
            <!-- Header Row: Time + 7 Days -->
            <div class="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50 text-center">
              <div class="py-3 px-2 border-r border-slate-100 text-[10px] font-bold text-slate-400"></div>
              <div 
                v-for="day in weekDays" 
                :key="day.date"
                class="py-2.5 px-2 border-r border-slate-100 last:border-r-0"
              >
                <div class="text-xs font-black text-slate-800">{{ day.name }}</div>
                <div class="text-[11px] font-semibold text-slate-500">{{ day.date }}</div>
              </div>
            </div>

            <!-- Schedule Body Columns -->
            <div class="grid grid-cols-8 divide-x divide-slate-100 relative min-h-[620px]">
              <!-- Time Axis Column -->
              <div class="flex flex-col justify-between py-3 px-2 text-[10px] font-semibold text-slate-400 text-right bg-slate-50/30 select-none">
                <div>07:00</div>
                <div>08:00</div>
                <div>09:00</div>
                <div>10:00</div>
                <div>11:00</div>
                <div>12:00</div>
                <div>13:00</div>
                <div>14:00</div>
                <div>15:00</div>
                <div>16:00</div>
                <div>17:00</div>
                <div>18:00</div>
                <div>19:00</div>
              </div>

              <!-- 7 Day Columns with Scheduled Cards -->
              <div 
                v-for="day in weekDays" 
                :key="day.date"
                class="p-1.5 space-y-2.5 bg-white relative"
              >
                <div 
                  v-for="job in day.jobs" 
                  :key="job.ref"
                  :class="[
                    'p-2.5 rounded-xl border-l-4 text-[11px] space-y-1.5 shadow-2xs transition-transform hover:scale-[1.01] cursor-pointer',
                    job.cardClass
                  ]"
                >
                  <div class="flex items-center gap-1 font-black text-slate-900">
                    <span>🏠</span>
                    <span>{{ job.ref }}</span>
                  </div>
                  <div class="font-bold text-slate-900 leading-tight">{{ job.customer }}</div>
                  <div class="text-[10px] text-slate-600 leading-tight">{{ job.route }}</div>
                  <div class="text-[10px] font-bold text-slate-700 pt-1">{{ job.time }}</div>
                  <div v-if="job.van" class="flex items-center justify-between pt-1">
                    <div class="flex -space-x-1.5">
                      <span class="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">A</span>
                      <span class="w-5 h-5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">T</span>
                    </div>
                    <span class="text-[10px] font-semibold text-slate-600">{{ job.van }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Status Legend -->
        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex flex-wrap items-center gap-5 text-[11px] font-semibold text-slate-600">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmed</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span> In Progress</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Team Assigned</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Quotation Sent</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Pending Review</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Cancelled</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Unavailable</span>
        </div>
      </div>

      <!-- MONTH VIEW FALLBACK -->
      <div v-else class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="grid grid-cols-7 gap-2 pt-3">
          <div v-for="n in 30" :key="n" class="min-h-[85px] p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs">
            <div class="font-bold text-slate-700">{{ n }} Nov</div>
            <div v-if="n === 3" class="mt-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold truncate">J-26-1098 De Vries</div>
            <div v-if="n === 4" class="mt-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold truncate">J-26-1101 Sophie</div>
            <div v-if="n === 5" class="mt-1 px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold truncate">J-26-1096 Meijer</div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Mini Calendar + Teams & Vehicles + Unscheduled Jobs (4 Cols) -->
    <div class="lg:col-span-4 xl:col-span-3 space-y-4">
      <!-- 1. Mini Month Calendar Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-slate-900">‹ November 2025</span>
          <div class="flex items-center gap-1">
            <button class="w-6 h-6 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50">‹</button>
            <button class="w-6 h-6 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50">›</button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
          <span v-for="d in [27,28,29,30,31]" :key="'p'+d" class="py-1 text-slate-300">{{ d }}</span>
          <span class="py-1 text-slate-700">1</span>
          <span class="py-1 text-slate-700">2</span>
          <span class="py-1 bg-blue-600 text-white font-black rounded-lg shadow-2xs">3</span>
          <span v-for="d in [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]" :key="d" class="py-1 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer">{{ d }}</span>
        </div>
      </div>

      <!-- 2. Teams & Vehicles Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900">Teams & Vehicles</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">Manage</button>
        </div>

        <div class="flex items-center gap-4 border-b border-slate-200 text-xs font-bold">
          <button 
            @click="activeResourceTab = 'teams'"
            :class="['pb-2 relative cursor-pointer', activeResourceTab === 'teams' ? 'text-[#DC2626]' : 'text-slate-500']"
          >
            Teams (3)
            <div v-if="activeResourceTab === 'teams'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
          </button>
          <button 
            @click="activeResourceTab = 'vehicles'"
            :class="['pb-2 relative cursor-pointer', activeResourceTab === 'vehicles' ? 'text-[#DC2626]' : 'text-slate-500']"
          >
            Vehicles (4)
            <div v-if="activeResourceTab === 'vehicles'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
          </button>
        </div>

        <div v-if="activeResourceTab === 'teams'" class="space-y-2.5 pt-1 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <div>
                <div class="font-bold text-slate-900">Team 1</div>
                <div class="text-[10px] text-slate-400">2 movers</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <div>
                <div class="font-bold text-slate-900">Team 2</div>
                <div class="text-[10px] text-slate-400">2 movers</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">In Job</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <div>
                <div class="font-bold text-slate-900">Team 3</div>
                <div class="text-[10px] text-slate-400">3 movers</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>
        </div>

        <div v-else class="space-y-2.5 pt-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800">🚐 Van 1 (SHEK 23)</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800">🚐 Van 2 (V-482-BK)</span>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">In Use</span>
          </div>
        </div>
      </div>

      <!-- 3. Pending / Unscheduled Jobs (5) -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900">Pending / Unscheduled Jobs (5)</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all</button>
        </div>

        <div class="space-y-2.5 text-xs">
          <div 
            v-for="uJob in unscheduledJobs" 
            :key="uJob.ref"
            class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
          >
            <div class="flex items-start gap-2.5">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs" :class="uJob.iconBg">🏠</span>
              <div>
                <div class="font-black text-slate-900 text-[11px]">{{ uJob.ref }}</div>
                <div class="font-semibold text-slate-700 text-[11px]">{{ uJob.customer }}</div>
                <div class="text-[10px] text-slate-400">{{ uJob.route }}</div>
              </div>
            </div>
            <div class="text-right space-y-1">
              <div class="text-[10px] text-slate-500 font-semibold">📅 {{ uJob.date }}</div>
              <span class="px-2 py-0.5 rounded text-[9px] font-bold inline-block" :class="uJob.priorityBadge">
                {{ uJob.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-job'])

const viewMode = ref('Week')
const statusFilter = ref('all')
const activeResourceTab = ref('teams')

const weekDays = [
  {
    name: 'Mon',
    date: '3 Nov',
    jobs: [
      { ref: 'J-26-1098', customer: 'De Vries', route: 'Maastricht → Amsterdam', time: '08:00 – 12:00', van: 'Van 1', cardClass: 'bg-emerald-50/90 border-l-emerald-500' },
      { ref: 'J-26-1101', customer: 'Jansen Family', route: 'Maastricht → Heerlen', time: '13:00 – 16:00', van: 'Van 2', cardClass: 'bg-rose-50/90 border-l-rose-500 mt-12' }
    ]
  },
  {
    name: 'Tue',
    date: '4 Nov',
    jobs: [
      { ref: 'J-26-1099', customer: 'UM Student', route: 'Maastricht → Eindhoven', time: '08:30 – 11:30', van: 'Van 3', cardClass: 'bg-blue-50/90 border-l-blue-600 mt-3' },
      { ref: 'J-26-1101', customer: 'Sophie de Jong', route: 'Maastricht → Maastricht', time: '12:00 – 15:00', van: 'Van 1', cardClass: 'bg-amber-50/90 border-l-amber-500 mt-6' }
    ]
  },
  {
    name: 'Wed',
    date: '5 Nov',
    jobs: [
      { ref: 'J-26-1096', customer: 'Meijer Family', route: 'Maastricht → Den Haag', time: '09:00 – 15:00', van: 'Van 2', cardClass: 'bg-purple-50/90 border-l-purple-500 mt-6 py-4' },
      { ref: 'J-26-1097', customer: 'TechSolutions BV', route: 'Maastricht → Amsterdam', time: '16:00 – 19:00', van: 'Van 3', cardClass: 'bg-emerald-50/90 border-l-emerald-500 mt-8' }
    ]
  },
  {
    name: 'Thu',
    date: '6 Nov',
    jobs: [
      { ref: 'J-26-1094', customer: 'Martine Peters', route: 'Maastricht → Maastricht', time: '08:00 – 12:00', van: 'Van 1', cardClass: 'bg-amber-50/90 border-l-amber-500' },
      { ref: 'J-26-1095', customer: 'GlobalRelocate BV', route: 'Maastricht → Brussels', time: '13:00 – 17:00', van: 'Van 1', cardClass: 'bg-blue-50/90 border-l-blue-600 mt-10' }
    ]
  },
  {
    name: 'Fri',
    date: '7 Nov',
    jobs: [
      { ref: 'J-26-1093', customer: 'Scott Raab', route: 'Lanaken → Storage', time: '09:00 – 13:00', van: 'Van 1', cardClass: 'bg-rose-50/90 border-l-rose-500 mt-6' },
      { ref: 'J-26-1092', customer: 'Paris Group', route: 'Maastricht → Paris', time: '12:00 – 18:00', van: 'Van 3', cardClass: 'bg-purple-50/90 border-l-purple-500 mt-4 py-4' }
    ]
  },
  {
    name: 'Sat',
    date: '8 Nov',
    jobs: [
      { ref: 'J-26-1091', customer: 'Laurie Keller', route: 'Maastricht → Rotterdam', time: '08:30 – 12:00', van: 'Van 2', cardClass: 'bg-emerald-50/90 border-l-emerald-500 mt-4' }
    ]
  },
  {
    name: 'Sun',
    date: '9 Nov',
    jobs: [
      { ref: 'Unavailable', customer: 'Team off', route: 'Weekend rest', time: 'All Day', van: '', cardClass: 'bg-slate-100 border-l-slate-400 mt-8 opacity-80' }
    ]
  }
]

const unscheduledJobs = [
  { ref: 'J-26-1102', customer: 'Van Loon', route: 'Maastricht → Antwerp', date: '10 Nov', priority: 'High', priorityBadge: 'bg-rose-50 text-rose-600', iconBg: 'bg-rose-50 text-rose-500' },
  { ref: 'J-26-1103', customer: 'Seda Syrink', route: 'Maastricht → Düsseldorf', date: '11 Nov', priority: 'Medium', priorityBadge: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-50 text-amber-500' },
  { ref: 'J-26-1104', customer: 'Lavinia Bonanno', route: 'Maastricht → Zurich', date: '12 Nov', priority: 'Medium', priorityBadge: 'bg-amber-50 text-amber-700', iconBg: 'bg-rose-50 text-rose-500' },
  { ref: 'J-26-1105', customer: 'Emeline Roche', route: 'Maastricht → Geneva', date: '14 Nov', priority: 'Low', priorityBadge: 'bg-slate-100 text-slate-600', iconBg: 'bg-blue-50 text-blue-500' },
  { ref: 'J-26-1106', customer: 'Nigel', route: 'Maastricht → Maastricht', date: '15 Nov', priority: 'Low', priorityBadge: 'bg-slate-100 text-slate-600', iconBg: 'bg-purple-50 text-purple-500' }
]
</script>

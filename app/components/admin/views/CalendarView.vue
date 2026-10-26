<template>
  <div class="space-y-6">
    <!-- Header with Calendar Controls -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Moving Calendar</h2>
        <p class="text-xs text-slate-500">Schedule and manage all moving jobs, team members and vehicles.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Today & Prev/Next -->
        <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button class="px-3 py-1.5 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition-colors">Today</button>
          <button class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <span class="text-sm font-bold text-slate-900 px-2">November 2025</span>

        <!-- View Mode Toggle (Month / Week / Day) -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
          <button class="px-3 py-1.5 bg-white text-slate-900 rounded-lg shadow-sm">Month</button>
          <button class="px-3 py-1.5 hover:text-slate-900">Week</button>
          <button class="px-3 py-1.5 hover:text-slate-900">Day</button>
        </div>

        <!-- Add Job Button -->
        <button 
          @click="$emit('add-job')"
          class="flex items-center gap-2 px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
        >
          <span>+ Add Job</span>
        </button>
      </div>
    </div>

    <!-- Calendar Grid Card -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 border-b border-slate-200 text-center bg-slate-50/80 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      <!-- Month Days Grid (5 rows of 7 days) -->
      <div class="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[560px]">
        <div 
          v-for="day in computedCalendarDays" 
          :key="day.dateNumber"
          class="p-2 sm:p-2.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors min-h-[105px] group"
        >
          <!-- Day Number -->
          <div class="flex items-center justify-between">
            <span 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              :class="day.isToday ? 'bg-[#DC2626] text-white shadow-sm' : (day.isCurrentMonth ? 'text-slate-700' : 'text-slate-300')"
            >
              {{ day.dateNumber }}
            </span>
          </div>

          <!-- Job Event Tags inside the Day -->
          <div class="space-y-1 mt-1">
            <div 
              v-for="event in day.events" 
              :key="event.title"
              class="px-2 py-1 rounded-lg text-[10px] font-bold truncate cursor-pointer shadow-2xs hover:opacity-90 transition-opacity"
              :class="event.badgeClass"
              :title="event.title"
            >
              {{ event.title }}
            </div>
          </div>

          <div class="h-1"></div>
        </div>
      </div>

      <!-- Calendar Legend Footer -->
      <div class="px-6 py-3.5 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600 bg-slate-50/50">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Confirmed</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Team Assigned</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>In-Progress</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-job'])

const baseDays = [
  { dateNumber: 27, isCurrentMonth: false, events: [] },
  { dateNumber: 28, isCurrentMonth: false, events: [] },
  { dateNumber: 29, isCurrentMonth: false, events: [] },
  { dateNumber: 30, isCurrentMonth: false, events: [] },
  { dateNumber: 31, isCurrentMonth: false, events: [] },
  { dateNumber: 1, isCurrentMonth: true, events: [] },
  { dateNumber: 2, isCurrentMonth: true, events: [] },
  
  { dateNumber: 3, isCurrentMonth: true, events: [{ title: 'J-26-1110 GlobalRelocate', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }] },
  { dateNumber: 4, isCurrentMonth: true, events: [{ title: 'J-26-1109 Paris Group', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' }] },
  { dateNumber: 5, isCurrentMonth: true, events: [] },
  { dateNumber: 6, isCurrentMonth: true, events: [{ title: 'J-26-1107 Smit-van Dam', badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200' }] },
  { dateNumber: 7, isCurrentMonth: true, events: [] },
  { dateNumber: 8, isCurrentMonth: true, events: [{ title: 'J-26-1105 TechSolutions', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }] },
  { dateNumber: 9, isCurrentMonth: true, events: [] },

  { dateNumber: 10, isCurrentMonth: true, events: [{ title: 'J-26-1103 UM Student', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }] },
  { dateNumber: 11, isCurrentMonth: true, events: [{ title: 'J-26-1102 Jansen Family', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }] },
  { dateNumber: 12, isCurrentMonth: true, isToday: true, events: [{ title: 'J-26-1101 Sophie de Jong', badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200' }] },
  { dateNumber: 13, isCurrentMonth: true, events: [] },
  { dateNumber: 14, isCurrentMonth: true, events: [] },
  { dateNumber: 15, isCurrentMonth: true, events: [{ title: 'J-26-1104 De Vries', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' }] },
  { dateNumber: 16, isCurrentMonth: true, events: [] },

  { dateNumber: 17, isCurrentMonth: true, events: [] },
  { dateNumber: 18, isCurrentMonth: true, events: [{ title: 'J-26-1111 Lavina Bonanno', badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200' }] },
  { dateNumber: 19, isCurrentMonth: true, events: [] },
  { dateNumber: 20, isCurrentMonth: true, events: [] },
  { dateNumber: 21, isCurrentMonth: true, events: [] },
  { dateNumber: 22, isCurrentMonth: true, events: [{ title: 'J-26-1109 Nigel', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' }] },
  { dateNumber: 23, isCurrentMonth: true, events: [] },

  { dateNumber: 24, isCurrentMonth: true, events: [] },
  { dateNumber: 25, isCurrentMonth: true, events: [{ title: 'J-26-1108 Seda Sivrik', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' }] },
  { dateNumber: 26, isCurrentMonth: true, events: [] },
  { dateNumber: 27, isCurrentMonth: true, events: [] },
  { dateNumber: 28, isCurrentMonth: true, events: [{ title: 'J-26-1106 GlobalRelocate', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }] },
  { dateNumber: 29, isCurrentMonth: true, events: [] },
  { dateNumber: 30, isCurrentMonth: true, events: [] },
]

const computedCalendarDays = computed(() => {
  if (!props.orders || props.orders.length === 0) {
    return baseDays
  }

  // Inject any matching real orders
  return baseDays.map(day => {
    const dayOrders = props.orders.filter(o => {
      if (!o.movingDate) return false
      const parts = o.movingDate.split('-')
      if (parts.length === 3) {
        return parseInt(parts[2], 10) === day.dateNumber
      }
      return false
    })

    if (dayOrders.length > 0) {
      const liveEvents = dayOrders.slice(0, 2).map(o => ({
        title: `${o.ref} ${o.customer?.split(' ')[0]}`,
        badgeClass: o.status === 'Completed' || o.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
      }))
      return {
        ...day,
        events: liveEvents
      }
    }
    return day
  })
})
</script>

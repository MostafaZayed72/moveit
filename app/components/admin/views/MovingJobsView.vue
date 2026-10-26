<template>
  <div class="space-y-6">
    <!-- Header with Action Button (Screen 4 exact match) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Moving Jobs</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Manage all confirmed, ongoing and completed moves.
        </p>
      </div>
      <div>
        <button 
          @click="$emit('add-job')"
          class="flex items-center gap-1.5 px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <span class="text-sm font-bold leading-none">+</span>
          <span>Add Job</span>
        </button>
      </div>
    </div>

    <!-- Job Status Tabs (Screen 4 red-accented pill styling) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button 
        v-for="tab in dynamicJobTabs" 
        :key="tab.id"
        @click="activeJobTab = tab.id; currentPage = 1"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border',
          activeJobTab === tab.id 
            ? 'bg-white border-red-500 text-red-600 shadow-xs' 
            : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span 
          class="text-[11px] px-2 py-0.5 rounded-full font-bold"
          :class="activeJobTab === tab.id ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Filter Toolbar (Screen 4: Search + All Statuses + Date Range + Clear) -->
    <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[240px]">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="currentPage = 1"
          placeholder="Search by customer, route, reference..." 
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      <div class="flex items-center flex-wrap gap-2.5">
        <!-- Status Dropdown Filter -->
        <div class="relative">
          <select 
            v-model="statusFilter"
            @change="currentPage = 1"
            class="appearance-none pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-700 font-semibold cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Team Assigned">Team Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <svg class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        <!-- Date Range Filter Pill -->
        <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <input 
            type="text" 
            v-model="dateFilter"
            placeholder="From - To"
            class="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-24 placeholder:text-slate-400 font-semibold"
          />
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>

        <!-- Clear Button -->
        <button 
          @click="clearFilters"
          class="text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1 cursor-pointer transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Table Container (Screen 4 exact 9 columns: REF, DATE, TIME, CUSTOMER, ROUTE, PACKAGE, TEAM, EST. VALUE, STATUS) -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
              <th class="py-3.5 px-4 font-bold">REF</th>
              <th class="py-3.5 px-4 font-bold">DATE</th>
              <th class="py-3.5 px-4 font-bold">TIME</th>
              <th class="py-3.5 px-4 font-bold">CUSTOMER</th>
              <th class="py-3.5 px-4 font-bold">ROUTE</th>
              <th class="py-3.5 px-4 font-bold">PACKAGE</th>
              <th class="py-3.5 px-4 font-bold text-center">TEAM</th>
              <th class="py-3.5 px-4 font-bold">EST. VALUE</th>
              <th class="py-3.5 px-4 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr 
              v-for="job in paginatedJobs" 
              :key="job.id || job.ref"
              @click="$emit('select-job', job)"
              class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <!-- REF -->
              <td class="py-3.5 px-4 font-bold text-slate-900 group-hover:text-red-600 font-sans tracking-tight whitespace-nowrap">
                {{ job.ref }}
              </td>

              <!-- DATE -->
              <td class="py-3.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                {{ job.shortDate || job.movingDate || job.date }}
              </td>

              <!-- TIME -->
              <td class="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                {{ job.time || '09:00' }}
              </td>

              <!-- CUSTOMER -->
              <td class="py-3.5 px-4 font-bold text-slate-900 truncate max-w-[160px]" :title="job.customer">
                {{ job.customer }}
              </td>

              <!-- ROUTE -->
              <td class="py-3.5 px-4 text-slate-600 truncate max-w-[180px]" :title="job.fromFull ? `${job.fromFull} → ${job.toFull}` : job.route">
                {{ formatRouteDisplay(job.route) }}
              </td>

              <!-- PACKAGE (Compact single-line badge) -->
              <td class="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                {{ job.package }}
              </td>

              <!-- TEAM (Centered count: 1, 2, 3) -->
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 whitespace-nowrap">
                {{ job.team || 2 }}
              </td>

              <!-- EST. VALUE -->
              <td class="py-3.5 px-4 font-bold text-slate-900 font-sans whitespace-nowrap">
                €{{ (job.estValue || 0).toLocaleString() }}
              </td>

              <!-- STATUS -->
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5"
                  :class="getStatusBadgeClass(job.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(job.status)"></span>
                  {{ getDisplayStatus(job.status) }}
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="paginatedJobs.length === 0">
              <td colspan="9" class="py-12 text-center text-slate-400">
                <svg class="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p class="font-bold text-slate-600 text-sm">No moving jobs found</p>
                <p class="text-xs text-slate-400 mt-0.5">Try clearing your search query or status filter.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer (Screen 4 exact match) -->
      <div class="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing <strong class="text-slate-800">{{ filteredJobs.length ? (currentPage - 1) * pageSize + 1 : 0 }}-{{ Math.min(currentPage * pageSize, filteredJobs.length) }}</strong> of <strong class="text-slate-800">{{ filteredJobs.length }}</strong>
        </div>

        <!-- Page Numbers with active Red Circle -->
        <div class="flex items-center gap-1.5">
          <button 
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            ‹
          </button>

          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer',
              currentPage === page 
                ? 'bg-[#DC2626] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100 font-semibold'
            ]"
          >
            {{ page }}
          </button>

          <button 
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage >= totalPages"
            class="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            ›
          </button>
        </div>

        <!-- Page Size Selector -->
        <div class="flex items-center gap-2">
          <select 
            v-model="pageSize"
            @change="currentPage = 1"
            class="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-red-500"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-job', 'select-job'])

const activeJobTab = ref('all')
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(25)

// Realistic reference jobs matching Screen 4 if props.jobs is empty
const defaultJobs = [
  { ref: 'J-26-1101', shortDate: '5 Nov', time: '09:00', customer: 'Jansen Family', route: 'M → M', package: 'Van + 2', team: 2, estValue: 950, status: 'Confirmed' },
  { ref: 'J-26-1102', shortDate: '6 Nov', time: '08:30', customer: 'UM Student', route: 'M → Sittard', package: 'Van Only', team: 1, estValue: 280, status: 'Confirmed' },
  { ref: 'J-26-1103', shortDate: '7 Nov', time: '10:00', customer: 'De Vries', route: 'M → Eindhoven', package: 'Full Service', team: 3, estValue: 1250, status: 'Team Assigned' },
  { ref: 'J-26-1104', shortDate: '8 Nov', time: '09:00', customer: 'TechSolutions BV', route: 'M → Amsterdam', package: 'Van + 2', team: 2, estValue: 2100, status: 'Confirmed' },
  { ref: 'J-26-1105', shortDate: '10 Nov', time: '11:00', customer: 'Meijer Family', route: 'M → Heerlen', package: 'Van + 1', team: 1, estValue: 420, status: 'Confirmed' },
  { ref: 'J-26-1106', shortDate: '12 Nov', time: '08:30', customer: 'Sophie de Jong', route: 'M → Amsterdam', package: 'Van + 2', team: 2, estValue: 1850, status: 'Confirmed' },
  { ref: 'J-26-1107', shortDate: '14 Nov', time: '09:00', customer: 'Cheng Liu', route: 'M → Brussels', package: 'Van Only', team: 1, estValue: 280, status: 'Confirmed' },
  { ref: 'J-26-1108', shortDate: '15 Nov', time: '08:30', customer: 'Paris Group', route: 'M → Paris', package: 'Van + 2', team: 2, estValue: 1950, status: 'Confirmed' },
  { ref: 'J-26-1109', shortDate: '18 Nov', time: '09:00', customer: 'GlobalRelocate BV', route: 'M → Brussels', package: 'Van + 2', team: 2, estValue: 4200, status: 'Confirmed' },
]

const activeJobsSource = computed(() => {
  if (props.jobs && props.jobs.length > 0) {
    return props.jobs
  }
  return defaultJobs
})

const dynamicJobTabs = computed(() => {
  const list = activeJobsSource.value
  return [
    { id: 'all', label: 'All Jobs', count: list.length },
    { 
      id: 'upcoming', 
      label: 'Upcoming', 
      count: list.filter(o => o.status === 'Confirmed' || o.status === 'Team Assigned' || o.status === 'Pending').length 
    },
    { 
      id: 'in_progress', 
      label: 'In Progress', 
      count: list.filter(o => o.status === 'In Progress' || o.status === 'In Transit').length 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      count: list.filter(o => o.status === 'Completed').length 
    },
    { 
      id: 'cancelled', 
      label: 'Cancelled', 
      count: list.filter(o => o.status === 'Cancelled').length 
    },
  ]
})

const filteredJobs = computed(() => {
  return activeJobsSource.value.filter(job => {
    // Tab filter
    if (activeJobTab.value === 'upcoming') {
      const matchStatus = job.status === 'Confirmed' || job.status === 'Team Assigned' || job.status === 'Pending'
      if (!matchStatus) return false
    } else if (activeJobTab.value === 'in_progress') {
      const matchStatus = job.status === 'In Progress' || job.status === 'In Transit'
      if (!matchStatus) return false
    } else if (activeJobTab.value === 'completed') {
      if (job.status !== 'Completed') return false
    } else if (activeJobTab.value === 'cancelled') {
      if (job.status !== 'Cancelled') return false
    }

    // Status dropdown filter
    if (statusFilter.value !== 'all') {
      if (statusFilter.value === 'Confirmed' && job.status !== 'Confirmed') return false
      if (statusFilter.value === 'Team Assigned' && job.status !== 'Team Assigned') return false
      if (statusFilter.value === 'In Progress' && job.status !== 'In Progress' && job.status !== 'In Transit') return false
      if (statusFilter.value === 'Completed' && job.status !== 'Completed') return false
      if (statusFilter.value === 'Cancelled' && job.status !== 'Cancelled') return false
    }

    // Search query filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (job.ref || '').toLowerCase().includes(q) || 
                    (job.customer || '').toLowerCase().includes(q) || 
                    (job.route || '').toLowerCase().includes(q) ||
                    (job.package || '').toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / pageSize.value) || 1)

const visiblePages = computed(() => {
  const pages = []
  const max = Math.min(totalPages.value, 5)
  for (let i = 1; i <= max; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredJobs.value.slice(start, start + pageSize.value)
})

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  dateFilter.value = ''
  activeJobTab.value = 'all'
  currentPage.value = 1
}

const formatRouteDisplay = (route) => {
  if (!route) return 'M → M'
  return route.replace(/Maastricht/gi, 'M')
}

const getDisplayStatus = (status) => {
  if (status === 'Confirmed') return 'Confirmed'
  if (status === 'Team Assigned') return 'Team Assigned'
  if (status === 'In Progress' || status === 'In Transit') return 'In Progress'
  if (status === 'Completed') return 'Completed'
  if (status === 'Cancelled') return 'Cancelled'
  if (status === 'New Lead') return 'Confirmed'
  if (status === 'Pending') return 'Confirmed'
  return status || 'Confirmed'
}

const getStatusBadgeClass = (status) => {
  const s = getDisplayStatus(status)
  if (s === 'Confirmed') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
  if (s === 'Team Assigned') return 'bg-amber-50 text-amber-700 border border-amber-200/70'
  if (s === 'In Progress') return 'bg-orange-50 text-orange-700 border border-orange-200/70'
  if (s === 'Completed') return 'bg-slate-100 text-slate-700 border border-slate-200'
  if (s === 'Cancelled') return 'bg-rose-50 text-rose-700 border border-rose-200/70'
  return 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
}

const getStatusDotClass = (status) => {
  const s = getDisplayStatus(status)
  if (s === 'Confirmed') return 'bg-emerald-500'
  if (s === 'Team Assigned') return 'bg-amber-500'
  if (s === 'In Progress') return 'bg-orange-500'
  if (s === 'Completed') return 'bg-slate-400'
  if (s === 'Cancelled') return 'bg-rose-500'
  return 'bg-emerald-500'
}
</script>

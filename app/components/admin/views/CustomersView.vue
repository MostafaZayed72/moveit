<template>
  <div class="space-y-6">
    <!-- Header with Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Customers</h2>
        <p class="text-xs text-slate-500">
          Manage your customer database and view booking history. 
          <span class="text-emerald-600 font-bold ml-1">({{ activeCustomersList.length }} client records)</span>
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button 
          @click="$emit('add-customer')"
          class="flex items-center gap-2 px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
        >
          <span>+ Add Customer</span>
        </button>
        <button @click="exportCustomersCSV" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[220px]">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search by name, email, phone..." 
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-slate-900"
        />
      </div>

      <select v-model="typeFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-red-500 cursor-pointer">
        <option value="all">All Types</option>
        <option value="Private">Private</option>
        <option value="Business">Business</option>
      </select>

      <button 
        @click="searchQuery = ''; typeFilter = 'all'"
        class="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 cursor-pointer transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Customers Data Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
              <th class="py-3 px-4 font-bold">NAME</th>
              <th class="py-3 px-4 font-bold">PHONE</th>
              <th class="py-3 px-4 font-bold">EMAIL</th>
              <th class="py-3 px-4 font-bold">TYPE</th>
              <th class="py-3 px-4 font-bold text-center">TOTAL MOVES</th>
              <th class="py-3 px-4 font-bold">TOTAL REVENUE</th>
              <th class="py-3 px-4 font-bold">LAST MOVE</th>
              <th class="py-3 px-4 font-bold">SOURCE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr 
              v-for="c in filteredCustomers" 
              :key="c.id || c.name"
              class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <td class="py-3.5 px-4 font-bold text-slate-900 group-hover:text-red-600">{{ c.name }}</td>
              <td class="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{{ c.phone }}</td>
              <td class="py-3.5 px-4 text-slate-500">{{ c.email }}</td>
              <td class="py-3.5 px-4">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="c.type === 'Business' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'"
                >
                  {{ c.type }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-bold text-slate-800 text-center">{{ c.totalMoves }}</td>
              <td class="py-3.5 px-4 font-bold text-slate-900 font-sans">€{{ (c.totalRevenue || 0).toLocaleString() }}</td>
              <td class="py-3.5 px-4 text-slate-500">{{ c.lastMove }}</td>
              <td class="py-3.5 px-4">
                <span class="text-xs text-slate-600 font-semibold">{{ c.source || 'Website' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>Showing <strong class="text-slate-800">{{ filteredCustomers.length }}</strong> active customer profiles</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  customers: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-customer'])

const searchQuery = ref('')
const typeFilter = ref('all')

const defaultCustomers = [
  { name: 'Sophie de Jong', phone: '+31 6 12345678', email: 's.dejong@gmail.com', type: 'Private', totalMoves: 2, totalRevenue: 2430, lastMove: '12 Nov 2025', source: 'Google' },
  { name: 'Jansen Family', phone: '+31 6 87654321', email: 'jansen@familie.nl', type: 'Private', totalMoves: 1, totalRevenue: 650, lastMove: '20 Nov 2025', source: 'Referral' },
  { name: 'UM Student Union', phone: '+31 43 3882222', email: 'union@maastricht.nl', type: 'Business', totalMoves: 3, totalRevenue: 1450, lastMove: '15 Nov 2025', source: 'Student Service' },
  { name: 'De Vries Logistics', phone: '+31 6 55443322', email: 'contact@devries.nl', type: 'Business', totalMoves: 4, totalRevenue: 4800, lastMove: '18 Nov 2025', source: 'Real Estate Agent' },
]

const activeCustomersList = computed(() => {
  if (props.customers && props.customers.length > 0) {
    return props.customers
  }
  return defaultCustomers
})

const filteredCustomers = computed(() => {
  return activeCustomersList.value.filter(c => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const nameMatch = (c.name || '').toLowerCase().includes(q)
      const emailMatch = c.email && c.email !== 'N/A' && c.email.toLowerCase().includes(q)
      const phoneMatch = c.phone && c.phone !== 'N/A' && c.phone.includes(q)
      if (!nameMatch && !emailMatch && !phoneMatch) return false
    }
    if (typeFilter.value !== 'all' && c.type !== typeFilter.value) {
      return false
    }
    return true
  })
})

const exportCustomersCSV = () => {
  const rows = [
    ['NAME', 'PHONE', 'EMAIL', 'TYPE', 'TOTAL_MOVES', 'TOTAL_REVENUE', 'LAST_MOVE'],
    ...filteredCustomers.value.map(c => [c.name, c.phone, c.email, c.type, c.totalMoves, c.totalRevenue, c.lastMove])
  ]
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'moveit_customers.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

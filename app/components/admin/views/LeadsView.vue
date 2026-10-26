<template>
  <div class="space-y-6">
    <!-- Header with Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Leads & Quotations</h2>
        <p class="text-xs text-slate-500">
          Manage all incoming leads, quotations and follow-ups. 
          <span class="text-emerald-600 font-bold ml-1">({{ activeLeadsSource.length }} live records)</span>
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button 
          @click="$emit('add-lead')"
          class="flex items-center gap-2 px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
        >
          <span>+ Add Lead</span>
        </button>
        <button @click="exportToCSV" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Status Tabs Filter Pills (Screen 2 exact style) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button 
        v-for="tab in dynamicLeadTabs" 
        :key="tab.id"
        @click="activeLeadTab = tab.id; currentPage = 1"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border',
          activeLeadTab === tab.id 
            ? 'bg-white border-red-500 text-red-600 shadow-xs' 
            : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span 
          class="text-[11px] px-2 py-0.5 rounded-full font-bold"
          :class="activeLeadTab === tab.id ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Filter Toolbar -->
    <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-[220px]">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="currentPage = 1"
          placeholder="Search by name, email, phone, route..." 
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-slate-900"
        />
      </div>

      <!-- Priority Filter -->
      <select v-model="priorityFilter" @change="currentPage = 1" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:border-red-500 cursor-pointer">
        <option value="all">All Priorities</option>
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <!-- Clear Button -->
      <button 
        @click="searchQuery = ''; activeLeadTab = 'all'; priorityFilter = 'all'; currentPage = 1"
        class="text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1 cursor-pointer transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Data Grid Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
              <th class="py-3 px-4 font-bold">REF</th>
              <th class="py-3 px-4 font-bold">CUSTOMER</th>
              <th class="py-3 px-4 font-bold">DATE RECEIVED</th>
              <th class="py-3 px-4 font-bold">MOVING DATE</th>
              <th class="py-3 px-4 font-bold">ROUTE</th>
              <th class="py-3 px-4 font-bold">EST. VALUE</th>
              <th class="py-3 px-4 font-bold">STATUS</th>
              <th class="py-3 px-4 font-bold">PRIORITY</th>
              <th class="py-3 px-4 font-bold">NEXT ACTION</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr 
              v-for="lead in paginatedLeads" 
              :key="lead.id || lead.ref"
              @click="$emit('select-lead', lead)"
              class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <td class="py-3.5 px-4 font-bold text-slate-900 group-hover:text-red-600">{{ lead.ref }}</td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-800">{{ lead.customer }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ lead.phone !== 'N/A' ? lead.phone : lead.email }}</div>
              </td>
              <td class="py-3.5 px-4 text-slate-500">{{ lead.dateReceived }}</td>
              <td class="py-3.5 px-4 text-slate-700 font-semibold">{{ lead.movingDate }}</td>
              <td class="py-3.5 px-4 text-slate-600 truncate max-w-[200px]" :title="lead.route">{{ lead.route }}</td>
              <td class="py-3.5 px-4 font-bold text-slate-900 font-sans">€{{ (lead.estValue || 0).toLocaleString() }}</td>
              <td class="py-3.5 px-4">
                <span 
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold inline-block"
                  :class="getStatusBadgeClass(lead.status)"
                >
                  {{ lead.status }}
                </span>
              </td>
              <td class="py-3.5 px-4">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block"
                  :class="getPriorityBadgeClass(lead.priority)"
                >
                  {{ lead.priority }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-500 font-medium">{{ lead.nextAction }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing <span class="font-bold text-slate-800">{{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredLeads.length) }}</span> of <span class="font-bold text-slate-800">{{ filteredLeads.length }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button 
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            ← Prev
          </button>
          <span class="px-3 py-1 bg-[#DC2626] text-white font-bold rounded-lg text-xs">{{ currentPage }}</span>
          <span class="text-slate-400">/ {{ totalPages }}</span>
          <button 
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage >= totalPages"
            class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold cursor-pointer"
          >
            Next →
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span>Rows per page:</span>
          <select v-model="pageSize" @change="currentPage = 1" class="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold focus:outline-none">
            <option :value="10">10</option>
            <option :value="20">20</option>
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
  orders: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-lead', 'select-lead'])

const activeLeadTab = ref('all')
const searchQuery = ref('')
const priorityFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(15)

const defaultStaticLeads = [
  { ref: 'L-26-1101', customer: 'Sophie de Jong', dateReceived: '01 Nov', movingDate: '12 Nov', route: 'M → Amsterdam', estValue: 1850, status: 'Quote Sent', priority: 'High', nextAction: 'Call today' },
  { ref: 'L-26-1102', customer: 'Jansen Family', dateReceived: '01 Nov', movingDate: '20 Nov', route: 'M → Heerlen', estValue: 650, status: 'Pending Review', priority: 'Medium', nextAction: 'Follow-up call' },
  { ref: 'L-26-1103', customer: 'UM Student', dateReceived: '31 Oct', movingDate: '15 Nov', route: 'M → M', estValue: 450, status: 'New Lead', priority: 'Low', nextAction: 'Send quote' },
  { ref: 'L-26-1104', customer: 'De Vries', dateReceived: '31 Oct', movingDate: '18 Nov', route: 'M → Eindhoven', estValue: 1250, status: 'Quote Sent', priority: 'High', nextAction: 'Check details' },
  { ref: 'L-26-1105', customer: 'Martine Pieters', dateReceived: '30 Oct', movingDate: '5 Dec', route: 'M → Den Haag', estValue: 2800, status: 'Quote Sent', priority: 'Medium', nextAction: 'Send quote' },
]

const activeLeadsSource = computed(() => {
  if (props.orders && props.orders.length > 0) {
    return props.orders
  }
  return defaultStaticLeads
})

const dynamicLeadTabs = computed(() => {
  const list = activeLeadsSource.value
  return [
    { id: 'all', label: 'All Leads', count: list.length },
    { id: 'new', label: 'New', count: list.filter(o => o.status === 'New Lead').length },
    { id: 'pending', label: 'Pending Review', count: list.filter(o => o.status === 'Pending' || o.status === 'Pending Review').length },
    { id: 'quote_sent', label: 'Quote Sent', count: list.filter(o => o.status === 'Quote Sent' || o.status === 'Estimate Sent').length },
    { id: 'accepted', label: 'Accepted', count: list.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length },
    { id: 'lost', label: 'Lost', count: list.filter(o => o.status === 'Cancelled').length },
  ]
})

const filteredLeads = computed(() => {
  return activeLeadsSource.value.filter(lead => {
    // Tab filter
    if (activeLeadTab.value === 'new' && lead.status !== 'New Lead') return false
    if (activeLeadTab.value === 'pending' && lead.status !== 'Pending' && lead.status !== 'Pending Review') return false
    if (activeLeadTab.value === 'quote_sent' && lead.status !== 'Quote Sent' && lead.status !== 'Estimate Sent') return false
    if (activeLeadTab.value === 'accepted' && lead.status !== 'Confirmed' && lead.status !== 'Completed') return false
    if (activeLeadTab.value === 'lost' && lead.status !== 'Cancelled') return false

    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const match = (lead.ref || '').toLowerCase().includes(q) || 
                    (lead.customer || '').toLowerCase().includes(q) || 
                    (lead.route || '').toLowerCase().includes(q) ||
                    (lead.email || '').toLowerCase().includes(q) ||
                    (lead.phone || '').includes(q)
      if (!match) return false
    }

    // Priority
    if (priorityFilter.value !== 'all' && lead.priority !== priorityFilter.value) {
      return false
    }

    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / pageSize.value) || 1)

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLeads.value.slice(start, start + pageSize.value)
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Quote Sent':
    case 'Estimate Sent': return 'bg-purple-50 text-purple-700 border border-purple-200/60'
    case 'Pending Review':
    case 'Pending': return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    case 'Info Requested': return 'bg-sky-50 text-sky-700 border border-sky-200/60'
    case 'New Lead': return 'bg-blue-50 text-blue-700 border border-blue-200/60'
    case 'Accepted':
    case 'Confirmed':
    case 'Completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
    case 'Lost':
    case 'Cancelled': return 'bg-slate-100 text-slate-500 border border-slate-200/60'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700 font-black'
    case 'Medium': return 'bg-amber-100 text-amber-700'
    case 'Low': return 'bg-slate-100 text-slate-600'
    default: return 'bg-slate-100 text-slate-700'
  }
}

const exportToCSV = () => {
  const rows = [
    ['REF', 'CUSTOMER', 'PHONE', 'EMAIL', 'ROUTE', 'DATE', 'EST_VALUE', 'STATUS'],
    ...filteredLeads.value.map(l => [l.ref, l.customer, l.phone, l.email, l.route, l.movingDate, l.estValue, l.status])
  ]
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'moveit_leads.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

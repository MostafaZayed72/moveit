<template>
  <div class="space-y-6">
    <!-- Top Bar: Back to jobs & Title & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div class="space-y-1">
        <button 
          @click="$emit('back')" 
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#DC2626] transition-colors cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          <span>Back to Jobs & Leads</span>
        </button>
        <div class="flex items-center gap-3">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            {{ activeJob.ref }} — {{ activeJob.customer }}
          </h2>
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="activeJob.status === 'Confirmed' || activeJob.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
          >
            {{ currentStatus }}
          </span>
        </div>
      </div>

      <!-- Quick Action Icons & Status Selector -->
      <div class="flex items-center gap-2">
        <!-- Status Changer Dropdown -->
        <select 
          v-model="currentStatus" 
          @change="onStatusChange"
          class="px-3 py-2 bg-white text-xs font-bold text-slate-800 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="New Lead">New Lead</option>
          <option value="Pending">Pending Review</option>
          <option value="Quote Sent">Quote Sent</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Transit">In Transit</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button @click="printMoveSummary" class="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer" title="Print Summary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto border-b border-slate-200/80 pb-2">
      <button 
        v-for="tab in moveTabs" 
        :key="tab"
        @click="activeMoveTab = tab"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
          activeMoveTab === tab 
            ? 'bg-slate-900 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Move Overview Main Card (Details, Photos, Map) -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <h3 class="text-base font-bold text-slate-900 mb-4">Move Overview</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 1. Left Data Fields (5 Cols) -->
        <div class="lg:col-span-5 space-y-3.5 text-xs">
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Customer</span>
            <span class="font-bold text-slate-900">{{ activeJob.customer }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Phone & Email</span>
            <span class="font-bold text-slate-900 text-right">{{ activeJob.phone || 'N/A' }} • {{ activeJob.email || 'N/A' }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Moving Date</span>
            <span class="font-bold text-slate-900">{{ activeJob.movingDate || 'Flexible' }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Pickup</span>
            <span class="font-bold text-slate-900 text-right max-w-[240px] truncate" :title="activeJob.fromFull">{{ activeJob.fromFull || activeJob.route?.split('→')[0] }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Delivery</span>
            <span class="font-bold text-slate-900 text-right max-w-[240px] truncate" :title="activeJob.toFull">{{ activeJob.toFull || activeJob.route?.split('→')[1] }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Package / Service</span>
            <span class="font-bold text-slate-900">{{ activeJob.package || 'Van + 2 Movers' }}</span>
          </div>
          <div class="flex items-start justify-between py-1 border-b border-slate-100">
            <span class="text-slate-400 font-medium">Estimated Value</span>
            <span class="font-black text-slate-900 font-sans">€{{ (activeJob.estValue || 1850).toLocaleString() }} excl. VAT</span>
          </div>
          <div class="flex items-start justify-between py-1">
            <span class="text-slate-400 font-medium">Customer Notes</span>
            <span class="font-medium text-slate-700 italic max-w-[240px] truncate">{{ activeJob.raw?.form_data?.notes || 'No special notes.' }}</span>
          </div>
        </div>

        <!-- 2. Center Photo Grid (3 Cols) -->
        <div class="lg:col-span-3 flex flex-col justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Inventory Photos</span>
          <div class="grid grid-cols-2 gap-2">
            <div class="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
              <img src="/images/empty_room.png" alt="Furniture" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
              <img src="/images/moving_boxes.png" alt="Boxes" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
              <img src="/images/moving_van.png" alt="Van" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="aspect-square rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-base shadow-inner cursor-pointer hover:bg-slate-700 transition-colors">
              +3
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-2 text-center">Photos verified</p>
        </div>

        <!-- 3. Right Interactive Map Route (4 Cols) -->
        <div class="lg:col-span-4 bg-slate-100 rounded-2xl p-4 flex flex-col justify-between border border-slate-200 relative overflow-hidden group">
          <div class="flex items-center justify-between z-10">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              Live Route Preview
            </span>
            <span class="text-[11px] font-semibold text-slate-500">Netherlands Route</span>
          </div>

          <!-- Stylized Road Map Visual -->
          <div class="my-6 relative flex items-center justify-center h-28">
            <svg class="w-full h-full text-slate-300" viewBox="0 0 300 120" fill="none">
              <path d="M 40 90 Q 150 10 260 40" stroke="#DC2626" stroke-width="4" stroke-dasharray="6 6" fill="none" />
              <circle cx="40" cy="90" r="7" fill="#DC2626" />
              <circle cx="260" cy="40" r="7" fill="#10B981" />
            </svg>
            <div class="absolute bottom-1 left-2 text-[10px] font-bold text-slate-800 bg-white/90 px-2 py-0.5 rounded shadow-sm max-w-[100px] truncate">
              {{ activeJob.fromFull?.split(',')[0] || 'Pickup' }}
            </div>
            <div class="absolute top-1 right-2 text-[10px] font-bold text-slate-800 bg-white/90 px-2 py-0.5 rounded shadow-sm max-w-[100px] truncate">
              {{ activeJob.toFull?.split(',')[0] || 'Destination' }}
            </div>
          </div>

          <a 
            :href="`https://www.google.com/maps/dir/${encodeURIComponent(activeJob.fromFull || 'Maastricht')}/${encodeURIComponent(activeJob.toFull || 'Amsterdam')}`" 
            target="_blank"
            class="w-full py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer z-10"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Timeline & Time Tracking Card -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-base font-bold text-slate-900">Timeline & Time Tracking</h3>
          <p class="text-xs text-slate-500">Milestone logs and duration recorded by drivers</p>
        </div>
        <button class="text-xs font-bold text-[#DC2626] hover:text-red-700 flex items-center gap-1 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Edit Times</span>
        </button>
      </div>

      <!-- Stepper Line -->
      <div class="relative flex flex-col md:flex-row items-center justify-between gap-4 py-2">
        <div class="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

        <div v-for="(step, idx) in timelineSteps" :key="step.title" class="flex flex-col items-center text-center relative z-10 w-full md:w-auto">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-110"
            :class="step.completed ? 'bg-[#DC2626] text-white ring-4 ring-red-50' : 'bg-slate-100 text-slate-400 border border-slate-300'"
          >
            <span v-if="step.completed">✓</span>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span class="text-xs font-bold text-slate-900 mt-2">{{ step.title }}</span>
          <span class="text-[11px] text-slate-500">{{ step.time }}</span>
          <span v-if="step.duration" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">{{ step.duration }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom 3 Cards: Team & Vehicle, Financials, Status & Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 1. Team & Vehicle -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 mb-3">Team & Vehicle</h3>
          <p class="text-[11px] text-slate-400 mb-4">Movers Assigned</p>

          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AH
              </div>
              <div>
                <p class="text-xs font-bold text-slate-900">Ahmed</p>
                <p class="text-[10px] text-slate-400">Lead Driver & Mover</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                TO
              </div>
              <div>
                <p class="text-xs font-bold text-slate-900">Tomas</p>
                <p class="text-[10px] text-slate-400">Professional Mover</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-900">Ford Transit 20m³</p>
            <p class="text-[10px] font-mono text-slate-500">SN-XX-25</p>
          </div>
          <span class="text-xl">🚚</span>
        </div>
      </div>

      <!-- 2. Financials & Profit Engine -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 class="text-sm font-bold text-slate-900 mb-2">Financials</h3>
        
        <div class="flex items-center justify-between text-slate-600">
          <span>Revenue (excl. VAT)</span>
          <span class="font-bold text-slate-900">€{{ revenueExVat.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between text-slate-600">
          <span>VAT (21%)</span>
          <span class="font-bold text-slate-900">€{{ vatAmount.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
          <span>Total Inc. VAT</span>
          <span class="text-sm font-black font-sans">€{{ totalIncVat.toLocaleString() }}</span>
        </div>

        <div class="pt-2 border-t border-slate-100 space-y-1.5 text-slate-500">
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Direct Costs</p>
          <div class="flex justify-between"><span>Labor</span><span>€{{ Math.round(revenueExVat * 0.20) }}</span></div>
          <div class="flex justify-between"><span>Vehicle Rental</span><span>€{{ Math.round(revenueExVat * 0.10) }}</span></div>
          <div class="flex justify-between"><span>Fuel</span><span>€{{ Math.round(revenueExVat * 0.05) }}</span></div>
        </div>

        <!-- Job Contribution Highlight -->
        <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center justify-between text-emerald-800">
          <span class="font-bold">Job Contribution</span>
          <span class="font-black text-sm font-sans">€{{ Math.round(revenueExVat * 0.65).toLocaleString() }} (65%)</span>
        </div>
      </div>

      <!-- 3. Status & Actions -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div class="space-y-3 text-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-2">Status & Actions</h3>
          
          <div class="flex items-center justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Operational Status</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">{{ currentStatus }}</span>
          </div>

          <div class="flex items-center justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Payment Status</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">Part Invoiced</span>
          </div>

          <div class="flex items-center justify-between py-1 border-b border-slate-100">
            <span class="text-slate-500">Priority</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">{{ activeJob.priority || 'Medium' }}</span>
          </div>

          <div class="flex items-center justify-between py-1">
            <span class="text-slate-500">Next Action</span>
            <span class="font-semibold text-slate-800">{{ activeJob.nextAction || 'Send invoice' }}</span>
          </div>
        </div>

        <div class="pt-4">
          <button 
            @click="createInvoiceAlert"
            class="w-full py-3 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📄</span>
            <span>Create Invoice</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  job: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'update-status'])

const activeMoveTab = ref('Overview')

const moveTabs = [
  'Overview', 'Customer', 'Move Details', 'Inventory', 'Quotation', 'Operations', 'Expenses', 'Payments', 'Notes & Files'
]

const fallbackJob = {
  ref: 'J-26-1101',
  customer: 'Sophie de Jong',
  movingDate: '12 Nov 2025 (09:00)',
  fromFull: 'Maastricht, NL (1st floor)',
  toFull: 'Amsterdam, NL (2nd floor)',
  package: 'Private - Relocation - 2-Bedroom',
  estValue: 1850,
  phone: '+31 6 12345678',
  email: 's.dejong@gmail.com',
  status: 'Confirmed'
}

const activeJob = computed(() => props.job || fallbackJob)

const currentStatus = ref(activeJob.value.status || 'Confirmed')

watch(() => props.job, (newJob) => {
  if (newJob) {
    currentStatus.value = newJob.status || 'Confirmed'
  }
}, { immediate: true })

const onStatusChange = () => {
  if (activeJob.value.id) {
    emit('update-status', { id: activeJob.value.id, status: currentStatus.value })
  }
}

const revenueExVat = computed(() => Number(activeJob.value.estValue || 1850))
const vatAmount = computed(() => Math.round(revenueExVat.value * 0.21))
const totalIncVat = computed(() => revenueExVat.value + vatAmount.value)

const timelineSteps = [
  { title: 'Arrived', time: '08:00', duration: '', completed: true },
  { title: 'Loading', time: '08:45 - 10:15', duration: '1h 30m', completed: true },
  { title: 'Driving', time: '10:15 - 13:15', duration: '3h', completed: true },
  { title: 'Unloading', time: '13:15 - 14:30', duration: '1h 15m', completed: true },
  { title: 'Assembly', time: '14:30 - 15:15', duration: '45m', completed: true },
  { title: 'Completed', time: '16:15', duration: '', completed: true },
]

const printMoveSummary = () => {
  window.print()
}

const createInvoiceAlert = () => {
  alert(`Invoice generated for ${activeJob.value.customer} (${activeJob.value.ref}) for €${totalIncVat.value}!`)
}
</script>

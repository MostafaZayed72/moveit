<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased selection:bg-red-500 selection:text-white print:block print:bg-white print:min-h-0 print:h-auto print:overflow-visible">
    <!-- 1. Left Sidebar Navigation (Dark Slate & Vibrant Red) -->
    <AdminSidebar 
      class="print:hidden"
      :active-view="currentView"
      :leads-count="formattedOrders.length || 12"
      :jobs-count="confirmedJobsCount || 15"
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @select-view="handleViewSelect"
    />

    <!-- 2. Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden max-h-screen print:overflow-visible print:max-h-none print:w-full">
      <!-- Top Sticky Header (Visible across all 12 CRM views) -->
      <AdminHeader 
        class="print:hidden"
        :title="viewMeta.title"
        :subtitle="viewMeta.subtitle"
        :action-button-text="viewMeta.actionText"
        @primary-action="handlePrimaryAction"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />

      <!-- Content Views Body -->
      <main class="flex-1 p-3 sm:p-5 lg:p-6 max-w-[1750px] w-full mx-auto print:p-0 print:m-0 print:max-w-none">
        <Transition name="fade" mode="out-in">
          <!-- Screen 1: Overview Dashboard (1 Dashboard.png) -->
          <OverviewView 
            v-if="currentView === 'overview'" 
            :total-revenue="totalRevenue"
            :job-contribution="jobContribution"
            :active-leads-count="activeLeadsCount"
            :pending-quotes-count="pendingQuotesCount"
            :confirmed-jobs-count="confirmedJobsCount"
            :status-counts="statusCounts"
            :upcoming-jobs="upcomingJobs"
            :high-value-leads="highValueLeads"
            :total-orders-count="formattedOrders.length"
            @select-job="openMoveDetail"
            @view-all-jobs="currentView = 'jobs'"
            @view-all-leads="currentView = 'leads'"
          />

          <!-- Screen 2: Leads & Quotations Split View (2 Leads & Quotations.png) -->
          <LeadsView 
            v-else-if="currentView === 'leads'" 
            :orders="leadsOrders"
            @select-lead="openMoveDetail"
            @add-lead="showNewModal = true"
          />

          <!-- Screen 3: Moving Jobs Split View (3 Moving Jobs.png) -->
          <MovingJobsView 
            v-else-if="currentView === 'jobs'" 
            :jobs="movingJobsOrders"
            @select-job="openMoveDetail"
            @update-status="handleUpdateStatus"
            @add-job="showNewModal = true"
          />

          <!-- Screen 4: Moving Calendar (4 Moving Calendar.png) -->
          <CalendarView 
            v-else-if="currentView === 'calendar'" 
            :orders="formattedOrders"
            @add-job="showNewModal = true"
          />

          <!-- Screen 5: Customers Split View (5 Customers.png) -->
          <CustomersView 
            v-else-if="currentView === 'customers'" 
            :customers="realCustomers"
            @add-customer="showNewModal = true"
          />

          <!-- Screen 6: Inventory Split View (6 Inventory.png) -->
          <InventoryView 
            v-else-if="currentView === 'inventory'" 
          />

          <!-- Screen 7: Vehicles Split View (7 Vehicles.png) -->
          <VehiclesView 
            v-else-if="currentView === 'vehicles'" 
          />

          <!-- Screen 8: Team & Crew Split View (8 Team & Crew.png) -->
          <TeamView 
            v-else-if="currentView === 'team'" 
          />

          <!-- Screen 9: Finances (9 Finances.png) -->
          <FinancialsView 
            v-else-if="currentView === 'financials'" 
            :total-revenue="totalRevenue"
            :total-expenses="totalExpenses"
            :net-profit="netProfit"
            :profit-margin="profitMargin"
          />

          <!-- Screen 10: Reports, Analytics & KPIs (10 Reports, Analytics & KPIs.png) -->
          <AnalyticsView 
            v-else-if="currentView === 'reports' || currentView === 'analytics'" 
          />

          <!-- Screen 11: Automation (11 Automation.png) -->
          <AutomationView 
            v-else-if="currentView === 'automation'" 
          />

          <!-- Screen 12: Settings (12 Settings.png) -->
          <SettingsView 
            v-else-if="currentView === 'settings'" 
            @add-member="showNewModal = true"
          />

          <!-- Full Move Detail & Official Quotation A4 Print Workspace -->
          <MoveDetailView 
            v-else-if="currentView === 'move_detail'" 
            :job="selectedJob || formattedOrders[0]"
            @back="currentView = previousView || 'jobs'"
            @update-status="handleUpdateStatus"
          />
        </Transition>
      </main>
    </div>

    <!-- Modal for + New Lead / Job (Connected to Supabase createOrder) -->
    <div v-if="showNewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-lg font-black text-slate-900 font-sans">Create New Entry in Supabase</h3>
            <p class="text-xs text-slate-500">Live order will be saved directly into the database.</p>
          </div>
          <button @click="showNewModal = false" class="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveNewEntry" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Customer Full Name</label>
            <input v-model="newForm.customer" type="text" placeholder="e.g. Mark van Dijk" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input v-model="newForm.phone" type="text" placeholder="+31 6 ..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Email</label>
              <input v-model="newForm.email" type="email" placeholder="customer@mail.nl" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pickup Address</label>
              <input v-model="newForm.pickup" type="text" placeholder="Maastricht" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Delivery Address</label>
              <input v-model="newForm.delivery" type="text" placeholder="Amsterdam" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Moving Date</label>
              <input v-model="newForm.date" type="date" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Est. Value (€)</label>
              <input v-model="newForm.value" type="number" placeholder="1250" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900" />
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" @click="showNewModal = false" class="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all">
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>Save to Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

import { ref, computed, onMounted } from 'vue'
import { useAdminData } from '~/composables/useAdminData'

import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import OverviewView from '~/components/admin/views/OverviewView.vue'
import LeadsView from '~/components/admin/views/LeadsView.vue'
import MoveDetailView from '~/components/admin/views/MoveDetailView.vue'
import MovingJobsView from '~/components/admin/views/MovingJobsView.vue'
import CalendarView from '~/components/admin/views/CalendarView.vue'
import CustomersView from '~/components/admin/views/CustomersView.vue'
import InventoryView from '~/components/admin/views/InventoryView.vue'
import VehiclesView from '~/components/admin/views/VehiclesView.vue'
import TeamView from '~/components/admin/views/TeamView.vue'
import FinancialsView from '~/components/admin/views/FinancialsView.vue'
import AnalyticsView from '~/components/admin/views/AnalyticsView.vue'
import AutomationView from '~/components/admin/views/AutomationView.vue'
import SettingsView from '~/components/admin/views/SettingsView.vue'

const {
  formattedOrders,
  leadsOrders,
  movingJobsOrders,
  fetchOrders,
  updateThreeTrackStatus,
  createOrder,
  totalRevenue,
  jobContribution,
  activeLeadsCount,
  pendingQuotesCount,
  confirmedJobsCount,
  statusCounts,
  upcomingJobs,
  highValueLeads,
  realCustomers,
  totalExpenses,
  netProfit,
  profitMargin
} = useAdminData()

onMounted(() => {
  fetchOrders()
})

const currentView = ref('overview')
const previousView = ref('overview')
const selectedJob = ref(null)
const showNewModal = ref(false)
const isSubmitting = ref(false)
const isSidebarOpen = ref(false)

const newForm = ref({
  customer: '',
  phone: '',
  email: '',
  pickup: '',
  delivery: '',
  date: '',
  value: ''
})

const handleViewSelect = (viewId) => {
  previousView.value = currentView.value
  currentView.value = viewId
}

const openMoveDetail = (job) => {
  selectedJob.value = job
  previousView.value = currentView.value
  currentView.value = 'move_detail'
}

const handlePrimaryAction = () => {
  showNewModal.value = true
}

const handleUpdateStatus = async (payload) => {
  if (!payload || !payload.id) return
  const res = await updateThreeTrackStatus(payload.id, payload)
  if (res.success) {
    if (selectedJob.value && selectedJob.value.id === payload.id) {
      if (payload.operationalStatus) selectedJob.value.operationalStatus = payload.operationalStatus
      if (payload.operationalStatus) selectedJob.value.status = payload.operationalStatus
      if (payload.paymentStatus) selectedJob.value.paymentStatus = payload.paymentStatus
      if (payload.priority) selectedJob.value.priority = payload.priority
    }
  }
}

const saveNewEntry = async () => {
  isSubmitting.value = true
  const res = await createOrder({ ...newForm.value })
  isSubmitting.value = false
  if (res.success) {
    showNewModal.value = false
    newForm.value = { customer: '', phone: '', email: '', pickup: '', delivery: '', date: '', value: '' }
    alert('Live entry saved successfully into Supabase!')
  } else {
    alert('Failed to save to database. Check console for details.')
  }
}

const viewMeta = computed(() => {
  switch (currentView.value) {
    case 'overview':
      return { title: 'Dashboard', subtitle: '', actionText: 'New' }
    case 'leads':
      return { title: 'Leads & Quotations', subtitle: '', actionText: 'New Lead' }
    case 'jobs':
      return { title: 'Moving Jobs', subtitle: '', actionText: 'New Job' }
    case 'calendar':
      return { title: 'Moving Calendar', subtitle: '', actionText: 'New Job' }
    case 'customers':
      return { title: 'Customers', subtitle: '', actionText: 'New Customer' }
    case 'inventory':
      return { title: 'Inventory', subtitle: '', actionText: 'New Item' }
    case 'vehicles':
      return { title: 'Vehicles', subtitle: '', actionText: 'Add Vehicle' }
    case 'team':
      return { title: 'Team & Crew', subtitle: '', actionText: 'Add Team Member' }
    case 'financials':
      return { title: 'Finances', subtitle: '', actionText: 'Add Expense' }
    case 'reports':
    case 'analytics':
      return { title: 'Reports', subtitle: '', actionText: 'Generate Report' }
    case 'automation':
      return { title: 'Automation', subtitle: '', actionText: 'New Automation' }
    case 'settings':
      return { title: 'Settings', subtitle: '', actionText: 'Save Settings' }
    default:
      return { title: 'MoveIt Dashboard', subtitle: '', actionText: 'New' }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

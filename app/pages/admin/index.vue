<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased selection:bg-red-500 selection:text-white">
    <!-- 1. Left Sidebar Navigation (Dark Slate & Vibrant Red) -->
    <AdminSidebar 
      :active-view="currentView"
      :leads-count="formattedOrders.length || 70"
      :jobs-count="confirmedJobsCount || 15"
      @select-view="handleViewSelect"
    />

    <!-- 2. Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
      <!-- Top Sticky Header (Shown on Overview Dashboard) -->
      <AdminHeader 
        v-if="currentView === 'overview'"
        :title="viewMeta.title"
        :subtitle="viewMeta.subtitle"
        :action-button-text="viewMeta.actionText"
        @primary-action="handlePrimaryAction"
      />

      <!-- Content Views Body -->
      <main class="flex-1 p-6 sm:p-8 max-w-[1700px] w-full mx-auto">
        <Transition name="fade" mode="out-in">
          <!-- Screen 1: Overview Dashboard -->
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

          <!-- Screen 2: Leads & Quotations Grid -->
          <LeadsView 
            v-else-if="currentView === 'leads'" 
            :orders="formattedOrders"
            @select-lead="openMoveDetail"
            @add-lead="showNewModal = true"
          />

          <!-- Screen 3: Move Detail Full View -->
          <MoveDetailView 
            v-else-if="currentView === 'move_detail'" 
            :job="selectedJob || formattedOrders[0]"
            @back="currentView = previousView || 'jobs'"
            @update-status="handleUpdateStatus"
          />

          <!-- Screen 4: Moving Jobs Grid -->
          <MovingJobsView 
            v-else-if="currentView === 'jobs'" 
            :jobs="formattedOrders"
            @select-job="openMoveDetail"
            @add-job="showNewModal = true"
          />

          <!-- Screen 5: Moving Calendar -->
          <CalendarView 
            v-else-if="currentView === 'calendar'" 
            :orders="formattedOrders"
            @add-job="showNewModal = true"
          />

          <!-- Screen 6: Customers Excel List -->
          <CustomersView 
            v-else-if="currentView === 'customers'" 
            :customers="realCustomers"
            @add-customer="showNewModal = true"
          />

          <!-- Screen 7: Financials & Profit & Loss -->
          <FinancialsView 
            v-else-if="currentView === 'financials'" 
            :total-revenue="totalRevenue"
            :total-expenses="totalExpenses"
            :net-profit="netProfit"
            :profit-margin="profitMargin"
          />

          <!-- Screen 8: Analytics & KPIs -->
          <AnalyticsView 
            v-else-if="currentView === 'analytics'" 
          />

          <!-- Screen 9: Reports -->
          <FinancialsView 
            v-else-if="currentView === 'reports'" 
            :total-revenue="totalRevenue"
            :total-expenses="totalExpenses"
            :net-profit="netProfit"
            :profit-margin="profitMargin"
          />

          <!-- Screen 10: Settings -->
          <SettingsView 
            v-else-if="currentView === 'settings'" 
            @add-member="showNewModal = true"
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
import FinancialsView from '~/components/admin/views/FinancialsView.vue'
import AnalyticsView from '~/components/admin/views/AnalyticsView.vue'
import SettingsView from '~/components/admin/views/SettingsView.vue'

const {
  formattedOrders,
  fetchOrders,
  updateOrderStatus,
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

const handleUpdateStatus = async ({ id, status }) => {
  const res = await updateOrderStatus(id, status)
  if (res.success) {
    if (selectedJob.value && selectedJob.value.id === id) {
      selectedJob.value.status = status
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
      return {
        title: 'Good morning, Sherif!',
        subtitle: "Here's an overview of MoveIt Maastricht.",
        actionText: 'New Lead'
      }
    case 'leads':
      return {
        title: 'Leads & Quotations',
        subtitle: 'Manage all incoming leads, quotations and follow-ups.',
        actionText: 'Add Lead'
      }
    case 'jobs':
      return {
        title: 'Moving Jobs',
        subtitle: 'Manage all confirmed, ongoing and completed moves.',
        actionText: 'Add Job'
      }
    case 'move_detail':
      return {
        title: 'Move Details & Operations',
        subtitle: 'Complete breakdown of job progress, route and financials.',
        actionText: 'Update Status'
      }
    case 'calendar':
      return {
        title: 'Moving Calendar',
        subtitle: 'Schedule and manage all moving jobs, team members and vehicles.',
        actionText: 'Add Job'
      }
    case 'customers':
      return {
        title: 'Customers',
        subtitle: 'Manage your customer database and view booking history.',
        actionText: 'Add Customer'
      }
    case 'financials':
      return {
        title: 'Financials & Profit & Loss',
        subtitle: 'Track all income, expenses and job profitability.',
        actionText: 'Export Report'
      }
    case 'analytics':
      return {
        title: 'Analytics & KPIs',
        subtitle: 'Track performance and business growth.',
        actionText: 'Export KPIs'
      }
    case 'reports':
      return {
        title: 'Reports & Export',
        subtitle: 'Audit logs, tax summaries and business performance sheets.',
        actionText: 'New Report'
      }
    case 'settings':
      return {
        title: 'Settings',
        subtitle: 'Manage team members, vehicles, categories and system settings.',
        actionText: 'Add Team Member'
      }
    default:
      return {
        title: 'MoveIt Dashboard',
        subtitle: 'Operations & Management Platform',
        actionText: 'Action'
      }
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

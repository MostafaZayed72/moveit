<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Automation Header, 4 KPIs, Filters & Workflows Table (8 Cols - Exact match to "11 Automation.png") -->
    <div class="lg:col-span-8 space-y-4 min-w-0">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Automation</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Automate your workflows to save time and keep your moving business running smoothly.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="openRunModal(automationsList[2])" 
            class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>⚡ Test Automation</span>
          </button>
          <button 
            @click="showNewWorkflowModal = true" 
            class="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <span>+ New Automation</span>
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">⚙️</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Active Automations</p>
            <p class="text-2xl font-black text-slate-900 font-sans">{{ activeAutomationsCount }}</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ 33% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-base">⚡</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Total Automations</p>
            <p class="text-2xl font-black text-slate-900 font-sans">{{ automationsList.length }}</p>
            <p class="text-[11px] text-slate-400">{{ automationsList.length - activeAutomationsCount }} inactive</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base">🕒</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Automations Run</p>
            <p class="text-2xl font-black text-slate-900 font-sans">{{ totalRunsCount }}</p>
            <p class="text-[11px] text-slate-400">this month</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">✓</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Success Rate</p>
            <p class="text-2xl font-black text-slate-900 font-sans">98%</p>
            <p class="text-[11px] text-slate-400">7 failed runs</p>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button 
            v-for="tab in filterTabs" 
            :key="tab.id"
            @click="activeTabId = tab.id"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
              activeTabId === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="flex items-center gap-2 flex-1 justify-end">
          <div class="relative min-w-[180px]">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search automations..." 
              class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
            />
          </div>
          <select v-model="categoryFilter" class="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700">
            <option value="all">All Categories</option>
            <option value="Leads">Leads</option>
            <option value="Quotations">Quotations</option>
            <option value="Jobs">Jobs</option>
            <option value="Team">Team</option>
            <option value="Customers">Customers</option>
            <option value="Finances">Finances</option>
          </select>
        </div>
      </div>

      <!-- Automations Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3.5 font-bold">STATUS</th>
                <th class="py-3 px-3 font-bold">NAME</th>
                <th class="py-3 px-2.5 font-bold">TRIGGER</th>
                <th class="py-3 px-2.5 font-bold">CHANNELS</th>
                <th class="py-3 px-2.5 font-bold">CATEGORY</th>
                <th class="py-3 px-2.5 font-bold">LAST RUN</th>
                <th class="py-3 px-2 font-bold text-center">RUNS</th>
                <th class="py-3 px-2.5 font-bold">SUCCESS</th>
                <th class="py-3 px-3 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="auto in filteredAutomations" :key="auto.name" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-3.5">
                  <button 
                    @click="auto.active = !auto.active"
                    class="w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center"
                    :class="auto.active ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'"
                    :title="auto.active ? 'Click to deactivate' : 'Click to activate'"
                  >
                    <span class="w-4 h-4 rounded-full bg-white shadow-xs"></span>
                  </button>
                </td>
                <td class="py-3.5 px-3">
                  <div class="font-bold text-slate-900">{{ auto.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ auto.subtitle }}</div>
                </td>
                <td class="py-3.5 px-2.5 text-slate-600 text-[11px]">{{ auto.trigger }}</td>
                <td class="py-3.5 px-2.5 text-sm">{{ auto.actionIcons }}</td>
                <td class="py-3.5 px-2.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold" :class="auto.catClass">
                    {{ auto.category }}
                  </span>
                </td>
                <td class="py-3.5 px-2.5 text-[11px] text-slate-500">
                  <div>{{ auto.lastRunDate }}</div>
                  <div class="text-[10px] text-slate-400">{{ auto.lastRunTime }}</div>
                </td>
                <td class="py-3.5 px-2 text-center font-bold text-slate-800">{{ auto.runs }}</td>
                <td class="py-3.5 px-2.5 font-black text-emerald-600">{{ auto.rate }}</td>
                <td class="py-3.5 px-3 text-center">
                  <button
                    @click="openRunModal(auto)"
                    class="px-2.5 py-1 bg-slate-100 hover:bg-[#DC2626] hover:text-white text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    title="Test-run this workflow on a live order"
                  >
                    ▶ Run
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Automation Templates & Recent Activity (4 Cols - Exact match to "11 Automation.png") -->
    <div class="lg:col-span-4 space-y-4">
      <!-- 1. Automation Templates -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Automation Templates</h3>
          <button @click="showNewWorkflowModal = true" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View all →</button>
        </div>

        <div class="space-y-2.5 text-xs">
          <div v-for="tpl in templates" :key="tpl.title" class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-xl flex items-center justify-center text-sm" :class="tpl.iconBg">{{ tpl.icon }}</span>
              <div>
                <div class="font-bold text-slate-900">{{ tpl.title }}</div>
                <div class="text-[10px] text-slate-400">{{ tpl.desc }}</div>
              </div>
            </div>
            <button 
              @click="useTemplate(tpl)"
              class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Recent Automation Activity (Live Feed) -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Recent Automation Activity</h3>
          <span class="text-[10px] font-bold text-emerald-600">● Live Updates</span>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Real logs from prop if available, or rich defaults -->
          <div 
            v-for="(log, idx) in displayedLogs" 
            :key="log.id || idx"
            class="flex items-start gap-2.5"
          >
            <span class="w-2 h-2 rounded-full mt-1.5" :class="log.status === 'failed' ? 'bg-rose-500' : 'bg-emerald-500'"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">{{ log.timeStr }}</span>
            <div>
              <p class="font-bold text-slate-900">{{ log.automation_name || log.name }}</p>
              <p class="text-[10px]" :class="log.status === 'failed' ? 'text-rose-600 font-semibold' : 'text-slate-500'">
                {{ log.detail }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Need Help Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-start gap-3.5">
        <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base flex-shrink-0">💡</span>
        <div class="space-y-2 text-xs">
          <h4 class="font-black text-slate-900">Need help with automation?</h4>
          <p class="text-slate-500 leading-relaxed">
            MoveIt CRM automatically coordinates emails via Resend/Gmail and generates prefilled direct WhatsApp links with Dutch and English relocation templates.
          </p>
          <a
            href="https://wa.me/31621713503"
            target="_blank"
            class="inline-block px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 hover:bg-slate-50"
          >
            Contact Tech Lead
          </a>
        </div>
      </div>
    </div>

    <!-- MODAL 1: TEST RUN AUTOMATION ON REAL ORDER (Phase 3 Core Feature) -->
    <div v-if="showRunModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">⚡ Test Run Automation: {{ selectedWorkflow?.name }}</h3>
            <p class="text-xs text-slate-500">Trigger real email dispatch and generate 1-click WhatsApp message</p>
          </div>
          <button @click="showRunModal = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Select Target Order / Client</label>
            <select v-model="selectedOrderRef" @change="handleOrderSelection" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
              <option v-for="o in availableOrders" :key="o.ref" :value="o.ref">
                {{ o.ref }} — {{ o.customer }} ({{ o.route }}) • €{{ o.estValue }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Recipient Email</label>
              <input v-model="runForm.email" type="email" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Recipient Phone / WhatsApp</label>
              <input v-model="runForm.phone" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Automation Workflow Type</label>
            <select v-model="runForm.type" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
              <option value="quote_followup">💬 Unanswered Quote Follow-Up (3-Day Check-in)</option>
              <option value="job_reminder">⏰ Pre-Move Reminder (24 Hours Before)</option>
              <option value="review_request">⭐ Post-Move 5★ Google Review & Feedback</option>
              <option value="invoice_reminder">🧾 Invoice Dispatch & Payment Link</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Message Preview:</label>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
              {{ generatedMessagePreview }}
            </div>
          </div>

          <div v-if="lastDispatchedResult" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
            <p class="font-black text-xs">✓ Automation Executed Successfully!</p>
            <p class="text-[11px]">Email sent status: <strong>{{ lastDispatchedResult.emailSent ? 'Sent via SMTP' : 'Email bypassed/not provided' }}</strong></p>
            <div v-if="lastDispatchedResult.whatsappUrl" class="pt-1">
              <a
                :href="lastDispatchedResult.whatsappUrl"
                target="_blank"
                class="inline-block px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Open WhatsApp Web / Chat ↗
              </a>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <button @click="showRunModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">
            Close
          </button>
          <button
            @click="executeAutomationNow"
            :disabled="isExecuting"
            class="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
          >
            {{ isExecuting ? 'Dispatching...' : '⚡ Trigger & Dispatch Now' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: NEW AUTOMATION WORKFLOW BUILDER -->
    <div v-if="showNewWorkflowModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">Create New Automation Workflow</h3>
            <p class="text-xs text-slate-500">Configure trigger conditions, channels, and delay</p>
          </div>
          <button @click="showNewWorkflowModal = false" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Workflow Name</label>
            <input v-model="newWorkflowForm.name" placeholder="e.g. VIP Client 48h Follow-up" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Trigger Event</label>
              <select v-model="newWorkflowForm.trigger" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Lead submitted">👤 New Lead Submitted</option>
                <option value="Quotation sent">📄 Quotation Sent</option>
                <option value="Job confirmed">📅 Job Confirmed</option>
                <option value="Job completed">🏁 Job Completed</option>
                <option value="Invoice overdue">💳 Invoice Overdue</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Category</label>
              <select v-model="newWorkflowForm.category" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Leads">Leads</option>
                <option value="Quotations">Quotations</option>
                <option value="Jobs">Jobs</option>
                <option value="Customers">Customers</option>
                <option value="Finances">Finances</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Delay</label>
              <select v-model="newWorkflowForm.delay" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Instant (0h)">Instant (0h)</option>
                <option value="24 Hours">24 Hours</option>
                <option value="48 Hours">48 Hours</option>
                <option value="3 Days">3 Days</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Channels</label>
              <input v-model="newWorkflowForm.channels" placeholder="✉️ Email + 💬 WhatsApp" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="showNewWorkflowModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">Cancel</button>
          <button @click="saveNewWorkflow" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">
            ✓ Save Automation
          </button>
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
  },
  automationLogs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['trigger-automation', 'select-job'])

const activeTabId = ref('all')
const searchQuery = ref('')
const categoryFilter = ref('all')

const showRunModal = ref(false)
const showNewWorkflowModal = ref(false)
const selectedWorkflow = ref(null)
const selectedOrderRef = ref('')
const isExecuting = ref(false)
const lastDispatchedResult = ref(null)

const availableOrders = computed(() => {
  return props.orders || []
})

const runForm = ref({
  type: 'quote_followup',
  customerName: '',
  email: '',
  phone: '',
  route: '',
  ref: '',
  quoteAmount: 450
})

watch(availableOrders, (newOrders) => {
  if (newOrders.length > 0 && !runForm.value.customerName) {
    const o = newOrders[0]
    runForm.value = {
      type: 'quote_followup',
      customerName: o.customer,
      email: o.email && o.email !== 'N/A' ? o.email : '',
      phone: o.phone && o.phone !== 'N/A' ? o.phone : '',
      route: o.route,
      ref: o.ref,
      quoteAmount: o.estValue || 450
    }
  }
}, { immediate: true })

const displayedLogs = computed(() => {
  if (props.automationLogs && props.automationLogs.length > 0) {
    return props.automationLogs.map(l => ({
      ...l,
      timeStr: l.created_at ? new Date(l.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Recent',
      detail: `${l.channel?.toUpperCase() || 'MSG'} to ${l.customer_name || 'Client'} (${l.status})`
    }))
  }
  return (props.orders || []).slice(0, 5).map(o => ({
    timeStr: o.shortDate || 'Recent',
    name: o.operationalStatus === 'Completed' ? 'Post-Move Feedback' : (o.salesStatus?.includes('Quote') ? 'Send Quotation' : 'New Lead Notification'),
    detail: `${o.ref} (${o.customer}) - ${o.operationalStatus || 'Active'}`,
    status: 'sent'
  }))
})

const generatedMessagePreview = computed(() => {
  const f = runForm.value
  if (f.type === 'quote_followup') {
    return `Hello ${f.customerName}! 🚚\n\nThis is Sherif from MoveIt Maastricht following up on quotation ${f.ref} for your relocation (${f.route}).\n\nEstimated Price: €${f.quoteAmount} (Fixed-price guarantee, 21% BTW & all-risk insurance included).\n\nWould you like to lock in this moving date? Reply here or tap the link to confirm.`
  }
  if (f.type === 'job_reminder') {
    return `Hello ${f.customerName}! 🚚\n\nYour MoveIt team is scheduled for TOMORROW at 08:00 AM!\nRoute: ${f.route}\nCrew: Ahmed & Tomas • Van 1 (Ford Transit 20m³)\n\nReminder: Please ensure a 10m parking reservation in front of your entrance.`
  }
  if (f.type === 'review_request') {
    return `Hello ${f.customerName}! ⭐\n\nWe hope you had a smooth relocation to ${f.route.split('→')[1]?.trim() || 'your new home'}!\n\nCould you please take 30 seconds to leave us a Google review? It helps our local crew tremendously: https://g.page/r/MoveItMaastricht/review`
  }
  return `Hello ${f.customerName}, here is an update regarding moving order ${f.ref}: ${f.route}.`
})

const openRunModal = (auto) => {
  selectedWorkflow.value = auto
  if (auto && auto.type) {
    runForm.value.type = auto.type
  }
  const defaultOrder = availableOrders.value[0]
  if (defaultOrder) {
    selectedOrderRef.value = defaultOrder.ref
    runForm.value = {
      type: auto?.type || 'quote_followup',
      customerName: defaultOrder.customer,
      email: defaultOrder.email || 'customer@mail.nl',
      phone: defaultOrder.phone || '+31 6 8409 4271',
      route: defaultOrder.route,
      ref: defaultOrder.ref,
      quoteAmount: defaultOrder.estValue || 1450
    }
  }
  lastDispatchedResult.value = null
  showRunModal.value = true
}

const handleOrderSelection = () => {
  const ord = availableOrders.value.find(o => o.ref === selectedOrderRef.value)
  if (ord) {
    runForm.value.customerName = ord.customer
    runForm.value.email = ord.email || 'customer@mail.nl'
    runForm.value.phone = ord.phone || '+31 6 8409 4271'
    runForm.value.route = ord.route
    runForm.value.ref = ord.ref
    runForm.value.quoteAmount = ord.estValue || 1200
  }
}

const executeAutomationNow = async () => {
  isExecuting.value = true
  lastDispatchedResult.value = null
  try {
    const res = await $fetch('/api/admin/automation', {
      method: 'POST',
      body: {
        action: 'trigger_automation',
        automationType: runForm.value.type,
        customerName: runForm.value.customerName,
        recipientEmail: runForm.value.email,
        recipientPhone: runForm.value.phone,
        route: runForm.value.route,
        ref: runForm.value.ref,
        quoteAmount: runForm.value.quoteAmount
      }
    })
    lastDispatchedResult.value = res
    if (selectedWorkflow.value) {
      selectedWorkflow.value.runs = (selectedWorkflow.value.runs || 0) + 1
      selectedWorkflow.value.lastRunDate = 'Just now'
      selectedWorkflow.value.lastRunTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
  } catch (e) {
    console.error('Execution error:', e)
    alert('Automation execution error: ' + (e.message || 'Check connection'))
  } finally {
    isExecuting.value = false
  }
}

const useTemplate = (tpl) => {
  openRunModal({
    name: tpl.title,
    subtitle: tpl.desc,
    type: tpl.type
  })
}

const saveNewWorkflow = () => {
  if (!newWorkflowForm.value.name) return
  automationsList.value.unshift({
    active: true,
    name: newWorkflowForm.value.name,
    subtitle: `Custom automated workflow (${newWorkflowForm.value.delay})`,
    trigger: newWorkflowForm.value.trigger,
    actionIcons: newWorkflowForm.value.channels.includes('WhatsApp') ? '✉️ 💬' : '✉️',
    category: newWorkflowForm.value.category,
    catClass: 'bg-blue-50 text-blue-600',
    lastRunDate: 'Created',
    lastRunTime: 'Pending trigger',
    runs: 0,
    rate: '100%',
    type: 'custom'
  })
  showNewWorkflowModal.value = false
  alert(`Workflow "${newWorkflowForm.value.name}" activated successfully!`)
}
</script>

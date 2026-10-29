<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Automation Header, 4 KPIs, Filters & Workflows Table (8 Cols - Exact match to "11 Automation.png") -->
    <div class="lg:col-span-8 space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Automation</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Automate your workflows to save time and keep your moving business running smoothly.
        </p>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">⚙️</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Active Automations</p>
            <p class="text-2xl font-black text-slate-900 font-sans">12</p>
            <p class="text-[11px] font-bold text-emerald-600">↗ 33% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-base">⚡</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Total Automations</p>
            <p class="text-2xl font-black text-slate-900 font-sans">18</p>
            <p class="text-[11px] text-slate-400">6 inactive</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <span class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base">🕒</span>
          <div>
            <p class="text-xs font-medium text-slate-500">Automations Run</p>
            <p class="text-2xl font-black text-slate-900 font-sans">842</p>
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
            v-for="tab in ['All Automations (18)', 'Active (12)', 'Inactive (6)']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
              activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ tab }}
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
          <select class="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700">
            <option>All Triggers</option>
          </select>
          <select class="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700">
            <option>All Categories</option>
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
                <th class="py-3 px-2.5 font-bold">ACTIONS</th>
                <th class="py-3 px-2.5 font-bold">CATEGORY</th>
                <th class="py-3 px-2.5 font-bold">LAST RUN</th>
                <th class="py-3 px-2 font-bold text-center">RUNS</th>
                <th class="py-3 px-2.5 font-bold">SUCCESS RATE</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="auto in automationsList" :key="auto.name" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-3.5">
                  <button 
                    @click="auto.active = !auto.active"
                    class="w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center"
                    :class="auto.active ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'"
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
                <td class="py-3.5 px-2 text-center text-slate-400">•••</td>
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
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
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
            <button class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[11px] font-bold cursor-pointer">
              Use
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Recent Automation Activity -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-900">Recent Automation Activity</h3>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex items-start gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">2 Nov 2025, 10:24</span>
            <div>
              <p class="font-bold text-slate-900">New Lead Notification</p>
              <p class="text-[10px] text-slate-500">Lead #L-2026-0184 (Sophie)</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">2 Nov 2025, 09:12</span>
            <div>
              <p class="font-bold text-slate-900">Send Quotation</p>
              <p class="text-[10px] text-slate-500">Quote #Q-2026-1042 sent</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">2 Nov 2025, 08:55</span>
            <div>
              <p class="font-bold text-slate-900">Payment Reminder</p>
              <p class="text-[10px] text-rose-600 font-semibold">Failed to send email (invalid address)</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">1 Nov 2025, 18:00</span>
            <div>
              <p class="font-bold text-slate-900">Job Reminder</p>
              <p class="text-[10px] text-slate-500">Reminder sent for Job #J-26-1101</p>
            </div>
          </div>

          <div class="flex items-start gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
            <span class="text-[11px] text-slate-400 w-24 flex-shrink-0">1 Nov 2025, 16:30</span>
            <div>
              <p class="font-bold text-slate-900">Post-Move Feedback</p>
              <p class="text-[10px] text-slate-500">Review request sent to Edward</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Need Help Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-start gap-3.5">
        <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base flex-shrink-0">💡</span>
        <div class="space-y-2 text-xs">
          <h4 class="font-black text-slate-900">Need help with automation?</h4>
          <p class="text-slate-500 leading-relaxed">Create custom workflows, integrate with your favorite tools, and automate repetitive tasks.</p>
          <button class="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 hover:bg-slate-50">
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('All Automations (18)')
const searchQuery = ref('')

const automationsList = ref([
  { active: true, name: 'New Lead Notification', subtitle: 'Get notified when a new lead comes in', trigger: '👤 New lead submitted', actionIcons: '✉️ 💬 📱', category: 'Leads', catClass: 'bg-blue-50 text-blue-600', lastRunDate: '2 Nov 2025', lastRunTime: '10:24', runs: 48, rate: '100%' },
  { active: true, name: 'Send Quotation Automatically', subtitle: 'Send a PDF quote to the customer', trigger: '📄 Quotation created', actionIcons: '✉️ 📕', category: 'Quotations', catClass: 'bg-purple-50 text-purple-600', lastRunDate: '2 Nov 2025', lastRunTime: '09:12', runs: 36, rate: '100%' },
  { active: true, name: 'Quotation Follow-up', subtitle: 'Follow up if no response', trigger: '🕒 3 days after quote sent', actionIcons: '✉️ 💬', category: 'Leads', catClass: 'bg-blue-50 text-blue-600', lastRunDate: '1 Nov 2025', lastRunTime: '14:00', runs: 28, rate: '96%' },
  { active: true, name: 'Job Confirmation', subtitle: 'Send confirmation with details', trigger: '📅 Job status → Confirmed', actionIcons: '✉️ 💬', category: 'Jobs', catClass: 'bg-emerald-50 text-emerald-700', lastRunDate: '2 Nov 2025', lastRunTime: '08:05', runs: 52, rate: '100%' },
  { active: true, name: 'Crew Assignment Notification', subtitle: 'Notify crew about new job', trigger: '👥 Job assigned', actionIcons: '💬 ✉️', category: 'Team', catClass: 'bg-amber-50 text-amber-700', lastRunDate: '2 Nov 2025', lastRunTime: '08:10', runs: 52, rate: '100%' },
  { active: true, name: 'Job Reminder to Customer', subtitle: 'Send reminder 1 day before move', trigger: '🕒 1 day before job date', actionIcons: '💬 ✉️', category: 'Jobs', catClass: 'bg-emerald-50 text-emerald-700', lastRunDate: '1 Nov 2025', lastRunTime: '18:00', runs: 45, rate: '98%' },
  { active: true, name: 'Post-Move Feedback', subtitle: 'Request a review after job completion', trigger: '🕒 1 day after job completed', actionIcons: '✉️ ⭐', category: 'Customers', catClass: 'bg-rose-50 text-rose-600', lastRunDate: '31 Oct 2025', lastRunTime: '16:30', runs: 38, rate: '97%' },
  { active: true, name: 'Invoice Generation', subtitle: 'Create and send invoice automatically', trigger: '📅 Job status → Completed', actionIcons: '📄 ✉️', category: 'Finances', catClass: 'bg-rose-50 text-rose-600', lastRunDate: '2 Nov 2025', lastRunTime: '11:05', runs: 41, rate: '100%' },
  { active: true, name: 'Payment Reminder', subtitle: 'Follow up on unpaid invoices', trigger: '🕒 3 days before due date', actionIcons: '✉️ 💬', category: 'Finances', catClass: 'bg-rose-50 text-rose-600', lastRunDate: '1 Nov 2025', lastRunTime: '09:00', runs: 22, rate: '95%' },
  { active: true, name: 'Low Inventory Alert', subtitle: 'Notify when stock is low', trigger: '📦 Stock below minimum', actionIcons: '✉️ 🔔', category: 'Inventory', catClass: 'bg-purple-50 text-purple-600', lastRunDate: '2 Nov 2025', lastRunTime: '07:45', runs: 15, rate: '100%' },
  { active: true, name: 'Vehicle Maintenance Reminder', subtitle: 'Notify before maintenance is due', trigger: '🔧 30 days before service date', actionIcons: '✉️ 📅', category: 'Vehicles', catClass: 'bg-sky-50 text-sky-600', lastRunDate: '30 Oct 2025', lastRunTime: '12:10', runs: 8, rate: '100%' },
  { active: false, name: 'Inactive Lead Cleanup', subtitle: 'Archive old leads automatically', trigger: '🕒 30 days no activity', actionIcons: '🗑️', category: 'Leads', catClass: 'bg-blue-50 text-blue-600', lastRunDate: '25 Oct 2025', lastRunTime: '02:00', runs: 6, rate: '100%' }
])

const templates = [
  { icon: '✉️', iconBg: 'bg-blue-50 text-blue-600', title: 'New Lead Welcome', desc: 'Instantly reply to new leads' },
  { icon: '🕒', iconBg: 'bg-purple-50 text-purple-600', title: 'Quotation Follow-up', desc: 'Follow up on quotes automatically' },
  { icon: '📅', iconBg: 'bg-emerald-50 text-emerald-600', title: 'Job Confirmation', desc: 'Send job details to customer' },
  { icon: '⭐', iconBg: 'bg-amber-50 text-amber-500', title: 'Post-Move Review Request', desc: 'Ask for Google review after move' },
  { icon: '💳', iconBg: 'bg-blue-50 text-blue-600', title: 'Payment Reminder', desc: 'Follow up on unpaid invoices' },
  { icon: '📦', iconBg: 'bg-amber-50 text-amber-600', title: 'Low Stock Alert', desc: 'Get notified when inventory is low' }
]
</script>


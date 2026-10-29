<template>
  <div class="space-y-5">
    <!-- 1. Header (Exact match to "12 Settings.png") -->
    <div>
      <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Settings</h1>
      <p class="text-xs text-slate-500 font-medium mt-0.5">
        Manage your company settings, preferences, and configuration.
      </p>
    </div>

    <!-- 2. 9 Sub-Category Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <button 
        v-for="tab in settingsTabs" 
        :key="tab.label"
        @click="activeTab = tab.label"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border',
          activeTab === tab.label 
            ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-sm shadow-red-600/20' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        ]"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- 3. 3-Column Settings Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- COLUMN 1: Business Information, Service Packages, Integrations (4 Cols) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Business Information -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Business Information</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-2.5 text-xs">
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Company Name</span><span class="col-span-7 font-semibold text-slate-900">Moveit Maastricht</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Legal Entity</span><span class="col-span-7 font-semibold text-slate-900">S&S Services (VOF)</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Chamber of Commerce</span><span class="col-span-7 font-semibold text-slate-900">85672914</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">VAT Number</span><span class="col-span-7 font-semibold text-slate-900">NL863218765B01</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Address</span><span class="col-span-7 font-semibold text-slate-900">Dokter van Kleefstraat 46C<br/>6217 JK Maastricht, Netherlands</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Phone</span><span class="col-span-7 font-semibold text-slate-900">+31 6 12 34 56 78</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Email</span><span class="col-span-7 font-semibold text-blue-600">info@moveit-maastricht.nl</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Website</span><span class="col-span-7 font-semibold text-blue-600">www.moveit-maastricht.nl</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Service Area</span><span class="col-span-7 font-semibold text-slate-900">Limburg, Netherlands + EU</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Currency</span><span class="col-span-7 font-semibold text-slate-900">Euro (€)</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Language</span><span class="col-span-7 font-semibold text-slate-900">English (Primary), Dutch (Secondary)</span></div>
            <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Time Zone</span><span class="col-span-7 font-semibold text-slate-900">Europe/Amsterdam (CET)</span></div>
          </div>
        </div>

        <!-- Service Packages -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Service Packages</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <table class="w-full text-left text-xs">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th class="pb-2">PACKAGE NAME</th>
                <th class="pb-2">HOURLY RATE (EXCL. VAT)</th>
                <th class="pb-2 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-2.5 font-semibold">Van Only / Do It Yourself</td>
                <td class="py-2.5 font-bold font-sans">€69.99</td>
                <td class="py-2.5 text-right"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
              <tr>
                <td class="py-2.5 font-semibold">Van + 1 Mover / Student Move</td>
                <td class="py-2.5 font-bold font-sans">€79.99</td>
                <td class="py-2.5 text-right"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
              <tr>
                <td class="py-2.5 font-semibold">Van + 2 Movers / Stress-Free</td>
                <td class="py-2.5 font-bold font-sans">€94.99</td>
                <td class="py-2.5 text-right"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
              <tr>
                <td class="py-2.5 font-semibold">Full-Service / White-Glove</td>
                <td class="py-2.5 font-bold font-sans">€149.00</td>
                <td class="py-2.5 text-right"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Active</span></td>
              </tr>
            </tbody>
          </table>
          <button class="text-xs font-bold text-blue-600 hover:underline pt-1">Manage Service Packages →</button>
        </div>

        <!-- Integrations -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Integrations</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm">💬</span>
                <div>
                  <p class="font-bold text-slate-900">WhatsApp</p>
                  <p class="text-[10px] text-slate-400">Send job updates and customer messages</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">✓ Connected</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">📅</span>
                <div>
                  <p class="font-bold text-slate-900">Google Calendar</p>
                  <p class="text-[10px] text-slate-400">Sync jobs and crew schedules</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">✓ Connected</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm">📁</span>
                <div>
                  <p class="font-bold text-slate-900">Google Drive</p>
                  <p class="text-[10px] text-slate-400">Store documents and photos</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">✓ Connected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 2: Default Settings, Document Templates, Security & Access (5 Cols) -->
      <div class="lg:col-span-5 space-y-5">
        <!-- Default Settings -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Default Settings</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-2.5 text-xs">
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Default VAT Rate</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>21% (Netherlands)</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Default Labour Rate</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>€20.00 per worker/hour</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Default Van Rate</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>€100.00 per day (500 km incl.)</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Buffer Time (≥3h jobs)</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>+1 hour</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Cancellation Policy</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>72 hours</option></select>
            </div>
            <div class="grid grid-cols-12 items-start py-1">
              <span class="col-span-5 text-slate-500">Payment Methods</span>
              <div class="col-span-7 space-y-1.5 font-semibold text-slate-800">
                <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded text-blue-600" /> Tikkie (Recommended)</label>
                <label class="flex items-center gap-2"><input type="checkbox" checked class="rounded text-blue-600" /> Cash (On-site)</label>
                <label class="flex items-center gap-2"><input type="checkbox" class="rounded text-blue-600" /> Bank Transfer</label>
              </div>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Default Quote Validity</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>14 days</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Default Job Status</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>Confirmed</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Distance Unit</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>Kilometers (km)</option></select>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-500">Weight Unit</span>
              <select class="col-span-7 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800"><option>Kilograms (kg)</option></select>
            </div>
          </div>
        </div>

        <!-- Document Templates -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Document Templates</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-2.5 text-xs">
            <div v-for="doc in docTemplates" :key="doc.name" class="flex items-center justify-between py-1">
              <div class="flex items-center gap-2.5">
                <span class="text-blue-600">📄</span>
                <div>
                  <p class="font-bold text-slate-900">{{ doc.name }}</p>
                  <p class="text-[10px] text-slate-400">{{ doc.file }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="doc.badgeClass">{{ doc.tag }}</span>
                <span class="text-slate-400">•••</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security & Access -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Security & Access</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-2.5 text-xs">
            <div class="flex items-center justify-between">
              <div><p class="font-bold text-slate-900">🛡️ Two-Factor Authentication</p><p class="text-[10px] text-slate-400">Required for all users</p></div>
              <span class="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Enabled</span>
            </div>
            <div class="flex items-center justify-between">
              <div><p class="font-bold text-slate-900">⏱️ Session Timeout</p><p class="text-[10px] text-slate-400">Auto logout after 8 hours</p></div>
              <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">8 hours</span>
            </div>
            <div class="flex items-center justify-between">
              <div><p class="font-bold text-slate-900">🔒 Password Policy</p><p class="text-[10px] text-slate-400">Minimum 8 characters</p></div>
              <span class="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Enforced</span>
            </div>
            <div class="flex items-center justify-between">
              <div><p class="font-bold text-slate-900">🕒 Login Activity</p><p class="text-[10px] text-slate-400">View recent login attempts</p></div>
              <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[10px] font-bold text-blue-600">View Logs →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 3: Company Logo, Business Hours, Notification Preferences (3 Cols) -->
      <div class="lg:col-span-3 space-y-5">
        <!-- Company Logo -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Company Logo</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="py-8 px-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <div class="text-3xl font-black text-[#DC2626] tracking-tight font-sans">move•it</div>
            <div class="text-[10px] font-bold tracking-[0.25em] text-slate-500 mt-1">MAASTRICHT</div>
          </div>
        </div>

        <!-- Business Hours -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Business Hours</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between"><span class="text-slate-500">Monday</span><span class="font-semibold text-slate-900">08:00 – 18:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Tuesday</span><span class="font-semibold text-slate-900">08:00 – 18:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Wednesday</span><span class="font-semibold text-slate-900">08:00 – 18:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Thursday</span><span class="font-semibold text-slate-900">08:00 – 18:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Friday</span><span class="font-semibold text-slate-900">08:00 – 18:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Saturday</span><span class="font-semibold text-slate-900">09:00 – 16:00</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Sunday</span><span class="font-semibold text-slate-500">Closed</span></div>
          </div>
        </div>

        <!-- Notification Preferences -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Notification Preferences</h3>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">✎ Edit</button>
          </div>
          <div class="space-y-3 text-xs">
            <div v-for="pref in notifPrefs" :key="pref.title" class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="text-sm">{{ pref.icon }}</span>
                <div>
                  <p class="font-bold text-slate-900">{{ pref.title }}</p>
                  <p class="text-[10px] text-slate-400">{{ pref.desc }}</p>
                </div>
              </div>
              <button 
                @click="pref.enabled = !pref.enabled"
                class="w-9 h-5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer"
                :class="pref.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'"
              >
                <span class="w-4 h-4 rounded-full bg-white shadow-xs"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['add-member'])

const activeTab = ref('General')

const settingsTabs = [
  { icon: '⚙️', label: 'General' },
  { icon: '🏢', label: 'Company' },
  { icon: '👥', label: 'Users & Roles' },
  { icon: '📦', label: 'Service Packages' },
  { icon: '💬', label: 'Communication' },
  { icon: '📄', label: 'Documents' },
  { icon: '🔌', label: 'Integrations' },
  { icon: '💳', label: 'Billing' },
  { icon: '🛡️', label: 'Security' }
]

const docTemplates = [
  { name: 'Quotation Template', file: 'Moveit_Quote_NL_EN.pdf', tag: 'Quotation', badgeClass: 'bg-blue-50 text-blue-600' },
  { name: 'Invoice Template', file: 'Moveit_Invoice_NL_EN.pdf', tag: 'Invoice', badgeClass: 'bg-emerald-50 text-emerald-700' },
  { name: 'Terms & Conditions', file: 'Moveit_Terms_EN_NL.pdf', tag: 'Legal', badgeClass: 'bg-purple-50 text-purple-600' },
  { name: 'Insurance Information', file: 'Moveit_Insurance_NL.pdf', tag: 'Legal', badgeClass: 'bg-purple-50 text-purple-600' },
  { name: 'Customs Document (CH)', file: 'Moveit_Customs_CH.pdf', tag: 'International', badgeClass: 'bg-amber-50 text-amber-700' },
  { name: 'Damage Report Form', file: 'Moveit_Damage_Report.pdf', tag: 'Operations', badgeClass: 'bg-slate-100 text-slate-600' }
]

const notifPrefs = ref([
  { icon: '✉️', title: 'Email Notifications', desc: 'Quotes, job updates, payments', enabled: true },
  { icon: '📱', title: 'SMS Notifications', desc: 'Job confirmations, reminders', enabled: true },
  { icon: '💬', title: 'WhatsApp Notifications', desc: 'Customer updates, crew alerts', enabled: true },
  { icon: '🔔', title: 'Internal Alerts', desc: 'Low inventory, maintenance, etc.', enabled: true }
])
</script>

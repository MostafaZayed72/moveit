<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Customers Header, 4 KPIs, Filters & Table (8 Cols - Exact match to "5 Customers.png") -->
    <div class="lg:col-span-8 space-y-4">
      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Customers</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Manage your customer database, view history and bookings.
        </p>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- Total Customers -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Total Customers</p>
            <p class="text-2xl font-black text-slate-900 font-sans">248</p>
            <p class="text-[11px] font-bold text-emerald-600">
              <span>↗ +12%</span>
              <span class="text-slate-400 font-normal ml-1">vs. last month</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">👥</div>
        </div>

        <!-- New Customers -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">New Customers</p>
            <p class="text-2xl font-black text-slate-900 font-sans">28</p>
            <p class="text-[11px] font-bold text-emerald-600">
              <span>↗ +33%</span>
              <span class="text-slate-400 font-normal ml-1">vs. last month</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">👤</div>
        </div>

        <!-- Returning Customers -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Returning Customers</p>
            <p class="text-2xl font-black text-slate-900 font-sans">64</p>
            <p class="text-[11px] font-bold text-emerald-600">
              <span>↗ +18%</span>
              <span class="text-slate-400 font-normal ml-1">vs. last month</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-base">🔄</div>
        </div>

        <!-- Customer Satisfaction -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500">Customer Satisfaction</p>
            <p class="text-2xl font-black text-slate-900 font-sans">4.8</p>
            <p class="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <span>★★★★★</span>
              <span class="text-slate-400 font-normal text-[10px]">(72 reviews)</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-base">⭐</div>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search customers..." 
            class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
          />
        </div>

        <select v-model="typeFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
          <option value="all">All Types</option>
          <option value="Private">Private</option>
          <option value="Business">Business</option>
          <option value="Student">Student</option>
        </select>

        <select v-model="locationFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
          <option value="all">All Locations</option>
          <option value="Maastricht">Maastricht</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="Rotterdam">Rotterdam</option>
        </select>

        <select v-model="statusFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button 
          @click="searchQuery = ''; typeFilter = 'all'; locationFilter = 'all'; statusFilter = 'all'"
          class="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
        >
          Clear
        </button>
      </div>

      <!-- Customers Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3.5 w-8 text-center">
                  <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                </th>
                <th class="py-3 px-3 font-bold">NAME</th>
                <th class="py-3 px-3 font-bold">PHONE</th>
                <th class="py-3 px-3 font-bold">EMAIL</th>
                <th class="py-3 px-2.5 font-bold">TYPE</th>
                <th class="py-3 px-2.5 font-bold text-center">TOTAL JOBS</th>
                <th class="py-3 px-2.5 font-bold">TOTAL REVENUE</th>
                <th class="py-3 px-2.5 font-bold">LAST MOVE</th>
                <th class="py-3 px-2.5 font-bold">STATUS</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="c in filteredCustomers" 
                :key="c.name"
                @mouseenter="activeSelectedCustomer = c"
                @click="activeSelectedCustomer = c"
                :class="[
                  'transition-colors cursor-pointer group',
                  activeSelectedCustomer?.name === c.name 
                    ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                    : 'hover:bg-slate-50/80'
                ]"
              >
                <td class="py-3 px-3.5 text-center" @click.stop>
                  <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                </td>
                <td class="py-3 px-3 whitespace-nowrap">
                  <div class="flex items-center gap-2.5">
                    <span 
                      class="w-7 h-7 rounded-full text-white text-[10px] font-black flex items-center justify-center flex-shrink-0"
                      :class="c.avatarBg || 'bg-rose-600'"
                    >
                      {{ c.initials }}
                    </span>
                    <span class="font-bold text-slate-900 group-hover:text-red-600">{{ c.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-3 text-slate-600 whitespace-nowrap">{{ c.phone }}</td>
                <td class="py-3 px-3 text-slate-500 whitespace-nowrap">{{ c.email }}</td>
                <td class="py-3 px-2.5 text-slate-600 whitespace-nowrap">{{ c.type }}</td>
                <td class="py-3 px-2.5 font-bold text-slate-800 text-center">{{ c.totalMoves }}</td>
                <td class="py-3 px-2.5 font-bold text-slate-900 font-sans whitespace-nowrap">€{{ (c.totalRevenue || 0).toLocaleString() }}</td>
                <td class="py-3 px-2.5 text-slate-600 whitespace-nowrap">{{ c.lastMove }}</td>
                <td class="py-3 px-2.5 whitespace-nowrap">
                  <span 
                    class="px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                    :class="c.status === 'Inactive' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'"
                  >
                    {{ c.status || 'Active' }}
                  </span>
                </td>
                <td class="py-3 px-2 text-center text-slate-400">•••</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–15</span> of <span class="font-bold text-slate-800">248</span></div>
          <div class="flex items-center gap-1.5">
            <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">2</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">3</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">4</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">5</button>
            <span>...</span>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">17</button>
            <select class="ml-1 px-2 py-1 border border-slate-200 rounded-lg text-slate-700 font-semibold">
              <option>15</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Customer Profile Detail Drawer (4 Cols - Exact match to "5 Customers.png") -->
    <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-20 space-y-5">
      <!-- Customer Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-slate-800 text-white font-black text-sm flex items-center justify-center">
            {{ activeSelectedCustomer.initials || 'SD' }}
          </div>
          <div>
            <h3 class="text-base font-black text-slate-900">{{ activeSelectedCustomer.name }}</h3>
            <p class="text-[11px] text-slate-400">Customer since Apr 2024</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
            {{ activeSelectedCustomer.status || 'Active' }}
          </span>
          <span class="text-slate-400 text-xs cursor-pointer">•••</span>
          <span class="text-slate-400 text-xs cursor-pointer">✕</span>
        </div>
      </div>

      <!-- Profile Sub-tabs -->
      <div class="flex items-center gap-4 border-b border-slate-200/80 text-xs font-bold overflow-x-auto">
        <button 
          v-for="tab in ['Overview', `Jobs (${activeSelectedCustomer.totalMoves || 3})`, 'Quotes (2)', 'Invoices (3)', 'Notes (4)']" 
          :key="tab"
          @click="activeDrawerTab = tab"
          :class="[
            'pb-2.5 whitespace-nowrap relative cursor-pointer',
            activeDrawerTab === tab ? 'text-[#DC2626]' : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          {{ tab }}
          <div v-if="activeDrawerTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
        </button>
      </div>

      <!-- Contact Information -->
      <div class="space-y-2.5 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Contact Information</h4>
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50">••• Edit</button>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">📞</span>
          <span class="font-semibold text-slate-800">{{ activeSelectedCustomer.phone }}</span>
          <a 
            :href="`https://wa.me/${(activeSelectedCustomer.phone || '31612345678').replace(/[^0-9]/g, '')}`"
            target="_blank"
            class="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]"
          >
            💬
          </a>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">✉️</span>
          <span class="text-slate-600">{{ activeSelectedCustomer.email }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">👤</span>
          <span class="text-slate-700 font-medium">{{ activeSelectedCustomer.type }} Customer</span>
        </div>
      </div>

      <!-- Addresses Timeline -->
      <div class="space-y-2.5 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Addresses</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">+ Add Address</button>
        </div>
        <div class="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div class="relative flex items-start justify-between">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[18px] top-1 ring-4 ring-white"></span>
            <div>
              <p class="text-[10px] font-bold text-slate-500">Current Address (Last Move)</p>
              <p class="font-bold text-slate-900">Maastricht, NL</p>
            </div>
            <span class="text-[11px] text-slate-400">{{ activeSelectedCustomer.lastMove }}</span>
          </div>
          <div class="relative flex items-start justify-between">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-[18px] top-1 ring-4 ring-white"></span>
            <div>
              <p class="text-[10px] font-bold text-slate-500">Previous Address</p>
              <p class="font-bold text-slate-900">Rotterdam, NL</p>
            </div>
            <span class="text-[11px] text-slate-400">5 Mar 2024</span>
          </div>
        </div>
      </div>

      <!-- Customer Notes -->
      <div class="space-y-2 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Customer Notes</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">✎ Edit</button>
        </div>
        <div class="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-slate-700 leading-relaxed text-[11px]">
          Very satisfied customer. Requested careful handling of fragile items (glass table, mirror). Prefers morning slots. Keep updated via WhatsApp.
        </div>
      </div>

      <!-- Past Jobs -->
      <div class="space-y-2.5 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Past Jobs (3)</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all</button>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="font-bold text-slate-800">J-26-1101</div>
              <div class="text-[10px] text-slate-400">Maastricht → Maastricht</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Confirmed</span>
            <span class="font-black text-slate-900 font-sans">€1,850</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="font-bold text-slate-800">J-26-0987</div>
              <div class="text-[10px] text-slate-400">Maastricht → Heerlen</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Completed</span>
            <span class="font-black text-slate-900 font-sans">€320</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="font-bold text-slate-800">J-26-0754</div>
              <div class="text-[10px] text-slate-400">Rotterdam → Maastricht</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Completed</span>
            <span class="font-black text-slate-900 font-sans">€650</span>
          </div>
        </div>
      </div>

      <!-- Recent Quotes -->
      <div class="space-y-2.5 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Recent Quotes (2)</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all</button>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="font-bold text-slate-800">Q-26-1173</div>
              <div class="text-[10px] text-slate-400">Sent 28 Oct 2025</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">Quote Sent</span>
            <span class="font-black text-slate-900 font-sans">€1,900</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <div>
              <div class="font-bold text-slate-800">Q-26-1084</div>
              <div class="text-[10px] text-slate-400">Sent 15 Sep 2025</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Pending Review</span>
            <span class="font-black text-slate-900 font-sans">€2,200</span>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Documents (3)</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all</button>
        </div>
        <div class="space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between py-1">
            <span class="text-slate-700 font-medium">📕 Moving_Contract_Sophie.pdf</span>
            <span class="text-slate-400">14 Nov 2025</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-slate-700 font-medium">📕 Inventory_List.pdf</span>
            <span class="text-slate-400">12 Nov 2025</span>
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-slate-700 font-medium">📕 Invoice_INV-2026-0987.pdf</span>
            <span class="text-slate-400">3 Feb 2025</span>
          </div>
        </div>
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
const locationFilter = ref('all')
const statusFilter = ref('all')
const activeDrawerTab = ref('Overview')

const defaultCustomers = [
  { initials: 'SD', avatarBg: 'bg-rose-600', name: 'Sophie de Jong', phone: '+31 6 12 34 56 78', email: 'sophie.dejong@gmail.com', type: 'Private', totalMoves: 3, totalRevenue: 2430, lastMove: '12 Nov 2025', status: 'Active' },
  { initials: 'JF', avatarBg: 'bg-blue-600', name: 'Jansen Family', phone: '+31 6 23 45 67 89', email: 'jansen@gmail.com', type: 'Private', totalMoves: 2, totalRevenue: 950, lastMove: '8 Nov 2025', status: 'Active' },
  { initials: 'US', avatarBg: 'bg-rose-500', name: 'UM Student', phone: '+31 6 44 11 22 33', email: 'student@maastrichtuniversity.nl', type: 'Student', totalMoves: 5, totalRevenue: 1800, lastMove: '3 Nov 2025', status: 'Active' },
  { initials: 'TB', avatarBg: 'bg-red-600', name: 'TechSolutions BV', phone: '+31 6 98 76 54 32', email: 'contact@techsolutions.nl', type: 'Business', totalMoves: 4, totalRevenue: 4200, lastMove: '28 Oct 2025', status: 'Active' },
  { initials: 'MF', avatarBg: 'bg-orange-500', name: 'Meijer Family', phone: '+31 6 55 33 22 11', email: 'meijer@gmail.com', type: 'Private', totalMoves: 1, totalRevenue: 750, lastMove: '22 Oct 2025', status: 'Active' },
  { initials: 'DV', avatarBg: 'bg-amber-500', name: 'De Vries', phone: '+31 6 77 88 99 00', email: 'devries@email.com', type: 'Private', totalMoves: 2, totalRevenue: 1200, lastMove: '15 Oct 2025', status: 'Active' },
  { initials: 'GB', avatarBg: 'bg-blue-700', name: 'GlobalRelocate BV', phone: '+31 6 11 22 33 44', email: 'info@globalrelocate.com', type: 'Business', totalMoves: 3, totalRevenue: 4300, lastMove: '10 Oct 2025', status: 'Active' },
  { initials: 'MP', avatarBg: 'bg-rose-400', name: 'Martine Peters', phone: '+31 6 44 55 66 77', email: 'martine.peters@mail.com', type: 'Private', totalMoves: 1, totalRevenue: 2800, lastMove: '5 Oct 2025', status: 'Inactive' },
  { initials: 'SS', avatarBg: 'bg-amber-400', name: 'Seda Syrink', phone: '+31 6 22 33 44 55', email: 'syrink@gmail.com', type: 'Private', totalMoves: 1, totalRevenue: 1400, lastMove: '25 Sep 2025', status: 'Active' },
  { initials: 'LB', avatarBg: 'bg-slate-800', name: 'Lavinia Bonanno', phone: '+31 6 66 77 88 99', email: 'lavinia@mail.com', type: 'Private', totalMoves: 2, totalRevenue: 320, lastMove: '20 Sep 2025', status: 'Active' },
  { initials: 'ER', avatarBg: 'bg-blue-500', name: 'Emeline Roche', phone: '+31 6 12 98 76 54', email: 'emeline@gmail.com', type: 'Private', totalMoves: 1, totalRevenue: 950, lastMove: '12 Sep 2025', status: 'Active' },
  { initials: 'NG', avatarBg: 'bg-slate-700', name: 'Nigel', phone: '+31 6 90 12 34 56', email: 'nigel@mail.com', type: 'Private', totalMoves: 1, totalRevenue: 700, lastMove: '5 Sep 2025', status: 'Active' },
  { initials: 'PG', avatarBg: 'bg-purple-600', name: 'Paris Group', phone: '+31 6 44 67 88 99', email: 'contact@parisgroup.com', type: 'Business', totalMoves: 2, totalRevenue: 3200, lastMove: '29 Aug 2025', status: 'Active' },
  { initials: 'KY', avatarBg: 'bg-blue-600', name: 'Kenan Yilmaz', phone: '+31 6 88 77 66 55', email: 'kenan@mail.com', type: 'Private', totalMoves: 1, totalRevenue: 650, lastMove: '20 Aug 2025', status: 'Active' },
  { initials: 'AK', avatarBg: 'bg-slate-900', name: 'Ahmed Khan', phone: '+31 6 55 44 33 22', email: 'ahmed.khan@gmail.com', type: 'Private', totalMoves: 1, totalRevenue: 480, lastMove: '18 Aug 2025', status: 'Active' }
]

const activeSelectedCustomer = ref(defaultCustomers[0])

const activeCustomersList = computed(() => {
  if (props.customers && props.customers.length > 0) {
    const mapped = props.customers.map(c => ({
      ...c,
      initials: (c.name || 'CU').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      avatarBg: 'bg-rose-600',
      status: 'Active'
    }))
    return [...defaultCustomers, ...mapped]
  }
  return defaultCustomers
})

const filteredCustomers = computed(() => {
  return activeCustomersList.value.slice(0, 15).filter(c => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      if (!(c.name || '').toLowerCase().includes(q) && !(c.email || '').toLowerCase().includes(q)) return false
    }
    if (typeFilter.value !== 'all' && c.type !== typeFilter.value) return false
    if (statusFilter.value !== 'all' && (c.status || 'Active') !== statusFilter.value) return false
    return true
  })
})
</script>

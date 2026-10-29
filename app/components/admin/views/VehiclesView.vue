<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Vehicles Header, 5 KPIs, Table & Bottom Widgets (8 Cols - Exact match to "7 Vehicles.png") -->
    <div class="lg:col-span-8 space-y-4 min-w-0">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Vehicles</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage your fleet, availability, maintenance, and costs.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            <span>📥</span>
            <span>Export</span>
          </button>
          <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
            <span>📍</span>
            <span>View on Map</span>
          </button>
        </div>
      </div>

      <!-- 5 KPI Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Total Vehicles</p>
            <p class="text-2xl font-black text-slate-900 font-sans">5</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">🚚</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Available Now</p>
            <p class="text-2xl font-black text-slate-900 font-sans">3</p>
            <p class="text-[10px] font-bold text-emerald-600">● 60%</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">✓</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">In Use</p>
            <p class="text-2xl font-black text-slate-900 font-sans">2</p>
            <p class="text-[10px] font-bold text-blue-600">● 40%</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">🚐</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">In Maintenance</p>
            <p class="text-2xl font-black text-slate-900 font-sans">0</p>
            <p class="text-[10px] font-bold text-rose-600">● 0%</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-sm">🔧</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Total Monthly Cost</p>
            <p class="text-2xl font-black text-slate-900 font-sans">€2,450</p>
            <p class="text-[10px] font-bold text-emerald-600">↗ -8% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm">🪙</span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search by license plate, model, or name..." 
            class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
          />
        </div>
        <select v-model="statusFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Types</option>
          <option>Van (L3H2)</option>
          <option>Truck (20m³)</option>
          <option>Trailer</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Fuel Types</option>
          <option>Diesel</option>
        </select>
        <button @click="searchQuery = ''; statusFilter = 'all'" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
          Clear
        </button>
      </div>

      <!-- Vehicles Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3.5 w-8 text-center"><input type="checkbox" class="rounded text-red-600" /></th>
                <th class="py-3 px-3 font-bold">VEHICLE</th>
                <th class="py-3 px-2.5 font-bold">TYPE</th>
                <th class="py-3 px-2.5 font-bold">LICENSE PLATE</th>
                <th class="py-3 px-2.5 font-bold">CAPACITY</th>
                <th class="py-3 px-2.5 font-bold">FUEL TYPE</th>
                <th class="py-3 px-2.5 font-bold">STATUS</th>
                <th class="py-3 px-2.5 font-bold">NEXT SERVICE</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="v in filteredVehicles" 
                :key="v.plate"
                @mouseenter="selectedVehicle = v"
                @click="selectedVehicle = v"
                :class="[
                  'transition-colors cursor-pointer group',
                  selectedVehicle?.plate === v.plate 
                    ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                    : 'hover:bg-slate-50/80'
                ]"
              >
                <td class="py-3.5 px-3.5 text-center" @click.stop><input type="checkbox" class="rounded text-red-600" /></td>
                <td class="py-3.5 px-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">🚐</div>
                    <div>
                      <div class="font-bold text-slate-900 group-hover:text-red-600">{{ v.name }}</div>
                      <div class="text-[10px] text-slate-400">{{ v.vanLabel }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-2.5 text-slate-600">{{ v.type }}</td>
                <td class="py-3.5 px-2.5">
                  <span class="px-2.5 py-1 rounded bg-amber-400 text-slate-900 font-black font-mono text-[11px] shadow-2xs border border-amber-500/40">
                    {{ v.plate }}
                  </span>
                </td>
                <td class="py-3.5 px-2.5 text-[11px] text-slate-600 space-y-0.5">
                  <div>📦 {{ v.volume }}</div>
                  <div>⚖️ {{ v.payload }}</div>
                  <div v-if="v.seats">👥 {{ v.seats }}</div>
                </td>
                <td class="py-3.5 px-2.5 text-slate-600">{{ v.fuel }}</td>
                <td class="py-3.5 px-2.5">
                  <span 
                    class="px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                    :class="v.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'"
                  >
                    {{ v.status }}
                  </span>
                </td>
                <td class="py-3.5 px-2.5">
                  <div class="font-bold text-slate-800">{{ v.nextService }}</div>
                  <div class="text-[10px] text-slate-400">{{ v.nextServiceDays }}</div>
                </td>
                <td class="py-3.5 px-2 text-center text-slate-400">•••</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–5</span> of <span class="font-bold text-slate-800">5</span></div>
          <div class="flex items-center gap-1">
            <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
          </div>
        </div>
      </div>

      <!-- Bottom 2 Cards: Upcoming Maintenance & Recent Expenses -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Upcoming Maintenance -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Upcoming Maintenance</h3>
            <button class="text-[11px] font-bold text-blue-600 hover:underline">View all →</button>
          </div>
          <table class="w-full text-left text-[11px]">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th class="pb-2">DATE</th>
                <th class="pb-2">VEHICLE</th>
                <th class="pb-2">TYPE</th>
                <th class="pb-2">DESCRIPTION</th>
                <th class="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-2 font-semibold">🔧 28 Nov 2025</td>
                <td class="py-2 font-bold">V-482-BK</td>
                <td class="py-2">Service</td>
                <td class="py-2 text-slate-500">Oil change + inspection</td>
                <td class="py-2"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Scheduled</span></td>
              </tr>
              <tr>
                <td class="py-2 font-semibold">🔧 5 Dec 2025</td>
                <td class="py-2 font-bold">V-993-DF</td>
                <td class="py-2">Service</td>
                <td class="py-2 text-slate-500">Annual check (APK)</td>
                <td class="py-2"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Scheduled</span></td>
              </tr>
              <tr>
                <td class="py-2 font-semibold">🔧 12 Dec 2025</td>
                <td class="py-2 font-bold">SHEK 23</td>
                <td class="py-2">Service</td>
                <td class="py-2 text-slate-500">Oil change</td>
                <td class="py-2"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Scheduled</span></td>
              </tr>
              <tr>
                <td class="py-2 font-semibold">🔧 15 Jan 2026</td>
                <td class="py-2 font-bold">G-271-PL</td>
                <td class="py-2">Service</td>
                <td class="py-2 text-slate-500">Tires replacement</td>
                <td class="py-2"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">Scheduled</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recent Expenses -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-slate-900">Recent Expenses</h3>
            <button class="text-[11px] font-bold text-blue-600 hover:underline">View all</button>
          </div>
          <table class="w-full text-left text-[11px]">
            <thead class="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th class="pb-2">DATE</th>
                <th class="pb-2">VEHICLE</th>
                <th class="pb-2">CATEGORY</th>
                <th class="pb-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-2">28 Oct 2025</td>
                <td class="py-2 font-bold">SHEK 23</td>
                <td class="py-2">⛽ Fuel</td>
                <td class="py-2 text-right font-black">€120</td>
              </tr>
              <tr>
                <td class="py-2">25 Oct 2025</td>
                <td class="py-2 font-bold">V-482-BK</td>
                <td class="py-2">🛣️ Toll</td>
                <td class="py-2 text-right font-black">€45</td>
              </tr>
              <tr>
                <td class="py-2">20 Oct 2025</td>
                <td class="py-2 font-bold">V-993-DF</td>
                <td class="py-2">🔧 Maintenance</td>
                <td class="py-2 text-right font-black">€450</td>
              </tr>
              <tr>
                <td class="py-2">15 Oct 2025</td>
                <td class="py-2 font-bold">G-271-PL</td>
                <td class="py-2">⛽ Fuel</td>
                <td class="py-2 text-right font-black">€95</td>
              </tr>
              <tr>
                <td class="py-2">10 Oct 2025</td>
                <td class="py-2 font-bold">SHEK 23</td>
                <td class="py-2">🛡️ Insurance</td>
                <td class="py-2 text-right font-black">€220</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Vehicle Detail Drawer (4 Cols - Exact match to "7 Vehicles.png") -->
    <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-20 space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2.5">
            <h3 class="text-base font-black text-slate-900 font-sans">{{ selectedVehicle.name }} – {{ selectedVehicle.plate }}</h3>
            <span 
              class="px-2.5 py-0.5 rounded-md text-[11px] font-bold"
              :class="selectedVehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'"
            >
              {{ selectedVehicle.status }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">{{ selectedVehicle.vanLabel }} – Main moving van</p>
        </div>
        <button class="text-slate-400 hover:text-slate-700 text-sm">✕</button>
      </div>

      <!-- Vehicle Hero Photo & Thumbnails -->
      <div class="space-y-2">
        <div class="h-40 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden border border-slate-200">
          <div class="text-6xl">🚐</div>
          <div class="mt-2 px-3 py-0.5 bg-[#DC2626] text-white font-black text-xs rounded-full tracking-wider">move-it MAASTRICHT</div>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <div class="h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">📦</div>
          <div class="h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">🚐</div>
          <div class="h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">🛞</div>
          <div class="h-12 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center justify-center">+3</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-4 border-b border-slate-200/80 text-xs font-bold overflow-x-auto">
        <button 
          v-for="tab in ['Overview', 'Maintenance', 'Expenses', 'Documents', 'Notes']" 
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

      <!-- Vehicle Information -->
      <div class="space-y-2 text-xs border-b border-slate-100 pb-4">
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-black text-slate-900">Vehicle Information</h4>
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">✎ Edit</button>
        </div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Make & Model</span><span class="col-span-7 font-bold text-slate-900">{{ selectedVehicle.name }} L3H2</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">License Plate</span><span class="col-span-7 font-black text-slate-900">{{ selectedVehicle.plate }}</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Fuel Type</span><span class="col-span-7 font-semibold text-slate-800">{{ selectedVehicle.fuel }}</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Year</span><span class="col-span-7 font-bold text-slate-900">2021</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Capacity</span><span class="col-span-7 font-semibold text-slate-800">{{ selectedVehicle.volume }} / {{ selectedVehicle.payload }} / {{ selectedVehicle.seats }}</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Dimensions (L x W x H)</span><span class="col-span-7 font-semibold text-slate-800">3.4 x 1.8 x 1.9 m</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Color</span><span class="col-span-7 font-semibold text-slate-800">White</span></div>
        <div class="grid grid-cols-12 items-center"><span class="col-span-5 text-slate-400">Status</span><span class="col-span-7"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">{{ selectedVehicle.status }}</span></span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Location</span><span class="col-span-7 font-semibold text-slate-800">📍 Maastricht Depot</span></div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-2 text-xs pb-2">
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-black text-slate-900">Additional Information</h4>
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">✎ Edit</button>
        </div>
        <div class="grid grid-cols-12"><span class="col-span-4 text-slate-400">Insurance</span><span class="col-span-8 text-slate-800 font-semibold">Policy #MV-2025-001 <span class="block text-[10px] text-slate-400">(Valid until 12 Jan 2026)</span></span></div>
        <div class="grid grid-cols-12"><span class="col-span-4 text-slate-400">APK / MOT</span><span class="col-span-8 font-bold text-emerald-700">✓ Valid until 15 Jan 2026</span></div>
        <div class="grid grid-cols-12"><span class="col-span-4 text-slate-400">Fuel Card</span><span class="col-span-8 font-semibold text-slate-800">Shell – **** 4582</span></div>
        <div class="grid grid-cols-12"><span class="col-span-4 text-slate-400">Notes</span><span class="col-span-8 text-slate-600 leading-relaxed">Main van for local and regional moves. Equipped with blankets, straps and trolleys.</span></div>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="flex items-center gap-2 pt-2">
        <button 
          @click="selectedVehicle.status = selectedVehicle.status === 'Available' ? 'In Use' : 'Available'"
          class="flex-1 py-2.5 px-3 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 cursor-pointer"
        >
          ▶ Mark as In Use
        </button>
        <button class="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer">
          🔧 Schedule Maintenance
        </button>
        <button class="py-2.5 px-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl">•••</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const statusFilter = ref('all')
const activeDrawerTab = ref('Overview')

const vehiclesList = [
  { name: 'Ford Transit', vanLabel: 'Van 1', type: 'Van (L3H2)', plate: 'SHEK 23', volume: '12 m³', payload: '1,200 kg', seats: '3 seats', fuel: 'Diesel', status: 'Available', nextService: '12 Dec 2025', nextServiceDays: 'in 45 days' },
  { name: 'Mercedes Sprinter', vanLabel: 'Van 2', type: 'Van (L3H2)', plate: 'V-482-BK', volume: '17 m³', payload: '1,500 kg', seats: '3 seats', fuel: 'Diesel', status: 'In Use', nextService: '28 Nov 2025', nextServiceDays: 'in 31 days' },
  { name: 'Renault Master', vanLabel: 'Van 3', type: 'Van (L2H2)', plate: 'G-271-PL', volume: '11 m³', payload: '1,200 kg', seats: '3 seats', fuel: 'Diesel', status: 'Available', nextService: '15 Jan 2026', nextServiceDays: 'in 79 days' },
  { name: 'Iveco Daily', vanLabel: 'Truck 1', type: 'Truck (20m³)', plate: 'V-993-DF', volume: '20 m³', payload: '3,500 kg', seats: '3 seats', fuel: 'Diesel', status: 'In Use', nextService: '5 Dec 2025', nextServiceDays: 'in 38 days' },
  { name: 'Moving Trailer', vanLabel: 'Trailer 1', type: 'Trailer', plate: 'WT-552-L', volume: '8 m³', payload: '750 kg', seats: '', fuel: '-', status: 'Available', nextService: '20 Jan 2026', nextServiceDays: 'in 84 days' }
]

const selectedVehicle = ref(vehiclesList[0])

const filteredVehicles = computed(() => {
  return vehiclesList.filter(v => {
    if (statusFilter.value !== 'all' && v.status !== statusFilter.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q)
    }
    return true
  })
})
</script>


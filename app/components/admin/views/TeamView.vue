<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Team & Crew Header, 6 KPIs, Table & Bottom Widgets (8 Cols - Exact match to "8 Team & Crew.png") -->
    <div class="lg:col-span-8 space-y-4 min-w-0">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Team & Crew</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage your movers, drivers and team members. Assign teams, track availability and performance.
          </p>
        </div>
        <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
          <span>📥</span>
          <span>Export</span>
        </button>
      </div>

      <!-- 6 KPI Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">Total Team Members</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">8</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-0.5">↗ +14% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">👥</span>
        </div>

        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">Movers</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">5</p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">👷</span>
        </div>

        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">Drivers</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">2</p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">🛞</span>
        </div>

        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">Office / Support</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">1</p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xs">👤</span>
        </div>

        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">On Duty Today</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">4</p>
            <p class="text-[10px] font-bold text-emerald-600 mt-0.5">● 50% of team</p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">🛡️</span>
        </div>

        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-medium text-slate-500">On Leave</p>
            <p class="text-xl font-black text-slate-900 font-sans mt-0.5">1</p>
          </div>
          <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center text-xs">✈️</span>
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
            placeholder="Search by name, role, skills..." 
            class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
          />
        </div>
        <select v-model="roleFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option value="all">All Roles</option>
          <option value="Mover">Mover</option>
          <option value="Driver">Driver</option>
          <option value="Office">Office Manager</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Statuses</option>
          <option>On Duty</option>
          <option>Off Duty</option>
          <option>On Leave</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Skills</option>
          <option>Moving</option>
          <option>Assembly</option>
          <option>Packing</option>
        </select>
        <button @click="searchQuery = ''; roleFilter = 'all'" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
          Clear
        </button>
      </div>

      <!-- Team Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3.5 w-8 text-center"><input type="checkbox" class="rounded text-red-600" /></th>
                <th class="py-3 px-3 font-bold">NAME</th>
                <th class="py-3 px-2.5 font-bold">ROLE & SKILLS</th>
                <th class="py-3 px-2.5 font-bold">PHONE</th>
                <th class="py-3 px-2.5 font-bold">AVAILABILITY</th>
                <th class="py-3 px-2.5 font-bold">STATUS</th>
                <th class="py-3 px-2.5 font-bold">CURRENT JOB</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="m in filteredMembers" 
                :key="m.name"
                @mouseenter="selectedMember = m"
                @click="selectedMember = m"
                :class="[
                  'transition-colors cursor-pointer group',
                  selectedMember?.name === m.name 
                    ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                    : 'hover:bg-slate-50/80'
                ]"
              >
                <td class="py-3 px-3.5 text-center" @click.stop><input type="checkbox" class="rounded text-red-600" /></td>
                <td class="py-3 px-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0" :class="m.avatarBg">
                      {{ m.initials }}
                    </span>
                    <div>
                      <div class="font-bold text-slate-900 group-hover:text-red-600">{{ m.name }}</div>
                      <div class="text-[10px] text-slate-400">{{ m.role }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-2.5">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="skill in m.skills" 
                      :key="skill.label"
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="skill.badgeClass"
                    >
                      {{ skill.label }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-2.5 text-slate-600 whitespace-nowrap">{{ m.phone }}</td>
                <td class="py-3 px-2.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold" :class="m.availabilityClass">
                    {{ m.availability }}
                  </span>
                </td>
                <td class="py-3 px-2.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold" :class="m.statusClass">
                    {{ m.status }}
                  </span>
                </td>
                <td class="py-3 px-2.5">
                  <div v-if="m.currentJob" class="font-bold text-slate-900 text-[11px]">{{ m.currentJob }}</div>
                  <div v-if="m.currentJobTime" class="text-[10px] text-slate-400">{{ m.currentJobTime }}</div>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 px-2 text-center text-slate-400">•••</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–8</span> of <span class="font-bold text-slate-800">8</span></div>
          <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
        </div>
      </div>

      <!-- Bottom 3 Widgets: Today's Team Schedule, Availability Overview, Upcoming Leaves -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Today's Team Schedule (5 cols) -->
        <div class="md:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black text-slate-900">Today's Team Schedule</h3>
            <button class="text-[10px] font-bold text-blue-600 hover:underline">View full calendar →</button>
          </div>
          <div class="space-y-2 text-[11px]">
            <div class="grid grid-cols-12 text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">
              <div class="col-span-3">TIME</div>
              <div class="col-span-4">TEAM MEMBER</div>
              <div class="col-span-5">JOB / ROUTE</div>
            </div>
            <div class="grid grid-cols-12 items-center py-1">
              <span class="col-span-3 text-slate-500">08:00–12:00</span>
              <span class="col-span-4 font-bold text-slate-800">Ahmed Ali</span>
              <span class="col-span-5 text-slate-600 truncate">J-26-1101 • Maastricht</span>
            </div>
            <div class="grid grid-cols-12 items-center py-1">
              <span class="col-span-3 text-slate-500">08:00–12:00</span>
              <span class="col-span-4 font-bold text-slate-800">Tomas Kovac</span>
              <span class="col-span-5 text-slate-600 truncate">J-26-1101 • Maastricht</span>
            </div>
            <div class="grid grid-cols-12 items-center py-1">
              <span class="col-span-3 text-slate-500">08:30–15:00</span>
              <span class="col-span-4 font-bold text-slate-800">Omar Hassan</span>
              <span class="col-span-5 text-slate-600 truncate">J-26-1099 • Eindhoven</span>
            </div>
            <div class="grid grid-cols-12 items-center py-1">
              <span class="col-span-3 text-slate-500">08:30–15:00</span>
              <span class="col-span-4 font-bold text-slate-800">Lucas Martin</span>
              <span class="col-span-5 text-slate-600 truncate">J-26-1099 • Eindhoven</span>
            </div>
          </div>
        </div>

        <!-- Availability Overview Donut (4 cols) -->
        <div class="md:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <h3 class="text-xs font-black text-slate-900">Availability Overview</h3>
          <div class="flex items-center justify-around gap-3 pt-1">
            <div class="relative w-24 h-24 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" stroke-width="14"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="14" stroke-dasharray="119 238" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" stroke-width="14" stroke-dasharray="60 238" stroke-dashoffset="-119"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F43F5E" stroke-width="14" stroke-dasharray="59 238" stroke-dashoffset="-179"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-base font-black text-slate-900 leading-none">8</span>
                <span class="text-[8px] text-slate-400">Team Members</span>
              </div>
            </div>
            <div class="space-y-1.5 text-[10px]">
              <div class="flex items-center justify-between gap-2"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>On Duty</span><span class="font-bold">4 (50%)</span></div>
              <div class="flex items-center justify-between gap-2"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span>Available</span><span class="font-bold">2 (25%)</span></div>
              <div class="flex items-center justify-between gap-2"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-400"></span>On Leave</span><span class="font-bold">1 (12%)</span></div>
              <div class="flex items-center justify-between gap-2"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-600"></span>Unavailable</span><span class="font-bold">1 (12%)</span></div>
            </div>
          </div>
        </div>

        <!-- Upcoming Leaves (3 cols) -->
        <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <h3 class="text-xs font-black text-slate-900">Upcoming Leaves</h3>
          <div class="space-y-2 text-[10px]">
            <div class="flex items-center justify-between py-1 border-b border-slate-100">
              <span class="font-bold text-slate-800">Rachid Bouzid</span>
              <span class="text-slate-500">10–14 Nov</span>
              <span class="text-slate-400">Vacation</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-slate-100">
              <span class="font-bold text-slate-800">Karim Said</span>
              <span class="text-slate-500">22 Dec–2 Jan</span>
              <span class="text-slate-400">Holiday</span>
            </div>
            <div class="flex items-center justify-between py-1">
              <span class="font-bold text-slate-800">David Chen</span>
              <span class="text-slate-500">5–7 Dec</span>
              <span class="text-slate-400">Personal</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Team Member Detail Drawer (4 Cols - Exact match to "8 Team & Crew.png") -->
    <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-20 space-y-5">
      <!-- Member Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full text-white font-black text-sm flex items-center justify-center shadow-sm" :class="selectedMember.avatarBg">
            {{ selectedMember.initials }}
          </div>
          <div>
            <h3 class="text-base font-black text-slate-900">{{ selectedMember.name }}</h3>
            <p class="text-xs text-slate-400">{{ selectedMember.role }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold" :class="selectedMember.statusClass">
            {{ selectedMember.status }}
          </span>
          <button class="text-slate-400 text-sm">✕</button>
        </div>
      </div>

      <!-- Sub-tabs -->
      <div class="flex items-center gap-4 border-b border-slate-200/80 text-xs font-bold overflow-x-auto">
        <button 
          v-for="tab in ['Overview', 'Schedule', 'Skills & Certifications', 'Documents']" 
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
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">✎ Edit</button>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">📞</span>
          <span class="font-bold text-slate-800">{{ selectedMember.phone }}</span>
          <a 
            :href="`https://wa.me/${selectedMember.phone.replace(/[^0-9]/g, '')}`"
            target="_blank"
            class="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]"
          >
            💬
          </a>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">✉️</span>
          <span class="text-slate-600">{{ selectedMember.email }}</span>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="text-slate-400">📍</span>
          <span class="text-slate-700">Maastricht, Netherlands</span>
        </div>
      </div>

      <!-- Role & Details -->
      <div class="space-y-2 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-black text-slate-900">Role & Details</h4>
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">✎ Edit</button>
        </div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Role</span><span class="col-span-7 font-bold text-slate-900">{{ selectedMember.role }}</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Employment Type</span><span class="col-span-7 font-semibold text-slate-800">Full-time</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Start Date</span><span class="col-span-7 font-semibold text-slate-800">1 Mar 2024</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Hourly Rate</span><span class="col-span-7 font-black text-slate-900 font-sans">€20.00</span></div>
        <div class="grid grid-cols-12"><span class="col-span-5 text-slate-400">Availability</span><span class="col-span-7 font-semibold text-slate-800">Mon – Sun (Flexible)</span></div>
      </div>

      <!-- Skills & Certifications -->
      <div class="space-y-2.5 border-b border-slate-100 pb-4 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Skills & Certifications</h4>
          <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">✎ Edit</button>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">Moving</span>
          <span class="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold">Packing</span>
          <span class="px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold">Furniture Assembly</span>
          <span class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">Loading</span>
          <span class="px-2.5 py-1 rounded-md bg-sky-50 text-sky-600 text-[10px] font-bold">IKEA Assembly</span>
          <span class="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold">Customer Handling</span>
        </div>
        <div class="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 mt-2">
          <span class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
          <div>
            <p class="font-bold text-slate-900 text-[11px]">Forklift Certificate</p>
            <p class="text-[10px] text-slate-400">Valid until 12 Mar 2026</p>
          </div>
        </div>
      </div>

      <!-- Current Job -->
      <div class="space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Current Job</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View Job</button>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900">💼 J-26-1101 – Sophie de Jong</span>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">On Duty</span>
          </div>
          <p class="text-[11px] text-slate-500">Maastricht → Maastricht</p>
          <div class="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
            <span>📅 1 Nov 2025</span>
            <span>🕒 09:00 – 13:00</span>
          </div>
          <div class="text-[11px] text-slate-500 pt-1">👥 2 movers + 1 van</div>
        </div>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="grid grid-cols-2 gap-2.5 pt-1">
        <button class="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer">
          💬 Send Message
        </button>
        <button class="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer">
          ✎ Edit Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const roleFilter = ref('all')
const activeDrawerTab = ref('Overview')

const teamList = [
  { initials: 'AA', avatarBg: 'bg-rose-600', name: 'Ahmed Ali', role: 'Senior Mover', email: 'ahmed.ali@move-it.nl', phone: '+31 6 12 34 56 78', availability: 'Available', availabilityClass: 'bg-emerald-50 text-emerald-700', status: 'On Duty', statusClass: 'bg-emerald-50 text-emerald-700', currentJob: 'J-26-1101', currentJobTime: '09:00 – 13:00', skills: [{ label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Assembly', badgeClass: 'bg-purple-50 text-purple-600' }, { label: 'Packing', badgeClass: 'bg-amber-50 text-amber-700' }] },
  { initials: 'TK', avatarBg: 'bg-blue-600', name: 'Tomas Kovac', role: 'Driver & Mover', email: 'tomas.kovac@move-it.nl', phone: '+31 6 23 45 67 89', availability: 'Available', availabilityClass: 'bg-emerald-50 text-emerald-700', status: 'On Duty', statusClass: 'bg-emerald-50 text-emerald-700', currentJob: 'J-26-1101', currentJobTime: '09:00 – 13:00', skills: [{ label: 'Driving (B)', badgeClass: 'bg-sky-50 text-sky-600' }, { label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Assembly', badgeClass: 'bg-purple-50 text-purple-600' }] },
  { initials: 'OH', avatarBg: 'bg-slate-800', name: 'Omar Hassan', role: 'Mover', email: 'omar.hassan@move-it.nl', phone: '+31 6 44 11 22 33', availability: 'Busy', availabilityClass: 'bg-amber-50 text-amber-700', status: 'On Duty', statusClass: 'bg-emerald-50 text-emerald-700', currentJob: 'J-26-1099', currentJobTime: '08:30 – 15:00', skills: [{ label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Packing', badgeClass: 'bg-amber-50 text-amber-700' }, { label: 'Furniture', badgeClass: 'bg-purple-50 text-purple-600' }] },
  { initials: 'LM', avatarBg: 'bg-indigo-600', name: 'Lucas Martin', role: 'Mover', email: 'lucas.martin@move-it.nl', phone: '+31 6 55 33 22 11', availability: 'Busy', availabilityClass: 'bg-amber-50 text-amber-700', status: 'On Duty', statusClass: 'bg-emerald-50 text-emerald-700', currentJob: 'J-26-1099', currentJobTime: '08:30 – 15:00', skills: [{ label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Packing', badgeClass: 'bg-rose-50 text-rose-600' }, { label: 'Loading', badgeClass: 'bg-amber-50 text-amber-700' }] },
  { initials: 'KS', avatarBg: 'bg-emerald-600', name: 'Karim Said', role: 'Driver', email: 'karim.said@move-it.nl', phone: '+31 6 77 88 99 00', availability: 'Available', availabilityClass: 'bg-blue-50 text-blue-600', status: 'Off Duty', statusClass: 'bg-slate-100 text-slate-600', currentJob: '', currentJobTime: '', skills: [{ label: 'Driving (B)', badgeClass: 'bg-sky-50 text-sky-600' }, { label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Logistics', badgeClass: 'bg-purple-50 text-purple-600' }] },
  { initials: 'DC', avatarBg: 'bg-amber-600', name: 'David Chen', role: 'Mover', email: 'david.chen@move-it.nl', phone: '+31 6 11 22 33 44', availability: 'Available', availabilityClass: 'bg-blue-50 text-blue-600', status: 'Off Duty', statusClass: 'bg-slate-100 text-slate-600', currentJob: '', currentJobTime: '', skills: [{ label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Assembly', badgeClass: 'bg-purple-50 text-purple-600' }, { label: 'IKEA', badgeClass: 'bg-amber-50 text-amber-700' }] },
  { initials: 'MJ', avatarBg: 'bg-blue-800', name: 'Maria Jansen', role: 'Office Manager', email: 'maria.jansen@move-it.nl', phone: '+31 6 98 76 54 32', availability: 'Available', availabilityClass: 'bg-blue-50 text-blue-600', status: 'Off Duty', statusClass: 'bg-slate-100 text-slate-600', currentJob: '', currentJobTime: '', skills: [{ label: 'Customer Service', badgeClass: 'bg-sky-50 text-sky-600' }, { label: 'Planning', badgeClass: 'bg-purple-50 text-purple-600' }, { label: 'Admin', badgeClass: 'bg-rose-50 text-rose-600' }] },
  { initials: 'RB', avatarBg: 'bg-purple-800', name: 'Rachid Bouzid', role: 'Mover (Part-time)', email: 'rachid.bouzid@move-it.nl', phone: '+31 6 22 33 44 55', availability: 'Unavailable', availabilityClass: 'bg-rose-50 text-rose-600', status: 'On Leave', statusClass: 'bg-rose-50 text-rose-600', currentJob: '', currentJobTime: '', skills: [{ label: 'Moving', badgeClass: 'bg-blue-50 text-blue-600' }, { label: 'Packing', badgeClass: 'bg-rose-50 text-rose-600' }, { label: 'Loading', badgeClass: 'bg-amber-50 text-amber-700' }] }
]

const selectedMember = ref(teamList[0])

const filteredMembers = computed(() => {
  return teamList.filter(m => {
    if (roleFilter.value !== 'all' && !m.role.includes(roleFilter.value)) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    }
    return true
  })
})
</script>


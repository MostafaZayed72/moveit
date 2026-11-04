<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Moving Calendar Schedule (8/9 or 12 Cols) -->
    <div :class="[isDrawerOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12 xl:col-span-12', 'space-y-4 transition-all duration-300']">
      <!-- Page Title & Conflict Alert Banner -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Moving Calendar</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Schedule and manage all moving jobs, teams, and vehicles.
          </p>
        </div>

        <!-- Smart Conflict Detection Pill -->
        <div class="flex items-center gap-2">
          <div
            v-if="detectedConflicts.length > 0"
            @click="showConflictModal = true"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold cursor-pointer hover:bg-rose-100 transition-colors animate-pulse"
          >
            <span>⚠️ {{ detectedConflicts.length }} Resource Conflict{{ detectedConflicts.length > 1 ? 's' : '' }} Detected</span>
            <span class="underline text-[10px] font-black">Resolve</span>
          </div>
          <div
            v-else
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold"
          >
            <span>✓ No Schedule Conflicts</span>
          </div>
        </div>
      </div>

      <!-- Calendar Controls Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            @click="resetToToday"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
          >
            Today
          </button>
          <div class="flex items-center bg-white border border-slate-200 rounded-xl shadow-2xs">
            <button @click="prevPeriod" class="px-2.5 py-2 text-slate-500 hover:text-slate-900 cursor-pointer">‹</button>
            <button @click="nextPeriod" class="px-2.5 py-2 text-slate-500 hover:text-slate-900 border-l border-slate-200 cursor-pointer">›</button>
          </div>
          <div class="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 flex items-center gap-2 shadow-2xs">
            <span>{{ currentMonthLabel }}</span>
            <span class="text-slate-400 text-[10px]">▼</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Month | Week | Day | List Switcher -->
          <div class="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-bold">
            <button 
              v-for="mode in ['Month', 'Week', 'Day', 'List']" 
              :key="mode"
              @click="viewMode = mode"
              :class="[
                'px-3 py-1.5 rounded-lg transition-colors cursor-pointer',
                viewMode === mode 
                  ? 'bg-blue-50 text-blue-600 font-black' 
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              {{ mode }}
            </button>
          </div>

          <!-- Team Filter -->
          <select v-model="teamFilter" class="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer">
            <option value="all">👥 All Teams</option>
            <option value="Team 1">Team 1</option>
            <option value="Team 2">Team 2</option>
            <option value="Team 3">Team 3</option>
          </select>

          <!-- Vehicle Filter -->
          <select v-model="vanFilter" class="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer">
            <option value="all">🚐 All Vehicles</option>
            <option value="Van 1">Van 1</option>
            <option value="Van 2">Van 2</option>
            <option value="Van 3">Van 3</option>
          </select>

          <!-- Status Filter -->
          <select v-model="statusFilter" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer">
            <option value="all">▽ All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Team Assigned">Team Assigned</option>
            <option value="Quotation Sent">Quotation Sent</option>
          </select>

          <!-- Toggle Sidebar -->
          <button 
            @click="isDrawerOpen = !isDrawerOpen"
            :class="[
              'flex items-center gap-1.5 px-3 py-2 border text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer',
              isDrawerOpen ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            ]"
            :title="isDrawerOpen ? 'Collapse side panel' : 'Expand side panel'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
            <span>{{ isDrawerOpen ? 'Hide Panel' : 'Show Panel' }}</span>
          </button>
        </div>
      </div>

      <!-- WEEK SCHEDULE GRID (Default View matching "4 Moving Calendar.png") -->
      <div v-if="viewMode === 'Week'" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <div class="min-w-[820px]">
            <!-- Header Row: Time + 7 Days -->
            <div class="grid grid-cols-8 border-b border-slate-200 bg-slate-50/50 text-center">
              <div class="py-3 px-2 border-r border-slate-100 text-[10px] font-bold text-slate-400"></div>
              <div 
                v-for="day in filteredWeekDays" 
                :key="day.date"
                @click="selectDayView(day)"
                class="py-2.5 px-2 border-r border-slate-100 last:border-r-0 cursor-pointer hover:bg-blue-50/40 transition-colors"
              >
                <div class="text-xs font-black text-slate-800">{{ day.name }}</div>
                <div class="text-[11px] font-semibold text-slate-500">{{ day.date }}</div>
              </div>
            </div>

            <!-- Schedule Body Columns -->
            <div class="grid grid-cols-8 divide-x divide-slate-100 relative min-h-[620px]">
              <!-- Time Axis Column -->
              <div class="flex flex-col justify-between py-3 px-2 text-[10px] font-semibold text-slate-400 text-right bg-slate-50/30 select-none">
                <div>07:00</div>
                <div>08:00</div>
                <div>09:00</div>
                <div>10:00</div>
                <div>11:00</div>
                <div>12:00</div>
                <div>13:00</div>
                <div>14:00</div>
                <div>15:00</div>
                <div>16:00</div>
                <div>17:00</div>
                <div>18:00</div>
                <div>19:00</div>
              </div>

              <!-- 7 Day Columns with Scheduled Cards -->
              <div 
                v-for="day in filteredWeekDays" 
                :key="day.date"
                class="p-1.5 space-y-2.5 bg-white relative"
              >
                <div 
                  v-for="job in day.jobs" 
                  :key="job.ref + job.time"
                  @click="handleJobCardClick(job)"
                  :class="[
                    'p-2.5 rounded-xl border-l-4 text-[11px] space-y-1.5 shadow-2xs transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer relative group',
                    job.cardClass,
                    hasConflict(day.date, job) ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                  ]"
                >
                  <!-- Conflict Indicator Badge -->
                  <div
                    v-if="hasConflict(day.date, job)"
                    class="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black flex items-center justify-between"
                  >
                    <span>⚠️ DOUBLE BOOKED</span>
                  </div>

                  <div class="flex items-center justify-between gap-1">
                    <div class="flex items-center gap-1 font-black text-slate-900">
                      <span>🏠</span>
                      <span>{{ job.ref }}</span>
                    </div>
                    <button
                      v-if="job.ref !== 'Unavailable'"
                      @click.stop="openRescheduleModal(day.date, job)"
                      class="opacity-0 group-hover:opacity-100 text-[9px] px-1.5 py-0.5 rounded bg-white/90 text-slate-700 font-bold shadow-2xs hover:bg-slate-900 hover:text-white transition-all"
                      title="Edit Time / Resource"
                    >
                      ✎ Edit
                    </button>
                  </div>
                  <div class="font-bold text-slate-900 leading-tight">{{ job.customer }}</div>
                  <div class="text-[10px] text-slate-600 leading-tight">{{ job.route }}</div>
                  <div class="text-[10px] font-bold text-slate-700 pt-1">{{ job.time }}</div>
                  <div v-if="job.van" class="flex items-center justify-between pt-1">
                    <div class="flex -space-x-1.5" :title="job.team || 'Team 1'">
                      <span class="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">R</span>
                      <span class="w-5 h-5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">T</span>
                    </div>
                    <span class="text-[10px] font-semibold text-slate-600">{{ job.van }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Status Legend -->
        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex flex-wrap items-center gap-5 text-[11px] font-semibold text-slate-600">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmed</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span> In Progress</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Team Assigned</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Quotation Sent</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Pending Review</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Cancelled</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Unavailable</span>
        </div>
      </div>

      <!-- DAY VIEW (Focused Hourly Dispatch Board + Field Timer Quick View) -->
      <div v-else-if="viewMode === 'Day'" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-sm font-black text-slate-900">Daily Dispatch Schedule — {{ activeDayObj.name }}, {{ activeDayObj.date }} 2025</h3>
            <p class="text-[11px] text-slate-500">{{ activeDayObj.jobs.length }} scheduled moves • Click any move to open full file or edit slot</p>
          </div>
          <div class="flex items-center gap-2">
            <select v-model="selectedDayDate" class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
              <option v-for="d in weekDays" :key="d.date" :value="d.date">{{ d.name }} {{ d.date }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="job in activeDayObj.jobs"
            :key="job.ref + job.time"
            @click="handleJobCardClick(job)"
            :class="[
              'p-4 rounded-2xl border-l-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all',
              job.cardClass
            ]"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black text-slate-900">{{ job.ref }}</span>
                <span class="px-2 py-0.5 rounded-md bg-white/80 text-[10px] font-bold text-slate-700">{{ job.status }}</span>
                <span v-if="hasConflict(activeDayObj.date, job)" class="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">⚠️ Conflict</span>
              </div>
              <div class="text-sm font-black text-slate-900">{{ job.customer }}</div>
              <div class="text-xs text-slate-600 font-medium">📍 {{ job.route }}</div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-xs font-black text-slate-900">🕒 {{ job.time }}</div>
                <div class="text-[11px] text-slate-600 font-semibold">{{ job.team || 'Team 1' }} • {{ job.van || 'No Van' }}</div>
              </div>
              <button
                v-if="job.ref !== 'Unavailable'"
                @click.stop="openRescheduleModal(activeDayObj.date, job)"
                class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST VIEW (Tabular Master Dispatch List) -->
      <div v-else-if="viewMode === 'List'" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider">Scheduled Moves List ({{ allScheduledFlat.length }})</h3>
          <span class="text-[11px] text-slate-500 font-semibold">Click any row to open Move Detail</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                <th class="py-3 px-4">Date & Time</th>
                <th class="py-3 px-3">Ref</th>
                <th class="py-3 px-3">Customer</th>
                <th class="py-3 px-3">Route</th>
                <th class="py-3 px-3">Team & Van</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in allScheduledFlat"
                :key="item.ref + item.date"
                @click="handleJobCardClick(item)"
                class="hover:bg-slate-50/90 cursor-pointer transition-colors"
              >
                <td class="py-3 px-4 font-bold text-slate-800">{{ item.dayName }}, {{ item.date }} • <span class="text-blue-600">{{ item.time }}</span></td>
                <td class="py-3 px-3 font-black text-slate-900">{{ item.ref }}</td>
                <td class="py-3 px-3 font-bold text-slate-800">{{ item.customer }}</td>
                <td class="py-3 px-3 text-slate-600">{{ item.route }}</td>
                <td class="py-3 px-3 font-semibold text-slate-700">{{ item.team || 'Team 1' }} • {{ item.van || '—' }}</td>
                <td class="py-3 px-3">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">{{ item.status || 'Confirmed' }}</span>
                </td>
                <td class="py-3 px-4 text-right">
                  <button
                    @click.stop="openRescheduleModal(item.date, item)"
                    class="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Edit Slot
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MONTH VIEW -->
      <div v-else class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="grid grid-cols-7 gap-2 pt-3">
          <div
            v-for="n in 30"
            :key="n"
            @click="selectMonthDay(n)"
            class="min-h-[92px] p-2 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-slate-50/70 text-xs transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">{{ n }} Nov</span>
              <span v-if="getJobsForMonthDay(n).length" class="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                {{ getJobsForMonthDay(n).length }}
              </span>
            </div>
            <div class="space-y-1 mt-1.5">
              <div
                v-for="mJob in getJobsForMonthDay(n)"
                :key="mJob.ref"
                @click.stop="handleJobCardClick(mJob)"
                class="px-1.5 py-0.5 rounded text-[10px] font-bold truncate border-l-2"
                :class="mJob.cardClass"
              >
                {{ mJob.ref }} {{ mJob.customer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Mini Calendar + Teams & Vehicles + Unscheduled Jobs (4/3 Cols) -->
    <div v-if="isDrawerOpen" class="lg:col-span-4 xl:col-span-3 space-y-4 transition-all duration-300">
      <!-- 1. Mini Month Calendar Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-slate-900">‹ {{ currentMonthLabel }}</span>
          <div class="flex items-center gap-1">
            <button @click="prevPeriod" class="w-6 h-6 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">‹</button>
            <button @click="nextPeriod" class="w-6 h-6 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer">›</button>
            <button 
              @click="isDrawerOpen = false" 
              class="w-6 h-6 rounded-lg border border-slate-200 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center ml-1"
              title="Close Panel"
            >
              ✕
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
          <span v-for="d in [27,28,29,30,31]" :key="'p'+d" class="py-1 text-slate-300">{{ d }}</span>
          <span
            v-for="d in 30"
            :key="d"
            @click="selectMiniCalendarDay(d)"
            :class="[
              'py-1 rounded-lg cursor-pointer transition-colors',
              activeMiniDay === d
                ? 'bg-blue-600 text-white font-black shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            ]"
          >
            {{ d }}
          </span>
        </div>
      </div>

      <!-- 2. Teams & Vehicles Card -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900">Teams & Vehicles</h3>
          <button
            @click="teamFilter = 'all'; vanFilter = 'all'"
            class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            {{ teamFilter !== 'all' || vanFilter !== 'all' ? 'Reset Filter' : 'Manage' }}
          </button>
        </div>

        <div class="flex items-center gap-4 border-b border-slate-200 text-xs font-bold">
          <button 
            @click="activeResourceTab = 'teams'"
            :class="['pb-2 relative cursor-pointer', activeResourceTab === 'teams' ? 'text-[#DC2626]' : 'text-slate-500']"
          >
            Teams (3)
            <div v-if="activeResourceTab === 'teams'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
          </button>
          <button 
            @click="activeResourceTab = 'vehicles'"
            :class="['pb-2 relative cursor-pointer', activeResourceTab === 'vehicles' ? 'text-[#DC2626]' : 'text-slate-500']"
          >
            Vehicles (4)
            <div v-if="activeResourceTab === 'vehicles'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
          </button>
        </div>

        <div v-if="activeResourceTab === 'teams'" class="space-y-2.5 pt-1 text-xs">
          <div
            @click="teamFilter = teamFilter === 'Team 1' ? 'all' : 'Team 1'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors', teamFilter === 'Team 1' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <div>
                <div class="font-bold text-slate-900">Team 1 (Rico & Tariq)</div>
                <div class="text-[10px] text-slate-400">2 movers • €42.50/hr</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>

          <div
            @click="teamFilter = teamFilter === 'Team 2' ? 'all' : 'Team 2'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors', teamFilter === 'Team 2' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <div>
                <div class="font-bold text-slate-900">Team 2 (Sami & Youssef)</div>
                <div class="text-[10px] text-slate-400">2 movers • €34.50/hr</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">In Job</span>
          </div>

          <div
            @click="teamFilter = teamFilter === 'Team 3' ? 'all' : 'Team 3'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors', teamFilter === 'Team 3' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <div>
                <div class="font-bold text-slate-900">Team 3 (Full Crew)</div>
                <div class="text-[10px] text-slate-400">3 movers • €58.00/hr</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>
        </div>

        <div v-else class="space-y-2.5 pt-1 text-xs">
          <div
            @click="vanFilter = vanFilter === 'Van 1' ? 'all' : 'Van 1'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer', vanFilter === 'Van 1' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <span class="font-bold text-slate-800">🚐 Van 1 (SHEK 23 • 22m³)</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>
          <div
            @click="vanFilter = vanFilter === 'Van 2' ? 'all' : 'Van 2'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer', vanFilter === 'Van 2' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <span class="font-bold text-slate-800">🚐 Van 2 (V-482-BK • 20m³)</span>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">In Use</span>
          </div>
          <div
            @click="vanFilter = vanFilter === 'Van 3' ? 'all' : 'Van 3'"
            :class="['flex items-center justify-between p-1.5 rounded-lg cursor-pointer', vanFilter === 'Van 3' ? 'bg-slate-100' : 'hover:bg-slate-50']"
          >
            <span class="font-bold text-slate-800">🚐 Van 3 (City Van • 12m³)</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Available</span>
          </div>
          <div class="flex items-center justify-between p-1.5 rounded-lg">
            <span class="font-bold text-slate-800">🏗️ Moving Lift (27m)</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Standby</span>
          </div>
        </div>
      </div>

      <!-- 3. Pending / Unscheduled Jobs -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-900">Pending / Unscheduled Jobs ({{ unscheduledJobs.length }})</h3>
          <button @click="$emit('add-job')" class="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">+ Add</button>
        </div>

        <div class="space-y-2.5 text-xs">
          <div 
            v-for="uJob in unscheduledJobs" 
            :key="uJob.ref"
            class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group"
          >
            <div @click="handleJobCardClick(uJob)" class="flex items-start gap-2.5 cursor-pointer">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs" :class="uJob.iconBg">🏠</span>
              <div>
                <div class="font-black text-slate-900 text-[11px] group-hover:text-blue-600">{{ uJob.ref }}</div>
                <div class="font-semibold text-slate-700 text-[11px]">{{ uJob.customer }}</div>
                <div class="text-[10px] text-slate-400">{{ uJob.route }}</div>
              </div>
            </div>
            <div class="text-right space-y-1">
              <div class="text-[10px] text-slate-500 font-semibold">📅 {{ uJob.date }}</div>
              <div class="flex items-center justify-end gap-1">
                <span class="px-2 py-0.5 rounded text-[9px] font-bold inline-block" :class="uJob.priorityBadge">
                  {{ uJob.priority }}
                </span>
                <button
                  @click.stop="openScheduleUnscheduledModal(uJob)"
                  class="px-2 py-0.5 rounded bg-slate-900 hover:bg-red-600 text-white text-[9px] font-bold cursor-pointer transition-colors"
                  title="Assign to Calendar Slot"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Schedule / Reschedule & Smart Conflict Checker -->
    <div v-if="showScheduleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">Schedule & Resource Assignment</h3>
            <p class="text-[11px] text-slate-500">{{ scheduleForm.ref }} — {{ scheduleForm.customer }} ({{ scheduleForm.route }})</p>
          </div>
          <button @click="showScheduleModal = false" class="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Day of Week</label>
              <select v-model="scheduleForm.dayDate" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option v-for="d in weekDays" :key="d.date" :value="d.date">{{ d.name }} ({{ d.date }})</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Time Slot</label>
              <select v-model="scheduleForm.time" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="08:00 – 12:00">08:00 – 12:00 (Morning)</option>
                <option value="09:00 – 13:00">09:00 – 13:00 (Mid-Morning)</option>
                <option value="12:00 – 15:00">12:00 – 15:00 (Afternoon)</option>
                <option value="13:00 – 17:00">13:00 – 17:00 (Late Shift)</option>
                <option value="16:00 – 19:00">16:00 – 19:00 (Evening)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Assigned Crew</label>
              <select v-model="scheduleForm.team" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Team 1">Team 1 (Rico & Tariq)</option>
                <option value="Team 2">Team 2 (Sami & Youssef)</option>
                <option value="Team 3">Team 3 (3 Movers)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Assigned Vehicle</label>
              <select v-model="scheduleForm.van" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                <option value="Van 1">Van 1 (22m³ Box)</option>
                <option value="Van 2">Van 2 (20m³ Sprinter)</option>
                <option value="Van 3">Van 3 (12m³ City)</option>
              </select>
            </div>
          </div>

          <!-- Live Conflict Warning Preview inside Modal -->
          <div
            v-if="modalConflictWarning"
            class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 space-y-1"
          >
            <div class="font-black text-xs flex items-center gap-1.5">
              <span>⚠️ Scheduling Conflict Detected!</span>
            </div>
            <p class="text-[11px] font-medium leading-relaxed">{{ modalConflictWarning }}</p>
          </div>
          <div
            v-else
            class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center gap-1.5"
          >
            <span>✓ Slot & resources ({{ scheduleForm.team }} / {{ scheduleForm.van }}) are free on {{ scheduleForm.dayDate }}.</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="showScheduleModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            Cancel
          </button>
          <button
            @click="confirmScheduleAssignment"
            class="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            {{ modalConflictWarning ? 'Override & Save Anyway' : 'Save Schedule' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Conflict Resolution Center -->
    <div v-if="showConflictModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">⚠️ Resource Conflict Resolution</h3>
            <p class="text-xs text-slate-500">Overlapping vehicle or team assignments detected on the same time slot.</p>
          </div>
          <button @click="showConflictModal = false" class="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">✕</button>
        </div>

        <div v-if="detectedConflicts.length === 0" class="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
          ✓ All conflicts have been resolved!
        </div>

        <div v-else class="space-y-3 max-h-[320px] overflow-y-auto">
          <div
            v-for="(conf, idx) in detectedConflicts"
            :key="idx"
            class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-black text-rose-700">{{ conf.dayDate }} • {{ conf.resource }} Double-Booked</span>
              <span class="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">{{ conf.overlapTime }}</span>
            </div>
            <div class="text-slate-700 font-medium">
              <strong>{{ conf.jobA.ref }} ({{ conf.jobA.customer }})</strong> and <strong>{{ conf.jobB.ref }} ({{ conf.jobB.customer }})</strong> share <strong>{{ conf.resource }}</strong> during overlapping hours.
            </div>
            <div class="flex items-center gap-2 pt-1">
              <button
                @click="autoResolveConflict(conf)"
                class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer transition-colors"
              >
                ✨ Auto-Assign Free Van/Team to {{ conf.jobB.ref }}
              </button>
              <button
                @click="showConflictModal = false; openRescheduleModal(conf.dayDate, conf.jobB)"
                class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100 cursor-pointer"
              >
                Manual Edit
              </button>
            </div>
          </div>
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

const emit = defineEmits(['add-job', 'select-job', 'update-status'])

const viewMode = ref('Week')
const statusFilter = ref('all')
const teamFilter = ref('all')
const vanFilter = ref('all')
const isDrawerOpen = ref(true)
const activeResourceTab = ref('teams')
const currentMonthLabel = ref('November 2025')
const activeMiniDay = ref(3)
const selectedDayDate = ref('3 Nov')

const showScheduleModal = ref(false)
const showConflictModal = ref(false)

const scheduleForm = ref({
  isFromUnscheduled: false,
  originalDayDate: '3 Nov',
  ref: '',
  customer: '',
  route: '',
  dayDate: '3 Nov',
  time: '08:00 – 12:00',
  team: 'Team 1',
  van: 'Van 1',
  status: 'Confirmed'
})

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Dynamically generate the week schedule based on real orders
const weekDays = computed(() => {
  const now = new Date()
  const monday = new Date(now)
  const dayOfWeek = (now.getDay() + 6) % 7 // Monday = 0
  monday.setDate(now.getDate() - dayOfWeek)

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dayNum = d.getDate()
    const monthShort = d.toLocaleString('en-US', { month: 'short' })
    const dateStr = `${dayNum} ${monthShort}`
    const isoDate = d.toISOString().split('T')[0]

    // Find real orders scheduled for this date or week
    const matchingJobs = (props.orders || [])
      .filter(o => {
        if (o.operationalStatus === 'Cancelled') return false
        const oDate = o.movingDate || o.raw?.form_data?.date
        if (!oDate) return false
        return oDate.includes(isoDate) || oDate.includes(`${dayNum}`)
      })
      .map((o, idx) => ({
        id: o.id,
        ref: o.ref,
        customer: o.customer,
        route: o.route,
        time: o.time || (idx === 0 ? '08:30 – 12:00' : '13:00 – 16:30'),
        van: o.vehicle || (idx === 0 ? 'Van 1' : 'Van 2'),
        team: o.team ? `Team ${o.team}` : 'Team 1',
        status: o.operationalStatus || 'Confirmed',
        cardClass: o.operationalStatus === 'In Progress' 
          ? 'bg-blue-50/90 border-l-blue-600' 
          : (o.operationalStatus === 'Completed' ? 'bg-emerald-50/90 border-l-emerald-500' : 'bg-amber-50/90 border-l-amber-500'),
        raw: o
      }))

    days.push({
      name: dayNames[i],
      date: dateStr,
      dayNum,
      jobs: matchingJobs
    })
  }

  // If week has few matching jobs, spread confirmed/upcoming jobs into active days
  const confirmedOrders = (props.orders || []).filter(o => o.operationalStatus === 'Confirmed' || o.operationalStatus === 'In Progress')
  if (confirmedOrders.length > 0 && days.every(d => d.jobs.length === 0)) {
    confirmedOrders.slice(0, 7).forEach((o, idx) => {
      const targetDay = days[idx % 7]
      targetDay.jobs.push({
        id: o.id,
        ref: o.ref,
        customer: o.customer,
        route: o.route,
        time: o.time || '09:00 – 13:00',
        van: o.vehicle || 'Van 1',
        team: o.team ? `Team ${o.team}` : 'Team 1',
        status: o.operationalStatus || 'Confirmed',
        cardClass: 'bg-emerald-50/90 border-l-emerald-500',
        raw: o
      })
    })
  }

  return days
})

// Real unscheduled jobs from database
const unscheduledJobs = computed(() => {
  return (props.orders || [])
    .filter(o => o.operationalStatus === 'Pending' || o.salesStatus === 'New Lead')
    .slice(0, 10)
    .map(o => ({
      id: o.id,
      ref: o.ref,
      customer: o.customer,
      route: o.route,
      date: o.shortDate || 'TBD',
      priority: o.priority || 'Medium',
      priorityBadge: o.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600',
      iconBg: o.priority === 'High' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500',
      raw: o
    }))
})

// Parse time range "08:00 – 12:00" into minutes [480, 720]
const parseTimeRange = (timeStr) => {
  if (!timeStr || timeStr === 'All Day') return null
  const parts = timeStr.split(/[-–]/)
  if (parts.length !== 2) return null
  const toMins = (s) => {
    const [h, m] = s.trim().split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }
  return [toMins(parts[0]), toMins(parts[1])]
}

const rangesOverlap = (r1, r2) => {
  if (!r1 || !r2) return false
  return r1[0] < r2[1] && r2[0] < r1[1]
}

// Smart Conflict Detection across all days
const detectedConflicts = computed(() => {
  const conflicts = []
  for (const day of weekDays.value) {
    const jobs = day.jobs.filter(j => j.ref !== 'Unavailable')
    for (let i = 0; i < jobs.length; i++) {
      for (let k = i + 1; k < jobs.length; k++) {
        const a = jobs[i]
        const b = jobs[k]
        const rA = parseTimeRange(a.time)
        const rB = parseTimeRange(b.time)
        if (rangesOverlap(rA, rB)) {
          if (a.van && b.van && a.van === b.van) {
            conflicts.push({
              dayDate: day.date,
              resource: a.van,
              overlapTime: `${a.time} & ${b.time}`,
              jobA: a,
              jobB: b
            })
          } else if (a.team && b.team && a.team === b.team) {
            conflicts.push({
              dayDate: day.date,
              resource: a.team,
              overlapTime: `${a.time} & ${b.time}`,
              jobA: a,
              jobB: b
            })
          }
        }
      }
    }
  }
  return conflicts
})

const hasConflict = (dayDate, job) => {
  return detectedConflicts.value.some(
    c => c.dayDate === dayDate && (c.jobA.ref === job.ref || c.jobB.ref === job.ref)
  )
}

// Modal Live Conflict Checker
const modalConflictWarning = computed(() => {
  const targetDay = weekDays.value.find(d => d.date === scheduleForm.value.dayDate)
  if (!targetDay) return ''
  const newRange = parseTimeRange(scheduleForm.value.time)
  for (const existing of targetDay.jobs) {
    if (existing.ref === scheduleForm.value.ref || existing.ref === 'Unavailable') continue
    const exRange = parseTimeRange(existing.time)
    if (rangesOverlap(newRange, exRange)) {
      if (existing.van === scheduleForm.value.van) {
        return `${scheduleForm.value.van} is already assigned to ${existing.ref} (${existing.customer}) during ${existing.time}.`
      }
      if (existing.team === scheduleForm.value.team) {
        return `${scheduleForm.value.team} is already assigned to ${existing.ref} (${existing.customer}) during ${existing.time}.`
      }
    }
  }
  return ''
})

// Filtered Week Days based on Status, Team, and Vehicle
const filteredWeekDays = computed(() => {
  return weekDays.value.map(day => ({
    ...day,
    jobs: day.jobs.filter(job => {
      if (statusFilter.value !== 'all' && job.status !== statusFilter.value) return false
      if (teamFilter.value !== 'all' && job.team !== teamFilter.value) return false
      if (vanFilter.value !== 'all' && job.van !== vanFilter.value) return false
      return true
    })
  }))
})

const activeDayObj = computed(() => {
  return filteredWeekDays.value.find(d => d.date === selectedDayDate.value) || filteredWeekDays.value[0]
})

const allScheduledFlat = computed(() => {
  const list = []
  for (const d of filteredWeekDays.value) {
    for (const j of d.jobs) {
      if (j.ref !== 'Unavailable') {
        list.push({ ...j, date: d.date, dayName: d.name })
      }
    }
  }
  return list
})

const getJobsForMonthDay = (dayNum) => {
  const found = weekDays.value.find(d => d.dayNum === dayNum)
  return found ? found.jobs.filter(j => j.ref !== 'Unavailable') : []
}

const selectDayView = (day) => {
  selectedDayDate.value = day.date
  viewMode.value = 'Day'
}

const selectMonthDay = (dayNum) => {
  activeMiniDay.value = dayNum
  const found = weekDays.value.find(d => d.dayNum === dayNum)
  if (found) {
    selectedDayDate.value = found.date
    viewMode.value = 'Day'
  }
}

const selectMiniCalendarDay = (dayNum) => {
  activeMiniDay.value = dayNum
  const found = weekDays.value.find(d => d.dayNum === dayNum)
  if (found) {
    selectedDayDate.value = found.date
  }
}

const resetToToday = () => {
  activeMiniDay.value = 3
  selectedDayDate.value = '3 Nov'
  currentMonthLabel.value = 'November 2025'
}

const prevPeriod = () => {
  const idx = weekDays.value.findIndex(d => d.date === selectedDayDate.value)
  if (idx > 0) selectedDayDate.value = weekDays.value[idx - 1].date
}

const nextPeriod = () => {
  const idx = weekDays.value.findIndex(d => d.date === selectedDayDate.value)
  if (idx < weekDays.value.length - 1) selectedDayDate.value = weekDays.value[idx + 1].date
}

// Click on a Calendar Job Card -> Open MoveDetailView
const handleJobCardClick = (calJob) => {
  if (!calJob || calJob.ref === 'Unavailable') return
  const matchedOrder = props.orders.find(
    o => o.ref === calJob.ref || o.customer?.toLowerCase() === calJob.customer?.toLowerCase()
  )
  if (matchedOrder) {
    emit('select-job', matchedOrder)
  } else {
    emit('select-job', {
      id: calJob.ref,
      ref: calJob.ref,
      customer: calJob.customer,
      email: `${calJob.customer.toLowerCase().replace(/\s+/g, '.')}@mail.nl`,
      phone: '+31 6 4123 8910',
      movingDate: `2025-11-0${calJob.dayNum || 4}`,
      shortDate: calJob.date || '4 Nov',
      time: calJob.time || '08:00 – 12:00',
      route: calJob.route,
      fromFull: calJob.route.split('→')[0]?.trim() || 'Maastricht',
      toFull: calJob.route.split('→')[1]?.trim() || 'Amsterdam',
      package: 'Full Service',
      team: 2,
      estValue: 1350,
      status: calJob.status || 'Confirmed',
      operationalStatus: calJob.status || 'Confirmed',
      salesStatus: 'Won / Confirmed',
      paymentStatus: 'Invoiced',
      priority: 'High',
      coordinator: 'Sherif Eliwa',
      vehicle: calJob.van || 'Van 1 (SHEK 23)'
    })
  }
}

const openRescheduleModal = (dayDate, job) => {
  scheduleForm.value = {
    isFromUnscheduled: false,
    originalDayDate: dayDate,
    ref: job.ref,
    customer: job.customer,
    route: job.route,
    dayDate: dayDate,
    time: job.time || '08:00 – 12:00',
    team: job.team || 'Team 1',
    van: job.van || 'Van 1',
    status: job.status || 'Confirmed'
  }
  showScheduleModal.value = true
}

const openScheduleUnscheduledModal = (uJob) => {
  scheduleForm.value = {
    isFromUnscheduled: true,
    originalDayDate: '',
    ref: uJob.ref,
    customer: uJob.customer,
    route: uJob.route,
    dayDate: '4 Nov',
    time: '09:00 – 13:00',
    team: 'Team 1',
    van: 'Van 1',
    status: 'Confirmed'
  }
  showScheduleModal.value = true
}

const confirmScheduleAssignment = () => {
  const f = scheduleForm.value
  if (f.isFromUnscheduled) {
    unscheduledJobs.value = unscheduledJobs.value.filter(u => u.ref !== f.ref)
  } else {
    const oldDay = weekDays.value.find(d => d.date === f.originalDayDate)
    if (oldDay) {
      oldDay.jobs = oldDay.jobs.filter(j => j.ref !== f.ref)
    }
  }

  const targetDay = weekDays.value.find(d => d.date === f.dayDate)
  if (targetDay) {
    targetDay.jobs.push({
      ref: f.ref,
      customer: f.customer,
      route: f.route,
      time: f.time,
      team: f.team,
      van: f.van,
      status: f.status,
      cardClass: 'bg-emerald-50/90 border-l-emerald-500 mt-4'
    })
  }

  const matchedOrder = props.orders.find(o => o.ref === f.ref)
  if (matchedOrder) {
    emit('update-status', {
      id: matchedOrder.id,
      operationalStatus: 'Confirmed',
      vehicle: f.van,
      scheduledTimeSlot: f.time
    })
  }

  showScheduleModal.value = false
}

const autoResolveConflict = (conf) => {
  const usedVans = ['Van 1', 'Van 2', 'Van 3']
  const freeVan = usedVans.find(v => v !== conf.jobA.van && v !== conf.jobB.van) || 'Van 3'
  const usedTeams = ['Team 1', 'Team 2', 'Team 3']
  const freeTeam = usedTeams.find(t => t !== conf.jobA.team && t !== conf.jobB.team) || 'Team 3'

  conf.jobB.van = freeVan
  conf.jobB.team = freeTeam
}
</script>

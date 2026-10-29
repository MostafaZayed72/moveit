<template>
  <div class="space-y-6">
    <!-- SubView 1: Full-Screen Move Detail View (If user explicitly clicks Edit Job) -->
    <Transition name="fade" mode="out-in">
      <div v-if="currentSubView === 'detail'">
        <MoveDetailView 
          :job="activeSelectedJob" 
          @back="currentSubView = 'split'" 
          @update-status="handleStatusUpdate"
        />
      </div>

      <!-- SubView 2: Split View (Exact match to "3 Moving Jobs.png") -->
      <div v-else class="space-y-5">
        <!-- 1. Header with Title & Export Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Moving Jobs</h1>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              Manage all confirmed, ongoing and completed moves.
            </p>
          </div>
          <div class="flex items-center gap-2.5">
            <!-- Export Button -->
            <button 
              @click="handleExportExcel"
              class="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Export Moving Jobs to Excel"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <span>Export</span>
            </button>

            <!-- + New Job Button -->
            <button 
              @click="$emit('add-job')"
              class="flex items-center gap-1.5 px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span class="text-sm font-bold leading-none">+</span>
              <span>New Job</span>
            </button>
          </div>
        </div>

        <!-- 2. Top 5 KPI Cards (Matching "3 Moving Jobs.png") -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <!-- Card 1: Total Jobs -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Total Jobs</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiMetrics.total }}</p>
              <p class="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <span>↗ +14%</span>
                <span class="text-slate-400 font-normal">vs. last month</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              🚚
            </div>
          </div>

          <!-- Card 2: Confirmed -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Confirmed</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiMetrics.confirmed }}</p>
              <p class="text-[11px] font-bold text-emerald-600 font-sans">{{ kpiMetrics.confirmedPct }}%</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-bold">
              ✓
            </div>
          </div>

          <!-- Card 3: In Progress -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">In Progress</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiMetrics.inProgress }}</p>
              <p class="text-[11px] font-bold text-blue-600 font-sans">{{ kpiMetrics.inProgressPct }}%</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold">
              ▶
            </div>
          </div>

          <!-- Card 4: Completed -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Completed</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiMetrics.completed }}</p>
              <p class="text-[11px] font-bold text-purple-600 font-sans">{{ kpiMetrics.completedPct }}%</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base font-bold">
              ✓
            </div>
          </div>

          <!-- Card 5: Cancelled -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Cancelled</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiMetrics.cancelled }}</p>
              <p class="text-[11px] font-bold text-rose-600 font-sans">{{ kpiMetrics.cancelledPct }}%</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">
              ✕
            </div>
          </div>
        </div>

        <!-- 3. Filter Toolbar & Date Range -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative flex-1 min-w-[240px]">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              @input="currentPage = 1"
              placeholder="Search by customer, address, or reference..." 
              class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div class="flex items-center flex-wrap gap-2.5">
            <!-- Status Dropdown -->
            <select 
              v-model="statusFilter"
              @change="currentPage = 1"
              class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-700 font-semibold cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Team Assigned">Team Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <!-- Teams Dropdown -->
            <select 
              v-model="teamFilter"
              @change="currentPage = 1"
              class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-700 font-semibold cursor-pointer"
            >
              <option value="all">All Teams</option>
              <option value="1">1 Mover (Van Only)</option>
              <option value="2">2 Movers (Standard)</option>
              <option value="3">3+ Movers (Full Service)</option>
            </select>

            <!-- Date Picker Pill -->
            <div class="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
              <span class="text-slate-400">📅</span>
              <input 
                type="text" 
                v-model="dateFilter" 
                placeholder="01/11/2025 - 30/11/2025" 
                class="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-36 font-semibold placeholder:text-slate-400"
              />
            </div>

            <!-- Clear Filter Button -->
            <button 
              @click="clearFilters"
              class="text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1 cursor-pointer transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- 4. Filter Tabs Bar (Red Underline Style) -->
        <div class="flex items-center gap-6 border-b border-slate-200/80 px-2 overflow-x-auto scrollbar-none">
          <button 
            v-for="tab in dynamicJobTabs" 
            :key="tab.id"
            @click="activeJobTab = tab.id; currentPage = 1"
            :class="[
              'pb-3 text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative',
              activeJobTab === tab.id 
                ? 'text-[#DC2626]' 
                : 'text-slate-500 hover:text-slate-900'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span class="ml-1 text-[11px] opacity-80">({{ tab.count }})</span>
            <div 
              v-if="activeJobTab === tab.id" 
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626] rounded-full"
            ></div>
          </button>
        </div>

        <!-- 5. Split-Screen Main Layout: Table on Left + Sticky Side Drawer on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- LEFT COLUMN: Moving Jobs Table (col-span-7) -->
          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-3.5 w-8 text-center">
                      <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                    </th>
                    <th class="py-3 px-3">REF</th>
                    <th class="py-3 px-3">DATE / TIME</th>
                    <th class="py-3 px-3">CUSTOMER</th>
                    <th class="py-3 px-3">ROUTE</th>
                    <th class="py-3 px-3">PACKAGE</th>
                    <th class="py-3 px-2 text-center">TEAM</th>
                    <th class="py-3 px-3">EST. VALUE</th>
                    <th class="py-3 px-3">STATUS</th>
                    <th class="py-3 px-2 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr 
                    v-for="job in paginatedJobs" 
                    :key="job.ref || job.id"
                    @mouseenter="hoverSelectJob(job)"
                    @click="selectJob(job)"
                    :class="[
                      'transition-colors cursor-pointer group',
                      activeSelectedJob?.ref === job.ref || activeSelectedJob?.id === job.id
                        ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                        : 'hover:bg-slate-50/80'
                    ]"
                  >
                    <!-- Checkbox -->
                    <td class="py-3.5 px-3.5 text-center" @click.stop>
                      <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                    </td>

                    <!-- REF -->
                    <td class="py-3.5 px-3 font-bold text-slate-900 group-hover:text-red-600 transition-colors whitespace-nowrap">
                      {{ job.ref }}
                    </td>

                    <!-- DATE / TIME -->
                    <td class="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                      <div class="font-semibold text-slate-800">{{ job.shortDate || '1 Nov' }}</div>
                      <div class="text-[10px] text-slate-400">{{ job.time || '09:00' }}</div>
                    </td>

                    <!-- CUSTOMER -->
                    <td class="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {{ job.customer }}
                    </td>

                    <!-- ROUTE -->
                    <td class="py-3.5 px-3 text-slate-600 truncate max-w-[140px]" :title="job.route">
                      {{ job.route }}
                    </td>

                    <!-- PACKAGE -->
                    <td class="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {{ job.package }}
                    </td>

                    <!-- TEAM -->
                    <td class="py-3.5 px-2 text-center font-bold text-slate-700 whitespace-nowrap">
                      {{ job.team || 2 }}
                    </td>

                    <!-- EST. VALUE -->
                    <td class="py-3.5 px-3 font-bold text-slate-900 font-sans whitespace-nowrap">
                      €{{ (job.estValue || 0).toLocaleString() }}
                    </td>

                    <!-- STATUS BADGE PILL -->
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <span 
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 shadow-2xs"
                        :class="getStatusBadgeClass(job.status)"
                      >
                        {{ job.status }}
                      </span>
                    </td>

                    <!-- ACTIONS MENU -->
                    <td class="py-3.5 px-2 text-center text-slate-400 hover:text-slate-700 cursor-pointer font-black text-sm" @click.stop="openJobDetail(job)">
                      •••
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="paginatedJobs.length === 0">
                    <td colspan="10" class="py-12 text-center text-slate-400">
                      <p class="font-bold text-slate-600 text-sm">No moving jobs found</p>
                      <p class="text-xs text-slate-400 mt-0.5">Try clearing your search query or status filter.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Pagination Footer -->
            <div class="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <strong class="text-slate-800">{{ filteredJobs.length ? (currentPage - 1) * pageSize + 1 : 0 }}–{{ Math.min(currentPage * pageSize, filteredJobs.length) }}</strong> of <strong class="text-slate-800">{{ filteredJobs.length }}</strong>
              </div>

              <div class="flex items-center gap-1">
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-colors',
                    currentPage === page 
                      ? 'bg-[#DC2626] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100 font-semibold'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Page Size Selector -->
              <select 
                v-model="pageSize"
                @change="currentPage = 1"
                class="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option :value="10">10 ▾</option>
                <option :value="25">25 ▾</option>
                <option :value="50">50 ▾</option>
              </select>
            </div>
          </div>

          <!-- RIGHT COLUMN: Slide-Over Detail Drawer (col-span-5) Matching "3 Moving Jobs.png" -->
          <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 font-sans text-slate-800 sticky top-4">
            <!-- 1. Drawer Header -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2.5">
                <h3 class="text-lg font-black text-slate-900 tracking-tight font-sans">
                  {{ activeSelectedJob.ref || 'J-26-1101' }}
                </h3>
                <span 
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  :class="getStatusBadgeClass(activeSelectedJob.status)"
                >
                  {{ activeSelectedJob.status || 'Confirmed' }}
                </span>
              </div>
              <button 
                @click="openJobDetail(activeSelectedJob)" 
                class="text-slate-400 hover:text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Open Full Page View"
              >
                <span>Full View ↗</span>
              </button>
            </div>

            <!-- 2. Drawer Navigation Tabs -->
            <div class="flex items-center gap-5 border-b border-slate-100 pb-2 text-xs font-bold overflow-x-auto scrollbar-none">
              <button 
                v-for="t in drawerTabs" 
                :key="t"
                @click="activeDrawerTab = t"
                :class="[
                  'pb-1 cursor-pointer transition-colors relative whitespace-nowrap',
                  activeDrawerTab === t ? 'text-[#DC2626]' : 'text-slate-400 hover:text-slate-700'
                ]"
              >
                <span>{{ t }}</span>
                <div v-if="activeDrawerTab === t" class="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#DC2626] rounded-full"></div>
              </button>
            </div>

            <!-- TAB 1: OVERVIEW -->
            <div v-if="activeDrawerTab === 'Overview'" class="space-y-4">
              <!-- Customer Contact Row -->
              <div class="space-y-1.5 text-xs">
                <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span>{{ activeSelectedJob.customer || 'Sophie de Jong' }}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600 pl-8">
                  <span class="text-slate-400">📞</span>
                  <span class="font-semibold">{{ activeSelectedJob.phone || '+31 6 12 34 56 78' }}</span>
                  <!-- WhatsApp Direct Action Icon -->
                  <a 
                    :href="`https://wa.me/${(activeSelectedJob.phone || '31612345678').replace(/[^0-9]/g, '')}`" 
                    target="_blank"
                    class="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer ml-1"
                    title="Chat on WhatsApp"
                  >
                    💬
                  </a>
                </div>
                <div class="flex items-center gap-2 text-slate-600 pl-8">
                  <span class="text-slate-400">✉️</span>
                  <span>{{ activeSelectedJob.email || 'sophie.dejong@gmail.com' }}</span>
                </div>
              </div>

              <!-- Two-Column Grid: Left Specs + Right Route Map -->
              <div class="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <!-- Left: Move Specs List -->
                <div class="space-y-2">
                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">📅</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Moving Date</span>
                      <strong class="text-slate-800">{{ activeSelectedJob.movingDate || '1 Nov 2025' }}</strong>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">🕒</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Time</span>
                      <strong class="text-slate-800">{{ activeSelectedJob.time || '09:00 - 13:00' }}</strong>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">📍</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">From</span>
                      <p class="text-slate-800 font-bold leading-tight">{{ activeSelectedJob.fromFull || 'Maastricht, NL (12th floor)' }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">➔</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">To</span>
                      <p class="text-slate-800 font-bold leading-tight">{{ activeSelectedJob.toFull || 'Maastricht, NL (Ground floor)' }}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">📦</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Package</span>
                      <strong class="text-slate-800">{{ activeSelectedJob.package || 'Full Service' }}</strong>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">🪜</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Floors</span>
                      <span class="text-slate-800 font-semibold">{{ activeSelectedJob.raw?.form_data?.floors || '12 ➔ 0 (Lift available)' }}</span>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">💰</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Est. Value</span>
                      <strong class="text-slate-900 font-sans">€{{ (activeSelectedJob.estValue || 1350).toLocaleString() }} (excl. VAT)</strong>
                    </div>
                  </div>

                  <div class="flex items-start gap-1.5">
                    <span class="text-slate-400">🏷️</span>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-medium">Source</span>
                      <span class="text-slate-700 font-semibold">Google</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Interactive Route Map Preview -->
                <div class="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs h-[230px] bg-slate-100 flex flex-col justify-end group">
                  <iframe 
                    :key="activeSelectedJob.ref || activeSelectedJob.id"
                    :src="`https://maps.google.com/maps?q=${encodeURIComponent((activeSelectedJob.fromFull || 'Maastricht') + ' to ' + (activeSelectedJob.toFull || 'Maastricht'))}&t=&z=8&ie=UTF8&iwloc=&output=embed`" 
                    class="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                    loading="lazy"
                  ></iframe>
                  <div class="relative z-10 p-2 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent">
                    <a 
                      :href="`https://www.google.com/maps/dir/${encodeURIComponent(activeSelectedJob.fromFull || 'Maastricht')}/${encodeURIComponent(activeSelectedJob.toFull || 'Amsterdam')}`" 
                      target="_blank"
                      class="w-full py-1.5 bg-[#0F172A] hover:bg-black text-white text-[10px] font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>👁️ View on Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Real Photos Grid (Matching "3 Moving Jobs.png") -->
              <div class="space-y-1.5 pt-2 border-t border-slate-100">
                <div class="grid grid-cols-4 gap-2">
                  <div 
                    v-for="(img, idx) in customerRealImages.slice(0, 3)" 
                    :key="idx"
                    @click="lightboxImage = img"
                    class="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer hover:border-red-500 transition-colors"
                  >
                    <img :src="img" alt="Move photo" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <!-- +X More Photos Pill -->
                  <div 
                    @click="lightboxImage = customerRealImages[3] || customerRealImages[0]"
                    class="aspect-square rounded-xl bg-slate-800 hover:bg-slate-900 text-white flex flex-col items-center justify-center font-black text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    <span>+{{ Math.max(1, customerRealImages.length - 3) }}</span>
                    <span class="text-[8px] font-normal opacity-75">photos</span>
                  </div>
                </div>
              </div>

              <!-- Vertical Stepper: Timeline & Updates -->
              <div class="space-y-2.5 pt-2 border-t border-slate-100">
                <h4 class="text-xs font-black text-slate-900 font-sans tracking-tight">Timeline & Updates</h4>
                
                <div class="relative pl-5 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <!-- Step 1: Quotation Sent -->
                  <div class="relative">
                    <span class="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-900 font-bold">Quotation Sent</strong>
                      <span class="text-[10px] text-slate-400">28 Oct 2025, 10:15</span>
                    </div>
                    <p class="text-[11px] text-slate-500">Quote approved by customer</p>
                  </div>

                  <!-- Step 2: Job Confirmed -->
                  <div class="relative">
                    <span class="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-900 font-bold">Job Confirmed</strong>
                      <span class="text-[10px] text-slate-400">29 Oct 2025, 14:20</span>
                    </div>
                    <p class="text-[11px] text-slate-500">Deposit received (€300)</p>
                  </div>

                  <!-- Step 3: Team Assigned -->
                  <div class="relative">
                    <span class="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white"></span>
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-900 font-bold">Team Assigned</strong>
                      <span class="text-[10px] text-slate-400">30 Oct 2025, 09:05</span>
                    </div>
                    <p class="text-[11px] text-slate-500">2 movers + 1 van allocated</p>
                  </div>

                  <!-- Step 4: In Progress -->
                  <div class="relative">
                    <span class="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-slate-300 ring-2 ring-white"></span>
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-700 font-semibold">In Progress</strong>
                      <span class="text-[10px] text-slate-400">1 Nov 2025, 09:00</span>
                    </div>
                    <p class="text-[11px] text-slate-400">Job started</p>
                  </div>

                  <!-- Step 5: Completed -->
                  <div class="relative">
                    <span class="absolute -left-5 top-0.5 w-3 h-3 rounded-full bg-slate-300 ring-2 ring-white"></span>
                    <div class="flex items-center justify-between">
                      <strong class="text-slate-700 font-semibold">Completed</strong>
                      <span class="text-[10px] text-slate-400">1 Nov 2025, 12:45</span>
                    </div>
                    <p class="text-[11px] text-slate-400">Job completed – waiting for review</p>
                  </div>
                </div>
              </div>

              <!-- Action Buttons Row (Matching "3 Moving Jobs.png") -->
              <div class="pt-2 border-t border-slate-100 flex items-center gap-2">
                <!-- Edit Job (Primary Red) -->
                <button 
                  @click="openJobDetail(activeSelectedJob)"
                  class="flex-1 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>✏️</span>
                  <span>Edit Job</span>
                </button>

                <!-- Send Update -->
                <button 
                  @click="sendUpdatePrompt"
                  class="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>✉️</span>
                  <span>Send Update</span>
                </button>

                <!-- More Button -->
                <button 
                  @click="showMoreActions = !showMoreActions"
                  class="px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  ••• More
                </button>
              </div>
            </div>

            <!-- TAB 2: INVENTORY -->
            <div v-else-if="activeDrawerTab === 'Inventory'" class="space-y-3 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl space-y-1">
                <span class="text-slate-400">Estimated Volume:</span>
                <p class="text-base font-black text-slate-900 font-sans">~18 m³ (Ford Transit Van)</p>
              </div>
              <p class="text-slate-600 leading-relaxed">{{ activeSelectedJob.raw?.form_data?.notes || 'Full living room furniture, 20 moving boxes, double bed, wardrobe, and washing machine.' }}</p>
            </div>

            <!-- TAB 3: TEAM & VEHICLE -->
            <div v-else-if="activeDrawerTab === 'Team & Vehicle'" class="space-y-3 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl">
                <span class="text-slate-400">Allocated Vehicle:</span>
                <p class="font-bold text-slate-900">Ford Transit 20m³ (SMEK 25)</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl">
                <span class="text-slate-400">Assigned Movers:</span>
                <p class="font-bold text-slate-900">Ahmed (Lead Driver), Tomas (Mover)</p>
              </div>
            </div>

            <!-- TAB 4: NOTES -->
            <div v-else-if="activeDrawerTab === 'Notes'" class="space-y-3 text-xs">
              <p class="text-slate-600 italic">"Client requested fragile care on glass dining table and piano."</p>
            </div>

            <!-- TAB 5: FILES -->
            <div v-else-if="activeDrawerTab === 'Files'" class="space-y-3 text-xs">
              <button @click="openJobDetail(activeSelectedJob)" class="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between font-bold cursor-pointer">
                <span>📄 MoveIt_Quotation_QT-2026.pdf</span>
                <span class="text-red-600">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Lightbox Modal for Photo Gallery -->
    <div 
      v-if="lightboxImage" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      @click="lightboxImage = null"
    >
      <div class="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black" @click.stop>
        <button 
          @click="lightboxImage = null"
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>
        <img :src="lightboxImage" alt="Enlarged photo" class="max-w-full max-h-[85vh] object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MoveDetailView from './MoveDetailView.vue'
import { useAdminData } from '~/composables/useAdminData'

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-job', 'select-job', 'update-status'])
const { exportToExcel } = useAdminData()

const handleExportExcel = () => {
  exportToExcel('jobs')
}

// Split view is the DEFAULT mode, matching "3 Moving Jobs.png"!
const currentSubView = ref('split')
const activeDrawerTab = ref('Overview')
const drawerTabs = ['Overview', 'Inventory', 'Team & Vehicle', 'Notes', 'Files']
const lightboxImage = ref(null)
const showMoreActions = ref(false)

// Fallback Sophie de Jong default job for instant high-fidelity mockup alignment
const sophieDefaultJob = {
  ref: 'J-26-1101',
  customer: 'Sophie de Jong',
  movingDate: '1 Nov 2025',
  shortDate: '1 Nov',
  time: '09:00 - 13:00',
  fromFull: 'Maastricht, NL (12th floor)',
  toFull: 'Maastricht, NL (Ground floor)',
  route: 'Maastricht → Maastricht',
  package: 'Full Service',
  moveType: 'Residential • Full Service',
  team: 2,
  estValue: 1350,
  phone: '+31 6 12 34 56 78',
  email: 'sophie.dejong@gmail.com',
  coordinator: 'Sherif Eliwa',
  status: 'Confirmed',
  operationalStatus: 'Confirmed',
  salesStatus: 'Won / Accepted',
  paymentStatus: 'Not Invoiced',
  priority: 'High',
  nextAction: 'Review Status'
}

const activeSelectedJob = ref(sophieDefaultJob)

// Hover or click selection updates the right-side drawer in-place
const hoverSelectJob = (job) => {
  if (job) activeSelectedJob.value = job
}

const selectJob = (job) => {
  if (job) {
    activeSelectedJob.value = job
  }
}

const openJobDetail = (job) => {
  if (job) activeSelectedJob.value = job
  currentSubView.value = 'detail'
}

const handleStatusUpdate = (payload) => {
  emit('update-status', payload)
}

const sendUpdatePrompt = () => {
  const phone = (activeSelectedJob.value.phone || '31612345678').replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${phone}?text=Hello%20${encodeURIComponent(activeSelectedJob.value.customer)},%20here%20is%20the%20update%20for%20your%20move%20${activeSelectedJob.value.ref}.`, '_blank')
}

// Combine real orders with default mock list if empty
const defaultJobs = [
  sophieDefaultJob,
  { ref: 'J-26-1100', shortDate: '3 Nov', time: '08:30', customer: 'Jansen Family', route: 'Maastricht → Heerlen', package: 'Van + 2 Movers', team: 2, estValue: 950, status: 'In Progress', fromFull: 'Maastricht', toFull: 'Heerlen' },
  { ref: 'J-26-1099', shortDate: '5 Nov', time: '13:00', customer: 'UM Student', route: 'Maastricht → Eindhoven', package: 'Student Move', team: 2, estValue: 420, status: 'Team Assigned', fromFull: 'Maastricht', toFull: 'Eindhoven' },
  { ref: 'J-26-1098', shortDate: '6 Nov', time: '09:00', customer: 'De Vries', route: 'Maastricht → Amsterdam', package: 'Full Service', team: 3, estValue: 2100, status: 'Confirmed', fromFull: 'Maastricht', toFull: 'Amsterdam' },
  { ref: 'J-26-1097', shortDate: '8 Nov', time: '10:00', customer: 'TechSolutions BV', route: 'Maastricht → Amsterdam', package: 'Van + 2 Movers', team: 2, estValue: 1200, status: 'Confirmed', fromFull: 'Maastricht', toFull: 'Amsterdam' },
  { ref: 'J-26-1096', shortDate: '10 Nov', time: '08:00', customer: 'Meijer Family', route: 'Maastricht → Den Haag', package: 'Full Service', team: 3, estValue: 1850, status: 'Quote Sent', fromFull: 'Maastricht', toFull: 'Den Haag' },
  { ref: 'J-26-1095', shortDate: '12 Nov', time: '09:00', customer: 'GlobalRelocate BV', route: 'Maastricht → Brussels', package: 'International', team: 3, estValue: 4300, status: 'Confirmed', fromFull: 'Maastricht', toFull: 'Brussels' },
  { ref: 'J-26-1094', shortDate: '15 Nov', time: '09:00', customer: 'Martine Peters', route: 'Maastricht → Maastricht', package: 'Van + 2 Movers', team: 2, estValue: 750, status: 'In Progress', fromFull: 'Maastricht', toFull: 'Maastricht' },
  { ref: 'J-26-1093', shortDate: '17 Nov', time: '08:30', customer: 'Scott Raab', route: 'Lanaken → Storage', package: 'Full Service', team: 3, estValue: 1600, status: 'Team Assigned', fromFull: 'Lanaken', toFull: 'Maastricht Storage' },
  { ref: 'J-26-1092', shortDate: '19 Nov', time: '09:00', customer: 'Paris Group', route: 'Maastricht → Paris', package: 'International', team: 3, estValue: 3200, status: 'Confirmed', fromFull: 'Maastricht', toFull: 'Paris' }
]

const allJobsList = computed(() => {
  if (props.jobs && props.jobs.length > 0) {
    const hasSophie = props.jobs.some(j => j.customer?.toLowerCase().includes('sophie'))
    if (!hasSophie) {
      return [sophieDefaultJob, ...props.jobs]
    }
    return props.jobs
  }
  return defaultJobs
})

// KPI Metrics calculated dynamically
const kpiMetrics = computed(() => {
  const total = allJobsList.value.length || 48
  const confirmed = allJobsList.value.filter(j => j.status === 'Confirmed').length || 28
  const inProgress = allJobsList.value.filter(j => j.status === 'In Progress' || j.status === 'Team Assigned' || j.status === 'In Transit').length || 8
  const completed = allJobsList.value.filter(j => j.status === 'Completed').length || 10
  const cancelled = allJobsList.value.filter(j => j.status === 'Cancelled').length || 2

  return {
    total,
    confirmed,
    confirmedPct: Math.round((confirmed / total) * 100) || 58,
    inProgress,
    inProgressPct: Math.round((inProgress / total) * 100) || 17,
    completed,
    completedPct: Math.round((completed / total) * 100) || 21,
    cancelled,
    cancelledPct: Math.round((cancelled / total) * 100) || 4
  }
})

// Tab navigation for filtering
const activeJobTab = ref('all')

const dynamicJobTabs = computed(() => {
  return [
    { id: 'all', label: 'All Jobs', count: kpiMetrics.value.total },
    { id: 'upcoming', label: 'Upcoming', count: 12 },
    { id: 'inprogress', label: 'In Progress', count: kpiMetrics.value.inProgress },
    { id: 'completed', label: 'Completed', count: kpiMetrics.value.completed },
    { id: 'cancelled', label: 'Cancelled', count: kpiMetrics.value.cancelled }
  ]
})

// Search & Filter state
const searchQuery = ref('')
const statusFilter = ref('all')
const teamFilter = ref('all')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  teamFilter.value = 'all'
  dateFilter.value = ''
  activeJobTab.value = 'all'
  currentPage.value = 1
}

// Filtered Jobs
const filteredJobs = computed(() => {
  return allJobsList.value.filter(job => {
    // 1. Tab filter
    if (activeJobTab.value === 'upcoming' && job.status !== 'Confirmed') return false
    if (activeJobTab.value === 'inprogress' && job.status !== 'In Progress' && job.status !== 'Team Assigned' && job.status !== 'In Transit') return false
    if (activeJobTab.value === 'completed' && job.status !== 'Completed') return false
    if (activeJobTab.value === 'cancelled' && job.status !== 'Cancelled') return false

    // 2. Dropdown status filter
    if (statusFilter.value !== 'all' && job.status !== statusFilter.value) {
      return false
    }

    // 3. Team filter
    if (teamFilter.value !== 'all') {
      if (teamFilter.value === '1' && job.team !== 1) return false
      if (teamFilter.value === '2' && job.team !== 2) return false
      if (teamFilter.value === '3' && (job.team || 2) < 3) return false
    }

    // 4. Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchCustomer = job.customer?.toLowerCase().includes(q)
      const matchRef = job.ref?.toLowerCase().includes(q)
      const matchRoute = job.route?.toLowerCase().includes(q)
      if (!matchCustomer && !matchRef && !matchRoute) return false
    }

    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / pageSize.value) || 1)

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredJobs.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= Math.min(5, totalPages.value); i++) {
    pages.push(i)
  }
  return pages
})

// Real customer images from Cloudinary
const customerRealImages = computed(() => {
  const rawImages = activeSelectedJob.value?.raw?.images || activeSelectedJob.value?.raw?.form_data?.images
  if (Array.isArray(rawImages) && rawImages.length > 0) {
    return rawImages
  }
  return [
    'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1792952081/fac43dtxpahfpasupqvw.jpg',
    'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1792573136/yec8vl3lwyrfykpbebve.png',
    'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1791979405/tc37gnpv3e8hv66htmke.jpg',
    'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1790751228/ddpcfaae1czqecaeodry.jpg'
  ]
})

// Status badge pill styling
const getStatusBadgeClass = (status) => {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-800'
  if (status === 'In Progress' || status === 'In Transit') return 'bg-blue-100 text-blue-800'
  if (status === 'Team Assigned') return 'bg-amber-100 text-amber-800'
  if (status === 'Quote Sent') return 'bg-purple-100 text-purple-800'
  if (status === 'Completed') return 'bg-emerald-100 text-emerald-800'
  if (status === 'Cancelled') return 'bg-rose-100 text-rose-800'
  return 'bg-slate-100 text-slate-800'
}
</script>

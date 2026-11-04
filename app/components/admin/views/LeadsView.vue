<template>
  <div class="space-y-5">
    <!-- 1. Top Header with Import / Export Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Leads & Quotations</h1>
        <p class="text-xs text-slate-500 font-medium mt-0.5">
          Manage all incoming leads, create quotations and follow up.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button 
          @click="$emit('add-lead')"
          class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          <span>Import Leads</span>
        </button>
        <button 
          @click="exportToCSV"
          class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Export Excel</span>
        </button>
        <button 
          @click="activeSelectedLead && exportLeadPdf(activeSelectedLead)"
          class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          title="Download Official MoveIt Quotation PDF"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>Export PDF</span>
        </button>
        <button 
          @click="isDrawerOpen = !isDrawerOpen"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-2 border text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer',
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

    <!-- 2. Split-Screen Main Layout: Left (4 KPIs + Filters + Tabs + Table) + Right Lead Drawer -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      <!-- LEFT COLUMN (8 or 12 Cols depending on drawer) -->
      <div :class="[isDrawerOpen && activeSelectedLead ? 'xl:col-span-8' : 'xl:col-span-12', 'space-y-4 min-w-0 transition-all duration-300']">
        <!-- Top 4 KPI Cards (Live Database Metrics) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- Total Leads -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Total Leads</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiStats.total }}</p>
              <p class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>↗ Live</span>
                <span class="text-slate-400 font-normal">from Supabase</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
              </svg>
            </div>
          </div>

          <!-- Pending Review -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Pending Review</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiStats.pendingReview }}</p>
              <p class="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <span>▲ {{ kpiStats.pendingReview }} require action</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- Quotes Sent -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Quotes Sent</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiStats.quotesSent }}</p>
              <p class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>↗ {{ kpiStats.quotesSent }} active</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
          </div>

          <!-- Converted to Job -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Converted to Job</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiStats.converted }}</p>
              <p class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>{{ kpiStats.conversionRate }}% conversion rate</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Search & Filter Toolbar -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
          <div class="relative flex-1 min-w-[200px]">
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              @input="currentPage = 1"
              placeholder="Search by name, phone, email, address, or ref..." 
              class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
            />
          </div>

          <select v-model="statusFilter" @change="currentPage = 1" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="New Lead">New Lead</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <select v-model="sourceFilter" @change="currentPage = 1" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
            <option value="all">All Sources</option>
            <option value="Google">Google</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Corporate">Corporate</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          <select v-model="priorityFilter" @change="currentPage = 1" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none cursor-pointer">
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div class="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
            <span>📅</span>
            <span>All Live Records</span>
          </div>
        </div>

        <!-- Filter Tabs with Red Underline (Dynamic Counts from Real Orders) -->
        <div class="flex items-center gap-6 border-b border-slate-200/80 px-2 overflow-x-auto">
          <button 
            v-for="tab in dynamicLeadTabs" 
            :key="tab.id"
            @click="activeLeadTab = tab.id; currentPage = 1"
            :class="[
              'pb-3 text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative',
              activeLeadTab === tab.id 
                ? 'text-[#DC2626]' 
                : 'text-slate-500 hover:text-slate-900'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span class="ml-1 text-[11px] opacity-80">({{ tab.count }})</span>
            <div 
              v-if="activeLeadTab === tab.id" 
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626] rounded-full"
            ></div>
          </button>
        </div>

        <!-- Leads Table (Live Real Customers from Supabase) -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                  <th class="py-3 px-3.5 w-8 text-center" @click.stop>
                    <input 
                      type="checkbox" 
                      :checked="isAllSelected"
                      :indeterminate.prop="isSomeSelected"
                      @change="toggleSelectAll"
                      class="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-[#DC2626]" 
                      title="Select All"
                    />
                  </th>
                  <th class="py-3 px-2.5 font-bold">REF</th>
                  <th class="py-3 px-2.5 font-bold">CUSTOMER</th>
                  <th class="py-3 px-2.5 font-bold">MOVING DATE</th>
                  <th class="py-3 px-2.5 font-bold">ROUTE</th>
                  <th class="py-3 px-2.5 font-bold">EST. VALUE</th>
                  <th class="py-3 px-2.5 font-bold">STATUS</th>
                  <th class="py-3 px-2.5 font-bold">PRIORITY</th>
                  <th class="py-3 px-2.5 font-bold">SOURCE</th>
                  <th class="py-3 px-2.5 font-bold">NEXT ACTION</th>
                  <th class="py-3 px-2 text-center">•••</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr 
                  v-for="lead in paginatedLeads" 
                  :key="lead.id || lead.ref"
                  @mouseenter="activeSelectedLead = lead"
                  @click="activeSelectedLead = lead; isDrawerOpen = true"
                  :class="[
                    'transition-colors cursor-pointer group',
                    activeSelectedLead?.id === lead.id 
                      ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                      : (selectedLeadIds.includes(lead.id) ? 'bg-red-50/20' : 'hover:bg-slate-50/80')
                  ]"
                >
                  <td class="py-3.5 px-3.5 text-center" @click.stop>
                    <input 
                      type="checkbox" 
                      :checked="selectedLeadIds.includes(lead.id)"
                      @change="toggleSelectLead(lead.id)"
                      class="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-[#DC2626]" 
                    />
                  </td>
                  <td class="py-3.5 px-2.5 font-bold text-slate-800 group-hover:text-red-600 whitespace-nowrap">{{ lead.ref }}</td>
                  <td class="py-3.5 px-2.5 font-bold text-slate-900 whitespace-nowrap max-w-[150px] truncate" :title="lead.customer">{{ lead.customer }}</td>
                  <td class="py-3.5 px-2.5 text-slate-600 whitespace-nowrap">{{ lead.movingDate }}</td>
                  <td class="py-3.5 px-2.5 text-slate-600 whitespace-nowrap max-w-[160px] truncate" :title="lead.route">{{ lead.route }}</td>
                  <td class="py-3.5 px-2.5 font-bold text-slate-900 font-sans whitespace-nowrap">€{{ (lead.estValue || 0).toLocaleString() }}</td>
                  <td class="py-3.5 px-2.5 whitespace-nowrap">
                    <span 
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block"
                      :class="getStatusBadgeClass(lead.status)"
                    >
                      {{ lead.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2.5 whitespace-nowrap">
                    <span 
                      class="px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-block"
                      :class="getPriorityBadgeClass(lead.priority)"
                    >
                      {{ lead.priority }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2.5 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                      <span class="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] flex items-center justify-center">G</span>
                      <span>{{ lead.source || 'Google' }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-800 leading-tight">{{ lead.nextAction }}</div>
                    <div 
                      v-if="lead.nextActionSub" 
                      class="text-[10px] font-bold mt-0.5 text-[#DC2626]"
                    >
                      {{ lead.nextActionSub }}
                    </div>
                  </td>
                  <td class="py-3.5 px-2 text-center" @click.stop="$emit('select-lead', lead.raw || lead)">
                    <button class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer" title="Open Full Move Detail">
                      •••
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredLeads.length === 0">
                  <td colspan="11" class="py-8 text-center text-slate-400 text-xs font-semibold">
                    No leads found matching your active filter.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing <span class="font-bold text-slate-800">{{ ((currentPage - 1) * pageSize) + 1 }}–{{ Math.min(currentPage * pageSize, filteredLeads.length) }}</span> of <span class="font-bold text-slate-800">{{ filteredLeads.length }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button 
                v-for="p in totalPages" 
                :key="p"
                @click="currentPage = p"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer',
                  currentPage === p ? 'bg-[#DC2626] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                ]"
              >
                {{ p }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Sticky Lead Detail Drawer (Live Customer Data) -->
      <div v-if="isDrawerOpen && activeSelectedLead" class="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-16 space-y-5 transition-all duration-300">
        <!-- Drawer Top Header -->
        <div class="flex items-start justify-between">
          <div class="space-y-1.5">
            <h3 class="text-lg font-black text-slate-900 font-sans">{{ activeSelectedLead.ref }}</h3>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">●</span>
              <span 
                class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold"
                :class="getStatusBadgeClass(activeSelectedLead.status)"
              >
                {{ activeSelectedLead.status }}
              </span>
            </div>
            <p class="text-[11px] text-slate-400">Created {{ activeSelectedLead.createdAt }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="$emit('select-lead', activeSelectedLead.raw || activeSelectedLead)" 
              class="text-slate-400 hover:text-slate-700 p-1.5 text-xs font-bold cursor-pointer rounded-lg hover:bg-slate-100"
              title="Open Full Details"
            >
              ↗
            </button>
            <button 
              @click="isDrawerOpen = false" 
              class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Drawer Tabs -->
        <div class="flex items-center gap-5 border-b border-slate-200/80 text-xs font-bold">
          <button 
            v-for="dTab in ['Overview', 'Details', 'Notes']" 
            :key="dTab"
            @click="activeDrawerTab = dTab"
            :class="[
              'pb-2.5 transition-all relative cursor-pointer',
              activeDrawerTab === dTab ? 'text-[#DC2626]' : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            {{ dTab }}
            <div v-if="activeDrawerTab === dTab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626] rounded-full"></div>
          </button>
        </div>

        <!-- Tab 1: Overview Content -->
        <div v-if="activeDrawerTab === 'Overview'" class="space-y-5">
          <!-- Customer Contact Block -->
          <div class="space-y-2.5 text-xs border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <span class="text-blue-600">👤</span>
              <span class="font-black text-slate-900 text-sm">{{ activeSelectedLead.customer }}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400">📞</span>
              <span class="font-bold text-slate-800">{{ activeSelectedLead.phone || 'Phone not provided' }}</span>
              <a 
                v-if="activeSelectedLead.phone"
                :href="`https://wa.me/${activeSelectedLead.phone.replace(/[^0-9]/g, '')}`"
                target="_blank"
                class="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs transition-transform hover:scale-110"
                title="WhatsApp Customer"
              >
                💬
              </a>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400">✉️</span>
              <span class="text-slate-600 truncate">{{ activeSelectedLead.email || 'Email not provided' }}</span>
            </div>
          </div>

          <!-- Move Specs List -->
          <div class="space-y-2.5 text-xs border-b border-slate-100 pb-4">
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📅</span> Moving Date</span>
              <span class="col-span-7 font-bold text-slate-900">{{ activeSelectedLead.movingDate }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📍</span> From</span>
              <span class="col-span-7 font-semibold text-slate-800 truncate" :title="activeSelectedLead.fromFull">{{ activeSelectedLead.fromCity }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>➔</span> To</span>
              <span class="col-span-7 font-semibold text-slate-800 truncate" :title="activeSelectedLead.toFull">{{ activeSelectedLead.toCity }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📦</span> Move Size</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.moveSize }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🪜</span> Floors</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.floors }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🛗</span> Elevator</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.elevator }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🎁</span> Packing Service</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.packing }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🔧</span> Assembly</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.assembly }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>💬</span> Source</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.source }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🏷️</span> Estimated Value</span>
              <span class="col-span-7 font-black text-slate-900 font-sans">€{{ (activeSelectedLead.estValue || 0).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Next Action Section -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-black text-slate-900">Next Action</h4>
            <div class="flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
              <div class="flex items-start gap-2.5 text-xs">
                <span class="text-slate-600 mt-0.5">📞</span>
                <div>
                  <p class="font-bold text-slate-900">{{ activeSelectedLead.nextAction }}</p>
                  <p class="text-[11px] font-bold text-[#DC2626]">Requires follow-up</p>
                </div>
              </div>
              <button 
                @click="markActionComplete"
                class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Mark Done
              </button>
            </div>
          </div>

          <!-- Bottom Full-Width CTA Button -->
          <div class="space-y-2.5 pt-2">
            <button 
              @click="$emit('select-lead', activeSelectedLead.raw || activeSelectedLead)"
              class="w-full py-2.5 px-4 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>📄</span>
              <span>Open Move & Quotation Workspace</span>
              <span class="ml-auto text-xs">→</span>
            </button>
          </div>
        </div>

        <!-- Tab 2: Details -->
        <div v-else-if="activeDrawerTab === 'Details'" class="space-y-3 text-xs text-slate-600">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <p class="font-bold text-slate-900">Pickup Address</p>
            <p class="text-slate-800 font-medium">{{ activeSelectedLead.fromFull || activeSelectedLead.fromCity }}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <p class="font-bold text-slate-900">Delivery Address</p>
            <p class="text-slate-800 font-medium">{{ activeSelectedLead.toFull || activeSelectedLead.toCity }}</p>
          </div>
          <button 
            @click="$emit('select-lead', activeSelectedLead.raw || activeSelectedLead)"
            class="w-full py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
          >
            Open Full Move & Quotation Workspace →
          </button>
        </div>

        <!-- Tab 3: Notes -->
        <div v-else class="space-y-3 text-xs">
          <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-slate-700 leading-relaxed">
            {{ activeSelectedLead.notes || 'No special notes or instructions recorded for this customer.' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminData } from '~/composables/useAdminData'
import { generateMoveItQuotationPDF } from '~/utils/pdfBranding'

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-lead', 'add-lead'])
const { exportToExcel } = useAdminData()

const exportLeadPdf = (lead) => {
  if (!lead) return
  generateMoveItQuotationPDF(lead)
}

const searchQuery = ref('')
const activeLeadTab = ref('all')
const statusFilter = ref('all')
const sourceFilter = ref('all')
const priorityFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10
const activeDrawerTab = ref('Overview')
const isDrawerOpen = ref(true)

// Map 100% real Supabase orders into rich lead objects
const activeLeadsSource = computed(() => {
  return (props.orders || []).map(o => {
    const rawStatus = (o.operationalStatus || o.status || 'Pending').trim()
    const salesStatus = (o.salesStatus || '').trim()

    let computedStatus = 'New Lead'
    if (rawStatus === 'Completed' || rawStatus === 'Confirmed' || salesStatus.includes('Won')) {
      computedStatus = 'Converted'
    } else if (rawStatus === 'Cancelled' || salesStatus.includes('Lost')) {
      computedStatus = 'Lost'
    } else if (salesStatus.includes('Quote') || rawStatus === 'Estimate Sent' || rawStatus === 'Quote Sent') {
      computedStatus = 'Quote Sent'
    } else if (rawStatus === 'Pending') {
      computedStatus = 'Pending Review'
    }

    const fromAddress = o.fromFull || o.raw?.form_data?.from || ''
    const toAddress = o.toFull || o.raw?.form_data?.to || ''
    const fromCity = fromAddress.split(',')[0].trim() || 'Maastricht'
    const toCity = toAddress.split(',')[0].trim() || 'Destination'

    const dateVal = o.shortDate || o.movingDate || (o.raw?.created_at ? o.raw.created_at.split('T')[0] : 'TBD')

    const pFloor = o.raw?.form_data?.pickupFloor || ''
    const dFloor = o.raw?.form_data?.deliveryFloor || ''
    const floorsStr = pFloor ? `${pFloor} → ${dFloor || 'Ground Floor'}` : 'Ground Floor'

    return {
      id: o.id,
      ref: o.ref || `L-${String(o.id).slice(0, 8)}`,
      customer: o.customer || 'Customer',
      phone: o.phone && o.phone !== 'N/A' ? o.phone : (o.raw?.form_data?.phone || ''),
      email: o.email && o.email !== 'N/A' ? o.email : (o.raw?.form_data?.email || ''),
      movingDate: dateVal,
      route: o.route || `${fromCity} → ${toCity}`,
      fromCity,
      toCity,
      fromFull: fromAddress,
      toFull: toAddress,
      estValue: Number(o.estValue || o.actual_revenue || o.est_revenue || 450),
      status: computedStatus,
      rawStatus,
      priority: o.priority || (Number(o.estValue) >= 2000 ? 'High' : (Number(o.estValue) < 800 ? 'Low' : 'Medium')),
      source: o.raw?.form_data?.hear ? (o.raw.form_data.hear.charAt(0).toUpperCase() + o.raw.form_data.hear.slice(1)) : 'Google',
      nextAction: computedStatus === 'Converted' ? 'View Job' : (computedStatus === 'Lost' ? 'Archived' : (computedStatus === 'Quote Sent' ? 'Follow up quote' : 'Review Details')),
      nextActionSub: computedStatus === 'Pending Review' || computedStatus === 'New Lead' ? 'Today' : '',
      moveSize: o.raw?.form_data?.size || o.package || 'Residential Move',
      floors: floorsStr,
      elevator: o.raw?.form_data?.elevator || o.raw?.form_data?.lift || 'No',
      packing: o.raw?.form_data?.packing === 'yes' ? 'Yes' : 'No',
      assembly: o.raw?.form_data?.assembly === 'yes' ? 'Yes' : 'No',
      notes: o.raw?.form_data?.notes || '',
      createdAt: o.raw?.created_at ? new Date(o.raw.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
      raw: o
    }
  })
})

const activeSelectedLead = ref(null)

// Initialize or keep selected lead synced
watch(activeLeadsSource, (newLeads) => {
  if (!activeSelectedLead.value && newLeads.length > 0) {
    activeSelectedLead.value = newLeads[0]
  } else if (activeSelectedLead.value && newLeads.length > 0) {
    const match = newLeads.find(l => l.id === activeSelectedLead.value.id)
    if (match) activeSelectedLead.value = match
  }
}, { immediate: true })

// Dynamic Real KPI Statistics
const kpiStats = computed(() => {
  const all = activeLeadsSource.value
  const total = all.length
  const pendingReview = all.filter(l => l.status === 'Pending Review' || l.status === 'New Lead').length
  const quotesSent = all.filter(l => l.status === 'Quote Sent').length
  const converted = all.filter(l => l.status === 'Converted').length
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

  return {
    total,
    pendingReview,
    quotesSent,
    converted,
    conversionRate
  }
})

// Dynamic Filter Tabs with True Counts from Database
const dynamicLeadTabs = computed(() => {
  const all = activeLeadsSource.value
  return [
    { id: 'all', label: 'All Leads', count: all.length },
    { id: 'New Lead', label: 'New', count: all.filter(l => l.status === 'New Lead').length },
    { id: 'Pending Review', label: 'Pending Review', count: all.filter(l => l.status === 'Pending Review').length },
    { id: 'Quote Sent', label: 'Quote Sent', count: all.filter(l => l.status === 'Quote Sent').length },
    { id: 'Converted', label: 'Accepted', count: all.filter(l => l.status === 'Converted').length },
    { id: 'Lost', label: 'Lost', count: all.filter(l => l.status === 'Lost').length }
  ]
})

// Filtered Leads
const filteredLeads = computed(() => {
  return activeLeadsSource.value.filter(lead => {
    if (activeLeadTab.value !== 'all' && lead.status !== activeLeadTab.value) return false
    if (statusFilter.value !== 'all' && lead.status !== statusFilter.value) return false
    if (sourceFilter.value !== 'all' && lead.source.toLowerCase() !== sourceFilter.value.toLowerCase()) return false
    if (priorityFilter.value !== 'all' && lead.priority !== priorityFilter.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const match = (lead.customer || '').toLowerCase().includes(q) ||
        (lead.ref || '').toLowerCase().includes(q) ||
        (lead.route || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredLeads.value.length / pageSize))
})

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLeads.value.slice(start, start + pageSize)
})

// Checkbox selection state
const selectedLeadIds = ref([])

const isAllSelected = computed(() => {
  if (paginatedLeads.value.length === 0) return false
  return paginatedLeads.value.every(l => selectedLeadIds.value.includes(l.id))
})

const isSomeSelected = computed(() => {
  return !isAllSelected.value && paginatedLeads.value.some(l => selectedLeadIds.value.includes(l.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    const pageIds = new Set(paginatedLeads.value.map(l => l.id))
    selectedLeadIds.value = selectedLeadIds.value.filter(id => !pageIds.has(id))
  } else {
    const set = new Set(selectedLeadIds.value)
    paginatedLeads.value.forEach(l => set.add(l.id))
    selectedLeadIds.value = Array.from(set)
  }
}

const toggleSelectLead = (id) => {
  const index = selectedLeadIds.value.indexOf(id)
  if (index > -1) {
    selectedLeadIds.value.splice(index, 1)
  } else {
    selectedLeadIds.value.push(id)
  }
}

const markActionComplete = () => {
  if (activeSelectedLead.value) {
    activeSelectedLead.value.nextAction = 'Action Complete ✓'
    activeSelectedLead.value.nextActionSub = ''
  }
}

const exportToCSV = () => {
  exportToExcel('leads')
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'New Lead':
      return 'bg-blue-50 text-blue-600 border border-blue-200/60'
    case 'Quote Sent':
      return 'bg-purple-50 text-purple-600 border border-purple-200/60'
    case 'Pending Review':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    case 'Converted':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
    case 'Lost':
      return 'bg-rose-50 text-rose-600 border border-rose-200/60'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-600 border border-rose-200/60'
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    case 'Low':
      return 'bg-slate-100 text-slate-600 border border-slate-200/60'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}
</script>

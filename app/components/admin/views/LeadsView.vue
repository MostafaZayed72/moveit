<template>
  <div class="space-y-5">
    <!-- 1. Top Header with Import / Export Actions (Exact match to "2 Leads & Quotations.png") -->
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
          @click="$emit('select-lead', activeSelectedLead)"
          class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span>Export PDF</span>
        </button>
      </div>
    </div>

    <!-- 2. Split-Screen Main Layout: Left (4 KPIs + Filters + Tabs + 10-Row Table) + Right Lead Drawer -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      <!-- LEFT COLUMN (8 Cols) -->
      <div class="xl:col-span-8 space-y-4 min-w-0">
        <!-- Top 4 KPI Cards (Exact match to "2 Leads & Quotations.png") -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- Total Leads -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-xs font-medium text-slate-500">Total Leads</p>
              <p class="text-2xl font-black text-slate-900 font-sans">{{ kpiStats.total }}</p>
              <p class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>↗ +18%</span>
                <span class="text-slate-400 font-normal">vs. last month</span>
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
                <span>↗ 3 overdue</span>
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
                <span>↗ +12%</span>
                <span class="text-slate-400 font-normal">vs. last month</span>
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
                <span>68% conversion rate</span>
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
            <option value="Info Requested">Info Requested</option>
            <option value="Quotation Prep">Quotation Prep</option>
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
            <span>01/10/2025 – 30/11/2025</span>
          </div>
        </div>

        <!-- Filter Tabs with Red Underline -->
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

        <!-- Leads Table -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                  <th class="py-3 px-3.5 w-8 text-center">
                    <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
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
                  :key="lead.ref || lead.id"
                  @mouseenter="activeSelectedLead = lead"
                  @click="activeSelectedLead = lead"
                  :class="[
                    'transition-colors cursor-pointer group',
                    activeSelectedLead?.ref === lead.ref 
                      ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                      : 'hover:bg-slate-50/80'
                  ]"
                >
                  <td class="py-3.5 px-3.5 text-center" @click.stop>
                    <input type="checkbox" class="rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                  </td>
                  <td class="py-3.5 px-2.5 font-bold text-slate-800 group-hover:text-red-600 whitespace-nowrap">{{ lead.ref }}</td>
                  <td class="py-3.5 px-2.5 font-bold text-slate-900 whitespace-nowrap">{{ lead.customer }}</td>
                  <td class="py-3.5 px-2.5 text-slate-600 whitespace-nowrap">{{ lead.movingDate }}</td>
                  <td class="py-3.5 px-2.5 text-slate-600 whitespace-nowrap">{{ lead.route }}</td>
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
                      <span v-if="(lead.source || 'Google') === 'Google'" class="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] flex items-center justify-center">G</span>
                      <span v-else-if="lead.source === 'Website'" class="text-slate-400">🌐</span>
                      <span v-else-if="lead.source === 'Referral'" class="text-indigo-500">👥</span>
                      <span v-else-if="lead.source === 'Corporate'" class="text-slate-600">🏢</span>
                      <span v-else-if="lead.source === 'LinkedIn'" class="w-4 h-4 rounded bg-[#0A66C2] text-white font-bold text-[9px] flex items-center justify-center">in</span>
                      <span v-else class="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] flex items-center justify-center">G</span>
                      <span>{{ lead.source || 'Google' }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-2.5 whitespace-nowrap">
                    <div class="text-xs font-semibold text-slate-800 leading-tight">{{ lead.nextAction || 'Call customer' }}</div>
                    <div 
                      v-if="lead.nextActionSub" 
                      class="text-[10px] font-bold mt-0.5"
                      :class="lead.nextActionSub === 'Today' ? 'text-[#DC2626]' : 'text-slate-500'"
                    >
                      {{ lead.nextActionSub }}
                    </div>
                  </td>
                  <td class="py-3.5 px-2 text-center" @click.stop="$emit('select-lead', lead)">
                    <button class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer" title="Open Full Quotation">
                      •••
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing <span class="font-bold text-slate-800">1–{{ Math.min(10, filteredLeads.length) }}</span> of <span class="font-bold text-slate-800">{{ kpiStats.total }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button 
                v-for="p in [1, 2, 3, 4, 5]" 
                :key="p"
                @click="currentPage = p"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer',
                  currentPage === p ? 'bg-[#DC2626] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                ]"
              >
                {{ p }}
              </button>
              <span class="px-1 text-slate-400">...</span>
              <button class="w-7 h-7 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700">13</button>
              <select class="ml-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Sticky Lead Detail Drawer (4 Cols - Exact match to "2 Leads & Quotations.png") -->
      <div class="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-16 space-y-5">
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
            <p class="text-[11px] text-slate-400">Created {{ activeSelectedLead.createdAt || '1 Nov 2025, 10:24' }}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer">✕</button>
        </div>

        <!-- Drawer Tabs -->
        <div class="flex items-center gap-5 border-b border-slate-200/80 text-xs font-bold">
          <button 
            v-for="dTab in ['Overview', 'Details', 'Notes', 'Files']" 
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
              <span class="font-bold text-slate-800">{{ activeSelectedLead.phone || '+31 6 12 34 56 78' }}</span>
              <a 
                :href="`https://wa.me/${(activeSelectedLead.phone || '31612345678').replace(/[^0-9]/g, '')}`"
                target="_blank"
                class="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs transition-transform hover:scale-110"
                title="WhatsApp Customer"
              >
                💬
              </a>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400">✉️</span>
              <span class="text-slate-600">{{ activeSelectedLead.email || 'sophie.dejong@gmail.com' }}</span>
            </div>
          </div>

          <!-- Move Specs List -->
          <div class="space-y-2.5 text-xs border-b border-slate-100 pb-4">
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📅</span> Moving Date</span>
              <span class="col-span-7 font-bold text-slate-900">{{ activeSelectedLead.movingDate || '12 Nov 2025' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📍</span> From</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.fromCity || 'Maastricht' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>➔</span> To</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.toCity || 'Amsterdam' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>📦</span> Move Size</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.moveSize || '3-Bedroom House' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🪜</span> Floors</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.floors || '1st floor → 2nd floor' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🛗</span> Elevator</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.elevator || 'No' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🎁</span> Packing Service</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.packing || 'Yes' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🔧</span> Assembly</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.assembly || 'Yes' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>💬</span> Source</span>
              <span class="col-span-7 font-semibold text-slate-800">{{ activeSelectedLead.source || 'Google' }}</span>
            </div>
            <div class="grid grid-cols-12 items-center">
              <span class="col-span-5 text-slate-400 flex items-center gap-2"><span>🏷️</span> Estimated Value</span>
              <span class="col-span-7 font-black text-slate-900 font-sans">€{{ (activeSelectedLead.estValue || 1850).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Next Action Section -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-black text-slate-900">Next Action</h4>
            <div class="flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
              <div class="flex items-start gap-2.5 text-xs">
                <span class="text-slate-600 mt-0.5">📞</span>
                <div>
                  <p class="font-bold text-slate-900">{{ activeSelectedLead.nextAction || 'Call customer' }}</p>
                  <p class="text-[11px] font-bold text-[#DC2626]">{{ activeSelectedLead.nextActionTime || 'Today, 15:00' }}</p>
                </div>
              </div>
              <button 
                @click="markActionComplete"
                class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Mark Complete
              </button>
            </div>
          </div>

          <!-- Bottom 2 Full-Width CTA Buttons -->
          <div class="space-y-2.5 pt-2">
            <button 
              @click="$emit('select-lead', activeSelectedLead)"
              class="w-full py-2.5 px-4 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>📄</span>
              <span>Send Quotation</span>
              <span class="ml-auto text-[10px] opacity-80">▼</span>
            </button>
            <button 
              @click="convertLeadToJob"
              class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>📅</span>
              <span>Convert to Job</span>
            </button>
          </div>
        </div>

        <!-- Tab 2: Details -->
        <div v-else-if="activeDrawerTab === 'Details'" class="space-y-3 text-xs text-slate-600">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <p class="font-bold text-slate-900">Pickup Address</p>
            <p>{{ activeSelectedLead.fromFull || 'Stationsstraat 18, 6221 BT Maastricht' }}</p>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
            <p class="font-bold text-slate-900">Delivery Address</p>
            <p>{{ activeSelectedLead.toFull || 'Keizersgracht 240, 1016 DZ Amsterdam' }}</p>
          </div>
          <button 
            @click="$emit('select-lead', activeSelectedLead)"
            class="w-full py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
          >
            Open Full Move & Quotation Workspace →
          </button>
        </div>

        <!-- Tab 3: Notes -->
        <div v-else-if="activeDrawerTab === 'Notes'" class="space-y-3 text-xs">
          <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-slate-700 leading-relaxed">
            Customer requested fragile packing for living room mirrors and glass dining table. Parking permit needed in Amsterdam center.
          </div>
        </div>

        <!-- Tab 4: Files -->
        <div v-else class="space-y-2 text-xs">
          <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span class="font-semibold text-slate-700">📄 Quotation_{{ activeSelectedLead.ref }}.pdf</span>
            <button @click="$emit('select-lead', activeSelectedLead)" class="text-[#DC2626] font-bold cursor-pointer">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminData } from '~/composables/useAdminData'

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-lead', 'add-lead'])
const { exportToExcel } = useAdminData()

const searchQuery = ref('')
const activeLeadTab = ref('all')
const statusFilter = ref('all')
const sourceFilter = ref('all')
const priorityFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10
const activeDrawerTab = ref('Overview')

const defaultMockLeads = [
  { ref: 'L-2025-1048', customer: 'Sophie de Jong', phone: '+31 6 12 34 56 78', email: 'sophie.dejong@gmail.com', movingDate: '12 Nov 2025', route: 'Maastricht → Amsterdam', fromCity: 'Maastricht', toCity: 'Amsterdam', estValue: 1850, status: 'New Lead', priority: 'High', source: 'Google', nextAction: 'Call customer', nextActionSub: 'Today', nextActionTime: 'Today, 15:00', moveSize: '3-Bedroom House', floors: '1st floor → 2nd floor', elevator: 'No', packing: 'Yes', assembly: 'Yes' },
  { ref: 'L-2025-1047', customer: 'Bas van Dijk', phone: '+31 6 23 45 67 89', email: 'bas.vandijk@mail.nl', movingDate: '28 Nov 2025', route: 'Maastricht (lift)', fromCity: 'Maastricht', toCity: 'Maastricht', estValue: 450, status: 'Quote Sent', priority: 'Medium', source: 'Website', nextAction: 'Follow up', nextActionSub: 'Tomorrow', nextActionTime: 'Tomorrow, 10:00', moveSize: '1-Bedroom Apt', floors: '3rd floor → Ground', elevator: 'External Lift', packing: 'No', assembly: 'No' },
  { ref: 'L-2025-1046', customer: 'UM Student', phone: '+31 6 34 56 78 90', email: 'student@maastrichtuniversity.nl', movingDate: '15 Nov 2025', route: 'Maastricht → Maastricht', fromCity: 'Maastricht', toCity: 'Maastricht', estValue: 300, status: 'Pending Review', priority: 'Low', source: 'Google', nextAction: 'Check details', nextActionSub: 'Today', nextActionTime: 'Today, 16:30', moveSize: 'Studio / Student Room', floors: 'Ground → 1st floor', elevator: 'Yes', packing: 'No', assembly: 'No' },
  { ref: 'L-2025-1045', customer: 'Martine Peters', phone: '+31 6 44 55 66 77', email: 'martine.peters@mail.com', movingDate: '5 Dec 2025', route: 'Maastricht → Den Haag', fromCity: 'Maastricht', toCity: 'Den Haag', estValue: 2800, status: 'Info Requested', priority: 'High', source: 'Referral', nextAction: 'Send quote', nextActionSub: 'Today', nextActionTime: 'Today, 17:00', moveSize: '4-Bedroom Villa', floors: 'Ground → Ground', elevator: 'Yes', packing: 'Yes', assembly: 'Yes' },
  { ref: 'L-2025-1044', customer: 'GlobalRelocate BV', phone: '+31 6 11 22 33 44', email: 'info@globalrelocate.com', movingDate: '20 Nov 2025', route: 'Maastricht → Brussels', fromCity: 'Maastricht', toCity: 'Brussels', estValue: 4200, status: 'Quotation Prep', priority: 'High', source: 'Corporate', nextAction: 'Prepare quote', nextActionSub: 'Today', nextActionTime: 'Today, 14:00', moveSize: 'Office (15 Desks)', floors: '2nd floor → 4th floor', elevator: 'Yes', packing: 'Yes', assembly: 'Yes' },
  { ref: 'L-2025-1043', customer: 'Jansen Family', phone: '+31 6 23 45 67 89', email: 'jansen@gmail.com', movingDate: '7 Nov 2025', route: 'Maastricht → Maastricht', fromCity: 'Maastricht', toCity: 'Maastricht', estValue: 650, status: 'Converted', priority: 'Medium', source: 'Google', nextAction: 'Schedule job', nextActionSub: '', nextActionTime: 'Completed', moveSize: '2-Bedroom House', floors: 'Ground → Ground', elevator: 'No', packing: 'No', assembly: 'Yes' },
  { ref: 'L-2025-1042', customer: 'De Vries', phone: '+31 6 77 88 99 00', email: 'devries@email.com', movingDate: '10 Nov 2025', route: 'Maastricht → Eindhoven', fromCity: 'Maastricht', toCity: 'Eindhoven', estValue: 950, status: 'Quote Sent', priority: 'Medium', source: 'Website', nextAction: 'Follow up', nextActionSub: '13 Nov', nextActionTime: '13 Nov, 11:00', moveSize: '2-Bedroom Apt', floors: '2nd floor → Ground', elevator: 'Yes', packing: 'Yes', assembly: 'No' },
  { ref: 'L-2025-1041', customer: 'TechSolutions BV', phone: '+31 6 98 76 54 32', email: 'contact@techsolutions.nl', movingDate: '18 Nov 2025', route: 'Maastricht → Amsterdam', fromCity: 'Maastricht', toCity: 'Amsterdam', estValue: 2100, status: 'New Lead', priority: 'Low', source: 'LinkedIn', nextAction: 'Call customer', nextActionSub: 'Today', nextActionTime: 'Today, 16:00', moveSize: 'Commercial IT Move', floors: '1st floor → 3rd floor', elevator: 'Yes', packing: 'Yes', assembly: 'Yes' },
  { ref: 'L-2025-1040', customer: 'Meijer Family', phone: '+31 6 55 33 22 11', email: 'meijer@gmail.com', movingDate: '22 Nov 2025', route: 'Maastricht → Heerlen', fromCity: 'Maastricht', toCity: 'Heerlen', estValue: 480, status: 'Lost', priority: 'Low', source: 'Google', nextAction: 'N/A', nextActionSub: '', nextActionTime: 'Closed', moveSize: '1-Bedroom Apt', floors: 'Ground → 1st floor', elevator: 'No', packing: 'No', assembly: 'No' },
  { ref: 'L-2025-1039', customer: 'Paris Group', phone: '+31 6 44 67 88 99', email: 'contact@parisgroup.com', movingDate: '9 Dec 2025', route: 'Maastricht → Paris', fromCity: 'Maastricht', toCity: 'Paris', estValue: 3200, status: 'Pending Review', priority: 'High', source: 'Referral', nextAction: 'Send quote', nextActionSub: 'Tomorrow', nextActionTime: 'Tomorrow, 09:30', moveSize: 'International Relocation', floors: '2nd floor → 1st floor', elevator: 'Yes', packing: 'Yes', assembly: 'Yes' }
]

const activeSelectedLead = ref(defaultMockLeads[0])

const activeLeadsSource = computed(() => {
  if (props.orders && props.orders.length > 0) {
    // Combine live orders with default leads so the table is rich and matches mockup
    const liveMapped = props.orders.map(o => ({
      ...o,
      source: o.source || 'Google',
      nextAction: o.nextAction || 'Call customer',
      nextActionSub: 'Today'
    }))
    return [...defaultMockLeads, ...liveMapped]
  }
  return defaultMockLeads
})

const kpiStats = computed(() => ({
  total: Math.max(124, activeLeadsSource.value.length),
  pendingReview: 28,
  quotesSent: 42,
  converted: 19
}))

const dynamicLeadTabs = computed(() => [
  { id: 'all', label: 'All Leads', count: kpiStats.value.total },
  { id: 'New Lead', label: 'New', count: 28 },
  { id: 'Pending Review', label: 'Pending Review', count: 28 },
  { id: 'Quote Sent', label: 'Quote Sent', count: 42 },
  { id: 'Converted', label: 'Accepted', count: 35 },
  { id: 'Lost', label: 'Lost', count: 19 },
])

const filteredLeads = computed(() => {
  return activeLeadsSource.value.filter(lead => {
    if (activeLeadTab.value !== 'all' && lead.status !== activeLeadTab.value) return false
    if (statusFilter.value !== 'all' && lead.status !== statusFilter.value) return false
    if (sourceFilter.value !== 'all' && (lead.source || 'Google') !== sourceFilter.value) return false
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

const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLeads.value.slice(start, start + pageSize)
})

const markActionComplete = () => {
  if (activeSelectedLead.value) {
    activeSelectedLead.value.nextAction = 'Completed ✓'
    activeSelectedLead.value.nextActionSub = 'Done'
  }
}

const convertLeadToJob = () => {
  if (activeSelectedLead.value) {
    activeSelectedLead.value.status = 'Converted'
  }
}

const exportToCSV = () => {
  exportToExcel('leads')
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'New Lead':
    case 'Quotation Prep':
      return 'bg-blue-50 text-blue-600 border border-blue-200/60'
    case 'Quote Sent':
      return 'bg-purple-50 text-purple-600 border border-purple-200/60'
    case 'Pending Review':
    case 'Info Requested':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    case 'Converted':
    case 'Confirmed':
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

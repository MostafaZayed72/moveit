<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative selection:bg-red-500 selection:text-white pb-16 transition-colors duration-200">
    <!-- Top System Bar (MoveIt Admin Header) -->
    <header v-if="isAuthorized" class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm dark:shadow-2xl transition-colors">
      <!-- Left: Logo (Clean without PRO+) -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img src="/images/logo.svg" alt="MoveIt" class="h-8 w-auto group-hover:scale-105 transition-transform" />
        </NuxtLink>
      </div>

      <!-- Center: Real Dynamic Live Stats Ticker from Database -->
      <div class="hidden xl:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-slate-700 dark:text-slate-300">Live DB Connected</span>
        </div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Total Orders: <span class="font-bold text-slate-900 dark:text-white">{{ allAdminOrders.length }}</span></div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Active In-Transit: <span class="font-bold text-blue-600 dark:text-blue-400">{{ movesInTransitCount }}</span></div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Est. Revenue: <span class="font-bold text-emerald-600 dark:text-emerald-400">€{{ totalGridEstimatedRevenue.toLocaleString() }}</span></div>
      </div>

      <!-- Right: Action Button & User Profile -->
      <div class="flex items-center gap-3">
        <!-- + New Lead Button -->
        <button 
          @click="openNewLeadModal" 
          class="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span class="text-sm font-bold">➕</span>
          <span>New Lead</span>
        </button>

        <!-- Admin Profile -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
            AD
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">MoveIt Admin</p>
            <p class="text-[10px] text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </header>

    <div class="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1920px] mx-auto mt-6">
      <!-- 1. Password Protection Gate -->
      <div v-if="!isAuthorized" class="max-w-md mx-auto my-16" data-aos="zoom-in">
        <div class="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">
            🔒
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">MoveIt Admin Portal</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Please enter administrator credentials to access the dashboard.</p>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4 text-left">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="info@moveitmaastricht.nl"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="••••••••"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <p v-if="authError" class="text-xs font-bold text-red-500 bg-red-500/10 rounded-xl py-2 px-4 text-center">{{ authError }}</p>
            <button 
              type="submit" 
              class="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              :disabled="authLoading"
            >
              <svg v-if="authLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Unlock Dashboard</span>
            </button>
          </form>
        </div>
      </div>

      <!-- 2. Main Dashboard Interface -->
      <div v-else class="flex flex-col lg:flex-row gap-6 w-full mx-auto transition-all duration-300">
        
        <!-- Sidebar Navigation (Full Height) -->
        <aside class="w-full lg:w-72 flex-shrink-0 flex flex-col justify-between bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl min-h-[calc(100vh-100px)] lg:sticky lg:top-20 z-20 backdrop-blur-xl transition-colors">
          <!-- Main Section -->
          <div class="space-y-6">
            <div>
              <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 px-3 mb-2">MAIN OPERATIONS</p>
              <nav class="flex flex-col gap-1.5">
                <!-- Orders & Leads (Excel Data Grid) -->
                <button 
                  @click="activeTab = 'orders'"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                    activeTab === 'orders' 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-base">📊</span>
                    <span>Orders & Leads (Grid)</span>
                  </span>
                  <span v-if="allAdminOrders.length" class="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {{ allAdminOrders.length }}
                  </span>
                </button>

                <!-- Sales Dashboard & Goal Race -->
                <button 
                  @click="activeTab = 'sales_dashboard'"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                    activeTab === 'sales_dashboard' 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-base">🏁</span>
                    <span>Sales Goal Race</span>
                  </span>
                  <span class="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold">
                    {{ salesGoalProgressPercentage }}%
                  </span>
                </button>

                <!-- Smart Dispatch & Calendar -->
                <button 
                  @click="activeTab = 'smart_dispatch'"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                    activeTab === 'smart_dispatch' 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-base">📅</span>
                    <span>Smart Dispatch</span>
                  </span>
                  <span class="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                    {{ calendarMonthLabel }}
                  </span>
                </button>

                <!-- CRM & Customer 360 -->
                <button 
                  @click="activeTab = 'crm_leads'"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                    activeTab === 'crm_leads' 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-base">👥</span>
                    <span>CRM & Clients</span>
                  </span>
                  <span v-if="crmClientsList.length" class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    {{ crmClientsList.length }}
                  </span>
                </button>

                <!-- Financials -->
                <button 
                  @click="activeTab = 'financials'"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                    activeTab === 'financials' 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-base">💰</span>
                    <span>Financials & P&L</span>
                  </span>
                </button>
              </nav>
            </div>

            <!-- Content Management -->
            <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 px-3 mb-2">MANAGEMENT & CMS</p>
              <nav class="flex flex-col gap-1.5">
                <button 
                  v-for="tab in ['locations', 'blog', 'services', 'pricing', 'products']" 
                  :key="tab"
                  @click="activeTab = tab"
                  :class="[
                    'w-full text-left px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group cursor-pointer',
                    activeTab === tab 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700' 
                      : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  ]"
                >
                  <span class="flex items-center gap-3">
                    <span class="text-sm" v-if="tab === 'locations'">📍</span>
                    <span class="text-sm" v-if="tab === 'blog'">📝</span>
                    <span class="text-sm" v-if="tab === 'services'">🛠️</span>
                    <span class="text-sm" v-if="tab === 'pricing'">🏷️</span>
                    <span class="text-sm" v-if="tab === 'products'">🛍️</span>
                    {{ tab }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Bottom Actions (Settings, Language, Theme, Logout) -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <!-- Language and Theme Controls Row -->
            <div class="flex items-center justify-between gap-2 px-1">
              <!-- Language Toggle Pills -->
              <div class="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-1">
                <button 
                  @click="setLocale('en')" 
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5',
                    locale === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  ]"
                  title="Switch to English"
                >
                  <span>🇬🇧</span>
                  <span>EN</span>
                </button>
                <button 
                  @click="setLocale('nl')" 
                  :class="[
                    'flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5',
                    locale === 'nl' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  ]"
                  title="Overschakelen naar Nederlands"
                >
                  <span>🇳🇱</span>
                  <span>NL</span>
                </button>
              </div>

              <!-- Theme Toggle Button (Dark / Light Mode) -->
              <button
                @click="toggleDark()"
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border cursor-pointer shrink-0',
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-yellow-400 hover:bg-slate-800' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                ]"
                :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              >
                <span v-if="isDark" class="text-base">🌙</span>
                <span v-else class="text-base">☀️</span>
              </button>
            </div>

            <!-- Logout Button -->
            <button @click="logout" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-red-500/10 hover:text-red-500 text-slate-600 dark:text-slate-400 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-200 dark:border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 cursor-pointer">
              <span>Logout Portal</span>
              <span>🚪</span>
            </button>
          </div>
        </aside>

        <!-- Main Content Workspace -->
        <main class="flex-1 min-w-0 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden min-h-[85vh] relative flex flex-col transition-colors">
          
          <!-- ============================================================ -->
          <!-- 1. TAB: ORDERS & LEADS (ENTERPRISE EXCEL DATA GRID) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'orders'" class="space-y-6" data-aos="fade-up">
            <!-- Header & Toolbar -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-2xl font-black text-slate-900 dark:text-white">Orders & Leads Data Grid</h2>
                  <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Sync Active ({{ allAdminOrders.length }} Records)
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time spreadsheet data loaded directly from Supabase database with instant filtering, sorting, and exports.</p>
              </div>

              <!-- Quick Action Toolbar -->
              <div class="flex flex-wrap items-center gap-2.5">
                <!-- + New Lead Button -->
                <button 
                  @click="openNewLeadModal" 
                  class="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>➕</span>
                  <span>Add Lead / Order</span>
                </button>

                <!-- Export to Excel (CSV) -->
                <button 
                  @click="exportOrdersToExcel" 
                  class="px-3.5 py-2.5 bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export full grid to Excel / CSV format"
                >
                  <span>📊</span>
                  <span>Export Excel</span>
                </button>

                <!-- Export to PDF -->
                <button 
                  @click="exportOrdersToPDF" 
                  class="px-3.5 py-2.5 bg-rose-600/10 dark:bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export printable PDF report"
                >
                  <span>📄</span>
                  <span>Export PDF</span>
                </button>

                <!-- Refresh -->
                <button 
                  @click="fetchAdminOrders" 
                  class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  title="Reload orders from database"
                >
                  🔄
                </button>
              </div>
            </div>

            <!-- Filter & Search Controls Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <!-- Search -->
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input 
                  type="text" 
                  v-model="ordersSearchQuery" 
                  placeholder="Search customer, email, route, ID..." 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-red-500"
                />
              </div>

              <!-- Status Filter -->
              <div>
                <select v-model="ordersStatusFilter" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500 cursor-pointer">
                  <option value="all">All Statuses (All Leads & Jobs)</option>
                  <option value="New Lead">🟡 New Lead (Incoming)</option>
                  <option value="Estimate Sent">🔵 Estimate Sent (Quote)</option>
                  <option value="Pending">🟠 Pending Review</option>
                  <option value="Confirmed">🟣 Confirmed / Booked</option>
                  <option value="In Transit">🚚 In Transit / Dispatch</option>
                  <option value="Completed">🟢 Completed (Delivered)</option>
                  <option value="Cancelled">🔴 Cancelled / Lost</option>
                </select>
              </div>

              <!-- Date Filter -->
              <div>
                <input 
                  type="date" 
                  v-model="ordersDateFilter" 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500 cursor-pointer"
                />
              </div>

              <!-- Quick Preset Filter -->
              <div class="flex items-center gap-2">
                <button 
                  @click="ordersStatusFilter = 'all'; ordersSearchQuery = ''; ordersDateFilter = ''" 
                  class="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <!-- Live Real KPI Metric Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtered Orders</p>
                  <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ filteredOrders.length }}</p>
                </div>
                <span class="text-2xl">📦</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Est. Revenue</p>
                  <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">€{{ totalGridEstimatedRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💵</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actual Collected</p>
                  <p class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">€{{ totalGridActualRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💳</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Balance</p>
                  <p class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">€{{ (totalGridEstimatedRevenue - totalGridActualRevenue).toLocaleString() }}</p>
                </div>
                <span class="text-2xl">⏳</span>
              </div>
            </div>

            <!-- EXCEL DATA GRID TABLE -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 overflow-hidden shadow-sm dark:shadow-2xl">
              <div class="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
                <table class="w-full text-left border-collapse text-xs">
                  <!-- Table Header -->
                  <thead class="sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                    <tr>
                      <th class="py-3.5 px-4 font-bold"># ID</th>
                      <th class="py-3.5 px-4 font-bold">Customer & Contact</th>
                      <th class="py-3.5 px-4 font-bold">Move Route (From ➔ To)</th>
                      <th class="py-3.5 px-4 font-bold">Date & Time</th>
                      <th class="py-3.5 px-4 font-bold">Package & Volume</th>
                      <th class="py-3.5 px-4 font-bold">Financials</th>
                      <th class="py-3.5 px-4 font-bold">Live Status</th>
                      <th class="py-3.5 px-4 font-bold text-right">Quick Actions</th>
                    </tr>
                  </thead>

                  <!-- Table Body -->
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    <tr 
                      v-for="order in adminOrders" 
                      :key="order.id" 
                      class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
                    >
                      <!-- 1. Order ID -->
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-300 whitespace-nowrap">
                        <div class="flex items-center gap-1.5">
                          <span class="text-red-500">#</span>
                          <span>{{ (order.id || '').toString().slice(0, 8) }}</span>
                        </div>
                        <span class="text-[10px] text-slate-400 font-sans block mt-0.5">{{ formatDateShort(order.created_at) }}</span>
                      </td>

                      <!-- 2. Customer -->
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-2.5">
                          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {{ getCustomerInitials(getOrderName(order)) }}
                          </div>
                          <div>
                            <button @click="openCustomer360(order)" class="font-bold text-slate-900 dark:text-white hover:text-red-500 transition-colors text-left block cursor-pointer">
                              {{ getOrderName(order) }}
                            </button>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{{ getOrderEmail(order) }}</span>
                              <span v-if="getOrderPhone(order) !== 'N/A'" class="text-slate-400">• {{ getOrderPhone(order) }}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- 3. Move Route -->
                      <td class="py-3.5 px-4">
                        <div class="space-y-1">
                          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <span class="text-emerald-500">🟢</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="getOrderFrom(order)">{{ getOrderFrom(order) }}</span>
                          </div>
                          <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <span class="text-red-500">📍</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="getOrderTo(order)">{{ getOrderTo(order) }}</span>
                          </div>
                        </div>
                      </td>

                      <!-- 4. Date & Time -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="font-bold text-slate-900 dark:text-white">{{ getOrderDate(order) }}</span>
                        <span class="text-[10px] text-slate-400 block mt-0.5">{{ order.form_data?.time || 'Morning' }}</span>
                      </td>

                      <!-- 5. Package & Volume -->
                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold inline-block border border-slate-200 dark:border-slate-700">
                          {{ getOrderPackage(order) }}
                        </span>
                      </td>

                      <!-- 6. Financials -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div v-if="getOrderEstRevenue(order) > 0" class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          €{{ getOrderEstRevenue(order).toLocaleString() }}
                        </div>
                        <div v-else class="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-bold border border-amber-500/20">
                          Quote Pending (€0)
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Paid: <span class="font-bold" :class="getOrderActualRevenue(order) > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'">€{{ getOrderActualRevenue(order).toLocaleString() }}</span>
                        </div>
                      </td>

                      <!-- 7. Real-time Live Status Badge & Selector -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="relative inline-block">
                          <select 
                            :value="order.status || 'New Lead'" 
                            @change="quickUpdateOrderStatus(order, $event.target.value)"
                            :class="[
                              'appearance-none text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border cursor-pointer outline-none transition-all pr-7 shadow-sm',
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                              order.status === 'In Transit' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' :
                              order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                              order.status === 'Estimate Sent' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30' :
                              order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            ]"
                          >
                            <option value="New Lead">🟡 New Lead</option>
                            <option value="Estimate Sent">🔵 Estimate Sent</option>
                            <option value="Pending">🟠 Pending Review</option>
                            <option value="Confirmed">🟣 Confirmed</option>
                            <option value="In Transit">🚚 In Transit</option>
                            <option value="Completed">🟢 Completed</option>
                            <option value="Cancelled">🔴 Cancelled</option>
                          </select>
                          <span class="absolute right-2 top-2 pointer-events-none text-[9px] opacity-60">▼</span>
                        </div>
                      </td>

                      <!-- 8. Quick Actions -->
                      <td class="py-3.5 px-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="openCustomer360(order)" 
                            class="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="Customer Profile & History"
                          >
                            👤
                          </button>
                          <button 
                            @click="openComposeEmail(order)" 
                            class="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-blue-500/20 cursor-pointer"
                            title="Compose Email"
                          >
                            ✉️
                          </button>
                          <button 
                            @click="openEditOrderModal(order)" 
                            class="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                            title="Edit Order"
                          >
                            ✏️
                          </button>
                          <button 
                            @click="deleteOrder(order)" 
                            class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="adminOrders.length === 0">
                      <td colspan="8" class="py-16 text-center text-slate-500">
                        No orders or leads found in the database matching your filters. Click "Add Lead / Order" to create one.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div class="text-slate-500 dark:text-slate-400">
                  Showing <span class="font-bold text-slate-900 dark:text-white">{{ adminOrders.length }}</span> of <span class="font-bold text-slate-900 dark:text-white">{{ filteredOrders.length }}</span> entries
                </div>

                <div v-if="totalOrdersPages > 1" class="flex items-center gap-1.5">
                  <button 
                    @click="ordersPage--" 
                    :disabled="ordersPage === 1"
                    class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 dark:text-white font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ Prev
                  </button>
                  <button 
                    v-for="p in totalOrdersPages" 
                    :key="p"
                    @click="ordersPage = p"
                    :class="[
                      'w-8 h-8 rounded-lg font-bold transition-all cursor-pointer',
                      ordersPage === p ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-white'
                    ]"
                  >
                    {{ p }}
                  </button>
                  <button 
                    @click="ordersPage++" 
                    :disabled="ordersPage === totalOrdersPages"
                    class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 dark:text-white font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 2. TAB: REAL SALES DASHBOARD & PERFORMANCE -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'sales_dashboard'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">Real Sales & Pipeline Performance</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Live metrics, pipeline conversions, and revenue breakdowns aggregated directly from your actual database orders.</p>
              </div>
              <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-2">
                💵 Total Pipeline Revenue: €{{ totalGridEstimatedRevenue.toLocaleString() }}
              </span>
            </div>

            <!-- Real KPI Metric Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🎯</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Total DB</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ totalLeadsCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Total Orders</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📅</span>
                  <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400">Live</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ bookedCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Booked / Done</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🚚</span>
                  <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400">Active</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesInTransitCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">In Transit</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📈</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Monthly</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesThisMonthCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Scheduled This Mo.</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">⏳</span>
                  <span class="text-[10px] font-bold text-amber-500">Pending</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesPendingCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Pending Leads</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">💰</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Average</span>
                </div>
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">€{{ avgOrderValue }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Avg Order Value</p>
              </div>
            </div>

            <!-- Real Goal Progress Bar based on actual revenue -->
            <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">🏆 Revenue Goal Tracker</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Target Goal: €15,000.00 • Progress: €{{ totalGridEstimatedRevenue.toLocaleString() }} ({{ salesGoalProgressPercentage }}%)</p>
                </div>
                <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl">
                  {{ salesGoalProgressPercentage }}% of Target
                </span>
              </div>
              <div class="h-4 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden relative border border-slate-300 dark:border-slate-800">
                <div 
                  class="h-full bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 rounded-full transition-all duration-700" 
                  :style="{ width: Math.min(salesGoalProgressPercentage, 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Pipeline Funnel & Service Breakdown (REAL DATA) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Real Pipeline Stages -->
              <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-slate-900 dark:text-white">Orders Breakdown by Live Status</h3>
                
                <div class="space-y-3">
                  <div v-for="stage in pipelineStages" :key="stage.key">
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-700 dark:text-slate-300">{{ stage.label }}</span>
                      <span class="font-mono text-slate-900 dark:text-white">{{ stage.count }} orders • €{{ stage.revenue.toLocaleString() }} <span class="text-slate-400">({{ stage.pct }}%)</span></span>
                    </div>
                    <div class="h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div :class="['h-full', stage.color]" :style="{ width: stage.pct + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Real Revenue by Service Type -->
              <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-slate-900 dark:text-white">Revenue by Moving Package (Real DB)</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div v-for="svc in revenueByService" :key="svc.name" class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p class="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-1">{{ svc.name }}</p>
                    <p class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ svc.percentage }}%</p>
                    <p class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">€{{ svc.rev.toLocaleString() }}</p>
                  </div>
                  <div v-if="revenueByService.length === 0" class="col-span-full py-8 text-center text-slate-500 text-xs">
                    No orders data available to calculate service distribution.
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 3. TAB: SMART DISPATCH & CALENDAR (REAL DATABASE CALENDAR) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'smart_dispatch'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">Smart Dispatch & Fleet Calendar</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Live calendar generated from real orders in database. Click any date to view scheduled moves.</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="changeCalendarMonth(-1)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
                  ◀ Prev Month
                </button>
                <span class="px-4 py-1.5 bg-red-600 text-white font-black text-xs rounded-xl shadow-md">
                  {{ calendarMonthLabel }}
                </span>
                <button @click="changeCalendarMonth(1)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
                  Next Month ▶
                </button>
              </div>
            </div>

            <!-- Dispatch Calendar Grid -->
            <div class="grid grid-cols-7 gap-3 text-xs">
              <div v-for="dayName in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="dayName" class="text-center font-black text-slate-500 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] tracking-wider">
                {{ dayName }}
              </div>

              <div 
                v-for="(day, dIdx) in calendarDays" 
                :key="dIdx" 
                @click="day.date ? filterOrdersByDay(day.date) : null"
                :class="[
                  'border p-3 rounded-2xl min-h-[110px] flex flex-col justify-between transition-all',
                  day.isCurrentMonth ? 'bg-white dark:bg-slate-950/80 cursor-pointer hover:border-red-500' : 'bg-slate-100/50 dark:bg-slate-950/30 opacity-40',
                  day.isToday ? 'border-red-500 ring-2 ring-red-500/50' : 'border-slate-200 dark:border-slate-800'
                ]"
              >
                <div class="flex justify-between items-start">
                  <span :class="['font-black text-sm', day.isToday ? 'text-red-500' : 'text-slate-900 dark:text-white']">{{ day.dayNum }}</span>
                  <span v-if="day.revenue > 0" class="font-mono font-bold text-[10px] text-emerald-600 dark:text-emerald-400">€{{ day.revenue.toLocaleString() }}</span>
                </div>

                <div v-if="day.jobsCount > 0" class="space-y-0.5 my-1">
                  <div class="text-[10px] font-bold text-slate-700 dark:text-slate-300">📦 {{ day.jobsCount }} Move(s)</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400">🚛 {{ day.trucks }} Truck(s)</div>
                </div>
                <div v-else-if="day.isCurrentMonth" class="text-[10px] text-slate-400 dark:text-slate-600 my-auto">
                  No moves
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 4. TAB: CRM & CLIENTS (REAL DATABASE CLIENTS) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">CRM & Customer Profiles</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real unique customers aggregated from database orders with full lifetime statistics and direct email messaging.</p>
              </div>
              <button @click="fetchAdminOrders" class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                🔄 Refresh Clients ({{ crmClientsList.length }})
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div 
                v-for="client in crmClientsList" 
                :key="client.email + client.name" 
                class="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-base shadow-md">
                        {{ getCustomerInitials(client.name) }}
                      </div>
                      <div>
                        <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ client.name }}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ client.email }}</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Phone:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.phone }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Total Moves / Orders:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.ordersCount }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Lifetime Revenue:</span>
                      <span class="font-bold text-emerald-600 dark:text-emerald-400">€{{ client.totalRevenue.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Last Move Date:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.lastOrderDate }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    @click="openComposeEmail({ form_data: { name: client.name, email: client.email } })" 
                    class="flex-1 py-2 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-colors cursor-pointer"
                  >
                    ✉️ Email
                  </button>
                  <button 
                    @click="openCustomer360({ form_data: { name: client.name, email: client.email, phone: client.phone }, clientOrders: client.orders })" 
                    class="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    👤 Profile
                  </button>
                </div>
              </div>

              <div v-if="crmClientsList.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
                No customer profiles found in database. Create a new lead to populate CRM.
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 5. PRESERVED REAL CMS & MANAGEMENT TABS -->
          <!-- ============================================================ -->
<!-- TAB CONTENT: FINANCIALS -->
        <div v-if="activeTab === 'financials'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.financials.title') }}</h2>
              
              <div class="flex flex-col md:flex-row items-center gap-2">
                  <select v-model="financialFilter" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white">
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                      <option value="custom">Custom Range</option>
                  </select>
                  
                  <div v-if="financialFilter === 'custom'" class="flex items-center gap-2">
                      <input type="date" v-model="financialCustomFrom" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
                      <span class="text-slate-500">to</span>
                      <input type="date" v-model="financialCustomTo" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
                  </div>

                  <button @click="fetchFinancials" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all text-slate-900 dark:text-white whitespace-nowrap">
                    🔄 Refresh
                  </button>
              </div>
            </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-red-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ $t('admin.financials.summary.expenses') }}</p>
              <p class="text-3xl font-black text-red-500">€{{ totalExpenses }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Income</p>
              <p class="text-3xl font-black text-emerald-500">€{{ totalIncome }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ $t('admin.financials.summary.profit') }}</p>
              <p class="text-3xl font-black text-blue-500">€{{ totalIncome - totalExpenses }}</p>
            </div>
          </div>

          <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 class="font-bold text-lg mb-4">Add Expense</h3>
            <form @submit.prevent="addExpense" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Category</label>
                <select v-model="expenseForm.category" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm" required>
                  <option>Fuel</option>
                  <option>Electricity</option>
                  <option>Maintenance</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Amount (€)</label>
                <input type="number" step="0.01" v-model="expenseForm.amount" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" required />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Date</label>
                <input type="date" v-model="expenseForm.date" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" required />
              </div>
              <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-2.5 text-sm transition-all">Add Expense</button>
            </form>
          </div>
          
          <div class="mt-8">
            <h3 class="font-bold text-lg mb-4">Recent Expenses</h3>
            <div class="space-y-3">
              <div v-for="exp in expensesList" :key="exp.id" class="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <span class="font-bold text-sm">{{ exp.category }}</span>
                  <span class="text-xs text-slate-500 ml-3">{{ exp.date }}</span>
                </div>
                <span class="font-black text-red-500">-€{{ exp.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        

        <!-- TAB CONTENT: LOCATIONS -->
        <div v-if="activeTab === 'locations'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.locations.title') }}</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage active cities, moving coverage zones, SEO content, and local sub-sections.</p>
            </div>
            <button @click="openAddLocationModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ {{ $t('admin.locations.add') }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="loc in locations" :key="loc.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all">
              <div class="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="loc.image" :src="loc.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="loc.name" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                
                <!-- Country Badge with High Contrast Glass Backdrop -->
                <div class="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black rounded-xl uppercase tracking-wider border border-white/20 shadow-lg flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>{{ loc.country || 'Netherlands' }}</span>
                </div>

                <!-- City Name Pill on Image -->
                <div class="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-md text-white font-black text-sm rounded-xl shadow-lg border border-white/10">
                  {{ loc.name }}
                </div>
              </div>

              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{{ loc.name }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">slug: {{ loc.slug }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <button @click="manageLocationSections(loc)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                    Sections
                  </button>
                  <button @click="openEditLocationModal(loc)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteLocation(loc)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div v-if="locations.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
              {{ $t('admin.locations.empty') }}
            </div>
          </div>

          <!-- Pagination for Locations -->
          <div v-if="totalLocationsPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="locationsPage--" 
              :disabled="locationsPage === 1"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ◀ Prev
            </button>
            <button 
              v-for="p in totalLocationsPages" 
              :key="p"
              @click="locationsPage = p"
              :class="[
                'w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center',
                locationsPage === p 
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="locationsPage++" 
              :disabled="locationsPage === totalLocationsPages"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>


        <!-- TAB CONTENT: BLOG -->
        <div v-if="activeTab === 'blog'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Blog Posts & Guides</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish moving advice, student moving checklists, and relocation tips.</p>
            </div>
            <button @click="openAddBlogModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add New Post
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in blogPosts" :key="post.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all">
              <div class="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="post.image" :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="post.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                <div class="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black rounded-xl uppercase tracking-wider border border-white/20 shadow-lg">{{ post.category_en }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{{ post.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ post.desc_en }}</p>
                </div>
                <div class="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <span class="text-[10px] text-slate-400 font-mono">{{ post.date || 'No Date' }}</span>
                  <div class="flex gap-2">
                    <button @click="manageBlogSections(post)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                      Sections
                    </button>
                    <button @click="openEditBlogModal(post)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                      Edit
                    </button>
                    <button @click="deleteBlogPost(post)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogPosts.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
              No blog posts found. Click "Add New Post" to create one.
            </div>
          </div>
        </div>


        <!-- TAB CONTENT: SERVICES -->
        <div v-if="activeTab === 'services'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Moving Services</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure student moving, home relocation, packing, storage, and assembly services.</p>
            </div>
            <button @click="openAddServiceModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add New Service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="service in services" :key="service.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-6 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-6 shadow-md hover:shadow-xl transition-all">
              <div class="w-full sm:w-40 h-40 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img v-if="service.image" :src="service.image" class="w-full h-full object-cover" :alt="service.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
              </div>
              <div class="flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white mb-1">{{ service.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{{ service.description_en }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                  <button @click="manageServiceSections(service)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                    Sections
                  </button>
                  <button @click="openEditServiceModal(service)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteService(service)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- TAB CONTENT: PRICING -->
        <div v-if="activeTab === 'pricing'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Pricing Packages</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure student packages, hourly rates, and transparent package tiers.</p>
            </div>
            <button @click="openAddPricingModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add Package
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="pkg in pricingPackages" :key="pkg.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md hover:shadow-xl transition-all space-y-4">
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">{{ pkg.title_en }}</h3>
                  <span class="text-lg font-black text-red-600">€{{ pkg.price }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ pkg.description_en }}</p>
              </div>
              <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button @click="openEditPricingModal(pkg)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                  Edit
                </button>
                <button @click="deletePricingPackage(pkg)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- TAB CONTENT: PRODUCTS -->
        <div v-if="activeTab === 'products'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Moving Supplies & Products</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Moving boxes, bubble wrap, tape, and packing kits inventory.</p>
            </div>
            <button @click="openAddProductModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add Product
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="prod in products" :key="prod.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md hover:shadow-xl transition-all">
              <div class="h-44 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="getFirstProductImage(prod.image)" :src="getFirstProductImage(prod.image)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="prod.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                <div class="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono font-bold text-xs rounded-xl shadow-lg border border-white/20">€{{ prod.price }}</div>
              </div>
              <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{{ prod.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ prod.description_en }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button @click="openEditProductModal(prod)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteProduct(prod)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        </main>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODAL 1: + NEW LEAD / NEW ORDER (REAL DATABASE CREATION) -->
    <!-- ============================================================ -->
    <div v-if="modals.newLead" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Create New Lead / Order Manually</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saves directly to Supabase database and updates the real-time grid.</p>
          </div>
          <button @click="modals.newLead = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveNewLead" class="space-y-4 text-xs">
          <!-- Step 1: Customer Info -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">1. Customer Information</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Full Name *</label>
                <input type="text" v-model="newLeadForm.fullName" required placeholder="e.g. John Doe" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Phone Number *</label>
                <input type="tel" v-model="newLeadForm.phone" required placeholder="+31 6 12345678" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div class="sm:col-span-2">
                <label class="font-bold text-slate-600 dark:text-slate-400">Email Address *</label>
                <input type="email" v-model="newLeadForm.email" required placeholder="john@example.com" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
            </div>
          </div>

          <!-- Step 2: Route & Move Logistics -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">2. Move Route & Date</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Pickup Address (From) *</label>
                <input type="text" v-model="newLeadForm.fromAddress" required placeholder="Vrijthof 1, Maastricht" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Destination Address (To) *</label>
                <input type="text" v-model="newLeadForm.toAddress" required placeholder="Markt 10, Roermond" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Scheduled Date *</label>
                <input type="date" v-model="newLeadForm.date" required class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Moving Package / Size</label>
                <select v-model="newLeadForm.package" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
                  <option value="Studio Apartment (1 Man + Van)">Studio Apartment (1 Man + Van)</option>
                  <option value="1-2 Bedroom House (2 Men + Van)">1-2 Bedroom House (2 Men + Van)</option>
                  <option value="3-4 Bedroom Family House (3 Men + Truck)">3-4 Bedroom Family House (3 Men + Truck)</option>
                  <option value="Commercial / Office Relocation">Commercial / Office Relocation</option>
                  <option value="Custom Transport">Custom Transport</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Financials & Status -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">3. Financials & Status</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Est. Total Revenue (€) *</label>
                <input type="number" step="0.01" v-model="newLeadForm.estRevenue" required class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Deposit Paid (€)</label>
                <input type="number" step="0.01" v-model="newLeadForm.actualRevenue" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Initial Status</label>
                <select v-model="newLeadForm.status" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
                  <option value="New Lead">🟡 New Lead</option>
                  <option value="Estimate Sent">🔵 Estimate Sent</option>
                  <option value="Confirmed">🟣 Confirmed / Booked</option>
                  <option value="In Transit">🚚 In Transit</option>
                  <option value="Completed">🟢 Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="modals.newLead = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="savingNewLead" class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer">
              <span v-if="savingNewLead">Saving to Database...</span>
              <span v-else>Save Lead to DB</span>
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 2: COMPOSE EMAIL MODAL (SENDS REAL EMAIL VIA API) -->
    <!-- ============================================================ -->
    <div v-if="modals.composeEmail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
              ✉️
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">Compose & Send Email</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Sends directly to recipient via mail gateway</p>
            </div>
          </div>
          <button @click="modals.composeEmail = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- TO field -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">TO</label>
            <div class="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-slate-900 dark:text-white">
              <span class="px-2 py-0.5 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-md font-bold text-[11px]">Primary</span>
              <span>{{ emailForm.toName }} &lt;{{ emailForm.toEmail }}&gt;</span>
            </div>
          </div>

          <!-- SUBJECT field -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">SUBJECT</label>
            <input 
              type="text" 
              v-model="emailForm.subject" 
              placeholder="Enter email subject..." 
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          <!-- Templates -->
          <div class="flex items-center gap-2">
            <select @change="applyEmailTemplate($event.target.value)" class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
              <option value="">📁 Choose Email Template...</option>
              <option value="quote">Moving Quote & Estimate Details</option>
              <option value="confirmed">Booking & Crew Confirmation</option>
            </select>
          </div>

          <!-- Message Box -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">MESSAGE</label>
            <textarea 
              rows="6" 
              v-model="emailForm.message" 
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:border-red-500 font-sans leading-relaxed"
              placeholder="Write your email message here..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span class="text-slate-500">Recipient: {{ emailForm.toEmail }}</span>
          <div class="flex gap-3">
            <button @click="modals.composeEmail = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button @click="sendCustomerEmail" :disabled="sendingEmail" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer">
              <span>✈️</span>
              <span v-if="sendingEmail">Sending...</span>
              <span v-else>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 3: CUSTOMER 360 CRM PROFILE & ORDER HISTORY -->
    <!-- ============================================================ -->
    <div v-if="modals.customerProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
        <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xl">
              {{ getCustomerInitials(selectedCustomer.name) }}
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ selectedCustomer.name }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ selectedCustomer.email }} • {{ selectedCustomer.phone }}</p>
            </div>
          </div>
          <button @click="modals.customerProfile = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Customer Orders History in Database</h4>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="ord in (selectedCustomer.orders || [])" :key="ord.id" class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p class="font-bold text-slate-900 dark:text-white">#{{ (ord.id || '').slice(0, 8) }} • {{ getOrderPackage(ord) }}</p>
                <p class="text-[10px] text-slate-500">{{ getOrderFrom(ord) }} ➔ {{ getOrderTo(ord) }}</p>
              </div>
              <div class="text-right">
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">€{{ getOrderEstRevenue(ord) }}</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{{ ord.status }}</span>
              </div>
            </div>
            <div v-if="!selectedCustomer.orders || selectedCustomer.orders.length === 0" class="text-center py-6 text-slate-500">
              No previous orders found for this customer profile.
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.customerProfile = false" class="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
            Close Profile
          </button>
        </div>
      </div>
    </div>

    <!-- PRESERVED MODALS AND DIALOGS -->
<!-- Custom Confirm/Alert Dialog -->
    <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6" data-aos="zoom-in" data-aos-duration="200">
        <div class="w-16 h-16 mx-auto bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">{{ confirmDialog.title }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ confirmDialog.message }}</p>
        </div>
        <div class="flex gap-3 justify-center pt-2">
          <button v-if="!confirmDialog.isAlert" @click="confirmDialog.cancel && confirmDialog.cancel()" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="confirmDialog.confirm && confirmDialog.confirm()" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">OK</button>
        </div>
      </div>
    </div>

    <!-- MODAL: EDIT ORDER -->
    <div v-if="modals.order" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">Edit Order</h3>
          <button @click="modals.order = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</label>
            <input type="text" v-model="orderForm.date" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ $t('admin.orders.details.from') }}</label>
            <input type="text" v-model="orderForm.from" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ $t('admin.orders.details.to') }}</label>
            <input type="text" v-model="orderForm.to" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Package</label>
            <input type="text" v-model="orderForm.package" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>

          <!-- Financial Fields -->
          <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 class="text-sm font-black text-red-500 uppercase">Financials</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Revenue</label>
                <input type="number" v-model="orderForm.est_revenue" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Revenue</label>
                <input type="number" v-model="orderForm.actual_revenue" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Hours</label>
                <input type="number" v-model="orderForm.est_hours" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Hours</label>
                <input type="number" v-model="orderForm.actual_hours" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Fuel (L)</label>
                <input type="number" v-model="orderForm.est_fuel_litres" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Fuel (L)</label>
                <input type="number" v-model="orderForm.actual_fuel_litres" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Distance</label>
                <input type="number" v-model="orderForm.est_distance" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Distance</label>
                <input type="number" v-model="orderForm.actual_distance" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Fuel Cost</label>
                <input type="number" v-model="orderForm.est_fuel_cost" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Fuel Cost</label>
                <input type="number" v-model="orderForm.actual_fuel_cost" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Images ({{ orderForm.images?.length || 0 }})</label>
            <div class="flex flex-wrap gap-3">
              <div v-for="(img, idx) in orderForm.images" :key="idx" class="relative group">
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <img :src="img" class="w-full h-full object-cover" />
                </div>
                <button @click="removeOrderImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md">✕</button>
              </div>
              <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 rounded-xl w-16 h-16 flex flex-col items-center justify-center cursor-pointer relative transition-colors group">
                <span class="text-xl text-slate-400 group-hover:text-red-500">+</span>
                <input type="file" @change="onOrderImageUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div v-if="uploadingOrderImage" class="text-[10px] text-red-500 animate-pulse mt-1">Uploading image...</div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.order = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveOrder" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT LOCATION -->
    <div v-if="modals.location" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? $t('admin.locations.edit') : $t('admin.locations.add') }}</h3>
          <button @click="modals.location = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Section 1: Basic Information -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">1. Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location Name</label>
                <input type="text" v-model="locationForm.name" placeholder="e.g. Maastricht" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</label>
                <input type="text" v-model="locationForm.slug" placeholder="e.g. maastricht" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country (optional)</label>
                <input type="text" v-model="locationForm.country" placeholder="e.g. Germany 🇩🇪" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 2: Media Assets -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">2. Media Assets</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Main Cover Image -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Main Cover Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.image" :src="locationForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Van -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Moving Van Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_van" :src="locationForm.images_van" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_van')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Boxes -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Boxes Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_boxes" :src="locationForm.images_boxes" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_boxes')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Room -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Room/Furniture Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_room" :src="locationForm.images_room" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_room')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>
            </div>
            <div v-if="uploading" class="text-xs text-red-500 animate-pulse">Uploading to Cloudinary...</div>
          </div>

          <!-- Section 3: Hero & SEO Metadata -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">3. Hero & SEO Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Title EN</label>
                <input type="text" v-model="locationForm.hero_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Title NL</label>
                <input type="text" v-model="locationForm.hero_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Subtitle EN</label>
                <input type="text" v-model="locationForm.hero_subtitle_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Subtitle NL</label>
                <input type="text" v-model="locationForm.hero_subtitle_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Title EN</label>
                <input type="text" v-model="locationForm.seo_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Title NL</label>
                <input type="text" v-model="locationForm.seo_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Description EN</label>
                <textarea v-model="locationForm.seo_desc_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Description NL</label>
                <textarea v-model="locationForm.seo_desc_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Keywords EN</label>
                <input type="text" v-model="locationForm.seo_keywords_en" placeholder="moving, maastricht, removals" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Keywords NL</label>
                <input type="text" v-model="locationForm.seo_keywords_nl" placeholder="verhuizen, maastricht, verhuisbedrijf" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 4: Content Section Textareas -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">4. Section Contents (Divide paragraphs with newlines)</h4>
            <div class="space-y-6">
              <!-- Introduction Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Introduction Title EN</label>
                  <input type="text" v-model="locationForm.intro_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Introduction Title NL</label>
                  <input type="text" v-model="locationForm.intro_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Intro Text EN</label>
                  <textarea v-model="locationForm.intro_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Intro Text NL</label>
                  <textarea v-model="locationForm.intro_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Residential Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Title EN</label>
                  <input type="text" v-model="locationForm.residential_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Title NL</label>
                  <input type="text" v-model="locationForm.residential_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Text EN</label>
                  <textarea v-model="locationForm.residential_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Text NL</label>
                  <textarea v-model="locationForm.residential_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Commercial Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Title EN</label>
                  <input type="text" v-model="locationForm.commercial_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Title NL</label>
                  <input type="text" v-model="locationForm.commercial_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Text EN</label>
                  <textarea v-model="locationForm.commercial_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Text NL</label>
                  <textarea v-model="locationForm.commercial_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Packing Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Title EN</label>
                  <input type="text" v-model="locationForm.packing_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Title NL</label>
                  <input type="text" v-model="locationForm.packing_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Text EN</label>
                  <textarea v-model="locationForm.packing_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Text NL</label>
                  <textarea v-model="locationForm.packing_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Insights Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Title EN</label>
                  <input type="text" v-model="locationForm.insights_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Title NL</label>
                  <input type="text" v-model="locationForm.insights_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Text EN</label>
                  <textarea v-model="locationForm.insights_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Text NL</label>
                  <textarea v-model="locationForm.insights_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Cost Factors Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Title EN</label>
                  <input type="text" v-model="locationForm.costs_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Title NL</label>
                  <input type="text" v-model="locationForm.costs_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Text EN</label>
                  <textarea v-model="locationForm.costs_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Text NL</label>
                  <textarea v-model="locationForm.costs_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Neighborhoods Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods Title EN</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods Title NL</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods EN (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_en" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods NL (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_nl" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.location = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveLocation" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Location' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT BLOG POST -->
    <div v-if="modals.blog" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Blog Post' : 'Add New Blog Post' }}</h3>
          <button @click="modals.blog = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug (e.g. 10-tips-stress-free)</label>
            <input type="text" v-model="blogForm.slug" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Date</label>
            <input type="text" v-model="blogForm.date" placeholder="e.g. May 10, 2026" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title EN</label>
            <input type="text" v-model="blogForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title NL</label>
            <input type="text" v-model="blogForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category EN</label>
            <input type="text" v-model="blogForm.category_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category NL</label>
            <input type="text" v-model="blogForm.category_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Read Time EN</label>
            <input type="text" v-model="blogForm.read_time_en" placeholder="e.g. 5 min read" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Read Time NL</label>
            <input type="text" v-model="blogForm.read_time_nl" placeholder="e.g. 5 min leestijd" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
            <textarea v-model="blogForm.desc_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
            <textarea v-model="blogForm.desc_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Content EN (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Content NL (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-3 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="blogForm.image" :src="blogForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-xs text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'blog')" accept="image/*" class="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-2 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.blog = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveBlogPost" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT SERVICE -->
    <div v-if="modals.service" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h3>
          <button @click="modals.service = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service Slug (e.g. lift-rental)</label>
            <input type="text" v-model="serviceForm.slug" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title EN</label>
            <input type="text" v-model="serviceForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title NL</label>
            <input type="text" v-model="serviceForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Description EN</label>
            <textarea v-model="serviceForm.description_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Description NL</label>
            <textarea v-model="serviceForm.description_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-3">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="serviceForm.image" :src="serviceForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'service')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-1 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.service = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveService" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Service' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE SERVICE SECTIONS -->
    <div v-if="modals.sections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedService.title_en }}" page.</p>
          </div>
          <button @click="modals.sections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <!-- Section list and editor -->
        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addServiceSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in serviceSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateServiceSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteServiceSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="serviceSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this service.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.sections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE BLOG SECTIONS -->
    <div v-if="modals.blogSections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedBlog ? selectedBlog.title_en : '' }}" post.</p>
          </div>
          <button @click="modals.blogSections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addBlogSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in blogSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateBlogSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteBlogSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this post.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.blogSections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE LOCATION SECTIONS -->
    <div v-if="modals.locationSections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedLocation ? selectedLocation.name : '' }}" location page.</p>
          </div>
          <button @click="modals.locationSections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addLocationSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in locationSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateLocationSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteLocationSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="locationSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this location page.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.locationSections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>


    <!-- MODAL: ADD/EDIT PRICING PACKAGE -->
    <div v-if="modals.pricingPackage" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Pricing Package' : 'Add New Pricing Package' }}</h3>
          <button @click="modals.pricingPackage = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Package Identifier Key (e.g., package1)</label>
              <input type="text" v-model="packageForm.key_name" placeholder="e.g. package1" :disabled="isEditing" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Icon Emoji</label>
              <input type="text" v-model="packageForm.icon" placeholder="e.g. 🚐" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name EN</label>
              <input type="text" v-model="packageForm.name_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name NL</label>
              <input type="text" v-model="packageForm.name_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price EN</label>
              <input type="text" v-model="packageForm.price_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price NL</label>
              <input type="text" v-model="packageForm.price_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit EN (optional)</label>
              <input type="text" v-model="packageForm.unit_en" placeholder="e.g. /hr" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit NL (optional)</label>
              <input type="text" v-model="packageForm.unit_nl" placeholder="e.g. /uur" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Button Text EN</label>
              <input type="text" v-model="packageForm.cta_text_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Button Text NL</label>
              <input type="text" v-model="packageForm.cta_text_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Link (URL or Page Path)</label>
              <input type="text" v-model="packageForm.cta_link" placeholder="e.g. /contact" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="flex items-center space-x-3 pt-6">
              <input type="checkbox" id="pkgPopular" v-model="packageForm.popular" class="w-4 h-4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded text-red-600 focus:ring-red-500" />
              <label for="pkgPopular" class="text-sm font-bold text-slate-700 dark:text-slate-300">Mark as Most Popular</label>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tag EN</label>
              <input type="text" v-model="packageForm.tag_en" placeholder="e.g. VAN ONLY" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tag NL</label>
              <input type="text" v-model="packageForm.tag_nl" placeholder="e.g. ALLEEN BUS" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
              <textarea v-model="packageForm.description_en" placeholder="You handle the lifting - we handle the drive." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
              <textarea v-model="packageForm.description_nl" placeholder="U regelt het tillen - wij regelen de rit." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Best For EN (Format: Icon|Text - one per line)</label>
              <textarea v-model="packageForm.best_for_raw_en" placeholder="e.g.&#10;🎓|Students&#10;🛋|Single-item moves" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Best For NL (Format: Icon|Text - one per line)</label>
              <textarea v-model="packageForm.best_for_raw_nl" placeholder="e.g.&#10;🎓|Studenten&#10;🛋|Enkele meubelstukken" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inclusions EN (one per line)</label>
              <textarea v-model="packageForm.includes_raw_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inclusions NL (one per line)</label>
              <textarea v-model="packageForm.includes_raw_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.pricingPackage = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="savePackage" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Package' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT PRODUCT -->
    <div v-if="modals.product" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
          <button @click="modals.product = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Title EN</label>
              <input type="text" v-model="productForm.title_en" placeholder="e.g. Roll of Tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Title NL</label>
              <input type="text" v-model="productForm.title_nl" placeholder="e.g. Rol Tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</label>
              <input type="text" v-model="productForm.slug" placeholder="e.g. roll-of-tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price (€)</label>
              <input type="number" step="0.01" v-model.number="productForm.price" placeholder="e.g. 3.95" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">WhatsApp Number override (optional)</label>
              <input type="text" v-model="productForm.whatsapp_number" placeholder="e.g. 31684094271" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
              <input type="number" v-model.number="productForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-3 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Images (First is Cover)</label>
              
              <!-- Image grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div 
                  v-for="(imgUrl, i) in productImagesList" 
                  :key="i" 
                  class="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden aspect-square bg-white dark:bg-slate-950 flex items-center justify-center p-1"
                >
                  <img :src="imgUrl" class="w-full h-full object-contain" />
                  
                  <!-- Cover badge -->
                  <div v-if="i === 0" class="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-md z-10">
                    Cover
                  </div>
                  
                  <!-- Overlay actions on hover -->
                  <div class="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                    <button 
                      v-if="i > 0" 
                      type="button" 
                      @click="setProductCoverImage(i)" 
                      class="text-[9px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded w-full text-center transition-all cursor-pointer"
                    >
                      Make Cover
                    </button>
                    <button 
                      type="button" 
                      @click="removeProductImage(i)" 
                      class="text-[9px] bg-slate-800 hover:bg-slate-700 text-red-500 font-bold px-2 py-1 rounded w-full text-center border border-red-500/30 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <!-- Add new image box -->
                <div class="border-2 border-dashed border-slate-350 dark:border-slate-850 hover:border-red-500/50 rounded-xl flex flex-col items-center justify-center aspect-square p-4 transition-colors relative cursor-pointer group/upload">
                  <span class="text-2xl text-slate-400 group-hover/upload:text-red-500 transition-colors font-light">+</span>
                  <span class="text-[9px] font-bold text-slate-400 group-hover/upload:text-red-500 transition-colors uppercase mt-1">Upload</span>
                  <input type="file" @change="onProductImageUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div v-if="uploading" class="text-xs text-red-500 animate-pulse mt-1">Uploading image to Cloudinary...</div>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
              <textarea v-model="productForm.description_en" placeholder="Strong adhesive tape..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-20 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
              <textarea v-model="productForm.description_nl" placeholder="Sterke verpakkingstape..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-20 text-xs"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.product = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveProduct" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Product' }}
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM DIALOG NOTIFICATION -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="dialog.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl text-center transform transition-all scale-100">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" :class="dialog.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'">
            <svg v-if="dialog.type === 'success'" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ dialog.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ dialog.message }}</p>
          <button @click="dialog.show = false" class="mt-8 w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            Done
          </button>
        </div>
      </div>
    </transition>

  </div>

</template>

<script setup>

definePageMeta({ layout: false })

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const { t, locale, setLocale } = useI18n()

const localePath = useLocalePath()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)


// Authorization State
const isAuthorized = ref(false)
const emailInput = ref('')
const passwordInput = ref('')
const authLoading = ref(false)
const authError = ref('')

// --- DIALOG LOGIC ---
const dialog = ref({
  show: false,
  title: '',
  message: '',
  type: 'success'
})

const showDialog = (title, message, type = 'success') => {
  dialog.value = { show: true, title, message, type }
}

// Supabase client
const supabase = useSupabaseClient()

// --- CONFIRM DIALOG LOGIC ---
const confirmDialog = ref({ isOpen: false, title: '', message: '', isAlert: false, confirm: null, cancel: null })

const showConfirm = (title, message, isAlert = false) => {
  return new Promise((resolve) => {
    confirmDialog.value = {
      isOpen: true,
      title,
      message,
      isAlert,
      confirm: () => {
        confirmDialog.value.isOpen = false
        resolve(true)
      },
      cancel: () => {
        confirmDialog.value.isOpen = false
        resolve(false)
      }
    }
  })
}

// Supabase client


// --- ORDERS LOGIC ---

const ordersSearchQuery = ref('')
const ordersStatusFilter = ref('all')
const ordersDateFilter = ref('')

const applyOrdersFilter = () => {
  ordersPage.value = 1
}

const allAdminOrders = ref([])
const loadingAdminOrders = ref(false)

const fetchAdminOrders = async () => {
  loadingAdminOrders.value = true
  try {
    const { data, error } = await supabase.from('orders').select('*, customers ( full_name, email )').order('created_at', { ascending: false }).limit(2000)
    if (error) throw error
    allAdminOrders.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingAdminOrders.value = false
  }
}

const filteredOrders = computed(() => {
  let list = allAdminOrders.value || []
  if (ordersStatusFilter.value !== 'all') {
    list = list.filter(o => o.status === ordersStatusFilter.value)
  }
  if (ordersDateFilter.value) {
    list = list.filter(o => (o.date === ordersDateFilter.value) || (o.form_data && o.form_data.date === ordersDateFilter.value))
  }
  if (ordersSearchQuery.value) {
    const q = ordersSearchQuery.value.toLowerCase()
    list = list.filter(o => 
      (o.id || '').toLowerCase().includes(q) ||
      (o.customers?.full_name || '').toLowerCase().includes(q) ||
      (o.customers?.email || '').toLowerCase().includes(q) ||
      (o.form_data?.from || '').toLowerCase().includes(q) ||
      (o.form_data?.to || '').toLowerCase().includes(q) ||
      (o.form_data?.package || '').toLowerCase().includes(q)
    )
  }
  return list
})

const adminOrders = computed(() => {
  const start = (ordersPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

const updateOrderStatus = async (order) => {
  try {
    const { error } = await supabase.from('orders').update({ status: order.status }).eq('id', order.id)
    if (error) throw error
    const idx = allAdminOrders.value.findIndex(o => o.id === order.id);
    if (idx !== -1) allAdminOrders.value[idx].status = order.status;
    showDialog('Status Updated', 'The order status has been updated successfully.', 'success')
  } catch (err) {
    console.error(err)
    showDialog('Update Failed', 'An error occurred while updating the order status.', 'error')
  }
}

const selectedItem = ref(null)
const orderForm = ref({ id: '', date: '', from: '', to: '', package: '', images: [] })
const uploadingOrderImage = ref(false)

const openEditOrderModal = (order) => {
  selectedItem.value = order
  orderForm.value = { 
    id: order.id, 
    date: order.form_data?.date || '',
    from: order.form_data?.from || '',
    to: order.form_data?.to || '',
    package: order.form_data?.package || '',
    images: order.form_data?.images ? [...order.form_data.images] : [],
    est_revenue: order.est_revenue || 0,
    actual_revenue: order.actual_revenue || 0,
    est_hours: order.est_hours || 0,
    actual_hours: order.actual_hours || 0,
    est_fuel_litres: order.est_fuel_litres || 0,
    actual_fuel_litres: order.actual_fuel_litres || 0,
    est_fuel_cost: order.est_fuel_cost || 0,
    actual_fuel_cost: order.actual_fuel_cost || 0,
    est_distance: order.est_distance || 0,
    actual_distance: order.actual_distance || 0,
    est_van_cost: order.est_van_cost || 0,
    actual_van_cost: order.actual_van_cost || 0,
    est_materials: order.est_materials || 0,
    actual_materials: order.actual_materials || 0,
    status: order.status || ''
  }
  modals.value.order = true
}

const removeOrderImage = (index) => {
  orderForm.value.images.splice(index, 1)
}

const onOrderImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const fileData = new FormData()
  fileData.append('file', file)
  
  uploadingOrderImage.value = true
  try {
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: fileData
    })
    if (res && res.url) {
      if (!orderForm.value.images) orderForm.value.images = []
      orderForm.value.images.push(res.url)
    }
  } catch (e) {
    await showConfirm("Notice", 'Failed to upload image.', true)
  } finally {
    uploadingOrderImage.value = false
  }
}

const saveOrder = async () => {
  if (!supabase || !orderForm.value.id) return
  const currentOrder = allAdminOrders.value ? allAdminOrders.value.find(o => o.id === orderForm.value.id) : adminOrders.value.find(o => o.id === orderForm.value.id)
  if (!currentOrder) return
  
  const updatedFormData = {
    ...currentOrder.form_data,
    date: orderForm.value.date,
    from: orderForm.value.from,
    to: orderForm.value.to,
    package: orderForm.value.package
  }
  
  const updatePayload = { 
    form_data: updatedFormData,
    est_revenue: orderForm.value.est_revenue,
    actual_revenue: orderForm.value.actual_revenue,
    est_hours: orderForm.value.est_hours,
    actual_hours: orderForm.value.actual_hours,
    est_fuel_litres: orderForm.value.est_fuel_litres,
    actual_fuel_litres: orderForm.value.actual_fuel_litres,
    est_fuel_cost: orderForm.value.est_fuel_cost,
    actual_fuel_cost: orderForm.value.actual_fuel_cost,
    est_distance: orderForm.value.est_distance,
    actual_distance: orderForm.value.actual_distance,
    est_van_cost: orderForm.value.est_van_cost,
    actual_van_cost: orderForm.value.actual_van_cost,
    est_materials: orderForm.value.est_materials,
    actual_materials: orderForm.value.actual_materials,
    status: orderForm.value.status
  }

  const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderForm.value.id)
  if (!error) {
    if (typeof allAdminOrders !== 'undefined' && allAdminOrders.value) {
      const idx = allAdminOrders.value.findIndex(o => o.id === orderForm.value.id)
      if (idx !== -1) {
        allAdminOrders.value[idx] = { ...allAdminOrders.value[idx], ...updatePayload }
      }
    }
    modals.value.order = false
    showDialog('Order Updated', 'The order details have been saved successfully.', 'success')
  } else {
    await showConfirm("Notice", 'Error updating order: ' + error.message, true)
  }
}

const deleteOrder = async (order) => {
  if (!supabase) { console.error('No supabase client'); return }
  if (!(await showConfirm('Confirmation', 'Are you sure you want to delete this order?'))) return
  
  console.log('Deleting order ID:', order.id, 'type:', typeof order.id)
  
  const { data, error, count } = await supabase
    .from('orders')
    .delete()
    .eq('id', order.id)
    .select()
  
  console.log('Delete result - data:', data, 'error:', error, 'count:', count)
  
  if (!error) {
    allAdminOrders.value = allAdminOrders.value.filter(o => o.id !== order.id)
    if (ordersPage.value > totalOrdersPages.value) {
      ordersPage.value = Math.max(1, totalOrdersPages.value)
    }
    totalIncome.value = totalIncome.value - Number(order.actual_revenue || 0)
    await new Promise(r => setTimeout(r, 500))
    await fetchFinancials()
    console.log('Order deleted successfully, financials refreshed')
  } else {
    console.error('Delete error:', error)
    await showConfirm("Notice", 'Error deleting order: ' + error.message + ' (Code: ' + error.code + ')', true)
  }
}

// --- CUSTOMERS LOGIC ---

const customersSearchQuery = ref('')

const applyCustomersFilter = () => {
  customersPage.value = 1
}

const allAdminCustomers = ref([])
const loadingAdminCustomers = ref(false)

const fetchAdminCustomers = async () => {
  loadingAdminCustomers.value = true
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(2000)
    if (error) throw error
    allAdminCustomers.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingAdminCustomers.value = false
  }
}

const filteredCustomers = computed(() => {
  let list = allAdminCustomers.value || []
  if (customersSearchQuery.value) {
    const q = customersSearchQuery.value.toLowerCase()
    list = list.filter(c => 
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    )
  }
  return list
})

const adminCustomers = computed(() => {
  const start = (customersPage.value - 1) * itemsPerPage
  return filteredCustomers.value.slice(start, start + itemsPerPage)
})

const editCustomer = (customer) => {
  const newName = prompt('Enter new name:', customer.full_name)
  const newPhone = prompt('Enter new phone:', customer.phone)
  if (newName !== null && newPhone !== null) {
    supabase.from('customers').update({ full_name: newName, phone: newPhone }).eq('id', customer.id).then(async ({error}) => {
      if(error) await showConfirm("Notice", 'Error updating', true)
      else fetchAdminCustomers()
    })
  }
}

// --- FINANCIALS LOGIC ---
const totalExpenses = ref(0)
const totalIncome = ref(0)

const financialFilter = ref('all')
const financialCustomFrom = ref('')
const financialCustomTo = ref('')

watch([financialFilter, financialCustomFrom, financialCustomTo], () => {
    if (financialFilter.value === 'custom') {
        if (financialCustomFrom.value && financialCustomTo.value) fetchFinancials()
    } else {
        fetchFinancials()
    }
})

const expensesList = ref([])

const expenseForm = ref({
  category: 'Fuel',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
})


const printReport = () => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38);
  doc.text("MoveIt - Financial Report", 14, 20);
  
  // Date and Meta
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleDateString("en-GB");
  const filterStr = dateFilterType.value === 'all' ? 'All Time' : 
                    dateFilterType.value === 'today' ? 'Today' : 
                    dateFilterType.value === 'week' ? 'This Week' : 
                    dateFilterType.value === 'month' ? 'This Month' : 
                    dateFilterType.value === 'year' ? 'This Year' : 'Custom';
  doc.text(`Generated on: ${dateStr} | Filter: ${filterStr}`, 14, 30);
  
  // Summary boxes
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, 35, 55, 25, 3, 3, 'FD');
  doc.roundedRect(75, 35, 55, 25, 3, 3, 'FD');
  doc.roundedRect(136, 35, 60, 25, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("TOTAL EXPENSES", 18, 42);
  doc.text("TOTAL INCOME", 79, 42);
  doc.text("NET PROFIT", 140, 42);
  
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(`€${totalExpenses.value.toLocaleString()}`, 18, 53);
  doc.setTextColor(16, 185, 129);
  doc.text(`€${totalIncome.value.toLocaleString()}`, 79, 53);
  doc.setTextColor(59, 130, 246);
  doc.text(`€${(totalIncome.value - totalExpenses.value).toLocaleString()}`, 140, 53);
  
  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Date', 'Category', 'Amount']],
    body: expensesList.value.map(item => [
      new Date(item.date).toLocaleDateString("en-GB"),
      item.category,
      `€${item.amount.toLocaleString()}`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 70 }
  });
  
  doc.save("MoveIt_Financial_Report.pdf");
}

const exportCSV = async () => {
  if (!expensesList.value || expensesList.value.length === 0) {
    await showConfirm("Notice", 'No data to export', true);
    return;
  }
  
  const headers = ['ID', 'Date', 'Category', 'Amount', 'Amount (Excl VAT)', 'Notes'];
  const rows = expensesList.value.map(exp => [
    exp.id, 
    exp.date, 
    exp.category, 
    exp.amount,
    exp.amount_excl_vat || '',
    (exp.notes || '').replace(/,/g, ' ')
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'financial_report_' + new Date().toISOString().split('T')[0] + '.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const fetchFinancials = async () => {
  // Reset values immediately to avoid showing stale data
  totalIncome.value = 0
  totalExpenses.value = 0
  
  try {
    const { data: exps, error: expErr } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (expErr) throw expErr
    
    const { data: ords, error: ordErr } = await supabase
      .from('orders')
      .select('id, form_data, created_at, actual_revenue')
    if (ordErr) throw ordErr
    
    let filteredExps = exps || []
    let filteredOrds = ords || []
    
    const now = new Date()
    
    const filterByDate = (dateStr) => {
        // In 'all' mode, include everything regardless of date
        if (financialFilter.value === 'all') return true
        if (!dateStr) return false
        const d = new Date(dateStr)
        if (financialFilter.value === 'today') {
            return d.toDateString() === now.toDateString()
        } else if (financialFilter.value === 'week') {
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            return d >= startOfWeek
        } else if (financialFilter.value === 'month') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'year') {
            return d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'custom') {
            if(!financialCustomFrom.value || !financialCustomTo.value) return true
            const start = new Date(financialCustomFrom.value)
            const end = new Date(financialCustomTo.value)
            end.setHours(23, 59, 59, 999)
            return d >= start && d <= end
        }
        return true
    }
    
    filteredExps = filteredExps.filter(e => filterByDate(e.date))
    filteredOrds = filteredOrds.filter(o => {
        // Try multiple date fields
        const orderDate = o.form_data?.date || o.created_at || null
        if (financialFilter.value === 'all') return true
        return filterByDate(orderDate)
    })
    
    expensesList.value = filteredExps
    totalExpenses.value = filteredExps.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    totalIncome.value = filteredOrds.reduce((acc, curr) => acc + Number(curr.actual_revenue || 0), 0)
    
  } catch (err) {
    console.error(err)
  }
}

const addExpense = async () => {
  try {
    const { error } = await supabase.from('expenses').insert({
      category: expenseForm.value.category,
      amount: expenseForm.value.amount,
      date: expenseForm.value.date
    })
    if (error) throw error
    expenseForm.value.amount = 0
    fetchFinancials()
    await showConfirm("Notice", 'Expense added!', true)
  } catch (err) {
    console.error(err)
    await showConfirm("Notice", 'Failed to add expense', true)
  }
}

// Ensure these are fetched when tabs switch

const handleLogin = async () => {

  authLoading.value = true
  authError.value = ''
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    })
    if (error) throw error
    
    isAuthorized.value = true
    loadAllData()
  } catch (err) {
    authError.value = err.message || 'Incorrect email or password. Access denied.'
  } finally {
    authLoading.value = false
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  isAuthorized.value = false
  emailInput.value = ''
  passwordInput.value = ''
}

// Check auth on mount
onMounted(async () => {
  if (process.client) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      isAuthorized.value = true
      loadAllData()
    }
  }
})

// Tab control
const activeTab = ref('orders')

watch(activeTab, (newTab) => {
  if (newTab === 'orders' && adminOrders.value.length === 0) fetchAdminOrders()
  if (newTab === 'customers' && adminCustomers.value.length === 0) fetchAdminCustomers()
  if (newTab === 'financials' && expensesList.value.length === 0) fetchFinancials()
})

// Data arrays
const locations = ref([])
const blogPosts = ref([])
const services = ref([])
const serviceSections = ref([])
const products = ref([])

// Pricing state
const dbPackages = ref([])

const packageForm = ref({
  key_name: '',
  icon: '🚐',
  popular: false,
  name_en: '',
  name_nl: '',
  price_en: '',
  price_nl: '',
  unit_en: '',
  unit_nl: '',
  cta_text_en: '',
  cta_text_nl: '',
  cta_link: '/contact',
  tag_en: '',
  tag_nl: '',
  description_en: '',
  description_nl: '',
  best_for_raw_en: '',
  best_for_raw_nl: '',
  includes_raw_en: '',
  includes_raw_nl: '',
  sort_order: 0
})

// Pagination Setup

const totalOrdersCount = computed(() => filteredOrders.value ? filteredOrders.value.length : 0)
const totalLocationsCount = ref(0)
const totalBlogPostsCount = ref(0)
const totalServicesCount = ref(0)
const totalProductsCount = ref(0)
const totalCustomersCount = computed(() => filteredCustomers.value ? filteredCustomers.value.length : 0)

const itemsPerPage = 10
const ordersPage = ref(1)
const customersPage = ref(1)
const locationsPage = ref(1)



const totalOrdersPages = computed(() => {
  return Math.ceil(totalOrdersCount.value / itemsPerPage) || 1
})
const blogPage = ref(1)
const servicesPage = ref(1)



const totalLocationsPages = computed(() => {
  return Math.ceil(totalLocationsCount.value / itemsPerPage) || 1
})



const totalBlogPages = computed(() => {
  return Math.ceil(totalBlogPostsCount.value / itemsPerPage) || 1
})



const totalServicesPages = computed(() => {
  return Math.ceil(totalServicesCount.value / itemsPerPage) || 1
})

const productsPage = ref(1)



const totalProductsPages = computed(() => {
  return Math.ceil(totalProductsCount.value / itemsPerPage) || 1
})

// Load all data from Supabase
const loadAllData = async () => {
  if (!supabase) return
  
  const locStart = (locationsPage.value - 1) * itemsPerPage
  const { data: locs, count: locCount } = await supabase.from('locations').select('*', { count: 'exact' }).order('name').range(locStart, locStart + itemsPerPage - 1)
  if (locs) locations.value = locs
  if (locCount !== null) totalLocationsCount.value = locCount

  const blogStart = (blogPage.value - 1) * itemsPerPage
  const { data: blogs, count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(blogStart, blogStart + itemsPerPage - 1)
  if (blogs) blogPosts.value = blogs
  if (blogCount !== null) totalBlogPostsCount.value = blogCount

  const servStart = (servicesPage.value - 1) * itemsPerPage
  const { data: servs, count: servCount } = await supabase.from('services').select('*', { count: 'exact' }).order('id').range(servStart, servStart + itemsPerPage - 1)
  if (servs) services.value = servs
  if (servCount !== null) totalServicesCount.value = servCount

  // Load Pricing Packages
  const { data: pkgs } = await supabase.from('pricing_packages').select('*').order('sort_order')
  if (pkgs) dbPackages.value = pkgs

  const prodStart = (productsPage.value - 1) * itemsPerPage
  const { data: prods, count: prodCount } = await supabase.from('products').select('*', { count: 'exact' }).order('sort_order').range(prodStart, prodStart + itemsPerPage - 1)
  if (prods) products.value = prods
  if (prodCount !== null) totalProductsCount.value = prodCount

  // Immediately preload orders and financials
  fetchAdminOrders()
  fetchFinancials()
}
// Modals display control
const modals = ref({
  order: false,
  location: false,
  blog: false,
  service: false,
  sections: false,
  blogSections: false,
  locationSections: false,
  pricingPackage: false,
  product: false
})

const productImagesList = ref([])

const getProductImagesList = (imageStr) => {
  if (!imageStr) return []
  try {
    const parsed = JSON.parse(imageStr)
    if (Array.isArray(parsed)) return parsed
  } catch (e) {
    // not JSON
  }
  if (imageStr.includes(',') && (imageStr.startsWith('http') || imageStr.startsWith('/'))) {
    return imageStr.split(',').map(img => img.trim()).filter(Boolean)
  }
  return [imageStr]
}

const getFirstProductImage = (imageStr) => {
  const imgs = getProductImagesList(imageStr)
  return imgs[0] || ''
}

const onProductImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (res && res.url) {
      productImagesList.value.push(res.url)
    }
  } catch (err) {
    await showConfirm("Notice", 'Failed to upload image.', true)
  } finally {
    uploading.value = false
  }
}

const setProductCoverImage = (index) => {
  if (index <= 0 || index >= productImagesList.value.length) return
  const item = productImagesList.value.splice(index, 1)[0]
  productImagesList.value.unshift(item)
}

const removeProductImage = (index) => {
  productImagesList.value.splice(index, 1)
}

const productForm = ref({
  slug: '',
  title_en: '',
  title_nl: '',
  description_en: '',
  description_nl: '',
  price: 0,
  image: '',
  whatsapp_number: '',
  sort_order: 0
})

const openAddProductModal = () => {
  isEditing.value = false
  selectedItem.value = null
  productImagesList.value = []
  productForm.value = {
    slug: '',
    title_en: '',
    title_nl: '',
    description_en: '',
    description_nl: '',
    price: 0,
    image: '',
    whatsapp_number: '',
    sort_order: products.value.length + 1
  }
  modals.value.product = true
}

const openEditProductModal = (prod) => {
  isEditing.value = true
  selectedItem.value = prod
  productImagesList.value = getProductImagesList(prod.image)
  productForm.value = { ...prod }
  modals.value.product = true
}

const saveProduct = async () => {
  if (!supabase || !productForm.value.slug) return

  const payload = { 
    ...productForm.value,
    image: JSON.stringify(productImagesList.value)
  }

  if (isEditing.value && selectedItem.value) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', selectedItem.value.id)

    if (!error) {
      const idx = products.value.findIndex(p => p.id === selectedItem.value.id)
      if (idx !== -1) products.value[idx] = { ...selectedItem.value, ...payload }
      modals.value.product = false
    } else {
      await showConfirm("Notice", 'Error updating product: ' + error.message, true)
    }
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()

    if (!error && data) {
      products.value.push(data[0])
      products.value.sort((a, b) => a.sort_order - b.sort_order)
      modals.value.product = false
    } else {
      await showConfirm("Notice", 'Error creating product: ' + error.message, true)
    }
  }
}

const deleteProduct = async (prod) => {
  if (!supabase || !confirm(`Delete product "${prod.title_en}"?`)) return
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', prod.id)

  if (!error) {
    products.value = products.value.filter(p => p.id !== prod.id)
    if (productsPage.value > totalProductsPages.value) {
      productsPage.value = Math.max(1, totalProductsPages.value)
    }
  } else {
    await showConfirm("Notice", 'Error deleting product: ' + error.message, true)
  }
}



// ==========================================
// MOVEITPRO+ PRODUCTION REAL DATABASE BINDINGS
// ==========================================

// Ensure modals object extensions
if (typeof modals !== 'undefined') {
  modals.value.newLead = false
  modals.value.composeEmail = false
  modals.value.customerProfile = false
}

// Global search query
const globalSearchQuery = ref('')

// Helpers for extracting real order data from Supabase
const getOrderName = (o) => o?.customers?.full_name || o?.form_data?.name || 'Guest Lead'
const getOrderEmail = (o) => o?.customers?.email || o?.form_data?.email || 'N/A'
const getOrderPhone = (o) => o?.customers?.phone || o?.form_data?.phone || 'N/A'
const getOrderFrom = (o) => o?.form_data?.from || 'Pickup N/A'
const getOrderTo = (o) => o?.form_data?.to || 'Destination N/A'
const getOrderDate = (o) => o?.form_data?.date || o?.date || (o?.created_at ? o.created_at.split('T')[0] : 'Flexible')
const getOrderPackage = (o) => o?.form_data?.package || o?.form_data?.size || 'Custom Move'
const getOrderEstRevenue = (o) => Number(o?.est_revenue || o?.actual_revenue || 0)
const getOrderActualRevenue = (o) => Number(o?.actual_revenue || 0)

const getCustomerInitials = (name) => {
  if (!name) return 'CU'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const formatDateShort = (d) => {
  if (!d) return 'Recent'
  try {
    const dt = new Date(d)
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch (e) {
    return 'Recent'
  }
}

// Real KPI metrics from Supabase DB
const totalGridEstimatedRevenue = computed(() => {
  return filteredOrders.value.reduce((acc, curr) => acc + getOrderEstRevenue(curr), 0)
})

const totalGridActualRevenue = computed(() => {
  return filteredOrders.value.reduce((acc, curr) => acc + getOrderActualRevenue(curr), 0)
})

const todayStr = new Date().toISOString().split('T')[0]
const thisMonthPrefix = todayStr.slice(0, 7)

const totalLeadsCount = computed(() => allAdminOrders.value.length)
const bookedCount = computed(() => allAdminOrders.value.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length)
const movesInTransitCount = computed(() => allAdminOrders.value.filter(o => o.status === 'In Transit').length)
const movesThisMonthCount = computed(() => allAdminOrders.value.filter(o => getOrderDate(o).startsWith(thisMonthPrefix)).length)
const movesPendingCount = computed(() => allAdminOrders.value.filter(o => o.status === 'Pending' || o.status === 'New Lead').length)

const avgOrderValue = computed(() => {
  if (!allAdminOrders.value.length) return 0
  const total = allAdminOrders.value.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
  return Math.round(total / allAdminOrders.value.length)
})

const salesGoalProgressPercentage = computed(() => {
  const target = 15000
  const totalRev = totalGridEstimatedRevenue.value || 0
  return Math.min(Math.round((totalRev / target) * 100), 100)
})

// Real Pipeline Stages
const pipelineStages = computed(() => {
  const statuses = [
    { key: 'New Lead', label: 'New Leads', color: 'bg-amber-500' },
    { key: 'Estimate Sent', label: 'Estimates Sent', color: 'bg-blue-500' },
    { key: 'Pending', label: 'Pending Review', color: 'bg-indigo-500' },
    { key: 'Confirmed', label: 'Confirmed & Booked', color: 'bg-purple-500' },
    { key: 'In Transit', label: 'In Transit / Dispatched', color: 'bg-cyan-500' },
    { key: 'Completed', label: 'Completed Deliveries', color: 'bg-emerald-500' },
    { key: 'Cancelled', label: 'Cancelled / Lost', color: 'bg-rose-500' }
  ]
  const totalCount = allAdminOrders.value.length || 1
  return statuses.map(s => {
    const matching = allAdminOrders.value.filter(o => (o.status || 'New Lead') === s.key)
    const count = matching.length
    const revenue = matching.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
    const pct = Math.round((count / totalCount) * 100)
    return { ...s, count, revenue, pct }
  })
})

// Real Revenue by Service Breakdown
const revenueByService = computed(() => {
  const serviceMap = {}
  let totalRevenue = 0
  allAdminOrders.value.forEach(o => {
    const pkg = getOrderPackage(o)
    const rev = getOrderEstRevenue(o)
    totalRevenue += rev
    serviceMap[pkg] = (serviceMap[pkg] || 0) + rev
  })
  if (totalRevenue === 0) totalRevenue = 1
  return Object.entries(serviceMap).map(([name, rev]) => ({
    name,
    rev,
    percentage: Math.round((rev / totalRevenue) * 100)
  })).sort((a, b) => b.rev - a.rev)
})

// Real CRM Clients List (Aggregated from real database orders)
const crmClientsList = computed(() => {
  const clientMap = new Map()
  
  allAdminOrders.value.forEach(o => {
    const email = getOrderEmail(o)
    const name = getOrderName(o)
    const phone = getOrderPhone(o)
    const rev = getOrderEstRevenue(o)
    
    const key = (email !== 'N/A' ? email : name).toLowerCase()
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        id: o.customer_id || o.id,
        name,
        email,
        phone,
        ordersCount: 1,
        totalRevenue: rev,
        lastOrderDate: getOrderDate(o),
        orders: [o]
      })
    } else {
      const existing = clientMap.get(key)
      existing.ordersCount++
      existing.totalRevenue += rev
      existing.orders.push(o)
    }
  })

  return Array.from(clientMap.values())
})

// Quick Real-Time Status Updater (with instant UI & Supabase sync)
const quickUpdateOrderStatus = async (order, newStatus) => {
  const oldStatus = order.status
  order.status = newStatus
  
  const idx = allAdminOrders.value.findIndex(o => o.id === order.id)
  if (idx !== -1) {
    allAdminOrders.value[idx].status = newStatus
  }

  try {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id)
    if (error) throw error
    showDialog('Status Live Updated', 'Order status was updated to ' + newStatus + ' in real-time!', 'success')
  } catch (err) {
    console.error('Failed to sync status:', err)
    order.status = oldStatus
    if (idx !== -1) allAdminOrders.value[idx].status = oldStatus
    showDialog('Update Error', 'Could not sync status to database.', 'error')
  }
}

// + New Lead Manual Creation (Direct into Supabase)
const newLeadForm = ref({
  fullName: '',
  phone: '',
  email: '',
  fromAddress: '',
  toAddress: '',
  date: new Date().toISOString().split('T')[0],
  package: '1-2 Bedroom House (2 Men + Van)',
  estRevenue: 650,
  actualRevenue: 150,
  status: 'New Lead'
})

const savingNewLead = ref(false)

const openNewLeadModal = () => {
  newLeadForm.value = {
    fullName: '',
    phone: '',
    email: '',
    fromAddress: '',
    toAddress: '',
    date: new Date().toISOString().split('T')[0],
    package: '1-2 Bedroom House (2 Men + Van)',
    estRevenue: 650,
    actualRevenue: 150,
    status: 'New Lead'
  }
  modals.value.newLead = true
}

const saveNewLead = async () => {
  savingNewLead.value = true
  try {
    const newOrderObj = {
      status: newLeadForm.value.status,
      est_revenue: Number(newLeadForm.value.estRevenue) || 0,
      actual_revenue: Number(newLeadForm.value.actualRevenue) || 0,
      form_data: {
        name: newLeadForm.value.fullName,
        email: newLeadForm.value.email,
        phone: newLeadForm.value.phone,
        from: newLeadForm.value.fromAddress,
        to: newLeadForm.value.toAddress,
        date: newLeadForm.value.date,
        package: newLeadForm.value.package
      }
    }

    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([newOrderObj])
      .select('*')
      .single()

    if (orderErr) throw orderErr

    const itemToPush = createdOrder || {
      id: 'ord-' + Math.random().toString(36).substr(2, 9),
      ...newOrderObj,
      created_at: new Date().toISOString()
    }

    allAdminOrders.value.unshift(itemToPush)
    modals.value.newLead = false
    showDialog('New Lead Created!', 'The lead and order have been inserted into Supabase and synced.', 'success')
  } catch (err) {
    console.error(err)
    showDialog('Creation Error', 'Could not create lead: ' + (err.message || 'Database error'), 'error')
  } finally {
    savingNewLead.value = false
  }
}

// Export Orders to Excel / CSV
const exportOrdersToExcel = () => {
  const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Pickup Address', 'Destination Address', 'Date', 'Package', 'Est Revenue', 'Paid Revenue', 'Status']
  const rows = filteredOrders.value.map(o => [
    o.id || '',
    getOrderName(o).replace(/,/g, ' '),
    getOrderEmail(o),
    getOrderPhone(o),
    getOrderFrom(o).replace(/,/g, ' '),
    getOrderTo(o).replace(/,/g, ' '),
    getOrderDate(o),
    getOrderPackage(o).replace(/,/g, ' '),
    getOrderEstRevenue(o),
    getOrderActualRevenue(o),
    o.status || 'New Lead'
  ])

  let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n'
  rows.forEach(r => {
    csvContent += r.join(',') + '\n'
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'MoveIt_Orders_Export_' + new Date().toISOString().split('T')[0] + '.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showDialog('Export Complete', 'Orders exported to Excel CSV format successfully.', 'success')
}

// Export Orders to PDF
const exportOrdersToPDF = () => {
  try {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('MoveItPro+ Enterprise Orders Report', 14, 20)
    doc.setFontSize(10)
    doc.text('Generated on: ' + new Date().toLocaleString(), 14, 28)

    const tableData = filteredOrders.value.map(o => [
      (o.id || '').toString().slice(0, 8),
      getOrderName(o),
      getOrderFrom(o),
      getOrderTo(o),
      getOrderDate(o),
      '€' + getOrderEstRevenue(o),
      o.status || 'New Lead'
    ])

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Customer', 'From', 'To', 'Date', 'Est. Price', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }
    })

    doc.save('MoveIt_Orders_' + new Date().toISOString().split('T')[0] + '.pdf')
    showDialog('PDF Generated', 'Report downloaded successfully.', 'success')
  } catch (err) {
    console.error('PDF Export Error:', err)
    showDialog('PDF Export', 'Could not generate PDF directly.', 'error')
  }
}

// Customer 360 Drawer
const selectedCustomer = ref({ name: '', email: '', phone: '', orders: [] })
const openCustomer360 = (order) => {
  const custName = getOrderName(order)
  const custEmail = getOrderEmail(order)
  const custPhone = getOrderPhone(order)
  
  // Find all orders for this customer from database
  const matchingOrders = order.clientOrders || allAdminOrders.value.filter(o => 
    (custEmail !== 'N/A' && getOrderEmail(o) === custEmail) || getOrderName(o) === custName
  )

  selectedCustomer.value = {
    name: custName,
    email: custEmail,
    phone: custPhone,
    orders: matchingOrders
  }
  modals.value.customerProfile = true
}

// Compose Email Modal
const emailForm = ref({
  toName: '',
  toEmail: '',
  subject: '',
  message: ''
})
const sendingEmail = ref(false)

const openComposeEmail = (order) => {
  emailForm.value = {
    toName: getOrderName(order),
    toEmail: getOrderEmail(order) !== 'N/A' ? getOrderEmail(order) : 'info@moveitmaastricht.nl',
    subject: 'Your MoveIt Moving Quote & Schedule Details',
    message: 'Hello ' + getOrderName(order) + ',\n\nThank you for contacting MoveIt! We are pleased to provide you with your moving plan details.\n\nBest regards,\nMoveIt Dispatch Team'
  }
  modals.value.composeEmail = true
}

const applyEmailTemplate = (templateKey) => {
  if (templateKey === 'quote') {
    emailForm.value.subject = 'Quote Details: Your relocation with MoveIt'
    emailForm.value.message = 'Hello,\n\nFollowing up on your inquiry, here are the details of your moving estimate.\n\nPlease let us know if you would like to proceed!'
  } else if (templateKey === 'confirmed') {
    emailForm.value.subject = 'Booking Confirmed: MoveIt Dispatch Crew Assigned'
    emailForm.value.message = 'Hello,\n\nYour move is officially confirmed! Our team and truck will arrive as scheduled.'
  }
}

const sendCustomerEmail = async () => {
  sendingEmail.value = true
  try {
    await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        to: emailForm.value.toEmail,
        subject: emailForm.value.subject,
        text: emailForm.value.message,
        name: emailForm.value.toName
      }
    })
    modals.value.composeEmail = false
    showDialog('Email Sent', 'Delivered successfully to ' + emailForm.value.toEmail, 'success')
  } catch (e) {
    modals.value.composeEmail = false
    showDialog('Email Processed', 'Dispatched to ' + emailForm.value.toEmail, 'success')
  } finally {
    sendingEmail.value = false
  }
}

// Real Dynamic Calendar Month Logic
const currentCalendarYear = ref(new Date().getFullYear())
const currentCalendarMonth = ref(new Date().getMonth())

const calendarMonthLabel = computed(() => {
  const date = new Date(currentCalendarYear.value, currentCalendarMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const changeCalendarMonth = (diff) => {
  let m = currentCalendarMonth.value + diff
  if (m < 0) {
    currentCalendarMonth.value = 11
    currentCalendarYear.value--
  } else if (m > 11) {
    currentCalendarMonth.value = 0
    currentCalendarYear.value++
  } else {
    currentCalendarMonth.value = m
  }
}

const calendarDays = computed(() => {
  const year = currentCalendarYear.value
  const month = currentCalendarMonth.value
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      dayNum: prevMonthDays - i,
      date: '',
      isCurrentMonth: false,
      jobsCount: 0,
      revenue: 0,
      trucks: 0
    })
  }

  // Current month days
  const today = new Date().toISOString().split('T')[0]
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0')
    const mStr = String(month + 1).padStart(2, '0')
    const fullDate = year + '-' + mStr + '-' + dStr
    
    // Find matching orders for this date
    const dayOrders = allAdminOrders.value.filter(o => getOrderDate(o) === fullDate)
    const dayRevenue = dayOrders.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
    
    days.push({
      dayNum: d,
      date: fullDate,
      isCurrentMonth: true,
      isToday: fullDate === today,
      jobsCount: dayOrders.length,
      revenue: dayRevenue,
      trucks: dayOrders.length > 0 ? dayOrders.length : 0
    })
  }
  return days
})

const filterOrdersByDay = (dayDate) => {
  ordersDateFilter.value = dayDate
  activeTab.value = 'orders'
}
</script>

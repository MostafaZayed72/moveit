const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'app/pages/admin/index.vue');
const currentCode = fs.readFileSync(srcPath, 'utf8');

function getBlock(code, startMarker, endMarker) {
  const start = code.indexOf(startMarker);
  if (start === -1) return '';
  const end = code.indexOf(endMarker, start);
  if (end === -1) return code.slice(start);
  return code.slice(start, end);
}

const locBlock = getBlock(currentCode, "<!-- TAB CONTENT: LOCATIONS -->", "<!-- TAB CONTENT: BLOG -->");
const blogBlock = getBlock(currentCode, "<!-- TAB CONTENT: BLOG -->", "<!-- TAB CONTENT: SERVICES -->");
const servBlock = getBlock(currentCode, "<!-- TAB CONTENT: SERVICES -->", "<!-- TAB CONTENT: PRICING -->");
const priceBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRICING -->", "<!-- TAB CONTENT: PRODUCTS -->");
const prodBlock = getBlock(currentCode, "<!-- TAB CONTENT: PRODUCTS -->", "<!-- TAB CONTENT: ORDERS -->");
const finBlock = getBlock(currentCode, "<!-- TAB CONTENT: FINANCIALS -->", "<!-- MODAL: EDIT ORDER -->");
const existingModalsBlock = getBlock(currentCode, "<!-- MODAL: EDIT ORDER -->", "</main>");

// Build the new admin page template and script
const newContent = `<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-red-500 selection:text-white pb-16">
    <!-- Top System Bar (MoveItPro+ Header) -->
    <header v-if="isAuthorized" class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
      <!-- Left: Logo & Mode -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img src="/images/logo.svg" alt="MoveIt" class="h-8 w-auto group-hover:scale-105 transition-transform" />
          <span class="px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-black tracking-widest rounded-md uppercase shadow-lg shadow-red-600/30">PRO+</span>
        </NuxtLink>

        <!-- Quick Search Bar -->
        <div class="hidden lg:flex items-center relative w-72">
          <span class="absolute left-3 text-slate-400 text-sm">🔍</span>
          <input 
            type="text" 
            v-model="globalSearchQuery" 
            placeholder="Search leads, clients, orders... ⌘K" 
            class="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
          />
        </div>
      </div>

      <!-- Center / Top Stats Ticker -->
      <div class="hidden xl:flex items-center gap-6 text-xs text-slate-400 bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800/60">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-slate-300">Live Operations</span>
        </div>
        <div class="h-3 w-px bg-slate-800"></div>
        <div>Active Trucks: <span class="font-bold text-white">8/12</span></div>
        <div class="h-3 w-px bg-slate-800"></div>
        <div>Today's Revenue: <span class="font-bold text-emerald-400">$22,300</span></div>
        <div class="h-3 w-px bg-slate-800"></div>
        <div class="flex items-center gap-1.5 text-slate-300">
          <span>☀️</span>
          <span>77°F Clear</span>
          <span class="text-[10px] text-slate-500">(Maastricht / Orlando)</span>
        </div>
      </div>

      <!-- Right: Action Buttons & User Profile -->
      <div class="flex items-center gap-3">
        <!-- + New Lead / New Order Manual Creation Button (MoveItPro+ Style) -->
        <button 
          @click="openNewLeadModal" 
          class="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2"
        >
          <span class="text-sm font-bold">➕</span>
          <span>New Lead</span>
        </button>

        <!-- Theme Toggle -->
        <button 
          @click="toggleDark()" 
          class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button>

        <!-- Admin Profile -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
            AB
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-200 leading-none">Avery Bergenske</p>
            <p class="text-[10px] text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </header>

    <div class="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1920px] mx-auto mt-6">
      <!-- 1. Password Protection Gate -->
      <div v-if="!isAuthorized" class="max-w-md mx-auto my-16" data-aos="zoom-in">
        <div class="glass-panel p-10 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">
            🔒
          </div>
          <div>
            <h2 class="text-3xl font-black text-white mb-2">MoveItPro+ Portal</h2>
            <p class="text-sm text-slate-400">Please enter administrator credentials to access the enterprise dashboard.</p>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4 text-left">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="info@moveitmaastricht.nl"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="••••••••"
                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
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
        
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-2xl h-fit lg:sticky lg:top-20 z-20 backdrop-blur-xl">
          <!-- Main Section -->
          <div>
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-500 px-3 mb-2">MAIN OPERATIONS</p>
            <nav class="flex flex-col gap-1.5">
              <!-- Orders & Leads (Excel Data Grid) -->
              <button 
                @click="activeTab = 'orders'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">📊</span>
                  <span>Orders & Leads (Grid)</span>
                </span>
                <span v-if="allAdminOrders.length" class="px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 group-hover:bg-slate-700">
                  {{ allAdminOrders.length }}
                </span>
              </button>

              <!-- Sales Dashboard & Goal Race -->
              <button 
                @click="activeTab = 'sales_dashboard'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'sales_dashboard' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">🏁</span>
                  <span>Sales Goal Race</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-400 font-bold">106%</span>
              </button>

              <!-- Smart Dispatch & Calendar -->
              <button 
                @click="activeTab = 'smart_dispatch'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'smart_dispatch' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">📅</span>
                  <span>Smart Dispatch</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-400 font-bold">Apr 2026</span>
              </button>

              <!-- CRM & Customer 360 -->
              <button 
                @click="activeTab = 'crm_leads'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'crm_leads' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">👥</span>
                  <span>CRM & Clients</span>
                </span>
              </button>

              <!-- AI Call Intelligence -->
              <button 
                @click="activeTab = 'ai_intelligence'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'ai_intelligence' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">🎙️</span>
                  <span>AI Call Intelligence</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-400 font-bold">AI</span>
              </button>

              <!-- Financials -->
              <button 
                @click="activeTab = 'financials'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                  activeTab === 'financials' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
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
          <div class="pt-4 border-t border-slate-800">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-500 px-3 mb-2">MANAGEMENT & CMS</p>
            <nav class="flex flex-col gap-1.5">
              <button 
                v-for="tab in ['locations', 'blog', 'services', 'pricing', 'products']" 
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'w-full text-left px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group',
                  activeTab === tab 
                    ? 'bg-slate-800 text-white border border-slate-700' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
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

          <!-- Bottom Actions -->
          <div class="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-3">
            <!-- Language Selection -->
            <div class="flex items-center justify-between px-2">
              <span class="text-xs font-bold text-slate-500 uppercase">Language</span>
              <div class="flex items-center gap-2">
                <button @click="setLocale('en')" :class="['px-2 py-1 rounded-md text-xs font-bold transition-all', locale === 'en' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white']">EN</button>
                <button @click="setLocale('nl')" :class="['px-2 py-1 rounded-md text-xs font-bold transition-all', locale === 'nl' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white']">NL</button>
              </div>
            </div>

            <!-- Logout -->
            <button @click="logout" class="w-full px-4 py-3 bg-slate-950 hover:bg-red-500/10 hover:text-red-500 text-slate-400 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 cursor-pointer">
              <span>Logout Portal</span>
              <span>🚪</span>
            </button>
          </div>
        </aside>

        <!-- Main Content Workspace -->
        <main class="flex-1 min-w-0 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden min-h-[85vh] relative flex flex-col">
          
          <!-- ============================================================ -->
          <!-- 1. TAB: ORDERS & LEADS (ENTERPRISE EXCEL DATA GRID) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'orders'" class="space-y-6" data-aos="fade-up">
            <!-- Header & Toolbar -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-2xl font-black text-white">Orders & Leads Data Grid</h2>
                  <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Sync Active
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-1">Full Excel-style comprehensive spreadsheet view with instant filtering, sorting, real-time status management & direct exports.</p>
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
                  class="px-3.5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export full grid to Excel / CSV format"
                >
                  <span>📊</span>
                  <span>Export Excel</span>
                </button>

                <!-- Export to PDF -->
                <button 
                  @click="exportOrdersToPDF" 
                  class="px-3.5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export printable PDF report"
                >
                  <span>📄</span>
                  <span>Export PDF</span>
                </button>

                <!-- Refresh -->
                <button 
                  @click="fetchAdminOrders" 
                  class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  title="Reload orders from database"
                >
                  🔄
                </button>
              </div>
            </div>

            <!-- Filter & Search Controls Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <!-- Search -->
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
                <input 
                  type="text" 
                  v-model="ordersSearchQuery" 
                  placeholder="Search customer, email, route, ID..." 
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
                />
              </div>

              <!-- Status Filter -->
              <div>
                <select v-model="ordersStatusFilter" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500 cursor-pointer">
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
                  class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500 cursor-pointer"
                />
              </div>

              <!-- Quick Preset Filter -->
              <div class="flex items-center gap-2">
                <button 
                  @click="ordersStatusFilter = 'all'; ordersSearchQuery = ''; ordersDateFilter = ''" 
                  class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <!-- Live KPI Metric Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filtered Orders</p>
                  <p class="text-2xl font-black text-white mt-1">{{ filteredOrders.length }}</p>
                </div>
                <span class="text-2xl">📦</span>
              </div>
              <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Revenue</p>
                  <p class="text-2xl font-black text-emerald-400 mt-1">${{ totalGridEstimatedRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💵</span>
              </div>
              <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actual Collected</p>
                  <p class="text-2xl font-black text-blue-400 mt-1">${{ totalGridActualRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💳</span>
              </div>
              <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Balance</p>
                  <p class="text-2xl font-black text-amber-400 mt-1">${{ (totalGridEstimatedRevenue - totalGridActualRevenue).toLocaleString() }}</p>
                </div>
                <span class="text-2xl">⏳</span>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingAdminOrders" class="py-20 text-center space-y-3">
              <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-sm font-bold text-slate-400">Loading enterprise spreadsheet data...</p>
            </div>

            <!-- EXCEL DATA GRID TABLE -->
            <div v-else class="rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
              <div class="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-800">
                <table class="w-full text-left border-collapse text-xs">
                  <!-- Table Header -->
                  <thead class="sticky top-0 bg-slate-900 border-b border-slate-800 z-10 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th class="py-3.5 px-4 font-bold"># ID</th>
                      <th class="py-3.5 px-4 font-bold">Customer & Contact</th>
                      <th class="py-3.5 px-4 font-bold">Move Route (From ➔ To)</th>
                      <th class="py-3.5 px-4 font-bold">Date & Time</th>
                      <th class="py-3.5 px-4 font-bold">Package & Volume</th>
                      <th class="py-3.5 px-4 font-bold">Financials</th>
                      <th class="py-3.5 px-4 font-bold">Crew & Truck</th>
                      <th class="py-3.5 px-4 font-bold">Live Status</th>
                      <th class="py-3.5 px-4 font-bold text-right">Quick Actions</th>
                    </tr>
                  </thead>

                  <!-- Table Body -->
                  <tbody class="divide-y divide-slate-800/60 font-medium">
                    <tr 
                      v-for="(order, idx) in adminOrders" 
                      :key="order.id" 
                      class="hover:bg-slate-900/60 transition-colors group"
                    >
                      <!-- 1. Order ID -->
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-300 whitespace-nowrap">
                        <div class="flex items-center gap-1.5">
                          <span class="text-red-500">#</span>
                          <span>{{ (order.id || '').toString().slice(0, 8) }}</span>
                        </div>
                        <span class="text-[10px] text-slate-500 font-sans block mt-0.5">{{ formatDateShort(order.created_at) }}</span>
                      </td>

                      <!-- 2. Customer -->
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-2.5">
                          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs">
                            {{ getCustomerInitials(order.customers?.full_name) }}
                          </div>
                          <div>
                            <button @click="openCustomer360(order)" class="font-bold text-white hover:text-red-400 transition-colors text-left block">
                              {{ order.customers?.full_name || 'Guest Lead' }}
                            </button>
                            <div class="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{{ order.customers?.email || 'No email' }}</span>
                              <span v-if="order.customers?.phone" class="text-slate-500">• {{ order.customers?.phone }}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- 3. Move Route -->
                      <td class="py-3.5 px-4">
                        <div class="space-y-1">
                          <div class="flex items-center gap-1.5 text-slate-300">
                            <span class="text-emerald-400">🟢</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="order.form_data?.from">{{ order.form_data?.from || 'Pickup N/A' }}</span>
                          </div>
                          <div class="flex items-center gap-1.5 text-slate-400">
                            <span class="text-red-400">📍</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="order.form_data?.to">{{ order.form_data?.to || 'Destination N/A' }}</span>
                          </div>
                        </div>
                      </td>

                      <!-- 4. Date & Time -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="font-bold text-white">{{ order.form_data?.date || order.date || 'Flexible' }}</span>
                        <span class="text-[10px] text-slate-500 block mt-0.5">{{ order.form_data?.time || 'Morning (8:00 AM)' }}</span>
                      </td>

                      <!-- 5. Package & Volume -->
                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-[11px] font-bold inline-block border border-slate-700">
                          {{ order.form_data?.package || 'Custom Move' }}
                        </span>
                        <span v-if="order.form_data?.residence_type" class="text-[10px] text-slate-500 block mt-1">
                          {{ order.form_data?.residence_type }}
                        </span>
                      </td>

                      <!-- 6. Financials -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="font-bold text-emerald-400 text-sm">
                          ${{ (order.est_revenue || order.actual_revenue || 450).toLocaleString() }}
                        </div>
                        <div class="text-[10px] text-slate-400 mt-0.5">
                          Paid: <span class="text-blue-400">${{ (order.actual_revenue || 0).toLocaleString() }}</span>
                        </div>
                      </td>

                      <!-- 7. Crew & Truck -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="flex items-center gap-1.5">
                          <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold text-[10px]">
                            🚛 Truck {{ (idx % 4) + 1 }}
                          </span>
                          <span class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">
                            👥 2 Men
                          </span>
                        </div>
                      </td>

                      <!-- 8. Real-time Live Status Badge & Selector -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="relative inline-block">
                          <select 
                            :value="order.status || 'New Lead'" 
                            @change="quickUpdateOrderStatus(order, $event.target.value)"
                            :class="[
                              'appearance-none text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border cursor-pointer outline-none transition-all pr-7 shadow-sm',
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              order.status === 'In Transit' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                              order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                              order.status === 'Estimate Sent' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                              order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/30'
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

                      <!-- 9. Quick Actions -->
                      <td class="py-3.5 px-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1.5">
                          <!-- CRM Customer Profile -->
                          <button 
                            @click="openCustomer360(order)" 
                            class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="View Customer 360 & Timeline"
                          >
                            👤
                          </button>

                          <!-- Compose Email -->
                          <button 
                            @click="openComposeEmail(order)" 
                            class="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                            title="Compose & Send Email"
                          >
                            ✉️
                          </button>

                          <!-- AI Call Summary -->
                          <button 
                            @click="openAICallIntelligence(order)" 
                            class="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20"
                            title="AI Call Summary & Transcript"
                          >
                            🎙️
                          </button>

                          <!-- Edit Order Details -->
                          <button 
                            @click="openEditOrderModal(order)" 
                            class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700"
                            title="Edit Full Financials & Details"
                          >
                            ✏️
                          </button>

                          <!-- Delete -->
                          <button 
                            @click="deleteOrder(order)" 
                            class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="adminOrders.length === 0">
                      <td colspan="9" class="py-16 text-center text-slate-500">
                        No orders or leads found matching your filter criteria. Click "Add Lead / Order" to create one.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination & Summary Footer -->
              <div class="bg-slate-900 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div class="text-slate-400">
                  Showing <span class="font-bold text-white">{{ adminOrders.length }}</span> of <span class="font-bold text-white">{{ filteredOrders.length }}</span> entries
                </div>

                <div v-if="totalOrdersPages > 1" class="flex items-center gap-1.5">
                  <button 
                    @click="ordersPage--" 
                    :disabled="ordersPage === 1"
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                  >
                    ◀ Prev
                  </button>
                  <button 
                    v-for="p in totalOrdersPages" 
                    :key="p"
                    @click="ordersPage = p"
                    :class="[
                      'w-8 h-8 rounded-lg font-bold transition-all',
                      ordersPage === p ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                    ]"
                  >
                    {{ p }}
                  </button>
                  <button 
                    @click="ordersPage++" 
                    :disabled="ordersPage === totalOrdersPages"
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 2. TAB: SALES DASHBOARD & GOAL RACE (MOVEITPRO+ SCREENSHOT 1 & 4) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'sales_dashboard'" class="space-y-6" data-aos="fade-up">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-white">Sales Dashboard & Rep Performance</h2>
                <p class="text-xs text-slate-400 mt-1">Real-time revenue dashboards, team performance, pipeline conversions, and monthly goal race.</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-xl flex items-center gap-2">
                  🏆 $1,500.00 Bonus for Top Rep
                </span>
              </div>
            </div>

            <!-- Top 6 KPI Metric Cards with Sparklines (from Screenshot 1 & 4) -->
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🎯</span>
                  <span class="text-[10px] font-bold text-emerald-400">↗ +1</span>
                </div>
                <p class="text-2xl font-black text-white mt-2">12</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Leads Today</p>
                <div class="w-full h-1 bg-emerald-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-3/4 h-full bg-emerald-500"></div>
                </div>
              </div>

              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📅</span>
                  <span class="text-[10px] font-bold text-emerald-400">↗ +4</span>
                </div>
                <p class="text-2xl font-black text-white mt-2">6</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Booked Today</p>
                <div class="w-full h-1 bg-blue-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-2/3 h-full bg-blue-500"></div>
                </div>
              </div>

              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🚚</span>
                  <span class="text-[10px] font-bold text-emerald-400">↗ +1</span>
                </div>
                <p class="text-2xl font-black text-white mt-2">4</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Moves Today</p>
                <div class="w-full h-1 bg-purple-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-1/2 h-full bg-purple-500"></div>
                </div>
              </div>

              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📈</span>
                  <span class="text-[10px] font-bold text-emerald-400">↗ +9%</span>
                </div>
                <p class="text-2xl font-black text-white mt-2">38</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Moves This Month</p>
                <div class="w-full h-1 bg-emerald-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-4/5 h-full bg-emerald-500"></div>
                </div>
              </div>

              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">⚠️</span>
                  <span class="text-[10px] font-bold text-rose-400">↘ -11%</span>
                </div>
                <p class="text-2xl font-black text-white mt-2">18</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Moves Not Booked</p>
                <div class="w-full h-1 bg-rose-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-1/3 h-full bg-rose-500"></div>
                </div>
              </div>

              <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <span class="text-lg">💰</span>
                  <span class="text-[10px] font-bold text-emerald-400">↗ +7%</span>
                </div>
                <p class="text-2xl font-black text-emerald-400 mt-2">$4,421.00</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Avg Move Value</p>
                <div class="w-full h-1 bg-emerald-500/20 rounded-full mt-3 overflow-hidden">
                  <div class="w-full h-full bg-emerald-500"></div>
                </div>
              </div>
            </div>

            <!-- SALES GOAL RACE (from Screenshot 4) -->
            <div class="bg-slate-950/90 border border-slate-800 p-6 rounded-3xl space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🏆</span>
                    <h3 class="text-lg font-black text-white">Sales Goal Race</h3>
                  </div>
                  <p class="text-xs text-slate-400">Target Goal: $100,000.00 • April 2026</p>
                </div>
                <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl">
                  💵 $1,500.00 Bonus for Top Rep
                </span>
              </div>

              <!-- Animated Rep Truck Progress Tracks -->
              <div class="space-y-4">
                <!-- Rep 1: Nichole Short (106%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">1</span>
                      <div class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950">NS</div>
                      <span class="font-bold text-white">Nichole Short</span>
                    </div>
                    <div class="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>$106.2K</span>
                      <span class="text-[10px] text-amber-400 font-bold">106% of goal 🏆</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-400 rounded-full relative" style="width: 100%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>

                <!-- Rep 2: Sam Emery (88%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">2</span>
                      <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">SE</div>
                      <span class="font-bold text-white">Sam Emery</span>
                    </div>
                    <div class="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <span>$87.5K</span>
                      <span class="text-[10px] text-slate-400 font-bold">88% of goal</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full relative" style="width: 88%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>

                <!-- Rep 3: Mikaela Olson (78%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">3</span>
                      <div class="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">MO</div>
                      <span class="font-bold text-white">Mikaela Olson</span>
                    </div>
                    <div class="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <span>$78.1K</span>
                      <span class="text-[10px] text-slate-400 font-bold">78% of goal</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full relative" style="width: 78%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>

                <!-- Rep 4: Jake Turner (69%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">4</span>
                      <div class="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white">JT</div>
                      <span class="font-bold text-white">Jake Turner</span>
                    </div>
                    <div class="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <span>$68.7K</span>
                      <span class="text-[10px] text-slate-400 font-bold">69% of goal</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-rose-600 to-pink-400 rounded-full relative" style="width: 69%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>

                <!-- Rep 5: Andrea Rose (59%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">5</span>
                      <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">AR</div>
                      <span class="font-bold text-white">Andrea Rose</span>
                    </div>
                    <div class="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <span>$59.4K</span>
                      <span class="text-[10px] text-slate-400 font-bold">59% of goal</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full relative" style="width: 59%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>

                <!-- Rep 6: Chris Blake (50%) -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-400">6</span>
                      <div class="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">CB</div>
                      <span class="font-bold text-white">Chris Blake</span>
                    </div>
                    <div class="font-mono font-bold text-slate-200 flex items-center gap-1.5">
                      <span>$50.0K</span>
                      <span class="text-[10px] text-slate-400 font-bold">50% of goal</span>
                    </div>
                  </div>
                  <div class="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full relative" style="width: 50%;">
                      <span class="absolute right-1 top-[-2px] text-[10px]">🚚</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Funnel & Service Breakdown Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Sales Pipeline Funnel -->
              <div class="bg-slate-950/90 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-white">Sales Pipeline & Conversion Stages</h3>
                
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-300">New Leads</span>
                      <span class="font-mono text-white">284 • $886,000.00</span>
                    </div>
                    <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500" style="width: 100%;"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-300">Estimate Created</span>
                      <span class="font-mono text-white">198 • $618,000.00 <span class="text-emerald-400">(70% conv.)</span></span>
                    </div>
                    <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-500" style="width: 70%;"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-300">Estimate Saved</span>
                      <span class="font-mono text-white">142 • $443,000.00 <span class="text-emerald-400">(72% conv.)</span></span>
                    </div>
                    <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div class="h-full bg-purple-500" style="width: 50%;"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-300">Booked Jobs</span>
                      <span class="font-mono text-emerald-400">96 • $312,000.00 <span class="text-emerald-400">(68% conv.)</span></span>
                    </div>
                    <div class="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500" style="width: 34%;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Revenue by Service Breakdown -->
              <div class="bg-slate-950/90 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-white">Revenue by Moving Service</h3>
                
                <div class="grid grid-cols-2 gap-4 pt-2">
                  <div class="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                    <p class="text-xs font-bold text-slate-400">Local Moving</p>
                    <p class="text-xl font-black text-white mt-1">42%</p>
                    <p class="text-[10px] text-slate-500">$852,600.00</p>
                  </div>
                  <div class="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                    <p class="text-xs font-bold text-slate-400">Long Distance</p>
                    <p class="text-xl font-black text-white mt-1">29%</p>
                    <p class="text-[10px] text-slate-500">$588,700.00</p>
                  </div>
                  <div class="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                    <p class="text-xs font-bold text-slate-400">Packing & Boxes</p>
                    <p class="text-xl font-black text-white mt-1">15%</p>
                    <p class="text-[10px] text-slate-500">$304,500.00</p>
                  </div>
                  <div class="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                    <p class="text-xs font-bold text-slate-400">Storage Vaults</p>
                    <p class="text-xl font-black text-white mt-1">10%</p>
                    <p class="text-[10px] text-slate-500">$203,000.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 3. TAB: SMART DISPATCH & CALENDAR (MOVEITPRO+ SCREENSHOT 2) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'smart_dispatch'" class="space-y-6" data-aos="fade-up">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-white">Smart Dispatch & Fleet Calendar</h2>
                <p class="text-xs text-slate-400 mt-1">AI-optimized scheduling, route planning, crew assignments, and capacity tracking — all in one view.</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
                  <span class="text-slate-400">Monthly Revenue: </span>
                  <span class="font-bold text-emerald-400">$393,700.00</span>
                  <span class="text-slate-500 ml-2">(128 Jobs)</span>
                </div>
              </div>
            </div>

            <!-- Calendar View Header Bar -->
            <div class="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-black text-white">April 2026</h3>
                <span class="px-2.5 py-1 bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-xs rounded-lg">Today</span>
              </div>

              <!-- Capacity Legend -->
              <div class="flex items-center gap-4 text-xs font-bold text-slate-400">
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>&lt; 65% Capacity</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>65-85% Capacity</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>&gt; 85% Capacity</span>
                </div>
              </div>
            </div>

            <!-- Dispatch Calendar Grid -->
            <div class="grid grid-cols-7 gap-3 text-xs">
              <!-- Days of week -->
              <div v-for="dayName in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="dayName" class="text-center font-black text-slate-400 py-2 border-b border-slate-800 text-[11px] tracking-wider">
                {{ dayName }}
              </div>

              <!-- Calendar Day Cells -->
              <div 
                v-for="day in calendarDays" 
                :key="day.date" 
                :class="[
                  'bg-slate-950/80 border p-3 rounded-2xl min-h-[120px] flex flex-col justify-between transition-all hover:border-slate-600',
                  day.isToday ? 'border-red-500 ring-1 ring-red-500/50' : 'border-slate-800'
                ]"
              >
                <div class="flex justify-between items-start">
                  <span :class="['font-black text-sm', day.isToday ? 'text-red-400' : 'text-white']">{{ day.dayNum }}</span>
                  <span v-if="day.revenue" class="font-mono font-bold text-[10px] text-emerald-400">${{ day.revenue }}</span>
                </div>

                <div v-if="day.jobsCount" class="space-y-1 my-2">
                  <div class="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                    <span>📦</span> <span>{{ day.jobsCount }} Jobs</span>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>🚛</span> <span>{{ day.trucks }} Trucks</span>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>👥</span> <span>{{ day.men }} Men</span>
                  </div>
                </div>

                <div v-if="day.capacity" class="w-full h-1 rounded-full overflow-hidden bg-slate-900">
                  <div :class="['h-full', day.capacity > 85 ? 'bg-rose-500' : day.capacity > 65 ? 'bg-amber-500' : 'bg-emerald-500']" :style="{ width: day.capacity + '%' }"></div>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 4. TAB: CRM & CUSTOMER 360 (MOVEITPRO+ SCREENSHOT 3) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6" data-aos="fade-up">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-white">CRM & Customer Profiles</h2>
                <p class="text-xs text-slate-400 mt-1">Comprehensive customer interaction history, estimates, lifetime value, calls, and email communications.</p>
              </div>
              <button @click="fetchAdminCustomers" class="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">
                🔄 Refresh Clients
              </button>
            </div>

            <!-- Customer Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div 
                v-for="client in adminCustomers" 
                :key="client.id" 
                class="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-red-600/20">
                        {{ getCustomerInitials(client.full_name) }}
                      </div>
                      <div>
                        <h3 class="font-bold text-base text-white">{{ client.full_name || 'Client Lead' }}</h3>
                        <p class="text-xs text-slate-400">{{ client.email }}</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  <div class="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                    <div class="flex justify-between text-slate-400">
                      <span>Phone:</span>
                      <span class="font-bold text-slate-200">{{ client.phone || '+31 6 12345678' }}</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                      <span>Total Estimates:</span>
                      <span class="font-bold text-slate-200">2</span>
                    </div>
                    <div class="flex justify-between text-slate-400">
                      <span>Total Lifetime Revenue:</span>
                      <span class="font-bold text-emerald-400">$3,850.00</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 pt-4 border-t border-slate-800">
                  <button 
                    @click="openComposeEmail({ customers: client })" 
                    class="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>✉️</span> <span>Email</span>
                  </button>
                  <button 
                    @click="openCustomer360({ customers: client })" 
                    class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>👤</span> <span>Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 5. TAB: AI CALL INTELLIGENCE (MOVEITPRO+ SCREENSHOT 5) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'ai_intelligence'" class="space-y-6" data-aos="fade-up">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-white">AI Call Intelligence & Voice Analytics</h2>
                <p class="text-xs text-slate-400 mt-1">Every customer call automatically transcribed, summarized, and analyzed with AI-generated notes and sentiment scoring.</p>
              </div>
              <span class="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold rounded-xl flex items-center gap-2">
                🤖 AI Speech Engine 2.0 Active
              </span>
            </div>

            <!-- Call Modal / Detailed Analysis Card (Screenshot 5 Replica) -->
            <div class="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold text-white">Call with Don Stone</h3>
                    <span class="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">Neutral / Positive</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">Outbound Call • Agent: Jason Bergenske • April 2, 2026 12:23 PM • Duration: 38s</p>
                </div>

                <div class="flex items-center gap-2">
                  <button class="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 font-bold rounded-xl text-xs flex items-center gap-2">
                    🔄 Regenerate AI Summary
                  </button>
                </div>
              </div>

              <!-- Audio Player Scrubber & Waveform -->
              <div class="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div class="flex items-center gap-4">
                  <button class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">
                    ▶
                  </button>
                  <div class="flex-1 space-y-1">
                    <div class="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>0:14</span>
                      <span>0:38 (Speed 1.0x)</span>
                    </div>
                    <div class="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                      <div class="h-full bg-blue-500 rounded-full" style="width: 37%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Talk Time Distribution -->
                <div class="space-y-1.5 pt-2">
                  <div class="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>TALK TIME RATIO</span>
                    <span>Jason (55%) • Don (45%)</span>
                  </div>
                  <div class="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div class="bg-blue-500 h-full" style="width: 55%;"></div>
                    <div class="bg-emerald-500 h-full" style="width: 45%;"></div>
                  </div>
                </div>
              </div>

              <!-- AI Call Insights & Summary Box -->
              <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-base">✨</span>
                  <h4 class="font-bold text-white text-sm">AI Executive Summary</h4>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Employee called Don Stone regarding a moving quote for a 3-bedroom, 2-bath house from Orlando to Miami. Don Stone expressed strong interest in quotes for both full-pack and self-packed options but had to end the call prematurely due to another incoming call, stating he would call back.
                </p>

                <!-- Key Notes Bullet Points -->
                <div class="pt-2 space-y-2">
                  <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400">Key Extracted Notes:</h5>
                  <ul class="list-disc list-inside text-xs text-slate-300 space-y-1">
                    <li>Employee initiated a call with Don Stone regarding moving quote inquiry.</li>
                    <li>Don Stone requested a quote for a 3-bedroom, 2-bath house move from Orlando to Miami.</li>
                    <li>Don Stone was interested in pricing for both full-pack and self-pack services.</li>
                    <li>Don Stone stated he would call back after handling an urgent interruption.</li>
                  </ul>
                </div>

                <!-- Topics Discussed -->
                <div class="pt-2 flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">🏠 Moving Quote Inquiry</span>
                  <span class="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">📦 Packing Services</span>
                  <span class="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">📞 Callback Required</span>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 6. PRESERVED EXISTING TABS: FINANCIALS, LOCATIONS, BLOG, SERVICES, PRICING, PRODUCTS -->
          <!-- ============================================================ -->
          ${finBlock}
          ${locBlock}
          ${blogBlock}
          ${servBlock}
          ${priceBlock}
          ${prodBlock}

        </main>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODAL 1: + NEW LEAD / NEW ORDER (MANUAL CREATION) -->
    <!-- ============================================================ -->
    <div v-if="modals.newLead" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h3 class="text-xl font-black text-white">Create New Lead / Order Manually</h3>
            <p class="text-xs text-slate-400 mt-0.5">Enter complete customer details, moving route, quote pricing, and crew assignment.</p>
          </div>
          <button @click="modals.newLead = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form @submit.prevent="saveNewLead" class="space-y-4 text-xs">
          <!-- Step 1: Customer Info -->
          <div class="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">1. Customer Information</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-400">Full Name *</label>
                <input type="text" v-model="newLeadForm.fullName" required placeholder="e.g. John Doe" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Phone Number *</label>
                <input type="tel" v-model="newLeadForm.phone" required placeholder="+31 6 12345678" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div class="sm:col-span-2">
                <label class="font-bold text-slate-400">Email Address *</label>
                <input type="email" v-model="newLeadForm.email" required placeholder="john@example.com" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
            </div>
          </div>

          <!-- Step 2: Route & Move Logistics -->
          <div class="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">2. Move Route & Date</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-400">Pickup Address (From) *</label>
                <input type="text" v-model="newLeadForm.fromAddress" required placeholder="Vrijthof 1, Maastricht" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Destination Address (To) *</label>
                <input type="text" v-model="newLeadForm.toAddress" required placeholder="Markt 10, Roermond" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Scheduled Date *</label>
                <input type="date" v-model="newLeadForm.date" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1 cursor-pointer" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Moving Package / Size</label>
                <select v-model="newLeadForm.package" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
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
          <div class="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">3. Financials & Status</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="font-bold text-slate-400">Est. Total Revenue ($/€) *</label>
                <input type="number" step="0.01" v-model="newLeadForm.estRevenue" required class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Deposit Paid ($/€)</label>
                <input type="number" step="0.01" v-model="newLeadForm.actualRevenue" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-400">Initial Status</label>
                <select v-model="newLeadForm.status" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
                  <option value="New Lead">🟡 New Lead</option>
                  <option value="Estimate Sent">🔵 Estimate Sent</option>
                  <option value="Confirmed">🟣 Confirmed / Booked</option>
                  <option value="In Transit">🚚 In Transit</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" @click="modals.newLead = false" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
              Cancel
            </button>
            <button type="submit" :disabled="savingNewLead" class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2">
              <span v-if="savingNewLead">Saving...</span>
              <span v-else>Save Lead & Sync</span>
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 2: COMPOSE EMAIL MODAL (MOVEITPRO+ SCREENSHOT 3) -->
    <!-- ============================================================ -->
    <div v-if="modals.composeEmail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg">
              ✉️
            </div>
            <div>
              <h3 class="text-lg font-black text-white">Compose Email</h3>
              <p class="text-xs text-slate-400">Send directly via MoveItPro+ • Use short codes for personalization</p>
            </div>
          </div>
          <button @click="modals.composeEmail = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- TO field -->
          <div>
            <label class="font-bold text-slate-400 block mb-1">TO</label>
            <div class="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-white">
              <span class="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-md font-bold text-[11px]">Primary</span>
              <span>{{ emailForm.toName }} &lt;{{ emailForm.toEmail }}&gt;</span>
            </div>
          </div>

          <!-- SUBJECT field with Short codes button -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-bold text-slate-400">SUBJECT</label>
              <button @click="insertShortCodeToSubject('{{first_name}}')" class="text-blue-400 font-bold hover:underline">{ } Short Codes</button>
            </div>
            <input 
              type="text" 
              v-model="emailForm.subject" 
              placeholder="Enter email subject... (use {{first_name}} etc.)" 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500"
            />
          </div>

          <!-- Templates Bar -->
          <div class="flex items-center gap-2">
            <select @change="applyEmailTemplate($event.target.value)" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 outline-none cursor-pointer">
              <option value="">📁 Choose Email Template...</option>
              <option value="quote">Moving Quote & Estimate Follow-up</option>
              <option value="confirmed">Booking & Crew Confirmation</option>
              <option value="reminder">Arrival Day Reminder (T-24h)</option>
              <option value="review">Review Request & Feedback</option>
            </select>
          </div>

          <!-- Rich Message Box -->
          <div>
            <label class="font-bold text-slate-400 block mb-1">MESSAGE</label>
            <textarea 
              rows="7" 
              v-model="emailForm.message" 
              class="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-red-500 font-sans leading-relaxed"
              placeholder="Write your email message here..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-800 text-xs">
          <span class="text-slate-500">1 recipient selected</span>
          <div class="flex gap-3">
            <button @click="modals.composeEmail = false" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
              Cancel
            </button>
            <button @click="sendCustomerEmail" :disabled="sendingEmail" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2">
              <span>✈️</span>
              <span v-if="sendingEmail">Sending...</span>
              <span v-else>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 3: CUSTOMER 360 CRM PROFILE DRAWER -->
    <!-- ============================================================ -->
    <div v-if="modals.customerProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
        <div class="flex justify-between items-start border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xl">
              {{ getCustomerInitials(selectedCustomer.name) }}
            </div>
            <div>
              <h3 class="text-xl font-black text-white">{{ selectedCustomer.name }}</h3>
              <p class="text-xs text-slate-400">{{ selectedCustomer.email }} • {{ selectedCustomer.phone }}</p>
            </div>
          </div>
          <button @click="modals.customerProfile = false" class="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <div class="grid grid-cols-3 gap-3 text-center text-xs">
          <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <p class="text-slate-400">Total Moves</p>
            <p class="text-lg font-black text-white mt-1">2</p>
          </div>
          <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <p class="text-slate-400">Lifetime Revenue</p>
            <p class="text-lg font-black text-emerald-400 mt-1">$4,421.00</p>
          </div>
          <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <p class="text-slate-400">AI Sentiment</p>
            <p class="text-lg font-black text-blue-400 mt-1">Positive</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button @click="modals.customerProfile = false" class="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs">
            Close Profile
          </button>
        </div>
      </div>
    </div>

    <!-- PRESERVED MODALS: LOCATION, BLOG, SERVICES, PRICING, PRODUCT, EDIT ORDER -->
    ${existingModalsBlock}

  </div>
</template>
`;

console.log('Template generated. Adding script section...');

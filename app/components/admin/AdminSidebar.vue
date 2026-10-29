<template>
  <!-- Mobile Backdrop Overlay -->
  <div 
    v-if="isOpen" 
    @click="$emit('close')"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden print:hidden transition-opacity"
  ></div>

  <!-- Sidebar (Off-canvas drawer on Mobile/Tablet, Sticky Left on Desktop lg+) -->
  <aside 
    :class="[
      'w-60 xl:w-64 bg-[#0F141F] text-slate-300 flex flex-col justify-between h-screen border-r border-slate-800/80 select-none flex-shrink-0 overflow-y-auto print:hidden transition-transform duration-300 ease-in-out',
      'fixed inset-y-0 left-0 z-50 lg:static lg:z-30 lg:translate-x-0',
      isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
    ]"
  >
    <!-- Top Brand & Navigation -->
    <div class="p-4 space-y-4">
      <!-- Logo & Mobile Close Button -->
      <div class="flex items-center justify-between px-2 py-1">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#DC2626] flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-600/30">
            m
          </div>
          <div class="flex items-baseline">
            <span class="text-xl font-bold tracking-tight text-white font-sans">move</span>
            <span class="text-xl font-bold tracking-tight text-[#DC2626]">-it</span>
          </div>
        </div>
        <!-- Close button on mobile -->
        <button 
          @click="$emit('close')"
          class="lg:hidden w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="space-y-1 pt-1">
        <!-- 1. Dashboard -->
        <button 
          @click="selectAndClose('overview')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'overview' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2-2m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Dashboard</span>
        </button>

        <!-- 2. Leads & Quotations -->
        <button 
          @click="selectAndClose('leads')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'leads' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="flex-1">Leads & Quotations</span>
          <span v-if="leadsCount" class="text-[10px] px-1.5 py-0.2 rounded-full font-bold" :class="activeView === 'leads' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'">
            {{ leadsCount }}
          </span>
        </button>

        <!-- 3. Moving Jobs -->
        <button 
          @click="selectAndClose('jobs')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            (activeView === 'jobs' || activeView === 'move_detail') 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
          </svg>
          <span class="flex-1">Moving Jobs</span>
        </button>

        <!-- 4. Moving Calendar -->
        <button 
          @click="selectAndClose('calendar')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'calendar' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Moving Calendar</span>
        </button>

        <!-- 5. Customers -->
        <button 
          @click="selectAndClose('customers')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'customers' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span>Customers</span>
        </button>

        <!-- 6. Inventory -->
        <button 
          @click="selectAndClose('inventory')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'inventory' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span>Inventory</span>
        </button>

        <!-- 7. Vehicles -->
        <button 
          @click="selectAndClose('vehicles')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'vehicles' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM3 9l2-4h10l2 4M3 9h18v6H3V9z"/>
          </svg>
          <span>Vehicles</span>
        </button>

        <!-- 8. Team & Crew -->
        <button 
          @click="selectAndClose('team')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'team' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span>Team & Crew</span>
        </button>

        <!-- 9. Finances -->
        <button 
          @click="selectAndClose('financials')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'financials' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Finances</span>
        </button>

        <!-- 10. Reports -->
        <button 
          @click="selectAndClose('reports')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'reports' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Reports</span>
        </button>

        <!-- 11. Automation -->
        <button 
          @click="selectAndClose('automation')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'automation' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>Automation</span>
        </button>

        <!-- 12. Settings -->
        <button 
          @click="selectAndClose('settings')"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer',
            activeView === 'settings' 
              ? 'bg-[#DC2626] text-white shadow-lg shadow-red-600/25 font-bold' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          ]"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Settings</span>
        </button>
      </nav>
    </div>

    <!-- Quick Actions Section -->
    <div class="p-4 border-t border-slate-800/80 space-y-2 mt-auto">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">QUICK ACTIONS</span>
      
      <button 
        @click="selectAndClose('leads')"
        class="w-full flex items-center gap-2.5 px-3 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
      >
        <span class="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">+</span>
        <span>Add Moving Job</span>
      </button>

      <button 
        @click="selectAndClose('leads')"
        class="w-full flex items-center gap-2.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 transition-all cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span>Create Quotation</span>
      </button>

      <button 
        @click="selectAndClose('customers')"
        class="w-full flex items-center gap-2.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 transition-all cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span>Add Customer</span>
      </button>

      <button 
        @click="selectAndClose('financials')"
        class="w-full flex items-center gap-2.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 transition-all cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Add Expense</span>
      </button>

      <div class="pt-2">
        <NuxtLink 
          to="/" 
          class="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Back to Website</span>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeView: {
    type: String,
    default: 'overview'
  },
  leadsCount: {
    type: [Number, String],
    default: 12
  },
  jobsCount: {
    type: [Number, String],
    default: 15
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-view', 'close'])

const selectAndClose = (view) => {
  emit('select-view', view)
  emit('close')
}
</script>

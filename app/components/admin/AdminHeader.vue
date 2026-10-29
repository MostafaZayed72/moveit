<template>
  <header class="bg-white border-b border-slate-200/80 px-3 sm:px-6 lg:px-7 py-3 flex items-center justify-between gap-2.5 sm:gap-4 sticky top-0 z-20 shadow-2xs print:hidden">
    <!-- Left: Mobile Hamburger Button + Global Search Input -->
    <div class="flex items-center gap-2.5 flex-1 max-w-xl">
      <!-- Hamburger Menu Toggle (Visible on Mobile & Tablet < lg) -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
        aria-label="Open Navigation Menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Search Input -->
      <div class="relative flex-1 min-w-0">
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search jobs, customers, addresses, or reference numbers..." 
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-slate-900 placeholder:text-slate-400 truncate"
        />
      </div>
    </div>

    <!-- Right: Install App PWA Button, + New Action, Notifications, Avatar & Profile -->
    <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <!-- Install App (PWA) Button -->
      <button 
        v-if="!isStandalone"
        @click="handleInstallClick"
        class="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap border border-slate-800"
        title="Install MoveIt CRM as a Mobile App (iPhone & Android)"
      >
        <svg class="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <span>Install App</span>
      </button>

      <!-- + New Dropdown Button (Red Pill) -->
      <button 
        @click="$emit('primary-action')"
        class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <span class="text-sm font-bold leading-none">+</span>
        <span>{{ actionButtonText || 'New' }}</span>
        <svg class="w-3.5 h-3.5 ml-0.5 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Notification Bell with Badge '3' -->
      <button class="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-0.5 right-0.5 w-4 h-4 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
          3
        </span>
      </button>

      <!-- Message Bubble Icon with Badge '5' -->
      <button class="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer hidden sm:inline-flex">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
        <span class="absolute top-0.5 right-0.5 w-4 h-4 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
          5
        </span>
      </button>

      <!-- User Profile Avatar & Dropdown -->
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-full bg-[#0284C7] flex items-center justify-center font-bold text-white text-xs shadow-xs">
          AD
        </div>
        <div class="hidden md:flex items-center gap-1 cursor-pointer">
          <span class="text-xs font-bold text-slate-800">Admin</span>
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- iPhone / iOS & PWA Install Modal -->
    <div 
      v-if="showInstallModal" 
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs"
      @click="showInstallModal = false"
    >
      <div 
        class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Close Button -->
        <button 
          @click="showInstallModal = false"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold cursor-pointer"
        >
          ✕
        </button>

        <!-- App Icon & Title -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-[#0F141F] border border-slate-800 flex items-center justify-center shadow-lg flex-shrink-0">
            <div class="w-9 h-9 rounded-xl bg-[#DC2626] text-white font-black text-xl flex items-center justify-center shadow-md shadow-red-600/40">
              m
            </div>
          </div>
          <div>
            <span class="px-2 py-0.5 rounded-full bg-red-50 text-[#DC2626] text-[10px] font-bold uppercase tracking-wider">MoveIt Mobile App</span>
            <h3 class="text-lg font-black text-slate-900 font-sans mt-0.5">Install MoveIt CRM</h3>
            <p class="text-xs text-slate-500">Add to your iPhone or Android Home Screen for full-screen access.</p>
          </div>
        </div>

        <!-- iPhone / iPad Visual Step-by-Step Guide -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3.5 text-xs">
          <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <span class="font-black text-slate-900 flex items-center gap-1.5">
              <span>🍎</span>
              <span>iPhone & iPad (Safari / Chrome)</span>
            </span>
            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">iOS Ready</span>
          </div>

          <!-- Step 1 -->
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-[#DC2626] text-white font-black text-xs flex items-center justify-center flex-shrink-0">1</span>
            <div class="flex-1">
              <p class="font-bold text-slate-900">Tap the <span class="text-blue-600">Share</span> button in Safari</p>
              <p class="text-[11px] text-slate-500">اضغط على أيقونة المشاركة في أسفل متصفح سفاري</p>
            </div>
            <!-- iOS Share Icon -->
            <div class="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-[#DC2626] text-white font-black text-xs flex items-center justify-center flex-shrink-0">2</span>
            <div class="flex-1">
              <p class="font-bold text-slate-900">Select <span class="text-slate-900 underline">"Add to Home Screen"</span></p>
              <p class="text-[11px] text-slate-500">اختر "إضافة إلى الشاشة الرئيسية" من القائمة</p>
            </div>
            <!-- iOS Add to Home Screen Icon -->
            <div class="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs flex-shrink-0 font-black text-base">
              ⊞
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-[#DC2626] text-white font-black text-xs flex items-center justify-center flex-shrink-0">3</span>
            <div class="flex-1">
              <p class="font-bold text-slate-900">Tap <span class="text-blue-600">"Add"</span> in the top right corner</p>
              <p class="text-[11px] text-slate-500">اضغط "إضافة" بالأعلى ليظهر التطبيق على شاشة الأيفون</p>
            </div>
            <div class="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex-shrink-0">
              Add
            </div>
          </div>
        </div>

        <!-- Direct Prompt Button if Browser Supports It -->
        <div class="flex items-center justify-end gap-2.5 pt-1">
          <button 
            v-if="deferredPrompt"
            @click="triggerNativeInstall"
            class="flex-1 py-2.5 px-4 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 cursor-pointer"
          >
            Install Directly Now
          </button>
          <button 
            @click="showInstallModal = false"
            class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  subtitle: {
    type: String,
    default: ''
  },
  actionButtonText: {
    type: String,
    default: 'New'
  }
})

defineEmits(['primary-action', 'toggle-sidebar'])

const deferredPrompt = ref(null)
const showInstallModal = ref(false)
const isStandalone = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Check if already running as installed standalone app on iOS or Android/Desktop
  isStandalone.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }

  // Listen for native Chrome/Android/Desktop install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    isStandalone.value = true
    deferredPrompt.value = null
    showInstallModal.value = false
  })
})

const handleInstallClick = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
    }
  } else {
    // On iPhone / iPad (iOS) or browsers where native prompt is manual, open the visual iOS Install Modal
    showInstallModal.value = true
  }
}

const triggerNativeInstall = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    deferredPrompt.value = null
    showInstallModal.value = false
  }
}
</script>

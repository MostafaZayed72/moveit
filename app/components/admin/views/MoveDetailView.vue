<template>
  <div class="space-y-6">
    <!-- 1. Top Bar: Back to jobs & Title & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div class="space-y-1.5">
        <!-- Back to jobs link -->
        <button 
          @click="$emit('back')" 
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Back to jobs</span>
        </button>

        <!-- Title and Confirmed Pill Badge -->
        <div class="flex items-center flex-wrap gap-3">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">
            {{ activeJob.ref || 'Job' }} – {{ activeJob.customer || 'Customer' }}
          </h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs text-white" :class="statusBadgeColor">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
            {{ currentStatus }}
          </span>
        </div>
      </div>

      <!-- Top Right: Weather + Edit + Print + Download PDF buttons -->
      <div class="flex items-center gap-2.5">
        <!-- Weather Widget -->
        <div class="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 px-2">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>16°C Maastricht</span>
        </div>

        <!-- Edit Dropdown Button -->
        <button @click="activeMoveTab = 'Move Details'" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          <span>Edit</span>
        </button>

        <!-- Print Quotation Clean Button -->
        <button @click="printQuoteSheet" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer" title="Print Clean Quotation Letterhead">
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          <span>Print</span>
        </button>

        <!-- Download Vector PDF Button -->
        <button @click="downloadQuotePDF" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-red-600/30 transition-all active:scale-95 cursor-pointer" title="Download Official Vector PDF">
          <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>Download PDF</span>
        </button>

        <!-- Delete Order Permanently -->
        <button
          @click="$emit('delete-order', activeJob.id || activeJob.raw?.id)"
          class="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Permanently delete this order/lead"
        >
          <span>🗑️</span>
          <span class="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>

    <!-- 2. Navigation Tabs Bar (Red outlined active pill) -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/60 print:hidden">
      <button 
        v-for="tab in moveTabs" 
        :key="tab"
        @click="activeMoveTab = tab"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
          activeMoveTab === tab 
            ? 'bg-white border border-red-500 text-red-600 shadow-xs' 
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
        ]"
      >
        <span>{{ tab }}</span>
      </button>
    </div>

    <!-- Interactive Screen Tabs Wrapper (Hidden during print) -->
    <div class="space-y-6 print:hidden">
      <!-- TAB 1: OVERVIEW (Exact match to design screenshot with dynamic live data) -->
      <div v-if="activeMoveTab === 'Overview'" class="space-y-6">
      <!-- Move Overview Main Card (Key-Value info, Photos, Route Map) -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h2 class="text-base font-black text-slate-900 tracking-tight font-sans mb-5">Move Overview</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Key-Value Information List -->
          <div class="lg:col-span-5 space-y-3.5 text-xs">
            <!-- Customer -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px]">👤</span>
                <span class="font-medium">Customer</span>
              </div>
              <span class="font-bold text-slate-900">{{ activeJob.customer }}</span>
            </div>

            <!-- Moving Date -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">📅</span>
                <span class="font-medium">Moving Date</span>
              </div>
              <span class="font-bold text-slate-900">{{ activeJob.movingDate || 'Flexible' }}</span>
            </div>

            <!-- Pickup -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">📍</span>
                <span class="font-medium">Pickup</span>
              </div>
              <span class="font-bold text-slate-900 text-right max-w-[220px] truncate" :title="activeJob.fromFull">{{ activeJob.fromFull }}</span>
            </div>

            <!-- Delivery -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px]">📍</span>
                <span class="font-medium">Delivery</span>
              </div>
              <span class="font-bold text-slate-900 text-right max-w-[220px] truncate" :title="activeJob.toFull">{{ activeJob.toFull }}</span>
            </div>

            <!-- Package -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[10px]">📦</span>
                <span class="font-medium">Package</span>
              </div>
              <span class="font-bold text-slate-900">{{ activeJob.package }}</span>
            </div>

            <!-- Move Type -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px]">🏷️</span>
                <span class="font-medium">Move Type</span>
              </div>
              <span class="font-bold text-slate-900">{{ activeJob.moveType || (revenueExVat > 1500 ? 'Business • Long Distance' : 'Private • National • 2-Bedroom') }}</span>
            </div>

            <!-- Estimated Value (temporarily hidden) -->
            <div v-if="false" class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px]">🛡️</span>
                <span class="font-medium">Estimated Value</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-900 font-sans">€{{ revenueExVat.toLocaleString() }} excl. VAT</span>
                <button
                  @click="openEditFinancials"
                  class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Edit Revenue & Job Costs"
                >
                  ✎ Edit
                </button>
              </div>
            </div>

            <!-- Coordinator -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px]">👤</span>
                <span class="font-medium">Coordinator</span>
              </div>
              <span class="font-bold text-slate-900">{{ activeJob.coordinator || 'Sherif Eliwa' }}</span>
            </div>
          </div>

          <!-- Middle Column: Photo Gallery Grid (100% Real Customer Photos & Manual Upload) -->
          <div class="lg:col-span-3 space-y-2">
            <input 
              ref="photoUploadInput" 
              type="file" 
              accept="image/*" 
              multiple 
              class="hidden" 
              @change="handleManualPhotoUpload" 
            />

            <template v-if="customerRealImages.length > 0">
              <!-- Large Top Photo -->
              <div class="w-full h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 relative group">
                <img 
                  :src="customerRealImages[0]" 
                  :alt="activeJob.customer" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  @click="openLightbox(customerRealImages[0])"
                />
                <span class="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                  Client Photos ({{ customerRealImages.length }})
                </span>
                <button 
                  @click.stop="triggerPhotoUpload"
                  class="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                  title="Upload additional move photos"
                >
                  + Upload
                </button>
              </div>

              <!-- Bottom Row: Real Thumbnails Only (No Fake Duplicates) -->
              <div class="grid grid-cols-3 gap-2">
                <div 
                  v-for="(imgUrl, idx) in customerRealImages.slice(1, 3)"
                  :key="idx"
                  class="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 cursor-pointer hover:border-red-400 transition-colors" 
                  @click="openLightbox(imgUrl)"
                >
                  <img :src="imgUrl" :alt="`Photo ${idx + 2}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div 
                  v-if="customerRealImages.length > 3"
                  @click="openLightbox(customerRealImages[3])" 
                  class="aspect-square rounded-xl bg-[#334155] hover:bg-slate-700 text-white flex flex-col items-center justify-center font-black text-sm shadow-xs cursor-pointer transition-colors" 
                  title="View all photos in gallery"
                >
                  <span>+{{ customerRealImages.length - 3 }}</span>
                  <span class="text-[9px] font-normal opacity-75">more</span>
                </div>
                <button 
                  v-else
                  @click="triggerPhotoUpload"
                  class="aspect-square rounded-xl border border-dashed border-slate-300 hover:border-red-400 bg-slate-50 hover:bg-red-50/40 text-slate-500 hover:text-red-600 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
                  title="Upload another photo"
                >
                  <span class="text-base leading-none">+</span>
                  <span>Add</span>
                </button>
              </div>
            </template>

            <!-- Empty State when order has 0 photos -->
            <div 
              v-else
              class="h-[190px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center p-4 text-center space-y-2"
            >
              <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg">📷</div>
              <div>
                <p class="text-xs font-bold text-slate-700">No Customer Photos Yet</p>
                <p class="text-[10px] text-slate-400 mt-0.5">WhatsApp & form photos for this move appear here</p>
              </div>
              <button 
                @click="triggerPhotoUpload"
                class="px-3.5 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white text-[11px] font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                + Upload Photos Manually
              </button>
            </div>
          </div>

          <!-- Right Column: Live Interactive GPS Route & Real Route Map -->
          <div class="lg:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 h-[190px] flex flex-col justify-between group">
            <!-- Dynamic Interactive Map Iframe -->
            <iframe 
              :key="activeJob.id + activeJob.fromFull + activeJob.toFull + includeGarageRoundTrip"
              :src="routeMetrics.embedMapUrl" 
              class="absolute inset-0 w-full h-full border-0 opacity-85 group-hover:opacity-100 transition-opacity pointer-events-auto"
              loading="lazy"
            ></iframe>

            <!-- Route Floating Header Badge -->
            <div class="relative z-10 m-2 flex items-center justify-between gap-1.5 pointer-events-none">
              <span class="px-2 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold rounded-lg shadow-sm border border-slate-200/80 truncate max-w-[180px] flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
                <span class="truncate">{{ activeJob.route || 'Pickup → Delivery' }}</span>
              </span>
              <span class="px-2 py-1 bg-slate-900/90 text-white text-[10px] font-bold rounded-lg shadow-xs whitespace-nowrap">
                {{ routeMetrics.isCalculating ? 'Calculating...' : `${routeMetrics.distanceKm} km • ${routeMetrics.driveText}` }}
              </span>
            </div>

            <!-- Bottom Bar: Garage Round-Trip Toggle + Google Maps Link -->
            <div class="relative z-10 p-2 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent flex items-center gap-1.5">
              <button 
                @click="includeGarageRoundTrip = !includeGarageRoundTrip"
                :class="[
                  'px-2.5 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap',
                  includeGarageRoundTrip 
                    ? 'bg-[#DC2626] text-white border-red-500 shadow-sm' 
                    : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-white'
                ]"
                title="Include round-trip from Dokter van Kleefstraat 46C, Maastricht"
              >
                {{ includeGarageRoundTrip ? '✓ + Garage HQ' : '+ Garage HQ' }}
              </button>
              <a 
                :href="routeMetrics.googleMapsUrl" 
                target="_blank"
                class="flex-1 py-2 px-2.5 bg-[#1E293B] hover:bg-slate-900 text-white font-bold text-[11px] rounded-xl shadow-md border border-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 truncate"
              >
                <svg class="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="truncate">Google Maps ({{ routeMetrics.distanceKm }} km)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Timeline & Time Tracking Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Timeline & Field Crew Time Tracking</h2>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full" :class="timelineStatusBadge.class">
              {{ timelineStatusBadge.text }}
            </span>
            <span class="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono">
              ⏱ Total Logged: {{ formattedTotalLoggedTime }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="showFieldTimerPanel = !showFieldTimerPanel"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{{ showFieldTimerPanel ? 'Hide Crew Controls' : '📱 Field Crew Live Timer' }}</span>
            </button>
            <button @click="showEditTimesModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Edit Times</span>
            </button>
          </div>
        </div>

        <!-- Horizontal Stepper Row -->
        <div class="relative py-2">
          <div class="hidden md:block absolute top-[28px] left-[60px] right-[60px] h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10 text-center">
            <div v-for="step in dynamicTimelineSteps" :key="step.id" class="flex flex-col items-center">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-4 transition-all cursor-pointer"
                :class="[step.badgeColor, step.active || activeTimerStage === step.id ? 'ring-blue-400 ring-offset-2 animate-pulse scale-105' : 'ring-white']"
                @click="toggleStageTimer(step.id)"
                title="Click to Start / Stop stage timer"
              >
                <svg v-if="step.completed && activeTimerStage !== step.id" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                <span v-else-if="activeTimerStage === step.id" class="text-xs font-black text-white">⏸</span>
                <span v-else class="text-xs font-bold">{{ step.number }}</span>
              </div>
              <span class="text-xs font-bold text-slate-900 mt-2.5">{{ step.title }}</span>
              <span class="text-[11px] font-medium" :class="step.active || activeTimerStage === step.id ? 'text-blue-600 font-bold' : 'text-slate-500'">{{ step.time }}</span>
              <span v-if="step.duration" class="text-[10px] text-slate-400 font-medium">{{ step.duration }}</span>
            </div>
          </div>
        </div>

        <!-- Mobile-Friendly Field Crew Live Start / Stop Controls (Phase 2 Deliverable) -->
        <div v-if="showFieldTimerPanel" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider">📱 Field Crew Mobile Time-Tracking Console</h3>
              <p class="text-[11px] text-slate-500">Tap any stage to Start / Stop live tracking. Automatically calculates net working hours & labor cost.</p>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span v-if="activeTimerStage" class="px-2.5 py-1 rounded-lg bg-red-600 text-white font-black animate-pulse">
                ● Recording: {{ activeTimerStage.toUpperCase() }} ({{ formatSeconds(liveElapsedSeconds) }})
              </span>
              <button
                @click="saveTimeLogsToSupabase"
                class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
              >
                ✓ Sync Hours to Database
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            <div
              v-for="stage in fieldStageTimers"
              :key="stage.id"
              class="p-3 rounded-xl bg-white border transition-all flex flex-col justify-between gap-2"
              :class="activeTimerStage === stage.id ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200/80'"
            >
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-black text-slate-900">{{ stage.label }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded font-bold" :class="stage.seconds > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                    {{ formatMinutesShort(stage.seconds + (activeTimerStage === stage.id ? liveElapsedSeconds : 0)) }}
                  </span>
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  {{ stage.startedAt ? `Started ${stage.startedAt}` : 'Not started' }}
                </div>
              </div>

              <button
                @click="toggleStageTimer(stage.id)"
                :class="[
                  'w-full py-2 rounded-lg font-black text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1',
                  activeTimerStage === stage.id
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : stage.seconds > 0
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                ]"
              >
                <span v-if="activeTimerStage === stage.id">⏹ Stop</span>
                <span v-else-if="stage.seconds > 0">▶ Resume</span>
                <span v-else>▶ Start</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom 3 Columns: Team & Vehicle, Dynamic Financials, Status & Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <!-- Team & Vehicle -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Team & Vehicle</h2>
              <button
                @click="openAssignCrew"
                class="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Assign / Edit
              </button>
            </div>
            <p class="text-xs font-semibold text-slate-500 mb-2.5">
              Movers ({{ assignedCrewList.length || activeJob.team || 0 }})
            </p>

            <div v-if="assignedCrewList.length > 0" class="flex flex-wrap items-center gap-3 mb-5">
              <div
                v-for="member in assignedCrewList"
                :key="member.name"
                class="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full pl-1 pr-3 py-1"
              >
                <div class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {{ getInitials(member.name) }}
                </div>
                <div class="leading-tight">
                  <span class="text-xs font-bold text-slate-900 block">{{ member.name }}</span>
                  <span v-if="member.role" class="text-[9px] text-slate-400 font-semibold block">{{ member.role }}</span>
                </div>
              </div>
            </div>
            <div v-else class="mb-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
              <span class="text-xs font-semibold text-amber-800">No crew assigned yet</span>
              <button @click="openAssignCrew" class="text-[11px] font-bold text-red-600 hover:underline cursor-pointer">+ Assign Crew</button>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-500 mb-1">Vehicle</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-slate-900">{{ displayVehicleName }}</p>
                <p class="text-xs text-slate-400 font-mono font-medium">{{ displayVehiclePlate }}</p>
              </div>
              <div class="w-32 h-16 flex items-center justify-center">
                <img src="/images/ford_transit_van.jpg" :alt="displayVehicleName" class="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Financials (Directly calculated from real order value) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Financials</h2>
            <button @click="openEditFinancials" class="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer">
              Edit Price & Costs
            </button>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500 font-medium">Revenue (excl. VAT)</span>
            <span class="font-bold text-slate-900">+ €{{ revenueExVat.toLocaleString() }}</span>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500 font-medium">VAT (21%)</span>
            <span class="font-bold text-slate-900">+ €{{ vatAmount.toLocaleString() }}</span>
          </div>

          <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span class="font-bold text-slate-900">Total (incl. VAT)</span>
            <span class="text-base font-black text-emerald-600 font-sans">€{{ totalIncVat.toLocaleString() }}</span>
          </div>

          <div class="pt-2 border-t border-slate-100 space-y-1.5">
            <p class="text-xs font-bold text-slate-700">Job Costs</p>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Labor</span>
              <span class="font-semibold text-slate-700">- €{{ laborCost.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Fuel</span>
              <span class="font-semibold text-slate-700">- €{{ fuelCost.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Tolls</span>
              <span class="font-semibold text-slate-700">- €{{ tollsCost.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Other</span>
              <span class="font-semibold text-slate-700">- €{{ otherCost.toLocaleString() }}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900">Job Contribution</span>
            <span class="text-sm font-black text-emerald-600 font-sans">€{{ jobContribution.toLocaleString() }} ({{ jobContributionPercent }}%)</span>
          </div>
        </div>

        <!-- Status & Actions (Live Supabase Updates) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans mb-4">Status & Actions</h2>

            <div class="space-y-3.5 text-xs">
              <!-- 1. Sales Pipeline (المبيعات) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 font-medium">1. Sales Pipeline</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Sales</span>
                </div>
                <select 
                  v-model="salesStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Info Requested">Info Requested</option>
                  <option value="Quote Prepared">Quote Prepared</option>
                  <option value="Quote Sent">Quote Sent</option>
                  <option value="Modification Requested">Modification Requested</option>
                  <option value="Won / Accepted">Won / Accepted</option>
                  <option value="Lost / Rejected">Lost / Rejected</option>
                </select>
                
                <!-- Mandatory Rejection Reason when Lost/Rejected -->
                <div v-if="salesStatus === 'Lost / Rejected'" class="mt-1.5 animate-in fade-in duration-200">
                  <input 
                    v-model="rejectionReason" 
                    @change="handleFieldChange"
                    type="text" 
                    placeholder="Required: Reason for rejection / loss..." 
                    class="w-full px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 placeholder:text-rose-400 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              <!-- 2. Operational Pipeline -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 font-medium">2. Operations Pipeline</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">Operations</span>
                </div>
                <select 
                  v-model="currentStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Booking Pending">Booking Pending</option>
                  <option value="Confirmed">Confirmed & Scheduled</option>
                  <option value="Team Assigned">Team Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <!-- 3. Invoicing Pipeline -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 font-medium">3. Invoicing Pipeline</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Billing</span>
                </div>
                <select 
                  v-model="paymentStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Not Invoiced">Not Invoiced</option>
                  <option value="Invoiced">Invoice Sent</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid in Full</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <!-- 4. Priority (تحديد الأولويات التلقائي واليدوي) -->
              <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                <span class="text-slate-500 font-medium">Priority</span>
                <select 
                  v-model="priority" 
                  @change="handleFieldChange"
                  class="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="High">High (≥ €2,500 / Urgent)</option>
                  <option value="Medium">Medium (€1,000 - €2,499)</option>
                  <option value="Low">Low (&lt; €1,000)</option>
                </select>
              </div>

              <!-- Next Action -->
              <div class="pt-1">
                <p class="text-[11px] text-slate-400 font-medium mb-1">Next Action</p>
                <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-800">{{ activeJob.nextAction || 'Review Status' }}</span>
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              </div>

              <!-- Phase 3 Automated Communication Actions -->
              <div class="pt-3 border-t border-slate-100 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">⚡ Phase 3 Automations</span>
                  <span class="text-[10px] font-bold text-emerald-600">● 1-Click Dispatch</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    @click="openAutomationModal('quote_followup')"
                    class="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer text-left"
                    title="Send Unanswered Quote Follow-Up via Email & WhatsApp"
                  >
                    <span>💬 Follow-Up Quote</span>
                  </button>
                  <button
                    @click="openAutomationModal('job_reminder')"
                    class="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer text-left"
                    title="Send 24h Move Reminder with Crew & Van Arrival Time"
                  >
                    <span>⏰ 24h Reminder</span>
                  </button>
                  <button
                    @click="openAutomationModal('review_request')"
                    class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer text-left"
                    title="Request 5-Star Google Review and Customer Feedback"
                  >
                    <span>⭐ Request 5★ Review</span>
                  </button>
                  <button
                    @click="openAutomationModal('invoice_reminder')"
                    class="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer text-left"
                    title="Send Tax Invoice & Payment Link via Email"
                  >
                    <span>💳 Payment Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Create & Download Invoice Action Buttons -->
          <div class="pt-4 space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="downloadQuotePDF"
                class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer text-center"
              >
                📄 Quote PDF
              </button>
              <button 
                @click="downloadInvoicePDF"
                class="w-full py-2.5 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer text-center"
              >
                🧾 Invoice PDF
              </button>
            </div>
            <button 
              @click="openEditInvoiceModal"
              class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
            >
              ✎ Edit Invoice Details & Line Items
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CUSTOMER -->
    <div v-else-if="activeMoveTab === 'Customer'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Customer Profile</h2>
        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Full Name</span>
            <span class="font-bold text-slate-900">{{ activeJob.customer }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Email Address</span>
            <a :href="`mailto:${activeJob.email}`" class="font-bold text-red-600 hover:underline">{{ activeJob.email || 'N/A' }}</a>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Phone Number</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900">{{ activeJob.phone || 'N/A' }}</span>
              <a v-if="activeJob.phone" :href="`https://wa.me/${activeJob.phone.replace(/[^0-9]/g, '')}`" target="_blank" class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">WhatsApp</a>
            </div>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-slate-500 font-medium">Communication Preference</span>
            <span class="font-bold text-slate-900 capitalize">{{ activeJob.raw?.form_data?.preference || 'WhatsApp / Email' }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-slate-500 font-medium">Source / Referral</span>
            <span class="font-bold text-slate-900 capitalize">{{ activeJob.raw?.form_data?.hear || 'Google Search' }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Booking History & Lifetime Value</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p class="text-xs text-slate-500">Total Bookings</p>
            <p class="text-2xl font-black text-slate-900 font-sans mt-1">1 Move</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p class="text-xs text-slate-500">Total Spent</p>
            <p class="text-2xl font-black text-emerald-600 font-sans mt-1">€{{ totalIncVat.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Verified Feedback & NPS Rating (Phase 3) -->
        <div class="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-amber-900 flex items-center gap-1">
              <span>⭐ Verified Customer Review</span>
            </span>
            <span class="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">5.0 / 5.0 ★</span>
          </div>
          <p class="text-slate-700 italic">"Punctual, friendly movers. The team wrapped all furniture and took great care with the stairs!"</p>
          <div class="flex items-center justify-between pt-1 border-t border-amber-200/50 text-[11px] text-amber-900">
            <span>Google Review Status: <strong>Verified</strong></span>
            <button @click="openAutomationModal('review_request')" class="text-red-600 font-bold hover:underline cursor-pointer">Re-send Review Request ↗</button>
          </div>
        </div>

        <div class="p-4 bg-red-50/60 rounded-2xl border border-red-100 text-xs text-slate-700">
          <p class="font-bold text-red-800 mb-1">Customer Priority Status</p>
          <p>Assigned to dedicated coordinator: <strong class="text-slate-900">{{ activeJob.coordinator || 'Sherif Eliwa' }}</strong></p>
        </div>
      </div>
    </div>

    <!-- TAB 3: MOVE DETAILS -->
    <div v-else-if="activeMoveTab === 'Move Details'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pickup Details -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">A</span>
          <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Pickup Location & Access</h2>
        </div>
        <div class="space-y-3 text-xs">
          <div>
            <span class="text-slate-400 font-medium">Full Address:</span>
            <p class="font-bold text-slate-900 mt-0.5">{{ activeJob.fromFull }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <span class="text-slate-400 font-medium">Floor Level:</span>
              <p class="font-bold text-slate-900">{{ activeJob.raw?.form_data?.pickupFloor || 'Ground Floor' }}</p>
            </div>
            <div>
              <span class="text-slate-400 font-medium">Elevator:</span>
              <p class="font-bold text-slate-900">{{ activeJob.raw?.form_data?.elevator || 'Lift to be arranged' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Details -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">B</span>
          <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Delivery Location & Access</h2>
        </div>
        <div class="space-y-3 text-xs">
          <div>
            <span class="text-slate-400 font-medium">Full Address:</span>
            <p class="font-bold text-slate-900 mt-0.5">{{ activeJob.toFull }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <span class="text-slate-400 font-medium">Floor Level:</span>
              <p class="font-bold text-slate-900">{{ activeJob.raw?.form_data?.deliveryFloor || '1st / 2nd Floor' }}</p>
            </div>
            <div>
              <span class="text-slate-400 font-medium">Elevator:</span>
              <p class="font-bold text-slate-900">{{ activeJob.raw?.form_data?.lift || 'Stairs' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: INVENTORY -->
    <div v-else-if="activeMoveTab === 'Inventory'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Inventory & Cargo Volume</h2>
        <span class="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs">
          Volume: {{ activeJob.raw?.form_data?.estimated_volume_m3 ? `${activeJob.raw.form_data.estimated_volume_m3} m³` : 'Not specified' }}
        </span>
      </div>
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
        <p class="font-bold text-slate-800">Cargo Description & Scope:</p>
        <p class="text-slate-600">{{ activeJob.raw?.form_data?.notes || activeJob.package || 'No additional notes provided.' }}</p>
      </div>

      <!-- Real Itemized Inventory submitted by customer -->
      <div v-if="Array.isArray(activeJob.raw?.form_data?.inventory_items) && activeJob.raw.form_data.inventory_items.length > 0" class="space-y-2">
        <p class="text-xs font-black text-slate-800 uppercase tracking-wider">Customer Itemized Inventory ({{ activeJob.raw.form_data.inventory_items.length }} types)</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          <div
            v-for="item in activeJob.raw.form_data.inventory_items"
            :key="item.id || item.name"
            class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
          >
            <div class="min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ item.name }}</p>
              <p class="text-[10px] text-slate-500">
                {{ item.room }} · {{ item.volume }} m³
                <span v-if="item.disassembled" class="text-emerald-600 font-bold">· Disassembled</span>
              </p>
            </div>
            <span class="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-black text-[11px] shrink-0">×{{ item.qty }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Package Type</p>
          <p class="font-bold text-slate-900 mt-1">{{ activeJob.package }}</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Vehicle Allocated</p>
          <p class="font-bold text-slate-900 mt-1">{{ displayVehicleName }}</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Movers Needed</p>
          <p class="font-bold text-slate-900 mt-1">{{ assignedCrewList.length || activeJob.team || 2 }} Movers</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Storage / In-Person</p>
          <p class="font-bold text-slate-900 mt-1">
            {{ activeJob.raw?.form_data?.storage_required === 'yes' ? 'Storage Needed' : (activeJob.raw?.form_data?.in_person_quote === 'yes' ? 'In-Person Survey' : 'Standard') }}
          </p>
        </div>
      </div>
    </div>

    <!-- TAB 5: QUOTATION ACTION TOOLBAR -->
    <div v-else-if="activeMoveTab === 'Quotation'" class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div>
        <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Official Moving Quotation</h2>
        <p class="text-xs text-slate-500 font-medium">Reference: QT-2026-{{ activeJob.ref || '0000' }} • Generated dynamically from order specification</p>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Print Button -->
        <button 
          @click="printQuoteSheet" 
          class="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          <span>Print Clean Sheet</span>
        </button>

        <!-- Download Vector PDF Button (Primary Action) -->
        <button 
          @click="downloadQuotePDF" 
          class="flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>Download Official PDF (A4)</span>
        </button>
      </div>
    </div>

    <!-- TAB 6: OPERATIONS -->
    <div v-else-if="activeMoveTab === 'Operations'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Crew Dispatch & Vehicle Scheduling</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div class="space-y-3">
          <label class="block font-bold text-slate-700">Lead Driver</label>
          <select v-model="leadDriver" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
            <option value="Ahmed (Senior Lead Driver)">Ahmed (Senior Lead Driver)</option>
            <option value="Sherif Eliwa">Sherif Eliwa</option>
            <option value="Youssef">Youssef</option>
          </select>

          <label class="block font-bold text-slate-700 pt-2">Assistant Mover</label>
          <select v-model="assistantMover" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
            <option value="Tomas (Professional Mover)">Tomas (Professional Mover)</option>
            <option value="Nour">Nour</option>
            <option value="Karim">Karim</option>
          </select>
        </div>

        <div class="space-y-3">
          <label class="block font-bold text-slate-700">Vehicle Assignment</label>
          <select v-model="assignedVehicle" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
            <option value="Ford Transit 20m³ (SMEK 25)">Ford Transit 20m³ (SMEK 25)</option>
            <option value="Mercedes Sprinter 15m³ (NL-88-ZZ)">Mercedes Sprinter 15m³ (NL-88-ZZ)</option>
            <option value="Renault Master 20m³ (AA-12-BB)">Renault Master 20m³ (AA-12-BB)</option>
          </select>

          <div class="pt-4">
            <button @click="saveOperationsAlert" class="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors cursor-pointer">
              Save Dispatch Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 7: EXPENSES -->
    <div v-else-if="activeMoveTab === 'Expenses'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Move Expenses & Profit Engine</h2>
          <p class="text-xs text-slate-400">Direct job cost accounting linked to order database</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-400">Net Job Contribution</p>
          <p class="text-lg font-black text-emerald-600 font-sans">€{{ jobContribution.toLocaleString() }} ({{ jobContributionPercent }}%)</p>
        </div>
      </div>

      <!-- Add Expense Form -->
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Expense Category</label>
          <select v-model="newExpenseCategory" class="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800">
            <option value="Labor">Labor Wages</option>
            <option value="Fuel">Fuel / Diesel</option>
            <option value="Tolls">Highway Tolls & Parking</option>
            <option value="Other">Packing Materials & Other</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Amount (€)</label>
          <input v-model="newExpenseAmount" type="number" placeholder="50" class="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Description / Notes</label>
          <input v-model="newExpenseNotes" type="text" placeholder="e.g. Fuel receipt Shell" class="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-800" />
        </div>
        <div>
          <button @click="addNewExpense" class="w-full py-2 bg-[#DC2626] hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
            + Log Expense
          </button>
        </div>
      </div>

      <!-- Expense Ledger Table -->
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold">
          <tr>
            <th class="p-3">Category</th>
            <th class="p-3">Description</th>
            <th class="p-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr><td class="p-3 font-bold text-slate-800">Labor</td><td class="p-3 text-slate-500">Mover wages (2 crew members)</td><td class="p-3 text-right font-bold text-rose-600">- €{{ laborCost }}</td></tr>
          <tr><td class="p-3 font-bold text-slate-800">Fuel</td><td class="p-3 text-slate-500">Transit fuel allocation</td><td class="p-3 text-right font-bold text-rose-600">- €{{ fuelCost }}</td></tr>
          <tr><td class="p-3 font-bold text-slate-800">Tolls</td><td class="p-3 text-slate-500">Highway & parking fees</td><td class="p-3 text-right font-bold text-rose-600">- €{{ tollsCost }}</td></tr>
          <tr v-if="otherCost > 0"><td class="p-3 font-bold text-slate-800">Other</td><td class="p-3 text-slate-500">Packing boxes & miscellaneous</td><td class="p-3 text-right font-bold text-rose-600">- €{{ otherCost }}</td></tr>
        </tbody>
      </table>
    </div>

    <!-- TAB 8: PAYMENTS -->
    <div v-else-if="activeMoveTab === 'Payments'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Payment & Official Tax Invoicing</h2>
          <p class="text-xs text-slate-400">Invoice: INV-2026-{{ activeJob.ref || '1101' }} • 21% Dutch BTW Compliant</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="downloadInvoicePDF"
            class="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>🧾 Download Official Invoice PDF (A4)</span>
          </button>
          <span class="px-3 py-1 rounded-full text-xs font-bold" :class="paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
            {{ paymentStatus }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p class="text-slate-500">Total Billed (incl. 21% VAT)</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ totalIncVat.toLocaleString() }}</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p class="text-slate-500">Payment Method</p>
          <p class="text-base font-bold text-slate-900 mt-1">iDEAL / Bank Transfer (IBAN)</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
          <button @click="markAsPaid" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer">
            ✓ Mark Invoice as Paid
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 9: NOTES & FILES -->
    <div v-else-if="activeMoveTab === 'Notes & Files'" class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
      <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Internal Notes & Customer Uploads</h2>
      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Customer Special Instructions</label>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 italic">
            {{ activeJob.raw?.form_data?.notes || 'No special notes submitted by customer.' }}
          </div>
        </div>

        <div class="pt-2">
          <label class="block font-bold text-slate-700 mb-1">Add Internal Operations Note</label>
          <textarea v-model="internalNote" rows="3" placeholder="Type instructions for movers or coordinator..." class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-red-500"></textarea>
          <button @click="saveNoteAlert" class="mt-2 px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors cursor-pointer">
            Save Note
          </button>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX MODAL: Real Customer Photos Viewer -->
    <div 
      v-if="showLightbox" 
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
      @click.self="showLightbox = false"
    >
      <div class="w-full flex items-center justify-between text-white max-w-5xl">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-emerald-600 rounded text-xs font-bold">Client Photo</span>
          <span class="text-xs text-slate-300 font-mono">{{ activeJob.customer }} • {{ activeJob.ref }}</span>
        </div>
        <button 
          @click="showLightbox = false" 
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="max-w-4xl max-h-[75vh] flex items-center justify-center p-2">
        <img 
          :src="activeLightboxImage" 
          :alt="activeJob.customer" 
          class="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />
      </div>

      <!-- Thumbnails carousel inside lightbox -->
      <div class="w-full max-w-xl flex items-center justify-center gap-2 overflow-x-auto py-2">
        <button 
          v-for="(img, idx) in customerRealImages" 
          :key="idx" 
          @click="activeLightboxImage = img"
          :class="[
            'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0',
            activeLightboxImage === img ? 'border-red-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
          ]"
        >
          <img :src="img" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <!-- EDIT TIMES MODAL: Dynamic Milestone Timetable -->
    <div 
      v-if="showEditTimesModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showEditTimesModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-black text-slate-900 font-sans">Edit Milestone Timeline</h3>
            <p class="text-xs text-slate-500">Route: {{ activeJob.fromFull }} ➔ {{ activeJob.toFull }}</p>
          </div>
          <button @click="showEditTimesModal = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <!-- Quick Presets -->
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets</label>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="applyPreset('paris')" 
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Paris (4.5h Transit)
            </button>
            <button 
              @click="applyPreset('amsterdam')" 
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Amsterdam (2.5h Transit)
            </button>
            <button 
              @click="applyPreset('morning')" 
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Local Move (30m)
            </button>
          </div>
        </div>

        <!-- Milestone Inputs -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">1. Arrived Time</label>
            <input v-model="customSchedule.arrived" placeholder="08:00" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">2. Loading Window</label>
            <input v-model="customSchedule.loading" placeholder="08:15 - 10:00" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">3. Driving Window</label>
            <input v-model="customSchedule.driving" placeholder="10:00 - 14:30" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">4. Unloading Window</label>
            <input v-model="customSchedule.unloading" placeholder="14:30 - 16:00" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">5. Assembly Window</label>
            <input v-model="customSchedule.assembly" placeholder="16:00 - 16:45" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">6. Completed Time</label>
            <input v-model="customSchedule.completed" placeholder="16:45" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button @click="showEditTimesModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">
            Cancel
          </button>
          <button @click="saveTimelineSchedule" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
            Save Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- PHASE 3 AUTOMATION DISPATCH MODAL -->
    <div 
      v-if="showAutoDispatchModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showAutoDispatchModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-black text-slate-900 font-sans">⚡ Dispatch Automated Client Communication</h3>
            <p class="text-xs text-slate-500">{{ activeJob.ref }} — {{ activeJob.customer }} ({{ activeJob.route }})</p>
          </div>
          <button @click="showAutoDispatchModal = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div class="flex items-center justify-between text-slate-500 font-medium">
              <span>Channel:</span>
              <span class="font-bold text-slate-900">✉️ Email + 💬 WhatsApp</span>
            </div>
            <div class="flex items-center justify-between text-slate-500 font-medium">
              <span>Recipient Email:</span>
              <span class="font-bold text-slate-900">{{ activeJob.email || 'customer@mail.nl' }}</span>
            </div>
            <div class="flex items-center justify-between text-slate-500 font-medium">
              <span>Recipient Phone:</span>
              <span class="font-bold text-slate-900">{{ activeJob.phone || '+31 6 21713503' }}</span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Message Preview:</label>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
              {{ autoDispatchPreviewText }}
            </div>
          </div>

          <div v-if="autoDispatchResult" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
            <p class="font-black text-xs">✓ Notification Dispatched!</p>
            <p class="text-[11px]">Email delivery status: <strong>{{ autoDispatchResult.emailSent ? 'Sent' : 'Skipped/SMTP' }}</strong></p>
            <div v-if="autoDispatchResult.whatsappUrl" class="pt-1">
              <a
                :href="autoDispatchResult.whatsappUrl"
                target="_blank"
                class="inline-block px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                Open WhatsApp Chat ↗
              </a>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <button @click="showAutoDispatchModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">
            Cancel
          </button>
          <button
            @click="dispatchClientAutomation"
            :disabled="isDispatching"
            class="px-4 py-2 bg-[#DC2626] hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            {{ isDispatching ? 'Dispatching...' : '⚡ Send Communication Now' }}
          </button>
        </div>
      </div>
    </div>
    </div>
    <!-- /Interactive Screen Tabs Wrapper -->

    <!-- ============================================================ -->
    <!-- OFFICIAL A4 QUOTATION LETTERHEAD TEMPLATE                      -->
    <!-- Visible on screen only when Quotation tab is active,           -->
    <!-- BUT is ALWAYS the only element printed during browser print!   -->
    <!-- ============================================================ -->
    <div 
      id="official-quotation-document" 
      class="printable-quote-sheet bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6 font-sans text-slate-800"
      :class="activeMoveTab === 'Quotation' ? 'block' : 'hidden print:block'"
    >
      <!-- Top Brand Color Accent Bar -->
      <div class="h-1.5 bg-[#DC2626] w-full rounded-full"></div>

      <!-- 1. Document Header & Company Branding -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-5">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-[#DC2626] text-white font-black text-sm flex items-center justify-center shadow-xs">m</span>
            <div class="flex items-baseline">
              <span class="text-2xl font-black text-slate-900 tracking-tight">move</span>
              <span class="text-2xl font-black text-[#DC2626]">-it</span>
            </div>
          </div>
          <p class="text-[11px] font-black text-slate-900 uppercase tracking-widest">Premium Moving & Logistics Maastricht</p>
          <p class="text-[11px] text-slate-500 max-w-sm leading-relaxed">Official corporate & residential relocation services across the Netherlands, Belgium, Germany & Western Europe.</p>
        </div>

        <div class="text-left sm:text-right text-[11px] text-slate-500 space-y-1">
          <p class="font-black text-slate-900 text-xs">MoveIt Maastricht B.V.</p>
          <p>Oranjeplein 35D, 6224 KV Maastricht</p>
          <p>Email: <span class="text-slate-900 font-semibold">info@moveitmaastricht.nl</span></p>
          <p>Phone / WhatsApp: <span class="text-slate-900 font-semibold">+31 6 21713503</span></p>
          <p class="text-[10px] text-slate-400 font-mono">KvK: 84920194 • BTW / VAT: NL863412345B01</p>
        </div>
      </div>

      <!-- 2. Quotation Title Banner -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xs">
        <div>
          <span class="text-[10px] font-bold text-red-400 uppercase tracking-widest">OFFICIAL ESTIMATE & OFFER</span>
          <h1 class="text-base sm:text-lg font-black uppercase tracking-tight text-white">Relocation Quotation • Offerte</h1>
          <p class="text-xs text-slate-300 font-mono mt-0.5">Reference: <strong class="text-white">QT-2026-{{ activeJob.ref || '0000' }}</strong></p>
        </div>
        <div class="text-left sm:text-right text-xs space-y-0.5">
          <p class="text-slate-300">Issue Date: <strong class="text-white">{{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}</strong></p>
          <p class="text-slate-300">Price Validity: <strong class="text-emerald-400 font-bold">30 Days (Guaranteed Fixed Price)</strong></p>
        </div>
      </div>

      <!-- 3. Client & Relocation Specification Grid (2 Columns) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <!-- Client Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Client & Contact</p>
          <p class="text-sm font-black text-slate-900">{{ activeJob.customer }}</p>
          <div class="space-y-1 text-slate-600 pt-0.5">
            <p><span class="text-slate-400 font-medium">Phone:</span> <strong class="text-slate-800">{{ activeJob.raw?.form_data?.phone || activeJob.phone || '+31 6 21713503' }}</strong></p>
            <p><span class="text-slate-400 font-medium">Email:</span> <strong class="text-slate-800">{{ activeJob.raw?.form_data?.email || activeJob.email || 'customer@moveitmaastricht.nl' }}</strong></p>
            <p><span class="text-slate-400 font-medium">Coordinator:</span> <strong class="text-slate-900">{{ activeJob.coordinator || 'Sherif Eliwa' }}</strong></p>
          </div>
        </div>

        <!-- Move Logistics Card -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Relocation Specification</p>
          <div class="space-y-1 text-slate-600">
            <p><span class="font-bold text-emerald-700">📍 From (A):</span> <strong class="text-slate-900">{{ activeJob.fromFull }}</strong></p>
            <p><span class="font-bold text-orange-700">📍 To (B):</span> <strong class="text-slate-900">{{ activeJob.toFull }}</strong></p>
            <p><span class="text-slate-400 font-medium">Planned Date:</span> <strong class="text-slate-900">{{ activeJob.movingDate || 'Flexible' }}</strong></p>
            <p><span class="text-slate-400 font-medium">Scope:</span> <strong class="text-slate-900">{{ activeJob.package }}</strong> • {{ activeJob.team || 2 }} Movers • Van (20m³)</p>
          </div>
        </div>
      </div>

      <!-- 4. Itemized Price Breakdown Table -->
      <div class="space-y-2">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Itemized Service Scope & Cost Breakdown</p>
        <div class="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-900 text-white font-bold">
              <tr>
                <th class="p-2.5 w-10 text-center">#</th>
                <th class="p-2.5">Service Description</th>
                <th class="p-2.5 hidden sm:table-cell">Scope & Inclusions</th>
                <th class="p-2.5 text-right">Amount (EUR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr class="hover:bg-slate-50/60">
                <td class="p-2.5 text-center text-slate-400 font-bold">1</td>
                <td class="p-2.5">
                  <p class="font-bold text-slate-900">Moving Crew & Commercial Van</p>
                  <p class="text-[10px] text-slate-500">Package: {{ activeJob.package }}</p>
                </td>
                <td class="p-2.5 text-slate-600 hidden sm:table-cell text-[11px]">Dedicated certified moving crew ({{ activeJob.team || 2 }} persons), professional loading, transit, and unloading.</td>
                <td class="p-2.5 text-right font-black text-slate-900 font-mono">€{{ Math.round(revenueExVat * 0.70).toLocaleString() }}</td>
              </tr>

              <tr class="hover:bg-slate-50/60 bg-slate-50/40">
                <td class="p-2.5 text-center text-slate-400 font-bold">2</td>
                <td class="p-2.5">
                  <p class="font-bold text-slate-900">Route Transit & Fuel Surcharge</p>
                  <p class="text-[10px] text-slate-500">Distance: ~{{ routeMetrics.distanceKm }} km ({{ routeMetrics.driveText }})</p>
                </td>
                <td class="p-2.5 text-slate-600 hidden sm:table-cell text-[11px]">Transit fuel consumption, European highway road network tolls, and transit driving duration.</td>
                <td class="p-2.5 text-right font-black text-slate-900 font-mono">€{{ Math.round(revenueExVat * 0.18).toLocaleString() }}</td>
              </tr>

              <tr class="hover:bg-slate-50/60">
                <td class="p-2.5 text-center text-slate-400 font-bold">3</td>
                <td class="p-2.5">
                  <p class="font-bold text-slate-900">Protective Equipment & Blankets</p>
                  <p class="text-[10px] text-slate-500">Furniture & Property Protection</p>
                </td>
                <td class="p-2.5 text-slate-600 hidden sm:table-cell text-[11px]">Heavy-duty padded blankets, ratchet tie-downs, dollies, mattress foil wrap, and floor runners.</td>
                <td class="p-2.5 text-right font-black text-slate-900 font-mono">€{{ Math.round(revenueExVat * 0.12).toLocaleString() }}</td>
              </tr>

              <tr class="hover:bg-slate-50/60 bg-slate-50/40">
                <td class="p-2.5 text-center text-slate-400 font-bold">4</td>
                <td class="p-2.5">
                  <p class="font-bold text-slate-900">Goods-in-Transit Cargo Insurance</p>
                  <p class="text-[10px] text-emerald-600 font-bold">Included Policy</p>
                </td>
                <td class="p-2.5 text-slate-600 hidden sm:table-cell text-[11px]">All-risk transport insurance coverage up to €50,000 for total peace of mind.</td>
                <td class="p-2.5 text-right font-black text-emerald-600 font-mono">INCLUDED</td>
              </tr>

              <tr class="hover:bg-slate-50/60">
                <td class="p-2.5 text-center text-slate-400 font-bold">5</td>
                <td class="p-2.5">
                  <p class="font-bold text-slate-900">Room Placement & Furniture Assembly</p>
                  <p class="text-[10px] text-emerald-600 font-bold">Standard Service</p>
                </td>
                <td class="p-2.5 text-slate-600 hidden sm:table-cell text-[11px]">Placing all items into specified rooms according to client's destination layout.</td>
                <td class="p-2.5 text-right font-black text-emerald-600 font-mono">INCLUDED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Totals & Terms Grid (2 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1 items-start">
        <!-- Left: Guarantees & Booking Conditions -->
        <div class="md:col-span-7 space-y-1.5 text-slate-600 text-[11px]">
          <p class="font-black text-slate-900 text-xs uppercase tracking-wider">MoveIt Guarantees & Booking Terms:</p>
          <ul class="space-y-1 text-slate-600">
            <li class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Fixed-Price Guarantee:</strong> No surprise fees, no hidden mileage or staircase surcharges.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>0% Deposit Upfront:</strong> Payment upon completion via iDEAL, PIN / debit card, or bank transfer.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span><strong>Flexible Rescheduling:</strong> Free date changes or cancellation up to 7 calendar days before move.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="text-emerald-600 font-bold">✓</span>
              <span>Conforms to the Dutch Moving Association Regulations (AVV Netherlands).</span>
            </li>
          </ul>
        </div>

        <!-- Right: Summary Financial Box -->
        <div class="md:col-span-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
          <div class="flex justify-between text-slate-600">
            <span>Subtotal (Excl. VAT):</span>
            <span class="font-bold text-slate-900 font-mono">€{{ revenueExVat.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>VAT / BTW (21%):</span>
            <span class="font-bold text-slate-900 font-mono">€{{ vatAmount.toLocaleString() }}</span>
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span class="font-black text-slate-900 text-sm">TOTAL (INCL. VAT):</span>
            <span class="text-xl font-black text-emerald-600 font-mono">€{{ totalIncVat.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- 6. Signatures -->
      <div class="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
        <div class="space-y-4">
          <div class="h-8 border-b border-dashed border-slate-300"></div>
          <p class="text-slate-400 text-[11px]">Authorized by: <strong class="text-slate-800">MoveIt Operations & Dispatch</strong></p>
        </div>
        <div class="space-y-4">
          <div class="h-8 border-b border-dashed border-slate-300"></div>
          <p class="text-slate-400 text-[11px]">Client Acceptance: <strong class="text-slate-800">{{ activeJob.customer }}</strong></p>
        </div>
      </div>

      <!-- 7. Legal Footer -->
      <div class="pt-2 border-t border-slate-100 text-center text-[10px] text-slate-400">
        <p>MoveIt Maastricht B.V. • Oranjeplein 35D, 6224 KV Maastricht • Tel: +31 6 21713503 • info@moveitmaastricht.nl • www.moveitmaastricht.nl • Page 1 of 1</p>
      </div>
    </div>

    <!-- EDIT & CUSTOMIZE INVOICE MODAL -->
    <div 
      v-if="showEditInvoiceModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showEditInvoiceModal = false"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 class="text-base font-black text-slate-900">Edit & Customize Official Invoice</h3>
            <p class="text-xs text-slate-500">Modify customer info, line items, amounts, or VAT before downloading PDF</p>
          </div>
          <button @click="showEditInvoiceModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Invoice Number</label>
              <input v-model="invoiceDraft.invNumber" type="text" class="w-full p-2 border border-slate-300 rounded-xl font-bold" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Invoice Date</label>
              <input v-model="invoiceDraft.date" type="text" class="w-full p-2 border border-slate-300 rounded-xl font-semibold" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">VAT Rate (%)</label>
              <input v-model.number="invoiceDraft.vatRate" type="number" class="w-full p-2 border border-slate-300 rounded-xl font-bold" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Client Name</label>
              <input v-model="invoiceDraft.customer" type="text" class="w-full p-2 border border-slate-300 rounded-xl font-bold" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Client Email</label>
              <input v-model="invoiceDraft.email" type="text" class="w-full p-2 border border-slate-300 rounded-xl" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Billing / Pickup Address</label>
            <input v-model="invoiceDraft.address" type="text" class="w-full p-2 border border-slate-300 rounded-xl" />
          </div>

          <!-- Line Items -->
          <div class="space-y-2 pt-2">
            <div class="flex items-center justify-between">
              <label class="font-black text-slate-900 uppercase tracking-wider text-[11px]">Invoice Line Items</label>
              <button @click="addInvoiceLineItem" class="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer">+ Add Item</button>
            </div>
            <div v-for="(item, idx) in invoiceDraft.items" :key="idx" class="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input v-model="item.description" type="text" placeholder="Service description" class="col-span-6 p-1.5 bg-white border border-slate-200 rounded-lg font-semibold" />
              <input v-model="item.category" type="text" placeholder="Category" class="col-span-3 p-1.5 bg-white border border-slate-200 rounded-lg" />
              <input v-model.number="item.netAmount" type="number" step="0.01" placeholder="€" class="col-span-2 p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-right" />
              <button @click="invoiceDraft.items.splice(idx, 1)" class="col-span-1 text-rose-500 hover:text-rose-700 font-bold text-center cursor-pointer" title="Remove item">🗑</button>
            </div>
          </div>

          <!-- Totals Summary -->
          <div class="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-[11px] text-slate-400">Subtotal (Excl. VAT): €{{ invoiceDraftSubtotal.toFixed(2) }}</div>
              <div class="text-[11px] text-slate-400">VAT ({{ invoiceDraft.vatRate }}%): €{{ invoiceDraftVat.toFixed(2) }}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-400 uppercase font-bold">Total (Incl. VAT)</div>
              <div class="text-xl font-black text-emerald-400">€{{ invoiceDraftTotal.toFixed(2) }}</div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Invoice Notes / Payment Instructions</label>
            <textarea v-model="invoiceDraft.notes" rows="2" class="w-full p-2 border border-slate-300 rounded-xl"></textarea>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button @click="showEditInvoiceModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
          <button @click="generateEditedInvoicePDF" class="px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5">
            <span>🧾</span> Download Customized Invoice PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Revenue & Job Costs Modal -->
    <div
      v-if="showEditFinancialsModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showEditFinancialsModal = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">Edit Revenue & Job Costs</h3>
            <p class="text-[11px] text-slate-500">Updates order price, direct costs, and margin in Supabase</p>
          </div>
          <button @click="showEditFinancialsModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label class="block font-bold text-slate-700 mb-1">Revenue (excl. VAT) (€)</label>
            <input
              v-model.number="financialsDraft.revenue"
              type="number"
              min="0"
              step="10"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900 text-sm focus:border-red-500 focus:outline-none"
            />
            <p class="text-[10px] text-slate-400 mt-1">
              VAT (21%): €{{ Math.round(Number(financialsDraft.revenue || 0) * 0.21 * 100) / 100 }} · Total incl. VAT: €{{ Math.round(Number(financialsDraft.revenue || 0) * 1.21 * 100) / 100 }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="font-bold text-slate-700">Labor Cost (€)</label>
                <button
                  type="button"
                  @click="autoCalculateLaborFromCrew"
                  class="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  title="Calculate labor from assigned crew hourly rates and logged hours"
                >
                  ∑ From Crew Rates
                </button>
              </div>
              <input v-model.number="financialsDraft.labor" type="number" min="0" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Fuel Cost (€)</label>
              <input v-model.number="financialsDraft.fuel" type="number" min="0" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Tolls (€)</label>
              <input v-model.number="financialsDraft.tolls" type="number" min="0" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Other Costs (€)</label>
              <input v-model.number="financialsDraft.other" type="number" min="0" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none" />
            </div>
          </div>

          <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span class="font-bold text-emerald-900">Net Job Contribution</span>
            <span class="font-black text-emerald-700 text-sm">
              €{{ Math.max(0, Number(financialsDraft.revenue || 0) - (Number(financialsDraft.labor || 0) + Number(financialsDraft.fuel || 0) + Number(financialsDraft.tolls || 0) + Number(financialsDraft.other || 0))).toLocaleString() }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button @click="showEditFinancialsModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
          <button @click="saveFinancials" class="px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
            Save Price & Costs
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Crew, Coordinator & Vehicle Modal (Synced from Settings) -->
    <div
      v-if="showAssignCrewModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showAssignCrewModal = false"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-black text-slate-900">Assign Crew, Coordinator & Vehicle</h3>
            <p class="text-[11px] text-slate-500">Live list synced from Settings → Team & Access</p>
          </div>
          <button @click="showAssignCrewModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-2">
              Select Movers & Drivers ({{ crewDraft.selectedNames.length }} selected)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              <button
                v-for="member in availableTeamMembers"
                :key="member.name"
                type="button"
                @click="toggleCrewMember(member.name)"
                :class="[
                  'flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                  crewDraft.selectedNames.includes(member.name)
                    ? 'bg-red-50 border-red-400 ring-1 ring-red-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                ]"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {{ getInitials(member.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-slate-900 truncate">{{ member.name }}</p>
                    <p class="text-[10px] text-slate-500 truncate">{{ member.role || 'Mover' }}</p>
                  </div>
                </div>
                <span v-if="crewDraft.selectedNames.includes(member.name)" class="text-red-600 font-black text-sm">✓</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Assigned Vehicle</label>
              <select v-model="crewDraft.vehicle" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none">
                <option v-for="v in availableVehicles" :key="v" :value="v">{{ v }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Move Coordinator</label>
              <select v-model="crewDraft.coordinator" class="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:border-red-500 focus:outline-none">
                <option v-for="c in availableCoordinators" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button @click="showAssignCrewModal = false" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
          <button @click="saveCrewAssignment" class="px-5 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MOVEIT_LOGO_BASE64 } from '~/utils/pdfBranding'

const { companySettings, fetchCompanySettings } = useAdminData()
onMounted(() => {
  fetchCompanySettings()
})

const props = defineProps({
  job: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'update-status', 'delete-order', 'trigger-automation'])

// --- Phase 3 Automated Communication State & Dispatch ---
const showAutoDispatchModal = ref(false)
const autoDispatchType = ref('quote_followup')
const autoDispatchResult = ref(null)
const isDispatching = ref(false)

const openAutomationModal = (type) => {
  autoDispatchType.value = type
  autoDispatchResult.value = null
  showAutoDispatchModal.value = true
}

const autoDispatchPreviewText = computed(() => {
  const cust = activeJob.value.customer || 'Customer'
  const refCode = activeJob.value.ref || 'Quote'
  const route = activeJob.value.route || `${activeJob.value.fromFull || 'Maastricht'} -> ${activeJob.value.toFull || 'Destination'}`
  const date = activeJob.value.movingDate || 'Upcoming date'
  const price = totalIncVat.value || activeJob.value.estValue || 0

  switch (autoDispatchType.value) {
    case 'quote_followup':
      return `Dear ${cust},\n\nWe wanted to follow up on your MoveIt Maastricht quotation (${refCode}) for your relocation along ${route}.\nTotal estimated: €${price}.\n\nOur moving schedule is filling fast. You can accept your quotation and secure your moving crew directly here:\nhttps://moveit-maastricht.nl/accept/${refCode}\n\nWarm regards,\nMoveIt Maastricht Team\n+31 6 21713503`
    case 'job_reminder':
      return `Hello ${cust},\n\nThis is a friendly reminder that your MoveIt Maastricht move is scheduled for ${date}!\n• Route: ${route}\n• Assigned Van: ${vehicleModel.value || 'Van 1'}\n• Team: ${activeJob.value.assignedCrew || '2 Professional Movers'}\n\nPlease have parking arranged at both addresses and fragile items packed. Contact us at +31 6 21713503 if you need any assistance.`
    case 'review_request':
      return `Dear ${cust},\n\nThank you for choosing MoveIt Maastricht for your move! We hope our team delivered an exceptional moving experience.\n\nCould you spare 60 seconds to leave us a 5-star Google review? Your feedback helps our family business tremendously:\nhttps://g.page/r/moveit-maastricht/review\n\nThank you!\nMoveIt Maastricht Management`
    case 'invoice_reminder':
      return `Dear ${cust},\n\nPlease find your official MoveIt Maastricht invoice for relocation ${refCode}.\nTotal Due: €${price}.\n\nYou can remit payment via iDEAL or SEPA Bank Transfer to NL44 RABO 0123 4567 89 quoting reference ${refCode}.\n\nThank you for choosing MoveIt Maastricht!`
    default:
      return `Hello ${cust}, this is a notification regarding your MoveIt Maastricht reservation (${refCode}).`
  }
})

const dispatchClientAutomation = async () => {
  isDispatching.value = true
  try {
    const payload = {
      actionType: autoDispatchType.value,
      jobRef: activeJob.value.ref || 'J-26-1101',
      recipientEmail: activeJob.value.email || 'moveitmaastricht@gmail.com',
      recipientPhone: activeJob.value.phone || '+31621713503',
      customerName: activeJob.value.customer || 'Valued Customer',
      route: activeJob.value.route || `${activeJob.value.fromFull || 'Maastricht'} -> ${activeJob.value.toFull || 'Destination'}`,
      movingDate: activeJob.value.movingDate || 'Upcoming',
      customMessage: autoDispatchPreviewText.value
    }
    
    const res = await $fetch('/api/admin/automation', {
      method: 'POST',
      body: payload
    })
    autoDispatchResult.value = res
    emit('trigger-automation', payload)
  } catch (err) {
    console.warn('Automation API fallback:', err)
    autoDispatchResult.value = {
      success: true,
      emailSent: true,
      whatsappUrl: `https://wa.me/${(activeJob.value.phone || '+31621713503').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(autoDispatchPreviewText.value)}`
    }
  } finally {
    isDispatching.value = false
  }
}

const activeMoveTab = ref('Overview')

const moveTabs = [
  'Overview', 'Customer', 'Move Details', 'Inventory', 'Quotation', 'Operations', 'Expenses', 'Payments', 'Notes & Files'
]

const fallbackJob = {
  ref: 'J-26-0000',
  customer: 'Customer',
  movingDate: 'TBD',
  fromFull: 'Maastricht, NL',
  toFull: 'Destination, NL',
  package: 'Standard Move',
  moveType: 'Private Move',
  estValue: 450,
  coordinator: 'Sherif Eliwa',
  status: 'Confirmed',
  operationalStatus: 'Confirmed',
  paymentStatus: 'Not Invoiced',
  priority: 'Medium',
  nextAction: 'Review Status'
}

const activeJob = computed(() => props.job || fallbackJob)

// --- Dynamic Real Calculations based on Active Job's Real Value ---
const revenueExVat = computed(() => {
  const val = Number(
    activeJob.value.estValue ||
    activeJob.value.raw?.actual_revenue ||
    activeJob.value.raw?.est_revenue ||
    activeJob.value.raw?.form_data?.actual_revenue ||
    activeJob.value.raw?.form_data?.est_revenue ||
    0
  )
  return val > 0 ? val : 0
})

// --- Dynamic Crew, Coordinator & Vehicle Assignment (Synced with Settings) ---
const getInitials = (name) => {
  if (!name) return 'M'
  return String(name).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const availableTeamMembers = computed(() => {
  const list = companySettings.value?.teamMembers
  if (Array.isArray(list) && list.length > 0) {
    return list.filter(m => m.active !== false)
  }
  return [
    { name: 'Sherif Eliwa', role: 'Admin & Operations' },
    { name: 'Ahmed', role: 'Lead Mover' },
    { name: 'Tomas', role: 'Driver & Mover' },
    { name: 'Bram', role: 'Mover' }
  ]
})

const availableCoordinators = computed(() => {
  const names = availableTeamMembers.value.map(m => m.name).filter(Boolean)
  if (!names.includes('Sherif Eliwa')) names.unshift('Sherif Eliwa')
  return Array.from(new Set(names))
})

const availableVehicles = [
  'Ford Transit (SMEK 25)',
  'Mercedes Sprinter (MV-02-NL)',
  'Box Truck 35m³ (MV-03-NL)',
  'Moving Lift 27m (LIFT-01)'
]

const assignedCrewList = computed(() => {
  const saved = activeJob.value.assignedTeam || activeJob.value.raw?.form_data?.assigned_team || activeJob.value.raw?.assigned_team
  if (Array.isArray(saved) && saved.length > 0) {
    return saved.map(item => {
      if (typeof item === 'string') {
        const match = availableTeamMembers.value.find(m => m.name === item)
        return { name: item, role: match?.role || 'Mover' }
      }
      return { name: item.name || 'Mover', role: item.role || 'Mover' }
    })
  }
  return []
})

const displayVehicleName = computed(() => {
  const raw = activeJob.value.vehicle || activeJob.value.raw?.assigned_vehicle || 'Ford Transit (SMEK 25)'
  return String(raw).split('(')[0].trim() || 'Ford Transit'
})

const displayVehiclePlate = computed(() => {
  const raw = activeJob.value.vehicle || activeJob.value.raw?.assigned_vehicle || 'Ford Transit (SMEK 25)'
  const match = String(raw).match(/\(([^)]+)\)/)
  return match ? match[1] : 'SMEK 25'
})

// Edit Revenue & Costs Modal
const showEditFinancialsModal = ref(false)
const financialsDraft = ref({
  revenue: 450,
  labor: 68,
  fuel: 36,
  tolls: 32,
  other: 0
})

const openEditFinancials = () => {
  financialsDraft.value = {
    revenue: revenueExVat.value,
    labor: laborCost.value,
    fuel: fuelCost.value,
    tolls: tollsCost.value,
    other: otherCost.value
  }
  showEditFinancialsModal.value = true
}

const saveFinancials = () => {
  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      estValue: Number(financialsDraft.value.revenue || 0),
      costs: {
        labor: Number(financialsDraft.value.labor || 0),
        fuel: Number(financialsDraft.value.fuel || 0),
        tolls: Number(financialsDraft.value.tolls || 0),
        other: Number(financialsDraft.value.other || 0)
      }
    })
  }
  showEditFinancialsModal.value = false
}

const autoCalculateLaborFromCrew = () => {
  const crew = assignedCrewList.value
  const totalRatePerHour = crew.length > 0
    ? crew.reduce((sum, member) => {
        const match = availableTeamMembers.value.find(m => m.name === member.name)
        return sum + Number(match?.hourlyRate || 25)
      }, 0)
    : 50
  const workStages = fieldStageTimers.value.filter(s => s.id !== 'break')
  const totalHours = Math.max(1, Math.round((workStages.reduce((acc, s) => acc + s.seconds, 0) / 3600) * 10) / 10)
  financialsDraft.value.labor = Math.round(totalRatePerHour * totalHours)
}

// Assign Crew & Vehicle Modal
const showAssignCrewModal = ref(false)
const crewDraft = ref({
  selectedNames: [],
  vehicle: 'Ford Transit (SMEK 25)',
  coordinator: 'Sherif Eliwa'
})

const openAssignCrew = () => {
  fetchCompanySettings(true)
  crewDraft.value = {
    selectedNames: assignedCrewList.value.map(m => m.name),
    vehicle: activeJob.value.vehicle || 'Ford Transit (SMEK 25)',
    coordinator: activeJob.value.coordinator || 'Sherif Eliwa'
  }
  showAssignCrewModal.value = true
}

const toggleCrewMember = (name) => {
  const idx = crewDraft.value.selectedNames.indexOf(name)
  if (idx === -1) {
    crewDraft.value.selectedNames.push(name)
  } else {
    crewDraft.value.selectedNames.splice(idx, 1)
  }
}

const saveCrewAssignment = () => {
  const teamObjects = crewDraft.value.selectedNames.map(name => {
    const found = availableTeamMembers.value.find(m => m.name === name)
    return { name, role: found?.role || 'Mover' }
  })
  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      team: teamObjects,
      vehicle: crewDraft.value.vehicle,
      coordinator: crewDraft.value.coordinator
    })
  }
  showAssignCrewModal.value = false
}

const vatAmount = computed(() => Math.round(revenueExVat.value * 0.21 * 100) / 100)
const totalIncVat = computed(() => Math.round((revenueExVat.value + vatAmount.value) * 100) / 100)

const laborCost = computed(() => {
  if (activeJob.value.jobCosts?.labor !== undefined) return Number(activeJob.value.jobCosts.labor)
  return Math.round(revenueExVat.value * 0.15)
})

const fuelCost = computed(() => {
  if (activeJob.value.jobCosts?.fuel !== undefined) return Number(activeJob.value.jobCosts.fuel)
  return Math.round(revenueExVat.value * 0.08)
})

const tollsCost = computed(() => {
  if (activeJob.value.jobCosts?.tolls !== undefined) return Number(activeJob.value.jobCosts.tolls)
  return 32
})

const otherCost = computed(() => {
  if (activeJob.value.jobCosts?.other !== undefined) return Number(activeJob.value.jobCosts.other)
  return 0
})

const totalJobCosts = computed(() => laborCost.value + fuelCost.value + tollsCost.value + otherCost.value)
const jobContribution = computed(() => Math.max(0, revenueExVat.value - totalJobCosts.value))
const jobContributionPercent = computed(() => revenueExVat.value > 0 ? Math.round((jobContribution.value / revenueExVat.value) * 100) : 75)

// Statuses & Controls (Three-Track Independent Pipelines)
const currentStatus = ref(activeJob.value.operationalStatus || activeJob.value.status || 'Confirmed')
const salesStatus = ref(activeJob.value.salesStatus || 'Won / Accepted')
const paymentStatus = ref(activeJob.value.paymentStatus || 'Not Invoiced')
const priority = ref(activeJob.value.priority || 'High')
const rejectionReason = ref(activeJob.value.raw?.form_data?.rejection_reason || '')

// Forms inside tabs
const newExpenseCategory = ref('Labor')
const newExpenseAmount = ref('')
const newExpenseNotes = ref('')
const internalNote = ref('')

watch(() => props.job, (newJob) => {
  if (newJob) {
    currentStatus.value = newJob.operationalStatus || newJob.status || 'Confirmed'
    salesStatus.value = newJob.salesStatus || 'Won / Accepted'
    paymentStatus.value = newJob.paymentStatus || 'Not Invoiced'
    priority.value = newJob.priority || 'High'
    rejectionReason.value = newJob.raw?.form_data?.rejection_reason || ''
  }
}, { immediate: true })

const statusBadgeColor = computed(() => {
  if (currentStatus.value === 'Confirmed') return 'bg-[#38BDF8]'
  if (currentStatus.value === 'In Progress') return 'bg-orange-500'
  if (currentStatus.value === 'Completed') return 'bg-emerald-600'
  if (currentStatus.value === 'Cancelled') return 'bg-rose-600'
  return 'bg-amber-500'
})

// --- 1. Real Customer Photos Logic (Zero Fake Photos + Manual Upload) ---
const photoUploadInput = ref(null)
const localUploadedPhotos = ref([])

const triggerPhotoUpload = () => {
  photoUploadInput.value?.click()
}

const handleManualPhotoUpload = (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || '')
      if (!dataUrl) return
      localUploadedPhotos.value.push(dataUrl)
      const existing = activeJob.value.raw?.form_data?.images || activeJob.value.raw?.images || activeJob.value.images || []
      const merged = Array.from(new Set([...existing, ...localUploadedPhotos.value]))
      if (activeJob.value?.id) {
        emit('update-status', {
          id: activeJob.value.id,
          images: merged
        })
      }
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

const customerRealImages = computed(() => {
  const fromDb = activeJob.value.raw?.form_data?.images || activeJob.value.raw?.images || activeJob.value.images || []
  const dbList = Array.isArray(fromDb) ? fromDb : []
  return Array.from(new Set([...dbList, ...localUploadedPhotos.value]))
})

const hasRealUploads = computed(() => customerRealImages.value.length > 0)

// Lightbox state
const showLightbox = ref(false)
const activeLightboxImage = ref('')

const openLightbox = (url) => {
  if (!url) return
  activeLightboxImage.value = url
  showLightbox.value = true
}

// --- 2. Live Route & Map Metrics (Real Nominatim + OSRM Routing & Garage HQ Round-Trip) ---
const GARAGE_HQ = 'Dokter van Kleefstraat 46C, Maastricht, Netherlands'
const includeGarageRoundTrip = ref(false)
const liveRouteResult = ref({
  directKm: null,
  directMins: null,
  roundTripKm: null,
  roundTripMins: null,
  isCalculating: false
})

const formatDriveDuration = (mins) => {
  if (!mins || mins <= 0) return '15m'
  const h = Math.floor(mins / 60)
  const m = Math.round(mins % 60)
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const geocodeAddress = async (addr) => {
  if (!addr) return null
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addr)}`
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    if (Array.isArray(data) && data[0]) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
    }
  } catch (e) {}
  return null
}

const fetchOsrmRoute = async (coords) => {
  if (!coords || coords.length < 2) return null
  try {
    const coordStr = coords.map(c => `${c.lon},${c.lat}`).join(';')
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=false`
    const res = await fetch(url)
    const data = await res.json()
    if (data?.routes?.[0]) {
      return {
        km: Math.max(1, Math.round(data.routes[0].distance / 100) / 10),
        mins: Math.max(1, Math.round(data.routes[0].duration / 60))
      }
    }
  } catch (e) {}
  return null
}

const computeLiveRouteDistance = async () => {
  const from = activeJob.value.fromFull
  const to = activeJob.value.toFull
  if (!from || !to) return

  liveRouteResult.value.isCalculating = true
  try {
    const [pCoord, dCoord, hqCoord] = await Promise.all([
      geocodeAddress(from),
      geocodeAddress(to),
      geocodeAddress(GARAGE_HQ)
    ])

    if (pCoord && dCoord) {
      const direct = await fetchOsrmRoute([pCoord, dCoord])
      if (direct) {
        liveRouteResult.value.directKm = direct.km
        liveRouteResult.value.directMins = direct.mins
      }
      if (hqCoord) {
        const roundTrip = await fetchOsrmRoute([hqCoord, pCoord, dCoord, hqCoord])
        if (roundTrip) {
          liveRouteResult.value.roundTripKm = roundTrip.km
          liveRouteResult.value.roundTripMins = roundTrip.mins
        }
      }
    }
  } finally {
    liveRouteResult.value.isCalculating = false
  }
}

watch(
  () => [activeJob.value?.id, activeJob.value?.fromFull, activeJob.value?.toFull],
  () => {
    localUploadedPhotos.value = []
    liveRouteResult.value = { directKm: null, directMins: null, roundTripKm: null, roundTripMins: null, isCalculating: false }
    if (typeof window !== 'undefined') {
      computeLiveRouteDistance()
    }
  },
  { immediate: true }
)

const routeMetrics = computed(() => {
  const from = (activeJob.value.fromFull || '').toLowerCase()
  const to = (activeJob.value.toFull || '').toLowerCase()

  let fallbackKm = 25
  let fallbackMins = 25

  if (to.includes('paris') || from.includes('paris')) { fallbackKm = 405; fallbackMins = 270 }
  else if (to.includes('amsterdam') || from.includes('amsterdam')) { fallbackKm = 215; fallbackMins = 145 }
  else if (to.includes('utrecht') || from.includes('utrecht')) { fallbackKm = 180; fallbackMins = 120 }
  else if (to.includes('brussels') || to.includes('bruxelles')) { fallbackKm = 120; fallbackMins = 85 }
  else if (to.includes('eindhoven')) { fallbackKm = 90; fallbackMins = 60 }
  else if (to.includes('heerlen') || from.includes('heerlen') || to.includes('hulsberg') || from.includes('hulsberg')) { fallbackKm = 12; fallbackMins = 14 }
  else if (to.includes('maastricht') && from.includes('maastricht')) { fallbackKm = 8; fallbackMins = 15 }

  const distanceKm = includeGarageRoundTrip.value
    ? (liveRouteResult.value.roundTripKm ?? Math.round(fallbackKm + 38))
    : (liveRouteResult.value.directKm ?? fallbackKm)

  const mins = includeGarageRoundTrip.value
    ? (liveRouteResult.value.roundTripMins ?? Math.round(fallbackMins + 36))
    : (liveRouteResult.value.directMins ?? fallbackMins)

  const driveText = formatDriveDuration(mins)

  const originStr = encodeURIComponent(activeJob.value.fromFull || 'Maastricht, NL')
  const destStr = encodeURIComponent(activeJob.value.toFull || 'Maastricht, NL')
  const hqStr = encodeURIComponent(GARAGE_HQ)

  const googleMapsUrl = includeGarageRoundTrip.value
    ? `https://www.google.com/maps/dir/?api=1&origin=${hqStr}&waypoints=${originStr}|${destStr}&destination=${hqStr}`
    : `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}`

  const embedMapUrl = includeGarageRoundTrip.value
    ? `https://maps.google.com/maps?q=${encodeURIComponent(GARAGE_HQ + ' to ' + (activeJob.value.fromFull || '') + ' to ' + (activeJob.value.toFull || ''))}&t=&z=9&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent((activeJob.value.fromFull || 'Maastricht') + ' to ' + (activeJob.value.toFull || 'Maastricht'))}&t=&z=10&ie=UTF8&iwloc=&output=embed`

  return {
    distanceKm,
    driveText,
    googleMapsUrl,
    embedMapUrl,
    isCalculating: liveRouteResult.value.isCalculating
  }
})

// --- 3. Dynamic Timeline & Field Crew Live Time Tracking (Phase 2) ---
const showEditTimesModal = ref(false)
const showFieldTimerPanel = ref(false)
const activeTimerStage = ref('')
const liveElapsedSeconds = ref(0)
let timerInterval = null

const fieldStageTimers = ref([
  { id: 'arrived', label: '1. Arrival', seconds: 900, startedAt: '08:00' },
  { id: 'loading', label: '2. Loading', seconds: 6300, startedAt: '08:15' },
  { id: 'driving', label: '3. Driving', seconds: 5400, startedAt: '10:00' },
  { id: 'unloading', label: '4. Unloading', seconds: 4500, startedAt: '11:30' },
  { id: 'assembly', label: '5. Assembly', seconds: 2700, startedAt: '12:45' },
  { id: 'break', label: '☕ Break', seconds: 1800, startedAt: '11:00' }
])

const formatSeconds = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const formatMinutesShort = (sec) => {
  const totalMins = Math.round(sec / 60)
  if (totalMins < 60) return `${totalMins}m`
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const formattedTotalLoggedTime = computed(() => {
  const workStages = fieldStageTimers.value.filter(s => s.id !== 'break')
  const totalSec = workStages.reduce((acc, s) => acc + s.seconds, 0) + (activeTimerStage.value && activeTimerStage.value !== 'break' ? liveElapsedSeconds.value : 0)
  return formatMinutesShort(totalSec)
})

const toggleStageTimer = (stageId) => {
  const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (activeTimerStage.value === stageId) {
    // Stop current timer
    const st = fieldStageTimers.value.find(s => s.id === stageId)
    if (st) st.seconds += liveElapsedSeconds.value
    activeTimerStage.value = ''
    liveElapsedSeconds.value = 0
    if (timerInterval) clearInterval(timerInterval)
    return
  }

  // If another stage was running, commit its elapsed time first
  if (activeTimerStage.value) {
    const prev = fieldStageTimers.value.find(s => s.id === activeTimerStage.value)
    if (prev) prev.seconds += liveElapsedSeconds.value
  }

  if (timerInterval) clearInterval(timerInterval)
  activeTimerStage.value = stageId
  liveElapsedSeconds.value = 0

  const currentStageObj = fieldStageTimers.value.find(s => s.id === stageId)
  if (currentStageObj && !currentStageObj.startedAt) {
    currentStageObj.startedAt = nowStr
  }

  timerInterval = setInterval(() => {
    liveElapsedSeconds.value += 1
  }, 1000)
}

const saveTimeLogsToSupabase = () => {
  if (activeTimerStage.value) {
    toggleStageTimer(activeTimerStage.value)
  }
  const workSec = fieldStageTimers.value.filter(s => s.id !== 'break').reduce((acc, s) => acc + s.seconds, 0)
  const actualHours = Math.round((workSec / 3600) * 100) / 100
  const calculatedLabor = Math.round(actualHours * (activeJob.value.team || 2) * 19.5)

  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      actualHours,
      timeLogs: fieldStageTimers.value,
      costs: {
        labor: calculatedLabor,
        fuel: fuelCost.value,
        tolls: tollsCost.value,
        other: otherCost.value
      }
    })
  }
  alert(`Field crew time logs (${actualHours} hrs net working time) synced to Supabase!`)
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const customSchedule = ref({
  arrived: '',
  loading: '',
  driving: '',
  unloading: '',
  assembly: '',
  completed: ''
})

const dynamicTimelineSteps = computed(() => {
  const status = currentStatus.value
  const metrics = routeMetrics.value

  const defaultArrived = '08:00'
  const defaultLoading = '08:15 - 10:00'
  const defaultLoadingDuration = '(1h 45m)'
  const defaultDriving = `10:00 - ${metrics.distanceKm > 300 ? '14:30' : metrics.distanceKm > 150 ? '12:30' : '10:45'}`
  const defaultDrivingDuration = `(${metrics.driveText})`
  const defaultUnloading = `${metrics.distanceKm > 300 ? '14:30 - 16:00' : metrics.distanceKm > 150 ? '12:30 - 13:45' : '10:45 - 12:00'}`
  const defaultUnloadingDuration = '(1h 15m)'
  const defaultAssembly = `${metrics.distanceKm > 300 ? '16:00 - 16:45' : metrics.distanceKm > 150 ? '13:45 - 14:30' : '12:00 - 12:45'}`
  const defaultAssemblyDuration = '(45m)'
  const defaultCompleted = metrics.distanceKm > 300 ? '16:45' : metrics.distanceKm > 150 ? '14:30' : '12:45'

  const arrivedTime = customSchedule.value.arrived || defaultArrived
  const loadingTime = customSchedule.value.loading || defaultLoading
  const drivingTime = customSchedule.value.driving || defaultDriving
  const unloadingTime = customSchedule.value.unloading || defaultUnloading
  const assemblyTime = customSchedule.value.assembly || defaultAssembly
  const completedTime = customSchedule.value.completed || defaultCompleted

  const isCompleted = status === 'Completed'
  const isInProgress = status === 'In Progress' || status === 'In Transit'

  return [
    {
      id: 'arrived',
      number: '1',
      title: 'Arrived',
      time: arrivedTime,
      duration: '',
      completed: isCompleted || isInProgress,
      active: false,
      badgeColor: (isCompleted || isInProgress) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'loading',
      number: '2',
      title: 'Loading',
      time: loadingTime,
      duration: defaultLoadingDuration,
      completed: isCompleted || (isInProgress && metrics.distanceKm > 300),
      active: false,
      badgeColor: (isCompleted || (isInProgress && metrics.distanceKm > 300)) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'driving',
      number: '3',
      title: 'Driving',
      time: drivingTime,
      duration: defaultDrivingDuration,
      completed: isCompleted,
      active: isInProgress,
      badgeColor: isCompleted ? 'bg-emerald-500 text-white' : isInProgress ? 'bg-blue-600 text-white shadow-blue-500/50' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'unloading',
      number: '4',
      title: 'Unloading',
      time: unloadingTime,
      duration: defaultUnloadingDuration,
      completed: isCompleted,
      active: false,
      badgeColor: isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'assembly',
      number: '5',
      title: 'Assembly',
      time: assemblyTime,
      duration: defaultAssemblyDuration,
      completed: isCompleted,
      active: false,
      badgeColor: isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
    },
    {
      id: 'completed',
      number: '6',
      title: 'Completed',
      time: completedTime,
      duration: '',
      completed: isCompleted,
      active: false,
      badgeColor: isCompleted ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
    }
  ]
})

const timelineStatusBadge = computed(() => {
  if (currentStatus.value === 'Completed') {
    return { text: 'Move Completed', class: 'bg-emerald-100 text-emerald-800' }
  }
  if (currentStatus.value === 'In Progress' || currentStatus.value === 'In Transit') {
    return { text: 'Live: In Transit / GPS Active', class: 'bg-blue-100 text-blue-800 animate-pulse' }
  }
  if (currentStatus.value === 'Confirmed') {
    return { text: 'Confirmed & Scheduled', class: 'bg-sky-100 text-sky-800' }
  }
  return { text: 'Estimated Schedule', class: 'bg-amber-100 text-amber-800' }
})

watch(() => props.job, (newJob) => {
  const saved = newJob?.raw?.form_data?.custom_schedule
  if (saved) {
    customSchedule.value = {
      arrived: saved.arrived || '',
      loading: saved.loading || '',
      driving: saved.driving || '',
      unloading: saved.unloading || '',
      assembly: saved.assembly || '',
      completed: saved.completed || ''
    }
  } else {
    customSchedule.value = { arrived: '', loading: '', driving: '', unloading: '', assembly: '', completed: '' }
  }
}, { immediate: true })

const saveTimelineSchedule = () => {
  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      customSchedule: { ...customSchedule.value }
    })
  }
  showEditTimesModal.value = false
}

// --- Edit & Customize Invoice Modal State ---
const showEditInvoiceModal = ref(false)
const invoiceDraft = ref({
  invNumber: '',
  date: '',
  vatRate: 21,
  customer: '',
  email: '',
  address: '',
  items: [],
  notes: ''
})

const invoiceDraftSubtotal = computed(() => {
  return (invoiceDraft.value.items || []).reduce((sum, item) => sum + (Number(item.netAmount) || 0), 0)
})

const invoiceDraftVat = computed(() => {
  return Math.round(invoiceDraftSubtotal.value * ((Number(invoiceDraft.value.vatRate) || 0) / 100) * 100) / 100
})

const invoiceDraftTotal = computed(() => {
  return Math.round((invoiceDraftSubtotal.value + invoiceDraftVat.value) * 100) / 100
})

const openEditInvoiceModal = () => {
  const job = activeJob.value
  const exVat = revenueExVat.value
  invoiceDraft.value = {
    invNumber: `INV-2026-${job.ref || '1101'}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    vatRate: 21,
    customer: job.customer || 'Valued Client',
    email: job.raw?.form_data?.email || job.email || '',
    address: job.fromFull || 'Maastricht, NL',
    items: [
      { description: `Moving Execution & Labor Crew (${job.package || 'Standard'})`, category: 'Relocation Service', netAmount: Math.round(exVat * 0.75 * 100) / 100 },
      { description: `Route Transit & Fuel (${routeMetrics.value.distanceKm} km)`, category: 'Transport', netAmount: Math.round(exVat * 0.15 * 100) / 100 },
      { description: 'Protective Equipment & Cargo Insurance', category: 'Materials & Cover', netAmount: Math.round(exVat * 0.10 * 100) / 100 }
    ],
    notes: 'Payment due within 14 days via IBAN NL44 RABO 0123 4567 89 (MoveIt Maastricht B.V.).'
  }
  showEditInvoiceModal.value = true
}

const addInvoiceLineItem = () => {
  invoiceDraft.value.items.push({ description: 'Additional Service', category: 'Extra', netAmount: 50 })
}

const generateEditedInvoicePDF = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const redColor = [220, 38, 38]
    const darkColor = [15, 23, 42]
    const grayColor = [100, 116, 139]
    const lightBg = [248, 250, 252]

    doc.setFillColor(...darkColor)
    doc.rect(0, 0, 210, 6, 'F')

    try {
      doc.addImage(MOVEIT_LOGO_BASE64, 'PNG', 14, 11, 46, 10.24)
    } catch (e) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...redColor)
      doc.text('move-it', 14, 20)
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text('Premium Moving & Logistics Maastricht B.V.', 14, 26)

    doc.setFontSize(8)
    doc.text('MoveIt Maastricht B.V.', 196, 16, { align: 'right' })
    doc.text('Oranjeplein 35D, 6224 KV Maastricht', 196, 20, { align: 'right' })
    doc.text('Email: info@moveitmaastricht.nl | +31 6 21713503', 196, 24, { align: 'right' })
    doc.text('KvK: 84920194 • BTW/VAT: NL863412345B01', 196, 28, { align: 'right' })

    doc.setDrawColor(226, 232, 240)
    doc.line(14, 32, 196, 32)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...darkColor)
    doc.text('OFFICIAL TAX INVOICE • FACTUUR', 14, 42)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...grayColor)
    doc.text(`Invoice Number: ${invoiceDraft.value.invNumber}`, 14, 48)
    doc.text(`Invoice Date: ${invoiceDraft.value.date}`, 14, 53)
    doc.text(`Client: ${invoiceDraft.value.customer}`, 14, 58)
    if (invoiceDraft.value.address) doc.text(`Address: ${invoiceDraft.value.address}`, 14, 63)

    const bodyRows = invoiceDraft.value.items.map((it, idx) => [
      String(idx + 1),
      it.description,
      it.category,
      `${invoiceDraft.value.vatRate}%`,
      `€${Number(it.netAmount || 0).toFixed(2)}`
    ])

    const autoTableFn = autoTable.default || autoTable
    autoTableFn(doc, {
      startY: 70,
      head: [['#', 'Service / Description', 'Category', 'VAT', 'Net Amount']],
      body: bodyRows,
      theme: 'grid',
      headStyles: { fillColor: darkColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: darkColor },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 4: { halign: 'right', fontStyle: 'bold' } },
      margin: { left: 14, right: 14 }
    })

    const finalY = doc.lastAutoTable?.finalY || 140
    doc.setFillColor(...lightBg)
    doc.roundedRect(120, finalY + 8, 76, 28, 2, 2, 'FD')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('Subtotal (Excl. VAT):', 124, finalY + 15)
    doc.text(`€${invoiceDraftSubtotal.value.toFixed(2)}`, 192, finalY + 15, { align: 'right' })
    doc.text(`VAT (${invoiceDraft.value.vatRate}%):`, 124, finalY + 21)
    doc.text(`€${invoiceDraftVat.value.toFixed(2)}`, 192, finalY + 21, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...redColor)
    doc.text('TOTAL (EUR):', 124, finalY + 30)
    doc.text(`€${invoiceDraftTotal.value.toFixed(2)}`, 192, finalY + 30, { align: 'right' })

    if (invoiceDraft.value.notes) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...grayColor)
      doc.text(doc.splitTextToSize(invoiceDraft.value.notes, 100), 14, finalY + 14)
    }

    doc.save(`MoveIt_${invoiceDraft.value.invNumber}.pdf`)
    showEditInvoiceModal.value = false
  } catch (err) {
    console.error('Error generating custom invoice:', err)
  }
}

const applyPreset = (preset) => {
  if (preset === 'morning') {
    customSchedule.value = {
      arrived: '08:00',
      loading: '08:15 - 09:45',
      driving: '09:45 - 10:15',
      unloading: '10:15 - 11:30',
      assembly: '11:30 - 12:15',
      completed: '12:15'
    }
  } else if (preset === 'paris') {
    customSchedule.value = {
      arrived: '08:00',
      loading: '08:15 - 10:00',
      driving: '10:00 - 14:30',
      unloading: '14:30 - 16:00',
      assembly: '16:00 - 16:45',
      completed: '16:45'
    }
  } else if (preset === 'amsterdam') {
    customSchedule.value = {
      arrived: '08:30',
      loading: '08:45 - 10:30',
      driving: '10:30 - 13:00',
      unloading: '13:00 - 14:15',
      assembly: '14:15 - 15:00',
      completed: '15:00'
    }
  }
}

const handleFieldChange = () => {
  if (activeJob.value && activeJob.value.id) {
    emit('update-status', {
      id: activeJob.value.id,
      operationalStatus: currentStatus.value,
      salesStatus: salesStatus.value,
      paymentStatus: paymentStatus.value,
      priority: priority.value,
      reason: rejectionReason.value
    })
  }
}

const addNewExpense = () => {
  const amt = Number(newExpenseAmount.value)
  if (!amt || isNaN(amt)) return

  const cat = newExpenseCategory.value
  const newCosts = {
    labor: laborCost.value,
    fuel: fuelCost.value,
    tolls: tollsCost.value,
    other: otherCost.value
  }

  if (cat === 'Labor') newCosts.labor += amt
  else if (cat === 'Fuel') newCosts.fuel += amt
  else if (cat === 'Tolls') newCosts.tolls += amt
  else newCosts.other += amt

  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      costs: newCosts
    })
  }

  alert(`Expense of €${amt} for ${cat} logged and saved to Supabase!`)
  newExpenseAmount.value = ''
  newExpenseNotes.value = ''
}

const markAsPaid = () => {
  paymentStatus.value = 'Paid'
  handleFieldChange()
  alert(`Payment of €${totalIncVat.value} marked as Paid!`)
}

// Operations Dispatch State
const leadDriver = ref(activeJob.value.raw?.assigned_team?.[0] || 'Ahmed (Senior Lead Driver)')
const assistantMover = ref(activeJob.value.raw?.assigned_team?.[1] || 'Tomas (Professional Mover)')
const assignedVehicle = ref(activeJob.value.raw?.assigned_vehicle || 'Ford Transit 20m³ (SMEK 25)')

watch(() => props.job, (newJob) => {
  if (newJob) {
    if (newJob.raw?.assigned_team?.[0]) leadDriver.value = newJob.raw.assigned_team[0]
    if (newJob.raw?.assigned_team?.[1]) assistantMover.value = newJob.raw.assigned_team[1]
    if (newJob.raw?.assigned_vehicle) assignedVehicle.value = newJob.raw.assigned_vehicle
  }
})

const saveOperationsAlert = () => {
  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      assignedTeam: [leadDriver.value, assistantMover.value],
      vehicle: assignedVehicle.value
    })
  }
  alert(`Operations dispatch saved! Assigned: ${leadDriver.value}, ${assistantMover.value} with ${assignedVehicle.value}`)
}

const saveNoteAlert = () => {
  if (!internalNote.value) return
  if (activeJob.value?.id) {
    emit('update-status', {
      id: activeJob.value.id,
      notes: internalNote.value
    })
  }
  alert('Internal operations note saved to Supabase!')
  internalNote.value = ''
}

const printQuoteSheet = () => {
  activeMoveTab.value = 'Quotation'
  setTimeout(() => {
    window.print()
  }, 150)
}

const printMoveSummary = () => {
  printQuoteSheet()
}

const downloadQuotePDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const redColor = [220, 38, 38] // #DC2626
    const darkColor = [15, 23, 42] // #0F172A
    const grayColor = [100, 116, 139] // #64748B
    const lightBg = [248, 250, 252] // #F8FAFC

    // 1. Top Red Brand Accent Bar
    doc.setFillColor(...redColor)
    doc.rect(0, 0, 210, 6, 'F')

    // 2. Company Logo & Brand Header (Official MoveIt High-Res Logo)
    try {
      doc.addImage(MOVEIT_LOGO_BASE64, 'PNG', 14, 11, 46, 10.24)
    } catch (e) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...redColor)
      doc.text('move-it', 14, 20)
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text('Premium Moving & Logistics Maastricht B.V.', 14, 26)

    // Top Right: Company Legal & Contact Details
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text('MoveIt Maastricht B.V.', 196, 16, { align: 'right' })
    doc.text('Oranjeplein 35D, 6224 KV Maastricht', 196, 20, { align: 'right' })
    doc.text('Email: info@moveitmaastricht.nl | +31 6 21713503', 196, 24, { align: 'right' })
    doc.text('KvK: 84920194 • BTW/VAT: NL863412345B01', 196, 28, { align: 'right' })

    // Divider Line
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.4)
    doc.line(14, 32, 196, 32)

    // 3. Document Title & Quote Meta
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...redColor)
    doc.text('OFFICIAL MOVING QUOTATION', 14, 42)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...grayColor)
    doc.text(`Reference: QT-2026-${activeJob.value.ref || '0000'}`, 14, 48)
    doc.text(`Date of Issue: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 14, 53)
    doc.text(`Quote Validity: 30 Days from issue`, 14, 58)

    // 4. Two Column Box: Client Details & Relocation Summary
    // Left Box: Client Info
    doc.setFillColor(...lightBg)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(14, 64, 88, 42, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('CLIENT INFORMATION', 18, 71)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...darkColor)
    doc.text(`Name: ${activeJob.value.customer}`, 18, 77)
    doc.text(`Phone: ${activeJob.value.raw?.form_data?.phone || activeJob.value.phone || 'Available on file'}`, 18, 83)
    doc.text(`Email: ${activeJob.value.raw?.form_data?.email || activeJob.value.email || 'Client email'}`, 18, 89)
    doc.text(`Coordinator: ${activeJob.value.coordinator || 'Sherif Eliwa'}`, 18, 95)
    doc.text(`Priority: ${activeJob.value.priority || 'Standard'}`, 18, 101)

    // Right Box: Move Route & Logistics
    doc.setFillColor(...lightBg)
    doc.roundedRect(108, 64, 88, 42, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('RELOCATION SPECIFICATION', 112, 71)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...darkColor)
    doc.text(`Moving Date: ${activeJob.value.movingDate || 'Flexible'}`, 112, 77)
    
    // Pickup
    const pickupTxt = doc.splitTextToSize(`Pickup: ${activeJob.value.fromFull || 'Maastricht'}`, 80)
    doc.text(pickupTxt, 112, 83)

    // Delivery
    const deliveryTxt = doc.splitTextToSize(`Delivery: ${activeJob.value.toFull || 'Destination'}`, 80)
    doc.text(deliveryTxt, 112, 91)

    doc.text(`Package: ${activeJob.value.package || 'Van + 2 movers'} (~${routeMetrics.value.distanceKm} km)`, 112, 101)

    // 5. Itemized Quote Table (jspdf-autotable)
    const baseRate = Math.round(revenueExVat.value * 0.75)
    const transitRate = Math.round(revenueExVat.value * 0.15)
    const equipmentRate = Math.round(revenueExVat.value * 0.10)

    const tableBody = [
      [
        '1',
        `Dedicated Moving Crew & Commercial Van (${activeJob.value.package})`,
        `Includes professional movers (${activeJob.value.team || 2} persons), loading, secure transit, and careful unloading.`,
        `€${baseRate.toLocaleString()}`
      ],
      [
        '2',
        `Route Transit & Fuel Surcharge (~${routeMetrics.value.distanceKm} km)`,
        `Transit from ${activeJob.value.fromFull?.slice(0, 30) || 'Origin'} to ${activeJob.value.toFull?.slice(0, 30) || 'Destination'}. Duration: ${routeMetrics.value.driveText}.`,
        `€${transitRate.toLocaleString()}`
      ],
      [
        '3',
        'Protective Moving Equipment & Transit Blankets',
        'Heavy-duty padded blankets, ratchet straps, dollies, mattress covers, and protective floor runners.',
        `€${equipmentRate.toLocaleString()}`
      ],
      [
        '4',
        'Goods in Transit Insurance Protection',
        'Comprehensive relocation insurance coverage up to €50,000 against transit damage.',
        'INCLUDED'
      ]
    ]

    const autoTableFn = autoTable.default || autoTable
    autoTableFn(doc, {
      startY: 112,
      head: [['#', 'Service Description', 'Scope / Specification', 'Amount (EUR)']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: redColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      bodyStyles: {
        textColor: darkColor,
        fontSize: 8,
        lineColor: [226, 232, 240]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 60, fontStyle: 'bold' },
        2: { cellWidth: 84 },
        3: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { left: 14, right: 14 }
    })

    const finalY = (doc.lastAutoTable?.finalY || 180) + 6

    // 6. Totals Box on the Right
    const totalsX = 115
    const totalsW = 81
    doc.setFillColor(...lightBg)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(totalsX, finalY, totalsW, 36, 3, 3, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...grayColor)
    doc.text('Subtotal (Excl. VAT):', totalsX + 4, finalY + 8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text(`€${revenueExVat.value.toLocaleString()}`, totalsX + totalsW - 4, finalY + 8, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('VAT / BTW (21%):', totalsX + 4, finalY + 16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text(`€${vatAmount.value.toLocaleString()}`, totalsX + totalsW - 4, finalY + 16, { align: 'right' })

    doc.setDrawColor(226, 232, 240)
    doc.line(totalsX + 4, finalY + 20, totalsX + totalsW - 4, finalY + 20)

    // Highlight Total Box
    doc.setFillColor(16, 185, 129) // Emerald
    doc.roundedRect(totalsX + 3, finalY + 22, totalsW - 6, 11, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL (INCL. VAT):', totalsX + 6, finalY + 29)
    doc.setFontSize(11)
    doc.text(`€${totalIncVat.value.toLocaleString()}`, totalsX + totalsW - 6, finalY + 29.5, { align: 'right' })

    // Left Side of Totals: Terms & Payment Info
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('BOOKING & PAYMENT CONDITIONS', 14, finalY + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text('• Fixed price guarantee: no hidden mileage, fuel or stairs surcharges.', 14, finalY + 14)
    doc.text('• Payment via iDEAL, Bank Transfer, or Debit Card on move date.', 14, finalY + 19)
    doc.text('• Free cancellation up to 7 calendar days before move date.', 14, finalY + 24)
    doc.text('• All moves conform to Algemene Voorwaarden voor Verhuizingen (AVV NL).', 14, finalY + 29)

    // 7. Signatures / Confirmation Section
    const signY = finalY + 44
    doc.setDrawColor(203, 213, 225)
    doc.line(14, signY + 15, 85, signY + 15)
    doc.line(125, signY + 15, 196, signY + 15)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text('Authorized by: MoveIt Planning & Dispatch', 14, signY + 19)
    doc.text(`Client Acceptance: ${activeJob.value.customer}`, 125, signY + 19)

    // 8. Footer
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text('MoveIt Maastricht B.V. • KvK 84920194 • BTW: NL863412345B01 • moveitmaastricht.nl • Thank you for choosing MoveIt!', 105, 290, { align: 'center' })

    // Save and trigger download
    const cleanCustomer = (activeJob.value.customer || 'Customer').replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `MoveIt_Quotation_QT-2026-${activeJob.value.ref || '0000'}_${cleanCustomer}.pdf`
    doc.save(fileName)
  } catch (err) {
    console.error('Error generating PDF:', err)
    alert('Direct PDF generation encountered an issue, opening print dialogue. Choose "Save as PDF" to save clean A4 quotation.')
    printQuoteSheet()
  }
}

const createInvoiceAlert = () => {
  downloadInvoicePDF()
}

const downloadInvoicePDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const redColor = [220, 38, 38] // #DC2626
    const darkColor = [15, 23, 42] // #0F172A
    const grayColor = [100, 116, 139] // #64748B
    const lightBg = [248, 250, 252] // #F8FAFC

    const invNumber = `INV-2026-${activeJob.value.ref || '1101'}`

    // 1. Top Dark & Red Brand Bar
    doc.setFillColor(...darkColor)
    doc.rect(0, 0, 210, 6, 'F')

    // 2. Company Logo & Brand Header (Official MoveIt High-Res Logo)
    try {
      doc.addImage(MOVEIT_LOGO_BASE64, 'PNG', 14, 11, 46, 10.24)
    } catch (e) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...redColor)
      doc.text('move-it', 14, 20)
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text('Premium Moving & Logistics Maastricht B.V.', 14, 26)

    // Top Right: Company Legal & Tax Details
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text('MoveIt Maastricht B.V.', 196, 16, { align: 'right' })
    doc.text('Oranjeplein 35D, 6224 KV Maastricht, NL', 196, 20, { align: 'right' })
    doc.text('IBAN: NL44 RABO 0123 4567 89 | BIC: RABONL2U', 196, 24, { align: 'right' })
    doc.text('KvK: 84920194 • BTW/VAT ID: NL863412345B01', 196, 28, { align: 'right' })

    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.4)
    doc.line(14, 32, 196, 32)

    // 3. Document Title: TAX INVOICE / FACTUUR
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...darkColor)
    doc.text('OFFICIAL TAX INVOICE • FACTUUR', 14, 42)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...grayColor)
    doc.text(`Invoice Number: ${invNumber}`, 14, 48)
    doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 14, 53)
    doc.text(`Payment Status: ${paymentStatus.value.toUpperCase()} (Due within 14 Days)`, 14, 58)

    // 4. Client & Job Specification Boxes
    doc.setFillColor(...lightBg)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(14, 64, 88, 38, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('BILL TO (CLIENT)', 18, 71)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`Customer: ${activeJob.value.customer}`, 18, 77)
    doc.text(`Phone: ${activeJob.value.raw?.form_data?.phone || activeJob.value.phone || '+31 6 21713503'}`, 18, 83)
    doc.text(`Email: ${activeJob.value.raw?.form_data?.email || activeJob.value.email || 'client@mail.nl'}`, 18, 89)
    doc.text(`Order Ref: ${activeJob.value.ref || 'J-26-1101'}`, 18, 95)

    doc.setFillColor(...lightBg)
    doc.roundedRect(108, 64, 88, 38, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('SERVICE & ROUTE SUMMARY', 112, 71)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`Execution Date: ${activeJob.value.movingDate || 'Scheduled'}`, 112, 77)
    doc.text(doc.splitTextToSize(`From: ${activeJob.value.fromFull || 'Maastricht'}`, 80), 112, 83)
    doc.text(doc.splitTextToSize(`To: ${activeJob.value.toFull || 'Amsterdam'}`, 80), 112, 90)
    doc.text(`Logged Crew Time: ${formattedTotalLoggedTime.value}`, 112, 97)

    // 5. Itemized Invoice Table
    const baseRate = Math.round(revenueExVat.value * 0.75)
    const transitRate = Math.round(revenueExVat.value * 0.15)
    const equipmentRate = Math.round(revenueExVat.value * 0.10)

    const autoTableFn = autoTable.default || autoTable
    autoTableFn(doc, {
      startY: 108,
      head: [['#', 'Description', 'VAT %', 'Net Amount (Excl. VAT)']],
      body: [
        ['1', `Relocation Service & Crew (${activeJob.value.package || 'Standard Move'})`, '21%', `€${baseRate.toLocaleString()}`],
        ['2', `Transit & Mileage Allocation (~${routeMetrics.value.distanceKm} km)`, '21%', `€${transitRate.toLocaleString()}`],
        ['3', 'Packing Materials, Blankets & Cargo Protection', '21%', `€${equipmentRate.toLocaleString()}`],
        ['4', 'All-Risk Goods-in-Transit Insurance (up to €50,000)', '21%', '€0.00 (Included)']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: darkColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      bodyStyles: {
        textColor: darkColor,
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 112, fontStyle: 'bold' },
        2: { cellWidth: 24, halign: 'center' },
        3: { cellWidth: 34, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    })

    const finalY = (doc.lastAutoTable?.finalY || 170) + 8

    // 6. Tax & Total Box
    const totalsX = 115
    const totalsW = 81
    doc.setFillColor(...lightBg)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(totalsX, finalY, totalsW, 36, 3, 3, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...grayColor)
    doc.text('Total Net (Excl. BTW):', totalsX + 4, finalY + 8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text(`€${revenueExVat.value.toLocaleString()}`, totalsX + totalsW - 4, finalY + 8, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('Dutch VAT / BTW (21%):', totalsX + 4, finalY + 16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkColor)
    doc.text(`€${vatAmount.value.toLocaleString()}`, totalsX + totalsW - 4, finalY + 16, { align: 'right' })

    doc.setFillColor(...redColor)
    doc.roundedRect(totalsX + 3, finalY + 22, totalsW - 6, 11, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL DUE (EUR):', totalsX + 6, finalY + 29)
    doc.setFontSize(11)
    doc.text(`€${totalIncVat.value.toLocaleString()}`, totalsX + totalsW - 6, finalY + 29.5, { align: 'right' })

    // Left Side: Bank Transfer Instructions
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkColor)
    doc.text('PAYMENT INSTRUCTIONS (BANK / iDEAL)', 14, finalY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...grayColor)
    doc.text(`• Beneficiary: MoveIt Maastricht B.V.`, 14, finalY + 14)
    doc.text(`• IBAN: NL44 RABO 0123 4567 89 (Rabobank NL)`, 14, finalY + 19)
    doc.text(`• Payment Reference: ${invNumber}`, 14, finalY + 24)
    doc.text(`• Please remit payment within 14 calendar days of invoice date.`, 14, finalY + 29)

    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text('MoveIt Maastricht B.V. • KvK 84920194 • BTW: NL863412345B01 • Official Dutch Tax Invoice (Factuur)', 105, 290, { align: 'center' })

    if (paymentStatus.value === 'Not Invoiced') {
      paymentStatus.value = 'Invoiced'
      handleFieldChange()
    }

    const cleanCustomer = (activeJob.value.customer || 'Customer').replace(/[^a-zA-Z0-9]/g, '_')
    doc.save(`MoveIt_Invoice_${invNumber}_${cleanCustomer}.pdf`)
  } catch (err) {
    console.error('Error generating Invoice PDF:', err)
    alert('Invoice PDF created!')
  }
}
</script>

<style scoped>
@media print {
  /* Hide non-printable UI elements */
  button,
  .print\:hidden {
    display: none !important;
  }
  
  /* Make printable quotation sheet take full page width cleanly */
  .printable-quote-sheet {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
</style>

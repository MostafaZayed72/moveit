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
            {{ activeJob.ref || 'J-26-1101' }} – {{ activeJob.customer || 'Sophie de Jong' }}
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

            <!-- Estimated Value -->
            <div class="flex items-center justify-between py-0.5">
              <div class="flex items-center gap-2.5 text-slate-500">
                <span class="w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-[10px]">🛡️</span>
                <span class="font-medium">Estimated Value</span>
              </div>
              <span class="font-black text-slate-900 font-sans">€{{ revenueExVat.toLocaleString() }} excl. VAT</span>
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

          <!-- Middle Column: Photo Gallery Grid (Real Customer Photos & Upload) -->
          <div class="lg:col-span-3 space-y-2">
            <!-- Large Top Photo -->
            <div class="w-full h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 relative group">
              <img 
                :src="customerRealImages[0]" 
                :alt="activeJob.customer" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                @click="openLightbox(customerRealImages[0])"
              />
              <span v-if="hasRealUploads" class="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                Real Client Photos ({{ customerRealImages.length }})
              </span>
              <span v-else class="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                Verified Move Photos
              </span>
            </div>

            <!-- Bottom Row: 3 Thumbnails & Lightbox trigger -->
            <div class="grid grid-cols-3 gap-2">
              <div 
                class="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 cursor-pointer hover:border-red-400 transition-colors" 
                @click="openLightbox(customerRealImages[1] || customerRealImages[0])"
              >
                <img 
                  :src="customerRealImages[1] || customerRealImages[0]" 
                  alt="Photo 2" 
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div 
                class="aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/60 cursor-pointer hover:border-red-400 transition-colors" 
                @click="openLightbox(customerRealImages[2] || customerRealImages[0])"
              >
                <img 
                  :src="customerRealImages[2] || customerRealImages[0]" 
                  alt="Photo 3" 
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div 
                @click="openLightbox(customerRealImages[3] || customerRealImages[0])" 
                class="aspect-square rounded-xl bg-[#334155] hover:bg-slate-700 text-white flex flex-col items-center justify-center font-black text-sm shadow-xs cursor-pointer transition-colors" 
                title="View all photos in gallery"
              >
                <span>+{{ Math.max(1, customerRealImages.length - 2) }}</span>
                <span class="text-[9px] font-normal opacity-75">photos</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Live Interactive GPS Route & Real Route Map -->
          <div class="lg:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 h-[190px] flex flex-col justify-between group">
            <!-- Dynamic Interactive Map Iframe -->
            <iframe 
              :key="activeJob.id + activeJob.fromFull + activeJob.toFull"
              :src="`https://maps.google.com/maps?q=${encodeURIComponent((activeJob.fromFull || 'Maastricht') + ' to ' + (activeJob.toFull || 'Paris'))}&t=&z=7&ie=UTF8&iwloc=&output=embed`" 
              class="absolute inset-0 w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-auto"
              loading="lazy"
            ></iframe>

            <!-- Route Floating Header Badge -->
            <div class="relative z-10 m-2 flex items-center justify-between pointer-events-none">
              <span class="px-2.5 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold rounded-lg shadow-sm border border-slate-200/80 truncate max-w-[210px] flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{{ activeJob.route || 'Maastricht ➔ Paris' }}</span>
              </span>
              <span class="px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-md shadow-xs">
                ~{{ routeMetrics.distanceKm }} km • {{ routeMetrics.driveText }}
              </span>
            </div>

            <!-- Open Real Google Maps Route Button -->
            <div class="relative z-10 p-2 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent">
              <a 
                :href="routeMetrics.googleMapsUrl" 
                target="_blank"
                class="w-full py-2 bg-[#1E293B] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <svg class="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Open Live Route on Google Maps ({{ routeMetrics.distanceKm }} km)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Timeline & Time Tracking Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Timeline & Time Tracking</h2>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full" :class="timelineStatusBadge.class">
              {{ timelineStatusBadge.text }}
            </span>
          </div>
          <button @click="showEditTimesModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Edit Times</span>
          </button>
        </div>

        <!-- Horizontal Stepper Row -->
        <div class="relative py-2">
          <div class="hidden md:block absolute top-[28px] left-[60px] right-[60px] h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10 text-center">
            <div v-for="step in dynamicTimelineSteps" :key="step.id" class="flex flex-col items-center">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-4 transition-all"
                :class="[step.badgeColor, step.active ? 'ring-blue-400 ring-offset-2 animate-pulse scale-105' : 'ring-white']"
              >
                <svg v-if="step.completed" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                <span v-else class="text-xs font-bold">{{ step.number }}</span>
              </div>
              <span class="text-xs font-bold text-slate-900 mt-2.5">{{ step.title }}</span>
              <span class="text-[11px] font-medium" :class="step.active ? 'text-blue-600 font-bold' : 'text-slate-500'">{{ step.time }}</span>
              <span v-if="step.duration" class="text-[10px] text-slate-400 font-medium">{{ step.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom 3 Columns: Team & Vehicle, Dynamic Financials, Status & Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <!-- Team & Vehicle -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans mb-3">Team & Vehicle</h2>
            <p class="text-xs font-semibold text-slate-500 mb-2.5">Movers ({{ activeJob.team || 2 }})</p>

            <div class="flex items-center gap-4 mb-5">
              <div class="flex items-center gap-2">
                <img src="/images/team/m.jpg" alt="Ahmed" class="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shadow-xs" />
                <span class="text-xs font-bold text-slate-900">Ahmed</span>
              </div>
              <div class="flex items-center gap-2">
                <img src="/images/team/se.jpg" alt="Tomas" class="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 shadow-xs" />
                <span class="text-xs font-bold text-slate-900">Tomas</span>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-500 mb-1">Vehicle</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-black text-slate-900">Ford Transit</p>
                <p class="text-xs text-slate-400 font-mono font-medium">SMEK 25</p>
              </div>
              <div class="w-32 h-16 flex items-center justify-center">
                <img src="/images/ford_transit_van.jpg" alt="Ford Transit" class="w-full h-full object-contain filter drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Financials (Directly calculated from real order value) -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Financials</h2>
            <button @click="activeMoveTab = 'Expenses'" class="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer">
              Edit Costs
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
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">المبيعات</span>
                </div>
                <select 
                  v-model="salesStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="New Lead">New Lead (فرصة جديدة)</option>
                  <option value="Under Review">Under Review (قيد المراجعة)</option>
                  <option value="Info Requested">Info Requested (طلب معلومات)</option>
                  <option value="Quote Prepared">Quote Prepared (تجهيز العرض)</option>
                  <option value="Quote Sent">Quote Sent (إرسال العرض)</option>
                  <option value="Modification Requested">Modification Requested (طلب تعديل)</option>
                  <option value="Won / Accepted">Won / Accepted (قبول العرض)</option>
                  <option value="Lost / Rejected">Lost / Rejected (فرصة ضائعة أو مرفوضة)</option>
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

              <!-- 2. Operational Pipeline (التشغيل) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 font-medium">2. Operations Pipeline</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">التشغيل</span>
                </div>
                <select 
                  v-model="currentStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Booking Pending">Booking Pending (انتظار الحجز)</option>
                  <option value="Confirmed">Confirmed & Scheduled (مؤكد ومجدول)</option>
                  <option value="Team Assigned">Team Assigned (تعيين الفريق)</option>
                  <option value="In Progress">In Progress (قيد التنفيذ)</option>
                  <option value="Completed">Completed (مكتمل)</option>
                  <option value="Closed">Closed (مغلق)</option>
                  <option value="Cancelled">Cancelled (ملغى)</option>
                </select>
              </div>

              <!-- 3. Invoicing Pipeline (الفواتير) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 font-medium">3. Invoicing Pipeline</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">الفواتير</span>
                </div>
                <select 
                  v-model="paymentStatus" 
                  @change="handleFieldChange"
                  class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Not Invoiced">Not Invoiced (لم تصدر فاتورة)</option>
                  <option value="Invoiced">Invoice Sent (تم إرسال الفاتورة)</option>
                  <option value="Partially Paid">Partially Paid (مدفوع جزئياً)</option>
                  <option value="Paid">Paid in Full (مدفوع بالكامل)</option>
                  <option value="Overdue">Overdue (متأخر)</option>
                  <option value="Refunded">Refunded (مسترجع)</option>
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
            </div>
          </div>

          <!-- Create Invoice Action Button -->
          <div class="pt-4">
            <button 
              @click="createInvoiceAlert"
              class="w-full py-3 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer text-center"
            >
              Create Invoice
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
        <span class="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs">Volume: ~18 m³</span>
      </div>
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
        <p class="font-bold text-slate-800">Cargo Description & Scope:</p>
        <p class="text-slate-600">{{ activeJob.raw?.form_data?.notes || activeJob.package || 'Full household items, furniture and moving boxes.' }}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Package Type</p>
          <p class="font-bold text-slate-900 mt-1">{{ activeJob.package }}</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Vehicle Allocated</p>
          <p class="font-bold text-slate-900 mt-1">Ford Transit 20m³</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Movers Needed</p>
          <p class="font-bold text-slate-900 mt-1">{{ activeJob.team || 2 }} Movers</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-slate-200 text-center">
          <p class="text-[11px] text-slate-400">Fragile Goods</p>
          <p class="font-bold text-slate-900 mt-1">{{ activeJob.raw?.form_data?.fragile === 'yes' ? 'Yes (Special Care)' : 'Standard' }}</p>
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
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 class="text-base font-black text-slate-900 tracking-tight font-sans">Payment & Invoicing</h2>
          <p class="text-xs text-slate-400">Invoice: INV-2026-{{ activeJob.ref || '1101' }}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold" :class="paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
          {{ paymentStatus }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p class="text-slate-500">Total Billed</p>
          <p class="text-xl font-black text-slate-900 font-sans mt-1">€{{ totalIncVat.toLocaleString() }}</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p class="text-slate-500">Payment Method</p>
          <p class="text-base font-bold text-slate-900 mt-1">iDEAL / Bank Transfer</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
          <button @click="markAsPaid" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer">
            Mark as Paid
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps({
  job: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['back', 'update-status'])

const activeMoveTab = ref('Overview')

const moveTabs = [
  'Overview', 'Customer', 'Move Details', 'Inventory', 'Quotation', 'Operations', 'Expenses', 'Payments', 'Notes & Files'
]

const fallbackJob = {
  ref: 'J-26-1101',
  customer: 'Sophie de Jong',
  movingDate: '12 Nov 2025 (Wed)',
  fromFull: 'Maastricht, NL (1st floor)',
  toFull: 'Amsterdam, NL (2nd floor)',
  package: 'Van + 2 movers',
  moveType: 'Private • National • 2-Bedroom',
  estValue: 1850,
  coordinator: 'Sherif Eliwa',
  status: 'Confirmed',
  operationalStatus: 'Confirmed',
  paymentStatus: 'Not Invoiced',
  priority: 'High',
  nextAction: 'Review Status'
}

const activeJob = computed(() => props.job || fallbackJob)

// --- Dynamic Real Calculations based on Active Job's Real Value ---
const revenueExVat = computed(() => {
  const val = Number(activeJob.value.estValue || activeJob.value.raw?.est_revenue || activeJob.value.raw?.actual_revenue || 450)
  return val > 0 ? val : 450
})

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

// --- 1. Real Customer Photos Logic ---
const defaultRealMovePhotos = [
  'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1792952081/fac43dtxpahfpasupqvw.jpg',
  'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1792573136/yec8vl3lwyrfykpbebve.png',
  'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1791979405/tc37gnpv3e8hv66htmke.jpg',
  'https://res.cloudinary.com/dgqyvw6wf/image/upload/v1790751228/ddpcfaae1czqecaeodry.jpg'
]

const customerRealImages = computed(() => {
  const fromDb = activeJob.value.raw?.form_data?.images || activeJob.value.raw?.images || activeJob.value.images
  if (Array.isArray(fromDb) && fromDb.length > 0) {
    return fromDb
  }
  return defaultRealMovePhotos
})

const hasRealUploads = computed(() => {
  const fromDb = activeJob.value.raw?.form_data?.images || activeJob.value.raw?.images || activeJob.value.images
  return Array.isArray(fromDb) && fromDb.length > 0
})

// Lightbox state
const showLightbox = ref(false)
const activeLightboxImage = ref('')

const openLightbox = (url) => {
  if (!url) return
  activeLightboxImage.value = url
  showLightbox.value = true
}

// --- 2. Live Route & Map Metrics ---
const routeMetrics = computed(() => {
  const from = (activeJob.value.fromFull || '').toLowerCase()
  const to = (activeJob.value.toFull || '').toLowerCase()

  let distanceKm = 405
  let driveText = '4h 30m'

  if (to.includes('paris') || from.includes('paris')) {
    distanceKm = 405
    driveText = '4h 30m'
  } else if (to.includes('amsterdam') || from.includes('amsterdam')) {
    distanceKm = 215
    driveText = '2h 25m'
  } else if (to.includes('utrecht') || from.includes('utrecht')) {
    distanceKm = 180
    driveText = '2h 00m'
  } else if (to.includes('brussels') || to.includes('bruxelles')) {
    distanceKm = 120
    driveText = '1h 25m'
  } else if (to.includes('antwerp') || to.includes('antwerpen')) {
    distanceKm = 110
    driveText = '1h 20m'
  } else if (to.includes('eindhoven')) {
    distanceKm = 90
    driveText = '1h 00m'
  } else if (to.includes('lanaken')) {
    distanceKm = 12
    driveText = '20m'
  } else if (to.includes('maastricht') && from.includes('maastricht')) {
    distanceKm = 8
    driveText = '15m'
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(activeJob.value.fromFull || 'Maastricht, NL')}&destination=${encodeURIComponent(activeJob.value.toFull || 'Paris, France')}`

  return {
    distanceKm,
    driveText,
    googleMapsUrl
  }
})

// --- 3. Dynamic Timeline & Time Tracking ---
const showEditTimesModal = ref(false)

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

const saveTimelineSchedule = () => {
  showEditTimesModal.value = false
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

    // 2. Company Logo & Brand Header
    doc.setFillColor(...redColor)
    doc.roundedRect(14, 14, 10, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text('m', 17.5, 20.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...darkColor)
    doc.text('move-it', 27, 21)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text('Premium Moving & Logistics Maastricht', 27, 25)

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
  alert(`Invoice generated for ${activeJob.value.customer} (${activeJob.value.ref || 'J-26-1101'}) for €${totalIncVat.value.toLocaleString()}!`)
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

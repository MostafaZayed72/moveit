<template>
  <div class="pt-32">
    <BaseSection :title="$t('contact.title')" :subtitle="$t('contact.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div class="glass-panel p-10 rounded-3xl" data-aos="fade-right">

          <!-- Success Message -->
          <div v-if="submitted" class="text-center py-12 space-y-4">
            <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $t('contact.success_title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              We've received your moving request! Our team will review your details and get in touch shortly.
            </p>
            <div v-if="false && estimatedInstantPrice > 0" class="inline-block px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Estimated Instant Quote</div>
              <div class="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">€{{ estimatedInstantPrice.toLocaleString() }} <span class="text-xs font-semibold">excl. VAT</span></div>
              <div v-if="totalInventoryItems > 0" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Based on {{ totalInventoryItems }} items ({{ totalInventoryVolume.toFixed(1) }} m³)
              </div>
            </div>
            <div v-else-if="totalInventoryItems > 0" class="inline-block px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Inventory Submitted: {{ totalInventoryItems }} items ({{ totalInventoryVolume.toFixed(1) }} m³)
            </div>
            <div>
              <button @click="submitted = false" class="mt-4 btn-primary px-8 py-3">
                {{ $t('contact.send_another') }}
              </button>
            </div>
          </div>

          <form v-else @submit.prevent="nextStep" class="space-y-6">
            <!-- Stepper Header (Progress Bar) -->
            <div class="mb-8 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <div class="flex justify-between mb-3">
                <span class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300"
                      :class="currentStep === 1 ? 'text-red-600' : currentStep > 1 ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                  {{ $t('contact.step_move_details') }}
                </span>
                <span class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300"
                      :class="currentStep === 2 ? 'text-red-600' : currentStep > 2 ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                  {{ $t('contact.step_access') }}
                </span>
                <span class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300"
                      :class="currentStep === 3 ? 'text-red-600' : currentStep > 3 ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                  {{ $t('contact.step_services') }}
                </span>
                <span class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300"
                      :class="currentStep === 4 ? 'text-red-600' : currentStep > 4 ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'">
                  {{ $t('contact.step_contact') }}
                </span>
                <span v-if="currentStep >= 5" class="text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 text-red-600">
                  Verification
                </span>
              </div>
              <div class="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
                     :style="{ width: `${(currentStep / (currentStep >= 5 ? 5 : 4)) * 100}%` }">
                </div>
              </div>
            </div>

            <!-- STEP 1: Move Details -->
            <div v-show="currentStep === 1" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ $t('contact.step_heading_1') }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('contact.step_sub_1') }}</p>
              </div>

              <!-- Moving Package Selection -->
              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.moving_package') }}</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label v-for="pkg in movingPackages" :key="pkg.value"
                         class="flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 group"
                         :class="movingPackage === pkg.value ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="movingPackage" :value="pkg.value" class="sr-only" />
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-bold" :class="movingPackage === pkg.value ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'">{{ pkg.label }}</span>
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                            :class="movingPackage === pkg.value ? 'bg-red-100 text-red-600 dark:bg-red-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">{{ pkg.price }}</span>
                    </div>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{{ pkg.desc }}</span>
                  </label>
                </div>
              </div>

              <!-- Type of Move & Storage / In-Person Quote -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
                <div class="space-y-2 min-w-0">
                  <label class="form-label" for="move_type">Type of Move</label>
                  <select id="move_type" v-model="moveType" class="form-input cursor-pointer" required>
                    <option value="" disabled>Choose an option</option>
                    <option value="Residential">Residential</option>
                    <option value="Office / Commercial">Office / Commercial</option>
                    <option value="Special Event">Special Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div class="space-y-2 min-w-0">
                  <label class="form-label">Do you require MoveIt storage services?</label>
                  <div class="grid grid-cols-2 gap-3 h-[58px]">
                    <label class="flex items-center justify-center gap-2 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                           :class="storageRequired === 'yes' ? 'border-red-500 bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'">
                      <input type="radio" v-model="storageRequired" value="yes" class="sr-only" />
                      <span class="text-sm">Yes</span>
                    </label>
                    <label class="flex items-center justify-center gap-2 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                           :class="storageRequired === 'no' ? 'border-red-500 bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'">
                      <input type="radio" v-model="storageRequired" value="no" class="sr-only" />
                      <span class="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
                <div class="space-y-2 min-w-0 relative">
                  <label class="form-label" for="moving_size">{{ $t('contact.what_are_you_moving') }}</label>
                  <div class="relative w-full">
                    <button 
                      type="button"
                      @click="isSizeDropdownOpen = !isSizeDropdownOpen"
                      @blur="closeSizeDropdown"
                      class="form-input text-left flex justify-between items-center cursor-pointer w-full text-sm h-[58px]"
                    >
                      <span :class="{'text-slate-400 dark:text-slate-500': !moveSize, 'text-slate-900 dark:text-white': moveSize}" class="truncate block">
                        {{ moveSize ? (sizeOptions.find(o => o.value === moveSize)?.fallback || $t(sizeOptions.find(o => o.value === moveSize).key)) : $t('contact.select_size') }}
                      </span>
                      <svg class="h-4 w-4 transition-transform duration-200 shrink-0 text-slate-400" :class="{'rotate-180': isSizeDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    
                    <transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <div 
                        v-if="isSizeDropdownOpen" 
                        class="absolute z-50 w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2"
                      >
                        <div 
                          v-for="option in sizeOptions" 
                          :key="option.value"
                          @mousedown.prevent="selectSizeOption(option.value)"
                          class="px-5 py-3 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer transition-colors flex items-center justify-between group text-sm"
                          :class="{'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold': moveSize === option.value, 'text-slate-700 dark:text-slate-300': moveSize !== option.value}"
                        >
                          <span class="flex-1">{{ option.fallback || $t(option.key) }}</span>
                        </div>
                      </div>
                    </transition>
                  </div>
                  <input
                    v-if="moveSize === 'other'"
                    v-model="customMoveSize"
                    type="text"
                    placeholder="Please specify size (e.g. 4-Bedroom Villa, 120m² Office)..."
                    class="form-input mt-2 text-sm"
                  />
                </div>
                <div class="space-y-2 min-w-0 relative">
                  <label class="form-label">{{ $t('contact.preferred_time') }}</label>
                  <div class="relative w-full">
                    <button 
                      type="button"
                      @click="isTimeDropdownOpen = !isTimeDropdownOpen"
                      @blur="closeTimeDropdown"
                      class="form-input text-left flex justify-between items-center cursor-pointer w-full text-sm h-[58px]"
                    >
                      <span :class="{'text-slate-400 dark:text-slate-500': !preferredTime, 'text-slate-900 dark:text-white': preferredTime}" class="truncate block">
                        {{ preferredTime ? $t(timeOptions.find(o => o.value === preferredTime).key) : $t('contact.choose_time_option') }}
                      </span>
                      <svg class="h-4 w-4 transition-transform duration-200 shrink-0 text-slate-400" :class="{'rotate-180': isTimeDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    
                    <transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <div 
                        v-if="isTimeDropdownOpen" 
                        class="absolute z-50 w-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2"
                      >
                        <div 
                          v-for="option in timeOptions" 
                          :key="option.value"
                          @mousedown.prevent="selectTimeOption(option.value)"
                          class="px-5 py-3 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer transition-colors flex items-center justify-between group text-sm"
                          :class="{'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold': preferredTime === option.value, 'text-slate-700 dark:text-slate-300': preferredTime !== option.value}"
                        >
                          <span class="flex-1">{{ $t(option.key) }}</span>
                          <!-- If it's the last option (evening), show the info icon with a tooltip -->
                          <div v-if="option.value === 'evening'" class="relative flex items-center group/tooltip ml-2" @mousedown.stop>
                            <svg class="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <!-- Tooltip container -->
                            <div class="absolute right-0 bottom-full mb-2 w-48 p-2.5 bg-slate-950 text-white text-[11px] rounded-lg shadow-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 z-[100] text-center font-normal leading-normal whitespace-normal">
                              {{ $t('contact.late_shifts_note') }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
                <div class="space-y-2 min-w-0">
                  <label class="form-label">{{ $t('contact.preferred_date') }}</label>
                  <input type="date" v-model="moveDate" class="form-input cursor-pointer w-full min-w-0 max-w-full box-border" :min="todayDate" required @click="$event.target.showPicker && $event.target.showPicker()" />
                </div>
                <div class="space-y-2 min-w-0">
                  <label class="form-label">{{ $t('contact.alternative_date') }}</label>
                  <input type="date" v-model="alternativeDate" class="form-input cursor-pointer w-full min-w-0 max-w-full box-border" :min="todayDate" @click="$event.target.showPicker && $event.target.showPicker()" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_moving_from') }}</label>
                <AddressAutocomplete v-model="movingFrom" input-class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
              </div>

              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_moving_to') }}</label>
                <AddressAutocomplete v-model="movingTo" input-class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
              </div>

              <!-- Transitional Stops -->
              <div class="space-y-3">
                <div v-for="(stop, sIdx) in transitionalStops" :key="sIdx" class="flex items-center gap-2">
                  <div class="flex-1">
                    <label class="form-label text-[11px]">Transitional Stop #{{ sIdx + 1 }}</label>
                    <input
                      v-model="transitionalStops[sIdx]"
                      type="text"
                      placeholder="Enter intermediate pickup or drop-off address..."
                      class="form-input text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    @click="removeTransitionalStop(sIdx)"
                    class="mt-6 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-300 text-xs font-bold cursor-pointer"
                    title="Remove stop"
                  >
                    ✕
                  </button>
                </div>

                <button
                  type="button"
                  @click="addTransitionalStop"
                  class="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer py-1"
                >
                  <span class="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-sm leading-none">+</span>
                  <span>Add transitional stops if it's necessary</span>
                </button>
              </div>

              <!-- Free In-Person / Video Survey Quote -->
              <div class="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div>
                  <label class="form-label mb-0">Are you interested in a free in-person quote?</label>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">We will come to your home/office or review a video and price your quote in person.</p>
                </div>
                <div class="grid grid-cols-2 gap-3 max-w-xs">
                  <label class="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer bg-white dark:bg-slate-900"
                         :class="inPersonQuote === 'yes' ? 'border-red-500 bg-red-500/5 text-red-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'">
                    <input type="radio" v-model="inPersonQuote" value="yes" class="sr-only" />
                    <span class="text-xs">Yes</span>
                  </label>
                  <label class="flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer bg-white dark:bg-slate-900"
                         :class="inPersonQuote === 'no' ? 'border-red-500 bg-red-500/5 text-red-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'">
                    <input type="radio" v-model="inPersonQuote" value="no" class="sr-only" />
                    <span class="text-xs">No</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- STEP 2: Property Access -->
            <div v-show="currentStep === 2" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ $t('contact.step_heading_2') }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('contact.step_sub_2') }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.pickup_floor') }}</label>
                  <select v-model="pickupFloor" class="form-input cursor-pointer" required>
                    <option value="" disabled>{{ $t('contact.select_floor') }}</option>
                    <option>Ground Floor</option>
                    <option>1st Floor</option>
                    <option>2nd Floor</option>
                    <option>3rd Floor</option>
                    <option>4th Floor</option>
                    <option>5th Floor or higher</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.delivery_floor') }}</label>
                  <select v-model="deliveryFloor" class="form-input cursor-pointer" required>
                    <option value="" disabled>{{ $t('contact.select_floor') }}</option>
                    <option>Ground Floor</option>
                    <option>1st Floor</option>
                    <option>2nd Floor</option>
                    <option>3rd Floor</option>
                    <option>4th Floor</option>
                    <option>5th Floor or higher</option>
                  </select>
                </div>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.elevator_available') }}</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="elevatorAvailable === 'both' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="elevatorAvailable" value="both" class="accent-red-600 h-4 w-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('contact.elevator_both', 'Yes — at both locations') }}</span>
                  </label>
                  <label class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="elevatorAvailable === 'pickup' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="elevatorAvailable" value="pickup" class="accent-red-600 h-4 w-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('contact.elevator_pickup', 'Yes — pickup only') }}</span>
                  </label>
                  <label class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="elevatorAvailable === 'delivery' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="elevatorAvailable" value="delivery" class="accent-red-600 h-4 w-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('contact.elevator_delivery', 'Yes — delivery only') }}</span>
                  </label>
                  <label class="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="elevatorAvailable === 'none' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="elevatorAvailable" value="none" class="accent-red-600 h-4 w-4" />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('contact.elevator_none', 'No elevator') }}</span>
                  </label>
                </div>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.moving_lift') }}</label>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="movingLiftNeeded === 'yes' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="movingLiftNeeded" value="yes" class="sr-only" />
                    <span class="text-sm font-bold" :class="movingLiftNeeded === 'yes' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.yes') }}</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="movingLiftNeeded === 'no' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="movingLiftNeeded" value="no" class="sr-only" />
                    <span class="text-sm font-bold" :class="movingLiftNeeded === 'no' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.no') }}</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="movingLiftNeeded === 'unsure' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="movingLiftNeeded" value="unsure" class="sr-only" />
                    <span class="text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap" :class="movingLiftNeeded === 'unsure' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.unsure') }}</span>
                  </label>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 italic mt-2">{{ $t('contact.lift_hint') }}</p>
              </div>
            </div>

            <!-- STEP 3: Additional Services -->
            <div v-show="currentStep === 3" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ $t('contact.step_heading_3') }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('contact.step_sub_3') }}</p>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.packing_needed') }}</label>
                <div class="flex gap-4">
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="packingService === 'yes' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="packingService" value="yes" class="sr-only" />
                    <span>{{ $t('contact.yes_pack') }}</span>
                  </label>
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="packingService === 'no' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="packingService" value="no" class="sr-only" />
                    <span>{{ $t('contact.no_pack') }}</span>
                  </label>
                </div>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.furniture_assembly') }}</label>
                <div class="flex gap-4">
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="furnitureAssembly === 'yes' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="furnitureAssembly" value="yes" class="sr-only" />
                    <span>{{ $t('contact.yes_please') }}</span>
                  </label>
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="furnitureAssembly === 'no' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="furnitureAssembly" value="no" class="sr-only" />
                    <span>{{ $t('contact.no_thanks') }}</span>
                  </label>
                </div>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.fragile_special') }}</label>
                <div class="flex gap-4">
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="fragileItems === 'yes' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="fragileItems" value="yes" class="sr-only" />
                    <span>{{ $t('contact.yes') }}</span>
                  </label>
                  <label class="flex-1 text-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30"
                         :class="fragileItems === 'no' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5 text-red-600 font-bold' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'">
                    <input type="radio" v-model="fragileItems" value="no" class="sr-only" />
                    <span>{{ $t('contact.no') }}</span>
                  </label>
                </div>
                <div v-show="fragileItems === 'yes'" class="transition-all duration-300 ease-out mt-3">
                  <textarea :placeholder="$t('contact.special_placeholder')"
                            v-model="specialItemsDescription"
                            class="form-input resize-none h-24"
                            :required="fragileItems === 'yes'"></textarea>
                </div>
              </div>

              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.anything_else') }}</label>
                <textarea :placeholder="$t('contact.notes_placeholder')"
                          v-model="notes"
                          class="form-input resize-none h-24"></textarea>
              </div>
            </div>

            <!-- STEP 4: Contact Info -->
            <div v-show="currentStep === 4" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">{{ $t('contact.step_heading_4') }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ $t('contact.step_sub_4') }}</p>
              </div>

              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_name') }}</label>
                <input type="text" v-model="fullName" class="form-input" required :placeholder="$t('contact.form_name')" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.form_email') }}</label>
                  <input type="email" v-model="email" class="form-input" required :placeholder="$t('contact.placeholder_email')" />
                </div>
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.form_phone') }}</label>
                  <input type="tel" v-model="phone" class="form-input" required :placeholder="$t('contact.placeholder_phone')" />
                </div>
              </div>

              <div class="space-y-3">
                <label class="form-label">{{ $t('contact.how_contact') }}</label>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="contactPreference === 'whatsapp' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="contactPreference" value="whatsapp" class="sr-only" />
                    <span class="text-xs font-bold" :class="contactPreference === 'whatsapp' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.whatsapp') }}</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="contactPreference === 'email' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="contactPreference" value="email" class="sr-only" />
                    <span class="text-xs font-bold" :class="contactPreference === 'email' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.email') }}</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center"
                         :class="contactPreference === 'call' ? 'border-red-500 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <input type="radio" v-model="contactPreference" value="call" class="sr-only" />
                    <span class="text-xs font-bold text-ellipsis overflow-hidden whitespace-nowrap" :class="contactPreference === 'call' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'">{{ $t('contact.phone_call') }}</span>
                  </label>
                </div>
              </div>

              <div class="space-y-2">
                <label class="form-label" for="hear_about">{{ $t('contact.form_hear') }}</label>
                <select id="hear_about" v-model="hearAbout" class="form-input cursor-pointer" required>
                  <option value="" disabled>{{ $t('contact.choose_option', 'Choose an option') }}</option>
                  <option value="referral">{{ $t('contact.hear_referral') }}</option>
                  <option value="returning">{{ $t('contact.hear_returning') }}</option>
                  <option value="social">{{ $t('contact.hear_social') }}</option>
                  <option value="google">{{ $t('contact.hear_google') }}</option>
                  <option value="real_estate">{{ $t('contact.hear_real_estate') }}</option>
                  <option value="student_center">{{ $t('contact.hear_student_center') }}</option>
                  <option value="other">{{ $t('contact.hear_other') }}</option>
                </select>
              </div>

              <!-- Media Upload -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <label class="form-label mb-0">{{ $t('contact.media_upload_label') }}</label>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 italic -mt-1">{{ $t('contact.media_upload_hint') }}</p>

                <div class="relative">
                  <input
                    ref="mediaInput"
                    type="file"
                    id="media_upload"
                    multiple
                    accept="image/*,video/*"
                    @change="handleMediaChange"
                    class="sr-only"
                  />
                  <label for="media_upload"
                         class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer"
                         :class="mediaFiles.length > 0 ? 'border-red-400 bg-red-500/5 dark:bg-red-500/5' : 'border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-500 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-red-500/5 dark:hover:bg-red-500/5'"
                         @dragover.prevent
                         @drop.prevent="handleMediaDrop">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                         :class="mediaFiles.length > 0 ? 'bg-red-100 dark:bg-red-500/20' : 'bg-slate-100 dark:bg-slate-800'">
                      <svg class="w-5 h-5" :class="mediaFiles.length > 0 ? 'text-red-500' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="text-center">
                      <p class="text-sm font-bold" :class="mediaFiles.length > 0 ? 'text-red-600' : 'text-slate-600 dark:text-slate-300'">
                        {{ mediaFiles.length > 0 ? $t('contact.media_add_more') : $t('contact.media_upload_cta') }}
                      </p>
                      <p class="text-[11px] text-slate-400 mt-0.5">{{ $t('contact.media_upload_types') }}</p>
                    </div>
                  </label>
                </div>

                <!-- File Preview List -->
                <div v-if="mediaFiles.length > 0" class="space-y-2">
                  <div v-for="(file, idx) in mediaFiles" :key="idx"
                       class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <!-- Thumbnail -->
                    <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <img v-if="file.preview && file.type.startsWith('image/')" :src="file.preview" class="w-full h-full object-cover" alt="" />
                      <svg v-else class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{{ file.name }}</p>
                      <p class="text-[10px] text-slate-400">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <button type="button" @click="removeMedia(idx)"
                            class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Instant Pricing vs Direct Callback Choice -->
              <div v-if="currentStep === 4" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <p class="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                  You have the option to provide us with the list of your items &amp; rooms for an instant estimated price, or submit now and we will get in touch.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="openInventoryBuilder"
                    class="w-full py-3.5 px-4 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>📦</span>
                    <span>Add items for instant pricing</span>
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-3.5 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 border-2 border-red-600 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{{ loading ? 'Sending...' : 'Submit now & we will get in touch' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- STEP 5: OTP Verification -->
            <div v-show="currentStep === 5" class="space-y-6">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">We've sent a 6-digit verification code to <strong>{{ email }}</strong></p>
              </div>

              <div class="space-y-4 max-w-xs mx-auto">
                <div class="space-y-2">
                  <label class="form-label text-center">Enter Verification Code</label>
                  <input type="text" v-model="otpCode" class="form-input text-center text-2xl tracking-[0.5em] font-mono" :required="currentStep === 5" placeholder="------" maxlength="6" />
                </div>
                <div class="text-center mt-4">
                  <button type="button" @click="resendOtp" class="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors" :disabled="isResending">
                    <span v-if="!isResending">{{ $t('contact.resend_otp', "Didn't receive the code? Resend") }}</span>
                    <span v-else class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ $t('contact.sending', 'Sending...') }}
                    </span>
                  </button>
                  <p v-if="resendSuccessMessage" class="text-xs text-emerald-500 mt-2 font-bold animate-pulse">{{ resendSuccessMessage }}</p>
                </div>
              </div>
            
            <!-- Validation Error message -->
            <div v-if="validationError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-pulse mt-4">
              <svg class="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-bold text-red-600 dark:text-red-400">{{ validationError }}</span>
            </div></div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-8 gap-4">
              <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {{ currentStep >= 5 ? 'Step 5 of 5' : ($t('contact.step_counter', { current: currentStep, total: 4 }) !== 'contact.step_counter' ? $t('contact.step_counter', { current: currentStep, total: 4 }) : `Step ${currentStep} of 4`) }}
              </span>
              <div class="flex gap-3">
                <button v-if="currentStep > 1 && currentStep < 5" type="button" @click="prevStep" class="btn px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold transition-all bg-white dark:bg-slate-900">
                  {{ $t('contact.back') }}
                </button>
                <button v-if="currentStep < 4" type="button" @click="nextStep" class="btn bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20">
                  {{ $t('contact.continue') }}
                </button>
                <button v-else-if="currentStep === 4" type="submit" class="btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2" :disabled="loading">
                  <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading ? 'Sending...' : 'Verify Email' }}</span>
                </button>
                <button v-else-if="currentStep === 5" type="button" @click="verifyOtpAndSubmit" class="btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2" :disabled="loading">
                  <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading ? $t('contact.sending') : 'Submit Order' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-12" data-aos="fade-left">
          <div>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">{{ $t('contact.direct_info') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {{ $t('contact.direct_desc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="i in 2" :key="i" class="premium-card !p-8">
              <div class="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white mb-6">
                <svg v-if="i === 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div class="text-slate-900 dark:text-white font-bold mb-1">{{ i === 1 ? $t('contact.phone') : $t('contact.email') }}</div>
              <div class="text-slate-600 dark:text-slate-400 text-sm">{{ i === 1 ? '+31 6 34837587' : 'info@moveitmaastricht.nl' }}</div>
            </div>
          </div>

          <div class="glass-panel p-8 rounded-3xl border-l-4 border-emerald-500">
            <div class="flex items-center space-x-4 mb-4 text-emerald-500">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="font-bold uppercase tracking-widest text-xs">{{ $t('contact.response_time_title') }}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">{{ $t('contact.response_time_desc_pre') }}<span class="text-slate-900 dark:text-white font-bold">{{ $t('contact.response_time_hours') }}</span>{{ $t('contact.response_time_desc_post') }}</p>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- INTERACTIVE ROOM & ITEM INVENTORY BUILDER MODAL (Mobile-First Responsive Flow) -->
    <div
      v-if="showInventoryBuilder"
      class="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
    >
      <div class="bg-white dark:bg-slate-950 rounded-t-3xl sm:rounded-3xl max-w-6xl w-full h-[94vh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <!-- Top Header -->
        <div class="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/80 shrink-0">
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">Your Rooms &amp; Items</h3>
            <p class="text-[11px] sm:text-xs text-slate-500">Select a room, add your furniture &amp; boxes, and see live volume &amp; pricing.</p>
          </div>
          <button @click="showInventoryBuilder = false" class="w-9 h-9 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 font-bold cursor-pointer shrink-0">
            ✕
          </button>
        </div>

        <!-- Scrollable Body: Single Vertical Flow on Mobile, 3-Column Grid on Desktop (lg+) -->
        <div class="flex-1 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          <!-- Left: Rooms Selector (Vertical List on Desktop, Clean Horizontal/Grid Pills on Mobile) -->
          <div class="lg:col-span-3 p-3.5 sm:p-4 bg-slate-50/50 dark:bg-slate-900/30 lg:overflow-y-auto lg:max-h-[75vh]">
            <div class="flex items-center justify-between px-1 mb-2.5">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Your Rooms ({{ inventoryRooms.length }})</span>
              <span class="text-[11px] font-bold text-[#DC2626] lg:hidden">Items added: {{ totalInventoryItems }}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 sm:gap-2">
              <button
                v-for="room in inventoryRooms"
                :key="room.id"
                type="button"
                @click="activeInventoryRoom = room.id; inventoryFilterTab = 'all'"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                :class="activeInventoryRoom === room.id ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-white dark:bg-slate-900 lg:bg-transparent border border-slate-200/80 dark:border-slate-800 lg:border-0 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
              >
                <span class="flex items-center gap-2 truncate">
                  <span>{{ room.icon }}</span>
                  <span class="truncate">{{ room.label }}</span>
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-black shrink-0"
                  :class="activeInventoryRoom === room.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'"
                >
                  {{ getRoomItemCount(room.id) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Center: Searchable Items Grid with Technical SVG Drawings -->
          <div class="lg:col-span-6 p-4 sm:p-5 space-y-4 lg:overflow-y-auto lg:max-h-[75vh]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div class="relative flex-1 min-w-0">
                <input
                  v-model="inventorySearch"
                  type="text"
                  placeholder="Search for furniture or boxes (e.g. bed, sofa, box)..."
                  class="w-full pl-3.5 pr-8 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:outline-none text-slate-900 dark:text-white"
                />
                <button v-if="inventorySearch" @click="inventorySearch = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">✕</button>
              </div>
              <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold self-start sm:self-auto">
                <button
                  type="button"
                  @click="inventoryFilterTab = 'all'"
                  class="px-3 py-1.5 rounded-lg cursor-pointer"
                  :class="inventoryFilterTab === 'all' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
                >
                  All Items
                </button>
                <button
                  type="button"
                  @click="inventoryFilterTab = 'added'"
                  class="px-3 py-1.5 rounded-lg cursor-pointer"
                  :class="inventoryFilterTab === 'added' ? 'bg-white dark:bg-slate-950 text-red-600 shadow-xs' : 'text-slate-500'"
                >
                  Your Added Items ({{ totalInventoryItems }})
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <div
                v-for="item in filteredInventoryCatalog"
                :key="item.id"
                class="p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5"
                :class="(inventoryQuantities[item.id] || 0) > 0 ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 shadow-xs' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'"
              >
                <div class="flex flex-col items-center text-center gap-1.5">
                  <div class="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center">
                    <FurnitureSvgIcon :type="item.svgType" />
                  </div>
                  <p class="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{{ item.name }}</p>
                  <p class="text-[10px] text-slate-400">
                    {{ getEffectiveItemVolume(item).toFixed(2) }} m³
                    <span v-if="item.disassemblable && disassembledItems[item.id]" class="text-emerald-600 font-bold">(Disassembled)</span>
                  </p>
                </div>

                <div class="space-y-2">
                  <!-- Disassembly option for bulky beds, wardrobes, tables, desks -->
                  <button
                    v-if="item.disassemblable && (inventoryQuantities[item.id] || 0) > 0"
                    type="button"
                    @click="toggleDisassembled(item.id)"
                    class="w-full py-1 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
                    :class="disassembledItems[item.id] ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'"
                  >
                    {{ disassembledItems[item.id] ? '✓ Disassembled (-30% space)' : 'Assembled (Tap to disassemble)' }}
                  </button>

                  <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      @click="decrementItem(item.id)"
                      class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span class="text-xs font-black text-slate-900 dark:text-white">{{ inventoryQuantities[item.id] || 0 }}</span>
                    <button
                      type="button"
                      @click="incrementItem(item.id)"
                      class="w-7 h-7 rounded-lg bg-slate-900 text-white font-black hover:bg-[#DC2626] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Live Move & Inventory Summary -->
          <div class="lg:col-span-3 p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
            <div class="space-y-4">
              <div>
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Your Move</div>
                <p class="text-xs font-bold text-slate-900 dark:text-white mt-1">{{ moveDate || 'Date TBD' }} · {{ moveType || 'Residential' }}</p>
                <p class="text-[11px] text-slate-500 mt-1 truncate">From: {{ movingFrom || 'Pickup TBD' }}</p>
                <p class="text-[11px] text-slate-500 truncate">To: {{ movingTo || 'Drop-off TBD' }}</p>
              </div>

              <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Inventory Summary</div>
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div class="text-base font-black text-slate-900 dark:text-white">{{ totalInventoryItems }}</div>
                    <div class="text-[10px] text-slate-500">Items</div>
                  </div>
                  <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div class="text-base font-black text-slate-900 dark:text-white">{{ activeRoomsCount }}</div>
                    <div class="text-[10px] text-slate-500">Rooms</div>
                  </div>
                  <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div class="text-base font-black text-slate-900 dark:text-white">{{ totalInventoryVolume.toFixed(1) }}</div>
                    <div class="text-[10px] text-slate-500">m³</div>
                  </div>
                </div>
                <div v-if="false" class="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div class="flex justify-between">
                    <span>Package &amp; Services</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">€{{ baseMoveCharge.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Volume ({{ totalInventoryVolume.toFixed(1) }} m³ × €38)</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">+ €{{ volumeMoveCharge.toLocaleString() }}</span>
                  </div>
                </div>
                <div v-if="false" class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Instant Estimate</span>
                  <span class="text-lg font-black text-[#DC2626]">€{{ estimatedInstantPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="hidden lg:block space-y-2 pt-3">
              <button
                type="button"
                @click="handleSeeQuoteClick"
                class="w-full py-3.5 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/25 cursor-pointer"
              >
                Submit Inventory &amp; Request Quote →
              </button>
              <button
                type="button"
                @click="showInventoryBuilder = false"
                class="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Back to Form
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky Mobile Bottom Action Bar -->
        <div class="lg:hidden px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div class="text-xs text-slate-700 dark:text-slate-200 font-bold">{{ totalInventoryItems }} items · {{ totalInventoryVolume.toFixed(1) }} m³</div>
            <div class="text-[10px] text-slate-400">Custom quote sent after review</div>
          </div>
          <button
            type="button"
            @click="handleSeeQuoteClick"
            class="px-5 py-3 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/25 cursor-pointer"
          >
            Submit &amp; Request Quote →
          </button>
        </div>
      </div>
    </div>

    <!-- BOXES REMINDER MODAL -->
    <div
      v-if="showBoxesReminderModal"
      class="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-slate-950 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mx-auto">📦</div>
        <h4 class="text-base font-black text-slate-900 dark:text-white">Did you choose the right number of boxes you'll have for us to move?</h4>
        <p class="text-xs text-slate-500">A helpful rule of thumb is 15–25 moving boxes per person.</p>
        <div class="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            @click="jumpToBoxes"
            class="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Add Moving Boxes
          </button>
          <button
            type="button"
            @click="proceedToQuoteSubmit"
            class="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
          >
            Proceed to Quote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()

// Moving packages definition
const movingPackages = [
  { value: 'van_only',      label: 'Van Only',        price: '€69.99/hr', desc: 'You handle the lifting — we handle the drive.' },
  { value: 'van_1_mover',   label: 'Van + 1 Mover',   price: '€79.99/hr', desc: 'Perfect for studio hops and budgets with big plans.' },
  { value: 'van_2_movers',  label: 'Van + 2 Movers',  price: '€94.99/hr', desc: 'We handle the furniture. You handle the new keys.' },
  { value: 'full_service',  label: 'Full Service',     price: '€149/hr',   desc: 'Concierge-level care, packing & assembly included.' },
]

// Form state
const movingPackage = ref('')
const moveType     = ref('Residential')
const storageRequired = ref('no')
const inPersonQuote = ref('no')
const customMoveSize = ref('')
const transitionalStops = ref([])
const addTransitionalStop = () => transitionalStops.value.push('')
const removeTransitionalStop = (idx) => transitionalStops.value.splice(idx, 1)

const fullName     = ref('')
const email        = ref('')
const phone        = ref('')
const movingFrom   = ref('')
const movingTo     = ref('')
const moveDate     = ref('')
const alternativeDate = ref('')
const moveSize     = ref('')

const isSizeDropdownOpen = ref(false)

const sizeOptions = [
  { value: 'studio', key: 'contact.studio_single' },
  { value: '1bed', key: 'contact.1bed_apt' },
  { value: '2bed', key: 'contact.2bed_apt' },
  { value: '3bed', key: 'contact.3bed_house' },
  { value: 'office', key: 'contact.office_space', fallback: 'Office / Commercial Space' },
  { value: 'items', key: 'contact.few_items' },
  { value: 'other', key: 'contact.other_size', fallback: 'Other (Specify)' }
]

const selectSizeOption = (val) => {
  moveSize.value = val
  isSizeDropdownOpen.value = false
}

const closeSizeDropdown = () => {
  isSizeDropdownOpen.value = false
}

const preferredTime = ref('')
const isTimeDropdownOpen = ref(false)

const timeOptions = [
  { value: 'morning', key: 'contact.time_slot_morning' },
  { value: 'afternoon', key: 'contact.time_slot_afternoon' },
  { value: 'evening', key: 'contact.time_slot_evening' }
]

const selectTimeOption = (val) => {
  preferredTime.value = val
  isTimeDropdownOpen.value = false
}

const closeTimeDropdown = () => {
  isTimeDropdownOpen.value = false
}

// Media upload
const mediaInput = ref(null)
const mediaFiles = ref([])

const handleMediaChange = (e) => {
  const files = Array.from(e.target.files || [])
  addMediaFiles(files)
  if (mediaInput.value) mediaInput.value.value = ''
}

const handleMediaDrop = (e) => {
  const files = Array.from(e.dataTransfer.files || [])
  addMediaFiles(files)
}

const addMediaFiles = (files) => {
  const allowed = files.filter(f => f.size <= 20 * 1024 * 1024)
  const newEntries = allowed.map(f => ({
    name: f.name,
    size: f.size,
    type: f.type,
    preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    raw: f
  }))
  mediaFiles.value = [...mediaFiles.value, ...newEntries].slice(0, 5)
}

const removeMedia = (idx) => {
  if (mediaFiles.value[idx]?.preview) URL.revokeObjectURL(mediaFiles.value[idx].preview)
  mediaFiles.value.splice(idx, 1)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Step 2 Property Access
const pickupFloor  = ref('')
const deliveryFloor = ref('')
const elevatorAvailable = ref('')
const movingLiftNeeded = ref('')

// Step 3 Additional Services
const packingService = ref('')
const furnitureAssembly = ref('')
const fragileItems = ref('')
const specialItemsDescription = ref('')
const notes = ref('')

// Step 4 Contact Info
const contactPreference = ref('')
const hearAbout = ref('')

// UI state
const currentStep  = ref(1)
const submitted    = ref(false)
const showInventoryBuilder = ref(false)
const showBoxesReminderModal = ref(false)
const activeInventoryRoom = ref('primary_bedroom')
const inventorySearch = ref('')
const inventoryFilterTab = ref('all')
const inventoryQuantities = ref({})
const disassembledItems = ref({})

const inventoryRooms = [
  { id: 'primary_bedroom', label: 'Primary Bedroom', icon: '🛏️' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'living', label: 'Living Room', icon: '🛋️' },
  { id: 'dining', label: 'Dining Room', icon: '🍽️' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'office', label: 'Home Office', icon: '💻' },
  { id: 'studio', label: 'Studio / Hallway', icon: '🏠' },
  { id: 'boxes', label: 'Boxes & Packing', icon: '📦' }
]

const inventoryCatalog = [
  // Primary Bedroom
  { id: 'p_bed_king', room: 'primary_bedroom', name: 'King Bed Frame + Mattress (Disassembly/Reassembly)', volume: 2.2, svgType: 'bed', disassemblable: true },
  { id: 'p_bed_storage', room: 'primary_bedroom', name: 'King Storage Bed + Mattress (Drawers)', volume: 2.5, svgType: 'bed', disassemblable: true },
  { id: 'p_wardrobe_3', room: 'primary_bedroom', name: 'Wardrobe (3-Door / PAX)', volume: 2.4, svgType: 'wardrobe', disassemblable: true },
  { id: 'p_dresser_double', room: 'primary_bedroom', name: 'Dresser Double / Triple', volume: 1.1, svgType: 'dresser', disassemblable: false },
  { id: 'p_nightstand', room: 'primary_bedroom', name: 'Nightstand / Bedside Table', volume: 0.25, svgType: 'nightstand', disassemblable: false },
  { id: 'p_tv', room: 'primary_bedroom', name: 'TV Flat 42"-65"', volume: 0.3, svgType: 'tv', disassemblable: false },
  // Bedroom
  { id: 'bed_queen', room: 'bedroom', name: 'Queen / Full Bed Frame + Mattress', volume: 1.8, svgType: 'bed', disassemblable: true },
  { id: 'bed_single', room: 'bedroom', name: 'Single Bed + Mattress', volume: 1.2, svgType: 'bed', disassemblable: true },
  { id: 'wardrobe_2', room: 'bedroom', name: 'Wardrobe (2-Door)', volume: 1.5, svgType: 'wardrobe', disassemblable: true },
  { id: 'dresser', room: 'bedroom', name: 'Chest of Drawers / Dresser', volume: 0.8, svgType: 'dresser', disassemblable: false },
  { id: 'nightstand', room: 'bedroom', name: 'Nightstand / Bedside Table', volume: 0.25, svgType: 'nightstand', disassemblable: false },
  // Living Room
  { id: 'sofa_3', room: 'living', name: '3-Seater Sofa / Couch', volume: 1.8, svgType: 'sofa', disassemblable: true },
  { id: 'sofa_l', room: 'living', name: 'L-Shape Sectional Sofa (4–5 Seat)', volume: 2.8, svgType: 'sofa', disassemblable: true },
  { id: 'sofa_2', room: 'living', name: '2-Seater Loveseat / Sofa', volume: 1.3, svgType: 'sofa', disassemblable: false },
  { id: 'armchair', room: 'living', name: 'Armchair / Lounge Chair', volume: 0.7, svgType: 'chair', disassemblable: false },
  { id: 'coffee_table', room: 'living', name: 'Coffee Table', volume: 0.4, svgType: 'table', disassemblable: false },
  { id: 'tv_stand', room: 'living', name: 'TV Stand / Media Console', volume: 0.7, svgType: 'dresser', disassemblable: false },
  { id: 'tv_large', room: 'living', name: 'Large TV (50"+)', volume: 0.3, svgType: 'tv', disassemblable: false },
  { id: 'bookcase', room: 'living', name: 'Bookshelf / Bookcase', volume: 0.9, svgType: 'shelf', disassemblable: true },
  // Dining Room
  { id: 'dining_table', room: 'dining', name: 'Dining Table (4–6 Person)', volume: 1.4, svgType: 'table', disassemblable: true },
  { id: 'dining_chair', room: 'dining', name: 'Dining Chair', volume: 0.2, svgType: 'chair', disassemblable: false },
  { id: 'sideboard', room: 'dining', name: 'Buffet / Sideboard Cabinet', volume: 1.1, svgType: 'dresser', disassemblable: false },
  // Kitchen
  { id: 'fridge', room: 'kitchen', name: 'Refrigerator / Freezer', volume: 1.2, svgType: 'appliance', disassemblable: false },
  { id: 'washer', room: 'kitchen', name: 'Washing Machine / Dryer', volume: 0.7, svgType: 'appliance', disassemblable: false },
  { id: 'dishwasher', room: 'kitchen', name: 'Dishwasher / Oven', volume: 0.6, svgType: 'appliance', disassemblable: false },
  // Home Office
  { id: 'desk', room: 'office', name: 'Office Desk', volume: 0.9, svgType: 'table', disassemblable: true },
  { id: 'office_chair', room: 'office', name: 'Ergonomic Office Chair', volume: 0.3, svgType: 'chair', disassemblable: false },
  { id: 'file_cabinet', room: 'office', name: 'Filing Cabinet', volume: 0.5, svgType: 'dresser', disassemblable: false },
  { id: 'monitor', room: 'office', name: 'Computer Monitor / iMac', volume: 0.2, svgType: 'tv', disassemblable: false },
  // Studio / Hallway
  { id: 'entry_table', room: 'studio', name: 'Entryway Console Table', volume: 0.5, svgType: 'table', disassemblable: false },
  { id: 'shoe_shelf', room: 'studio', name: 'Shoe Rack / Storage Shelf', volume: 0.4, svgType: 'shelf', disassemblable: false },
  // Boxes & Packing
  { id: 'box_small', room: 'boxes', name: 'Small Moving Box (Books/Heavy)', volume: 0.05, svgType: 'box', disassemblable: false },
  { id: 'box_medium', room: 'boxes', name: 'Medium Moving Box (Standard)', volume: 0.08, svgType: 'box', disassemblable: false },
  { id: 'box_large', room: 'boxes', name: 'Large Moving Box (Bedding/Clothes)', volume: 0.12, svgType: 'box', disassemblable: false },
  { id: 'wardrobe_box', room: 'boxes', name: 'Wardrobe Hanging Box', volume: 0.25, svgType: 'box', disassemblable: false }
]

const toggleDisassembled = (id) => {
  disassembledItems.value = {
    ...disassembledItems.value,
    [id]: !disassembledItems.value[id]
  }
}

const getEffectiveItemVolume = (item) => {
  if (item.disassemblable && disassembledItems.value[item.id]) {
    return Math.round(item.volume * 0.7 * 100) / 100
  }
  return item.volume
}

const filteredInventoryCatalog = computed(() => {
  const q = inventorySearch.value.toLowerCase().trim()
  return inventoryCatalog.filter(item => {
    if (inventoryFilterTab.value === 'added') {
      if ((inventoryQuantities.value[item.id] || 0) <= 0) return false
    } else if (!q && item.room !== activeInventoryRoom.value) {
      return false
    }
    if (q) {
      return item.name.toLowerCase().includes(q)
    }
    return true
  })
})

const getRoomItemCount = (roomId) => {
  return inventoryCatalog
    .filter(i => i.room === roomId)
    .reduce((sum, i) => sum + (inventoryQuantities.value[i.id] || 0), 0)
}

const incrementItem = (id) => {
  inventoryQuantities.value = {
    ...inventoryQuantities.value,
    [id]: (inventoryQuantities.value[id] || 0) + 1
  }
}

const decrementItem = (id) => {
  const cur = inventoryQuantities.value[id] || 0
  if (cur <= 0) return
  inventoryQuantities.value = {
    ...inventoryQuantities.value,
    [id]: cur - 1
  }
}

const selectedInventoryList = computed(() => {
  return inventoryCatalog
    .filter(i => (inventoryQuantities.value[i.id] || 0) > 0)
    .map(i => ({
      id: i.id,
      name: i.name,
      room: i.room,
      qty: inventoryQuantities.value[i.id],
      disassembled: Boolean(i.disassemblable && disassembledItems.value[i.id]),
      volume: getEffectiveItemVolume(i)
    }))
})

const totalInventoryItems = computed(() => selectedInventoryList.value.reduce((s, i) => s + i.qty, 0))
const activeRoomsCount = computed(() => new Set(selectedInventoryList.value.map(i => i.room)).size)
const totalInventoryVolume = computed(() => selectedInventoryList.value.reduce((s, i) => s + i.qty * i.volume, 0))

const baseMoveCharge = computed(() => {
  const pkgBase = {
    van_only: 199,
    van_1_mover: 279,
    van_2_movers: 389,
    full_service: 649
  }[movingPackage.value] || 320

  const storageAdd = storageRequired.value === 'yes' ? 95 : 0
  const packingAdd = packingService.value === 'yes' ? 120 : 0
  const assemblyAdd = furnitureAssembly.value === 'yes' ? 85 : 0
  const stopsAdd = transitionalStops.value.filter(s => String(s || '').trim()).length * 55

  return Math.round(pkgBase + storageAdd + packingAdd + assemblyAdd + stopsAdd)
})

const volumeMoveCharge = computed(() => {
  if (totalInventoryItems.value > 0) {
    return Math.round(totalInventoryVolume.value * 38)
  }
  if (showInventoryBuilder.value) {
    return 0
  }
  return {
    studio: 90,
    '1bed': 150,
    '2bed': 240,
    '3bed': 360,
    office: 320,
    items: 60,
    other: 180
  }[moveSize.value] || 140
})

const estimatedInstantPrice = computed(() => {
  return Math.round(baseMoveCharge.value + volumeMoveCharge.value)
})

const openInventoryBuilder = () => {
  validationError.value = ''
  if (!fullName.value.trim() || !email.value.trim() || !phone.value.trim() || !contactPreference.value || !hearAbout.value) {
    validationError.value = 'Please fill in all contact details and select how you heard about us before adding items.'
    return
  }
  showInventoryBuilder.value = true
}

const handleSeeQuoteClick = () => {
  const hasBoxes = getRoomItemCount('boxes') > 0
  if (!hasBoxes) {
    showBoxesReminderModal.value = true
    return
  }
  proceedToQuoteSubmit()
}

const jumpToBoxes = () => {
  showBoxesReminderModal.value = false
  inventoryFilterTab.value = 'all'
  inventorySearch.value = ''
  activeInventoryRoom.value = 'boxes'
}

const proceedToQuoteSubmit = () => {
  showBoxesReminderModal.value = false
  showInventoryBuilder.value = false
  if (user.value) {
    verifyOtpAndSubmit()
  } else {
    handleSendOtp()
  }
}

const loading = ref(false)
const validationError = ref('')
const otpCode      = ref('')

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const todayDate = computed(() => new Date().toISOString().split('T')[0])

// Pre-fill from query parameters (coming from homepage quote form)
onMounted(() => {
  if (route.query.from)  movingFrom.value  = String(route.query.from)
  if (route.query.to)    movingTo.value    = String(route.query.to)
  if (route.query.date)  moveDate.value    = String(route.query.date)

  const typeMap = {
    van_only: 'studio',
    van_1:    '1bed',
    van_2:    '2bed',
    full_service: '3bed'
  }
  if (route.query.type && typeMap[String(route.query.type)]) {
    moveSize.value = typeMap[String(route.query.type)]
  }
})

// Human-readable label helpers for the FormSubmit email
const elevatorLabels = {
  both: 'Yes — at both locations',
  pickup: 'Yes — pickup only',
  delivery: 'Yes — delivery only',
  none: 'No elevator'
}

const liftLabels = {
  yes: 'Yes',
  no: 'No',
  unsure: 'Not sure'
}

const contactPrefLabels = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  call: 'Phone Call'
}

const sizeLabels = {
  studio: 'Studio / Single Room',
  '1bed': '1-Bedroom Apartment',
  '2bed': '2-Bedroom Apartment',
  '3bed': '3+ Bedroom House',
  items: 'Just a few large items'
}

const hearLabels = {
  referral: 'Referral word of mouth',
  returning: 'Returning customer',
  social: 'Social media',
  google: 'Google',
  real_estate: 'Real Estate Agent Referral',
  student_center: 'Student Service Center Referral',
  other: 'Other'
}

const prevStep = () => {
  validationError.value = ''
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = () => {
  validationError.value = ''
  if (currentStep.value === 1) {
    if (!movingPackage.value || !moveSize.value || !moveDate.value || !movingFrom.value || !movingTo.value) {
      validationError.value = t('contact.validation_step_1') !== 'contact.validation_step_1' ? t('contact.validation_step_1') : 'Please fill in all fields (package, size, date, and addresses)'
      return
    }
  } else if (currentStep.value === 2) {
    if (!pickupFloor.value || !deliveryFloor.value || !elevatorAvailable.value || !movingLiftNeeded.value) {
      validationError.value = t('contact.validation_step_2') !== 'contact.validation_step_2' ? t('contact.validation_step_2') : 'Please complete all access questions'
      return
    }
  } else if (currentStep.value === 3) {
    if (!packingService.value || !furnitureAssembly.value || !fragileItems.value) {
      validationError.value = t('contact.validation_step_3') !== 'contact.validation_step_3' ? t('contact.validation_step_3') : 'Please answer all service options'
      return
    }
    if (fragileItems.value === 'yes' && !specialItemsDescription.value.trim()) {
      validationError.value = t('contact.validation_step_3_special') !== 'contact.validation_step_3_special' ? t('contact.validation_step_3_special') : 'Please describe your fragile/specialty items'
      return
    }
  } else if (currentStep.value === 4) {
    if (!fullName.value.trim() || !email.value.trim() || !phone.value.trim() || !contactPreference.value || !hearAbout.value) {
      validationError.value = 'Please fill in all contact details and select how you heard about us'
      return
    }
  }

  if (currentStep.value < 4) {
    currentStep.value++
  } else if (currentStep.value === 4) {
    if (user.value) {
      // Already authenticated, skip OTP
      verifyOtpAndSubmit()
    } else {
      handleSendOtp()
    }
  }
}

const handleSendOtp = async () => {
  loading.value = true
  validationError.value = ''
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true
      }
    })
    if (error) throw error
    currentStep.value = 5
  } catch (error) {
    validationError.value = error.message || 'Failed to send OTP. Please try again.'
  } finally {
    loading.value = false
  }
}

const isResending = ref(false)
const resendSuccessMessage = ref('')

const resendOtp = async () => {
  isResending.value = true
  validationError.value = ''
  resendSuccessMessage.value = ''
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true
      }
    })
    if (error) throw error
    resendSuccessMessage.value = t('contact.otp_resent_success') !== 'contact.otp_resent_success' ? t('contact.otp_resent_success') : 'Verification code sent again!'
    setTimeout(() => { resendSuccessMessage.value = '' }, 5000)
  } catch (error) {
    validationError.value = error.message || 'Failed to resend OTP. Please try again.'
  } finally {
    isResending.value = false
  }
}

const verifyOtpAndSubmit = async () => {
  loading.value = true
  validationError.value = ''

  try {
    if (!user.value) {
      // Need to verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.value,
        token: otpCode.value,
        type: 'email'
      })
      if (error) throw error
    }

    // Now submit order to Supabase orders table
    const orderDetails = await submitToDatabase()

    // Send the email with all reference IDs
    await sendLegacyEmail(orderDetails)

    submitted.value = true
  } catch (error) {
    validationError.value = error.message || 'Invalid code or failed to submit order.'
    console.error('Submit error:', error)
  } finally {
    loading.value = false
  }
}

const submitToDatabase = async () => {
  const currentYear = new Date().getFullYear()
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  const randomInv = Math.floor(1000 + Math.random() * 9000)
  const quoteCode = `QT-${randomNum}`
  const invoiceNumber = `INV-${currentYear}-${randomInv}`

  const formDataObj = {
    name: fullName.value,
    email: email.value,
    phone: phone.value,
    package: movingPackage.value,
    move_type: moveType.value,
    storage_required: storageRequired.value,
    in_person_quote: inPersonQuote.value,
    transitional_stops: transitionalStops.value.filter(s => String(s || '').trim().length > 0),
    from: movingFrom.value,
    to: movingTo.value,
    date: moveDate.value,
    time: preferredTime.value,
    altDate: alternativeDate.value,
    size: moveSize.value === 'other' && customMoveSize.value ? customMoveSize.value : moveSize.value,
    pickupFloor: pickupFloor.value,
    deliveryFloor: deliveryFloor.value,
    elevator: elevatorAvailable.value,
    lift: movingLiftNeeded.value,
    packing: packingService.value,
    assembly: furnitureAssembly.value,
    fragile: fragileItems.value === 'yes' ? specialItemsDescription.value : 'no',
    preference: contactPreference.value,
    hear: hearAbout.value,
    notes: notes.value,
    inventory_items: selectedInventoryList.value,
    estimated_volume_m3: Number(totalInventoryVolume.value.toFixed(1)),
    est_revenue: null,
    images: [],
    quote_code: quoteCode,
    invoice_number: invoiceNumber
  }

  // Upload images to Cloudinary first
  if (mediaFiles.value && mediaFiles.value.length > 0) {
    for (const item of mediaFiles.value) {
      const fileToUpload = item.raw || item.file
      if (fileToUpload) {
        const fileData = new FormData()
        fileData.append('file', fileToUpload)
        try {
          const res = await $fetch('/api/upload', {
            method: 'POST',
            body: fileData
          })
          if (res && res.url) {
            formDataObj.images.push(res.url)
          }
        } catch(e) {
          console.error('Failed to upload image:', e)
        }
      }
    }
  }

  const authUser = (await supabase.auth.getUser()).data.user
  if (!authUser) throw new Error("User not authenticated")

  // Check if customer exists by ID
  const { data: customerById } = await supabase.from('customers').select('id').eq('id', authUser.id).maybeSingle()
  
  if (!customerById) {
    const { error: insertErr } = await supabase.from('customers').insert({
      id: authUser.id,
      email: email.value,
      full_name: fullName.value,
      phone: phone.value
    })
    if (insertErr) console.error("Error inserting customer:", insertErr)
  }

  const { data: createdOrder, error } = await supabase.from('orders').insert({
    customer_id: authUser.id,
    status: 'Pending',
    est_revenue: null,
    form_data: formDataObj
  }).select('id').single()
  if (error) throw error

  const shortUuid = createdOrder?.id ? createdOrder.id.split('-')[0].toUpperCase() : `${randomNum}`
  const orderNumber = `ORD-${shortUuid}`
  const confirmationCode = `CNF-${shortUuid}`

  return {
    id: createdOrder?.id,
    orderNumber,
    quoteCode,
    confirmationCode,
    invoiceNumber,
    images: formDataObj.images || []
  }
}

const sendLegacyEmail = async (ids = {}) => {
  const { id: orderId, orderNumber, quoteCode, confirmationCode, invoiceNumber, images: uploadedImages } = ids

  // Track conversion event
  const { $trackEvent } = useNuxtApp()
  if (typeof $trackEvent === 'function') {
    $trackEvent('quote_request', {
      name: fullName.value,
      email: email.value,
      phone: phone.value,
      from: movingFrom.value,
      to: movingTo.value,
      date: moveDate.value,
      preferred_time: preferredTime.value,
      order_id: orderId || '',
      order_number: orderNumber || ''
    })
  }

  const subject = orderNumber 
    ? `Quote Request [${orderNumber}] from ${fullName.value} — ${moveDate.value}`
    : `Quote Request from ${fullName.value} — ${moveDate.value}`

  const packageLabels = {
    van_only: 'Van Only (€69.99/hr)',
    van_1_mover: 'Van + 1 Mover (€79.99/hr)',
    van_2_movers: 'Van + 2 Movers (€94.99/hr)',
    full_service: 'Full Service (€149/hr)'
  }

  const timeLabels = {
    morning: 'Morning (9:00 - 12:00)',
    afternoon: 'Afternoon (12:00 - 17:00)',
    evening: 'Evening (17:00 - 21:00)'
  }

  try {
    const payload = {
      _subject: subject,
      _replyto: email.value,
      'Order Number (Order ID)': orderNumber || '',
      'Quote Code (Code ID)': quoteCode || '',
      'Confirmation ID': confirmationCode || '',
      'Invoice Number': invoiceNumber || '',
      'Database Order ID': orderId || '',
      'Name': fullName.value,
      'Email': email.value,
      'Phone': phone.value,
      'Moving Package': packageLabels[movingPackage.value] || movingPackage.value || 'Not specified',
      'Moving From': movingFrom.value,
      'Moving To': movingTo.value,
      'Preferred Date': moveDate.value,
      'Preferred Time': timeLabels[preferredTime.value] || preferredTime.value || 'Not specified',
      'Alternative Date': alternativeDate.value || 'None',
      'Move Size': sizeLabels[moveSize.value] || moveSize.value || 'Not specified',
      'Pickup Floor': pickupFloor.value || 'Not specified',
      'Delivery Floor': deliveryFloor.value || 'Not specified',
      'Elevator Available': elevatorLabels[elevatorAvailable.value] || elevatorAvailable.value || 'Not specified',
      'Moving Lift Needed': liftLabels[movingLiftNeeded.value] || movingLiftNeeded.value || 'Not specified',
      'Packing Service': packingService.value === 'yes' ? 'Yes, pack for me' : 'No, I\'ll pack myself',
      'Furniture Assembly': furnitureAssembly.value === 'yes' ? 'Yes, please' : 'No thanks',
      'Fragile/Specialty Items': fragileItems.value === 'yes' ? specialItemsDescription.value : 'No',
      'Contact Preference': contactPrefLabels[contactPreference.value] || contactPreference.value || 'Not specified',
      'How Did You Hear': hearLabels[hearAbout.value] || hearAbout.value || 'Not specified',
      'Additional Notes': notes.value || 'None',
      images: uploadedImages || []
    }

    await $fetch('/api/send-email', {
      method: 'POST',
      body: payload
    })
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
}
</script>

<style scoped>
.form-label {
  @apply text-xs font-bold uppercase tracking-widest text-slate-500 block;
}
.form-input {
  @apply w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
}
/* Prevent date inputs from overflowing on mobile */
input[type="date"].form-input {
  overflow: hidden;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
</style>

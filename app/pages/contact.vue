<template>
  <div class="pt-32">
    <BaseSection :title="$t('contact.title')" :subtitle="$t('contact.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div class="glass-panel p-10 rounded-3xl" data-aos="fade-right">

          <!-- Success Message -->
          <div v-if="submitted" class="text-center py-16">
            <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">{{ $t('contact.success_title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400">{{ $t('contact.success_desc') }}</p>
            <button @click="submitted = false" class="mt-8 btn-primary px-8 py-3">
              {{ $t('contact.send_another') }}
            </button>
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
              </div>
              <div class="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
                     :style="{ width: `${(currentStep / 4) * 100}%` }">
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

              <div class="space-y-2">
                <label class="form-label" for="moving_size">{{ $t('contact.what_are_you_moving') }}</label>
                <select id="moving_size" v-model="moveSize" class="form-input cursor-pointer" required>
                  <option value="" disabled>{{ $t('contact.select_size') }}</option>
                  <option value="studio">{{ $t('contact.studio_single') }}</option>
                  <option value="1bed">{{ $t('contact.1bed_apt') }}</option>
                  <option value="2bed">{{ $t('contact.2bed_apt') }}</option>
                  <option value="3bed">{{ $t('contact.3bed_house') }}</option>
                  <option value="items">{{ $t('contact.few_items') }}</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.preferred_date') }}</label>
                  <input type="date" v-model="moveDate" class="form-input cursor-pointer" :min="todayDate" required />
                </div>
                <div class="space-y-2">
                  <label class="form-label">{{ $t('contact.alternative_date') }}</label>
                  <input type="date" v-model="alternativeDate" class="form-input cursor-pointer" :min="todayDate" />
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

              <!-- Optional Media Upload -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <label class="form-label mb-0">{{ $t('contact.media_upload_label') }}</label>
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{{ $t('contact.optional') }}</span>
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
            </div>

            <!-- Validation Error message -->
            <div v-if="validationError" class="text-xs font-bold text-red-600 bg-red-500/5 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 animate-pulse">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>{{ validationError }}</span>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-8 gap-4">
              <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {{ $t('contact.step_counter', { current: currentStep, total: 4 }) !== 'contact.step_counter' ? $t('contact.step_counter', { current: currentStep, total: 4 }) : `Step ${currentStep} of 4` }}
              </span>
              <div class="flex gap-3">
                <button v-if="currentStep > 1" type="button" @click="prevStep" class="btn px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold transition-all bg-white dark:bg-slate-900">
                  {{ $t('contact.back') }}
                </button>
                <button v-if="currentStep < 4" type="button" @click="nextStep" class="btn bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20">
                  {{ $t('contact.continue') }}
                </button>
                <button v-else type="submit" class="btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2" :disabled="loading">
                  <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ loading ? $t('contact.sending') : $t('contact.get_quote') }}</span>
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
              <div class="text-slate-600 dark:text-slate-400 text-sm">{{ i === 1 ? '+31 6 84094271' : 'info@moveitmaastricht.nl' }}</div>
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
const fullName     = ref('')
const email        = ref('')
const phone        = ref('')
const movingFrom   = ref('')
const movingTo     = ref('')
const moveDate     = ref('')
const alternativeDate = ref('')
const moveSize     = ref('')

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
const loading      = ref(false)
const validationError = ref('')

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
  } else {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  loading.value = true

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
    })
  }

  const subject = `Quote Request from ${fullName.value} — ${moveDate.value}`

  const packageLabels = {
    van_only: 'Van Only (€69.99/hr)',
    van_1_mover: 'Van + 1 Mover (€79.99/hr)',
    van_2_movers: 'Van + 2 Movers (€94.99/hr)',
    full_service: 'Full Service (€149/hr)'
  }

  try {
    // Use FormData to support file attachments
    const formData = new FormData()
    formData.append('_subject', subject)
    formData.append('_replyto', email.value)
    formData.append('_template', 'table')
    formData.append('Name', fullName.value)
    formData.append('Email', email.value)
    formData.append('Phone', phone.value)
    formData.append('Moving Package', packageLabels[movingPackage.value] || movingPackage.value || 'Not specified')
    formData.append('Moving From', movingFrom.value)
    formData.append('Moving To', movingTo.value)
    formData.append('Preferred Date', moveDate.value)
    formData.append('Alternative Date', alternativeDate.value || 'None')
    formData.append('Move Size', sizeLabels[moveSize.value] || moveSize.value || 'Not specified')
    formData.append('Pickup Floor', pickupFloor.value || 'Not specified')
    formData.append('Delivery Floor', deliveryFloor.value || 'Not specified')
    formData.append('Elevator Available', elevatorLabels[elevatorAvailable.value] || elevatorAvailable.value || 'Not specified')
    formData.append('Moving Lift Needed', liftLabels[movingLiftNeeded.value] || movingLiftNeeded.value || 'Not specified')
    formData.append('Packing Service', packingService.value === 'yes' ? 'Yes, pack for me' : 'No, I\'ll pack myself')
    formData.append('Furniture Assembly', furnitureAssembly.value === 'yes' ? 'Yes, please' : 'No thanks')
    formData.append('Fragile/Specialty Items', fragileItems.value === 'yes' ? specialItemsDescription.value : 'No')
    formData.append('Contact Preference', contactPrefLabels[contactPreference.value] || contactPreference.value || 'Not specified')
    formData.append('How Did You Hear', hearLabels[hearAbout.value] || hearAbout.value || 'Not specified')
    formData.append('Additional Notes', notes.value || 'None')
    // Attach media files if any
    mediaFiles.value.forEach((f, i) => {
      formData.append(`attachment_${i + 1}`, f.raw, f.name)
    })

    await $fetch('https://formsubmit.co/ajax/info@moveitmaastricht.nl', {
      method: 'POST',
      body: formData
    })
    submitted.value = true
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send quote request. Please try again or contact us directly.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-label {
  @apply text-xs font-bold uppercase tracking-widest text-slate-500 block;
}
.form-input {
  @apply w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none;
}
</style>

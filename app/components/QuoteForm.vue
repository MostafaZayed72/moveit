<template>
  <div class="p-6 md:p-10 bg-slate-950/60 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6">
    <div>
      <h3 class="text-3xl font-black text-white tracking-tight">{{ $t('home.get_quote') }}</h3>
      <p class="text-sm text-slate-400 mt-2">{{ $t('home.quote_form_desc') }}</p>
    </div>
    <form @submit.prevent="handleQuoteSubmit" class="space-y-4">
      
      <!-- Date and Type Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold uppercase tracking-widest text-slate-400 pl-2">{{ $t('home.move_date') }} *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            
            <input 
              v-model="moveDate" 
              type="date"
              required
              class="date-input-custom w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner [color-scheme:dark] cursor-pointer"
              :class="moveDate ? 'text-white' : 'text-transparent'"
            />
            
            <div v-if="!moveDate" class="absolute inset-y-0 left-12 flex items-center pointer-events-none text-slate-400">
              DD/MM/YYYY
            </div>
          </div>
        </div>
        
        <div class="space-y-1">
          <label class="text-xs font-bold uppercase tracking-widest text-slate-400 pl-2">{{ $t('home.move_type') }} *</label>
          <div class="relative">
            <button 
              type="button"
              @click="isDropdownOpen = !isDropdownOpen"
              @blur="closeDropdown"
              class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-left focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner flex justify-between items-center cursor-pointer"
            >
              <span :class="{'text-slate-400': !moveType}" class="truncate whitespace-nowrap overflow-hidden block w-full pr-4">
                {{ moveType ? $t(moveOptions.find(o => o.value === moveType).key) : $t('home.choose_option') }}
              </span>
              <svg class="h-4 w-4 transition-transform duration-200 shrink-0" :class="{'rotate-180': isDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
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
                v-if="isDropdownOpen" 
                class="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
              >
                <div 
                  v-for="option in moveOptions" 
                  :key="option.value"
                  @mousedown.prevent="selectOption(option.value)"
                  class="px-6 py-3 hover:bg-red-500/20 cursor-pointer transition-colors flex items-center justify-between group"
                  :class="{'bg-red-500/10 text-red-400 font-bold': moveType === option.value, 'text-slate-200': moveType !== option.value}"
                >
                  <span>{{ $t(option.key) }}</span>
                  <svg v-if="moveType === option.value" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <AddressAutocomplete 
        v-model="movingFrom"
        :placeholder="$t('home.moving_from')"
        input-class="w-full pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner"
        required
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </template>
      </AddressAutocomplete>

      <AddressAutocomplete 
        v-model="movingTo"
        :placeholder="$t('home.moving_to')"
        input-class="w-full pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner"
        required
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        </template>
      </AddressAutocomplete>
      
      <div class="pt-4 space-y-4">
        <button type="submit" class="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 transition-all">
          <span>{{ $t('home.get_quote') }}</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
        <div class="text-center pt-2">
          <a href="https://wa.me/31684094271" target="_blank" class="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 font-bold tracking-tight text-base group">
            <svg class="w-5 h-5 text-emerald-500 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>{{ $t('home.or_get_call') }}</span>
          </a>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const movingFrom = ref('')
const movingTo = ref('')
const moveDate = ref('')
const moveType = ref('')

const isDateFocused = ref(false)
const isDropdownOpen = ref(false)

const moveOptions = [
  { value: 'van_only', key: 'home.packages.package1.name' },
  { value: 'van_1', key: 'home.packages.package2.name' },
  { value: 'van_2', key: 'home.packages.package3.name' },
  { value: 'full_service', key: 'home.packages.package4.name' },
  { value: 'custom', key: 'home.custom_move' }
]

const selectOption = (val) => {
  moveType.value = val
  isDropdownOpen.value = false
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const localePath = useLocalePath()

const handleQuoteSubmit = () => {
  // Track conversion event
  const { $trackEvent } = useNuxtApp()
  if (typeof $trackEvent === 'function') {
    $trackEvent('quote_request', {
      from: movingFrom.value,
      to: movingTo.value,
      date: moveDate.value,
      type: moveType.value
    })
  }

  navigateTo({
    path: localePath('/contact'),
    query: {
      from: movingFrom.value,
      to: movingTo.value,
      date: moveDate.value,
      type: moveType.value
    }
  })
}
</script>

<style scoped>
/* Make the native calendar icon invisible but span the entire input so clicking anywhere opens the picker */
.date-input-custom {
  position: relative;
}
.date-input-custom::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>

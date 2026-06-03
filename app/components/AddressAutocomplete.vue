<template>
  <div class="relative w-full" :class="isOpen ? 'z-50' : 'z-20'" ref="autocompleteRef">
    <div class="relative group">
      <!-- Optional Prefix Icon Slot -->
      <span v-if="hasIcon" class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors pointer-events-none">
        <slot name="icon"></slot>
      </span>
      
      <input 
        type="text" 
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        @keydown.down.prevent="onKeyDownDown"
        @keydown.up.prevent="onKeyDownUp"
        @keydown.enter.prevent="onKeyDownEnter"
        @keydown.esc="closeDropdown"
        :placeholder="placeholder"
        :class="[inputClass, hasIcon ? 'pl-12' : 'px-6']"
        :required="required"
        autocomplete="off"
      />
      
      <!-- Loading indicator -->
      <span v-if="loading" class="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    </div>

    <!-- Suggestions Dropdown -->
    <div 
      v-if="isOpen && suggestions.length > 0" 
      class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto"
    >
      <ul class="divide-y divide-slate-100 dark:divide-slate-800/80">
        <li 
          v-for="(suggestion, idx) in suggestions" 
          :key="idx"
          @click="selectSuggestion(suggestion)"
          :class="[
            'px-6 py-3.5 cursor-pointer text-sm text-left flex items-start space-x-3 transition-colors',
            activeIdx === idx ? 'bg-slate-100 dark:bg-white/5 text-red-500' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          ]"
        >
          <!-- Pin Icon -->
          <svg class="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-900 dark:text-white truncate">
              {{ suggestion.main }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
              {{ suggestion.secondary }}
            </p>
          </div>
        </li>
      </ul>
      
      <!-- Attribution -->
      <div class="px-6 py-2 bg-slate-50 dark:bg-slate-950/40 text-[10px] text-right text-slate-400 border-t border-slate-100 dark:border-slate-800/50">
        powered by OpenStreetMap
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const hasIcon = computed(() => !!slots.icon)

const autocompleteRef = ref(null)
const suggestions = ref([])
const isOpen = ref(false)
const loading = ref(false)
const activeIdx = ref(-1)

let debounceTimer = null

const onInput = (e) => {
  const val = e.target.value
  emit('update:modelValue', val)
  
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (!val || val.trim().length < 1) {
    suggestions.value = []
    isOpen.value = false
    return
  }
  
  debounceTimer = setTimeout(() => {
    fetchSuggestions(val)
  }, 200) // Slightly faster debounce for better typing feel
}

const onFocus = () => {
  if (props.modelValue && props.modelValue.trim().length >= 1) {
    fetchSuggestions(props.modelValue)
  } else if (suggestions.value.length > 0) {
    isOpen.value = true
  }
}

const fetchSuggestions = async (query) => {
  loading.value = true
  try {
    // Restricting bbox to Europe: West/Left = -25, South/Bottom = 34, East/Right = 45, North/Top = 72
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=-25,34,45,72&limit=5`)
    const data = await res.json()
    
    if (data && data.features) {
      suggestions.value = data.features.map(feat => {
        const props = feat.properties
        
        // Build main text (street + number, or city/place name if not street)
        let main = ''
        if (props.street) {
          main = props.street + (props.housenumber ? ` ${props.housenumber}` : '')
        } else {
          main = props.name || ''
        }
        
        // Build secondary text (city, postal code, state, country)
        const secParts = []
        if (props.postcode) secParts.push(props.postcode)
        if (props.city && props.city !== main) secParts.push(props.city)
        if (props.state) secParts.push(props.state)
        if (props.country) secParts.push(props.country)
        
        const secondary = secParts.join(', ')
        
        return {
          full: formatAddress(props),
          main,
          secondary
        }
      })
      isOpen.value = suggestions.value.length > 0
    } else {
      suggestions.value = []
      isOpen.value = false
    }
  } catch (err) {
    console.error('Error fetching suggestions:', err)
  } finally {
    loading.value = false
  }
}

const formatAddress = (properties) => {
  const parts = []
  if (properties.street) {
    parts.push(properties.street + (properties.housenumber ? ` ${properties.housenumber}` : ''))
  }
  if (properties.postcode) {
    parts.push(properties.postcode)
  }
  if (properties.city || properties.name) {
    const placeName = properties.city || properties.name
    if (!parts.includes(placeName)) {
      parts.push(placeName)
    }
  }
  if (properties.country) {
    parts.push(properties.country)
  }
  return parts.join(', ')
}

const selectSuggestion = (suggestion) => {
  emit('update:modelValue', suggestion.full)
  closeDropdown()
}

const closeDropdown = () => {
  isOpen.value = false
  activeIdx.value = -1
}

const onKeyDownDown = () => {
  if (!isOpen.value) return
  if (activeIdx.value < suggestions.value.length - 1) {
    activeIdx.value++
  }
}

const onKeyDownUp = () => {
  if (!isOpen.value) return
  if (activeIdx.value > 0) {
    activeIdx.value--
  }
}

const onKeyDownEnter = () => {
  if (isOpen.value && activeIdx.value >= 0 && activeIdx.value < suggestions.value.length) {
    selectSuggestion(suggestions.value[activeIdx.value])
  }
}

// Click outside logic
const handleClickOutside = (e) => {
  if (autocompleteRef.value && !autocompleteRef.value.contains(e.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

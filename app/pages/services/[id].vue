<template>
  <div v-if="loadingDb" class="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
    <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-slate-500 dark:text-slate-400 font-bold">Loading service...</p>
  </div>
  <div v-else class="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <ServiceDetailsPage 
      :service-id="serviceId" 
      :db-service="dbService" 
      :db-sections="dbSections" 
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const route = useRoute()

// DB State
const dbService = ref(null)
const dbSections = ref([])
const loadingDb = ref(true)

const serviceId = computed(() => {
  const param = route.params.id || 'student'
  return param.replace(/-/g, '_')
})

const fetchDbService = async () => {
  if (!$supabase) {
    loadingDb.value = false
    return
  }
  
  const slug = route.params.id.replace(/_/g, '-')
  try {
    const { data: serv, error } = await $supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      
    if (serv) {
      dbService.value = serv
      
      const { data: secs } = await $supabase
        .from('service_sections')
        .select('*')
        .eq('service_id', serv.id)
        .order('sort_order')
        
      if (secs) {
        dbSections.value = secs
      }
    }
  } catch (err) {
    console.error('Error fetching service details from Supabase:', err)
  } finally {
    loadingDb.value = false
  }
}

onMounted(() => {
  fetchDbService()
})
</script>

<template>
  <div class="pt-32">
    <BaseSection :title="$t('services.title')" :subtitle="$t('services.subtitle')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink 
          v-for="(service, index) in displayedServices" 
          :key="index"
          :to="localePath('/services/' + service.slug)"
          class="premium-card group flex flex-col h-full cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
        >
          <div class="h-56 rounded-2xl overflow-hidden mb-8 relative bg-slate-100 dark:bg-slate-900">
            <img 
              :src="service.image" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              :alt="service.title" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div class="px-2 flex flex-col flex-grow">
            <h3 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
              {{ service.title }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed line-clamp-3">
              {{ service.desc }}
            </p>
            
            <div class="mt-auto">
              <span class="btn-primary w-full py-3 text-center block">
                {{ $t('services.btn_details') }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const serviceList = [
  { id: 'student', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
  { id: 'local', image: 'https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=800' },
  { id: 'long_distance', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800' },
  { id: 'international', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' },
  { id: 'full_service', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { id: 'furniture_assembly', image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800' },
  { id: 'packing', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: 'lift_rental', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },
  { id: 'piano', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800' },
  { id: 'senior', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800' },
  { id: 'last_minute_moving', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800' },
  { id: 'clearance', image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800' }
]

const dbServices = ref([])

const fetchServices = async () => {
  if (!$supabase) return
  try {
    const { data, error } = await $supabase
      .from('services')
      .select('*')
      .order('id')
    if (error) {
      console.warn('Failed to load services from Supabase:', error.message)
      return
    }
    if (data) {
      dbServices.value = data
    }
  } catch (err) {
    console.error('Error fetching services:', err)
  }
}

onMounted(() => {
  fetchServices()
})

const displayedServices = computed(() => {
  const isNl = locale.value === 'nl'
  
  if (dbServices.value.length > 0) {
    return dbServices.value.map(service => ({
      id: service.slug,
      slug: service.slug,
      image: service.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      title: isNl ? service.title_nl : service.title_en,
      desc: isNl ? service.description_nl : service.description_en
    }))
  }
  
  return serviceList.map(s => ({
    id: s.id,
    slug: s.id.replace(/_/g, '-'),
    image: s.image,
    title: t(`services.list.${s.id}.title`),
    desc: t(`services.list.${s.id}.desc`)
  }))
})

useSeoMeta({
  title: `${t('services.title')} | MoveIt`,
  description: t('services.subtitle')
})
</script>


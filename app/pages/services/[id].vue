<template>
  <StudentMovingPage v-if="serviceId === 'student'" />
  <ServiceDetailsPage v-else-if="isCustomService" :service-id="serviceId" />
  <div v-else class="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- HERO SECTION WITH PREMIUM BACKGROUND -->
    <section class="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image with Glassmorphism Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          :src="meta.image" 
          class="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-[10s]" 
          :alt="title" 
        />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-50 dark:to-slate-950 transition-colors duration-300"></div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto px-6 relative z-10 max-w-4xl text-center" data-aos="zoom-out">
        <NuxtLink 
          :to="localePath('/services')" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-all text-sm font-bold text-slate-300 mb-8 backdrop-blur-md border border-white/10"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          {{ $t('nav.services') }}
        </NuxtLink>

        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl sm:whitespace-nowrap">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-600 px-2 pb-1">
            {{ title }}
          </span>
        </h1>
        
        <p class="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
          {{ description }}
        </p>
      </div>
    </section>

    <!-- CONTENT BODY SECTION -->
    <section class="py-16 px-6 -mt-20 relative z-20">
      <div class="container mx-auto max-w-6xl">
        <!-- 3-Column Service Quick Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div 
            v-for="(stat, idx) in stats" 
            :key="idx"
            class="premium-card p-8 flex items-center gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-xl rounded-3xl"
            data-aos="fade-up"
            :data-aos-delay="idx * 100"
          >
            <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-3xl font-semibold shadow-inner">
              {{ stat.icon }}
            </div>
            <div>
              <div class="text-3xl font-black text-slate-900 dark:text-white">{{ stat.value }}</div>
              <div class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- TWO COLUMN INTERACTIVE DETAILS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <!-- Left Main Column (Overview, What's Included) -->
          <div class="lg:col-span-8 space-y-12">
            <!-- Professional Description Block -->
            <div class="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-xl" data-aos="fade-up">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                {{ $t('about_us.who_we_are.title') }}
              </h2>
              <div class="text-slate-600 dark:text-slate-300 leading-relaxed space-y-6 text-lg">
                <p v-for="(paragraph, pIdx) in detailedText" :key="pIdx">
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <!-- Beautiful Feature List / What's Included -->
            <div class="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-xl" data-aos="fade-up">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
                {{ $t('home.packages.includes') }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  v-for="(feature, fIdx) in features" 
                  :key="fIdx"
                  class="flex items-start gap-4 group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-red-500 transition-colors">{{ feature.title }}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar Column (Sticky Booking & Quick Info) -->
          <div class="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <div class="p-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl relative overflow-hidden" data-aos="fade-up">
              <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>
              <div class="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-slate-950/20 blur-2xl"></div>

              <h3 class="text-2xl font-black mb-4 relative z-10">{{ $t('home.cta.title') }}</h3>
              <p class="text-red-100 mb-8 leading-relaxed text-sm relative z-10">
                {{ $t('home.cta.subtitle') }}
              </p>

              <div class="space-y-4 relative z-10">
                <NuxtLink :to="localePath('/contact')" class="block">
                  <button class="w-full py-4 bg-white text-red-600 rounded-2xl font-black shadow-lg hover:bg-red-50 transition-all active:scale-95 text-center flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8"/></svg>
                    {{ $t('home.cta.btn_quote') }}
                  </button>
                </NuxtLink>

                <a 
                  :href="`https://wa.me/31612345678?text=Hi! I am interested in your ${title} service.`" 
                  target="_blank" 
                  class="block w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {{ $t('home.cta.btn_whatsapp') }}
                </a>
              </div>
            </div>

            <!-- Trust Badge Sidebar Component -->
            <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-xl text-center space-y-4" data-aos="fade-up">
              <div class="inline-flex p-3 rounded-2xl bg-red-500/10 text-red-500 text-2xl">
                🛡️
              </div>
              <h4 class="font-bold text-lg text-slate-900 dark:text-white">{{ $t('home.why_us.insured.title') }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ $t('home.why_us.insured.desc') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { t, te, tm } = useI18n()

// Service IDs normalization mapping
const serviceId = computed(() => {
  const param = route.params.id || 'student'
  return param.replace(/-/g, '_')
})

const isCustomService = computed(() => {
  const list = [
    'local', 'long_distance', 'international', 'full_service', 'furniture_assembly',
    'packing', 'lift_rental', 'piano', 'senior', 'storage', 'clearance'
  ]
  return list.includes(serviceId.value)
})

const title = computed(() => t(`services.list.${serviceId.value}.title`, 'Service'))
const description = computed(() => t(`services.list.${serviceId.value}.desc`, 'Expert moving solution'))

// Clean, compact and robust image mapping
const serviceMeta = {
  student: {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🎓', value: '2,500+', label: 'Student Moves' },
      { icon: '🚐', value: 'Free', label: 'Ride-Along Service' },
      { icon: '⭐', value: '4.9/5', label: 'Trustpilot Rating' }
    ]
  },
  local: {
    image: 'https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🏠', value: '5,000+', label: 'Local Moves' },
      { icon: '⏱️', value: '2 Hours', label: 'Average Move' },
      { icon: '🤝', value: '100%', label: 'Care & Respect' }
    ]
  },
  long_distance: {
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🚚', value: '1,200+', label: 'National Moves' },
      { icon: '🇳🇱', value: '100%', label: 'NL Coverage' },
      { icon: '🔒', value: 'Insured', label: 'Goods in Transit' }
    ]
  },
  international: {
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🌍', value: '800+', label: 'Cross-Border' },
      { icon: '🇪🇺', value: 'Europe', label: 'Wide Network' },
      { icon: '📋', value: 'Expert', label: 'Customs Handling' }
    ]
  },
  full_service: {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '✨', value: 'Premium', label: 'Turnkey Move' },
      { icon: '📦', value: 'Included', label: 'Full Packing' },
      { icon: '💆‍♂️', value: '0%', label: 'Stress Level' }
    ]
  },
  furniture_assembly: {
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🛠️', value: '100%', label: 'Equipped' },
      { icon: '📐', value: 'Perfect', label: 'Assembly' },
      { icon: '🛋️', value: 'Fast', label: 'Movers' }
    ]
  },
  packing: {
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '📦', value: '10k+', label: 'Boxes Packed' },
      { icon: '🛡️', value: 'Max', label: 'Protection' },
      { icon: '🎀', value: 'Fragile', label: 'Special Care' }
    ]
  },
  lift_rental: {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🏗️', value: 'High', label: 'Reach Lift' },
      { icon: '🏢', value: 'Up to 5th', label: 'Floor Access' },
      { icon: '⚡', value: 'Fast', label: 'Setup Time' }
    ]
  },
  piano: {
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🎹', value: 'Safe', label: 'Instrument Care' },
      { icon: '💪', value: 'Heavy', label: 'Lifting Gear' },
      { icon: '🛡️', value: '100%', label: 'Damage-Free' }
    ]
  },
  senior: {
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '❤️', value: 'Caring', label: 'Team Spirit' },
      { icon: '⏱️', value: 'Relaxed', label: 'Pace' },
      { icon: '🤝', value: 'Full', label: 'Support' }
    ]
  },
  storage: {
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🔒', value: '24/7', label: 'Security' },
      { icon: '❄️', value: 'Optimal', label: 'Climate' },
      { icon: '📦', value: 'Flex', label: 'Contracts' }
    ]
  },
  clearance: {
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1200',
    stats: [
      { icon: '🧹', value: 'Fast', label: 'Clearance' },
      { icon: '♻️', value: 'Eco', label: 'Disposal' },
      { icon: '✨', value: 'Broom', label: 'Clean finish' }
    ]
  }
}

const meta = computed(() => serviceMeta[serviceId.value] || serviceMeta.student)
const stats = computed(() => meta.value.stats)

// Dynamically fetch detailed text from translations or fallback gracefully
const detailedText = computed(() => {
  const key = `services.list.${serviceId.value}.detailedText`
  if (te(key)) {
    const res = tm(key)
    return Array.isArray(res) ? res.map(p => typeof p === 'string' ? p : p.toString()) : [res.toString()]
  }
  
  // Standard high-quality professional fallback text matching the service
  return [
    `We understand that every move is unique and deserves special attention. That is why moveit Maastricht offers a premium, specialized ${title.value} service tailored specifically to your residential or commercial needs.`,
    `Our professional crew comes highly trained, fully vetted, and completely equipped to handle your belongings with extreme care and efficiency, ensuring that nothing is lost or damaged during transit.`,
    `We operate with full insurance coverage, clear and transparent pricing, and 24/7 communication via WhatsApp so you are kept up-to-date and completely stress-free throughout your moving day.`
  ]
})

// Dynamically fetch features from translations or fallback gracefully
const features = computed(() => {
  const key = `services.list.${serviceId.value}.features`
  if (te(key)) {
    return tm(key)
  }
  
  // Default professional features fallback
  return [
    { title: 'Affordable & Vetted', description: 'Premium quality moving service tailored to stay highly competitive and pocket-friendly.' },
    { title: 'Care & Respect', description: 'Treating all items, fragile boxes, and your home walls with total care and respect.' },
    { title: 'Equipped Fleet', description: 'Modern clean moving vans equipped with secure strapping and heavy protective blankets.' },
    { title: 'Comprehensive Insurance', description: 'Every single move includes transport insurance for complete peace of mind.' }
  ]
})

useSeoMeta({
  title: computed(() => `${title.value} | MoveIt Maastricht`),
  description: computed(() => description.value)
})
</script>

<style scoped>
.text-gradient-red {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400;
}
.premium-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.premium-card:hover {
  transform: translateY(-5px);
  @apply shadow-2xl shadow-red-500/5 border-red-500/20;
}
.btn-primary {
  @apply bg-red-600 text-white rounded-full font-bold transition-all shadow-lg hover:bg-red-700 active:scale-95;
}
</style>

<template>
  <div>
    <!-- 1. HERO SECTION -->
    <section class="relative min-h-screen overflow-hidden">
      <HeroVideo
        src="/videos/hero.webm"
        poster="/images/hero-poster.jpg"
        overlay-class="bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90"
        class="absolute inset-0 w-full h-full"
      />
      <div class="relative z-10 flex items-center min-h-screen pt-32 pb-20 px-6">
        <div class="container mx-auto max-w-7xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <!-- Left Column: Headline & Subtitle -->
            <div class="lg:col-span-6 text-center lg:text-left space-y-6" data-aos="fade-right">
              <!-- Badge -->
              <div class="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-200 text-xs font-semibold backdrop-blur-md">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{{ $t('home.hero_badge_new') }}</span>
              </div>
              
              <!-- Title -->
              <h1 class="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-tight text-white tracking-tight text-center lg:text-left">
                {{ $t('home.hero_title_new_part1') }} <span class="text-red-500">{{ $t('home.hero_title_new_part2') }}</span>
              </h1>

              <!-- Description -->
              <p class="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-sm font-medium tracking-tight">
                {{ $t('home.hero_desc_new') }}
              </p>

              <!-- Buttons -->
              <div class="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                <NuxtLink 
                  :to="localePath('/contact')" 
                  class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-600/10 hover:shadow-red-600/20 active:scale-95 cursor-pointer inline-flex items-center justify-center"
                >
                  {{ $t('home.hero_btn_quote') }}
                </NuxtLink>
                <a 
                  href="#process" 
                  class="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm transition-all border border-white/15 active:scale-95 cursor-pointer inline-flex items-center justify-center"
                >
                  {{ $t('home.hero_btn_process') }}
                </a>
              </div>

              <!-- Trust Checkmarks -->
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 pt-2 text-xs font-semibold text-slate-400">
                <div class="flex items-center space-x-1.5">
                  <span class="text-emerald-500 text-sm font-bold">✓</span>
                  <span>{{ $t('home.hero_trust_1') }}</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-emerald-500 text-sm font-bold">✓</span>
                  <span>{{ $t('home.hero_trust_2') }}</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="text-emerald-500 text-sm font-bold">✓</span>
                  <span>{{ $t('home.hero_trust_3') }}</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Quote Form CTA -->
            <div id="quote-form" class="lg:col-span-6 w-full scroll-mt-28" data-aos="fade-left">
              <QuoteForm />
            </div>

          </div>

          <!-- Bottom stats row -->
          <div class="mt-16 grid grid-cols-3 gap-6 max-w-4xl mx-auto lg:mx-0 pt-10 border-t border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 bg-white/5" data-aos="fade-up" data-aos-delay="200">
            <div v-for="stat in heroStats" :key="stat.key" class="space-y-1 text-center md:text-left">
              <div class="text-2xl md:text-5xl font-black text-white">
                <StatCounter :value="stat.value" :suffix="stat.suffix" :decimals="stat.decimals || 0" />
              </div>
              <div class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight">{{ $t(`home.stats.${stat.key}`) }}</div>
            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- MOVING GALLERY SECTION -->
    <MovingGallery />

    <!-- TRUST BADGES & RATINGS -->
    <TrustSection />


    <!-- 2. SERVICES / PACKAGES -->
    <BaseSection :badge="$t('home.packages.badge')" :title="$t('home.packages.title')" :subtitle="$t('home.packages.subtitle')">
      <PricingPackages />
    </BaseSection>

    <!-- 3. REAL-TIME STATS -->
    <StatsCounter />

    <!-- 4. WHY CHOOSE US -->
    <BaseSection :badge="$t('home.why_us.badge')" :title="$t('home.why_us.title')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(reason, index) in whyUsItems"
          :key="reason.key"
          class="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <img :src="reason.image" :alt="reason.key" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-5 left-5 w-12 h-12 bg-red-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <span class="text-xl">{{ reason.icon }}</span>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h4 class="text-xl font-bold text-white mb-1">{{ $t(`home.why_us.${reason.key}.title`) }}</h4>
            <p class="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{{ $t(`home.why_us.${reason.key}.desc`) }}</p>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- 5. HOW IT WORKS -->
    <BaseSection id="process" class="scroll-mt-28" :badge="$t('home.how_it_works.badge')" :title="$t('home.how_it_works.title')" :subtitle="$t('home.how_it_works.subtitle')">
      <HowItWorks />
    </BaseSection>

    <!-- 6. SERVICES SUMMARY -->
    <BaseSection :badge="$t('home.bento_services.badge')" :title="$t('home.bento_services.title')" :subtitle="$t('home.bento_services.subtitle')">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <NuxtLink
          v-for="(service, idx) in bentoServices"
          :key="service.id"
          :to="localePath('/services/' + service.id)"
          class="premium-card group flex flex-col overflow-hidden aspect-square cursor-pointer !p-0 shadow-lg border border-slate-200/50 dark:border-slate-800/50 rounded-3xl"
          data-aos="fade-up"
          :data-aos-delay="idx * 50"
        >
          <!-- Top: Image -->
          <div class="h-1/2 w-full overflow-hidden relative">
            <img :src="service.image" :alt="service.id" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
          </div>
          
          <!-- Bottom: Content -->
          <div class="p-5 flex flex-col justify-between flex-grow bg-white dark:bg-slate-900 transition-colors duration-300">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <h4 class="text-sm md:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-red-500 transition-colors">
                  {{ $t(`services.list.${service.id}.title`) }}
                </h4>
                <span class="text-lg flex-shrink-0 ml-2">{{ service.icon }}</span>
              </div>
              <p class="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                {{ $t(`services.list.${service.id}.desc`) }}
              </p>
            </div>
            
            <div class="flex justify-end pt-1">
              <span class="text-[10px] font-bold text-red-500 group-hover:text-red-600 dark:group-hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                {{ locale === 'nl' ? 'Details' : 'Details' }}
                <svg class="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- View All Services CTA Button -->
      <div class="text-center mt-12" data-aos="fade-up">
        <NuxtLink :to="localePath('/services')">
          <button class="btn-primary px-10 py-4 text-lg font-extrabold shadow-xl tracking-tight">
            {{ $t('home.bento_services.view_all') }}
          </button>
        </NuxtLink>
      </div>
    </BaseSection>

    <!-- 7. CITIES WE SERVE -->
    <BaseSection :badge="$t('home.cities.badge')" :title="$t('home.cities.title')" :subtitle="$t('home.cities.subtitle')">
      <CitiesGrid />
    </BaseSection>

    <!-- 7. TESTIMONIALS -->
    <BaseSection :badge="$t('home.testimonials.badge')" :title="$t('home.testimonials.title')" :subtitle="$t('home.testimonials.subtitle')">
      <TestimonialsCarousel />
    </BaseSection>

    <!-- 8. FAQ PREVIEW -->
    <BaseSection :badge="$t('home.faqs.badge')" :title="$t('home.faqs.title')" :subtitle="$t('home.faqs.subtitle')">
      <FaqPreview />
      <div class="text-center mt-10">
        <NuxtLink :to="localePath('/faq')" class="text-red-500 font-bold hover:text-red-600 transition-colors inline-flex items-center gap-2">
          {{ $t('home.faqs.view_all') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </NuxtLink>
      </div>
    </BaseSection>

    <!-- 9. FINAL CTA -->
    <section class="relative py-32 px-6 overflow-hidden">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=1920" class="w-full h-full object-cover" alt="" />
        <div class="absolute inset-0 bg-gradient-to-r from-red-700/90 to-slate-950/90"></div>
      </div>
      <div class="container mx-auto max-w-3xl relative z-10 text-center" data-aos="zoom-in">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{{ $t('home.cta.title') }}</h2>
        <p class="text-xl text-red-100 mb-10 leading-relaxed">{{ $t('home.cta.subtitle') }}</p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink :to="localePath('/contact')">
            <button class="px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg shadow-2xl hover:bg-red-50 transition-all active:scale-95">
              {{ $t('home.cta.btn_quote') }}
            </button>
          </NuxtLink>
          <a href="https://wa.me/31684094271" target="_blank" class="px-10 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-green-600 transition-all active:scale-95 inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t('home.cta.btn_whatsapp') }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { tm, rt, t } = useI18n()
const localePath = useLocalePath()

const movingFrom = ref('')
const movingTo = ref('')

const handleQuoteSubmit = () => {
  navigateTo({
    path: localePath('/contact'),
    query: {
      from: movingFrom.value,
      to: movingTo.value
    }
  })
}

const cityIndex = ref(0)
const subtitleIndex = ref(0)

const cities = computed(() => {
  const list = tm('home.hero_cities')
  return Array.isArray(list) ? list.map(c => rt(c)) : []
})

const subtitles = computed(() => {
  const list = tm('home.hero_subtitles')
  return Array.isArray(list) ? list.map(s => rt(s)) : []
})

const currentCity = computed(() => cities.value[cityIndex.value] || 'Maastricht')
const currentSubtitle = computed(() => subtitles.value[subtitleIndex.value] || '')

onMounted(() => {
  setInterval(() => {
    cityIndex.value = (cityIndex.value + 1) % cities.value.length
  }, 3000)

  setInterval(() => {
    subtitleIndex.value = (subtitleIndex.value + 1) % subtitles.value.length
  }, 5000)
})

const heroStats = [
  { key: 'completed', value: 1000, suffix: '+' },
  { key: 'rating', value: 4.9, suffix: '/5', decimals: 1 },
  { key: 'coverage', value: 14, suffix: '+' }
]



const whyUsItems = [
  { key: 'fast', icon: '⚡', image: '/images/why_us_fast.png' },
  { key: 'student', icon: '🎓', image: '/images/why_us_student.png' },
  { key: 'transparent', icon: '💰', image: '/images/why_us_transparent.png' },
  { key: 'insured', icon: '🛡️', image: '/images/why_us_insured.png' }
]

const bentoServices = [
  { id: 'local', icon: '🏠', image: 'https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-2' },
  { id: 'long_distance', icon: '🚚', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-2' },
  { id: 'packing', icon: '📦', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-1' },
  { id: 'piano', icon: '🎹', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-1' },
  { id: 'furniture_assembly', icon: '🔧', image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-2' },
  { id: 'international', icon: '✈️', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-2' },
  { id: 'last_minute_moving', icon: '⚡', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-1' },
  { id: 'student', icon: '🎓', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', spanClass: 'lg:col-span-1' }
]

useSeoMeta({
  title: 'MoveIt Maastricht | Professional Moving Services',
  description: 'The premier moving service for homes and businesses in Limburg and beyond.'
})
</script>

<style scoped>
.text-gradient-red {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400;
}

/* Wave Animation for Letters */
.animate-wave {
  animation: wave 2s infinite ease-in-out;
}

@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Slide Up Animation for Cities */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from {
  transform: translateY(100%) scale(0.3) rotate(15deg);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-100%) scale(1.5) rotate(-15deg);
  opacity: 0;
}

/* Fade Up Animation for Subtitles */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.8s ease;
}
.fade-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.fade-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.btn-primary {
  @apply bg-red-600 text-white rounded-full font-bold transition-all shadow-lg hover:bg-red-700 active:scale-95;
}
</style>

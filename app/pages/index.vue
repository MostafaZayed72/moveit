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
            <div class="lg:col-span-7 text-left space-y-8" data-aos="fade-right">
              <div class="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-200 text-sm font-semibold backdrop-blur-md">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{{ $t('home.trust_pilot') }}</span>
              </div>
              
              <!-- Rotating Main Title -->
              <h1 class="flex flex-col items-start text-5xl md:text-7xl lg:text-8xl font-black leading-none text-white tracking-tighter text-left">
                <span class="opacity-90">{{ $t('home.hero_prefix') }}</span>
                <div class="relative h-[1.2em] overflow-hidden flex items-center justify-start py-2">
                  <Transition name="slide-up" mode="out-in">
                    <div :key="currentCity" class="inline-flex items-center">
                      <span 
                        v-for="(char, i) in currentCity.split('')" 
                        :key="i"
                        class="inline-block animate-wave text-gradient-red"
                        :style="{ animationDelay: `${i * 0.1}s` }"
                      >
                        {{ char === ' ' ? '\u00A0' : char }}
                      </span>
                    </div>
                  </Transition>
                </div>
                <span class="opacity-90">{{ $t('home.hero_suffix') }}</span>
              </h1>

              <!-- Rotating Subtitle -->
              <div class="relative h-20 md:h-28">
                <Transition name="fade-up" mode="out-in">
                  <p :key="currentSubtitle" class="text-xl md:text-3xl text-slate-300 leading-relaxed max-w-2xl font-medium drop-shadow-md tracking-tight">
                    {{ currentSubtitle }}
                  </p>
                </Transition>
              </div>
            </div>

            <!-- Right Column: Quote Form CTA -->
            <div class="lg:col-span-5 w-full" data-aos="fade-left">
              <div class="p-6 md:p-10 bg-slate-950/60 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6">
                <div>
                  <h3 class="text-3xl font-black text-white tracking-tight">{{ $t('home.get_quote') }}</h3>
                  <p class="text-sm text-slate-400 mt-2">Get an all-inclusive quote within minutes.</p>
                </div>
                <form @submit.prevent="handleQuoteSubmit" class="space-y-4">
                  <div class="relative group">
                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </span>
                    <input 
                      type="text" 
                      v-model="movingFrom" 
                      :placeholder="$t('home.moving_from')" 
                      class="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div class="relative group">
                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                    </span>
                    <input 
                      type="text" 
                      v-model="movingTo" 
                      :placeholder="$t('home.moving_to')" 
                      class="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-red-500 outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div class="pt-4 space-y-4">
                    <button type="submit" class="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-95 transition-all">
                      <span>{{ $t('home.get_quote') }}</span>
                      <svg class="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                    <div class="text-center pt-2">
                      <a href="https://wa.me/31612345678" target="_blank" class="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 font-bold tracking-tight text-base group">
                        <svg class="w-5 h-5 text-emerald-500 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span>{{ $t('home.or_get_call') }}</span>
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>

          <!-- Bottom stats row -->
          <div class="mt-16 grid grid-cols-3 gap-6 max-w-4xl pt-10 border-t border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 bg-white/5" data-aos="fade-up" data-aos-delay="200">
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

    <!-- TRUST BADGES & RATINGS -->
    <TrustSection />

    <!-- OUR VALUES TICKER -->
    <ValuesTicker />

    <!-- 2. SERVICES / PACKAGES -->
    <BaseSection :title="$t('home.packages.title')" :subtitle="$t('home.packages.subtitle')">
      <PricingPackages />
    </BaseSection>

    <!-- 3. REAL-TIME STATS -->
    <StatsCounter />

    <!-- 4. WHY CHOOSE US -->
    <BaseSection :title="$t('home.why_us.title')">
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
    <BaseSection :title="$t('home.how_it_works.title')" :subtitle="$t('home.how_it_works.subtitle')">
      <HowItWorks />
    </BaseSection>

    <!-- 6. CITIES WE SERVE -->
    <BaseSection :title="$t('home.cities.title')" :subtitle="$t('home.cities.subtitle')">
      <CitiesGrid />
    </BaseSection>

    <!-- 7. TESTIMONIALS -->
    <BaseSection :title="$t('home.testimonials.title')" :subtitle="$t('home.testimonials.subtitle')">
      <TestimonialsCarousel />
    </BaseSection>

    <!-- 8. FAQ PREVIEW -->
    <BaseSection :title="$t('home.faqs.title')" :subtitle="$t('home.faqs.subtitle')">
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
          <a href="https://wa.me/31612345678" target="_blank" class="px-10 py-4 bg-green-500 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-green-600 transition-all active:scale-95 inline-flex items-center gap-2">
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
  { key: 'completed', value: 10000, suffix: '+' },
  { key: 'rating', value: 4.9, suffix: '/5', decimals: 1 },
  { key: 'coverage', value: 15, suffix: '+' }
]

const whyUsItems = [
  { key: 'fast', icon: '⚡', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600' },
  { key: 'student', icon: '🎓', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600' },
  { key: 'transparent', icon: '💰', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600' },
  { key: 'insured', icon: '🛡️', image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600' }
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

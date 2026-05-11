<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-screen overflow-hidden">
      <!-- Video Background -->
      <HeroVideo
        src="/videos/hero.webm"
        poster="/images/hero-poster.jpg"
        overlay-class="bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90"
        class="absolute inset-0 w-full h-full"
      />

      <!-- Content -->
      <div class="relative z-10 flex items-center min-h-screen pt-20 px-6">
        <div class="container mx-auto max-w-4xl text-center">
          <div data-aos="zoom-out">
            <div class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold mb-8 backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>{{ $t('home.trust_pilot') }}</span>
            </div>
            
            <h1 class="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] text-white tracking-tighter">
              {{ $t('home.hero_title').split('.')[0] }}.<br/>
              <span class="text-gradient-blue">{{ $t('home.hero_title').split('.')[1] }}</span>
            </h1>
            
            <p class="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-lg">
              {{ $t('home.hero_subtitle') }}
            </p>
            
            <div class="flex flex-wrap justify-center gap-6">
              <NuxtLink :to="localePath('/contact')">
                <button class="btn-primary text-lg px-10 shadow-blue-500/30">{{ $t('home.get_quote') }}</button>
              </NuxtLink>
              <NuxtLink :to="localePath('/services')">
                <button class="btn-outline text-lg px-10 bg-white/5 backdrop-blur-sm border-white/30 hover:bg-white/10 !text-white hover:!border-white/50">{{ $t('nav.services') }}</button>
              </NuxtLink>
            </div>
            
            <div class="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-white/20 backdrop-blur-sm rounded-3xl p-6 bg-slate-950/20">
              <div v-for="stat in ['completed', 'rating', 'coverage']" :key="stat" class="space-y-1">
                <div class="text-3xl md:text-4xl font-black text-white">{{ $t(`home.stats.${stat}`).split(' ')[0] }}</div>
                <div class="text-xs font-bold uppercase tracking-widest text-slate-200">{{ $t(`home.stats.${stat}`).split(' ').slice(1).join(' ') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div class="w-6 h-10 rounded-full border-2 border-slate-400/50 flex items-start justify-center p-1">
          <div class="w-1.5 h-3 bg-slate-400/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>

    <!-- Service Highlights -->
    <BaseSection :title="$t('home.our_services')" :subtitle="$t('services.title')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(service, key) in ['private_moves', 'business_moves', 'intl_moves']" 
          :key="key"
          class="premium-card group"
          data-aos="fade-up"
          :data-aos-delay="key * 100"
        >
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
             <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path v-if="key === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
               <path v-if="key === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
               <path v-if="key === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{{ $t(`services.${service}`) }}</h3>
          <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Relocating with care and precision. We handle every detail so you don't have to.
          </p>
          <NuxtLink :to="localePath('/services')" class="text-blue-600 dark:text-blue-500 font-bold flex items-center space-x-2 group-hover:space-x-4 transition-all">
            <span>{{ $t('services.details_btn') }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </NuxtLink>
        </div>
      </div>
    </BaseSection>

    <!-- Why Choose Us -->
    <BaseSection :title="$t('about.why_us')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(reason, index) in whyUsItems"
          :key="reason.key"
          class="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <!-- Background Image -->
          <img
            :src="reason.image"
            :alt="reason.key"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <!-- Icon -->
          <div class="absolute top-5 left-5 w-12 h-12 bg-blue-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="index === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              <path v-if="index === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path v-if="index === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              <path v-if="index === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <!-- Text -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h4 class="text-xl font-bold text-white mb-1">{{ $t(`about.reasons.${reason.key}`) }}</h4>
            <p class="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- Testimonials -->
    <BaseSection title="What Our Clients Say" subtitle="Trusted by thousands of happy movers across the Netherlands">
      <TestimonialsCarousel />
    </BaseSection>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

const whyUsItems = [
  {
    key: 'insured',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848e968838?auto=format&fit=crop&q=80&w=600',
    desc: 'Every item is fully insured during transit for complete peace of mind.'
  },
  {
    key: 'vetted',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600',
    desc: 'Our team members are background-checked and professionally trained.'
  },
  {
    key: 'modern',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600',
    desc: 'State-of-the-art vehicles equipped with GPS tracking and climate control.'
  },
  {
    key: 'punc',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
    desc: 'We guarantee arrival within the scheduled window, every single time.'
  },
]

useSeoMeta({
  title: t('home.hero_title'),
  ogTitle: t('home.hero_title'),
  description: t('home.hero_subtitle'),
  ogDescription: t('home.hero_subtitle'),
})
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 4s infinite ease-in-out;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>

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
                <button class="btn-primary text-lg px-10">{{ $t('home.get_quote') }}</button>
              </NuxtLink>
              <NuxtLink :to="localePath('/services')">
                <button class="btn-outline text-lg px-10 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10">{{ $t('nav.services') }}</button>
              </NuxtLink>
            </div>
            
            <div class="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-white/10 backdrop-blur-sm rounded-3xl p-6">
              <div v-for="stat in ['completed', 'rating', 'coverage']" :key="stat" class="space-y-1">
                <div class="text-3xl md:text-4xl font-black text-white">{{ $t(`home.stats.${stat}`).split(' ')[0] }}</div>
                <div class="text-xs font-bold uppercase tracking-widest text-slate-300">{{ $t(`home.stats.${stat}`).split(' ').slice(1).join(' ') }}</div>
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
    <BaseSection :title="$t('home.our_services')" :subtitle="$t('services.title')" variant="light">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(service, key) in ['private_moves', 'business_moves', 'intl_moves']" 
          :key="key"
          class="premium-card group"
          data-aos="fade-up"
          :data-aos-delay="key * 100"
        >
          <div class="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
             <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path v-if="key === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
               <path v-if="key === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
               <path v-if="key === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-white">{{ $t(`services.${service}`) }}</h3>
          <p class="text-slate-400 mb-8 leading-relaxed">
            Relocating with care and precision. We handle every detail so you don't have to.
          </p>
          <NuxtLink :to="localePath('/services')" class="text-blue-500 font-bold flex items-center space-x-2 group-hover:space-x-4 transition-all">
            <span>{{ $t('services.details_btn') }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </NuxtLink>
        </div>
      </div>
    </BaseSection>

    <BaseSection :title="$t('about.why_us')" variant="dark">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(reasonKey, index) in ['insured', 'vetted', 'modern', 'punc']" :key="reasonKey" class="text-center" data-aos="zoom-in" :data-aos-delay="index * 100">
          <div class="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 group hover:border-emerald-500 transition-all">
            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h4 class="text-lg font-bold text-white">{{ $t(`about.reasons.${reasonKey}`) }}</h4>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

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

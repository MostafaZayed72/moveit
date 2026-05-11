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
      <div class="relative z-10 flex items-center min-h-screen pt-20 px-6">
        <div class="container mx-auto max-w-4xl text-center">
          <div data-aos="zoom-out">
            <div class="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-bold mb-8 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{{ $t('home.trust_pilot') }}</span>
            </div>
            <h1 class="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] text-white tracking-tighter">
              {{ $t('home.hero_title').split('.')[0] }}.<br/>
              <span class="text-gradient-red">{{ $t('home.hero_title').split('.')[1] }}</span>
            </h1>
            <p class="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-lg">
              {{ $t('home.hero_subtitle') }}
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <NuxtLink :to="localePath('/contact')">
                <button class="btn-primary text-lg px-10 shadow-red-500/30">{{ $t('home.get_quote') }}</button>
              </NuxtLink>
              <a href="https://wa.me/31612345678" target="_blank" class="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95 text-lg">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
            <div class="mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8 border-t border-white/10 backdrop-blur-sm rounded-3xl p-4 md:p-6 bg-slate-950/20">
              <div v-for="stat in heroStats" :key="stat.key" class="space-y-0 md:space-y-1">
                <div class="text-xl md:text-4xl font-black text-white">
                  <StatCounter :value="stat.value" :suffix="stat.suffix" :decimals="stat.decimals || 0" />
                </div>
                <div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-300 leading-tight">{{ $t(`home.stats.${stat.key}`) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- TRUST BADGES & RATINGS -->
    <TrustSection />

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
const localePath = useLocalePath()
const { t } = useI18n()

const heroStats = [
  { key: 'completed', value: 10000, suffix: '+', label: 'Moves Completed' },
  { key: 'rating', value: 4.9, suffix: '/5', label: 'Average Rating', decimals: 1 },
  { key: 'coverage', value: 15, suffix: '+', label: 'Cities Covered' },
]

const whyUsItems = [
  { key: 'fast', icon: '⚡', title: 'Fast Response', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600', desc: 'We respond to every inquiry within minutes via WhatsApp.' },
  { key: 'student', icon: '🎓', title: 'Student Friendly', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600', desc: 'Free ride along for students. Budget-friendly packages for small moves.' },
  { key: 'transparent', icon: '💰', title: 'Transparent Pricing', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=600', desc: 'No hidden fees. What you see is what you pay, always.' },
  { key: 'insured', icon: '🛡️', title: 'Insured Moves', image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600', desc: 'Every item is fully covered by our comprehensive transport insurance.' },
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

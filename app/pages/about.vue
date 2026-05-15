<template>
  <div class="pt-24 min-h-screen bg-slate-50 dark:bg-slate-950">
    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent -z-10"></div>
      <div class="container mx-auto px-6 max-w-7xl text-center">
        <h1 class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6" data-aos="fade-up">
          {{ $t('about.title') }}
        </h1>
        <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          {{ $t('about.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">
              Our Purpose
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">{{ $t('about.mission_title') }}</h2>
            <div class="prose prose-slate dark:prose-invert max-w-none">
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {{ $t('about.mission_text') }}
              </p>
            </div>
          </div>
          <div class="relative" data-aos="fade-left">
            <div class="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
              <img src="/images/about/mission.png" alt="Professional Moving" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-8 -left-8 w-64 h-64 bg-red-600 rounded-[2rem] -z-10 -rotate-6"></div>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center mt-32">
          <div class="order-2 lg:order-1 relative" data-aos="fade-right">
            <div class="aspect-video rounded-[3rem] overflow-hidden shadow-2xl -rotate-2">
              <img src="/images/about/vision.png" alt="Vision for Future" class="w-full h-full object-cover">
            </div>
            <div class="absolute -top-8 -right-8 w-64 h-64 bg-slate-900 dark:bg-slate-800 rounded-[2rem] -z-10 rotate-12"></div>
          </div>
          <div class="order-1 lg:order-2" data-aos="fade-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
              Our Vision
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">{{ $t('about.vision_title') }}</h2>
            <div class="prose prose-slate dark:prose-invert max-w-none">
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {{ $t('about.vision_text') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="py-32 bg-slate-900 dark:bg-slate-900/50 text-white overflow-hidden relative">
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
        </svg>
      </div>
      
      <div class="container mx-auto px-6 max-w-5xl text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest mb-8">
          The Journey
        </div>
        <h2 class="text-4xl md:text-5xl font-black mb-12" data-aos="fade-up">{{ $t('about.story_title') }}</h2>
        <div class="prose prose-invert max-w-none text-left md:text-center">
          <p class="text-lg text-slate-300 leading-relaxed whitespace-pre-line" data-aos="fade-up" data-aos-delay="100">
            {{ $t('about.story_text') }}
          </p>
        </div>
        
        <!-- Story Visual -->
        <div class="mt-20 grid grid-cols-3 gap-4 md:gap-8" data-aos="fade-up" data-aos-delay="200">
          <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl -rotate-6 translate-y-8">
            <img src="/images/about/prep.png" alt="Preparation" class="w-full h-full object-cover">
          </div>
          <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl scale-110 z-10">
            <img src="/images/about/move.png" alt="The Move" class="w-full h-full object-cover">
          </div>
          <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl rotate-6 translate-y-8">
            <img src="/images/about/home.png" alt="New Home" class="w-full h-full object-cover">
          </div>
        </div>
      </div>
    </section>

    <!-- Why moveit Section -->
    <section class="py-32 bg-slate-50 dark:bg-slate-950/50">
      <div class="container mx-auto max-w-7xl px-6">
        <div class="grid lg:grid-cols-2 gap-20 items-center">
          <div class="order-2 lg:order-1" data-aos="fade-right">
            <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">
              {{ $t('about.why_moveit_title') }}
            </h2>
            
            <div class="space-y-6 md:space-y-8">
              <p 
                v-for="(para, i) in $tm('about.why_moveit_text')" 
                :key="i"
                class="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium transition-all"
                :class="{ 
                  'text-red-600 dark:text-red-500 font-black text-3xl md:text-5xl italic tracking-tight py-4': $rt(para).includes('forward') && !$rt(para).includes('helping'),
                  'pl-4 border-l-4 border-red-500/30 italic text-slate-500 py-1': i >= 1 && i <= 6
                }"
                data-aos="fade-up"
                :data-aos-delay="i * 50"
              >
                {{ $rt(para) }}
              </p>
            </div>
          </div>
          
          <div class="order-1 lg:order-2" data-aos="fade-left">
            <div class="relative group">
              <div class="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105">
                <img src="/images/about/why.png" alt="Why MoveIt Concept" class="w-full h-full object-cover">
              </div>
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600 rounded-3xl -z-10 rotate-12 group-hover:rotate-6 transition-transform duration-700"></div>
              <div class="absolute -top-10 -left-10 w-40 h-40 bg-slate-900 rounded-3xl -z-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-32">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">
            Our DNA
          </div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white">{{ $t('about.values_title') }}</h2>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(value, i) in resolvedValues" 
            :key="i"
            class="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 hover:shadow-2xl transition-all duration-500 group min-h-[300px] flex flex-col justify-end"
            data-aos="fade-up"
            :data-aos-delay="i * 50"
          >
            <!-- Background Image -->
            <img 
              :src="valueImages[i]" 
              class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-110"
              alt="Value Background"
            >
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            <div class="relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-red-600 transition-all duration-500 shadow-xl">
                <span class="text-xl font-black">{{ i + 1 }}</span>
              </div>
              <h3 class="text-xl font-black text-white mb-3">{{ value.title }}</h3>
              <p class="text-sm text-slate-300 leading-relaxed font-medium italic">“{{ value.desc }}”</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="rounded-[3rem] bg-gradient-to-br from-red-600 to-orange-500 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(239,68,68,0.5)]">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-black mb-8">{{ $t('about.cta_title') }}</h2>
            <NuxtLink :to="localePath('/contact')" class="inline-block px-10 py-5 bg-white text-red-600 rounded-full font-black text-lg uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95">
              {{ $t('about.cta_button') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { tm, rt } = useI18n()
const localePath = useLocalePath()

const valueImages = [
  '/images/about/val1.png',
  '/images/about/val2.png',
  '/images/about/val3.png',
  '/images/about/val4.png',
  '/images/about/val5.png',
  '/images/about/val6.png',
  '/images/about/val7.png',
  '/images/about/val8.png',
]

const resolvedValues = computed(() => {
  const list = tm('about.values_list')
  return Array.isArray(list) ? list.map(item => ({
    title: rt(item.title),
    desc: rt(item.desc)
  })) : []
})
</script>

<style scoped>
.prose {
  @apply text-slate-600 dark:text-slate-400;
}
</style>

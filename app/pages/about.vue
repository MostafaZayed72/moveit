<template>
  <div class="pt-32">
    <!-- Hero Section -->
    <BaseSection :title="$t('about_us.title')" :subtitle="$t('about_us.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div data-aos="fade-right">
          <p class="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">
            {{ $t('about_us.content_p1') }}
          </p>
          
          <div class="space-y-6">
            <!-- Mission Panel -->
            <div class="glass-panel p-8 rounded-3xl border-l-8 border-red-600 shadow-xl bg-white dark:bg-slate-900">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{{ $t('about_us.mission') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ $t('about_us.mission_text') }}</p>
            </div>
          </div>
        </div>

        <div class="relative" data-aos="fade-left">
          <div class="rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-slate-100 dark:ring-slate-800 bg-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000" 
              alt="MoveIt Maastricht Logistics" 
              class="w-full h-[500px] object-cover transition-transform duration-1000 hover:scale-105" 
            />
          </div>
          <!-- Floating Experience Badge -->
          <div class="absolute -bottom-6 -right-6 md:-right-10 w-48 h-48 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-center p-6 shadow-2xl animate-spin-slow-custom">
            <div class="flex flex-col items-center">
              <span class="text-3xl">10+</span>
              <span class="text-[10px] uppercase tracking-[0.2em]">{{ $t('about_us.experience_badge') }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- Detailed Content Section -->
    <div class="bg-slate-50 dark:bg-slate-950 py-24">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Who We Are -->
          <div class="space-y-4" data-aos="fade-up" data-aos-delay="100">
            <div class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-red-600/20">📍</div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ $t('about_us.who_we_are.title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ $t('about_us.who_we_are.text') }}</p>
          </div>

          <!-- Expertise -->
          <div class="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <div class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-red-600/20">🚚</div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ $t('about_us.expertise.title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ $t('about_us.expertise.text') }}</p>
          </div>

          <!-- Professionalism -->
          <div class="space-y-4" data-aos="fade-up" data-aos-delay="300">
            <div class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-red-600/20">🛡️</div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ $t('about_us.standards.title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ $t('about_us.standards.text') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: t('about_us.seo_title'),
  ogTitle: t('about_us.seo_title'),
  description: t('about_us.seo_description'),
  ogDescription: t('about_us.seo_description'),
  keywords: 'verhuisbedrijf maastricht, moving company maastricht, verhuizen limburg, professional movers netherlands, international relocation maastricht, MoveIt Logistics'
})
</script>

<style scoped>
.animate-spin-slow-custom {
  animation: spin-custom 15s linear infinite;
}
@keyframes spin-custom {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

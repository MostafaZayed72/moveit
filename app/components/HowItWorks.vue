<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
    <!-- Connecting Line (desktop) -->
    <div class="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20 z-0"></div>

    <div
      v-for="(step, i) in steps"
      :key="i"
      class="relative text-center z-10"
      data-aos="fade-up"
      :data-aos-delay="i * 150"
    >
      <!-- Step Number -->
      <div class="w-32 h-32 mx-auto mb-8 relative">
        <div class="absolute inset-0 bg-red-600/10 dark:bg-red-900/20 rounded-3xl rotate-6 transition-transform group-hover:rotate-12"></div>
        <div class="relative w-full h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
          <span class="text-4xl mb-1">{{ step.icon }}</span>
          <span class="text-xs font-black text-red-500 uppercase tracking-widest">{{ $t('home.how_it_works.step_prefix') }} {{ i + 1 }}</span>
        </div>
      </div>

      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ $t(`home.how_it_works.step${i + 1}.title`) }}</h3>
      <p class="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto text-sm">{{ $t(`home.how_it_works.step${i + 1}.desc`) }}</p>
    </div>
  </div>
</template>

<script setup>
const steps = [
  { icon: '📋' },
  { icon: '✅' },
  { icon: '🚚' },
]
</script>

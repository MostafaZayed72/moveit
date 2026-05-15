<template>
  <div class="space-y-12">
    <!-- Pricing Grid/Slider Container -->
    <div class="relative group">
      <!-- Gradient Blobs for background depth -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style="animation-delay: 2s"></div>

      <!-- Slider on Mobile, Grid on Desktop -->
      <div class="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-3 xl:gap-4 lg:overflow-x-visible lg:pb-0 custom-scrollbar">
        <div
          v-for="(pkg, i) in resolvedPackages"
          :key="i"
          :class="[
            'relative rounded-[2.5rem] p-1 transition-all duration-700 hover:-translate-y-3 flex flex-col group/card snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-full',
            pkg.popular
              ? 'bg-gradient-to-br from-red-600 via-red-500 to-orange-500 shadow-[0_20px_50px_rgba(239,68,68,0.3)] z-10 scale-[1.02] lg:scale-[1.05]'
              : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl'
          ]"
          data-aos="fade-up"
          :data-aos-delay="i * 100"
        >
          <!-- Popular Ribbon -->
          <div v-if="pkg.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl whitespace-nowrap">
            {{ $t('home.packages.most_popular') }}
          </div>

          <div class="p-6 xl:p-7 flex flex-col flex-grow">
            <!-- Header Section -->
            <div class="mb-4">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner transition-transform duration-500 group-hover/card:scale-110', pkg.popular ? 'bg-white/20' : 'bg-red-50 dark:bg-red-900/20']">
                {{ pkg.icon }}
              </div>
              <h3 :class="['text-lg font-black leading-tight', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">
                {{ pkg.name }}
              </h3>
              <p :class="['text-[9px] font-bold mt-1 uppercase tracking-widest opacity-80 mb-3', pkg.popular ? 'text-white' : 'text-red-500']">
                {{ pkg.subtitle }}
              </p>
              
              <div class="flex items-baseline gap-1">
                <span :class="['text-3xl xl:text-4xl font-black tracking-tight', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">{{ pkg.price }}</span>
                <span :class="['text-sm font-medium', pkg.popular ? 'text-red-100' : 'text-slate-500']">{{ pkg.unit }}</span>
              </div>
              <p :class="['text-[9px] font-bold mt-0.5 uppercase tracking-wider opacity-60', pkg.popular ? 'text-white' : 'text-slate-400']">{{ $t('home.packages.excl_vat') }}</p>
            </div>

            <!-- Content Divider -->
            <div :class="['h-px w-full mb-4', pkg.popular ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800']"></div>

            <!-- Best For Section (Iconized) -->
            <div class="mb-6">
              <h4 :class="['text-[9px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                {{ $t('home.packages.perfect_for') }}
              </h4>
              <!-- Fixed height container for alignment (approx 2 rows of icons) -->
              <div class="flex flex-wrap gap-3 min-h-[110px] content-start">
                <div v-for="(item, idx) in pkg.best_for" :key="idx" class="group/icon relative">
                  <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 cursor-help', pkg.popular ? 'bg-white/20 text-white hover:bg-white hover:text-red-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-100 dark:border-slate-700 hover:bg-red-600 hover:text-white hover:scale-110 shadow-sm']">
                    {{ item.icon }}
                  </div>
                  <!-- Hover Tooltip -->
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2.5 bg-slate-900 text-white text-[12px] font-black rounded-xl opacity-0 translate-y-2 pointer-events-none group-hover/icon:opacity-100 group-hover/icon:translate-y-0 transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-white/20 ring-4 ring-black/5 min-w-max">
                    {{ item.text }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Includes Section -->
            <div class="mb-6">
              <h4 :class="['text-[9px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                {{ $t('home.packages.includes') }}
              </h4>
              <ul class="space-y-2.5">
                <li v-for="item in pkg.includes" :key="item" class="flex items-start gap-2.5">
                  <div :class="['w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-transform duration-500 group-hover/card:rotate-12', pkg.popular ? 'bg-white text-red-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600']">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span :class="['text-[11px] leading-relaxed font-semibold', pkg.popular ? 'text-red-50' : 'text-slate-600 dark:text-slate-300']">{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pt-5 border-t border-white/10">
              <a
                :href="pkg.cta.link"
                :class="[
                  'group/btn relative overflow-hidden block w-full text-center py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg',
                  pkg.popular
                    ? 'bg-white text-red-600 hover:bg-slate-900 hover:text-white'
                    : 'bg-red-600 text-white hover:bg-slate-900 shadow-red-600/20'
                ]"
              >
                <span class="relative z-10">{{ pkg.cta.text }}</span>
                <div class="absolute inset-0 bg-slate-900 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-0"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Optional Add-ons Section -->
    <div class="relative group" data-aos="fade-up">
      <div class="absolute inset-0 bg-gradient-to-r from-red-600/5 to-blue-600/5 rounded-[3rem] blur-xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity"></div>
      <div class="max-w-5xl mx-auto p-8 md:p-10 rounded-[3rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-2xl">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-12">
          <div class="shrink-0">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-black uppercase tracking-widest mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              Extras
            </div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-1">{{ $t('home.packages.optional_addons') }}</h3>
            <p class="text-slate-500 dark:text-slate-400 font-medium italic text-sm">“{{ $t('home.packages.available_during_booking') }}”</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 flex-grow">
            <div v-for="addon in resolvedAddons" :key="addon" class="flex items-center gap-4 group/addon">
              <div class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-red-600 group-hover/addon:bg-red-600 group-hover/addon:text-white transition-colors duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/addon:text-red-600 transition-colors">{{ addon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footnotes Section -->
    <div class="max-w-4xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 px-6 lg:px-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center text-center md:text-left">
        <div class="space-y-2">
          <p class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_vat') }}
          </p>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_time') }}
          </p>
          <p class="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            🎓 {{ $t('home.packages.footnote_student') }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-center md:justify-end gap-6">
          <div class="flex -space-x-3 overflow-hidden">
            <img v-for="i in 5" :key="i" class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" :src="`https://i.pravatar.cc/100?u=${i + 15}`" alt="Happy Customer">
          </div>
          <div class="flex flex-col items-center md:items-end">
            <div class="flex text-yellow-400 text-[10px] mb-0.5">★★★★★</div>
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Trusted by 2,500+ happy movers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, rt } = useI18n()

const resolvedPackages = computed(() => {
  const resolvePkg = (key, icon) => {
    const name = t(`home.packages.${key}.name`)
    return {
      icon,
      name,
      subtitle: t(`home.packages.${key}.subtitle`),
      price: t(`home.packages.${key}.price`),
      unit: t(`home.packages.${key}.unit`),
      popular: key === 'package2',
      best_for: (tm(`home.packages.${key}.best_for`) || []).map((_, idx) => {
        return {
          icon: t(`home.packages.${key}.best_for.${idx}.icon`),
          text: t(`home.packages.${key}.best_for.${idx}.text`)
        }
      }),
      includes: (tm(`home.packages.${key}.includes`) || []).map(item => rt(item)),
      cta: { 
        text: name.includes('SOLO') ? t('home.packages.reserve_slot') : 
              name.includes('COMPLETE') ? t('home.packages.request_fixed_quote') : 
              t('home.packages.get_instant_quote'), 
        link: '/contact' 
      }
    }
  }

  return [
    resolvePkg('package1', '🚐'),
    resolvePkg('package2', '📦'),
    resolvePkg('package3', '🏠'),
    resolvePkg('package4', '🌍'),
  ]
})

const resolvedAddons = computed(() => {
  const list = tm('home.packages.optional_addons_list')
  return Array.isArray(list) ? list.map(item => rt(item)) : []
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 dark:bg-slate-800 rounded-full;
}
</style>

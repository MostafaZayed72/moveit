<template>
  <div class="space-y-12">
    <!-- Pricing Grid/Slider Container -->
    <div class="relative group">
      <!-- Gradient Blobs for background depth -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style="animation-delay: 2s"></div>

      <!-- Slider on Mobile, Grid on Desktop -->
      <div class="flex overflow-x-auto pb-12 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-6 lg:overflow-x-visible lg:pb-0 custom-scrollbar">
        <div
          v-for="(pkg, i) in packages"
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

          <div class="p-6 xl:p-8 flex flex-col flex-grow">
            <!-- Header Section -->
            <div class="mb-6">
              <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-inner transition-transform duration-500 group-hover/card:scale-110', pkg.popular ? 'bg-white/20' : 'bg-red-50 dark:bg-red-900/20']">
                {{ pkg.icon }}
              </div>
              <h3 :class="['text-lg font-bold leading-tight mb-3', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">
                {{ pkg.name }}
              </h3>
              <div class="flex items-baseline gap-1">
                <span :class="['text-3xl xl:text-4xl font-black tracking-tight', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">{{ pkg.price }}</span>
                <span :class="['text-sm font-medium', pkg.popular ? 'text-red-100' : 'text-slate-500']">{{ pkg.unit }}</span>
              </div>
              <p :class="['text-[11px] font-bold mt-1 uppercase tracking-wider opacity-70', pkg.popular ? 'text-white' : 'text-slate-400']">{{ $t('home.packages.excl_vat') }}</p>
              
              <div v-if="pkg.note" :class="['mt-2 text-xs font-medium px-2 py-1 rounded-lg inline-block', pkg.popular ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400']">
                {{ pkg.note }}
              </div>
            </div>

            <!-- Content Divider -->
            <div :class="['h-px w-full mb-6', pkg.popular ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800']"></div>

            <!-- Perfect For Section -->
            <div class="mb-6">
              <h4 :class="['text-[11px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-red-500']">
                {{ $t('home.packages.perfect_for') }}
              </h4>
              <ul class="space-y-2">
                <li v-for="item in pkg.perfect_for" :key="item" class="flex items-start gap-2.5">
                  <div :class="['w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', pkg.popular ? 'bg-white' : 'bg-red-500']"></div>
                  <span :class="['text-xs leading-relaxed font-medium', pkg.popular ? 'text-red-50' : 'text-slate-600 dark:text-slate-300']">{{ rt(item) }}</span>
                </li>
              </ul>
            </div>

            <!-- Includes Section -->
            <div class="mb-6">
              <h4 :class="['text-[11px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                {{ $t('home.packages.includes') }}
              </h4>
              <ul class="space-y-2">
                <li v-for="item in pkg.includes" :key="item" class="flex items-start gap-2.5">
                  <svg :class="['w-4 h-4 mt-0.5 shrink-0 transition-transform duration-500 group-hover/card:rotate-12', pkg.popular ? 'text-white' : 'text-green-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                  <span :class="['text-xs leading-relaxed', pkg.popular ? 'text-red-50' : 'text-slate-500 dark:text-slate-400']">{{ rt(item) }}</span>
                </li>
              </ul>
            </div>

            <!-- Addons Section -->
            <div v-if="pkg.addons && pkg.addons.length" class="mb-8 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
              <h4 :class="['text-[10px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-500']">
                {{ $t('home.packages.optional_addons') }}
              </h4>
              <ul class="space-y-1.5">
                <li v-for="item in pkg.addons" :key="item" class="flex items-center gap-2 text-[10px] font-medium">
                  <span :class="['opacity-50', pkg.popular ? 'text-white' : 'text-slate-400']">+</span>
                  <span :class="pkg.popular ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'">{{ rt(item) }}</span>
                </li>
              </ul>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
              <div v-if="pkg.min_booking" :class="['text-[10px] font-bold text-center italic', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                ⏱ {{ $t('home.packages.min_booking', { hours: pkg.min_booking }) }}
              </div>
              
              <a
                :href="pkg.cta.link"
                :class="[
                  'group/btn relative overflow-hidden block w-full text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg',
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

    <!-- Footnotes Section -->
    <div class="max-w-4xl mx-auto pt-10 border-t border-slate-100 dark:border-slate-800 px-6 lg:px-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div class="space-y-3">
          <p class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_vat') }}
          </p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_time') }}
          </p>
          <p class="text-[11px] text-red-600 dark:text-red-400 font-bold flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            🎓 {{ $t('home.packages.footnote_student') }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-center md:justify-end gap-6">
          <div class="flex -space-x-3 overflow-hidden">
            <img v-for="i in 5" :key="i" class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900" :src="`https://i.pravatar.cc/100?u=${i + 10}`" alt="Happy Customer">
          </div>
          <div class="flex flex-col items-center md:items-end">
            <div class="flex text-yellow-400 text-xs mb-1">★★★★★</div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Trusted by 2,500+ happy movers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, rt } = useI18n()

const packages = computed(() => [
  {
    icon: '🚐',
    name: t('home.packages.package1.name'),
    price: t('home.packages.package1.price'),
    unit: t('home.packages.package1.unit'),
    perfect_for: tm('home.packages.package1.perfect_for'),
    includes: tm('home.packages.package1.includes'),
    addons: tm('home.packages.package1.addons'),
    cta: { text: t('home.packages.book_whatsapp'), link: 'https://wa.me/31612345678' }
  },
  {
    icon: '📦',
    name: t('home.packages.package2.name'),
    price: t('home.packages.package2.price'),
    unit: t('home.packages.package2.unit'),
    popular: true,
    min_booking: '2',
    perfect_for: tm('home.packages.package2.perfect_for'),
    includes: tm('home.packages.package2.includes'),
    addons: tm('home.packages.package2.addons'),
    cta: { text: t('home.packages.get_instant_quote'), link: '/contact' }
  },
  {
    icon: '🏠',
    name: t('home.packages.package3.name'),
    price: t('home.packages.package3.price'),
    unit: t('home.packages.package3.unit'),
    perfect_for: tm('home.packages.package3.perfect_for'),
    includes: tm('home.packages.package3.includes'),
    addons: tm('home.packages.package3.addons'),
    cta: { text: t('home.packages.reserve_slot'), link: '/contact' }
  },
  {
    icon: '🌍',
    name: t('home.packages.package4.name'),
    price: t('home.packages.package4.price'),
    unit: '',
    note: t('home.packages.package4.note'),
    perfect_for: tm('home.packages.package4.perfect_for'),
    includes: tm('home.packages.package4.includes'),
    addons: tm('home.packages.package4.addons'),
    cta: { text: t('home.packages.request_fixed_quote'), link: '/contact' }
  },
])
</script>

<style scoped>
.premium-card {
  @apply bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800;
}

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

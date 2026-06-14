<template>
  <div class="space-y-12">
    <!-- Pricing Grid -->
    <div class="relative z-10">
      <!-- Background glows -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style="animation-delay: 2s"></div>

      <!-- Grid: Slider on Mobile, Grid on Desktop -->
      <div class="flex overflow-x-auto pt-6 pb-8 gap-5 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-3 xl:gap-4 lg:overflow-x-visible lg:pt-8 lg:pb-0 custom-scrollbar">
        <div
          v-for="(pkg, i) in resolvedPackages"
          :key="i"
          :class="[
            'relative rounded-[2.5rem] p-1 transition-all duration-700 hover:-translate-y-3 flex flex-col group/card snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-full',
            pkg.popular
              ? 'bg-gradient-to-b from-red-600 to-red-700 text-white shadow-[0_20px_50px_rgba(191,33,29,0.25)] z-10 scale-[1.02] lg:scale-[1.05]'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl'
          ]"
          data-aos="fade-up"
          :data-aos-delay="i * 100"
        >
          <!-- Popular Ribbon -->
          <div v-if="pkg.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl whitespace-nowrap z-20">
            {{ $t('home.packages.most_popular') }}
          </div>

          <div class="p-6 xl:p-7 flex flex-col flex-grow">
            <!-- Header Section -->
            <div class="mb-4">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner transition-transform duration-500 group-hover/card:scale-110', pkg.popular ? 'bg-white/20' : 'bg-red-50 dark:bg-red-900/20 text-[#BF211D]']">
                {{ pkg.icon }}
              </div>
              <span :class="['text-[9px] font-bold uppercase tracking-wider block mb-1', pkg.popular ? 'text-red-100' : 'text-[#BF211D]']">
                {{ pkg.tag }}
              </span>
              <h3 :class="['text-xl font-black leading-tight', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">
                {{ pkg.name }}
              </h3>
              
              <p :class="['text-xs mt-2 font-medium leading-relaxed min-h-[40px]', pkg.popular ? 'text-red-100/80' : 'text-slate-500 dark:text-slate-400']">
                {{ pkg.description }}
              </p>

              <div class="flex items-baseline gap-1 mt-4">
                <span :class="[pkg.price.length > 8 ? 'text-xl md:text-2xl xl:text-3xl' : 'text-3xl xl:text-4xl', 'font-black tracking-tight', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">{{ pkg.price }}</span>
                <span :class="['text-sm font-medium', pkg.popular ? 'text-red-100' : 'text-slate-500']">{{ pkg.unit }}</span>
              </div>
              <p :class="['text-[9px] font-bold mt-0.5 uppercase tracking-wider opacity-60', pkg.popular ? 'text-white' : 'text-slate-400']">{{ $t('home.packages.excl_vat') }}</p>
            </div>

            <!-- Content Divider -->
            <div :class="['h-px w-full mb-4', pkg.popular ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800']"></div>

            <!-- Best For Section (Iconized) -->
            <div class="mb-6" v-if="pkg.best_for && pkg.best_for.length > 0">
              <h4 :class="['text-[9px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                {{ $t('home.packages.perfect_for') }}
              </h4>
              <!-- Fixed height container for alignment (1 row of icons) -->
              <div class="flex flex-wrap gap-2.5 min-h-[48px] content-start">
                <div v-for="(item, idx) in pkg.best_for" :key="idx" class="group/icon relative">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 cursor-help', pkg.popular ? 'bg-white/20 text-white hover:bg-white hover:text-red-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-100 dark:border-slate-700 hover:bg-[#BF211D] hover:text-white hover:scale-110 shadow-sm']">
                    {{ item.icon }}
                  </div>
                  <!-- Hover Tooltip -->
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 translate-y-1 pointer-events-none group-hover/icon:opacity-100 group-hover/icon:translate-y-0 transition-all duration-300 whitespace-nowrap z-50 shadow-md">
                    {{ item.text }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Includes Section -->
            <div class="mb-6 flex-grow">
              <h4 :class="['text-[9px] font-black uppercase tracking-widest mb-3', pkg.popular ? 'text-red-100' : 'text-slate-400']">
                {{ $t('home.packages.includes') }}
              </h4>
              <ul class="space-y-2.5">
                <li v-for="item in parsedIncludes(pkg.includes)" :key="item.text" class="flex items-start gap-2.5">
                  <!-- Check Icon -->
                  <div v-if="item.status === 'check'" :class="['w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-transform duration-500 group-hover/card:rotate-12', pkg.popular ? 'bg-white text-[#BF211D]' : 'bg-red-50 dark:bg-red-950 text-[#BF211D]']">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <!-- Cross Icon -->
                  <div v-else :class="['w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-transform duration-500 group-hover/card:rotate-12', pkg.popular ? 'bg-white/20 text-white/60' : 'bg-slate-100 dark:bg-slate-800 text-slate-400']">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <span :class="['text-sm lg:text-[13px] xl:text-sm leading-relaxed font-semibold transition-colors duration-300', item.status === 'cross' ? 'opacity-40 line-through' : (pkg.popular ? 'text-red-50' : 'text-slate-600 dark:text-slate-300')]">
                    {{ item.text }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pt-4 border-t border-white/10">
              <a
                :href="pkg.cta.link"
                :class="[
                  'group/btn relative overflow-hidden block w-full text-center py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg',
                  pkg.popular
                    ? 'bg-white text-[#BF211D] hover:bg-slate-900 hover:text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-red-600 hover:text-white shadow-sm'
                ]"
              >
                <span class="relative z-10">{{ pkg.cta.text }}</span>
                <div v-if="pkg.popular" class="absolute inset-0 bg-slate-900 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 -z-0"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Footnotes Section -->
    <div class="max-w-4xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 px-6 lg:px-0">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center text-center md:text-left">
        <div class="space-y-2">
          <p class="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_vat') }}
          </p>
          <p class="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ $t('home.packages.footnote_time') }}
          </p>
          <p class="text-xs sm:text-[13px] text-red-600 dark:text-red-400 font-bold flex items-center justify-center md:justify-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            🎓 {{ $t('home.packages.footnote_student') }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-center md:justify-end gap-6">
          <div class="flex -space-x-3 overflow-hidden">
            <img v-for="(src, idx) in maleAvatars" :key="idx" class="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md object-cover" :src="src" alt="Happy Customer">
          </div>
          <div class="flex flex-col items-center md:items-end">
            <div class="flex text-yellow-400 text-xs sm:text-sm mb-0.5">★★★★★</div>
            <p class="text-[11px] sm:text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest whitespace-nowrap">Trusted by 2,500+ happy movers</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const { t, tm, rt, locale } = useI18n()

const isNl = computed(() => locale.value === 'nl')

const dbPackages = ref([])
const loading = ref(true)

const fetchPricing = async () => {
  if (!$supabase) {
    loading.value = false
    return
  }
  try {
    const { data: pkgs } = await $supabase
      .from('pricing_packages')
      .select('*')
      .order('sort_order')
    if (pkgs && pkgs.length > 0) {
      dbPackages.value = pkgs
    }

  } catch (err) {
    console.error('Error fetching pricing from Supabase:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPricing()
})

const maleAvatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
  'https://randomuser.me/api/portraits/men/62.jpg',
  'https://randomuser.me/api/portraits/men/82.jpg',
  'https://randomuser.me/api/portraits/men/91.jpg'
]

const parsedIncludes = (includes) => {
  return (includes || []).map(item => {
    let text = item
    let status = 'check'
    if (item.startsWith('✓')) {
      status = 'check'
      text = item.substring(1).trim()
    } else if (item.startsWith('X') || item.startsWith('x')) {
      status = 'cross'
      text = item.substring(1).trim()
    }
    return { text, status }
  })
}

const resolvedPackages = computed(() => {
  if (dbPackages.value.length > 0) {
    return dbPackages.value.map(pkg => {
      const bestForList = isNl.value ? pkg.best_for_nl : pkg.best_for
      
      const tagItem = bestForList?.find(item => item.icon === 'tag')
      const descItem = bestForList?.find(item => item.icon === 'description')
      
      const filteredBestFor = bestForList?.filter(item => item.icon !== 'tag' && item.icon !== 'description') || []

      return {
        icon: pkg.icon,
        tag: tagItem ? tagItem.text : (isNl.value ? 'PAKKET' : 'PACKAGE'),
        name: isNl.value ? pkg.name_nl : pkg.name_en,
        description: descItem ? descItem.text : '',
        price: isNl.value ? pkg.price_nl : pkg.price_en,
        unit: isNl.value ? pkg.unit_nl : pkg.unit_en,
        popular: pkg.popular,
        best_for: filteredBestFor,
        includes: isNl.value ? pkg.includes_nl : pkg.includes_en,
        cta: {
          text: isNl.value ? pkg.cta_text_nl : pkg.cta_text_en,
          link: pkg.cta_link || '/contact'
        }
      }
    })
  }

  const resolvePkg = (key, icon) => {
    const name = t(`home.packages.${key}.name`)
    const bestForList = tm(`home.packages.${key}.best_for`) || []
    
    const resolvedBestFor = bestForList.map((_, idx) => ({
      icon: t(`home.packages.${key}.best_for.${idx}.icon`),
      text: t(`home.packages.${key}.best_for.${idx}.text`)
    }))

    const tagItem = resolvedBestFor.find(item => item.icon === 'tag')
    const descItem = resolvedBestFor.find(item => item.icon === 'description')
    
    const filteredBestFor = resolvedBestFor.filter(item => item.icon !== 'tag' && item.icon !== 'description')

    return {
      icon,
      tag: tagItem ? tagItem.text : (isNl.value ? 'PAKKET' : 'PACKAGE'),
      name,
      description: descItem ? descItem.text : '',
      price: t(`home.packages.${key}.price`),
      unit: t(`home.packages.${key}.unit`),
      popular: key === 'package2',
      best_for: filteredBestFor,
      includes: (tm(`home.packages.${key}.includes`) || []).map(item => rt(item)),
      cta: { 
        text: t(`home.packages.${key}.cta_text`), 
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

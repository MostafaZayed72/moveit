<template>
  <div class="pt-32 pb-24 min-h-screen bg-brand-cream dark:bg-brand-black text-brand-black dark:text-slate-100 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl"></div>
      <div class="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-red-600/3 blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 max-w-7xl relative z-10">
      
      <!-- Page Header -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4" data-aos="fade-down">
        <div class="inline-flex items-center space-x-2 px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
          <span>{{ $t('products.title') }}</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ locale === 'nl' ? 'Verpakkingsmaterialen' : 'Packaging Materials' }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {{ $t('products.subtitle') }}
        </p>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <NuxtLink
          v-for="(product, idx) in products"
          :key="product.id"
          :to="localePath('/products/' + product.slug)"
          class="group glass-panel flex flex-col h-full hover:border-red-500/40 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-red-950/10 hover:scale-[1.02] active:scale-98 transition-all duration-300"
          data-aos="fade-up"
          :data-aos-delay="idx * 50"
        >
          <!-- Product Image Wrapper -->
          <div class="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-center p-6">
            <img 
              v-if="product.image" 
              :src="product.image" 
              :alt="locale === 'nl' ? product.title_nl : product.title_en"
              class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
            <div v-else class="text-slate-500 dark:text-slate-600 text-sm">No image available</div>
            
            <!-- Quick badge -->
            <div class="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-full shadow-md uppercase">
              {{ locale === 'nl' ? 'Huren & Kopen' : 'Rent & Buy' }}
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <h3 class="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-red-500 transition-colors">
                {{ locale === 'nl' ? product.title_nl : product.title_en }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-medium">
                {{ locale === 'nl' ? product.description_nl : product.description_en }}
              </p>
            </div>

            <!-- Price and Action -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900/60 mt-auto">
              <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">{{ $t('products.price') }}</span>
                <span class="text-xl font-black text-slate-900 dark:text-white">€{{ formatPrice(product.price) }}</span>
              </div>
              <div class="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-red-600 group-hover:border-red-500 group-hover:text-white transition-all duration-300">
                <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- No Products State -->
      <div v-else class="text-center py-20 bg-white dark:bg-slate-950/20 rounded-[2.5rem] border border-slate-200 dark:border-slate-900/60 max-w-xl mx-auto space-y-4" data-aos="zoom-in">
        <div class="w-16 h-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-full flex items-center justify-center mx-auto text-2xl">📦</div>
        <p class="text-slate-600 dark:text-slate-400 text-sm font-bold">{{ $t('products.no_products') }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const { locale } = useI18n()
const localePath = useLocalePath()

const products = ref([])

const loadProducts = async () => {
  if (!$supabase) return
  const { data, error } = await $supabase
    .from('products')
    .select('*')
    .order('sort_order')
  
  if (!error && data) {
    products.value = data
  }
}

const formatPrice = (val) => {
  if (!val) return '0.00'
  return Number(val).toFixed(2).replace('.', ',')
}

onMounted(() => {
  loadProducts()
})

useSeoMeta({
  title: locale.value === 'nl' ? 'Verhuismaterialen en Dozen Maastricht | MoveIt' : 'Moving & Packing Materials Maastricht | MoveIt',
  description: locale.value === 'nl' ? 'Koop of huur premium verhuisdozen, noppenfolie en inpakpapier van MoveIt Maastricht. Bescherm uw spullen optimaal.' : 'Buy or rent premium moving boxes, bubble wrap, and packaging materials from MoveIt Maastricht. Ensure the safety of your valuables.'
})
</script>


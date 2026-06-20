<template>
  <div class="pt-32 pb-24 min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl"></div>
      <div class="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-red-600/3 blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 max-w-6xl relative z-10">
      
      <!-- Back Link / Breadcrumbs -->
      <div class="mb-8" data-aos="fade-right">
        <NuxtLink 
          :to="localePath('/products')" 
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider bg-slate-950/40 px-4 py-2 rounded-xl border border-slate-850"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
          {{ $t('products.back_to_products') }}
        </NuxtLink>
      </div>

      <!-- Main Product Area -->
      <div v-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        
        <!-- Left Column: Product Image -->
        <div class="lg:col-span-6 w-full" data-aos="fade-right" data-aos-delay="50">
          <div class="glass-panel bg-slate-950/20 border border-slate-800 rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center p-12 relative group">
            <img 
              v-if="product.image" 
              :src="product.image" 
              :alt="locale === 'nl' ? product.title_nl : product.title_en"
              class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="text-slate-600 text-sm">No image available</div>
          </div>
        </div>

        <!-- Right Column: Product Info & CTA -->
        <div class="lg:col-span-6 space-y-8" data-aos="fade-left" data-aos-delay="100">
          <!-- Tag & Title -->
          <div class="space-y-3">
            <div class="inline-flex items-center space-x-2 px-3 py-1 bg-red-600/10 text-red-500 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span>{{ locale === 'nl' ? 'Premium Kwaliteit' : 'Premium Quality' }}</span>
            </div>
            <h1 class="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {{ locale === 'nl' ? product.title_nl : product.title_en }}
            </h1>
          </div>

          <!-- Price & Tax -->
          <div class="space-y-1">
            <div class="text-3xl md:text-4xl font-black text-white">
              €{{ formatPrice(product.price) }}
            </div>
            <p class="text-xs text-slate-500 font-semibold">{{ $t('products.tax_included') }}</p>
          </div>

          <!-- Availability & Logistics Meta -->
          <div class="p-5 bg-slate-950/30 border border-slate-850 rounded-2xl space-y-3">
            <div class="flex items-center gap-3 text-xs text-slate-300 font-bold">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{{ $t('products.pickup_available') }}</span>
            </div>
            <div class="text-[11px] text-slate-500 font-semibold pl-5">
              {{ $t('products.usually_ready') }}
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
              {{ locale === 'nl' ? 'Aantal' : 'Quantity' }}
            </span>
            <div class="flex items-center bg-slate-950/50 border border-slate-850 rounded-xl px-2 py-1">
              <button 
                @click="quantity = Math.max(1, quantity - 1)"
                class="w-8 h-8 rounded-lg hover:bg-slate-900 flex items-center justify-center font-black text-sm text-slate-400 hover:text-white transition-colors"
              >
                —
              </button>
              <span class="w-12 text-center font-bold text-sm text-white">{{ quantity }}</span>
              <button 
                @click="quantity++"
                class="w-8 h-8 rounded-lg hover:bg-slate-900 flex items-center justify-center font-black text-sm text-slate-400 hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <!-- Buy Now / Order WhatsApp Button -->
            <a 
              :href="whatsappUrl" 
              target="_blank"
              class="relative w-full py-4.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-green-950/20 hover:shadow-green-950/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-3 border border-emerald-500/20 group overflow-hidden"
            >
              <!-- Ambient button glow -->
              <span class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
              
              <!-- WhatsApp Icon SVG -->
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{{ $t('products.order_now') }}</span>
            </a>
          </div>

          <!-- Description Section -->
          <div class="space-y-3 pt-6 border-t border-slate-800">
            <h4 class="text-xs uppercase font-bold text-slate-400 tracking-wider">
              {{ $t('products.description') }}
            </h4>
            <p class="text-slate-300 leading-relaxed font-medium text-sm whitespace-pre-line">
              {{ locale === 'nl' ? product.description_nl : product.description_en }}
            </p>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="py-32 text-center text-slate-500 font-bold text-lg animate-pulse">
        {{ locale === 'nl' ? 'Laden...' : 'Loading...' }}
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-20 bg-slate-950/20 rounded-[2.5rem] border border-slate-900/60 max-w-xl mx-auto space-y-4">
        <div class="w-16 h-16 bg-slate-900 border border-slate-850 rounded-full flex items-center justify-center mx-auto text-2xl">✕</div>
        <p class="text-slate-400 text-sm font-bold">
          {{ locale === 'nl' ? 'Product niet gevonden.' : 'Product not found.' }}
        </p>
      </div>

      <!-- Suggested Products Section -->
      <div v-if="suggestions.length > 0" class="space-y-8 pt-12 border-t border-slate-800" data-aos="fade-up">
        <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">
          {{ $t('products.suggestions_title') }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <NuxtLink
            v-for="sug in suggestions"
            :key="sug.id"
            :to="localePath('/products/' + sug.slug)"
            class="group glass-panel flex flex-col h-full bg-slate-950/30 hover:bg-slate-950/50 border border-slate-850 hover:border-red-500/40 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-red-950/10 hover:scale-[1.01] active:scale-98 transition-all duration-300"
          >
            <div class="relative aspect-square overflow-hidden bg-slate-950/50 border-b border-slate-900/60 flex items-center justify-center p-6">
              <img 
                v-if="sug.image" 
                :src="sug.image" 
                :alt="locale === 'nl' ? sug.title_nl : sug.title_en"
                class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
              />
              <div v-else class="text-slate-600 text-sm">No image</div>
            </div>
            <div class="p-5 flex-grow flex flex-col justify-between space-y-2">
              <h3 class="text-sm font-black text-white group-hover:text-red-500 transition-colors leading-tight">
                {{ locale === 'nl' ? sug.title_nl : sug.title_en }}
              </h3>
              <div class="text-sm font-bold text-red-500 mt-2">
                €{{ formatPrice(sug.price) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const { $supabase } = useNuxtApp()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const requestUrl = useRequestURL()

const product = ref(null)
const suggestions = ref([])
const loading = ref(true)
const quantity = ref(1)

const loadData = async () => {
  if (!$supabase) return
  loading.value = true
  
  const slug = route.params.slug
  
  // 1. Fetch current product
  const { data, error } = await $supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
    
  if (!error && data) {
    product.value = data
    
    // Dynamic SEO Metadata
    useSeoMeta({
      title: `${locale.value === 'nl' ? data.title_nl : data.title_en} | MoveIt Maastricht`,
      description: locale.value === 'nl' ? data.description_nl : data.description_en
    })

    // 2. Fetch suggestions (excluding current product)
    const { data: sugs } = await $supabase
      .from('products')
      .select('*')
      .neq('id', data.id)
      .order('sort_order')
      .limit(4)
      
    if (sugs) {
      suggestions.value = sugs
    }
  } else {
    product.value = null
  }
  
  loading.value = false
}

const formatPrice = (val) => {
  if (!val) return '0.00'
  return Number(val).toFixed(2).replace('.', ',')
}

// Compute the WhatsApp API link
const whatsappUrl = computed(() => {
  if (!product.value) return '#'
  
  // Use product custom WhatsApp number, or fall back to default
  const phone = product.value.whatsapp_number || '31684094271'
  const title = locale.value === 'nl' ? product.value.title_nl : product.value.title_en
  const price = formatPrice(product.value.price)
  const currentUrl = requestUrl.href
  
  // Build message
  const msgTemplate = t('products.whatsapp_message', {
    title: `${quantity.value}x ${title}`,
    price: formatPrice(product.value.price * quantity.value),
    link: currentUrl
  })
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(msgTemplate)}`
})

onMounted(() => {
  loadData()
})

// Watch route changes to load different products dynamically
watch(() => route.params.slug, () => {
  loadData()
})
</script>

<style scoped>
.glass-panel {
  @apply bg-slate-950/50 border border-slate-800/85 rounded-[2.5rem] backdrop-blur-xl shadow-2xl;
}
</style>

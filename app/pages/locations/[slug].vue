<template>
  <div v-if="loadingDb" class="min-h-screen bg-slate-50 dark:bg-brand-black flex flex-col items-center justify-center space-y-4">
    <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-slate-500 dark:text-slate-400 font-bold">Loading location...</p>
  </div>
  <div v-else-if="location" class="min-h-screen bg-slate-50 dark:bg-brand-black">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="location.image" :alt="location.name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-950/80"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-50 dark:to-slate-950"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 text-red-400 text-xs font-black uppercase tracking-widest mb-6 border border-red-500/30 backdrop-blur-sm" data-aos="fade-down">
          Premium Moving Services
        </div>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight" data-aos="fade-up" data-aos-delay="100">
          {{ locData.hero.title }}
        </h1>
        <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
          {{ locData.hero.subtitle }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="300">
          <NuxtLink :to="localePath('/contact')" class="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
            {{ $t('home.get_quote') || 'Get a Free Quote' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Main Content Guide -->
    <section class="py-16">
      <div class="container mx-auto px-6 max-w-7xl">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          <!-- Sticky Sidebar (Table of Contents & CTA) -->
          <aside class="lg:col-span-4 lg:order-2 hidden lg:block">
            <div class="sticky top-28 space-y-8">
              <!-- Table of Contents -->
              <div class="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 class="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">On This Page</h3>
                <nav class="space-y-4">
                  <a href="#introduction" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">1. {{ locData.content.introduction.title }}</a>
                  <a href="#residential" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">2. {{ locData.content.residentialDetails.title }}</a>
                  <a href="#commercial" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">3. {{ locData.content.commercialDetails.title }}</a>
                  <a href="#packing" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">4. {{ locData.content.packingTips.title }}</a>
                  <a href="#insights" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">5. {{ locData.content.localInsights.title }}</a>
                  <a href="#costs" class="block text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium transition-colors">6. {{ locData.content.costFactors.title }}</a>
                </nav>
              </div>

              <!-- CTA Box -->
              <div class="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl border border-slate-800">
                <h3 class="text-2xl font-black mb-4">{{ locale === 'nl' ? 'Direct Verhuizen?' : 'Ready to Move?' }}</h3>
                <p class="text-slate-400 mb-6 leading-relaxed text-sm">
                  {{ locale === 'nl' ? `Vraag een gratis offerte aan voor uw verhuizing in ${location.name}.` : `Get a free quote for your upcoming relocation in ${location.name}.` }}
                </p>
                <NuxtLink :to="localePath('/contact')" class="block w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center transition-colors mb-4">
                  {{ $t('home.get_quote') || 'Get Your Free Quote' }}
                </NuxtLink>
                <a href="tel:+31634837587" class="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div class="font-black">+31 6 34837587</div>
                </a>
              </div>
            </div>
          </aside>

          <!-- Article Content -->
          <article class="lg:col-span-8 lg:order-1 space-y-16 prose prose-lg prose-slate dark:prose-invert max-w-none">
            
            <!-- Introduction -->
            <div id="introduction" class="scroll-mt-32">
              <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.introduction.title }}
              </h2>
              <p v-for="(p, i) in locData.content.introduction.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <img :src="location.images.van" alt="Moving Van" class="w-full h-80 md:h-[400px] object-cover rounded-3xl shadow-2xl my-12" />

            <!-- Residential -->
            <div id="residential" class="scroll-mt-32">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.residentialDetails.title }}
              </h2>
              <p v-for="(p, i) in locData.content.residentialDetails.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <!-- Commercial -->
            <div id="commercial" class="scroll-mt-32">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.commercialDetails.title }}
              </h2>
              <p v-for="(p, i) in locData.content.commercialDetails.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <img :src="location.images.boxes" alt="Moving Boxes" class="w-full h-80 md:h-[400px] object-cover rounded-3xl shadow-2xl my-12" />

            <!-- Packing -->
            <div id="packing" class="scroll-mt-32">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.packingTips.title }}
              </h2>
              <p v-for="(p, i) in locData.content.packingTips.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <!-- Local Insights -->
            <div id="insights" class="scroll-mt-32">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.localInsights.title }}
              </h2>
              <p v-for="(p, i) in locData.content.localInsights.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <img :src="location.images.room" alt="New Room" class="w-full h-80 md:h-[400px] object-cover rounded-3xl shadow-2xl my-12" />

            <!-- Cost Factors -->
            <div id="costs" class="scroll-mt-32">
              <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.costFactors.title }}
              </h2>
              <p v-for="(p, i) in locData.content.costFactors.text" :key="i" class="leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
                {{ p }}
              </p>
            </div>

            <!-- Dynamic Location Sub-sections -->
            <div v-if="dbSections && dbSections.length > 0" class="space-y-16 pt-12 border-t border-slate-200 dark:border-white/5 not-prose">
              <div 
                v-for="(sec, index) in dbSections" 
                :key="sec.id"
                :class="[
                  'flex flex-col lg:flex-row items-center gap-12',
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                ]"
                data-aos="fade-up"
              >
                <!-- Section Image (Optional) -->
                <div v-if="sec.image" class="w-full lg:w-1/2">
                  <div class="h-80 md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5">
                    <img :src="sec.image" class="w-full h-full object-cover" :alt="locale === 'nl' ? sec.title_nl : sec.title_en" />
                  </div>
                </div>
                <!-- Section Content -->
                <div :class="['w-full', sec.image ? 'lg:w-1/2' : 'max-w-3xl mx-auto text-center']">
                  <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                    {{ locale === 'nl' ? sec.title_nl : sec.title_en }}
                  </h2>
                  <div class="text-slate-650 dark:text-slate-350 leading-relaxed text-lg whitespace-pre-line">
                    {{ locale === 'nl' ? sec.content_nl : sec.content_en }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Neighborhoods -->
            <div v-if="locData.content.neighborhoods && locData.content.neighborhoods.length > 0" class="p-8 mt-12 rounded-[2rem] bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.neighborhoodsTitle || 'Neighborhoods Served' }}
              </h3>
              <div class="flex flex-wrap gap-3">
                <span v-for="(hood, idx) in locData.content.neighborhoods" :key="idx" class="px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-sm border border-slate-200 dark:border-slate-700">
                  {{ hood }}
                </span>
              </div>
            </div>

          </article>

        </div>
      </div>
    </section>

  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-black mb-4">Location Not Found</h1>
      <NuxtLink :to="localePath('/locations')" class="text-red-600 hover:underline">View All Locations</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getLocationBySlug } from '~/data/locations'

const { $supabase } = useNuxtApp()
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

const slug = route.params.slug

// DB State
const dbLocation = ref(null)
const dbSections = ref([])
const loadingDb = ref(true)

const fetchDbLocation = async () => {
  if (!$supabase) {
    loadingDb.value = false
    return
  }
  try {
    const { data, error } = await $supabase
      .from('locations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      
    if (data) {
      dbLocation.value = data
      
      // Load custom sub-sections for this location page
      const { data: secs } = await $supabase
        .from('location_sections')
        .select('*')
        .eq('location_id', data.id)
        .order('sort_order')
        
      if (secs) {
        dbSections.value = secs
      }
    }
  } catch (err) {
    console.error('Error fetching location from DB:', err)
  } finally {
    loadingDb.value = false
  }
}

onMounted(() => {
  fetchDbLocation()
})

const staticLocation = getLocationBySlug(slug)

const location = computed(() => {
  if (dbLocation.value) {
    const d = dbLocation.value
    return {
      slug: d.slug,
      name: d.name,
      country: d.country,
      image: d.image || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000',
      images: {
        boxes: d.images_boxes || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        van: d.images_van || 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800',
        room: d.images_room || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
      }
    }
  }
  return staticLocation
})

const locData = computed(() => {
  if (dbLocation.value) {
    const d = dbLocation.value
    const isNl = locale.value === 'nl'
    
    const parseText = (txt) => {
      if (!txt) return []
      return txt.split('\n').map(p => p.trim()).filter(p => p.length > 0)
    }
    
    const parseList = (txt) => {
      if (!txt) return []
      return txt.split(',').map(item => item.trim()).filter(item => item.length > 0)
    }

    const localized = (enVal, nlVal) => {
      return isNl ? (nlVal || enVal) : enVal
    }

    return {
      hero: {
        title: localized(d.hero_title_en, d.hero_title_nl) || `Moving to/from ${d.name}`,
        subtitle: localized(d.hero_subtitle_en, d.hero_subtitle_nl) || `Expert relocation services in ${d.name}`
      },
      seo: {
        title: localized(d.seo_title_en, d.seo_title_nl) || `${d.name} Relocations | MoveIt`,
        description: localized(d.seo_desc_en, d.seo_desc_nl) || `Professional moving company in ${d.name}.`,
        keywords: localized(d.seo_keywords_en, d.seo_keywords_nl) || `moving, ${d.name}`
      },
      content: {
        introduction: {
          title: localized(d.intro_title_en, d.intro_title_nl) || 'Introduction',
          text: parseText(localized(d.intro_text_en, d.intro_text_nl))
        },
        residentialDetails: {
          title: localized(d.residential_title_en, d.residential_title_nl) || 'Residential Relocations',
          text: parseText(localized(d.residential_text_en, d.residential_text_nl))
        },
        commercialDetails: {
          title: localized(d.commercial_title_en, d.commercial_title_nl) || 'Office Removals',
          text: parseText(localized(d.commercial_text_en, d.commercial_text_nl))
        },
        packingTips: {
          title: localized(d.packing_title_en, d.packing_title_nl) || 'Packing Guide',
          text: parseText(localized(d.packing_text_en, d.packing_text_nl))
        },
        localInsights: {
          title: localized(d.insights_title_en, d.insights_title_nl) || 'Local Moving Insights',
          text: parseText(localized(d.insights_text_en, d.insights_text_nl))
        },
        costFactors: {
          title: localized(d.costs_title_en, d.costs_title_nl) || 'Cost Factors',
          text: parseText(localized(d.costs_text_en, d.costs_text_nl))
        },
        neighborhoodsTitle: localized(d.neighborhoods_title_en, d.neighborhoods_title_nl) || 'Neighborhoods Served',
        neighborhoods: parseList(localized(d.neighborhoods_list_en, d.neighborhoods_list_nl))
      }
    }
  }
  
  return staticLocation ? (staticLocation[locale.value] || staticLocation.en) : null
})

// SEO & Structured Data
useSeoMeta({
  title: () => locData.value?.seo?.title || 'Location | MoveIt',
  description: () => locData.value?.seo?.description || 'Location moving services',
  keywords: () => locData.value?.seo?.keywords || 'moving',
  ogTitle: () => locData.value?.seo?.title || 'Location | MoveIt',
  ogDescription: () => locData.value?.seo?.description || 'Location moving services',
  ogImage: () => location.value?.image || '',
  twitterCard: 'summary_large_image',
})

// LocalBusiness / MovingCompany Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!location.value || !locData.value) return '{}'
        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MovingCompany",
          "name": `MoveIt ${location.value.name}`,
          "image": location.value.image,
          "description": locData.value.seo.description,
          "url": `https://moveit.com/locations/${location.value.slug}`,
          "telephone": "+31684094271",
          "priceRange": "$$",
          "areaServed": {
            "@type": "City",
            "name": location.value.name
          }
        })
      })
    }
  ]
})
</script>

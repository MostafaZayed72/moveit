<template>
  <div v-if="location" class="min-h-screen bg-slate-50 dark:bg-slate-950">
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
                <a href="tel:+31682333113" class="flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div class="font-black">+31 6 82 333 113</div>
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

            <!-- Neighborhoods -->
            <div v-if="locData.content.neighborhoods" class="p-8 mt-12 rounded-[2rem] bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">
                {{ locData.content.neighborhoodsTitle }}
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
import { computed } from 'vue'
import { getLocationBySlug } from '~/data/locations'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// Fetch data based on dynamic slug
const slug = route.params.slug
const location = getLocationBySlug(slug)

if (!location) {
  throw createError({ statusCode: 404, statusMessage: 'Location Not Found' })
}

// Compute the localized data (fallback to 'en' if the locale is missing)
const locData = computed(() => {
  return location[locale.value] || location.en
})

// SEO & Structured Data
useSeoMeta({
  title: () => locData.value.seo.title,
  description: () => locData.value.seo.description,
  keywords: () => locData.value.seo.keywords,
  ogTitle: () => locData.value.seo.title,
  ogDescription: () => locData.value.seo.description,
  ogImage: location.image,
  twitterCard: 'summary_large_image',
})

// LocalBusiness / MovingCompany Schema
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MovingCompany",
        "name": `MoveIt ${location.name}`,
        "image": location.image,
        "description": locData.value.seo.description,
        "url": `https://moveit.com/locations/${location.slug}`,
        "telephone": "+31682333113",
        "priceRange": "$$",
        "areaServed": {
          "@type": "City",
          "name": location.name
        }
      }))
    }
  ]
})
</script>

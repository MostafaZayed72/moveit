<template>
  <div class="pt-32">
    <!-- Hero Section -->
    <BaseSection :title="$t('locations.title')" :subtitle="$t('locations.subtitle')">
      <div class="mb-20">
        <CitiesGrid />
      </div>

      <!-- Decorative Content Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-8" data-aos="fade-right">
          <div class="glass-panel p-8 rounded-3xl border-l-8 border-red-600 shadow-xl">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
              {{ $t('locations.regional_title') }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ $t('locations.regional_text') }}
            </p>
          </div>

          <div class="glass-panel p-8 rounded-3xl border-l-8 border-slate-800 dark:border-slate-700 shadow-xl">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
              {{ $t('locations.intl_title') }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ $t('locations.intl_text') }}
            </p>
          </div>
        </div>

        <div class="relative group" data-aos="fade-left">
          <div class="rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-slate-100 dark:ring-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
              alt="International Relocation Map" 
              class="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>
          </div>
          
          <!-- Floating Badge -->
          <div class="absolute -bottom-6 -left-6 md:-left-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl">🇪🇺</div>
              <div>
                <div class="text-sm font-bold text-slate-900 dark:text-white">Pan-European</div>
                <div class="text-xs text-slate-500">Service Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- Call to Action -->
    <div class="bg-slate-950 py-20 mt-20 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-3xl md:text-5xl font-black text-white mb-8">
          Moving to or from one of these cities?
        </h2>
        <NuxtLink :to="localePath('/contact')" class="btn-primary px-10 py-4 text-lg">
          Get Your Free Quote
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

useSeoMeta({
  title: `${t('locations.title')} | MoveIt`,
  description: t('locations.subtitle')
})
</script>

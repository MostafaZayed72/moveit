<template>
  <div class="pt-0 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
    
    <!-- HERO SECTION -->
    <section class="relative min-h-[50vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          :src="heroImage" 
          class="w-full h-full object-cover object-center" 
          :alt="title" 
        />
        <div class="absolute inset-0 bg-slate-950/75 transition-colors duration-300"></div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto px-6 relative z-10 max-w-5xl text-center flex flex-col items-center justify-center pt-28 sm:pt-24" data-aos="fade-up">
        
        <NuxtLink :to="localePath('/services')" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-all text-sm font-bold text-slate-300 mb-4 sm:mb-6 backdrop-blur-md border border-white/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          {{ $t('nav.services') }}
        </NuxtLink>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30 mb-4 sm:mb-8 backdrop-blur-md text-xs sm:text-sm">
          {{ heroBadge }}
        </div>

        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-2xl">
          <span class="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] px-2 pb-1 sm:pb-2">
            {{ $t(serviceId + '_page.hero.title') }}
          </span>
        </h1>
        
        <p class="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md mb-4 sm:mb-6">
          {{ $t(serviceId + '_page.hero.subtitle') }}
        </p>

        <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-12">
          {{ $t(serviceId + '_page.hero.desc') }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <NuxtLink :to="localePath('/contact')" class="w-full sm:w-auto px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1">
            {{ $t(serviceId + '_page.hero.btn_quote') }}
          </NuxtLink>
          <a :href="whatsappLink" target="_blank" class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t(serviceId + '_page.hero.btn_whatsapp') }}
          </a>
        </div>
      </div>
    </section>

    <!-- SECTION 1: WHY CHOOSE US -->
    <section class="py-24 px-6 relative z-20 border-b border-slate-100 dark:border-white/5 transition-colors overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000" 
          class="w-full h-full object-cover object-center" 
          alt="Stacked moving boxes" 
        />
        <div class="absolute inset-0 bg-slate-950/85"></div>
      </div>
      
      <div class="container mx-auto max-w-6xl relative z-10">
        <div class="text-center mb-16 max-w-3xl mx-auto" data-aos="fade-up">
          <h2 class="text-4xl font-black text-white mb-6">{{ $t(serviceId + '_page.section1.title') }}</h2>
          <p class="text-lg text-slate-300 leading-relaxed">
            {{ $t(serviceId + '_page.section1.intro') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, idx) in features" :key="idx" class="p-8 rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-lg group" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="w-16 h-16 rounded-2xl bg-white/10 shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-bold text-white">{{ $t(serviceId + '_page.section1.features.' + feature.key) }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: OUR SERVICES / OFFERINGS -->
    <section class="py-24 px-6 bg-slate-50 dark:bg-slate-950 relative transition-colors">
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="container mx-auto max-w-6xl relative z-10">
        <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-16 text-center" data-aos="fade-up">
          {{ $t(serviceId + '_page.section2.title') }}
        </h2>

        <div class="space-y-12">
          
          <!-- Sub-Service 1 (Large Card - Image Left) -->
          <div class="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img :src="getImage(serviceId, 'sub1')" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :alt="title" />
              <div class="absolute top-4 left-4 bg-red-600 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">
                {{ $t(serviceId + '_page.section2.sub1.tag') }}
              </div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
                {{ $t(serviceId + '_page.section2.sub1.title') }}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                {{ $t(serviceId + '_page.section2.sub1.desc') }}
              </p>
              
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <li v-for="(bullet, i) in getBullets('sub1')" :key="i" class="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">
                  <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  {{ bullet }}
                </li>
              </ul>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">
                  {{ $t(serviceId + '_page.section2.sub1.price') }}
                </div>
                <a :href="whatsappLink" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t(serviceId + '_page.section2.sub1.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Sub-Service 2 (Large Card - Image Right) -->
          <div class="flex flex-col lg:flex-row-reverse bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img :src="getImage(serviceId, 'sub2')" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :alt="title" />
              <div class="absolute top-4 left-4 bg-slate-900 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">
                {{ $t(serviceId + '_page.section2.sub2.tag') }}
              </div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
                {{ $t(serviceId + '_page.section2.sub2.title') }}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                {{ $t(serviceId + '_page.section2.sub2.desc') }}
              </p>
              
              <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
                {{ $t(serviceId + '_page.section2.sub2.extra') }}
              </div>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">
                  {{ $t(serviceId + '_page.section2.sub2.price') }}
                </div>
                <a :href="whatsappLink" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t(serviceId + '_page.section2.sub2.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Sub-Service 3 (Large Card - Image Left) -->
          <div class="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img :src="getImage(serviceId, 'sub3')" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :alt="title" />
              <div class="absolute top-4 left-4 bg-orange-500 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">
                {{ $t(serviceId + '_page.section2.sub3.tag') }}
              </div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
                {{ $t(serviceId + '_page.section2.sub3.title') }}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                {{ $t(serviceId + '_page.section2.sub3.desc') }}
              </p>
              
              <div class="mb-4 sm:mb-6">
                <span class="font-bold text-slate-900 dark:text-white block mb-2 sm:mb-3 text-sm sm:text-base">
                  {{ $t(serviceId + '_page.section2.sub3.extra') }}
                </span>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li v-for="(bullet, i) in getBullets('sub3')" :key="i" class="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                    <span class="text-red-500 font-bold">✓</span> {{ bullet }}
                  </li>
                </ul>
              </div>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">
                  {{ $t(serviceId + '_page.section2.sub3.price') }}
                </div>
                <a :href="whatsappLink" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t(serviceId + '_page.section2.sub3.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Sub-Service 4 & 5 (Small Grid) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Sub-Service 4 -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up">
              <div class="text-4xl mb-6">
                {{ getSmallIcon('sub4') }}
              </div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
                {{ $t(serviceId + '_page.section2.sub4.title') }}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                {{ $t(serviceId + '_page.section2.sub4.desc') }}
              </p>
              <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm font-medium mb-6">
                {{ $t(serviceId + '_page.section2.sub4.extra') }}
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                <span class="font-black text-red-500 text-lg sm:text-xl leading-tight">
                  {{ $t(serviceId + '_page.section2.sub4.price') }}
                </span>
                <a :href="whatsappLink" target="_blank" class="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white rounded-xl font-bold transition-colors text-sm shrink-0">
                  {{ $t(serviceId + '_page.section2.sub4.cta') }} &rarr;
                </a>
              </div>
            </div>

            <!-- Sub-Service 5 -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
              <div class="text-4xl mb-6">
                {{ getSmallIcon('sub5') }}
              </div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">
                {{ $t(serviceId + '_page.section2.sub5.title') }}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                {{ $t(serviceId + '_page.section2.sub5.desc') }}
              </p>
              <div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-sm font-medium mb-6">
                {{ $t(serviceId + '_page.section2.sub5.extra') }}
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                <span class="font-black text-red-500 text-lg sm:text-xl leading-tight">
                  {{ $t(serviceId + '_page.section2.sub5.price') }}
                </span>
                <a :href="whatsappLink" target="_blank" class="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white rounded-xl font-bold transition-colors text-sm shrink-0">
                  {{ $t(serviceId + '_page.section2.sub5.cta') }} &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 3: SAVE MONEY / VALUE PROP -->
    <section class="py-24 px-6 relative z-10 bg-white dark:bg-slate-950 transition-colors">
      <div class="container mx-auto max-w-5xl">
        <div 
          class="bg-gradient-to-br rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden" 
          :class="gradientClass"
          data-aos="zoom-in"
        >
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div class="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div class="lg:w-1/2">
              <div class="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold tracking-wider mb-4 sm:mb-6">
                {{ $t(serviceId + '_page.section3.badge', 'SPECIAL PROMOTION') }}
              </div>
              <h2 class="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">
                {{ $t(serviceId + '_page.section3.title') }}
              </h2>
              <p class="text-red-50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                {{ $t(serviceId + '_page.section3.desc') }}
              </p>
              
              <ul class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li v-for="i in 3" :key="i" class="flex items-center gap-3 font-medium text-sm sm:text-base">
                  <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">{{ i }}</span>
                  {{ getStepText(i) }}
                </li>
              </ul>
              
              <p class="font-bold text-lg sm:text-xl">
                {{ $t(serviceId + '_page.section3.logistics') }}
              </p>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl">
                <h4 class="text-lg sm:text-xl font-black mb-4 sm:mb-6 border-b border-white/20 pb-4">
                  {{ locale === 'ar' ? 'الفوائد والمميزات' : 'Key Benefits' }}
                </h4>
                <div class="space-y-4 sm:space-y-6">
                  <div v-for="(benefit, idx) in getBenefitsList()" :key="idx" class="flex items-center gap-4">
                    <div class="text-2xl sm:text-3xl">
                      {{ getBenefitIcon(idx) }}
                    </div>
                    <div class="font-bold text-sm sm:text-lg">
                      {{ benefit }}
                    </div>
                  </div>
                </div>
                
                <a :href="whatsappLink" target="_blank" class="block w-full text-center py-3 sm:py-4 mt-6 sm:mt-8 bg-white text-slate-900 rounded-xl font-black hover:bg-slate-50 transition-colors shadow-lg text-sm sm:text-base">
                  {{ $t(serviceId + '_page.section3.cta') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: EMOTIONAL BRANDING -->
    <section class="py-24 px-6 relative border-y border-slate-100 dark:border-white/5 text-center transition-colors overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img 
          :src="brandImage" 
          class="w-full h-full object-cover" 
          :alt="title" 
        />
        <div class="absolute inset-0 bg-slate-950/85"></div>
      </div>

      <div class="container mx-auto max-w-4xl relative z-10" data-aos="fade-up">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-8">
          {{ $t(serviceId + '_page.section4.title') }}
        </h2>
        <p class="text-xl text-slate-300 mb-12 leading-relaxed">
          {{ $t(serviceId + '_page.section4.desc1') }}
        </p>
        
        <div class="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 sm:gap-4 mb-12">
          <span v-for="i in 6" :key="i" class="px-3 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/10 border border-white/10 text-white font-bold backdrop-blur-md shadow-lg hover:bg-white/20 transition-all text-center flex items-center justify-center text-xs sm:text-sm md:text-base">
            • {{ getPointText(i) }}
          </span>
        </div>
        
        <p class="text-xl font-medium text-slate-200 max-w-3xl mx-auto leading-relaxed">
          {{ $t(serviceId + '_page.section4.desc2') }}
        </p>
      </div>
    </section>

    <!-- SECTION 5: FAQ -->
    <section class="py-24 px-6 bg-white dark:bg-slate-950 transition-colors">
      <div class="container mx-auto max-w-4xl">
        <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-16 text-center" data-aos="fade-up">
          {{ $t(serviceId + '_page.section5.title') }}
        </h2>
        
        <div class="space-y-6">
          <div v-for="i in 5" :key="i" class="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm" data-aos="fade-up" :data-aos-delay="i * 50">
            <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
              <span class="text-red-500">Q.</span> {{ $t(serviceId + '_page.section5.q' + i) }}
            </h4>
            <p class="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
              {{ $t(serviceId + '_page.section5.a' + i) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="py-24 px-6 bg-slate-900 dark:bg-black text-center relative overflow-hidden transition-colors">
      <!-- Decorative rings -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
      
      <div class="container mx-auto max-w-3xl relative z-10" data-aos="zoom-in">
        <h2 class="text-5xl font-black text-white mb-6">
          {{ $t(serviceId + '_page.cta.title') }}
        </h2>
        <p class="text-xl text-slate-400 mb-12 leading-relaxed">
          {{ $t(serviceId + '_page.cta.desc') }}
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink :to="localePath('/contact')" class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-colors shadow-lg">
            {{ $t(serviceId + '_page.cta.btn_quote') }}
          </NuxtLink>
          <a :href="whatsappLink" target="_blank" class="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-lg transition-colors shadow-lg flex items-center justify-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t(serviceId + '_page.cta.btn_whatsapp') }}
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useSeoMeta } from '#imports'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps({
  serviceId: {
    type: String,
    required: true
  }
})

const localePath = useLocalePath()
const { t, tm, rt } = useI18n()

const title = computed(() => t(`${props.serviceId}_page.hero.title`, 'Moving Service'))

// Service-specific static configurations
const configs = {
  local: {
    heroImage: 'https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🏠 Local Relocation Helper',
    gradientClass: 'from-red-600 to-orange-500',
    brandImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '📦',
    sub5Icon: '⚡',
    features: [
      { icon: '⚡', key: 'fast_response' },
      { icon: '🏠', key: 'local_crew' },
      { icon: '💰', key: 'transparent' },
      { icon: '🛡️', key: 'insured' },
      { icon: '⏱️', key: 'flexible' },
      { icon: '🤝', key: 'friendly' }
    ]
  },
  long_distance: {
    heroImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🚚 National Transit Helper',
    gradientClass: 'from-blue-600 to-indigo-500',
    brandImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🎹',
    sub5Icon: '⚡',
    features: [
      { icon: '🚚', key: 'nl_coverage' },
      { icon: '🔒', key: 'secure_transit' },
      { icon: '🏷️', key: 'flat_rates' },
      { icon: '📱', key: 'gps_tracking' },
      { icon: '👨‍✈️', key: 'vetted_drivers' },
      { icon: '🛡️', key: 'insured' }
    ]
  },
  international: {
    heroImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🌍 Cross-Border Relocation Helper',
    gradientClass: 'from-teal-600 to-emerald-500',
    brandImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '💼',
    sub5Icon: '📋',
    features: [
      { icon: '📋', key: 'customs' },
      { icon: '🇬🇧', key: 'english_coord' },
      { icon: '📦', key: 'secure_packing' },
      { icon: '🌍', key: 'eu_network' },
      { icon: '🚛', key: 'consolidated' },
      { icon: '🛡️', key: 'insured' }
    ]
  },
  full_service: {
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '✨ Premium Relocation Helper',
    gradientClass: 'from-purple-600 to-pink-500',
    brandImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🧹',
    sub5Icon: '📦',
    features: [
      { icon: '✨', key: 'stress_free' },
      { icon: '📦', key: 'packing_included' },
      { icon: '🎁', key: 'free_boxes' },
      { icon: '🛠️', key: 'assembly_included' },
      { icon: '🙋‍♂️', key: 'coordinator' },
      { icon: '🛡️', key: 'full_insurance' }
    ]
  },
  furniture_assembly: {
    heroImage: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🛠️ Professional Assembly Helper',
    gradientClass: 'from-amber-600 to-orange-500',
    brandImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🔄',
    sub5Icon: '🧱',
    features: [
      { icon: '🛠️', key: 'expert_tools' },
      { icon: '🛋️', key: 'all_brands' },
      { icon: '🧱', key: 'secure_anchoring' },
      { icon: '⏱️', key: 'time_saving' },
      { icon: '🧹', key: 'clean_finish' },
      { icon: '🛡️', key: 'workmanship' }
    ]
  },
  packing: {
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '📦 Expert Packing Helper',
    gradientClass: 'from-teal-600 to-indigo-600',
    brandImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🏷️',
    sub5Icon: '🛡️',
    features: [
      { icon: '📦', key: 'expert_packers' },
      { icon: '📜', key: 'premium_materials' },
      { icon: '🏷️', key: 'labeling_system' },
      { icon: '🛡️', key: 'insured_packing' },
      { icon: '⏱️', key: 'flexible_timing' },
      { icon: '✨', key: 'unpacking_support' }
    ]
  },
  lift_rental: {
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🏗️ High-Reach Lift Helper',
    gradientClass: 'from-slate-700 to-red-600',
    brandImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '⏱️',
    sub5Icon: '🏢',
    features: [
      { icon: '🏗️', key: 'high_reach' },
      { icon: '👨‍✈️', key: 'certified_operator' },
      { icon: '🔒', key: 'safety_vetted' },
      { icon: '⚡', key: 'quick_setup' },
      { icon: '📋', key: 'street_permits' },
      { icon: '🛡️', key: 'insured_lift' }
    ]
  },
  piano: {
    heroImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🎹 Delicate Instrument Helper',
    gradientClass: 'from-neutral-800 to-slate-900',
    brandImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🏢',
    sub5Icon: '🛡️',
    features: [
      { icon: '🎹', key: 'specialist_equipment' },
      { icon: '💪', key: 'expert_crew' },
      { icon: '📦', key: 'thick_blankets' },
      { icon: '🔒', key: 'secured_transit' },
      { icon: '🌡️', key: 'temperature_protection' },
      { icon: '🛡️', key: 'insured_piano' }
    ]
  },
  senior: {
    heroImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '❤️ Compassionate Move Helper',
    gradientClass: 'from-rose-500 to-orange-400',
    brandImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🧹',
    sub5Icon: '🤝',
    features: [
      { icon: '❤️', key: 'caring_staff' },
      { icon: '📉', key: 'downsizing_help' },
      { icon: '📦', key: 'full_packing' },
      { icon: '🏠', key: 'furniture_setup' },
      { icon: '🧹', key: 'cleanup_service' },
      { icon: '🛡️', key: 'insured_support' }
    ]
  },
  storage: {
    heroImage: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🔒 Secure Storage Helper',
    gradientClass: 'from-blue-700 to-sky-500',
    brandImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '🎓',
    sub5Icon: '📦',
    features: [
      { icon: '🔒', key: 'secure_facility' },
      { icon: '🌡️', key: 'climate_control' },
      { icon: '📋', key: 'flexible_contracts' },
      { icon: '🚚', key: 'loading_help' },
      { icon: '🔑', key: 'easy_access' },
      { icon: '🛡️', key: 'insured_storage' }
    ]
  },
  clearance: {
    heroImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=2000',
    heroBadge: '🧹 Professional Clearance Helper',
    gradientClass: 'from-emerald-600 to-teal-500',
    brandImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000',
    sub4Icon: '♻️',
    sub5Icon: '✨',
    features: [
      { icon: '🧹', key: 'fast_clearance' },
      { icon: '♻️', key: 'eco_disposal' },
      { icon: '🤝', key: 'donation_sorting' },
      { icon: '✨', key: 'broom_clean' },
      { icon: '💰', key: 'fair_valuation' },
      { icon: '🛡️', key: 'insured_clearance' }
    ]
  }
}

// Sub service offering images mapping
const offeringImages = {
  local: {
    sub1: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  long_distance: {
    sub1: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
  },
  international: {
    sub1: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
  },
  full_service: {
    sub1: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800'
  },
  furniture_assembly: {
    sub1: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=800'
  },
  packing: {
    sub1: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'
  },
  lift_rental: {
    sub1: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
  },
  piano: {
    sub1: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
  },
  senior: {
    sub1: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  storage: {
    sub1: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'
  },
  clearance: {
    sub1: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
    sub2: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    sub3: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'
  }
}

const currentConfig = computed(() => configs[props.serviceId] || configs.local)

const heroImage = computed(() => currentConfig.value.heroImage)
const heroBadge = computed(() => currentConfig.value.heroBadge)
const gradientClass = computed(() => currentConfig.value.gradientClass)
const brandImage = computed(() => currentConfig.value.brandImage)
const features = computed(() => currentConfig.value.features)

const whatsappLink = computed(() => {
  return `https://wa.me/31612345678?text=Hi! I'm interested in your ${title.value} service.`
})

const getImage = (service, subKey) => {
  return offeringImages[service]?.[subKey] || offeringImages.local.sub1
}

const getSmallIcon = (subKey) => {
  if (subKey === 'sub4') return currentConfig.value.sub4Icon
  if (subKey === 'sub5') return currentConfig.value.sub5Icon
  return '📦'
}

const getBullets = (subKey) => {
  const key = `${props.serviceId}_page.section2.${subKey}.bullets`
  const res = tm(key)
  return Array.isArray(res) ? res.map(item => rt(item)) : []
}

const getStepText = (index) => {
  const key = `${props.serviceId}_page.section3.steps`
  const res = tm(key)
  if (Array.isArray(res) && res[index - 1]) {
    return rt(res[index - 1])
  }
  return ''
}

const getBenefitsList = () => {
  const key = `${props.serviceId}_page.section3.benefits`
  const res = tm(key)
  return Array.isArray(res) ? res.map(item => rt(item)) : []
}

const getBenefitIcon = (idx) => {
  const icons = ['💰', '🌳', '📦']
  return icons[idx % icons.length]
}

const getPointText = (index) => {
  const key = `${props.serviceId}_page.section4.points`
  const res = tm(key)
  if (Array.isArray(res) && res[index - 1]) {
    return rt(res[index - 1])
  }
  return ''
}

useSeoMeta({
  title: computed(() => t(`${props.serviceId}_page.seo.title`, `${title.value} | MoveIt Maastricht`)),
  description: computed(() => t(`${props.serviceId}_page.seo.desc`, `Professional ${title.value} in Maastricht`))
})
</script>

<style scoped>
/* Any custom styles here */
</style>

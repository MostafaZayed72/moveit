<template>
  <div class="pt-0 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
    
    <!-- HERO SECTION -->
    <section class="relative min-h-[50vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
          class="w-full h-full object-cover object-center" 
          alt="Student Moving Maastricht" 
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
          🎓 {{ $t('student_page.hero.subtitle').split(' ')[0] || 'Student' }} Relocation Helper
        </div>

        <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-2xl">
          <span class="text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] px-2 pb-1 sm:pb-2">
            {{ $t('student_page.hero.title') }}
          </span>
        </h1>
        
        <p class="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md mb-4 sm:mb-6">
          {{ $t('student_page.hero.subtitle') }}
        </p>

        <p class="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-12">
          {{ $t('student_page.hero.desc') }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <NuxtLink :to="localePath('/contact')" class="w-full sm:w-auto px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1">
            {{ $t('student_page.hero.btn_quote') }}
          </NuxtLink>
          <a href="https://wa.me/31684094271" target="_blank" class="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t('student_page.hero.btn_whatsapp') }}
          </a>
        </div>
      </div>
    </section>

    <!-- SECTION 1: WHY STUDENTS CHOOSE MOVEIT -->
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
          <h2 class="text-4xl font-black text-white mb-6">{{ $t('student_page.section1.title') }}</h2>
          <p class="text-lg text-slate-300 leading-relaxed">
            {{ $t('student_page.section1.intro') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, idx) in features" :key="idx" class="p-8 rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-lg group" data-aos="fade-up" :data-aos-delay="idx * 100">
            <div class="w-16 h-16 rounded-2xl bg-white/10 shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-bold text-white">{{ $t(`student_page.section1.features.${feature.key}`) }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: OUR STUDENT SERVICES -->
    <section class="py-24 px-6 bg-slate-50 dark:bg-slate-950 relative transition-colors">
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="container mx-auto max-w-6xl relative z-10">
        <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-16 text-center" data-aos="fade-up">
          {{ $t('student_page.section2.title') }}
        </h2>

        <div class="space-y-12">
          
          <!-- IKEA Pickup -->
          <div class="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="IKEA Pickup Maastricht" />
              <div class="absolute top-4 left-4 bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-full text-sm shadow-md">🚚 IKEA Service</div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">{{ $t('student_page.section2.ikea.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">{{ $t('student_page.section2.ikea.desc') }}</p>
              
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <li v-for="(item, i) in 4" :key="i" class="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base">
                  <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  {{ $t(`student_page.section2.ikea.includes[${i}]`) }}
                </li>
              </ul>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">{{ $t('student_page.section2.ikea.price') }}</div>
                <a href="https://wa.me/31684094271" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t('student_page.section2.ikea.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Assembly -->
          <div class="flex flex-col lg:flex-row-reverse bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Furniture Assembly Maastricht" />
              <div class="absolute top-4 left-4 bg-slate-900 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">🛠 Assembly</div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">{{ $t('student_page.section2.assembly.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">{{ $t('student_page.section2.assembly.desc') }}</p>
              
              <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
                <span class="text-xl mr-2">🛏️</span> {{ $t('student_page.section2.assembly.supported') }}
              </div>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">{{ $t('student_page.section2.assembly.price') }}</div>
                <a href="https://wa.me/31684094271" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t('student_page.section2.assembly.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Marktplaats -->
          <div class="flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 group" data-aos="fade-up">
            <div class="lg:w-2/5 relative min-h-[300px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Marktplaats Pickup Maastricht" />
              <div class="absolute top-4 left-4 bg-orange-500 text-white font-black px-4 py-1 rounded-full text-sm shadow-md">📦 Marktplaats</div>
            </div>
            <div class="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">{{ $t('student_page.section2.marktplaats.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">{{ $t('student_page.section2.marktplaats.desc') }}</p>
              
              <div class="mb-4 sm:mb-6">
                <span class="font-bold text-slate-900 dark:text-white block mb-2 sm:mb-3 text-sm sm:text-base">{{ $t('student_page.section2.marktplaats.support') }}</span>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li v-for="(item, i) in 4" :key="i" class="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                    <span class="text-red-500 font-bold">✓</span> {{ $t(`student_page.section2.marktplaats.support_list[${i}]`) }}
                  </li>
                </ul>
              </div>

              <div class="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 sm:mb-8">
                {{ $t('student_page.section2.marktplaats.great_for') }}
              </div>
              
              <div class="flex flex-wrap items-center gap-6 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                <div class="text-xl sm:text-2xl font-black text-red-500">{{ $t('student_page.section2.marktplaats.price') }}</div>
                <a href="https://wa.me/31684094271" target="_blank" class="ml-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors text-center w-full sm:w-auto text-sm sm:text-base">
                  {{ $t('student_page.section2.marktplaats.cta') }}
                </a>
              </div>
            </div>
          </div>

          <!-- Bike & Plant Small Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Bike -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up">
              <div class="text-4xl mb-6">🚲</div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $t('student_page.section2.bike.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{{ $t('student_page.section2.bike.desc') }}</p>
              <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm font-medium mb-6">
                {{ $t('student_page.section2.bike.ideal') }}
              </div>
              <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6">
                <span class="font-black text-red-500 text-xl">{{ $t('student_page.section2.bike.price') }}</span>
                <a href="https://wa.me/31684094271" target="_blank" class="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 group">
                  {{ $t('student_page.section2.bike.cta') }} <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            <!-- Plant -->
            <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
              <div class="text-4xl mb-6">🌿</div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">{{ $t('student_page.section2.plant.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{{ $t('student_page.section2.plant.desc') }}</p>
              <div class="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl text-sm font-medium mb-6">
                {{ $t('student_page.section2.plant.includes') }}
              </div>
              <div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6">
                <span class="font-black text-red-500 text-xl">{{ $t('student_page.section2.plant.price') }}</span>
                <a href="https://wa.me/31684094271" target="_blank" class="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 group">
                  {{ $t('student_page.section2.plant.cta') }} <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 3: SAVE MONEY WITH GROUP DELIVERIES -->
    <section class="py-24 px-6 relative z-10 bg-white dark:bg-slate-950 transition-colors">
      <div class="container mx-auto max-w-5xl">
        <div class="bg-gradient-to-br from-red-600 to-orange-500 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden" data-aos="zoom-in">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div class="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div class="lg:w-1/2">
              <div class="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-bold tracking-wider mb-4 sm:mb-6">🤝 GROUP DELIVERIES</div>
              <h2 class="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">{{ $t('student_page.section3.title') }}</h2>
              <p class="text-red-50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">{{ $t('student_page.section3.desc') }}</p>
              
              <ul class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li v-for="i in 3" :key="i" class="flex items-center gap-3 font-medium text-sm sm:text-base">
                  <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">{{ i }}</span>
                  {{ $t(`student_page.section3.steps[${i-1}]`) }}
                </li>
              </ul>
              
              <p class="font-bold text-lg sm:text-xl">{{ $t('student_page.section3.logistics') }}</p>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl">
                <h4 class="text-lg sm:text-xl font-black mb-4 sm:mb-6 border-b border-white/20 pb-4">Benefits</h4>
                <div class="space-y-4 sm:space-y-6">
                  <div class="flex items-center gap-4">
                    <div class="text-2xl sm:text-3xl">💰</div>
                    <div class="font-bold text-sm sm:text-lg">{{ $t('student_page.section3.benefits[0]') }}</div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-2xl sm:text-3xl">🌳</div>
                    <div class="font-bold text-sm sm:text-lg">{{ $t('student_page.section3.benefits[1]') }}</div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-2xl sm:text-3xl">📦</div>
                    <div class="font-bold text-sm sm:text-lg">{{ $t('student_page.section3.benefits[2]') }}</div>
                  </div>
                </div>
                
                <a href="https://wa.me/31684094271" target="_blank" class="block w-full text-center py-3 sm:py-4 mt-6 sm:mt-8 bg-white text-red-600 rounded-xl font-black hover:bg-slate-50 transition-colors shadow-lg text-sm sm:text-base">
                  {{ $t('student_page.section3.cta') }}
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
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=2000" 
          class="w-full h-full object-cover" 
          alt="Cozy student room" 
        />
        <div class="absolute inset-0 bg-slate-950/85"></div>
      </div>

      <div class="container mx-auto max-w-4xl relative z-10" data-aos="fade-up">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-8">{{ $t('student_page.section4.title') }}</h2>
        <p class="text-xl text-slate-300 mb-12 leading-relaxed">
          {{ $t('student_page.section4.desc1') }}
        </p>
        
        <div class="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 sm:gap-4 mb-12">
          <span v-for="i in 6" :key="i" class="px-3 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/10 border border-white/10 text-white font-bold backdrop-blur-md shadow-lg hover:bg-white/20 transition-all text-center flex items-center justify-center text-xs sm:text-sm md:text-base">
            • {{ $t(`student_page.section4.points[${i-1}]`) }}
          </span>
        </div>
        
        <p class="text-xl font-medium text-slate-200 max-w-3xl mx-auto leading-relaxed">
          {{ $t('student_page.section4.desc2') }}
        </p>
      </div>
    </section>

    <!-- SECTION 5: FAQ -->
    <section class="py-24 px-6 bg-white dark:bg-slate-950 transition-colors">
      <div class="container mx-auto max-w-4xl">
        <h2 class="text-4xl font-black text-slate-900 dark:text-white mb-16 text-center" data-aos="fade-up">
          {{ $t('student_page.section5.title') }}
        </h2>
        
        <div class="space-y-6">
          <div v-for="i in 5" :key="i" class="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm" data-aos="fade-up" :data-aos-delay="i * 50">
            <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
              <span class="text-red-500">Q.</span> {{ $t(`student_page.section5.q${i}`) }}
            </h4>
            <p class="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
              {{ $t(`student_page.section5.a${i}`) }}
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
        <h2 class="text-5xl font-black text-white mb-6">{{ $t('student_page.cta.title') }}</h2>
        <p class="text-xl text-slate-400 mb-12 leading-relaxed">
          {{ $t('student_page.cta.desc') }}
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink :to="localePath('/contact')" class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-colors shadow-lg">
            {{ $t('student_page.cta.btn_quote') }}
          </NuxtLink>
          <a href="https://wa.me/31684094271" target="_blank" class="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-lg transition-colors shadow-lg flex items-center justify-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t('student_page.cta.btn_whatsapp') }}
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

const localePath = useLocalePath()
const { t } = useI18n()

const features = [
  { icon: '🎓', key: 'pricing' },
  { icon: '💬', key: 'whatsapp' },
  { icon: '📦', key: 'flexible' },
  { icon: '🌍', key: 'international' },
  { icon: '⚡', key: 'last_minute' },
  { icon: '🛠', key: 'assembly' }
]

useSeoMeta({
  title: computed(() => t('student_page.seo.title')),
  description: computed(() => t('student_page.seo.desc'))
})
</script>

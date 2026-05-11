<template>
  <div class="pt-32">
    <BaseSection :title="$t('locations.title')" :subtitle="$t('locations.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="city in ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven', 'Groningen']" 
            :key="city" 
            class="glass-panel p-6 rounded-2xl flex items-center space-x-4 hover:border-red-500 transition-all cursor-default"
            data-aos="zoom-in"
          >
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-lg font-bold text-white">{{ city }}</span>
          </div>
        </div>
        <div class="relative h-[400px] glass-panel rounded-3xl overflow-hidden" data-aos="fade-left">
          <!-- Placeholder for Map -->
          <div class="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              <div class="text-slate-400 font-bold uppercase tracking-widest">Interactive Map Placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

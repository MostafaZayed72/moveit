<template>
  <div class="py-12 bg-slate-900 overflow-hidden relative border-y border-white/5">
    <!-- Header -->
    <div class="container mx-auto px-6 mb-8 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{{ $t('about.values_title') }}</h2>
      </div>
      <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">“{{ $t('home.hero_title').split('.')[0] }}”</p>
    </div>

    <!-- Ticker Container -->
    <div class="relative flex whitespace-nowrap overflow-hidden group">
      <div class="flex animate-marquee gap-8 items-center py-4">
        <!-- Original List -->
        <div 
          v-for="(value, i) in resolvedValues" 
          :key="'val-' + i"
          class="flex items-center gap-6 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-red-600 transition-all duration-500 cursor-default group/item shrink-0"
        >
          <div class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg group-hover/item:bg-white group-hover/item:text-red-600 transition-colors">
            {{ i + 1 }}
          </div>
          <div class="flex flex-col">
            <span class="text-white font-black uppercase tracking-wider text-sm">{{ value.title }}</span>
            <span class="text-slate-400 text-[10px] font-medium group-hover/item:text-red-100 transition-colors">{{ value.desc }}</span>
          </div>
        </div>
        
        <!-- Duplicate List for Seamless Loop -->
        <div 
          v-for="(value, i) in resolvedValues" 
          :key="'dup-' + i"
          class="flex items-center gap-6 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-red-600 transition-all duration-500 cursor-default group/item shrink-0"
          aria-hidden="true"
        >
          <div class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg group-hover/item:bg-white group-hover/item:text-red-600 transition-colors">
            {{ i + 1 }}
          </div>
          <div class="flex flex-col">
            <span class="text-white font-black uppercase tracking-wider text-sm">{{ value.title }}</span>
            <span class="text-slate-400 text-[10px] font-medium group-hover/item:text-red-100 transition-colors">{{ value.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { tm, rt } = useI18n()

const resolvedValues = computed(() => {
  const list = tm('about.values_list')
  return Array.isArray(list) ? list.map(item => ({
    title: rt(item.title),
    desc: rt(item.desc)
  })) : []
})
</script>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  animation: marquee 50s linear infinite;
  width: max-content;
}

.group:hover .animate-marquee {
  animation-play-state: paused;
}
</style>

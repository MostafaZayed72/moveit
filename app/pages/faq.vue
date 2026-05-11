<template>
  <div class="pt-32">
    <BaseSection :title="$t('faq.title')" subtitle="Everything you need to know about your upcoming move.">
      <div class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="i in 3" 
          :key="i" 
          class="premium-card !p-0 overflow-hidden"
          data-aos="fade-up"
          :data-aos-delay="i * 100"
        >
          <button 
            @click="activeTab === i ? activeTab = null : activeTab = i"
            class="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <span class="text-xl font-bold text-white">{{ $t(`faq.q${i}`) }}</span>
            <svg 
              :class="['w-6 h-6 transition-transform duration-300 text-red-500', activeTab === i ? 'rotate-180' : '']" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="activeTab === i" class="px-8 pb-8 text-slate-400 leading-relaxed">
              {{ $t(`faq.a${i}`) }}
            </div>
          </Transition>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const activeTab = ref(1)
</script>

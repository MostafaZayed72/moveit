<template>
  <div class="pt-32">
    <BaseSection :title="$t('about.title')" :subtitle="$t('about.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div data-aos="fade-right">
          <p class="text-xl text-slate-400 leading-relaxed mb-8">
            {{ $t('about.content_p1') }}
          </p>
          <div class="space-y-8">
            <div class="glass-panel p-8 rounded-2xl border-l-4 border-red-500">
              <h3 class="text-2xl font-bold text-white mb-2">{{ $t('about.mission') }}</h3>
              <p class="text-slate-400">{{ $t('about.mission_text') }}</p>
            </div>
          </div>
        </div>
        <div class="relative" data-aos="fade-left">
          <div class="rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000" alt="Team" class="w-full h-auto" />
          </div>
          <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-center p-6 shadow-2xl animate-spin-slow">
            10+ YEARS EXPERIENCE
          </div>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

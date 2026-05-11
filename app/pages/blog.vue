<template>
  <div class="pt-32">
    <BaseSection :title="$t('blog.title')" :subtitle="$t('blog.subtitle')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="i in 6" 
          :key="i" 
          class="premium-card !p-0 group cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="i * 50"
        >
          <div class="h-64 rounded-t-3xl overflow-hidden relative">
            <img :src="`https://images.unsplash.com/photo-${1510000000000 + i * 10000}?auto=format&fit=crop&q=80&w=800`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Blog" />
            <div class="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">Moving Tips</div>
          </div>
          <div class="p-8">
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">May 10, 2024 • 5 min read</div>
            <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">10 Tips for a Stress-Free Relocation</h3>
            <p class="text-slate-400 mb-6 line-clamp-2">
              Discover how to organize your move effectively and avoid common pitfalls during your next big transition.
            </p>
            <div class="flex items-center space-x-2 text-red-500 font-bold group-hover:space-x-4 transition-all">
              <span>{{ $t('blog.read_more') }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>
        </article>
      </div>
    </BaseSection>
  </div>
</template>

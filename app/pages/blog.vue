<template>
  <div class="pt-32">
    <BaseSection :title="$t('blog.title')" :subtitle="$t('blog.subtitle')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="(post, index) in blogPosts" 
          :key="index" 
          class="premium-card !p-0 group cursor-pointer"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
        >
          <div class="h-64 rounded-t-3xl overflow-hidden relative">
            <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :alt="post.title" />
            <div class="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">{{ post.category }}</div>
          </div>
          <div class="p-8">
            <div class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{{ post.date }} • {{ post.readTime }}</div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{{ post.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
              {{ post.desc }}
            </p>
            <div class="flex items-center space-x-2 text-red-600 dark:text-red-500 font-bold group-hover:space-x-4 transition-all">
              <span>{{ $t('blog.read_more') }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>
        </article>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const blogPosts = [
  {
    title: '10 Tips for a Stress-Free Relocation',
    desc: 'Discover how to organize your move effectively and avoid common pitfalls during your next big transition.',
    category: 'Moving Tips',
    date: 'May 10, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'How to Pack Fragile Items Securely',
    desc: 'Learn the best techniques and materials to ensure your delicate valuables survive the journey intact.',
    category: 'Packing Guide',
    date: 'May 05, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Planning a Cross-Border Move in Europe',
    desc: 'Everything you need to know about customs, regulations, and logistics when moving to a neighboring country.',
    category: 'International',
    date: 'April 28, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Minimizing Downtime During Office Relocation',
    desc: 'A comprehensive checklist for business owners planning to move their office to a new location.',
    category: 'Business',
    date: 'April 15, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Choosing the Right Storage Facility',
    desc: 'Not all storage units are created equal. Heres what to look for when you need temporary space for your belongings.',
    category: 'Storage',
    date: 'April 02, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'The Ultimate Moving Day Survival Kit',
    desc: 'Pack these essential items in a separate box to ensure your first night in the new home is comfortable.',
    category: 'Checklists',
    date: 'March 20, 2024',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  }
]
</script>

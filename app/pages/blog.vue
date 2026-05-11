<template>
  <div class="pt-32">
    <BaseSection :title="$t('blog.title')" :subtitle="$t('blog.subtitle')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="(post, index) in translatedPosts" 
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
const { tm, rt } = useI18n()

const blogImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
]

const translatedPosts = computed(() => {
  const posts = tm('blog.posts')
  return posts.map((post, index) => ({
    title: rt(post.title),
    desc: rt(post.desc),
    category: rt(post.category),
    date: rt(post.date),
    readTime: rt(post.readTime),
    image: blogImages[index]
  }))
})
</script>

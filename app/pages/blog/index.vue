<template>
  <div class="pt-32">
    <BaseSection :title="$t('blog.title')" :subtitle="$t('blog.subtitle')">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink 
          v-for="(post, index) in paginatedPosts" 
          :key="index" 
          :to="post.slug ? localePath('/blog/' + post.slug) : '#'"
          :class="[
            'premium-card !p-0 group block border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300',
            !post.slug && 'pointer-events-none'
          ]"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
        >
          <div class="h-64 overflow-hidden relative bg-slate-100 dark:bg-slate-900">
            <img 
              v-if="post.image" 
              :src="post.image" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              :alt="post.title" 
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
              🖼️ No Image
            </div>
            <div class="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">{{ post.category }}</div>
          </div>
          <div class="p-8">
            <div class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{{ post.date }} • {{ post.readTime }}</div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{{ post.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
              {{ post.desc }}
            </p>
            <div v-if="post.slug" class="flex items-center space-x-2 text-red-600 dark:text-red-500 font-bold group-hover:space-x-4 transition-all">
              <span>{{ $t('blog.read_more') }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination for Blog Posts on Frontend -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-12">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          ◀ Previous
        </button>
        <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          Next ▶
        </button>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { $supabase } = useNuxtApp()
const localePath = useLocalePath()
const { tm, rt, locale } = useI18n()

const blogImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
]

const dbPosts = ref([])

// Pagination Setup
const currentPage = ref(1)
const postsPerPage = 10

const fetchPosts = async () => {
  if (!$supabase) return
  try {
    const { data, error } = await $supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Failed to load blog posts from Supabase:', error.message)
      return
    }
    if (data) {
      dbPosts.value = data
    }
  } catch (err) {
    console.error('Error fetching blog posts:', err)
  }
}

onMounted(() => {
  fetchPosts()
})

const translatedPosts = computed(() => {
  const isNl = locale.value === 'nl'
  
  if (dbPosts.value.length > 0) {
    return dbPosts.value.map((post, index) => {
      const title = isNl ? post.title_nl : post.title_en
      const desc = isNl ? post.desc_nl : post.desc_en
      const category = isNl ? post.category_nl : post.category_en
      const readTime = isNl ? post.read_time_nl : post.read_time_en
      
      return {
        slug: post.slug,
        title,
        desc,
        category,
        date: post.date || new Date(post.created_at).toLocaleDateString(isNl ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: readTime || (isNl ? '5 min leestijd' : '5 min read'),
        image: post.image || blogImages[index % blogImages.length]
      }
    })
  }

  // Fallback to static JSON translations
  const posts = tm('blog.posts')
  if (!Array.isArray(posts)) return []
  return posts.map((post, index) => ({
    slug: '',
    title: rt(post.title),
    desc: rt(post.desc),
    category: rt(post.category),
    date: rt(post.date),
    readTime: rt(post.readTime),
    image: blogImages[index % blogImages.length]
  }))
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  return translatedPosts.value.slice(start, start + postsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(translatedPosts.value.length / postsPerPage) || 1
})
</script>

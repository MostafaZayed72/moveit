<template>
  <div class="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
      <div class="absolute top-2/3 -right-40 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 max-w-4xl relative z-10">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4" data-aos="fade-up">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-500 dark:text-slate-400 font-bold">Loading article...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg || !post" class="text-center py-32 space-y-6" data-aos="fade-up">
        <div class="text-5xl">⚠️</div>
        <h2 class="text-3xl font-black">{{ isNl ? 'لم يتم العثور على المقال' : 'Article Not Found' }}</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {{ isNl ? 'المقال الذي تبحث عنه قد يكون تم حذفه أو غير موجود.' : 'The article you are looking for does not exist or has been removed.' }}
        </p>
        <NuxtLink 
          :to="localePath('/blog')" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all shadow-lg shadow-red-500/20"
        >
          &larr; {{ isNl ? 'العودة للمدونة' : 'Back to Blog' }}
        </NuxtLink>
      </div>

      <!-- Post Content -->
      <div v-else class="space-y-8" data-aos="fade-up">
        <!-- Back Button -->
        <NuxtLink 
          :to="localePath('/blog')" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-900/50 hover:bg-red-500 hover:text-white transition-all text-sm font-bold text-slate-700 dark:text-slate-300 backdrop-blur-md border border-slate-200 dark:border-white/5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          {{ isNl ? 'العودة للمدونة' : 'Back to Blog' }}
        </NuxtLink>

        <!-- Category & Read Time Info -->
        <div class="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <span class="px-3 py-1 bg-red-600 text-white rounded-full">{{ currentCategory }}</span>
          <span>{{ formattedDate }}</span>
          <span>•</span>
          <span>{{ currentReadTime }}</span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
          {{ currentTitle }}
        </h1>

        <!-- Short Description -->
        <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 border-l-4 border-red-600 pl-4 py-1 italic leading-relaxed">
          {{ currentDesc }}
        </p>

        <!-- Cover Image -->
        <div class="h-[40vh] md:h-[50vh] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5">
          <img 
            v-if="post.image" 
            :src="post.image" 
            class="w-full h-full object-cover" 
            :alt="currentTitle" 
          />
          <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600">
            No Image
          </div>
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none pt-8 border-t border-slate-200 dark:border-white/5">
          <div 
            v-html="renderedContent" 
            class="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg"
          ></div>
        </div>

        <!-- Dynamic Blog Sub-sections -->
        <div v-if="dbSections && dbSections.length > 0" class="space-y-16 pt-12 border-t border-slate-200 dark:border-white/5">
          <div 
            v-for="(sec, index) in dbSections" 
            :key="sec.id"
            :class="[
              'flex flex-col lg:flex-row items-center gap-12',
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            ]"
            data-aos="fade-up"
          >
            <!-- Section Image (Optional) -->
            <div v-if="sec.image" class="w-full lg:w-1/2">
              <div class="h-80 md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5">
                <img :src="sec.image" class="w-full h-full object-cover" :alt="isNl ? sec.title_nl : sec.title_en" />
              </div>
            </div>
            <!-- Section Content -->
            <div :class="['w-full', sec.image ? 'lg:w-1/2' : 'max-w-3xl mx-auto text-center']">
              <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                {{ isNl ? sec.title_nl : sec.title_en }}
              </h2>
              <div class="text-slate-650 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {{ isNl ? sec.content_nl : sec.content_en }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

const loading = ref(true)
const post = ref(null)
const dbSections = ref([])
const errorMsg = ref('')

const isNl = computed(() => locale.value === 'nl')

const currentTitle = computed(() => {
  if (!post.value) return ''
  return isNl.value ? post.value.title_nl : post.value.title_en
})

const currentDesc = computed(() => {
  if (!post.value) return ''
  return isNl.value ? post.value.desc_nl : post.value.desc_en
})

const currentCategory = computed(() => {
  if (!post.value) return ''
  return isNl.value ? post.value.category_nl : post.value.category_en
})

const currentReadTime = computed(() => {
  if (!post.value) return ''
  return isNl.value ? post.value.read_time_nl : post.value.read_time_en
})

const formattedDate = computed(() => {
  if (!post.value) return ''
  return post.value.date || new Date(post.value.created_at).toLocaleDateString(isNl.value ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  const content = isNl.value ? post.value.content_nl : post.value.content_en
  
  // Basic markdown to html replacement (for simple paragraphs, strong text, and lists)
  if (!content) return ''
  
  // If it's already HTML (contains tags), return it directly. Otherwise, do basic formatting.
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content
  }
  
  return content
    .split('\n\n')
    .map(para => {
      // Bold syntax (**text**)
      let formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet lists
      if (formatted.trim().startsWith('- ')) {
        const items = formatted.split('\n').map(li => `<li>${li.replace('- ', '').trim()}</li>`).join('')
        return `<ul class="list-disc pl-6 space-y-2 my-4">${items}</ul>`
      }
      return `<p class="mb-4">${formatted}</p>`
    })
    .join('')
})

const fetchPostDetails = async () => {
  if (!$supabase) {
    errorMsg.value = 'Supabase client not loaded.'
    loading.value = false
    return
  }

  const slug = route.params.slug
  try {
    const { data, error } = await $supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      errorMsg.value = 'Article not found.'
    } else {
      post.value = data
      
      // Load custom sections for this blog post
      const { data: secs } = await $supabase
        .from('blog_sections')
        .select('*')
        .eq('blog_id', data.id)
        .order('sort_order')
        
      if (secs) {
        dbSections.value = secs
      }
    }
  } catch (err) {
    console.error('Error fetching blog post details:', err)
    errorMsg.value = 'Failed to load article.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPostDetails()
})
</script>

<style scoped>
/* styled class overlays for dynamic rendering of v-html */
:deep(h2) {
  @apply text-3xl font-black text-slate-900 dark:text-white mt-10 mb-4 tracking-tight;
}
:deep(h3) {
  @apply text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3;
}
:deep(p) {
  @apply text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-lg;
}
:deep(ul), :deep(ol) {
  @apply my-6 pl-6 space-y-3;
}
:deep(li) {
  @apply text-slate-700 dark:text-slate-300 text-lg;
}
:deep(strong) {
  @apply font-black text-slate-900 dark:text-white;
}
:deep(blockquote) {
  @apply pl-6 border-l-4 border-red-600 italic text-slate-500 dark:text-slate-400 my-8;
}
</style>

<template>
  <div class="pt-32">
    <BaseSection :title="$t('referral_program.title')" :subtitle="$t('referral_program.subtitle')">
      
      <!-- Hero / Introduction -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
        <div data-aos="fade-right">
          <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {{ $t('referral_program.desc') }}
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-red-500 text-center">
              <div class="text-4xl mb-4">1</div>
              <h4 class="font-bold text-slate-900 dark:text-white mb-2">{{ $t('referral_program.how_it_works.step1_title') }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ $t('referral_program.how_it_works.step1_desc') }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-red-500 text-center">
              <div class="text-4xl mb-4">2</div>
              <h4 class="font-bold text-slate-900 dark:text-white mb-2">{{ $t('referral_program.how_it_works.step2_title') }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ $t('referral_program.how_it_works.step2_desc') }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500 text-center">
              <div class="text-4xl mb-4">3</div>
              <h4 class="font-bold text-slate-900 dark:text-white mb-2">{{ $t('referral_program.how_it_works.step3_title') }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ $t('referral_program.how_it_works.step3_desc') }}</p>
            </div>
          </div>
        </div>
        <div data-aos="fade-left" class="relative">
          <div class="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent rounded-[3rem] blur-3xl transform rotate-3"></div>
          <img src="/images/referral_hero_men.png" alt="Referral Program" class="relative rounded-[3rem] shadow-2xl w-full object-cover aspect-square border border-white/10" />
        </div>
      </div>

      <!-- Referral Form -->
      <div class="max-w-3xl mx-auto glass-panel p-10 rounded-3xl" data-aos="fade-up">
        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">{{ $t('referral_program.form.title') }}</h3>
        
        <div v-if="submitted" class="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center mb-6 flex flex-col items-center justify-center space-y-4">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="font-medium text-lg">{{ $t('referral_program.form.success_msg') }}</span>
          <button @click="submitted = false; resetForm()" class="mt-4 text-sm underline hover:text-emerald-700 dark:hover:text-emerald-300">Send another invitation</button>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('referral_program.form.name_label') }}</label>
              <input type="text" v-model="form.name" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('referral_program.form.email_label') }}</label>
              <input type="email" v-model="form.email" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('referral_program.form.friend_name_label') }}</label>
              <input type="text" v-model="form.friendName" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('referral_program.form.friend_email_label') }}</label>
              <input type="email" v-model="form.friendEmail" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('referral_program.form.message_label') }}</label>
            <textarea rows="4" v-model="form.message" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none"></textarea>
          </div>
          
          <button type="submit" class="btn-primary w-full py-5 text-lg" :disabled="loading">
            <span v-if="!loading">{{ $t('referral_program.form.submit_btn') }}</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </span>
          </button>
        </form>
      </div>

      <!-- Carousel Section -->
      <div class="mt-32 max-w-6xl mx-auto text-center" data-aos="fade-up">
        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {{ $t('referral_program.carousel.heading') }}
        </h3>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          {{ $t('referral_program.carousel.subheading') }}
        </p>

        <!-- Carousel Slider Wrapper -->
        <div class="relative group px-12">
          <!-- Slider Container -->
          <div 
            ref="carouselContainer"
            class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 scrollbar-none rounded-3xl py-4"
          >
            <div 
              v-for="(img, idx) in carouselImages" 
              :key="idx" 
              class="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
            >
              <div class="relative overflow-hidden rounded-2xl aspect-[4/3] group/item shadow-md border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-900">
                <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span class="text-white font-medium text-sm">{{ img.caption }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <button 
            @click="scrollPrev" 
            class="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all z-10 border border-slate-100 dark:border-slate-800"
            aria-label="Previous slide"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <button 
            @click="scrollNext" 
            class="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all z-10 border border-slate-100 dark:border-slate-800"
            aria-label="Next slide"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <!-- Promo Info Footer -->
        <div class="mt-16 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between text-left gap-6">
          <div class="flex items-center space-x-6">
            <div class="w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white text-lg mb-1">{{ $t('referral_program.carousel.promo_subtext') }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">{{ $t('referral_program.carousel.promo_text') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-32 max-w-4xl mx-auto">
        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">{{ $t('referral_program.faq.title') }}</h3>
        <div class="space-y-6">
          <div v-for="i in 2" :key="i" class="premium-card p-8 group cursor-pointer">
            <h4 class="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-red-500 transition-colors">{{ $t(`referral_program.faq.q${i}`) }}</h4>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ $t(`referral_program.faq.a${i}`) }}</p>
          </div>
        </div>
      </div>

    </BaseSection>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: t('referral_program.seo.title'),
  meta: [
    { name: 'description', content: t('referral_program.seo.desc') }
  ]
})

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  email: '',
  friendName: '',
  friendEmail: '',
  message: ''
})

const resetForm = () => {
  form.friendName = ''
  form.friendEmail = ''
  form.message = ''
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        _subject: `New Referral Program Submission from ${form.name}`,
        _replyto: form.email,
        _template: 'table',
        'Referrer Name': form.name,
        'Referrer Email': form.email,
        'Friend Name': form.friendName,
        'Friend Email': form.friendEmail,
        'Message': form.message || 'None'
      }
    })
    submitted.value = true
  } catch (error) {
    console.error('Error submitting referral:', error)
    alert('Failed to send invitation. Please try again.')
  } finally {
    loading.value = false
  }
}

const carouselContainer = ref(null)

const carouselImages = [
  { src: '/images/carousel_moving_truck.png', alt: 'Premium Moving Truck', caption: 'Our modern, clean moving trucks' },
  { src: '/images/carousel_moving_boxes.png', alt: 'Moving Boxes', caption: 'High-quality, durable boxes for packing' },
  { src: '/images/carousel_hand_truck.png', alt: 'Hand Truck', caption: 'Professional moving equipment' },
  { src: '/images/carousel_empty_room.png', alt: 'Empty Modern Room', caption: 'Your stress-free new beginning' }
]

const scrollNext = () => {
  if (carouselContainer.value) {
    const cardWidth = carouselContainer.value.children[0].offsetWidth + 24 // width + gap
    carouselContainer.value.scrollLeft += cardWidth
  }
}

const scrollPrev = () => {
  if (carouselContainer.value) {
    const cardWidth = carouselContainer.value.children[0].offsetWidth + 24 // width + gap
    carouselContainer.value.scrollLeft -= cardWidth
  }
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

<template>
  <div class="pt-32">
    <BaseSection :title="$t('contact.title')" :subtitle="$t('contact.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div class="glass-panel p-10 rounded-3xl" data-aos="fade-right">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_name') }}</label>
                <input type="text" v-model="name" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_email') }}</label>
                <input type="email" v-model="email" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_phone') }}</label>
              <input type="tel" v-model="phone" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" required />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('home.move_date') }}</label>
                <input type="date" v-model="moveDate" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none cursor-pointer" required />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('home.move_type') }}</label>
                <select v-model="moveType" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none cursor-pointer" required>
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option v-for="option in moveOptions" :key="option.value" :value="option.value">
                    {{ $t(option.key) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_moving_from') }}</label>
                <AddressAutocomplete 
                  v-model="movingFrom" 
                  input-class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" 
                  required 
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_moving_to') }}</label>
                <AddressAutocomplete 
                  v-model="movingTo" 
                  input-class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" 
                  required 
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_message') }}</label>
              <textarea rows="4" v-model="message" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full py-5 text-lg">{{ $t('contact.form_submit') }}</button>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-12" data-aos="fade-left">
          <div>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">{{ $t('contact.direct_info') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {{ $t('contact.direct_desc') }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="i in 2" :key="i" class="premium-card !p-8">
              <div class="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white mb-6">
                <svg v-if="i === 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div class="text-slate-900 dark:text-white font-bold mb-1">{{ i === 1 ? $t('contact.phone') : $t('contact.email') }}</div>
              <div class="text-slate-600 dark:text-slate-400 text-sm">{{ i === 1 ? '+31 6 84094271' : 'info@moveitmaastricht.nl' }}</div>
            </div>
          </div>

          <div class="glass-panel p-8 rounded-3xl border-l-4 border-emerald-500">
            <div class="flex items-center space-x-4 mb-4 text-emerald-500">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="font-bold uppercase tracking-widest text-xs">{{ $t('contact.response_time_title') }}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">{{ $t('contact.response_time_desc_pre') }}<span class="text-slate-900 dark:text-white font-bold">{{ $t('contact.response_time_hours') }}</span>{{ $t('contact.response_time_desc_post') }}</p>
          </div>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()

const name = ref('')
const email = ref('')
const phone = ref('')
const movingFrom = ref('')
const movingTo = ref('')
const moveDate = ref('')
const moveType = ref('')
const message = ref('')

const moveOptions = [
  { value: 'van_only', key: 'home.packages.package1.name' },
  { value: 'van_1', key: 'home.packages.package2.name' },
  { value: 'van_2', key: 'home.packages.package3.name' },
  { value: 'custom', key: 'home.custom_move' }
]

onMounted(() => {
  if (route.query.from) {
    movingFrom.value = String(route.query.from)
  }
  if (route.query.to) {
    movingTo.value = String(route.query.to)
  }
  if (route.query.date) {
    moveDate.value = String(route.query.date)
  }
  if (route.query.type) {
    moveType.value = String(route.query.type)
  }
})

const handleSubmit = () => {
  const typeText = moveType.value ? t(moveOptions.find(o => o.value === moveType.value)?.key || '') : ''
  const text = `Hi MoveIt! I would like to request a quote.
  
Name: ${name.value}
Email: ${email.value}
Phone: ${phone.value}
From: ${movingFrom.value}
To: ${movingTo.value}
Date: ${moveDate.value}
Move Type: ${typeText}
Message: ${message.value}
`
  const whatsappPhone = '31684094271'
  const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>

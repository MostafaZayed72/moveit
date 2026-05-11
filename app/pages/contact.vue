<template>
  <div class="pt-32">
    <BaseSection :title="$t('contact.title')" :subtitle="$t('contact.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div class="glass-panel p-10 rounded-3xl" data-aos="fade-right">
          <form @submit.prevent class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_name') }}</label>
                <input type="text" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_email') }}</label>
                <input type="email" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_phone') }}</label>
              <input type="tel" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ $t('contact.form_message') }}</label>
              <textarea rows="4" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none"></textarea>
            </div>
            <button class="btn-primary w-full py-5 text-lg">{{ $t('contact.form_submit') }}</button>
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
              <div class="text-slate-600 dark:text-slate-400 text-sm">{{ i === 1 ? '+31 20 123 4567' : 'hello@moveit.nl' }}</div>
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

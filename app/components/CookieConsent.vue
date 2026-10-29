<template>
  <div>
    <!-- Bottom Cookie Consent Banner -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-8 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-8 opacity-0"
    >
      <div
        v-if="showBanner"
        class="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-[90] max-w-5xl mx-auto"
      >
        <div class="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 md:p-6 shadow-2xl text-white">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <!-- Icon & Copy -->
            <div class="flex items-start gap-4 flex-1">
              <div class="w-11 h-11 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 mt-0.5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-white">{{ copy.title }}</h3>
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    GDPR / AVG
                  </span>
                </div>
                <p class="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {{ copy.description }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                type="button"
                @click="openPreferences"
                class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                {{ copy.customize }}
              </button>
              <button
                type="button"
                @click="acceptEssentialOnly"
                class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                {{ copy.essentialOnly }}
              </button>
              <button
                type="button"
                @click="acceptAll"
                class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/25 transition-all cursor-pointer flex-1 sm:flex-none text-center"
              >
                {{ copy.acceptAll }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Preferences Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showPreferencesModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
        @click.self="showPreferencesModal = false"
      >
        <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white space-y-5 overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold">{{ copy.modalTitle }}</h3>
                <p class="text-xs text-slate-400">{{ copy.modalSubtitle }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="showPreferencesModal = false"
              class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Cookie Categories -->
          <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <!-- 1. Essential & Functional -->
            <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-white">{{ copy.essentialTitle }}</span>
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">{{ copy.alwaysActive }}</span>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">{{ copy.essentialDesc }}</p>
              </div>
              <input type="checkbox" checked disabled class="mt-1 w-4 h-4 accent-red-600 rounded opacity-60" />
            </div>

            <!-- 2. Preferences & Quote Form Memory -->
            <label class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4 cursor-pointer hover:border-slate-600 transition-colors">
              <div class="space-y-1">
                <span class="text-sm font-bold text-white block">{{ copy.functionalTitle }}</span>
                <p class="text-xs text-slate-400 leading-relaxed">{{ copy.functionalDesc }}</p>
              </div>
              <input v-model="preferences.functional" type="checkbox" class="mt-1 w-4 h-4 accent-red-600 rounded cursor-pointer" />
            </label>

            <!-- 3. Analytics (GA4 & GTM) -->
            <label class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4 cursor-pointer hover:border-slate-600 transition-colors">
              <div class="space-y-1">
                <span class="text-sm font-bold text-white block">{{ copy.analyticsTitle }}</span>
                <p class="text-xs text-slate-400 leading-relaxed">{{ copy.analyticsDesc }}</p>
              </div>
              <input v-model="preferences.analytics" type="checkbox" class="mt-1 w-4 h-4 accent-red-600 rounded cursor-pointer" />
            </label>

            <!-- 4. Marketing & Lead Attribution -->
            <label class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between gap-4 cursor-pointer hover:border-slate-600 transition-colors">
              <div class="space-y-1">
                <span class="text-sm font-bold text-white block">{{ copy.marketingTitle }}</span>
                <p class="text-xs text-slate-400 leading-relaxed">{{ copy.marketingDesc }}</p>
              </div>
              <input v-model="preferences.marketing" type="checkbox" class="mt-1 w-4 h-4 accent-red-600 rounded cursor-pointer" />
            </label>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="acceptEssentialOnly"
              class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {{ copy.essentialOnly }}
            </button>
            <button
              type="button"
              @click="saveCustomPreferences"
              class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
            >
              {{ copy.savePreferences }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const { locale } = useI18n()

const consentCookie = useCookie<{
  decided: boolean
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
} | null>('moveit_cookie_consent', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax',
  path: '/'
})

const showBanner = ref(false)
const showPreferencesModal = ref(false)

const preferences = reactive({
  functional: true,
  analytics: true,
  marketing: true
})

const copy = computed(() => {
  if (locale.value === 'nl') {
    return {
      title: 'Wij gebruiken cookies om uw verhuiservaring te verbeteren',
      description: 'MoveIt gebruikt cookies om uw offertegegevens tijdelijk te bewaren, taalvoorkeuren te onthouden en websiteverkeer te analyseren volgens de Europese AVG/GDPR-richtlijnen.',
      customize: 'Voorkeuren',
      essentialOnly: 'Alleen noodzakelijk',
      acceptAll: 'Alles accepteren',
      modalTitle: 'Cookie-instellingen beheren',
      modalSubtitle: 'Kies welke cookies u wilt toestaan op MoveIt Maastricht',
      essentialTitle: 'Strikt noodzakelijke cookies',
      alwaysActive: 'Altijd actief',
      essentialDesc: 'Nodig voor de basisfunctionaliteit van de website, veilige inlogsessies (Mijn Verhuizingen) en beveiliging.',
      functionalTitle: 'Functionele & Offerte-opslag cookies',
      functionalDesc: 'Onthoudt uw ingevulde verhuisdatum, adressen en taalvoorkeur zodat u uw aanvraag niet opnieuw hoeft in te vullen.',
      analyticsTitle: 'Analytische cookies (Google Analytics 4)',
      analyticsDesc: 'Helpt ons te begrijpen welke pagina’s het meest bezocht worden en hoe we onze verhuisservice kunnen verbeteren.',
      marketingTitle: 'Marketing & Herkomst cookies (UTM / Ads)',
      marketingDesc: 'Registreert via welk kanaal (Google, Instagram, Facebook of doorverwijzing) u bij ons terecht bent gekomen voor relevante aanbiedingen.',
      savePreferences: 'Voorkeuren opslaan'
    }
  }
  return {
    title: 'We use cookies to improve your moving experience',
    description: 'MoveIt uses cookies to auto-save your quote progress, remember your language & theme preferences, and analyze site performance in compliance with EU GDPR regulations.',
    customize: 'Customize',
    essentialOnly: 'Essential Only',
    acceptAll: 'Accept All',
    modalTitle: 'Manage Cookie Preferences',
    modalSubtitle: 'Control how cookies are used on MoveIt Maastricht',
    essentialTitle: 'Strictly Necessary Cookies',
    alwaysActive: 'Always Active',
    essentialDesc: 'Required for core site security, authentication sessions (My Orders), and privacy consent storage.',
    functionalTitle: 'Functional & Quote Memory Cookies',
    functionalDesc: 'Remembers your entered moving addresses, preferred move date, language, and dark/light mode so you never lose your form progress.',
    analyticsTitle: 'Analytics & Performance (GA4)',
    analyticsDesc: 'Helps us measure website traffic, popular moving routes, and improve booking speed.',
    marketingTitle: 'Marketing & Lead Attribution (UTM / Ads)',
    marketingDesc: 'Tracks which campaign or platform (Google, Instagram, Facebook, Referral) brought you to MoveIt so we can measure campaign ROI in our CRM.',
    savePreferences: 'Save Preferences'
  }
})

const applyGoogleConsent = (analyticsGranted: boolean, marketingGranted: boolean) => {
  if (import.meta.client && typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: marketingGranted ? 'granted' : 'denied',
      ad_user_data: marketingGranted ? 'granted' : 'denied',
      ad_personalization: marketingGranted ? 'granted' : 'denied'
    })
  }
}

const saveConsent = (functional: boolean, analytics: boolean, marketing: boolean) => {
  consentCookie.value = {
    decided: true,
    essential: true,
    functional,
    analytics,
    marketing,
    updatedAt: new Date().toISOString()
  }
  preferences.functional = functional
  preferences.analytics = analytics
  preferences.marketing = marketing
  showBanner.value = false
  showPreferencesModal.value = false
  applyGoogleConsent(analytics, marketing)
}

const acceptAll = () => {
  saveConsent(true, true, true)
}

const acceptEssentialOnly = () => {
  saveConsent(false, false, false)
}

const saveCustomPreferences = () => {
  saveConsent(preferences.functional, preferences.analytics, preferences.marketing)
}

const openPreferences = () => {
  if (consentCookie.value) {
    preferences.functional = consentCookie.value.functional
    preferences.analytics = consentCookie.value.analytics
    preferences.marketing = consentCookie.value.marketing
  }
  showPreferencesModal.value = true
}

const handleOpenCookieSettings = () => {
  openPreferences()
}

onMounted(() => {
  if (!consentCookie.value || !consentCookie.value.decided) {
    showBanner.value = true
  } else {
    preferences.functional = consentCookie.value.functional
    preferences.analytics = consentCookie.value.analytics
    preferences.marketing = consentCookie.value.marketing
    applyGoogleConsent(consentCookie.value.analytics, consentCookie.value.marketing)
  }
  window.addEventListener('open-cookie-settings', handleOpenCookieSettings)
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('open-cookie-settings', handleOpenCookieSettings)
  }
})
</script>


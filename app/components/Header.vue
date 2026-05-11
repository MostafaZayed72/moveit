<template>
  <header 
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6',
      isScrolled 
        ? (isDark ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm')
        : 'bg-transparent'
    ]"
  >
    <div class="container mx-auto max-w-7xl flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center group">
        <img 
          :src="'/images/logo.png'" 
          alt="MoveIt Logo" 
          class="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          @error="(e) => e.target.style.display = 'none'"
        />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.key" 
          :to="localePath(item.path)" 
          class="nav-link font-medium"
          :class="!isScrolled ? '!text-white/90 hover:!text-white' : ''"
          active-class="!text-blue-500"
          exact-active-class="!text-blue-500"
        >
          {{ $t(`nav.${item.key}`) }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <!-- Language Switcher: Flags with spacing -->
        <div 
          :class="[
            'flex items-center gap-3 p-1.5 rounded-full border backdrop-blur-md transition-colors',
            !isScrolled ? 'bg-white/10 border-white/20' : (isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200')
          ]"
        >
          <!-- UK Flag -->
          <button
            @click="setLocale('en')"
            :class="[
              'w-9 h-9 rounded-full overflow-hidden transition-all duration-300',
              locale === 'en' 
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-lg' 
                : 'opacity-50 hover:opacity-100 hover:scale-105'
            ]"
            :style="locale === 'en' ? (!isScrolled || isDark ? 'box-shadow: 0 0 0 2px #0f172a' : 'box-shadow: 0 0 0 2px #ffffff') : ''"
            title="English"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-full h-full">
              <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
              <clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
              <g clip-path="url(#a)">
                <path d="M0 0v30h60V0z" fill="#012169"/>
                <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
                <path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/>
                <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
                <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
              </g>
            </svg>
          </button>

          <!-- Dutch Flag -->
          <button
            @click="setLocale('nl')"
            :class="[
              'w-9 h-9 rounded-full overflow-hidden transition-all duration-300',
              locale === 'nl' 
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-lg' 
                : 'opacity-50 hover:opacity-100 hover:scale-105'
            ]"
            :style="locale === 'nl' ? (!isScrolled || isDark ? 'box-shadow: 0 0 0 2px #0f172a' : 'box-shadow: 0 0 0 2px #ffffff') : ''"
            title="Nederlands"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-full h-full">
              <rect width="9" height="2" y="0" fill="#AE1C28"/>
              <rect width="9" height="2" y="2" fill="#fff"/>
              <rect width="9" height="2" y="4" fill="#21468B"/>
            </svg>
          </button>
        </div>

        <!-- Dark / Light Mode Toggle -->
        <button
          @click="toggleDark()"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md',
            !isScrolled 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : (isDark ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')
          ]"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <!-- Moon icon (shown in light mode) -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <!-- CTA Button -->
        <NuxtLink :to="localePath('/contact')" class="hidden md:block">
          <button class="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95">
            {{ $t('home.get_quote') }}
          </button>
        </NuxtLink>

        <!-- Mobile Menu Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" :class="['lg:hidden p-2 transition-colors', !isScrolled ? 'text-white' : (isDark ? 'text-white' : 'text-slate-900')]">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition 
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isMenuOpen" 
        :class="['absolute top-full left-0 w-full border-b lg:hidden py-8 px-6 space-y-6 shadow-2xl', isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200']"
      >
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.key" 
          :to="localePath(item.path)" 
          :class="['block text-xl font-bold hover:text-blue-500', isDark ? 'text-slate-300' : 'text-slate-700']"
          @click="isMenuOpen = false"
        >
          {{ $t(`nav.${item.key}`) }}
        </NuxtLink>
        <!-- Mobile Lang + Dark toggle -->
        <div class="pt-6 border-t border-slate-800/30 flex items-center gap-4">
          <button @click="setLocale('en'); isMenuOpen = false" :class="['w-12 h-12 rounded-full overflow-hidden transition-all', locale === 'en' ? 'ring-2 ring-blue-500' : 'opacity-40']">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-full h-full">
              <clipPath id="ma"><path d="M0 0v30h60V0z"/></clipPath>
              <clipPath id="mb"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
              <g clip-path="url(#ma)">
                <path d="M0 0v30h60V0z" fill="#012169"/>
                <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
                <path d="M0 0l60 30m0-30L0 30" clip-path="url(#mb)" stroke="#C8102E" stroke-width="4"/>
                <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
                <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
              </g>
            </svg>
          </button>
          <button @click="setLocale('nl'); isMenuOpen = false" :class="['w-12 h-12 rounded-full overflow-hidden transition-all', locale === 'nl' ? 'ring-2 ring-blue-500' : 'opacity-40']">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-full h-full">
              <rect width="9" height="2" y="0" fill="#AE1C28"/>
              <rect width="9" height="2" y="2" fill="#fff"/>
              <rect width="9" height="2" y="4" fill="#21468B"/>
            </svg>
          </button>
          <button @click="toggleDark()" :class="['w-10 h-10 rounded-full flex items-center justify-center border', isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-700']">
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

// VueUse dark mode — toggles .dark class on <html>
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

const navItems = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'locations', path: '/locations' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' },
  { key: 'blog', path: '/blog' }
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

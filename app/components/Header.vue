<template>
  <header 
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3 px-4 lg:px-8',
      isScrolled 
        ? (isDark ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm')
        : (isHomePage ? 'bg-transparent' : 'bg-slate-950/40 backdrop-blur-md')
    ]"
  >
    <div class="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center group shrink-0">
        <img 
          :src="'/images/logo.svg'" 
          alt="MoveIt Logo" 
          class="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          @error="(e) => e.target.style.display = 'none'"
        />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">
        <template v-for="item in navItems" :key="item.key">
          <!-- Locations Dropdown for Desktop -->
          <div 
            v-if="item.key === 'locations'" 
            class="relative group py-2"
          >
            <span 
              class="nav-link font-medium inline-flex items-center gap-1 cursor-pointer group-hover:after:w-full transition-colors"
              :class="[
                !isScrolled 
                  ? 'text-white/90 group-hover:text-white' 
                  : 'group-hover:text-slate-900 dark:group-hover:text-white'
              ]"
            >
              {{ $t(`nav.${item.key}`) }}
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
            
            <div class="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
              <div class="w-[480px] rounded-2xl p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                  <NuxtLink 
                    v-for="sub in item.subItems.filter(s => s.key !== 'all_locations')" 
                    :key="sub.key"
                    :to="localePath(sub.path)"
                    class="px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors text-left"
                  >
                    {{ $t(`nav.${sub.key}`) }}
                  </NuxtLink>
                </div>
                <!-- View all link -->
                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-end">
                  <NuxtLink 
                    :to="localePath('/locations')"
                    class="text-xs font-bold text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                  >
                    {{ $t('nav.all_locations') }} &rarr;
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Generic Dropdown for Desktop -->
          <div 
            v-else-if="item.subItems" 
            class="relative group py-2"
          >
            <span 
              class="nav-link font-medium inline-flex items-center gap-1 cursor-pointer group-hover:after:w-full transition-colors"
              :class="[
                !isScrolled 
                  ? 'text-white/90 group-hover:text-white' 
                  : 'group-hover:text-slate-900 dark:group-hover:text-white'
              ]"
            >
              {{ $t(`nav.${item.key}`) }}
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
            
            <div class="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
              <div class="w-48 rounded-xl p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-1">
                <NuxtLink 
                  v-for="sub in item.subItems" 
                  :key="sub.key"
                  :to="localePath(sub.path)"
                  class="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors"
                >
                  {{ $t(`nav.${sub.key}`) }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Normal nav items -->
          <NuxtLink 
            v-else
            :to="localePath(item.path)" 
            class="nav-link font-medium"
            :class="!isScrolled ? 'text-white/90 hover:text-white' : ''"
          >
            {{ $t(`nav.${item.key}`) }}
          </NuxtLink>
        </template>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <div 
          :class="[
            'hidden sm:flex items-center gap-2 sm:gap-3 p-1.5 rounded-full border backdrop-blur-md transition-colors',
            !isScrolled ? 'bg-white/10 border-white/20' : (isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100 border-slate-200')
          ]"
        >
          <!-- UK Flag -->
          <button
            @click="setLocale('en')"
            :class="[
              'w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-300',
              locale === 'en' 
                ? 'ring-2 ring-red-500 ring-offset-2 scale-110 shadow-lg' 
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
              'w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-300',
              locale === 'nl' 
                ? 'ring-2 ring-red-500 ring-offset-2 scale-110 shadow-lg' 
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
            'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md',
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

        <!-- Header Contact Info & CTA (Desktop only) -->
        <div class="hidden xl:flex items-center gap-3.5">
          
          <!-- Phone -->
          <a href="tel:+31634837587" :class="[
            'flex items-center gap-1.5 text-sm font-bold transition-colors whitespace-nowrap',
            !isScrolled ? 'text-white hover:text-red-200' : (isDark ? 'text-slate-300 hover:text-red-400' : 'text-slate-700 hover:text-red-600')
          ]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>+31 6 34837587</span>
          </a>

          <!-- WhatsApp -->
          <a href="https://wa.me/31634837587" target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/60 rounded-full font-bold text-sm transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>WhatsApp</span>
          </a>

          <!-- Quote Button -->
          <NuxtLink :to="localePath('/contact')">
            <button class="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-bold text-sm hover:bg-amber-600 transition-all shadow-md active:scale-95 whitespace-nowrap">
              {{ $t('home.get_quote') }}
            </button>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          :class="[
            'lg:hidden p-2 rounded-lg transition-colors shrink-0 focus:outline-none', 
            !isScrolled ? 'text-white hover:bg-white/10' : (isDark ? 'text-white hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100')
          ]"
          aria-label="Toggle Menu"
        >
          <svg v-if="!isMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
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
        :class="['absolute top-full left-0 w-full border-b lg:hidden py-6 px-6 space-y-6 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto', isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200']"
      >
        <div v-for="item in navItems" :key="item.key" class="w-full">
          <!-- Generic Dropdown for Mobile -->
          <div v-if="item.subItems" class="w-full">
            <button 
              @click="toggleMobileSubMenu(item.key)"
              :class="['w-full flex items-center justify-between text-lg font-bold hover:text-red-500 text-left', isDark ? 'text-slate-300' : 'text-slate-700']"
            >
              <span>{{ $t(`nav.${item.key}`) }}</span>
              <svg 
                class="w-5 h-5 transition-transform duration-200" 
                :class="mobileSubMenus[item.key] ? 'rotate-180' : ''" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            <!-- Mobile submenu list -->
            <div 
              v-show="mobileSubMenus[item.key]" 
              class="mt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-3"
            >
              <NuxtLink 
                v-for="sub in item.subItems" 
                :key="sub.key"
                :to="localePath(sub.path)"
                class="block text-base py-1.5 hover:text-red-500 transition-colors font-medium"
                :class="isDark ? 'text-slate-400' : 'text-slate-600'"
                @click="isMenuOpen = false; resetMobileMenus()"
              >
                {{ $t(`nav.${sub.key}`) }}
              </NuxtLink>
            </div>
          </div>

          <!-- Other items -->
          <NuxtLink 
            v-else
            :to="localePath(item.path)" 
            :class="['block text-lg font-bold hover:text-red-500', isDark ? 'text-slate-300' : 'text-slate-700']"
            @click="isMenuOpen = false; resetMobileMenus()"
          >
            {{ $t(`nav.${item.key}`) }}
          </NuxtLink>
        </div>

        <!-- Mobile Phone, WhatsApp & Get Quote CTAs -->
        <div class="pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-3">
          <!-- Mobile Phone Number Link -->
          <a 
            href="tel:+31634837587" 
            :class="[
              'flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-colors border w-full',
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            ]"
          >
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>+31 6 34837587</span>
          </a>

          <!-- Mobile WhatsApp Button -->
          <a 
            href="https://wa.me/31634837587" 
            target="_blank" 
            class="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm w-full"
            @click="isMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>WhatsApp</span>
          </a>

          <!-- Mobile Get Quote Button -->
          <NuxtLink 
            :to="localePath('/contact')" 
            class="flex items-center justify-center py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm rounded-xl transition-colors shadow-sm text-center w-full block"
            @click="isMenuOpen = false"
          >
            {{ $t('home.get_quote') }}
          </NuxtLink>
        </div>

        <!-- Mobile Lang + Dark toggle -->
        <div class="pt-4 border-t border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
          <button @click="setLocale('en'); isMenuOpen = false" :class="['w-12 h-12 rounded-full overflow-hidden transition-all', locale === 'en' ? 'ring-2 ring-red-500' : 'opacity-40']">
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
          <button @click="setLocale('nl'); isMenuOpen = false" :class="['w-12 h-12 rounded-full overflow-hidden transition-all', locale === 'nl' ? 'ring-2 ring-red-500' : 'opacity-40']">
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
import { ref, computed, watch, onMounted } from 'vue'

const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isMobileServicesOpen = ref(false)
const mobileSubMenus = ref({})

const toggleMobileSubMenu = (key) => {
  mobileSubMenus.value[key] = !mobileSubMenus.value[key]
}

const resetMobileMenus = () => {
  isMobileServicesOpen.value = false
  mobileSubMenus.value = {}
}

const servicesList = [
  'student',
  'local',
  'long_distance',
  'international',
  'full_service',
  'furniture_assembly',
  'packing',
  'lift_rental',
  'piano',
  'senior',
  'last_minute_moving',
  'clearance'
]

const getServiceIcon = (id) => {
  const icons = {
    student: '🎓',
    local: '🏠',
    long_distance: '🚚',
    international: '🌍',
    full_service: '✨',
    furniture_assembly: '🛠️',
    packing: '📦',
    lift_rental: '🏗️',
    piano: '🎹',
    senior: '❤️',
    last_minute_moving: '⚡',
    clearance: '🧹'
  }
  return icons[id] || '📦'
}

const isHomePage = computed(() => route.path === '/' || route.path === '/en' || route.path === '/nl')

// VueUse dark mode — toggles .dark class on <html>
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

const navItems = [
  { key: 'services', path: '/services' },
  { key: 'pricing', path: '/pricing' },
  { key: 'products', path: '/products' },
  { 
    key: 'resources', 
    path: '#',
    subItems: [
      { key: 'faq', path: '/faq' },
      { key: 'blog', path: '/blog' },
      { key: 'referral', path: '/referral-program' }
    ]
  },
  { 
    key: 'company', 
    path: '#',
    subItems: [
      { key: 'about', path: '/about' },
      { key: 'team', path: '/team' },
      { key: 'locations', path: '/locations' },
      { key: 'contact', path: '/contact' }
    ]
  }
]

watch(isMenuOpen, (newVal) => {
  if (!newVal) {
    resetMobileMenus()
  }
})

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

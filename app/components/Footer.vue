<template>
  <footer :class="['border-t pt-24 pb-12 px-6 transition-colors duration-300', isDark ? 'bg-slate-950 border-slate-900' : 'bg-slate-100 border-slate-200']">
    <div class="container mx-auto max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
        <!-- Column 1: Contact -->
        <div class="space-y-6">
          <NuxtLink to="/" class="block">
            <img 
              :src="'/images/logo.svg'" 
              alt="MoveIt Logo" 
              class="h-10 w-auto object-contain mb-4"
              @error="(e) => e.target.style.display = 'none'"
            />
          </NuxtLink>
          <p :class="isDark ? 'text-slate-400' : 'text-slate-600'" class="leading-relaxed max-w-xs text-sm">
            {{ $t('footer.slogan') }}
          </p>
          
          <ul class="space-y-4 pt-4 text-sm font-medium">
            <li class="flex items-center space-x-3 group">
              <div class="text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
              <a href="tel:+31634837587" :class="isDark ? 'text-slate-300 group-hover:text-red-500' : 'text-slate-600 group-hover:text-red-500'" class="transition-colors">+31 6 34837587</a>
            </li>
            <li class="flex items-center space-x-3 group">
              <div class="text-green-500"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
              <a href="https://wa.me/31684094271" target="_blank" :class="isDark ? 'text-slate-300 group-hover:text-green-500' : 'text-slate-600 group-hover:text-green-500'" class="transition-colors">+31 6 84094271</a>
            </li>
            <li class="flex items-center space-x-3 group">
              <div class="text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
              <a href="mailto:info@moveitmaastricht.nl" :class="isDark ? 'text-slate-300 group-hover:text-red-500' : 'text-slate-600 group-hover:text-red-500'" class="transition-colors">info@moveitmaastricht.nl</a>
            </li>
            <li class="flex items-start space-x-3 group">
              <div class="text-red-500 mt-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
              <span :class="isDark ? 'text-slate-300' : 'text-slate-600'" class="whitespace-pre-line leading-relaxed">{{ $t('footer.address') }}</span>
            </li>
          </ul>

          <div class="flex space-x-4 pt-4">
            <a v-for="link in socialLinks" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer" :aria-label="link.name" :class="['w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-red-600 hover:text-white', isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-200 text-slate-500']">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path :d="link.icon"/></svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Services Links -->
        <div class="space-y-6">
          <h4 :class="isDark ? 'text-slate-100' : 'text-slate-900'" class="text-sm font-bold uppercase tracking-widest">{{ $t('nav.services') }}</h4>
          <ul class="space-y-4 text-sm font-medium">
            <li v-for="service in footerServices" :key="service.id">
              <NuxtLink :to="localePath('/services/' + service.id)" :class="['hover:text-red-500 transition-colors transition-all duration-300', isDark ? 'text-slate-400' : 'text-slate-600']">
                {{ $t(`services.list.${service.id}.title`) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Locations Links (Areas Served) -->
        <div class="space-y-6">
          <h4 :class="isDark ? 'text-slate-100' : 'text-slate-900'" class="text-sm font-bold uppercase tracking-widest">AREAS SERVED</h4>
          <ul class="space-y-4 text-sm font-medium">
            <li v-for="loc in footerLocations" :key="loc.slug">
              <NuxtLink :to="localePath('/locations/' + loc.slug)" :class="['hover:text-red-500 transition-colors transition-all duration-300', isDark ? 'text-slate-400' : 'text-slate-600']">
                {{ $t('nav.' + loc.key) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 4: Company Links -->
        <div class="space-y-6">
          <h4 :class="isDark ? 'text-slate-100' : 'text-slate-900'" class="text-sm font-bold uppercase tracking-widest">COMPANY</h4>
          <ul class="space-y-4 text-sm font-medium">
            <li v-for="item in companyItems" :key="item.key">
              <NuxtLink :to="localePath(item.path)" :class="['hover:text-red-500 transition-colors transition-all duration-300', isDark ? 'text-slate-400' : 'text-slate-600']">
                {{ $t(item.t) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div :class="['border-t pt-12 flex flex-col md:flex-row justify-between items-center text-sm', isDark ? 'border-slate-900 text-slate-600' : 'border-slate-200 text-slate-400']">
        <p>{{ $t('footer.rights', { year: currentYear }) }}</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <span>{{ $t('footer.handcrafted') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})

const companyItems = [
  { key: 'about', path: '/about', t: 'nav.about' },
  { key: 'reviews', path: '/reviews', t: 'nav.reviews' },
  { key: 'pricing', path: '/pricing', t: 'nav.pricing' },
  { key: 'faq', path: '/faq', t: 'nav.faq' },
  { key: 'contact', path: '/contact', t: 'nav.contact' },
  { key: 'privacy', path: '/privacy', t: 'footer.privacy' },
  { key: 'terms', path: '/terms', t: 'footer.terms' }
]

const footerServices = [
  { id: 'student' },
  { id: 'local' },
  { id: 'long_distance' },
  { id: 'international' },
  { id: 'furniture_assembly' },
  { id: 'packing' },
  { id: 'last_minute_moving' }
]

const footerLocations = [
  { key: 'maastricht', slug: 'maastricht' },
  { key: 'sittard', slug: 'sittard' },
  { key: 'roermond', slug: 'roermond' },
  { key: 'valkenburg', slug: 'valkenburg' },
  { key: 'aachen', slug: 'aachen' },
  { key: 'genk', slug: 'genk' }
]

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1EJn3J76rS/?mibextid=wwXIfr',
    icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/moveitmaastricht.nl?igsh=ZmlrYTd6dThyNmVt',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/moveit-maastricht/',
    icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@moveitmaastricht?_r=1&_t=ZG-977C3Im0Z8a',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.14 2.26 1.89 3.69 2.15v3.9c-.83-.02-1.66-.23-2.42-.58a7.03 7.03 0 0 1-3.25-3.12v8.31c-.04 2.06-.88 4.09-2.44 5.37-1.53 1.34-3.66 1.95-5.67 1.67A7.27 7.27 0 0 1 2.37 13.9c-.31-2-.04-4.08 1.05-5.75C4.7 6.2 6.94 5.07 9.22 5.09h1.15v3.89c-1.39.02-2.79.62-3.66 1.7-.89 1.07-1.12 2.58-.69 3.91.4 1.25 1.48 2.22 2.78 2.47 1.29.28 2.68-.14 3.48-1.18.66-.8 1.01-1.83.99-2.86l.01-13c-.02-.01-.04-.01-.06-.02z'
  }
]
</script>

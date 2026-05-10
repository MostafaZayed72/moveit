
<script setup>
const localePath = useLocalePath()
const navItems = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'locations', path: '/locations' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' },
  { key: 'blog', path: '/blog' }
]
</script>

<template>
  <footer class="bg-slate-950 border-t border-slate-900 pt-24 pb-12 px-6">
    <div class="container mx-auto max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <!-- Brand -->
        <div class="space-y-8">
          <NuxtLink to="/" class="block">
            <img 
              :src="'/images/logo.png'" 
              alt="MoveIt Logo" 
              class="h-12 w-auto object-contain"
              @error="(e) => e.target.style.display = 'none'"
            />
          </NuxtLink>
          <p class="text-slate-400 leading-relaxed max-w-xs">
            {{ $t('footer.slogan') }}
          </p>
          <div class="flex space-x-4">
            <a v-for="i in 4" :key="i" href="#" class="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div v-for="col in 2" :key="col" class="space-y-8">
          <h4 class="text-sm font-bold uppercase tracking-widest text-slate-500">{{ col === 1 ? 'Navigation' : 'Support' }}</h4>
          <ul class="space-y-4">
            <template v-if="col === 1">
              <li v-for="item in navItems" :key="item.key">
                <NuxtLink :to="localePath(item.path)" class="text-slate-300 hover:text-blue-500 transition-colors">
                  {{ $t(`nav.${item.key}`) }}
                </NuxtLink>
              </li>
            </template>
            <template v-else>
              <li v-for="label in ['Privacy', 'Terms', 'Cookie Policy']" :key="label">
                <a href="#" class="text-slate-300 hover:text-blue-500 transition-colors">{{ label }}</a>
              </li>
            </template>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="space-y-8">
          <h4 class="text-sm font-bold uppercase tracking-widest text-slate-500">Contact Us</h4>
          <ul class="space-y-6">
            <li class="flex items-start space-x-4">
              <div class="w-6 h-6 text-blue-500"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>
              <span class="text-slate-300">Amsterdam, Netherlands<br/>Prinsengracht 123</span>
            </li>
            <li class="flex items-center space-x-4">
              <div class="w-6 h-6 text-blue-500"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
              <span class="text-slate-300">+31 20 123 4567</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
        <p>{{ $t('footer.rights') }}</p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <span>Handcrafted by MoveIt Team</span>
        </div>
      </div>
    </div>
  </footer>
</template>

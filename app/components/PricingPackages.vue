<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="(pkg, i) in packages"
      :key="i"
      :class="[
        'relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col',
        pkg.popular
          ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30 ring-2 ring-red-500 scale-[1.02]'
          : 'premium-card'
      ]"
      data-aos="fade-up"
      :data-aos-delay="i * 100"
    >
      <!-- Popular Badge -->
      <div v-if="pkg.popular" class="absolute top-4 right-4 bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
        Most Popular
      </div>

      <div class="p-8 flex flex-col flex-grow">
        <!-- Icon -->
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl', pkg.popular ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30']">
          {{ pkg.icon }}
        </div>

        <!-- Title & Price -->
        <h3 :class="['text-xl font-bold mb-2', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">{{ pkg.name }}</h3>
        <div class="mb-1">
          <span :class="['text-3xl font-black', pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white']">{{ pkg.price }}</span>
          <span :class="['text-sm ml-1', pkg.popular ? 'text-red-100' : 'text-slate-500']">{{ pkg.unit }}</span>
        </div>
        <p :class="['text-xs mb-6', pkg.popular ? 'text-red-100' : 'text-slate-400']">excl. 21% VAT</p>

        <!-- Perfect For -->
        <p :class="['text-xs font-bold uppercase tracking-wider mb-3', pkg.popular ? 'text-red-200' : 'text-slate-400']">Perfect for:</p>
        <ul class="space-y-2 mb-8">
          <li v-for="item in pkg.features" :key="item" class="flex items-start gap-2 text-sm">
            <svg :class="['w-4 h-4 mt-0.5 shrink-0', pkg.popular ? 'text-white' : 'text-red-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span :class="pkg.popular ? 'text-red-50' : 'text-slate-600 dark:text-slate-300'">{{ item }}</span>
          </li>
        </ul>

        <!-- CTA -->
        <div class="mt-auto">
          <a
            :href="pkg.cta.link"
            :class="[
              'block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all active:scale-95',
              pkg.popular
                ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
            ]"
          >
            {{ pkg.cta.text }}
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Footnote -->
  <div class="mt-12 text-center space-y-1">
    <p class="text-sm text-slate-500 dark:text-slate-400">All prices exclude 21% VAT. Time calculated from departure & return to our Maastricht location.</p>
    <p class="text-sm text-red-500 font-semibold">🎓 Free ride along for all students within Maastricht!</p>
  </div>
</template>

<script setup>
const packages = [
  {
    icon: '🚐',
    name: 'Van Only',
    price: '€59.99',
    unit: '/hr',
    popular: false,
    features: ['Small moves', 'Marketplace pickups', 'Single furniture items', 'DIY movers'],
    cta: { text: 'Book via WhatsApp', link: 'https://wa.me/31612345678' }
  },
  {
    icon: '📦',
    name: 'Van + 1 Mover',
    price: '€69.99',
    unit: '/hr',
    popular: true,
    features: ['Studio moves', 'Student apartments', 'Small households', 'Min. 2 hours'],
    cta: { text: 'Get Instant Quote', link: '/contact' }
  },
  {
    icon: '🏠',
    name: 'Van + 2 Movers',
    price: '€94.99',
    unit: '/hr',
    popular: false,
    features: ['1-bedroom apartments', 'Heavy furniture', 'Faster moving days', 'Basic furniture handling'],
    cta: { text: 'Reserve Your Slot', link: '/contact' }
  },
  {
    icon: '🌍',
    name: 'Full-Service Move',
    price: '€349',
    unit: 'starting',
    popular: false,
    features: ['Long-distance moves', 'International relocations', 'Expats & families', '24/7 WhatsApp coordination'],
    cta: { text: 'Request Fixed Quote', link: '/contact' }
  },
]
</script>

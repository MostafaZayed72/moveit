<template>
  <div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <div
        v-for="(city, i) in cities"
        :key="city.name"
        class="group relative rounded-2xl overflow-hidden h-40 cursor-pointer"
        data-aos="fade-up"
        :data-aos-delay="(i % 5) * 50"
      >
        <img :src="city.image" :alt="city.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-950/20 group-hover:from-red-900/80 transition-colors duration-500"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-end p-4">
          <span v-if="!city.isMore" class="text-white font-bold text-sm drop-shadow-lg">{{ city.name }}</span>
          <span v-else class="text-white font-bold text-sm drop-shadow-lg">{{ $t('home.cities.and_more') }}</span>
          
          <span v-if="city.country && !city.isMore" class="text-red-300 text-xs font-medium">{{ city.country }}</span>
          <span v-if="city.isMore" class="text-red-300 text-xs font-medium">{{ $t('home.cities.request_quote') }}</span>
        </div>
        <!-- Pin -->
        <div class="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cities = [
  { name: 'Maastricht', country: null, image: '/images/maastricht.jpg' },
  { name: 'Geleen', country: null, image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Roermond', country: null, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sittard', country: null, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=400' },
  { name: 'Venlo', country: null, image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=400' },
  { name: 'Weert', country: null, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=400' },
  { name: 'Eijsden', country: null, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Meerssen', country: null, image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400' },
  { name: 'Vaals', country: null, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400' },
  { name: 'Aachen', country: '🇩🇪 Germany', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Genk', country: '🇧🇪 Belgium', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&q=80&w=400' },
  { name: 'Brunssum', country: null, image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=400' },
  { name: 'Valkenburg', country: null, image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=400' },
  { name: 'Brussels', country: '🇧🇪 Belgium', image: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?auto=format&fit=crop&q=80&w=400' },
  { isMore: true, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400' },
]
</script>

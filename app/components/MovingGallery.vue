<template>
  <section class="relative py-16 px-4 sm:px-6 overflow-hidden bg-slate-950/40 border-y border-white/5">
    <div class="container mx-auto max-w-7xl relative z-10">
      
      <!-- Section Header -->
      <div class="mb-12 text-center max-w-3xl mx-auto" data-aos="fade-up">
        <div class="mb-3">
          <span class="text-xs md:text-sm font-extrabold uppercase tracking-widest text-red-500 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
            {{ $t('home.gallery_badge') }}
          </span>
        </div>
        <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
          {{ $t('home.gallery_title') }}
        </h2>
        <p class="text-sm md:text-base text-slate-400 leading-relaxed font-medium mt-3 max-w-2xl mx-auto">
          {{ $t('home.gallery_subtitle') }}
        </p>
      </div>

      <!-- Vertical Moving Image Ticker Container -->
      <div class="gallery-container relative h-[480px] sm:h-[560px] md:h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-md p-4 sm:p-6 shadow-2xl">
        
        <!-- Top & Bottom Gradient Shadows for Seamless Fade -->
        <div class="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-20"></div>
        <div class="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-20"></div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 h-full">
          
          <!-- Column 1: Moves UP -->
          <div class="overflow-hidden relative h-full">
            <div class="flex flex-col gap-4 sm:gap-6 animate-vertical-up">
              <div 
                v-for="(img, i) in [...col1Images, ...col1Images]" 
                :key="'col1-' + i" 
                class="group relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-800 shrink-0"
              >
                <img 
                  :src="img" 
                  alt="MoveIt Moving Photo" 
                  class="w-full h-52 sm:h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Column 2: Moves DOWN -->
          <div class="overflow-hidden relative h-full">
            <div class="flex flex-col gap-4 sm:gap-6 animate-vertical-down">
              <div 
                v-for="(img, i) in [...col2Images, ...col2Images]" 
                :key="'col2-' + i" 
                class="group relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-800 shrink-0"
              >
                <img 
                  :src="img" 
                  alt="MoveIt Moving Photo" 
                  class="w-full h-52 sm:h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Column 3: Moves UP (Hidden on small screens, visible on md+) -->
          <div class="hidden md:block overflow-hidden relative h-full">
            <div class="flex flex-col gap-4 sm:gap-6 animate-vertical-up">
              <div 
                v-for="(img, i) in [...col3Images, ...col3Images]" 
                :key="'col3-' + i" 
                class="group relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-800 shrink-0"
              >
                <img 
                  :src="img" 
                  alt="MoveIt Moving Photo" 
                  class="w-full h-52 sm:h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const col1Images = [
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118858/1de98bbd-f573-4415-a3a1-874039c8c1af_pff0xe.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118858/8684d22b-048b-4bc6-828c-f7cd35ca79ca_t1kmfs.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118858/5eff9c92-8583-4464-8f55-52586c2fb788_ezoylo.jpg',
]

const col2Images = [
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118857/d663233c-d751-4470-9cf7-a1bdede3a6b2_efd0sl.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118857/ea67df57-8b6a-47b6-a9a5-0dc671c3436a_ghflte.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118857/800fdf14-7581-4717-985d-0066718772ed_tx5yuq.jpg',
]

const col3Images = [
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118857/01d1ffdf-6462-4fcf-8323-f675ea0c1420_hlwhdi.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118857/24b4dcd0-51bf-4cf5-877e-27af4553d650_dqniio.jpg',
  'https://res.cloudinary.com/jhe8kzw7/image/upload/v1785118856/8d9318ba-ec36-4557-890f-eeecd8451ba7_mzdimz.jpg',
]
</script>

<style scoped>
@keyframes verticalUp {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes verticalDown {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
}

.animate-vertical-up {
  animation: verticalUp 26s linear infinite;
}

.animate-vertical-down {
  animation: verticalDown 26s linear infinite;
}

/* Pause animation on hover */
.gallery-container:hover .animate-vertical-up,
.gallery-container:hover .animate-vertical-down {
  animation-play-state: paused;
}
</style>

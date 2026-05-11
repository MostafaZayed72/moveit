<template>
  <div class="relative overflow-hidden">
    <!-- Carousel Container -->
    <div class="relative" :style="{ minHeight: containerHeight + 'px' }">
      <transition :name="transitionDirection" mode="out-in">
        <div
          :key="currentPage"
          class="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div
            v-for="(review, idx) in pages[currentPage]"
            :key="idx"
            class="premium-card relative flex flex-col"
          >
            <!-- Stars -->
            <div class="flex gap-1 mb-6">
              <svg v-for="s in 5" :key="s" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>

            <!-- Quote -->
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-[15px] italic flex-grow">
              "{{ review.text }}"
            </p>

            <!-- Author -->
            <div class="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <img
                :src="review.avatar"
                :alt="review.name"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/20"
              />
              <div>
                <div class="font-bold text-slate-900 dark:text-white text-sm">{{ review.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ review.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Dots Navigation -->
    <div class="flex justify-center gap-3 mt-12">
      <button
        v-for="(_, i) in pages"
        :key="i"
        @click="goToPage(i)"
        :class="[
          'w-3 h-3 rounded-full transition-all duration-300',
          currentPage === i
            ? 'bg-red-600 w-8'
            : 'bg-slate-300 dark:bg-slate-700 hover:bg-red-400'
        ]"
      />
    </div>
  </div>
</template>

<script setup>
const currentPage = ref(0)
const transitionDirection = ref('fade')
const containerHeight = ref(0)
let autoplayInterval = null

const reviews = [
  { name: 'Thomas van der Berg', role: 'Homeowner, Amsterdam', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'MoveIt made our relocation completely stress-free. The team arrived on time, handled everything with care, and even helped us set up in our new home. Truly exceptional service!' },
  { name: 'Willem de Vries', role: 'CEO, TechStart BV', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'We relocated our entire office with MoveIt. Zero downtime, zero damage. Their business moving service is world-class. I would recommend them to any company.' },
  { name: 'Jan Bakker', role: 'Expat, Rotterdam', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', text: 'Moving internationally is daunting, but MoveIt handled everything from customs paperwork to final delivery. They made the process seamless from start to finish.' },
  { name: 'Erik Jansen', role: 'Apartment Owner, Utrecht', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', text: 'The movers were incredibly professional and efficient. They wrapped every piece of furniture carefully and nothing was damaged. Best moving experience ever.' },
  { name: 'Pieter Visser', role: 'Restaurant Owner, Den Haag', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', text: 'Moved my restaurant equipment across the city. MoveIt understood the fragility and value of my commercial kitchen items. Delivered everything perfectly.' },
  { name: 'Daan Mulder', role: 'Family Move, Eindhoven', avatar: 'https://randomuser.me/api/portraits/men/52.jpg', text: 'With three kids and a dog, moving seemed impossible. MoveIt organized everything so well that it felt like a vacation day. Absolute lifesavers!' },
  { name: 'Luuk Bos', role: 'Student, Leiden', avatar: 'https://randomuser.me/api/portraits/men/71.jpg', text: 'Affordable, fast, and reliable. As a student on a budget, I was worried about costs. MoveIt offered a great price without compromising on quality.' },
  { name: 'Ruben Smit', role: 'Architect, Groningen', avatar: 'https://randomuser.me/api/portraits/men/36.jpg', text: 'I had fragile architectural models and equipment that needed careful handling. The MoveIt team treated every item like it was their own. Impressive attention to detail.' },
  { name: 'Joost de Groot', role: 'Manager, Haarlem', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', text: 'Third time using MoveIt and they never disappoint. Consistent quality, fair pricing, and the friendliest crew you will ever meet. They are my go-to movers.' },
  { name: 'Sven Hendriks', role: 'Freelancer, Arnhem', avatar: 'https://randomuser.me/api/portraits/men/29.jpg', text: 'Quick response to my inquiry, competitive quote, and flawless execution. The entire move was done in under 4 hours. Cannot recommend them enough!' },
  { name: 'Koen de Jong', role: 'Doctor, Maastricht', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', text: 'MoveIt handled our cross-country move with military precision. Everything was cataloged, packed, and unpacked exactly where we wanted it. Outstanding!' },
  { name: 'Bram Peters', role: 'Engineer, Breda', avatar: 'https://randomuser.me/api/portraits/men/18.jpg', text: 'The online quote was accurate, the team was punctual, and the move was smooth. No hidden fees, no surprises. This is how moving should always be.' },
  { name: 'Lars Meijer', role: 'Business Owner, Tilburg', avatar: 'https://randomuser.me/api/portraits/men/62.jpg', text: 'We needed an urgent office move and MoveIt delivered within 48 hours. Their flexibility and speed are unmatched. A truly reliable partner for any business.' },
  { name: 'Cas Dekker', role: 'Teacher, Almere', avatar: 'https://randomuser.me/api/portraits/men/48.jpg', text: 'From the first phone call to the last box unpacked, MoveIt was professional and courteous. They even brought coffee for us on moving day. Above and beyond!' },
  { name: 'Niels van Dijk', role: 'Retiree, Delft', avatar: 'https://randomuser.me/api/portraits/men/73.jpg', text: 'At my age, moving is stressful. The MoveIt team was patient, gentle with my belongings, and made sure I was comfortable throughout. Truly caring service.' },
  { name: 'Max Willemsen', role: 'Startup Founder, Amsterdam', avatar: 'https://randomuser.me/api/portraits/men/25.jpg', text: 'MoveIt helped us move into our new startup office. They understood our tech equipment needs and set everything up perfectly. Highly professional team!' },
  { name: 'Hugo Brouwer', role: 'Photographer, Rotterdam', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', text: 'My photography equipment is worth thousands. MoveIt custom-packed every lens and camera body. Everything arrived in perfect condition. Five stars!' },
  { name: 'Finn van Leeuwen', role: 'Consultant, Utrecht', avatar: 'https://randomuser.me/api/portraits/men/58.jpg', text: 'I have used many moving companies over the years, but MoveIt stands head and shoulders above the rest. Their attention to detail is second to none.' },
]

const pages = computed(() => {
  const result = []
  for (let i = 0; i < reviews.length; i += 3) {
    result.push(reviews.slice(i, i + 3))
  }
  return result
})

function goToPage(index) {
  currentPage.value = index
  restartAutoplay()
}

function nextPage() {
  currentPage.value = (currentPage.value + 1) % pages.value.length
}

function restartAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval)
  autoplayInterval = setInterval(nextPage, 3000)
}

onMounted(() => {
  restartAutoplay()
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

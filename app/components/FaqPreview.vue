<template>
  <div class="max-w-3xl mx-auto space-y-4">
    <div
      v-for="(faq, i) in faqs"
      :key="i"
      class="premium-card !p-0 overflow-hidden"
      data-aos="fade-up"
      :data-aos-delay="i * 50"
    >
      <button
        @click="toggle(i)"
        class="w-full flex items-center justify-between p-6 text-left"
      >
        <span class="font-bold text-slate-900 dark:text-white pr-4">{{ faq.q }}</span>
        <svg
          :class="['w-5 h-5 text-red-500 shrink-0 transition-transform duration-300', openIndex === i ? 'rotate-180' : '']"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-96 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="max-h-96 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-show="openIndex === i" class="overflow-hidden">
          <div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
            {{ faq.a }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
const openIndex = ref(0)

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}

const faqs = [
  { q: 'How far in advance should I book?', a: 'We recommend booking at least 3-5 days in advance for local moves. For international relocations, 2-3 weeks is ideal. However, we also accommodate urgent same-day moves when availability allows.' },
  { q: 'Are there any hidden fees?', a: 'Absolutely not. Our pricing is transparent. The hourly rate covers the van, driver, and movers as specified in your package. VAT (21%) is added on top. Time is calculated from departure to return to our Maastricht location.' },
  { q: 'Do you offer student discounts?', a: 'Yes! All students get free ride-along service within Maastricht. Just show your student ID on moving day. We also offer special student-friendly pricing for small moves.' },
  { q: 'What if something gets damaged during the move?', a: 'All our moves include transport insurance. In the rare event of damage, we have a straightforward claims process. Our team is trained in professional handling techniques to minimize any risk.' },
  { q: 'Can I ride along in the moving van?', a: 'Yes! Within Maastricht it is €10 fixed. Outside Maastricht (25-50km) it is €0.50/km. Students ride free within Maastricht. For long-distance moves, we provide a custom quote.' },
]
</script>

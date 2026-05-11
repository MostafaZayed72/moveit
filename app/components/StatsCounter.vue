<template>
  <div class="relative py-20 px-6 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=1920" class="w-full h-full object-cover" alt="Moving truck" />
      <div class="absolute inset-0 bg-slate-950/85"></div>
    </div>

    <div class="container mx-auto max-w-5xl relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="stat in stats" :key="stat.label" data-aos="zoom-in">
          <div class="text-4xl md:text-5xl font-black text-white mb-2">
            <span ref="counterRefs">{{ stat.display }}</span>
          </div>
          <div class="text-sm font-bold uppercase tracking-widest text-red-400">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = reactive([
  { value: 10000, suffix: '+', label: 'Moves Completed', display: '0+' },
  { value: 15, suffix: '+', label: 'Cities Covered', display: '0+' },
  { value: 4.9, suffix: '/5', label: 'Average Rating', display: '0/5' },
  { value: 500, suffix: '+', label: '5-Star Reviews', display: '0+' },
])

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters()
        observer.disconnect()
      }
    })
  }, { threshold: 0.3 })

  observer.observe(document.querySelector('.grid'))
})

function animateCounters() {
  stats.forEach((stat, i) => {
    const duration = 2000
    const steps = 60
    const increment = stat.value / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= stat.value) {
        current = stat.value
        clearInterval(interval)
      }
      if (Number.isInteger(stat.value)) {
        stat.display = Math.floor(current).toLocaleString() + stat.suffix
      } else {
        stat.display = current.toFixed(1) + stat.suffix
      }
    }, duration / steps)
  })
}
</script>

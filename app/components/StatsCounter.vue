<template>
  <div class="relative py-24 px-6 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=1920" class="w-full h-full object-cover" alt="Moving truck" />
      <div class="absolute inset-0 bg-slate-950/90"></div>
    </div>

    <div class="container mx-auto max-w-5xl relative z-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <div v-for="stat in stats" :key="stat.label" data-aos="zoom-in">
          <div class="text-4xl md:text-6xl font-black text-white mb-3">
            <StatCounter :value="stat.value" :suffix="stat.suffix" :decimals="stat.decimals || 0" />
          </div>
          <div class="text-sm font-bold uppercase tracking-widest text-red-500">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  { value: 10000, suffix: '+', label: 'Moves Completed' },
  { value: 15, suffix: '+', label: 'Cities Covered' },
  { value: 4.9, suffix: '/5', label: 'Average Rating', decimals: 1 },
  { value: 500, suffix: '+', label: '5-Star Reviews' },
]
</script>

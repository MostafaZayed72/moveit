<template>
  <section 
    :class="[
      'relative py-24 px-6 overflow-hidden',
      variant === 'dark' ? 'bg-slate-950' : 'bg-slate-900/20'
    ]"
    v-bind="$attrs"
  >
    <div class="container mx-auto max-w-7xl relative z-10">
      <div v-if="title || subtitle" class="mb-16 text-center max-w-3xl mx-auto" data-aos="fade-up">
        <h2 v-if="title" class="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-lg text-slate-400 leading-relaxed">
          {{ subtitle }}
        </p>
      </div>
      <slot />
    </div>
    
    <!-- Decorative background -->
    <div v-if="withBlob" class="absolute top-0 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
    <div v-if="withBlob" class="absolute bottom-0 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -z-10"></div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  variant: {
    type: String,
    default: 'dark'
  },
  withBlob: {
    type: Boolean,
    default: true
  }
})
</script>

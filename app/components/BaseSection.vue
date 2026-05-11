<template>
  <section 
    :class="[
      'relative py-24 px-6 overflow-hidden transition-colors duration-300',
    ]"
    v-bind="$attrs"
  >
    <div class="container mx-auto max-w-7xl relative z-10">
      <div v-if="title || subtitle" class="mb-16 text-center max-w-3xl mx-auto" data-aos="fade-up">
        <h2 v-if="title" class="section-title">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
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
  withBlob: {
    type: Boolean,
    default: true
  }
})
</script>

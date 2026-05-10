<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden">
    <!-- Video Element - Simplified -->
    <video
      autoplay
      muted
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source :src="src" type="video/webm" />
      <source v-if="src.replace('.webm', '.mp4')" :src="src.replace('.webm', '.mp4')" type="video/mp4" />
    </video>

    <!-- Dark overlay -->
    <div :class="['absolute inset-0 z-10', overlayClass]"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: '/videos/hero.webm'
  },
  overlayClass: {
    type: String,
    default: 'bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90'
  }
})
</script>

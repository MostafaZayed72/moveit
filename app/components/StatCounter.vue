<template>
  <span ref="target">{{ displayValue }}</span>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  suffix: {
    type: String,
    default: ''
  },
  decimals: {
    type: Number,
    default: 0
  }
})

const target = ref(null)
const displayValue = ref('0' + props.suffix)
const hasAnimated = ref(false)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting && !hasAnimated.value) {
    animate()
    hasAnimated.value = true
  }
})

function animate() {
  const startValue = 0
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // Ease out quad
    const easeProgress = progress * (2 - progress)
    
    const current = startValue + (props.value - startValue) * easeProgress
    
    if (props.decimals > 0) {
      displayValue.value = current.toFixed(props.decimals) + props.suffix
    } else {
      displayValue.value = Math.floor(current).toLocaleString() + props.suffix
    }

    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      // Ensure final value is exact
      if (props.decimals > 0) {
        displayValue.value = props.value.toFixed(props.decimals) + props.suffix
      } else {
        displayValue.value = Math.floor(props.value).toLocaleString() + props.suffix
      }
    }
  }

  requestAnimationFrame(update)
}
</script>

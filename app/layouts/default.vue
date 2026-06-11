<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
    <FloatingActions />
  </div>
</template>

<script setup>
// Layout logic here
</script>

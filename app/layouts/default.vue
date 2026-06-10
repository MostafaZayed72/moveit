<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <div class="py-16 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div class="container mx-auto max-w-4xl">
        <QuoteForm />
      </div>
    </div>
    <Footer />
    <FloatingActions />
  </div>
</template>

<script setup>
// Layout logic here
</script>

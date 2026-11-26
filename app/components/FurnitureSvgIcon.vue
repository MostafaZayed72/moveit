<template>
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-16 h-12 text-slate-700 dark:text-slate-200">
    <!-- Bed (King / Queen / Single / Storage) -->
    <template v-if="type === 'bed'">
      <rect x="8" y="10" width="48" height="12" rx="2" stroke="currentColor" stroke-width="1.8" />
      <rect x="12" y="14" width="18" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" />
      <rect x="34" y="14" width="18" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5" />
      <rect x="6" y="22" width="52" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
      <line x1="6" y1="29" x2="58" y2="29" stroke="currentColor" stroke-width="1.3" stroke-dasharray="2 2" />
      <line x1="10" y1="36" x2="10" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="54" y1="36" x2="54" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Wardrobe / Cabinet -->
    <template v-else-if="type === 'wardrobe'">
      <rect x="14" y="5" width="36" height="36" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="32" y1="5" x2="32" y2="41" stroke="currentColor" stroke-width="1.5" />
      <line x1="23" y1="5" x2="23" y2="41" stroke="currentColor" stroke-width="1.1" stroke-dasharray="2 2" />
      <line x1="29" y1="20" x2="29" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="35" y1="20" x2="35" y2="26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="16" y1="41" x2="16" y2="45" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="48" y1="41" x2="48" y2="45" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Dresser / Sideboard / File Cabinet -->
    <template v-else-if="type === 'dresser'">
      <rect x="10" y="10" width="44" height="28" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="10" y1="19" x2="54" y2="19" stroke="currentColor" stroke-width="1.5" />
      <line x1="10" y1="28" x2="54" y2="28" stroke="currentColor" stroke-width="1.5" />
      <line x1="28" y1="14.5" x2="36" y2="14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="28" y1="23.5" x2="36" y2="23.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="28" y1="33" x2="36" y2="33" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <line x1="14" y1="38" x2="14" y2="43" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="50" y1="38" x2="50" y2="43" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Nightstand -->
    <template v-else-if="type === 'nightstand'">
      <rect x="18" y="12" width="28" height="26" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="18" y1="24" x2="46" y2="24" stroke="currentColor" stroke-width="1.5" />
      <circle cx="32" cy="18" r="1.5" fill="currentColor" />
      <circle cx="32" cy="31" r="1.5" fill="currentColor" />
      <line x1="21" y1="38" x2="21" y2="43" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="43" y1="38" x2="43" y2="43" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Sofa / Couch / Sectional -->
    <template v-else-if="type === 'sofa'">
      <path d="M12 16C12 13.8 13.8 12 16 12H48C50.2 12 52 13.8 52 16V24H12V16Z" stroke="currentColor" stroke-width="1.8" />
      <rect x="6" y="20" width="8" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
      <rect x="50" y="20" width="8" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
      <rect x="14" y="24" width="36" height="12" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="32" y1="24" x2="32" y2="36" stroke="currentColor" stroke-width="1.4" />
      <line x1="12" y1="36" x2="12" y2="41" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="52" y1="36" x2="52" y2="41" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Armchair / Office Chair / Dining Chair -->
    <template v-else-if="type === 'chair'">
      <rect x="20" y="8" width="24" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
      <rect x="17" y="24" width="30" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="20" y1="31" x2="20" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="44" y1="31" x2="44" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Table / Desk / Coffee Table -->
    <template v-else-if="type === 'table'">
      <rect x="8" y="14" width="48" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="13" y1="20" x2="13" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="51" y1="20" x2="51" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="13" y1="25" x2="51" y2="25" stroke="currentColor" stroke-width="1.2" />
    </template>

    <!-- TV / Monitor -->
    <template v-else-if="type === 'tv'">
      <rect x="10" y="9" width="44" height="26" rx="2" stroke="currentColor" stroke-width="1.8" />
      <rect x="14" y="13" width="36" height="18" rx="1" stroke="currentColor" stroke-width="1.2" />
      <line x1="32" y1="35" x2="32" y2="41" stroke="currentColor" stroke-width="2" />
      <line x1="22" y1="41" x2="42" y2="41" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Bookcase / Shelf -->
    <template v-else-if="type === 'shelf'">
      <rect x="16" y="6" width="32" height="36" rx="1.5" stroke="currentColor" stroke-width="1.8" />
      <line x1="16" y1="15" x2="48" y2="15" stroke="currentColor" stroke-width="1.5" />
      <line x1="16" y1="24" x2="48" y2="24" stroke="currentColor" stroke-width="1.5" />
      <line x1="16" y1="33" x2="48" y2="33" stroke="currentColor" stroke-width="1.5" />
    </template>

    <!-- Appliance (Fridge / Washer / Dishwasher) -->
    <template v-else-if="type === 'appliance'">
      <rect x="17" y="6" width="30" height="36" rx="2" stroke="currentColor" stroke-width="1.8" />
      <line x1="17" y1="18" x2="47" y2="18" stroke="currentColor" stroke-width="1.5" />
      <circle cx="32" cy="30" r="6" stroke="currentColor" stroke-width="1.5" />
      <line x1="22" y1="12" x2="26" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>

    <!-- Moving Box / Wardrobe Box -->
    <template v-else>
      <path d="M14 14L32 8L50 14V36L32 42L14 36V14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M14 14L32 20L50 14" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
      <line x1="32" y1="20" x2="32" y2="42" stroke="currentColor" stroke-width="1.6" />
      <path d="M23 11L41 17" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'box'
  }
})
</script>

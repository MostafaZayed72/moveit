<template>
  <div class="pt-32">
    <BaseSection :title="$t('services.title')" subtitle="Expert solutions for every type of relocation.">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(service, key) in ['private_moves', 'business_moves', 'intl_moves', 'storage', 'packing']" 
          :key="key"
          class="premium-card group"
          data-aos="fade-up"
          :data-aos-delay="key * 50"
        >
          <div class="h-48 rounded-xl overflow-hidden mb-8">
            <img :src="`https://images.unsplash.com/photo-${1580000000000 + key * 1000}?auto=format&fit=crop&q=80&w=600`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Service" />
          </div>
          <h3 class="text-2xl font-bold mb-4 text-white">{{ $t(`services.${service}`) }}</h3>
          <p class="text-slate-400 mb-6">
            Comprehensive support for your transition. We ensure your items reach their destination safely and on time.
          </p>
          <NuxtLink :to="localePath('/contact')" class="btn-outline w-full py-3">Book Now</NuxtLink>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

useSeoMeta({
  title: `${t('services.title')} | MoveIt`,
  description: 'Explore our range of professional moving services including private, business, and international relocation.'
})
</script>

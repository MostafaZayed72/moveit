export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: 'MoveIt - Premium Moving & Logistics Netherlands',
      meta: [
        { name: 'description', content: 'Professional moving services in the Netherlands. Fast, secure, and stress-free relocation for homes and businesses.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'nl', iso: 'nl-NL', file: 'nl.json', name: 'Nederlands' }
    ],
    defaultLocale: 'en',
    langDir: 'app/locales/',
    restructureDir: false,
    strategy: 'prefix_except_default',
    lazy: true,
  },
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  runtimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dgqyvw6wf',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '622516266538682',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'q9oam_IpL_B8BsGYDr-f1xEgLxs',
    adminEmail: process.env.ADMIN_EMAIL || 'info@moveitmaastricht.nl',
    adminPassword: process.env.ADMIN_PASSWORD || 'PYramidbricks@20',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://cpdtzlbsfpiiunylqxnj.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_4WYYC_HyWBwrVd3JvKb-RQ_SilWg49m',
    }
  }
})

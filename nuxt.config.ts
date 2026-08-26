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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Montserrat+Alternates:wght@300;400;500;600;700;800;900&display=swap' }
      ],
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NR8924FH');`,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NR8924FH" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          body: true
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
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
  supabase: {
    url: process.env.SUPABASE_URL || 'https://cpdtzlbsfpiiunylqxnj.supabase.co',
    key: process.env.SUPABASE_KEY || 'sb_publishable_4WYYC_HyWBwrVd3JvKb-RQ_SilWg49m',
    redirect: false,
  },
  runtimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dgqyvw6wf',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '622516266538682',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'q9oam_IpL_B8BsGYDr-f1xEgLxs',
    adminEmail: process.env.ADMIN_EMAIL || 'info@moveitmaastricht.nl',
    adminPassword: process.env.ADMIN_PASSWORD || 'PYramidbricks@20',
    gmailUser: process.env.GMAIL_USER || 'moveitmaastricht@gmail.com',
    gmailPass: process.env.GMAIL_PASS || 'xfphkyhxkoxpjbhw',
    resendApiKey: process.env.RESEND_API_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://cpdtzlbsfpiiunylqxnj.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_4WYYC_HyWBwrVd3JvKb-RQ_SilWg49m',
    }
  }
})

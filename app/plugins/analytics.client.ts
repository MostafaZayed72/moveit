export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    // 1. Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // Define gtag helper
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments)
    }

    // 2. Load Google Tag Manager
    const gtmId = 'GTM-PFTW3CLN'
    const gtmScript = document.createElement('script')
    gtmScript.async = true
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    document.head.appendChild(gtmScript)
    
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    })

    // 3. Load Google Analytics 4 (GA4)
    const gaId = 'G-5BM5M7ZH5R'
    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(gaScript)

    window.gtag('js', new Date())
    window.gtag('config', gaId)

    // 4. Inject GTM noscript in body
    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.appendChild(noscript)

    // Helper to push to GTM and GA4
    const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
      // Send to GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params)
      }
      // Send to GTM (dataLayer)
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...params
        })
      }
    }

    // Global click listener to track phone and WhatsApp links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const anchor = target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      if (href.startsWith('tel:')) {
        trackEvent('click_phone', { phone_number: href.replace('tel:', '') })
      } else if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackEvent('click_whatsapp', { whatsapp_url: href })
      }
    })

    return {
      provide: {
        trackEvent
      }
    }
  }
})

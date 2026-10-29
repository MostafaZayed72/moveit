export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    // 1. Initialize dataLayer & gtag helper
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).gtag = (window as any).gtag || function () {
      ;(window as any).dataLayer.push(arguments)
    }

    // Read existing cookie consent if user already decided
    const consentCookie = useCookie<{
      decided?: boolean
      functional?: boolean
      analytics?: boolean
      marketing?: boolean
    } | null>('moveit_cookie_consent')

    const hasAnalyticsConsent = consentCookie.value?.decided ? !!consentCookie.value.analytics : true
    const hasMarketingConsent = consentCookie.value?.decided ? !!consentCookie.value.marketing : false

    // Configure Google Consent Mode v2 (EU / GDPR compliant)
    ;(window as any).gtag('consent', 'default', {
      analytics_storage: hasAnalyticsConsent ? 'granted' : 'denied',
      ad_storage: hasMarketingConsent ? 'granted' : 'denied',
      ad_user_data: hasMarketingConsent ? 'granted' : 'denied',
      ad_personalization: hasMarketingConsent ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500
    })

    // Capture Marketing & Lead Source Attribution Cookie (UTM / Referrer / Referral)
    const attributionCookie = useCookie<{
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      gclid?: string
      fbclid?: string
      ref?: string
      referrer?: string
      landing_page?: string
      first_visit?: string
    } | null>('moveit_attribution', {
      maxAge: 60 * 60 * 24 * 90, // 90 days attribution window
      sameSite: 'lax',
      path: '/'
    })

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const utmSource = urlParams.get('utm_source')
      const utmMedium = urlParams.get('utm_medium')
      const utmCampaign = urlParams.get('utm_campaign')
      const gclid = urlParams.get('gclid')
      const fbclid = urlParams.get('fbclid')
      const refCode = urlParams.get('ref')

      if (!attributionCookie.value || utmSource || gclid || fbclid || refCode) {
        attributionCookie.value = {
          utm_source: utmSource || attributionCookie.value?.utm_source || (gclid ? 'google_ads' : fbclid ? 'facebook_ads' : 'direct_or_organic'),
          utm_medium: utmMedium || attributionCookie.value?.utm_medium || '',
          utm_campaign: utmCampaign || attributionCookie.value?.utm_campaign || '',
          gclid: gclid || attributionCookie.value?.gclid || '',
          fbclid: fbclid || attributionCookie.value?.fbclid || '',
          ref: refCode || attributionCookie.value?.ref || '',
          referrer: document.referrer || attributionCookie.value?.referrer || 'direct',
          landing_page: window.location.pathname,
          first_visit: attributionCookie.value?.first_visit || new Date().toISOString()
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }

    // 2. Load Google Tag Manager
    const gtmId = 'GTM-PFTW3CLN'
    const gtmScript = document.createElement('script')
    gtmScript.async = true
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    document.head.appendChild(gtmScript)
    
    ;(window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    })

    // 3. Load Google Analytics 4 (GA4)
    const gaId = 'G-5BM5M7ZH5R'
    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(gaScript)

    ;(window as any).gtag('js', new Date())
    ;(window as any).gtag('config', gaId)

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
      if (typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', eventName, params)
      }
      if ((window as any).dataLayer) {
        ;(window as any).dataLayer.push({
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

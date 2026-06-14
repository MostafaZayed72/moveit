import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { locations } from '../../../app/data/locations'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  const errors: any[] = []

  try {
    // 1. Read translation files
    const projectRoot = process.cwd()
    const enPath = path.join(projectRoot, 'app/locales/en.json')
    const nlPath = path.join(projectRoot, 'app/locales/nl.json')
    
    const en = JSON.parse(await fs.readFile(enPath, 'utf-8'))
    const nl = JSON.parse(await fs.readFile(nlPath, 'utf-8'))

    const results = {
      locations: 0,
      blogs: 0,
      services: 0,
      sections: 0
    }

    // ==========================================
    // SEED LOCATIONS
    // ==========================================
    for (const loc of locations) {
      const enLoc = loc.en
      const nlLoc = loc.nl

      // Convert paragraphs array to single newline-separated text
      const formatText = (arr) => Array.isArray(arr) ? arr.join('\n\n') : ''
      const formatList = (arr) => Array.isArray(arr) ? arr.join(', ') : ''

      const locationRow = {
        slug: loc.slug,
        name: loc.name,
        country: loc.country,
        image: loc.image,
        images_boxes: loc.images?.boxes || '',
        images_van: loc.images?.van || '',
        images_room: loc.images?.room || '',
        
        hero_title_en: enLoc.hero.title,
        hero_title_nl: nlLoc.hero.title,
        hero_subtitle_en: enLoc.hero.subtitle,
        hero_subtitle_nl: nlLoc.hero.subtitle,
        
        seo_title_en: enLoc.seo.title,
        seo_title_nl: nlLoc.seo.title,
        seo_desc_en: enLoc.seo.description,
        seo_desc_nl: nlLoc.seo.description,
        seo_keywords_en: enLoc.seo.keywords,
        seo_keywords_nl: nlLoc.seo.keywords,
        
        intro_title_en: enLoc.content.introduction.title,
        intro_title_nl: nlLoc.content.introduction.title,
        intro_text_en: formatText(enLoc.content.introduction.text),
        intro_text_nl: formatText(nlLoc.content.introduction.text),
        
        residential_title_en: enLoc.content.residentialDetails.title,
        residential_title_nl: nlLoc.content.residentialDetails.title,
        residential_text_en: formatText(enLoc.content.residentialDetails.text),
        residential_text_nl: formatText(nlLoc.content.residentialDetails.text),
        
        commercial_title_en: enLoc.content.commercialDetails.title,
        commercial_title_nl: nlLoc.content.commercialDetails.title,
        commercial_text_en: formatText(enLoc.content.commercialDetails.text),
        commercial_text_nl: formatText(nlLoc.content.commercialDetails.text),
        
        packing_title_en: enLoc.content.packingTips.title,
        packing_title_nl: nlLoc.content.packingTips.title,
        packing_text_en: formatText(enLoc.content.packingTips.text),
        packing_text_nl: formatText(nlLoc.content.packingTips.text),
        
        insights_title_en: enLoc.content.localInsights.title,
        insights_title_nl: nlLoc.content.localInsights.title,
        insights_text_en: formatText(enLoc.content.localInsights.text),
        insights_text_nl: formatText(nlLoc.content.localInsights.text),
        
        costs_title_en: enLoc.content.costFactors.title,
        costs_title_nl: nlLoc.content.costFactors.title,
        costs_text_en: formatText(enLoc.content.costFactors.text),
        costs_text_nl: formatText(nlLoc.content.costFactors.text),
        
        neighborhoods_title_en: enLoc.content.neighborhoodsTitle || 'Neighborhoods Served',
        neighborhoods_title_nl: nlLoc.content.neighborhoodsTitle || 'Buurten die we bedienen',
        neighborhoods_list_en: formatList(enLoc.content.neighborhoods),
        neighborhoods_list_nl: formatList(nlLoc.content.neighborhoods)
      }

      const { data, error } = await supabase
        .from('locations')
        .upsert([locationRow], { onConflict: 'slug' })
        .select()

      if (!error) {
        results.locations++
      } else {
        errors.push({ type: 'location', slug: loc.slug, message: error.message, details: error.details, code: error.code })
      }
    }

    // ==========================================
    // SEED BLOG POSTS
    // ==========================================
    const staticBlogsEN = en.blog.posts || []
    const staticBlogsNL = nl.blog.posts || []
    const blogImages = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    ]

    for (let i = 0; i < staticBlogsEN.length; i++) {
      const bEN = staticBlogsEN[i]
      const bNL = staticBlogsNL[i] || bEN

      const slug = bEN.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const blogRow = {
        slug,
        title_en: bEN.title,
        title_nl: bNL.title,
        desc_en: bEN.desc,
        desc_nl: bNL.desc,
        content_en: `## ${bEN.title}\n\n${bEN.desc}\n\nHere is some professional advice to ensure a completely stress-free moving experience. Planning ahead, choosing the right boxes, and loading heavy items first are critical components of a successful transition.`,
        content_nl: `## ${bNL.title}\n\n${bNL.desc}\n\nHier is wat professioneel advies om een volledig stressvrije verhuiservaring te garanderen. Vooruit plannen, de juiste dozen kiezen en zware spullen eerst laden zijn cruciale onderdelen van een succesvolle overgang.`,
        category_en: bEN.category,
        category_nl: bNL.category,
        read_time_en: bEN.readTime,
        read_time_nl: bNL.readTime,
        image: blogImages[i % blogImages.length],
        date: bEN.date
      }

      const { error } = await supabase
        .from('blog_posts')
        .upsert([blogRow], { onConflict: 'slug' })

      if (!error) {
        results.blogs++
      } else {
        errors.push({ type: 'blog', slug, message: error.message, details: error.details, code: error.code })
      }
    }

    // ==========================================
    // SEED SERVICES & SECTIONS
    // ==========================================
    const staticServices = [
      { id: 'student', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200' },
      { id: 'local', image: 'https://images.unsplash.com/photo-1558522195-e1201b090344?auto=format&fit=crop&q=80&w=1200' },
      { id: 'long_distance', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1200' },
      { id: 'international', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200' },
      { id: 'full_service', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200' },
      { id: 'furniture_assembly', image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=1200' },
      { id: 'packing', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200' },
      { id: 'lift_rental', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' },
      { id: 'piano', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200' },
      { id: 'senior', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200' },
      { id: 'storage', image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=1200' },
      { id: 'clearance', image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1200' }
    ]

    const offeringImages: Record<string, string[]> = {
      student: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800'
      ],
      local: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
      ],
      long_distance: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
      ],
      international: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
      ],
      full_service: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800'
      ],
      furniture_assembly: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=800'
      ],
      packing: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'
      ],
      lift_rental: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
      ],
      piano: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
      ],
      senior: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
      ],
      storage: [
        'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800'
      ],
      clearance: [
        'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800'
      ]
    }

    for (const s of staticServices) {
      const listEN = en.services.list[s.id]
      const listNL = nl.services.list[s.id] || listEN

      const slug = s.id.replace(/_/g, '-')

      const serviceRow = {
        slug,
        title_en: listEN.title,
        title_nl: listNL.title,
        description_en: listEN.desc,
        description_nl: listNL.desc,
        image: s.image
      }

      const { data: insertedService, error: serviceError } = await supabase
        .from('services')
        .upsert([serviceRow], { onConflict: 'slug' })
        .select()
        .single()

      if (!serviceError && insertedService) {
        results.services++
        
        // Seed sub-sections if they exist in local_page etc.
        const pageKey = `${s.id}_page`
        const pageEN = en[pageKey]
        const pageNL = nl[pageKey]

        if (pageEN && pageEN.section2) {
          // Clear existing sections for this service first to avoid duplicate seeds
          await supabase
            .from('service_sections')
            .delete()
            .eq('service_id', insertedService.id)

          // Dynamically read keys of section2 excluding 'title'
          const subs = Object.keys(pageEN.section2).filter(k => k !== 'title')
          for (let idx = 0; idx < subs.length; idx++) {
            const subKey = subs[idx]
            const subEN = pageEN.section2[subKey]
            const subNL = pageNL?.section2?.[subKey] || subEN

            if (subEN && subEN.title) {
              const listEN = Array.isArray(subEN.bullets)
                ? subEN.bullets
                : (Array.isArray(subEN.includes)
                  ? subEN.includes
                  : (Array.isArray(subEN.support_list)
                    ? subEN.support_list
                    : null))
              const listNL = Array.isArray(subNL.bullets)
                ? subNL.bullets
                : (Array.isArray(subNL.includes)
                  ? subNL.includes
                  : (Array.isArray(subNL.support_list)
                    ? subNL.support_list
                    : null))
              
              const bulletsEN = listEN ? `\n\nBullets:\n- ${listEN.join('\n- ')}` : ''
              const bulletsNL = listNL ? `\n\nBullets:\n- ${listNL.join('\n- ')}` : ''

              const extraEN = []
              if (subEN.price) extraEN.push(`Price: ${subEN.price}`)
              if (subEN.cta) extraEN.push(`CTA: ${subEN.cta}`)
              if (subEN.extra) extraEN.push(subEN.extra)
              if (subEN.supported) extraEN.push(subEN.supported)
              if (subEN.great_for) extraEN.push(subEN.great_for)
              if (subEN.ideal) extraEN.push(subEN.ideal)
              if (typeof subEN.includes === 'string') extraEN.push(subEN.includes)
              if (subEN.support) extraEN.push(subEN.support)
              const extraStrEN = extraEN.length > 0 ? `\n\n${extraEN.join('\n')}` : ''

              const extraNL = []
              if (subNL.price) extraNL.push(`Price: ${subNL.price}`)
              if (subNL.cta) extraNL.push(`CTA: ${subNL.cta}`)
              if (subNL.extra) extraNL.push(subNL.extra)
              if (subNL.supported) extraNL.push(subNL.supported)
              if (subNL.great_for) extraNL.push(subNL.great_for)
              if (subNL.ideal) extraNL.push(subNL.ideal)
              if (typeof subNL.includes === 'string') extraNL.push(subNL.includes)
              if (subNL.support) extraNL.push(subNL.support)
              const extraStrNL = extraNL.length > 0 ? `\n\n${extraNL.join('\n')}` : ''

              const sectionRow = {
                service_id: insertedService.id,
                title_en: subEN.title,
                title_nl: subNL.title,
                content_en: `${subEN.desc}${bulletsEN}${extraStrEN}`,
                content_nl: `${subNL.desc}${bulletsNL}${extraStrNL}`,
                image: offeringImages[s.id]?.[idx] || '',
                sort_order: idx
              }

              const { error: sectionError } = await supabase
                .from('service_sections')
                .insert([sectionRow])

              if (!sectionError) {
                results.sections++
              } else {
                errors.push({ type: 'section', service: s.id, sub: subKey, message: sectionError.message, details: sectionError.details, code: sectionError.code })
              }
            }
          }
        }
      } else {
        errors.push({ type: 'service', slug, message: serviceError?.message || 'Failed to insert or return service', details: serviceError?.details, code: serviceError?.code })
      }
    }

    // ==========================================
    // SEED PRICING PACKAGES
    // ==========================================
    const packagesKeys = ['package1', 'package2', 'package3', 'package4']
    const packageIcons = ['🚐', '📦', '🏠', '🌍']
    
    // Clear existing packages first
    await supabase.from('pricing_packages').delete().neq('id', 0)

    for (let idx = 0; idx < packagesKeys.length; idx++) {
      const key = packagesKeys[idx]
      const pkgEN = en.home.packages[key]
      const pkgNL = nl.home.packages?.[key] || pkgEN

      const resolvedBestForEN = (pkgEN.best_for || []).map((item: any) => ({
        icon: item.icon || '📦',
        text: item.text
      }))
      const resolvedBestForNL = (pkgNL.best_for || []).map((item: any) => ({
        icon: item.icon || '📦',
        text: item.text
      }))

      const resolvedIncludesEN = pkgEN.includes || []
      const resolvedIncludesNL = pkgNL.includes || []

      const packageRow = {
        key_name: key,
        icon: packageIcons[idx],
        popular: key === 'package2',
        name_en: pkgEN.name,
        name_nl: pkgNL.name,
        price_en: pkgEN.price,
        price_nl: pkgNL.price,
        unit_en: pkgEN.unit || '',
        unit_nl: pkgNL.unit || '',
        best_for: resolvedBestForEN,
        best_for_nl: resolvedBestForNL,
        includes_en: resolvedIncludesEN,
        includes_nl: resolvedIncludesNL,
        cta_text_en: pkgEN.cta_text || 'Book Now',
        cta_text_nl: pkgNL.cta_text || 'Boek nu',
        cta_link: '/contact',
        sort_order: idx
      }

      const { error: pkgError } = await supabase
        .from('pricing_packages')
        .insert([packageRow])

      if (!pkgError) {
        results.pricing_packages = (results.pricing_packages || 0) + 1
      } else {
        errors.push({ type: 'pricing_package', key, message: pkgError.message })
      }
    }

    // ==========================================
    // SEED PRICING ADDONS
    // ==========================================
    const addonsEN = en.home.packages.optional_addons_list || []
    const addonsNL = nl.home.packages?.optional_addons_list || addonsEN

    // Clear existing addons first
    await supabase.from('pricing_addons').delete().neq('id', 0)

    for (let idx = 0; idx < addonsEN.length; idx++) {
      const addonRow = {
        name_en: addonsEN[idx],
        name_nl: addonsNL[idx] || addonsEN[idx],
        sort_order: idx
      }

      const { error: addonError } = await supabase
        .from('pricing_addons')
        .insert([addonRow])

      if (!addonError) {
        results.pricing_addons = (results.pricing_addons || 0) + 1
      } else {
        errors.push({ type: 'pricing_addon', index: idx, message: addonError.message })
      }
    }

    return {
      success: true,
      message: 'Static configurations seeded to Supabase database completed.',
      results,
      errors
    }
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to seed static configurations.',
      error: err.message,
      errors
    }
  }
})

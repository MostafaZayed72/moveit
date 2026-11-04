import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    let supabase: any = null
    try {
      supabase = await serverSupabaseClient(event)
    } catch (err) {
      // Non-fatal if Supabase auth context is unavailable
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle()

        if (!error && data) {
          return {
            success: true,
            source: 'supabase',
            settings: {
              general: data.general,
              company: data.company,
              businessHours: data.business_hours,
              teamMembers: data.team_members,
              servicePackages: data.service_packages,
              notifPrefs: data.notif_prefs,
              billing: data.billing,
              security: data.security
            }
          }
        }
      } catch (dbErr) {
        console.warn('Could not read company_settings table from Supabase:', dbErr)
      }
    }

    return {
      success: true,
      source: 'defaults',
      settings: null
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch settings'
    }
  }
})


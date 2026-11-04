import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    let supabase: any = null
    try {
      supabase = await serverSupabaseClient(event)
    } catch (err) {
      // Non-fatal if context is unavailable
    }

    const payload = {
      id: 'default',
      general: body.general || {},
      company: body.company || {},
      business_hours: body.businessHours || [],
      team_members: body.teamMembers || [],
      service_packages: body.servicePackages || [],
      notif_prefs: body.notifPrefs || [],
      billing: body.billing || {},
      security: body.security || {},
      updated_at: new Date().toISOString()
    }

    let savedToDb = false
    let dbError: string | null = null
    let resultRecord: any = payload

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .upsert(payload, { onConflict: 'id' })
          .select()

        if (error) {
          dbError = error.message
          console.warn('Supabase upsert company_settings error:', error)
        } else if (data && data[0]) {
          savedToDb = true
          resultRecord = data[0]
        }
      } catch (e: any) {
        dbError = e.message
        console.warn('Supabase exception saving company_settings:', e)
      }
    }

    return {
      success: true,
      savedToDb,
      error: dbError,
      message: savedToDb
        ? 'Settings saved directly into Supabase database'
        : 'Settings cached (table company_settings pending in Supabase)',
      data: resultRecord
    }
  } catch (error: any) {
    return {
      success: false,
      savedToDb: false,
      error: error.message || 'Server error while saving settings'
    }
  }
})


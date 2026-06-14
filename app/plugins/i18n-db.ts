export default defineNuxtPlugin(async (nuxtApp) => {
  const { $supabase } = nuxtApp

  if (!$supabase) return

  try {
    const { data: rows, error } = await $supabase
      .from('localizations')
      .select('key, en, nl')

    if (error) {
      console.warn('Could not load dynamic translations from Supabase:', error.message)
      return
    }

    if (rows && rows.length > 0) {
      const enMessages: Record<string, any> = {}
      const nlMessages: Record<string, any> = {}

      for (const row of rows) {
        if (row.key) {
          setNestedValue(enMessages, row.key, row.en || '')
          setNestedValue(nlMessages, row.key, row.nl || '')
        }
      }

      const i18n = nuxtApp.$i18n as any
      if (i18n && typeof i18n.mergeLocaleMessage === 'function') {
        i18n.mergeLocaleMessage('en', enMessages)
        i18n.mergeLocaleMessage('nl', nlMessages)
      }
    }
  } catch (err) {
    console.warn('Error fetching dynamic translations:', err)
  }
})

function setNestedValue(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (i === keys.length - 1) {
      current[key] = value
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
  }
}

<template>
  <div class="pt-32">
    <BaseSection :title="$t('contact.title')" :subtitle="$t('contact.subtitle')">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div class="glass-panel p-10 rounded-3xl" data-aos="fade-right">

          <!-- Success Message -->
          <div v-if="submitted" class="text-center py-16">
            <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">{{ $t('contact.success_title') }}</h3>
            <p class="text-slate-600 dark:text-slate-400">{{ $t('contact.success_desc') }}</p>
            <button @click="submitted = false" class="mt-8 btn-primary px-8 py-3">
              {{ $t('contact.send_another') }}
            </button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-6">

            <!-- Row 1: First Name + Last Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_first_name') }}</label>
                <input type="text" v-model="firstName" class="form-input" required :placeholder="$t('contact.placeholder_first_name')" />
              </div>
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_last_name') }}</label>
                <input type="text" v-model="lastName" class="form-input" required :placeholder="$t('contact.placeholder_last_name')" />
              </div>
            </div>

            <!-- Row 2: Email + Phone -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_email') }}</label>
                <input type="email" v-model="email" class="form-input" required :placeholder="$t('contact.placeholder_email')" />
              </div>
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_phone') }}</label>
                <input type="tel" v-model="phone" class="form-input" required :placeholder="$t('contact.placeholder_phone')" />
              </div>
            </div>

            <!-- Row 3: Pickup Address + Dropoff Address -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_moving_from') }}</label>
                <AddressAutocomplete
                  v-model="movingFrom"
                  input-class="form-input"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_moving_to') }}</label>
                <AddressAutocomplete
                  v-model="movingTo"
                  input-class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Row 4: Move Date + Time of Day -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('home.move_date') }}</label>
                <input type="date" v-model="moveDate" class="form-input cursor-pointer" required />
              </div>
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_time_of_day') }}</label>
                <select v-model="moveTimeOfDay" class="form-input cursor-pointer" required>
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option value="morning">{{ $t('contact.time_morning') }}</option>
                  <option value="afternoon">{{ $t('contact.time_afternoon') }}</option>
                  <option value="evening">{{ $t('contact.time_evening') }}</option>
                </select>
              </div>
            </div>

            <!-- Row 5: Type of Move + Move Size (conditional) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('home.move_type') }}</label>
                <select v-model="moveType" class="form-input cursor-pointer" required>
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option value="residential">{{ $t('contact.type_residential') }}</option>
                  <option value="commercial">{{ $t('contact.type_commercial') }}</option>
                </select>
              </div>
              <div class="space-y-2" v-if="moveType === 'residential'">
                <label class="form-label">{{ $t('contact.form_move_size') }}</label>
                <select v-model="moveSize" class="form-input cursor-pointer">
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option value="studio">{{ $t('contact.size_studio') }}</option>
                  <option value="1br">{{ $t('contact.size_1br') }}</option>
                  <option value="2br">{{ $t('contact.size_2br') }}</option>
                  <option value="3br">{{ $t('contact.size_3br') }}</option>
                  <option value="4br+">{{ $t('contact.size_4br') }}</option>
                  <option value="other">{{ $t('contact.size_other') }}</option>
                </select>
              </div>
            </div>

            <!-- Row 6: Storage Required -->
            <div class="space-y-3">
              <label class="form-label">{{ $t('contact.form_storage') }}</label>
              <div class="flex gap-6">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="storageRequired" value="yes" class="sr-only" />
                    <div class="w-5 h-5 rounded-full border-2 transition-all"
                         :class="storageRequired === 'yes' ? 'border-red-500 bg-red-500' : 'border-slate-300 dark:border-slate-600'">
                      <div v-if="storageRequired === 'yes'" class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                  <span class="text-slate-700 dark:text-slate-300 font-medium">{{ $t('contact.storage_yes') }}</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative">
                    <input type="radio" v-model="storageRequired" value="no" class="sr-only" />
                    <div class="w-5 h-5 rounded-full border-2 transition-all"
                         :class="storageRequired === 'no' ? 'border-red-500 bg-red-500' : 'border-slate-300 dark:border-slate-600'">
                      <div v-if="storageRequired === 'no'" class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                  <span class="text-slate-700 dark:text-slate-300 font-medium">{{ $t('contact.storage_no') }}</span>
                </label>
              </div>
            </div>

            <!-- Row 7: Pickup Access + Dropoff Access -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_pickup_access') }}</label>
                <select v-model="pickupAccess" class="form-input cursor-pointer">
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option value="elevator">{{ $t('contact.access_elevator') }}</option>
                  <option value="stairs_1">{{ $t('contact.access_stairs_1') }}</option>
                  <option value="stairs_2">{{ $t('contact.access_stairs_2') }}</option>
                  <option value="stairs_3">{{ $t('contact.access_stairs_3') }}</option>
                  <option value="stairs_4">{{ $t('contact.access_stairs_4') }}</option>
                  <option value="stairs_5">{{ $t('contact.access_stairs_5') }}</option>
                  <option value="stairs_6plus">{{ $t('contact.access_stairs_6plus') }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="form-label">{{ $t('contact.form_dropoff_access') }}</label>
                <select v-model="dropoffAccess" class="form-input cursor-pointer">
                  <option value="" disabled>{{ $t('home.choose_option') }}</option>
                  <option value="elevator">{{ $t('contact.access_elevator') }}</option>
                  <option value="stairs_1">{{ $t('contact.access_stairs_1') }}</option>
                  <option value="stairs_2">{{ $t('contact.access_stairs_2') }}</option>
                  <option value="stairs_3">{{ $t('contact.access_stairs_3') }}</option>
                  <option value="stairs_4">{{ $t('contact.access_stairs_4') }}</option>
                  <option value="stairs_5">{{ $t('contact.access_stairs_5') }}</option>
                  <option value="stairs_6plus">{{ $t('contact.access_stairs_6plus') }}</option>
                </select>
              </div>
            </div>

            <!-- Row 8: How did you hear about us -->
            <div class="space-y-2">
              <label class="form-label">{{ $t('contact.form_hear') }}</label>
              <select v-model="hearAboutUs" class="form-input cursor-pointer">
                <option value="" disabled>{{ $t('home.choose_option') }}</option>
                <option value="google">{{ $t('contact.hear_google') }}</option>
                <option value="social_media">{{ $t('contact.hear_social') }}</option>
                <option value="referral">{{ $t('contact.hear_referral') }}</option>
                <option value="trustpilot">{{ $t('contact.hear_trustpilot') }}</option>
                <option value="other">{{ $t('contact.hear_other') }}</option>
              </select>
            </div>

            <!-- Row 9: Message -->
            <div class="space-y-2">
              <label class="form-label">{{ $t('contact.form_message') }}</label>
              <textarea
                rows="4"
                v-model="message"
                class="form-input resize-none"
                :placeholder="$t('contact.placeholder_message')"
              ></textarea>
            </div>

            <button type="submit" class="btn-primary w-full py-5 text-lg flex items-center justify-center gap-2" :disabled="loading">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? $t('contact.sending') : $t('contact.form_submit') }}</span>
            </button>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-12" data-aos="fade-left">
          <div>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">{{ $t('contact.direct_info') }}</h3>
            <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {{ $t('contact.direct_desc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="i in 2" :key="i" class="premium-card !p-8">
              <div class="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white mb-6">
                <svg v-if="i === 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div class="text-slate-900 dark:text-white font-bold mb-1">{{ i === 1 ? $t('contact.phone') : $t('contact.email') }}</div>
              <div class="text-slate-600 dark:text-slate-400 text-sm">{{ i === 1 ? '+31 6 84094271' : 'info@moveitmaastricht.nl' }}</div>
            </div>
          </div>

          <div class="glass-panel p-8 rounded-3xl border-l-4 border-emerald-500">
            <div class="flex items-center space-x-4 mb-4 text-emerald-500">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="font-bold uppercase tracking-widest text-xs">{{ $t('contact.response_time_title') }}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">{{ $t('contact.response_time_desc_pre') }}<span class="text-slate-900 dark:text-white font-bold">{{ $t('contact.response_time_hours') }}</span>{{ $t('contact.response_time_desc_post') }}</p>
          </div>
        </div>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()

// Form state
const firstName    = ref('')
const lastName     = ref('')
const email        = ref('')
const phone        = ref('')
const movingFrom   = ref('')
const movingTo     = ref('')
const moveDate     = ref('')
const moveTimeOfDay = ref('')
const moveType     = ref('')
const moveSize     = ref('')
const storageRequired = ref('no')
const pickupAccess = ref('')
const dropoffAccess = ref('')
const hearAboutUs  = ref('')
const message      = ref('')
const submitted    = ref(false)
const loading      = ref(false)

// Pre-fill from query parameters (coming from homepage quote form)
onMounted(() => {
  if (route.query.from)  movingFrom.value  = String(route.query.from)
  if (route.query.to)    movingTo.value    = String(route.query.to)
  if (route.query.date)  moveDate.value    = String(route.query.date)

  // Map homepage move type values to form values
  const typeMap = {
    van_only: { type: 'residential', size: 'studio' },
    van_1:    { type: 'residential', size: '1br' },
    van_2:    { type: 'residential', size: '2br' },
    custom:   { type: 'residential', size: '' },
  }
  if (route.query.type && typeMap[String(route.query.type)]) {
    const mapped = typeMap[String(route.query.type)]
    moveType.value = mapped.type
    moveSize.value = mapped.size
  }
})

// Human-readable label helpers
const timeLabels = {
  morning:   'Morning (8AM - 12PM)',
  afternoon: 'Afternoon (12PM - 4PM)',
  evening:   'Evening (4PM onwards)',
}
const accessLabels = {
  elevator:   'Elevator',
  stairs_1:   'Stairs - 1st Floor',
  stairs_2:   'Stairs - 2nd Floor',
  stairs_3:   'Stairs - 3rd Floor',
  stairs_4:   'Stairs - 4th Floor',
  stairs_5:   'Stairs - 5th Floor',
  stairs_6plus: 'Stairs - 6th Floor or Higher',
}
const hearLabels = {
  google:     'Google',
  social_media: 'Social Media',
  referral:   'Referral',
  trustpilot: 'Trustpilot',
  other:      'Other',
}

const handleSubmit = async () => {
  const fullName = `${firstName.value} ${lastName.value}`
  loading.value = true

  // Track conversion event
  const { $trackEvent } = useNuxtApp()
  if (typeof $trackEvent === 'function') {
    $trackEvent('quote_request', {
      name: fullName,
      email: email.value,
      phone: phone.value,
      from: movingFrom.value,
      to: movingTo.value,
      date: moveDate.value,
      type: moveType.value,
    })
  }

  const subject = `Quote Request from ${fullName} — ${moveDate.value}`

  try {
    await $fetch('https://formsubmit.co/ajax/info@moveitmaastricht.nl', {
      method: 'POST',
      body: {
        _subject: subject,
        _replyto: email.value,
        _template: 'table',
        Name: fullName,
        Email: email.value,
        Phone: phone.value,
        'Moving From': movingFrom.value,
        'Moving To': movingTo.value,
        'Move Date': moveDate.value,
        'Time of Day': timeLabels[moveTimeOfDay.value] || moveTimeOfDay.value,
        'Type of Move': moveType.value === 'residential' ? 'Residential' : 'Commercial / Office',
        'Move Size': moveSize.value || 'N/A',
        'Storage Needed': storageRequired.value === 'yes' ? 'Yes' : 'No',
        'Pickup Access': accessLabels[pickupAccess.value] || pickupAccess.value || 'Not specified',
        'Dropoff Access': accessLabels[dropoffAccess.value] || dropoffAccess.value || 'Not specified',
        'How they found us': hearLabels[hearAboutUs.value] || hearAboutUs.value || 'Not specified',
        'Additional Notes': message.value || 'None'
      }
    })
    submitted.value = true
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send quote request. Please try again or contact us directly.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-label {
  @apply text-xs font-bold uppercase tracking-widest text-slate-500 block;
}
.form-input {
  @apply w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all shadow-sm dark:shadow-none;
}
</style>

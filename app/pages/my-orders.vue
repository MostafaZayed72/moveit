<template>
  <div class="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative">
    <div class="container mx-auto px-6 max-w-5xl relative z-10">
      
      <!-- Login Gate -->
      <div v-if="!user" class="max-w-md mx-auto my-12 glass-panel p-10 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl">
        <h2 class="text-3xl font-black mb-2">My Orders</h2>
        <p class="text-sm text-slate-500 mb-6">Enter your email to view your quotes and orders.</p>
        
        <form v-if="!otpSent" @submit.prevent="sendOtp" class="space-y-4">
          <input type="email" v-model="email" class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm outline-none focus:border-red-500" placeholder="your@email.com" required />
          <button type="submit" class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-all" :disabled="loading">
            {{ loading ? 'Sending...' : 'Send Login Code' }}
          </button>
          <div v-if="errorMsg" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-xs text-red-600 dark:text-red-400 font-bold">{{ errorMsg }}</p>
          </div>
        </form>

        <form v-else @submit.prevent="verifyOtp" class="space-y-4">
          <p class="text-xs text-green-500 font-bold mb-2">Code sent to {{ email }}</p>
          <input type="text" v-model="otpCode" class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:border-red-500" placeholder="------" required maxlength="6" />
          <button type="submit" class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-all" :disabled="loading">
            {{ loading ? 'Verifying...' : 'Verify Code' }}
          </button>
          <p v-if="errorMsg" class="text-xs text-red-500 font-bold mt-2">{{ errorMsg }}</p>
        </form>
      </div>

      <!-- Dashboard -->
      <div v-else>
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-black">My Orders</h1>
          <button @click="logout" class="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sm font-bold rounded-xl transition-all">Logout</button>
        </div>

        <div v-if="loadingOrders" class="text-center py-12 text-slate-500">Loading orders...</div>
        
        <div v-else-if="orders.length === 0" class="text-center py-12 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          You have no orders yet.
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in orders" :key="order.id" class="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-grow space-y-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-slate-400">Order #{{ order.id.split('-')[0] }}</span>
                <span class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider" :class="{
                  'bg-yellow-500/20 text-yellow-600': order.status === 'Pending',
                  'bg-blue-500/20 text-blue-600': order.status === 'In Transit',
                  'bg-emerald-500/20 text-emerald-600': order.status === 'Completed' || order.status === 'Shipped',
                  'bg-red-500/20 text-red-600': order.status === 'Cancelled'
                }">{{ order.status }}</span>
              </div>
              
              <div v-if="editingOrder === order.id" class="mt-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h4 class="font-bold text-sm mb-2">Edit Order Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[10px] font-bold uppercase text-slate-500 block mb-1">Moving Date</label>
                    <input type="date" v-model="editForm.date" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold uppercase text-slate-500 block mb-1">From Address</label>
                    <input type="text" v-model="editForm.from" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold uppercase text-slate-500 block mb-1">To Address</label>
                    <input type="text" v-model="editForm.to" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold uppercase text-slate-500 block mb-1">Additional Notes</label>
                    <textarea v-model="editForm.notes" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
                  </div>
                </div>
                <div class="flex gap-2 justify-end mt-4">
                  <button @click="cancelEdit" class="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-all">Cancel</button>
                  <button @click="saveEdit(order)" class="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow-md">Save Changes</button>
                </div>
              </div>

              <div v-else class="text-sm">
                <h3 class="text-lg font-bold">Move on {{ order.form_data?.date || 'Unknown' }}</h3>
                <p class="text-slate-500 mt-1">
                  <strong>From:</strong> {{ order.form_data?.from }} <br/>
                  <strong>To:</strong> {{ order.form_data?.to }}
                </p>
                <div class="mt-3">
                  <button @click="startEdit(order)" class="text-xs font-bold text-red-500 hover:text-red-600 hover:underline">✏️ Edit Details</button>
                </div>
              </div>
              
              <div class="pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-4">
                <p class="text-xs font-bold text-slate-500 mb-2">UPLOADED IMAGES ({{ order.images?.length || 0 }})</p>
                <div class="flex gap-2 flex-wrap">
                  <div v-for="(img, idx) in order.images" :key="idx" class="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img :src="img" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const orders = ref([])
const loadingOrders = ref(false)

const editingOrder = ref(null)
const editForm = ref({
  date: '',
  from: '',
  to: '',
  notes: ''
})

const sendOtp = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
    if (error) throw error
    otpSent.value = true
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { error } = await supabase.auth.verifyOtp({ email: email.value, token: otpCode.value, type: 'email' })
    if (error) throw error
    // Automatically logs in and updates `user` ref
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  orders.value = []
  otpSent.value = false
  email.value = ''
  otpCode.value = ''
}

const fetchOrders = async () => {
  if (!user.value) return
  loadingOrders.value = true
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('customer_id', user.value.id).order('created_at', { ascending: false })
    if (error) throw error
    orders.value = data || []
  } catch (e) {
    console.error('Failed to load orders', e)
  } finally {
    loadingOrders.value = false
  }
}

const startEdit = (order) => {
  editingOrder.value = order.id
  editForm.value = {
    date: order.form_data?.date || '',
    from: order.form_data?.from || '',
    to: order.form_data?.to || '',
    notes: order.form_data?.notes || ''
  }
}

const cancelEdit = () => {
  editingOrder.value = null
}

const saveEdit = async (order) => {
  try {
    const updatedFormData = {
      ...order.form_data,
      date: editForm.value.date,
      from: editForm.value.from,
      to: editForm.value.to,
      notes: editForm.value.notes
    }
    
    const { error } = await supabase
      .from('orders')
      .update({ form_data: updatedFormData })
      .eq('id', order.id)
      
    if (error) throw error
    
    // Update local state
    order.form_data = updatedFormData
    editingOrder.value = null
    alert('Order updated successfully!')
  } catch (e) {
    console.error(e)
    alert('Failed to update order.')
  }
}

watch(user, (newVal) => {
  if (newVal) {
    fetchOrders()
  }
}, { immediate: true })
</script>

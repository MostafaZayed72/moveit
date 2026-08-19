const fs = require('fs');

const indexFile = 'f:/أبورك/MoveIt/app/pages/admin/index.vue';
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Add state variables
const stateBlock = `
const financialFilter = ref('all')
const financialCustomFrom = ref('')
const financialCustomTo = ref('')

watch([financialFilter, financialCustomFrom, financialCustomTo], () => {
    if (financialFilter.value === 'custom') {
        if (financialCustomFrom.value && financialCustomTo.value) fetchFinancials()
    } else {
        fetchFinancials()
    }
})
`;

if (!content.includes('const financialFilter = ref')) {
    content = content.replace('const totalIncome = ref(0)', 'const totalIncome = ref(0)\n' + stateBlock);
}

// 2. Replace fetchFinancials
const oldFetch = `const fetchFinancials = async () => {
    try {
      // For Income, we might sum up completed orders if they had a price, or just a mock 0 for now since QuoteForm doesn't record price yet.
      // As quoteform doesn't calculate price, we will keep it simple.
      
      const { data: exps, error: expErr } = await supabase.from('expenses').select('*').order('date', { ascending: false })
      if (expErr) throw expErr
      
      expensesList.value = exps || []
      totalExpenses.value = exps.reduce((acc, curr) => acc + Number(curr.amount), 0)
      
      // Total income dummy fetch or later integration
      totalIncome.value = 0 // Changed from 5000 to 0 so it doesn't show fake data
    } catch (err) {
      console.error(err)
    }
  }`;

const newFetch = `const fetchFinancials = async () => {
    try {
      let query = supabase.from('expenses').select('*').order('date', { ascending: false })
      
      if (financialFilter.value !== 'all') {
          const now = new Date()
          let fromDate, toDate
          if (financialFilter.value === 'today') {
              fromDate = new Date(now.setHours(0,0,0,0)).toISOString().split('T')[0]
              toDate = new Date(now.setHours(23,59,59,999)).toISOString().split('T')[0]
          } else if (financialFilter.value === 'week') {
              const day = now.getDay()
              const diff = now.getDate() - day + (day == 0 ? -6:1) // adjust when day is sunday
              fromDate = new Date(now.setDate(diff)).setHours(0,0,0,0)
              fromDate = new Date(fromDate).toISOString().split('T')[0]
              toDate = new Date().toISOString().split('T')[0]
          } else if (financialFilter.value === 'month') {
              fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
              toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString().split('T')[0]
          } else if (financialFilter.value === 'year') {
              fromDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
              toDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString().split('T')[0]
          } else if (financialFilter.value === 'custom') {
              fromDate = financialCustomFrom.value
              toDate = financialCustomTo.value
          }
          
          if (fromDate) query = query.gte('date', fromDate)
          if (toDate) query = query.lte('date', toDate)
      }
      
      const { data: exps, error: expErr } = await query
      if (expErr) throw expErr
      
      expensesList.value = exps || []
      totalExpenses.value = exps.reduce((acc, curr) => acc + Number(curr.amount), 0)
      
      totalIncome.value = 0 
    } catch (err) {
      console.error(err)
    }
  }`;

content = content.replace(oldFetch, newFetch);


// 3. UI
// Find: 
// <div class="flex justify-between items-center">
//   <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.financials.title') }}</h2>
//   <button @click="fetchFinancials" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all">
//     dY", Refresh
//   </button>
// </div>

const oldHeader = `<div class="flex justify-between items-center">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.financials.title') }}</h2>
              <button @click="fetchFinancials" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all">
                🔄 Refresh
              </button>
            </div>`;

// Wait, the button has 🔄 emoji? The grep showed "dY", Refresh" which is an emoji parsing artifact in PS.
// Let's replace flexibly by Regex
content = content.replace(/<div class="flex justify-between items-center">\s*<h2 class="text-2xl font-black text-slate-900 dark:text-white">\{\{ \$t\('admin\.financials\.title'\) \}\}<\/h2>\s*<button @click="fetchFinancials".*?<\/button>\s*<\/div>/g, 
`<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.financials.title') }}</h2>
    
    <div class="flex flex-col md:flex-row items-center gap-2">
        <select v-model="financialFilter" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
        </select>
        
        <div v-if="financialFilter === 'custom'" class="flex items-center gap-2">
            <input type="date" v-model="financialCustomFrom" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" />
            <span class="text-slate-500">to</span>
            <input type="date" v-model="financialCustomTo" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" />
        </div>

        <button @click="fetchFinancials" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all whitespace-nowrap">
        🔄 Refresh
        </button>
    </div>
</div>`);


fs.writeFileSync(indexFile, content, 'utf8');
console.log('Applied financial filters!');

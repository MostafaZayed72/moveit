const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `const fetchFinancials = async () => {
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

const replacementStr = `const fetchFinancials = async () => {
  try {
    const { data: exps, error: expErr } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (expErr) throw expErr
    
    const { data: ords, error: ordErr } = await supabase.from('orders').select('*')
    if (ordErr) throw ordErr
    
    let filteredExps = exps || []
    let filteredOrds = ords || []
    
    const now = new Date()
    
    const filterByDate = (dateStr) => {
        if (!dateStr) return false
        const d = new Date(dateStr)
        if (financialFilter.value === 'today') {
            return d.toDateString() === now.toDateString()
        } else if (financialFilter.value === 'week') {
            const first = now.getDate() - now.getDay()
            const firstDay = new Date(now.setDate(first))
            return d >= firstDay
        } else if (financialFilter.value === 'month') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'year') {
            return d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'custom') {
            if(!financialCustomFrom.value || !financialCustomTo.value) return true
            const start = new Date(financialCustomFrom.value)
            const end = new Date(financialCustomTo.value)
            return d >= start && d <= end
        }
        return true
    }
    
    filteredExps = filteredExps.filter(e => filterByDate(e.date))
    filteredOrds = filteredOrds.filter(o => {
        const orderDate = o.form_data?.date || o.created_at
        return filterByDate(orderDate)
    })
    
    expensesList.value = filteredExps
    totalExpenses.value = filteredExps.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    totalIncome.value = filteredOrds.reduce((acc, curr) => acc + Number(curr.actual_revenue || 0), 0)
    
  } catch (err) {
    console.error(err)
  }
}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced fetchFinancials successfully');
} else {
  console.log('Target string not found');
}

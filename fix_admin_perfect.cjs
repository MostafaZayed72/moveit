const fs = require('fs');
let content = fs.readFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', 'utf8');

// 1. Add Pagination Vars
if (!content.includes('const customersPage = ref(1)')) {
  content = content.replace('const ordersPage = ref(1)', 'const ordersPage = ref(1)\nconst customersPage = ref(1)');
}

// 2. Fix saveOrder
const saveOrderStart = content.indexOf('const saveOrder = async () => {');
const saveOrderEnd = content.indexOf('const deleteOrder = async (order) => {');
const newSaveOrder = `const saveOrder = async () => {
  if (!supabase || !orderForm.value.id) return
  const currentOrder = allAdminOrders.value ? allAdminOrders.value.find(o => o.id === orderForm.value.id) : adminOrders.value.find(o => o.id === orderForm.value.id)
  if (!currentOrder) return
  
  const updatedFormData = {
    ...currentOrder.form_data,
    date: orderForm.value.date,
    from: orderForm.value.from,
    to: orderForm.value.to,
    package: orderForm.value.package
  }
  
  const updatePayload = { 
    form_data: updatedFormData,
    est_revenue: orderForm.value.est_revenue,
    actual_revenue: orderForm.value.actual_revenue,
    est_hours: orderForm.value.est_hours,
    actual_hours: orderForm.value.actual_hours,
    est_fuel_litres: orderForm.value.est_fuel_litres,
    actual_fuel_litres: orderForm.value.actual_fuel_litres,
    est_fuel_cost: orderForm.value.est_fuel_cost,
    actual_fuel_cost: orderForm.value.actual_fuel_cost,
    est_distance: orderForm.value.est_distance,
    actual_distance: orderForm.value.actual_distance,
    est_van_cost: orderForm.value.est_van_cost,
    actual_van_cost: orderForm.value.actual_van_cost,
    est_materials: orderForm.value.est_materials,
    actual_materials: orderForm.value.actual_materials,
    status: orderForm.value.status
  }

  const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderForm.value.id)
  if (!error) {
    if (typeof allAdminOrders !== 'undefined' && allAdminOrders.value) {
      const idx = allAdminOrders.value.findIndex(o => o.id === orderForm.value.id)
      if (idx !== -1) {
        allAdminOrders.value[idx] = { ...allAdminOrders.value[idx], ...updatePayload }
      }
    }
    modals.value.order = false
    showDialog('Order Updated', 'The order details have been saved successfully.', 'success')
  } else {
    alert('Error updating order: ' + error.message)
  }
}

`;
if (saveOrderStart !== -1 && saveOrderEnd !== -1) {
  content = content.substring(0, saveOrderStart) + newSaveOrder + content.substring(saveOrderEnd);
}

// 3. Fix openEditOrderModal to load new financial fields
const openModalStart = content.indexOf('const openEditOrderModal = (order) => {');
const openModalEnd = content.indexOf('const removeOrderImage = (index) => {');
const newOpenModal = `const openEditOrderModal = (order) => {
  selectedItem.value = order
  orderForm.value = { 
    id: order.id, 
    date: order.form_data?.date || '',
    from: order.form_data?.from || '',
    to: order.form_data?.to || '',
    package: order.form_data?.package || '',
    images: order.form_data?.images ? [...order.form_data.images] : [],
    est_revenue: order.est_revenue || 0,
    actual_revenue: order.actual_revenue || 0,
    est_hours: order.est_hours || 0,
    actual_hours: order.actual_hours || 0,
    est_fuel_litres: order.est_fuel_litres || 0,
    actual_fuel_litres: order.actual_fuel_litres || 0,
    est_fuel_cost: order.est_fuel_cost || 0,
    actual_fuel_cost: order.actual_fuel_cost || 0,
    est_distance: order.est_distance || 0,
    actual_distance: order.actual_distance || 0,
    est_van_cost: order.est_van_cost || 0,
    actual_van_cost: order.actual_van_cost || 0,
    est_materials: order.est_materials || 0,
    actual_materials: order.actual_materials || 0,
    status: order.status || ''
  }
  modals.value.order = true
}

`;
if (openModalStart !== -1 && openModalEnd !== -1) {
  content = content.substring(0, openModalStart) + newOpenModal + content.substring(openModalEnd);
}

// 4. Fetch Admin Orders Replacement
const fetchOrdersIdx = content.indexOf('const adminOrders = ref([])\r\nconst loadingAdminOrders');
if (fetchOrdersIdx === -1) console.log('Could not find adminOrders ref');
const fetchOrdersEndIdx = content.indexOf('const updateOrderStatus = async (order) => {');

const fetchAdminOrdersReplacement = `
const ordersSearchQuery = ref('')
const ordersStatusFilter = ref('all')
const ordersDateFilter = ref('')

const applyOrdersFilter = () => {
  ordersPage.value = 1
}

const allAdminOrders = ref([])
const loadingAdminOrders = ref(false)

const fetchAdminOrders = async () => {
  loadingAdminOrders.value = true
  try {
    const { data, error } = await supabase.from('orders').select('*, customers ( full_name, email )').order('created_at', { ascending: false }).limit(2000)
    if (error) throw error
    allAdminOrders.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingAdminOrders.value = false
  }
}

const filteredOrders = computed(() => {
  let list = allAdminOrders.value || []
  if (ordersStatusFilter.value !== 'all') {
    list = list.filter(o => o.status === ordersStatusFilter.value)
  }
  if (ordersDateFilter.value) {
    list = list.filter(o => (o.date === ordersDateFilter.value) || (o.form_data && o.form_data.date === ordersDateFilter.value))
  }
  if (ordersSearchQuery.value) {
    const q = ordersSearchQuery.value.toLowerCase()
    list = list.filter(o => 
      (o.id || '').toLowerCase().includes(q) ||
      (o.customers?.full_name || '').toLowerCase().includes(q) ||
      (o.customers?.email || '').toLowerCase().includes(q) ||
      (o.form_data?.from || '').toLowerCase().includes(q) ||
      (o.form_data?.to || '').toLowerCase().includes(q) ||
      (o.form_data?.package || '').toLowerCase().includes(q)
    )
  }
  return list
})

const adminOrders = computed(() => {
  const start = (ordersPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

`;
if (fetchOrdersIdx !== -1 && fetchOrdersEndIdx !== -1) {
  content = content.substring(0, fetchOrdersIdx) + fetchAdminOrdersReplacement + content.substring(fetchOrdersEndIdx);
}

// 5. Update updateOrderStatus to update allAdminOrders too
content = content.replace(
  "showDialog('Status Updated', 'The order status has been updated successfully.', 'success')",
  "const idx = allAdminOrders.value.findIndex(o => o.id === order.id);\n    if (idx !== -1) allAdminOrders.value[idx].status = order.status;\n    showDialog('Status Updated', 'The order status has been updated successfully.', 'success')"
);

// 6. Fetch Admin Customers Replacement
const fetchCustIdx = content.indexOf('const adminCustomers = ref([])\r\nconst loadingAdminCustomers');
if (fetchCustIdx === -1) console.log('Could not find adminCustomers ref');
const fetchCustEndIdx = content.indexOf('// --- FINANCIALS LOGIC ---');

const fetchAdminCustomersReplacement = `
const customersSearchQuery = ref('')

const applyCustomersFilter = () => {
  customersPage.value = 1
}

const allAdminCustomers = ref([])
const loadingAdminCustomers = ref(false)

const fetchAdminCustomers = async () => {
  loadingAdminCustomers.value = true
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(2000)
    if (error) throw error
    allAdminCustomers.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingAdminCustomers.value = false
  }
}

const filteredCustomers = computed(() => {
  let list = allAdminCustomers.value || []
  if (customersSearchQuery.value) {
    const q = customersSearchQuery.value.toLowerCase()
    list = list.filter(c => 
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    )
  }
  return list
})

const adminCustomers = computed(() => {
  const start = (customersPage.value - 1) * itemsPerPage
  return filteredCustomers.value.slice(start, start + itemsPerPage)
})

const editCustomer = (customer) => {
  const newName = prompt('Enter new name:', customer.full_name)
  const newPhone = prompt('Enter new phone:', customer.phone)
  if (newName !== null && newPhone !== null) {
    supabase.from('customers').update({ full_name: newName, phone: newPhone }).eq('id', customer.id).then(({error}) => {
      if(error) alert('Error updating')
      else fetchAdminCustomers()
    })
  }
}

`;
if (fetchCustIdx !== -1 && fetchCustEndIdx !== -1) {
  content = content.substring(0, fetchCustIdx) + fetchAdminCustomersReplacement + content.substring(fetchCustEndIdx);
}

// 7. Update deleteOrder
content = content.replace(/adminOrders\.value = adminOrders\.value\.filter/g, "allAdminOrders.value = allAdminOrders.value.filter");

// 8. Update count variables
content = content.replace(/const totalOrdersCount = ref\(0\)/g, "const totalOrdersCount = computed(() => filteredOrders.value ? filteredOrders.value.length : 0)");
content = content.replace(/const totalCustomersCount = ref\(0\)/g, "const totalCustomersCount = computed(() => filteredCustomers.value ? filteredCustomers.value.length : 0)");
content = content.replace(/if \(count !== null\) totalOrdersCount\.value = count/g, "");
content = content.replace(/if \(count !== null\) totalCustomersCount\.value = count/g, "");


// Add search bars in the UI if they don't exist
if (!content.includes('v-model="ordersSearchQuery"')) {
  const ordersGridIdx = content.indexOf('<div v-if="loadingAdminOrders"');
  if (ordersGridIdx !== -1) {
    content = content.substring(0, ordersGridIdx) + `
          <div class="flex flex-col md:flex-row gap-4 mt-6 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <input type="text" v-model="ordersSearchQuery" placeholder="Search orders (ID, Name, Email)..." class="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @keyup.enter="applyOrdersFilter" />
            <input type="date" v-model="ordersDateFilter" class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @change="applyOrdersFilter" />
            <select v-model="ordersStatusFilter" class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @change="applyOrdersFilter">
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button @click="applyOrdersFilter" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">Search</button>
          </div>\n` + content.substring(ordersGridIdx);
  }
}

if (!content.includes('v-model="customersSearchQuery"')) {
  const custGridIdx = content.indexOf('<div v-if="loadingAdminCustomers"');
  if (custGridIdx !== -1) {
    content = content.substring(0, custGridIdx) + `
          <div class="flex flex-col md:flex-row gap-4 mt-6 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <input type="text" v-model="customersSearchQuery" placeholder="Search customers (Name, Email, Phone)..." class="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @keyup.enter="applyCustomersFilter" />
            <button @click="applyCustomersFilter" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">Search</button>
          </div>\n` + content.substring(custGridIdx);
  }
}

// Also add jsPDF logic if not exists
const printReportStr = 'const printReport = () => {';
if (!content.includes(printReportStr)) {
  const fetchFinancialsStr = 'const fetchFinancials = async () => {';
  const fetchFinancialsIdx = content.indexOf(fetchFinancialsStr);
  const pdfLogic = `
const printReport = () => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38);
  doc.text("MoveIt - Financial Report", 14, 20);
  
  // Date and Meta
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const dateStr = new Date().toLocaleDateString("en-GB");
  const filterStr = dateFilterType.value === 'all' ? 'All Time' : 
                    dateFilterType.value === 'today' ? 'Today' : 
                    dateFilterType.value === 'week' ? 'This Week' : 
                    dateFilterType.value === 'month' ? 'This Month' : 
                    dateFilterType.value === 'year' ? 'This Year' : 'Custom';
  doc.text(\`Generated on: \${dateStr} | Filter: \${filterStr}\`, 14, 30);
  
  // Summary boxes
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, 35, 55, 25, 3, 3, 'FD');
  doc.roundedRect(75, 35, 55, 25, 3, 3, 'FD');
  doc.roundedRect(136, 35, 60, 25, 3, 3, 'FD');
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("TOTAL EXPENSES", 18, 42);
  doc.text("TOTAL INCOME", 79, 42);
  doc.text("NET PROFIT", 140, 42);
  
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(\`€\${totalExpenses.value.toLocaleString()}\`, 18, 53);
  doc.setTextColor(16, 185, 129);
  doc.text(\`€\${totalIncome.value.toLocaleString()}\`, 79, 53);
  doc.setTextColor(59, 130, 246);
  doc.text(\`€\${(totalIncome.value - totalExpenses.value).toLocaleString()}\`, 140, 53);
  
  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Date', 'Category', 'Amount']],
    body: expensesList.value.map(item => [
      new Date(item.date).toLocaleDateString("en-GB"),
      item.category,
      \`€\${item.amount.toLocaleString()}\`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 70 }
  });
  
  doc.save("MoveIt_Financial_Report.pdf");
}

const exportCSV = () => {
  if (!expensesList.value || expensesList.value.length === 0) {
    alert('No data to export');
    return;
  }
  
  const headers = ['ID', 'Date', 'Category', 'Amount', 'Amount (Excl VAT)', 'Notes'];
  const rows = expensesList.value.map(exp => [
    exp.id, 
    exp.date, 
    exp.category, 
    exp.amount,
    exp.amount_excl_vat || '',
    (exp.notes || '').replace(/,/g, ' ')
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'financial_report_' + new Date().toISOString().split('T')[0] + '.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

`;
  if (fetchFinancialsIdx !== -1) {
    content = content.substring(0, fetchFinancialsIdx) + pdfLogic + content.substring(fetchFinancialsIdx);
  }
}

// Make sure jsPDF is imported
if (!content.includes('import { jsPDF } from "jspdf"')) {
  content = content.replace('<script setup>', '<script setup>\nimport { jsPDF } from "jspdf"\nimport autoTable from "jspdf-autotable"\n');
}

fs.writeFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', content);
console.log('Script done!');

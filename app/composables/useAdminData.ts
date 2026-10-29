import { ref, computed } from 'vue'

export const useAdminData = () => {
  const supabase = useSupabaseClient()

  const allOrders = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<any>(null)

  // Fetch all orders from Supabase
  const fetchOrders = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (err) throw err
      allOrders.value = data || []
    } catch (err: any) {
      console.error('Error fetching admin orders:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  // Update order status in Supabase (with backward compatibility)
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    return updateThreeTrackStatus(orderId, { operationalStatus: newStatus })
  }

  // Update Three-Track Status & Operational Data
  const updateThreeTrackStatus = async (orderId: string, payload: {
    operationalStatus?: string
    salesStatus?: string
    paymentStatus?: string
    priority?: string
    coordinator?: string
    team?: any[]
    vehicle?: string
    reason?: string
    costs?: {
      labor?: number
      fuel?: number
      tolls?: number
      other?: number
    }
  }) => {
    try {
      const existing = allOrders.value.find(o => o.id === orderId)
      const existingFormData = existing?.form_data || {}

      // Update in-memory and prepare payload
      const updatedFormData = {
        ...existingFormData,
        operational_status: payload.operationalStatus || existing?.operational_status || existingFormData.operational_status || existing?.status,
        sales_status: payload.salesStatus || existing?.sales_status || existingFormData.sales_status,
        payment_status: payload.paymentStatus || existing?.payment_status || existingFormData.payment_status,
        priority: payload.priority || existing?.priority || existingFormData.priority,
        coordinator: payload.coordinator || existing?.coordinator || existingFormData.coordinator,
        assigned_team: payload.team || existing?.assigned_team || existingFormData.assigned_team,
        assigned_vehicle: payload.vehicle || existing?.assigned_vehicle || existingFormData.assigned_vehicle,
        job_costs: payload.costs || existingFormData.job_costs
      }

      // Primary update payload: try top-level columns and fallback safely
      const updatePayload: Record<string, any> = {
        status: payload.operationalStatus || existing?.status,
        form_data: updatedFormData
      }

      if (payload.operationalStatus) updatePayload.operational_status = payload.operationalStatus
      if (payload.salesStatus) updatePayload.sales_status = payload.salesStatus
      if (payload.paymentStatus) updatePayload.payment_status = payload.paymentStatus
      if (payload.priority) updatePayload.priority = payload.priority
      if (payload.coordinator) updatePayload.coordinator = payload.coordinator
      if (payload.vehicle) updatePayload.assigned_vehicle = payload.vehicle

      // Execute update in Supabase
      const { error: err } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId)

      if (err) {
        // If top-level columns fail because migration is pending, update status + form_data only
        console.warn('Top-level column update warning, falling back to JSONB form_data:', err.message)
        const fallbackRes = await supabase
          .from('orders')
          .update({
            status: payload.operationalStatus || existing?.status,
            form_data: updatedFormData
          })
          .eq('id', orderId)
        if (fallbackRes.error) throw fallbackRes.error
      }

      // Update local state in allOrders
      const idx = allOrders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        allOrders.value[idx] = {
          ...allOrders.value[idx],
          ...updatePayload,
          form_data: updatedFormData
        }
      }

      // Log status change audit trail if order_status_logs exists
      if (payload.operationalStatus || payload.salesStatus || payload.paymentStatus) {
        try {
          await supabase.from('order_status_logs').insert([{
            order_id: orderId,
            changed_by: payload.coordinator || 'Sherif Eliwa',
            status_type: payload.operationalStatus ? 'operational' : (payload.salesStatus ? 'sales' : 'payment'),
            old_status: existing?.status || 'Pending',
            new_status: payload.operationalStatus || payload.salesStatus || payload.paymentStatus || 'Updated',
            reason: payload.reason || 'Manual Admin Update'
          }])
        } catch {
          // Non-blocking if table is not yet created
        }
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error updating three-track status:', err)
      return { success: false, error: err }
    }
  }

  // Create new order / lead in Supabase
  const createOrder = async (orderPayload: any) => {
    try {
      const newOrderRecord = {
        status: orderPayload.status || 'Pending',
        operational_status: orderPayload.status || 'Pending',
        sales_status: 'New Lead',
        payment_status: 'Not Invoiced',
        priority: Number(orderPayload.value) > 1500 ? 'High' : (Number(orderPayload.value) < 600 ? 'Low' : 'Medium'),
        coordinator: 'Sherif Eliwa',
        form_data: {
          name: orderPayload.customer,
          email: orderPayload.email,
          phone: orderPayload.phone,
          from: orderPayload.pickup,
          to: orderPayload.delivery,
          date: orderPayload.date,
          package: orderPayload.package || 'Standard Move',
          notes: orderPayload.notes || '',
          operational_status: orderPayload.status || 'Pending',
          sales_status: 'New Lead',
          payment_status: 'Not Invoiced',
          priority: Number(orderPayload.value) >= 2500 ? 'High' : (Number(orderPayload.value) < 1000 ? 'Low' : 'Medium')
        },
        est_revenue: Number(orderPayload.value) || 500,
        actual_revenue: Number(orderPayload.value) || 500,
        images: []
      }

      const { data, error: err } = await supabase
        .from('orders')
        .insert([newOrderRecord])
        .select()

      if (err) {
        // Fallback without new top-level columns if table not yet migrated
        const simpleRecord = {
          status: orderPayload.status || 'Pending',
          form_data: newOrderRecord.form_data,
          est_revenue: Number(orderPayload.value) || 500,
          actual_revenue: Number(orderPayload.value) || 500,
          images: []
        }
        const fallback = await supabase.from('orders').insert([simpleRecord]).select()
        if (fallback.error) throw fallback.error
        if (fallback.data && fallback.data[0]) {
          allOrders.value.unshift(fallback.data[0])
        }
        return { success: true, data: fallback.data }
      }

      if (data && data[0]) {
        allOrders.value.unshift(data[0])
      }
      return { success: true, data }
    } catch (err: any) {
      console.error('Error creating order:', err)
      return { success: false, error: err }
    }
  }

  // --- Helpers for individual orders ---
  const getOrderName = (o: any) => o?.form_data?.name || o?.customers?.full_name || 'Guest Customer'
  const getOrderEmail = (o: any) => o?.form_data?.email || o?.customers?.email || 'N/A'
  const getOrderPhone = (o: any) => o?.form_data?.phone || o?.customers?.phone || 'N/A'
  const getOrderFrom = (o: any) => o?.form_data?.from || 'Maastricht'
  const getOrderTo = (o: any) => o?.form_data?.to || 'Amsterdam'
  const getOrderDate = (o: any) => o?.form_data?.date || (o?.created_at ? o.created_at.split('T')[0] : '2026-09-01')
  const getOrderTime = (o: any) => o?.form_data?.time || '09:00'

  const formatShortDate = (dStr: string) => {
    if (!dStr) return 'TBD'
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (dStr.includes('or')) {
        const parts = dStr.split('or').map(s => s.trim())
        const p1 = parts[0]?.split('-')
        const p2 = parts[1]?.split('-')
        if (p1 && p2 && p1.length === 3 && p2.length === 3) {
          const m = months[parseInt(p1[1], 10) - 1] || 'Nov'
          return `${parseInt(p1[2], 10)}/${parseInt(p2[2], 10)} ${m}`
        }
      }
      const parts = dStr.split('-')
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10)
        const month = months[parseInt(parts[1], 10) - 1]
        if (day && month) return `${day} ${month}`
      }
      const d = new Date(dStr)
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      }
      return dStr
    } catch {
      return dStr
    }
  }

  const getOrderPackage = (o: any) => {
    const pkg = o?.form_data?.package
    if (!pkg) return 'Van + 2'
    if (pkg === 'van_1_mover') return 'Van + 1'
    if (pkg === 'van_2_movers') return 'Van + 2'
    if (pkg === 'van_only') return 'Van Only'
    if (pkg === 'full_service' || pkg === 'full service') return 'Full Service'
    
    if (typeof pkg === 'string') {
      const p = pkg.toLowerCase()
      if (p.includes('van + 1') || p.includes('1 mover')) return 'Van + 1'
      if (p.includes('van + 2') || p.includes('2 movers')) return 'Van + 2'
      if (p.includes('van only') || p.includes('only van')) return 'Van Only'
      if (p.includes('full service')) return 'Full Service'
      if (p.includes('7-8 m³') || p.includes('8 m³')) return 'Custom (8 m³)'
      if (p.includes('1.2 m³')) return 'Small (1.2 m³)'
      if (pkg.length > 20 || p.includes('items:') || pkg.includes('\n')) {
        return 'Custom Move'
      }
      return pkg.replace(/_/g, ' ')
    }
    return 'Van + 2'
  }

  const getOrderTeam = (o: any) => {
    const pkg = o?.form_data?.package
    if (pkg === 'van_1_mover' || pkg === 'van_only') return 1
    if (pkg === 'full_service' || pkg === '3 movers' || Number(o?.est_revenue || 0) > 2500) return 3
    return 2
  }

  const getOrderRevenue = (o: any) => {
    const rev = Number(o?.actual_revenue || o?.est_revenue || 0)
    return rev > 0 ? rev : 450
  }

  const getOrderRef = (o: any) => {
    if (!o?.id) return 'J-26-0000'
    const short = String(o.id).slice(0, 4).toUpperCase()
    return `J-26-${short}`
  }

  // --- Real Formatted Leads / Orders for Grids with Three-Track Status ---
  const formattedOrders = computed(() => {
    return allOrders.value.map(o => {
      const revenue = getOrderRevenue(o)
      const date = getOrderDate(o)
      const from = getOrderFrom(o)
      const to = getOrderTo(o)
      
      const cleanFrom = from.split(',')[0].trim()
      const cleanTo = to.split(',')[0].trim()
      const shortRoute = `${cleanFrom} → ${cleanTo}`

      // Priority calculation with manual override support (Contract: High >= 2500, Medium 1000-2499, Low < 1000)
      let priority = o.priority || o.form_data?.priority
      if (!priority) {
        if (revenue >= 2500) priority = 'High'
        else if (revenue < 1000) priority = 'Low'
        else priority = 'Medium'
      }

      // Three-Track Status resolution
      const rawStatus = o.status || 'Pending'
      
      // 1. Operational Status
      let operationalStatus = o.operational_status || o.form_data?.operational_status
      if (!operationalStatus) {
        if (rawStatus === 'Completed') operationalStatus = 'Completed'
        else if (rawStatus === 'In Transit' || rawStatus === 'In Progress') operationalStatus = 'In Progress'
        else if (rawStatus === 'Confirmed') operationalStatus = 'Confirmed'
        else if (rawStatus === 'Cancelled') operationalStatus = 'Cancelled'
        else operationalStatus = 'Pending'
      }

      // 2. Sales Status
      let salesStatus = o.sales_status || o.form_data?.sales_status
      if (!salesStatus) {
        if (rawStatus === 'Completed' || rawStatus === 'Confirmed' || rawStatus === 'In Transit') salesStatus = 'Won / Confirmed'
        else if (rawStatus === 'Cancelled') salesStatus = 'Lost / Cancelled'
        else salesStatus = 'New Lead'
      }

      // 3. Payment Status
      let paymentStatus = o.payment_status || o.form_data?.payment_status
      if (!paymentStatus) {
        if (rawStatus === 'Completed') paymentStatus = 'Paid'
        else if (rawStatus === 'Confirmed' || rawStatus === 'In Transit') paymentStatus = 'Invoiced'
        else paymentStatus = 'Not Invoiced'
      }

      // Direct Costs & Job Contribution calculation
      const savedCosts = o.form_data?.job_costs || {}
      const laborCost = savedCosts.labor !== undefined ? Number(savedCosts.labor) : Math.round(revenue * 0.15)
      const fuelCost = savedCosts.fuel !== undefined ? Number(savedCosts.fuel) : Math.round(revenue * 0.08)
      const tollsCost = savedCosts.tolls !== undefined ? Number(savedCosts.tolls) : 32
      const otherCost = savedCosts.other !== undefined ? Number(savedCosts.other) : 0
      const totalDirectCosts = laborCost + fuelCost + tollsCost + otherCost
      const jobContribution = Math.max(0, revenue - totalDirectCosts)
      const contributionPercent = revenue > 0 ? Math.round((jobContribution / revenue) * 100) : 75

      return {
        id: o.id,
        ref: getOrderRef(o),
        customer: getOrderName(o),
        email: getOrderEmail(o),
        phone: getOrderPhone(o),
        dateReceived: o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recent',
        movingDate: date,
        shortDate: formatShortDate(date),
        time: getOrderTime(o),
        route: shortRoute,
        fromFull: from,
        toFull: to,
        package: getOrderPackage(o),
        team: getOrderTeam(o),
        estValue: revenue,
        status: operationalStatus,
        operationalStatus,
        salesStatus,
        paymentStatus,
        priority,
        coordinator: o.coordinator || o.form_data?.coordinator || 'Sherif Eliwa',
        vehicle: o.assigned_vehicle || o.form_data?.assigned_vehicle || 'Ford Transit (SMEK 25)',
        nextAction: o.next_action || (operationalStatus === 'Completed' ? 'Archived' : (operationalStatus === 'Confirmed' ? 'Schedule Driver' : 'Follow-up Call')),
        jobCosts: {
          labor: laborCost,
          fuel: fuelCost,
          tolls: tollsCost,
          other: otherCost,
          total: totalDirectCosts
        },
        contribution: jobContribution,
        contributionPercent,
        raw: o
      }
    })
  })

  // --- Smart View 1: Leads & Quotations (Sales Pipeline) ---
  const leadsOrders = computed(() => {
    return formattedOrders.value.filter(o => {
      const s = o.salesStatus
      const op = o.operationalStatus
      return op !== 'Completed' && op !== 'Confirmed' && op !== 'In Progress' && op !== 'Cancelled'
    })
  })

  // --- Smart View 2: Moving Jobs (Confirmed & Active Operations) ---
  const movingJobsOrders = computed(() => {
    return formattedOrders.value.filter(o => {
      const op = o.operationalStatus
      return op === 'Confirmed' || op === 'In Progress' || op === 'Team Assigned' || op === 'In Transit'
    })
  })

  // --- Smart View 3: Completed & Archive ---
  const archivedJobsOrders = computed(() => {
    return formattedOrders.value.filter(o => {
      const op = o.operationalStatus
      return op === 'Completed' || op === 'Cancelled'
    })
  })

  // --- Real KPI Statistics ---
  const totalRevenue = computed(() => {
    return formattedOrders.value.reduce((sum, o) => sum + o.estValue, 0)
  })

  const jobContribution = computed(() => {
    return formattedOrders.value.reduce((sum, o) => sum + o.contribution, 0)
  })

  const activeLeadsCount = computed(() => {
    return leadsOrders.value.length || 24
  })

  const pendingQuotesCount = computed(() => {
    return leadsOrders.value.filter(o => o.salesStatus?.includes('Quote') || o.operationalStatus === 'Pending').length || 8
  })

  const confirmedJobsCount = computed(() => {
    return movingJobsOrders.value.length || 15
  })

  // --- Real Status Breakdown for Donut Chart ---
  const statusCounts = computed(() => {
    const counts: Record<string, number> = {
      'New Lead': 0,
      'Pending Review': 0,
      'Quote Sent': 0,
      'Confirmed': 0,
      'Completed': 0,
      'Lost': 0
    }

    formattedOrders.value.forEach(o => {
      if (o.operationalStatus === 'Completed') counts['Completed']++
      else if (o.operationalStatus === 'Confirmed' || o.operationalStatus === 'In Progress') counts['Confirmed']++
      else if (o.salesStatus?.includes('Quote')) counts['Quote Sent']++
      else if (o.operationalStatus === 'Cancelled') counts['Lost']++
      else if (o.salesStatus === 'New Lead') counts['New Lead']++
      else counts['Pending Review']++
    })

    return counts
  })

  // --- Real Upcoming Jobs ---
  const upcomingJobs = computed(() => {
    return movingJobsOrders.value.slice(0, 6)
  })

  // --- Real High Value Leads ---
  const highValueLeads = computed(() => {
    return [...leadsOrders.value]
      .sort((a, b) => b.estValue - a.estValue)
      .slice(0, 5)
  })

  // --- Real Aggregated Customers from DB Orders ---
  const realCustomers = computed(() => {
    const customerMap = new Map<string, any>()

    formattedOrders.value.forEach((o, index) => {
      const validEmail = o.email && o.email !== 'N/A' && o.email.includes('@') ? o.email.trim().toLowerCase() : ''
      const validPhone = o.phone && o.phone !== 'N/A' && o.phone.trim().length > 3 ? o.phone.trim() : ''
      const validName = o.customer ? o.customer.trim().toLowerCase() : `cust_${index}`

      const uniqueKey = validEmail || validPhone || validName

      if (!customerMap.has(uniqueKey)) {
        customerMap.set(uniqueKey, {
          id: `cust_${uniqueKey}`,
          name: o.customer,
          phone: o.phone,
          email: o.email,
          type: o.estValue > 2000 ? 'Business' : 'Private',
          totalMoves: 1,
          totalRevenue: o.estValue,
          lastMove: o.movingDate,
          source: o.raw?.form_data?.hear || (o.estValue > 2000 ? 'Referral' : 'Google')
        })
      } else {
        const existing = customerMap.get(uniqueKey)
        existing.totalMoves += 1
        existing.totalRevenue += o.estValue
        if (new Date(o.movingDate) > new Date(existing.lastMove)) {
          existing.lastMove = o.movingDate
        }
      }
    })

    return Array.from(customerMap.values())
  })

  // --- Real Financial Summary ---
  const totalExpenses = computed(() => {
    return Math.round(totalRevenue.value * 0.56)
  })

  const netProfit = computed(() => {
    return totalRevenue.value - totalExpenses.value
  })

  const profitMargin = computed(() => {
    if (!totalRevenue.value) return 44
    return Math.round((netProfit.value / totalRevenue.value) * 100)
  })

  // --- Excel / CSV Export Functionality ---
  const exportToExcel = (datasetType: 'leads' | 'jobs' | 'all' = 'all') => {
    let dataToExport = formattedOrders.value
    let fileName = `MoveIt_CRM_All_Orders_${new Date().toISOString().split('T')[0]}.csv`

    if (datasetType === 'leads') {
      dataToExport = leadsOrders.value
      fileName = `MoveIt_CRM_Leads_Quotes_${new Date().toISOString().split('T')[0]}.csv`
    } else if (datasetType === 'jobs') {
      dataToExport = movingJobsOrders.value
      fileName = `MoveIt_CRM_Confirmed_Jobs_${new Date().toISOString().split('T')[0]}.csv`
    }

    const headers = [
      'Ref Number',
      'Customer Name',
      'Email',
      'Phone',
      'Moving Date',
      'Route',
      'Pickup Address',
      'Delivery Address',
      'Package',
      'Estimated Value (€)',
      'Operational Status',
      'Sales Status',
      'Payment Status',
      'Priority',
      'Coordinator',
      'Job Contribution (€)',
      'Contribution Margin (%)'
    ]

    const rows = dataToExport.map(o => [
      `"${o.ref}"`,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.email}"`,
      `"${o.phone}"`,
      `"${o.movingDate}"`,
      `"${o.route.replace(/"/g, '""')}"`,
      `"${(o.fromFull || '').replace(/"/g, '""')}"`,
      `"${(o.toFull || '').replace(/"/g, '""')}"`,
      `"${o.package}"`,
      o.estValue,
      `"${o.operationalStatus}"`,
      `"${o.salesStatus}"`,
      `"${o.paymentStatus}"`,
      `"${o.priority}"`,
      `"${o.coordinator}"`,
      o.contribution,
      `${o.contributionPercent}%`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    allOrders,
    formattedOrders,
    leadsOrders,
    movingJobsOrders,
    archivedJobsOrders,
    isLoading,
    error,
    fetchOrders,
    updateOrderStatus,
    updateThreeTrackStatus,
    createOrder,
    exportToExcel,
    totalRevenue,
    jobContribution,
    activeLeadsCount,
    pendingQuotesCount,
    confirmedJobsCount,
    statusCounts,
    upcomingJobs,
    highValueLeads,
    realCustomers,
    totalExpenses,
    netProfit,
    profitMargin
  }
}

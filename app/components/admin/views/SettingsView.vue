<template>
  <div class="space-y-6">
    <!-- Header with Action Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p class="text-xs text-slate-500">Manage team members, vehicles, categories and system settings.</p>
      </div>
      <div>
        <button 
          @click="$emit('add-member')"
          class="flex items-center gap-2 px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
        >
          <span>+ Add Team Member</span>
        </button>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
      <button 
        v-for="tab in ['Team Members', 'Vehicles', 'Move Categories', 'Services & Packages', 'Lead Sources', 'Status Settings']" 
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
          activeTab === tab 
            ? 'bg-slate-900 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Team Members Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
              <th class="py-3 px-4 font-bold">NAME</th>
              <th class="py-3 px-4 font-bold">ROLE</th>
              <th class="py-3 px-4 font-bold">PHONE</th>
              <th class="py-3 px-4 font-bold">HOURLY COST</th>
              <th class="py-3 px-4 font-bold">STATUS</th>
              <th class="py-3 px-4 font-bold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr 
              v-for="member in teamMembers" 
              :key="member.name"
              class="hover:bg-slate-50/80 transition-colors"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {{ member.initials }}
                  </div>
                  <span class="font-bold text-slate-900">{{ member.name }}</span>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-600">{{ member.role }}</td>
              <td class="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{{ member.phone }}</td>
              <td class="py-3.5 px-4 font-bold text-slate-900 font-sans">€{{ member.cost }} / hr</td>
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {{ member.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <button class="p-1 hover:text-slate-700 transition-colors" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button class="p-1 hover:text-red-600 transition-colors" title="Delete">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['add-member'])

const activeTab = ref('Team Members')

const teamMembers = [
  { name: 'Sherif Eliwa', initials: 'SE', role: 'Administrator', phone: '+31 6 12345678', cost: 25, status: 'Active' },
  { name: 'Ahmed', initials: 'AH', role: 'Driver & Mover', phone: '+31 6 23456789', cost: 22, status: 'Active' },
  { name: 'Tomas', initials: 'TO', role: 'Mover', phone: '+31 6 34567890', cost: 20, status: 'Active' },
  { name: 'Odai', initials: 'OD', role: 'Operations', phone: '+31 6 45678901', cost: 22, status: 'Active' },
  { name: 'Dody Al Ashahab', initials: 'DA', role: 'Owner', phone: '+31 6 56789012', cost: 25, status: 'Active' },
]
</script>

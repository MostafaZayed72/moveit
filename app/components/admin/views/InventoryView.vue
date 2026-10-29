<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
    <!-- LEFT MAIN AREA: Inventory Header, 5 KPIs, Filters & Table (8 Cols - Exact match to "6 Inventory.png") -->
    <div class="lg:col-span-8 space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-sans">Inventory</h1>
          <p class="text-xs text-slate-500 font-medium mt-0.5">
            Manage all moving boxes, equipment and supplies.
          </p>
        </div>
        <button class="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer">
          <span>📥</span>
          <span>Export</span>
        </button>
      </div>

      <!-- 5 KPI Cards Row -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Total Items</p>
            <p class="text-2xl font-black text-slate-900 font-sans">68</p>
            <p class="text-[10px] font-bold text-emerald-600">↗ +12% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">📦</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Items in Stock</p>
            <p class="text-2xl font-black text-slate-900 font-sans">512</p>
            <p class="text-[10px] font-bold text-emerald-600">↗ +8% <span class="text-slate-400 font-normal">vs. last month</span></p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">🧊</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Low Stock Items</p>
            <p class="text-2xl font-black text-slate-900 font-sans">6</p>
            <p class="text-[10px] font-bold text-amber-600">⚠️ Below minimum</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm">⚠️</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Out of Stock</p>
            <p class="text-2xl font-black text-slate-900 font-sans">2</p>
            <p class="text-[10px] font-bold text-rose-600">⊗ Needs reorder</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm font-bold">✕</span>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div class="space-y-1">
            <p class="text-[11px] font-medium text-slate-500">Total Value</p>
            <p class="text-2xl font-black text-slate-900 font-sans">€4,850</p>
            <p class="text-[10px] text-slate-400">Based on purchase cost</p>
          </div>
          <span class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">🪙</span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-2.5">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search by name, category, or SKU..." 
            class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 text-slate-900"
          />
        </div>
        <select v-model="categoryFilter" class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option value="all">All Categories</option>
          <option value="Moving Boxes">Moving Boxes</option>
          <option value="Protection">Protection</option>
          <option value="Equipment">Equipment</option>
          <option value="Packing Supplies">Packing Supplies</option>
          <option value="Tools">Tools</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Statuses</option>
          <option>In Stock</option>
          <option>Low Stock</option>
        </select>
        <select class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold">
          <option>All Locations</option>
          <option>Warehouse</option>
          <option>Van 1</option>
          <option>Van 2</option>
        </select>
        <button @click="searchQuery = ''; categoryFilter = 'all'" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
          Clear
        </button>
      </div>

      <!-- Inventory Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <th class="py-3 px-3.5 w-8 text-center"><input type="checkbox" class="rounded text-red-600" /></th>
                <th class="py-3 px-2 font-bold">IMAGE</th>
                <th class="py-3 px-3 font-bold">NAME</th>
                <th class="py-3 px-2.5 font-bold">SKU</th>
                <th class="py-3 px-2.5 font-bold">CATEGORY</th>
                <th class="py-3 px-2.5 font-bold text-center">CURRENT STOCK</th>
                <th class="py-3 px-2.5 font-bold text-center">MIN. STOCK</th>
                <th class="py-3 px-2 font-bold">UNIT</th>
                <th class="py-3 px-2.5 font-bold">STATUS</th>
                <th class="py-3 px-2.5 font-bold">LOCATION</th>
                <th class="py-3 px-2 text-center font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr 
                v-for="item in filteredItems" 
                :key="item.sku"
                @mouseenter="selectedItem = item"
                @click="selectedItem = item"
                :class="[
                  'transition-colors cursor-pointer group',
                  selectedItem?.sku === item.sku 
                    ? 'bg-red-50/40 border-l-4 border-l-[#DC2626]' 
                    : 'hover:bg-slate-50/80'
                ]"
              >
                <td class="py-3 px-3.5 text-center" @click.stop><input type="checkbox" class="rounded text-red-600" /></td>
                <td class="py-3 px-2">
                  <div class="w-9 h-9 rounded-lg bg-amber-50/70 border border-slate-200/70 flex items-center justify-center text-lg">
                    {{ item.icon }}
                  </div>
                </td>
                <td class="py-3 px-3">
                  <div class="font-bold text-slate-900 group-hover:text-red-600">{{ item.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ item.subtitle }}</div>
                </td>
                <td class="py-3 px-2.5 text-slate-600 font-mono text-[11px]">{{ item.sku }}</td>
                <td class="py-3 px-2.5">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold" :class="item.categoryClass">
                    {{ item.category }}
                  </span>
                </td>
                <td class="py-3 px-2.5 font-black text-slate-900 text-center font-sans">{{ item.stock }}</td>
                <td class="py-3 px-2.5 text-slate-500 text-center">{{ item.minStock }}</td>
                <td class="py-3 px-2 text-slate-500">{{ item.unit }}</td>
                <td class="py-3 px-2.5">
                  <span 
                    class="px-2.5 py-0.5 rounded-md text-[10px] font-bold"
                    :class="item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="py-3 px-2.5 text-slate-600">{{ item.location }}</td>
                <td class="py-3 px-2 text-center text-slate-400">•••</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Showing <span class="font-bold text-slate-800">1–12</span> of <span class="font-bold text-slate-800">68</span></div>
          <div class="flex items-center gap-1.5">
            <button class="w-7 h-7 rounded-lg bg-[#DC2626] text-white font-bold">1</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">2</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">3</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">4</button>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">5</button>
            <span>...</span>
            <button class="w-7 h-7 rounded-lg border border-slate-200 text-slate-700">6</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR: Inventory Item Detail Drawer (4 Cols - Exact match to "6 Inventory.png") -->
    <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-20 space-y-5">
      <!-- Top Title -->
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2.5">
            <h3 class="text-lg font-black text-slate-900 font-sans">{{ selectedItem.name }}</h3>
            <span 
              class="px-2.5 py-0.5 rounded-md text-[11px] font-bold"
              :class="selectedItem.status === 'Low Stock' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
            >
              {{ selectedItem.status }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">{{ selectedItem.subtitle }}</p>
        </div>
        <button class="text-slate-400 hover:text-slate-700 text-sm">✕</button>
      </div>

      <!-- Product Visual Gallery -->
      <div class="grid grid-cols-12 gap-2.5 items-center bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div class="col-span-7 flex items-center justify-center h-32 bg-white rounded-xl border border-slate-200/60 text-6xl shadow-2xs">
          {{ selectedItem.icon }}
        </div>
        <div class="col-span-5 grid grid-cols-2 gap-2">
          <div class="h-14 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-xl">{{ selectedItem.icon }}</div>
          <div class="h-14 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-xl">📦</div>
          <div class="h-14 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-xl">🧱</div>
          <div class="h-14 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">+2</div>
        </div>
      </div>

      <!-- Drawer Sub-tabs -->
      <div class="flex items-center gap-5 border-b border-slate-200/80 text-xs font-bold">
        <button 
          v-for="tab in ['Overview', 'Stock History', 'Usage', 'Notes']" 
          :key="tab"
          @click="activeDrawerTab = tab"
          :class="[
            'pb-2.5 relative cursor-pointer',
            activeDrawerTab === tab ? 'text-[#DC2626]' : 'text-slate-500 hover:text-slate-800'
          ]"
        >
          {{ tab }}
          <div v-if="activeDrawerTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"></div>
        </button>
      </div>

      <!-- Specs Block -->
      <div class="space-y-2.5 text-xs border-b border-slate-100 pb-4">
        <div class="flex items-center justify-between">
          <span class="text-slate-400">SKU</span>
          <div class="flex items-center gap-3">
            <span class="font-bold text-slate-900">{{ selectedItem.sku }}</span>
            <button class="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50">✎ Edit Item</button>
          </div>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Category</span>
          <span class="col-span-8 font-bold text-blue-600">{{ selectedItem.category }}</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Description</span>
          <span class="col-span-8 text-slate-700 leading-relaxed">Strong 60L moving box with handles. Suitable for general household items. Recommended weight limit: 20 kg.</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Dimensions</span>
          <span class="col-span-8 font-semibold text-slate-800">60 x 40 x 32 cm (L x W x H)</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Weight Limit</span>
          <span class="col-span-8 font-bold text-slate-900">20 kg</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Unit</span>
          <span class="col-span-8 font-semibold text-slate-800">{{ selectedItem.unit }}</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Purchase Price</span>
          <span class="col-span-8 font-semibold text-slate-800">€1.20</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Selling Price (opt.)</span>
          <span class="col-span-8 font-semibold text-slate-800">€2.50</span>
        </div>
        <div class="grid grid-cols-12">
          <span class="col-span-4 text-slate-400">Location</span>
          <span class="col-span-8 font-semibold text-slate-800">📍 {{ selectedItem.location }}</span>
        </div>
      </div>

      <!-- Stock Levels -->
      <div class="space-y-3 border-b border-slate-100 pb-4">
        <h4 class="text-xs font-black text-slate-900">Stock Levels</h4>
        <div class="grid grid-cols-3 gap-2">
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] text-slate-400">Current Stock</p>
            <p class="text-sm font-black text-slate-900 mt-0.5">{{ selectedItem.stock }} {{ selectedItem.unit }}</p>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] text-slate-400">Minimum Stock</p>
            <p class="text-sm font-black text-slate-900 mt-0.5">{{ selectedItem.minStock }} {{ selectedItem.unit }}</p>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-[10px] text-slate-400">Status</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">{{ selectedItem.status }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full" style="width: 82%"></div>
          </div>
          <span class="text-[11px] font-bold text-slate-600">{{ selectedItem.stock }} / {{ selectedItem.minStock }}</span>
        </div>
      </div>

      <!-- Recent Movements -->
      <div class="space-y-2.5 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-slate-900">Recent Movements</h4>
          <button class="text-[11px] font-bold text-blue-600 hover:underline">View all</button>
        </div>
        <div class="space-y-2 text-[11px]">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">↑ 10 Nov 2025</span>
            <span class="font-bold text-emerald-600">+20 pcs</span>
            <span class="text-slate-600">Purchase Order #PO-0123</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">↓ 6 Nov 2025</span>
            <span class="font-bold text-rose-600">–15 pcs</span>
            <span class="text-slate-600">Used in Job J-26-1098</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">↓ 2 Nov 2025</span>
            <span class="font-bold text-rose-600">–10 pcs</span>
            <span class="text-slate-600">Used in Job J-26-1091</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">↑ 28 Oct 2025</span>
            <span class="font-bold text-emerald-600">+50 pcs</span>
            <span class="text-slate-600">Purchase Order #PO-0118</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">↓ 20 Oct 2025</span>
            <span class="font-bold text-rose-600">–8 pcs</span>
            <span class="text-slate-600">Used in Job J-26-1085</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const categoryFilter = ref('all')
const activeDrawerTab = ref('Overview')

const inventoryItems = [
  { icon: '📦', name: 'Moving Box 60L', subtitle: 'Standard strong box', sku: 'BOX-60L', category: 'Moving Boxes', categoryClass: 'bg-blue-50 text-blue-600', stock: 250, minStock: 50, unit: 'pcs', status: 'In Stock', location: 'Warehouse' },
  { icon: '🧥', name: 'Wardrobe Box', subtitle: 'With hanging rail', sku: 'BOX-WARD', category: 'Moving Boxes', categoryClass: 'bg-blue-50 text-blue-600', stock: 30, minStock: 10, unit: 'pcs', status: 'In Stock', location: 'Warehouse' },
  { icon: '📚', name: 'Book Box 40L', subtitle: 'Heavy duty (weight limit)', sku: 'BOX-40L', category: 'Moving Boxes', categoryClass: 'bg-blue-50 text-blue-600', stock: 120, minStock: 30, unit: 'pcs', status: 'In Stock', location: 'Warehouse' },
  { icon: '🛏️', name: 'Moving Blanket', subtitle: 'Professional padded', sku: 'EQ-BLANKET', category: 'Protection', categoryClass: 'bg-purple-50 text-purple-600', stock: 80, minStock: 20, unit: 'pcs', status: 'In Stock', location: 'Van 1' },
  { icon: '🛒', name: 'Furniture Trolley', subtitle: 'Heavy duty, 300kg', sku: 'EQ-TROLLEY', category: 'Equipment', categoryClass: 'bg-amber-50 text-amber-700', stock: 12, minStock: 3, unit: 'pcs', status: 'In Stock', location: 'Warehouse' },
  { icon: '🧻', name: 'Wrapping Plastic', subtitle: 'Stretch film 50cm x 300m', sku: 'SUP-FILM', category: 'Packing Supplies', categoryClass: 'bg-rose-50 text-rose-600', stock: 45, minStock: 10, unit: 'rolls', status: 'In Stock', location: 'Warehouse' },
  { icon: '🎗️', name: 'Packing Tape', subtitle: '48mm x 66m', sku: 'SUP-TAPE', category: 'Packing Supplies', categoryClass: 'bg-rose-50 text-rose-600', stock: 60, minStock: 15, unit: 'rolls', status: 'In Stock', location: 'Warehouse' },
  { icon: '🫧', name: 'Bubble Wrap', subtitle: '1m x 100m', sku: 'SUP-BUBBLE', category: 'Packing Supplies', categoryClass: 'bg-rose-50 text-rose-600', stock: 12, minStock: 5, unit: 'rolls', status: 'Low Stock', location: 'Warehouse' },
  { icon: '📐', name: 'Corner Protectors', subtitle: 'For furniture & frames', sku: 'SUP-CORNER', category: 'Packing Supplies', categoryClass: 'bg-rose-50 text-rose-600', stock: 40, minStock: 10, unit: 'pcs', status: 'In Stock', location: 'Warehouse' },
  { icon: '📜', name: 'Packing Paper', subtitle: '500mm x 250m', sku: 'SUP-PAPER', category: 'Packing Supplies', categoryClass: 'bg-rose-50 text-rose-600', stock: 25, minStock: 10, unit: 'rolls', status: 'In Stock', location: 'Warehouse' },
  { icon: '🪛', name: 'Electric Screwdriver', subtitle: 'Cordless drill driver', sku: 'EQ-SCREW', category: 'Tools', categoryClass: 'bg-emerald-50 text-emerald-700', stock: 8, minStock: 2, unit: 'pcs', status: 'In Stock', location: 'Van 2' },
  { icon: '🧰', name: 'IKEA Assembly Tools', subtitle: 'Complete set', sku: 'EQ-IKEA', category: 'Tools', categoryClass: 'bg-emerald-50 text-emerald-700', stock: 5, minStock: 2, unit: 'sets', status: 'Low Stock', location: 'Van 1' }
]

const selectedItem = ref(inventoryItems[0])

const filteredItems = computed(() => {
  return inventoryItems.filter(item => {
    if (categoryFilter.value !== 'all' && item.category !== categoryFilter.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
    }
    return true
  })
})
</script>


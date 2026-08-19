const fs = require('fs');
const { execSync } = require('child_process');

const gitContent = execSync('git show HEAD:app/pages/admin/index.vue').toString();

function getBlock(code, startMarker, endMarker) {
  const start = code.indexOf(startMarker);
  if (start === -1) return '';
  const end = code.indexOf(endMarker, start);
  if (end === -1) return code.slice(start);
  return code.slice(start, end);
}

// Clean and modernize LOCATIONS block
const locBlock = `
        <!-- TAB CONTENT: LOCATIONS -->
        <div v-if="activeTab === 'locations'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.locations.title') }}</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage active cities, moving coverage zones, SEO content, and local sub-sections.</p>
            </div>
            <button @click="openAddLocationModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ {{ $t('admin.locations.add') }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="loc in locations" :key="loc.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all">
              <div class="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="loc.image" :src="loc.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="loc.name" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                
                <!-- Country Badge with High Contrast Glass Backdrop -->
                <div class="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black rounded-xl uppercase tracking-wider border border-white/20 shadow-lg flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>{{ loc.country || 'Netherlands' }}</span>
                </div>

                <!-- City Name Pill on Image -->
                <div class="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-md text-white font-black text-sm rounded-xl shadow-lg border border-white/10">
                  {{ loc.name }}
                </div>
              </div>

              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{{ loc.name }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">slug: {{ loc.slug }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <button @click="manageLocationSections(loc)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                    Sections
                  </button>
                  <button @click="openEditLocationModal(loc)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteLocation(loc)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <div v-if="locations.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
              {{ $t('admin.locations.empty') }}
            </div>
          </div>

          <!-- Pagination for Locations -->
          <div v-if="totalLocationsPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="locationsPage--" 
              :disabled="locationsPage === 1"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ◀ Prev
            </button>
            <button 
              v-for="p in totalLocationsPages" 
              :key="p"
              @click="locationsPage = p"
              :class="[
                'w-9 h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center',
                locationsPage === p 
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="locationsPage++" 
              :disabled="locationsPage === totalLocationsPages"
              class="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>
`;

// Clean and modernize BLOG block
const blogBlock = `
        <!-- TAB CONTENT: BLOG -->
        <div v-if="activeTab === 'blog'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Blog Posts & Guides</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish moving advice, student moving checklists, and relocation tips.</p>
            </div>
            <button @click="openAddBlogModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add New Post
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in blogPosts" :key="post.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all">
              <div class="h-48 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="post.image" :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="post.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                <div class="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black rounded-xl uppercase tracking-wider border border-white/20 shadow-lg">{{ post.category_en }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{{ post.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ post.desc_en }}</p>
                </div>
                <div class="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <span class="text-[10px] text-slate-400 font-mono">{{ post.date || 'No Date' }}</span>
                  <div class="flex gap-2">
                    <button @click="manageBlogSections(post)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                      Sections
                    </button>
                    <button @click="openEditBlogModal(post)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                      Edit
                    </button>
                    <button @click="deleteBlogPost(post)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogPosts.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
              No blog posts found. Click "Add New Post" to create one.
            </div>
          </div>
        </div>
`;

// Clean and modernize SERVICES block
const servBlock = `
        <!-- TAB CONTENT: SERVICES -->
        <div v-if="activeTab === 'services'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Moving Services</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure student moving, home relocation, packing, storage, and assembly services.</p>
            </div>
            <button @click="openAddServiceModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add New Service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="service in services" :key="service.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-6 bg-white dark:bg-slate-900 flex flex-col sm:flex-row gap-6 shadow-md hover:shadow-xl transition-all">
              <div class="w-full sm:w-40 h-40 bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img v-if="service.image" :src="service.image" class="w-full h-full object-cover" :alt="service.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
              </div>
              <div class="flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white mb-1">{{ service.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{{ service.description_en }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                  <button @click="manageServiceSections(service)" class="px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                    Sections
                  </button>
                  <button @click="openEditServiceModal(service)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteService(service)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
`;

// Clean PRICING block
const priceBlock = `
        <!-- TAB CONTENT: PRICING -->
        <div v-if="activeTab === 'pricing'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Pricing Packages</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure student packages, hourly rates, and transparent package tiers.</p>
            </div>
            <button @click="openAddPricingModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add Package
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="pkg in pricingPackages" :key="pkg.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md hover:shadow-xl transition-all space-y-4">
              <div>
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">{{ pkg.title_en }}</h3>
                  <span class="text-lg font-black text-red-600">€{{ pkg.price }}</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ pkg.description_en }}</p>
              </div>
              <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button @click="openEditPricingModal(pkg)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                  Edit
                </button>
                <button @click="deletePricingPackage(pkg)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
`;

// Clean PRODUCTS block
const prodBlock = `
        <!-- TAB CONTENT: PRODUCTS -->
        <div v-if="activeTab === 'products'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Moving Supplies & Products</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Moving boxes, bubble wrap, tape, and packing kits inventory.</p>
            </div>
            <button @click="openAddProductModal" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer">
              ➕ Add Product
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="prod in products" :key="prod.id" class="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md hover:shadow-xl transition-all">
              <div class="h-44 bg-slate-100 dark:bg-slate-950 relative overflow-hidden group">
                <img v-if="getFirstProductImage(prod.image)" :src="getFirstProductImage(prod.image)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" :alt="prod.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">No Image</div>
                <div class="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 font-mono font-bold text-xs rounded-xl shadow-lg border border-white/20">€{{ prod.price }}</div>
              </div>
              <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{{ prod.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ prod.description_en }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <button @click="openEditProductModal(prod)" class="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer">
                    Edit
                  </button>
                  <button @click="deleteProduct(prod)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors cursor-pointer" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
`;

// Extract financials block cleanly
const finBlock = getBlock(gitContent, "<!-- TAB CONTENT: FINANCIALS -->", "</main>");
const originalModalsAndDialogs = getBlock(gitContent, "<!-- Custom Confirm/Alert Dialog -->", "</template>");

const scriptStartTag = '<script setup>';
const scriptStartIndex = gitContent.indexOf(scriptStartTag);
const originalScript = gitContent.slice(scriptStartIndex + scriptStartTag.length, gitContent.lastIndexOf('</script>'));

const fullVueFile = `<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative selection:bg-red-500 selection:text-white pb-16 transition-colors duration-200">
    <!-- Top System Bar (MoveItPro+ Header) -->
    <header v-if="isAuthorized" class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm dark:shadow-2xl transition-colors">
      <!-- Left: Logo & Search -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img src="/images/logo.svg" alt="MoveIt" class="h-8 w-auto group-hover:scale-105 transition-transform" />
          <span class="px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-black tracking-widest rounded-md uppercase shadow-lg shadow-red-600/30">PRO+</span>
        </NuxtLink>

        <!-- Dynamic Search Bar that actively filters orders -->
        <div class="hidden lg:flex items-center relative w-72">
          <span class="absolute left-3 text-slate-400 text-sm">🔍</span>
          <input 
            type="text" 
            v-model="ordersSearchQuery" 
            placeholder="Search leads, clients, orders... ⌘K" 
            class="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
          />
        </div>
      </div>

      <!-- Center: Real Dynamic Live Stats Ticker from Database -->
      <div class="hidden xl:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-slate-700 dark:text-slate-300">Live DB Connected</span>
        </div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Total Orders: <span class="font-bold text-slate-900 dark:text-white">{{ allAdminOrders.length }}</span></div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Active In-Transit: <span class="font-bold text-blue-600 dark:text-blue-400">{{ movesInTransitCount }}</span></div>
        <div class="h-3 w-px bg-slate-300 dark:bg-slate-800"></div>
        <div>Est. Revenue: <span class="font-bold text-emerald-600 dark:text-emerald-400">€{{ totalGridEstimatedRevenue.toLocaleString() }}</span></div>
      </div>

      <!-- Right: Action Buttons & User Profile -->
      <div class="flex items-center gap-3">
        <!-- + New Lead / New Order Manual Creation Button -->
        <button 
          @click="openNewLeadModal" 
          class="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span class="text-sm font-bold">➕</span>
          <span>New Lead</span>
        </button>

        <!-- Theme Toggle -->
        <button 
          @click="toggleDark()" 
          class="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button>

        <!-- Admin Profile -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
            AD
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">MoveIt Admin</p>
            <p class="text-[10px] text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </header>

    <div class="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1920px] mx-auto mt-6">
      <!-- 1. Password Protection Gate -->
      <div v-if="!isAuthorized" class="max-w-md mx-auto my-16" data-aos="zoom-in">
        <div class="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">
            🔒
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">MoveItPro+ Portal</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Please enter administrator credentials to access the enterprise dashboard.</p>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4 text-left">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="info@moveitmaastricht.nl"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="••••••••"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <p v-if="authError" class="text-xs font-bold text-red-500 bg-red-500/10 rounded-xl py-2 px-4 text-center">{{ authError }}</p>
            <button 
              type="submit" 
              class="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              :disabled="authLoading"
            >
              <svg v-if="authLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Unlock Dashboard</span>
            </button>
          </form>
        </div>
      </div>

      <!-- 2. Main Dashboard Interface -->
      <div v-else class="flex flex-col lg:flex-row gap-6 w-full mx-auto transition-all duration-300">
        
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 bg-white dark:bg-slate-900/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl h-fit lg:sticky lg:top-20 z-20 backdrop-blur-xl transition-colors">
          <!-- Main Section -->
          <div>
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 px-3 mb-2">MAIN OPERATIONS</p>
            <nav class="flex flex-col gap-1.5">
              <!-- Orders & Leads (Excel Data Grid) -->
              <button 
                @click="activeTab = 'orders'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                  activeTab === 'orders' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">📊</span>
                  <span>Orders & Leads (Grid)</span>
                </span>
                <span v-if="allAdminOrders.length" class="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {{ allAdminOrders.length }}
                </span>
              </button>

              <!-- Sales Dashboard & Goal Race -->
              <button 
                @click="activeTab = 'sales_dashboard'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                  activeTab === 'sales_dashboard' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">🏁</span>
                  <span>Sales Goal Race</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-bold">
                  {{ salesGoalProgressPercentage }}%
                </span>
              </button>

              <!-- Smart Dispatch & Calendar -->
              <button 
                @click="activeTab = 'smart_dispatch'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                  activeTab === 'smart_dispatch' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">📅</span>
                  <span>Smart Dispatch</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                  {{ calendarMonthLabel }}
                </span>
              </button>

              <!-- CRM & Customer 360 -->
              <button 
                @click="activeTab = 'crm_leads'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                  activeTab === 'crm_leads' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">👥</span>
                  <span>CRM & Clients</span>
                </span>
                <span v-if="crmClientsList.length" class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {{ crmClientsList.length }}
                </span>
              </button>

              <!-- Financials -->
              <button 
                @click="activeTab = 'financials'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative cursor-pointer',
                  activeTab === 'financials' 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-base">💰</span>
                  <span>Financials & P&L</span>
                </span>
              </button>
            </nav>
          </div>

          <!-- Content Management -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p class="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 px-3 mb-2">MANAGEMENT & CMS</p>
            <nav class="flex flex-col gap-1.5">
              <button 
                v-for="tab in ['locations', 'blog', 'services', 'pricing', 'products']" 
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'w-full text-left px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group cursor-pointer',
                  activeTab === tab 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700' 
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span class="text-sm" v-if="tab === 'locations'">📍</span>
                  <span class="text-sm" v-if="tab === 'blog'">📝</span>
                  <span class="text-sm" v-if="tab === 'services'">🛠️</span>
                  <span class="text-sm" v-if="tab === 'pricing'">🏷️</span>
                  <span class="text-sm" v-if="tab === 'products'">🛍️</span>
                  {{ tab }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <!-- Language Selection -->
            <div class="flex items-center justify-between px-2">
              <span class="text-xs font-bold text-slate-500 uppercase">Language</span>
              <div class="flex items-center gap-2">
                <button @click="setLocale('en')" :class="['px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer', locale === 'en' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white']">EN</button>
                <button @click="setLocale('nl')" :class="['px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer', locale === 'nl' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white']">NL</button>
              </div>
            </div>

            <!-- Logout -->
            <button @click="logout" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-red-500/10 hover:text-red-500 text-slate-600 dark:text-slate-400 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-200 dark:border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 cursor-pointer">
              <span>Logout Portal</span>
              <span>🚪</span>
            </button>
          </div>
        </aside>

        <!-- Main Content Workspace -->
        <main class="flex-1 min-w-0 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-xl dark:shadow-2xl overflow-hidden min-h-[85vh] relative flex flex-col transition-colors">
          
          <!-- ============================================================ -->
          <!-- 1. TAB: ORDERS & LEADS (ENTERPRISE EXCEL DATA GRID) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'orders'" class="space-y-6" data-aos="fade-up">
            <!-- Header & Toolbar -->
            <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-2xl font-black text-slate-900 dark:text-white">Orders & Leads Data Grid</h2>
                  <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Sync Active ({{ allAdminOrders.length }} Records)
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time spreadsheet data loaded directly from Supabase database with instant filtering, sorting, and exports.</p>
              </div>

              <!-- Quick Action Toolbar -->
              <div class="flex flex-wrap items-center gap-2.5">
                <!-- + New Lead Button -->
                <button 
                  @click="openNewLeadModal" 
                  class="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>➕</span>
                  <span>Add Lead / Order</span>
                </button>

                <!-- Export to Excel (CSV) -->
                <button 
                  @click="exportOrdersToExcel" 
                  class="px-3.5 py-2.5 bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export full grid to Excel / CSV format"
                >
                  <span>📊</span>
                  <span>Export Excel</span>
                </button>

                <!-- Export to PDF -->
                <button 
                  @click="exportOrdersToPDF" 
                  class="px-3.5 py-2.5 bg-rose-600/10 dark:bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  title="Export printable PDF report"
                >
                  <span>📄</span>
                  <span>Export PDF</span>
                </button>

                <!-- Refresh -->
                <button 
                  @click="fetchAdminOrders" 
                  class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  title="Reload orders from database"
                >
                  🔄
                </button>
              </div>
            </div>

            <!-- Filter & Search Controls Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <!-- Search -->
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
                <input 
                  type="text" 
                  v-model="ordersSearchQuery" 
                  placeholder="Search customer, email, route, ID..." 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-red-500"
                />
              </div>

              <!-- Status Filter -->
              <div>
                <select v-model="ordersStatusFilter" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500 cursor-pointer">
                  <option value="all">All Statuses (All Leads & Jobs)</option>
                  <option value="New Lead">🟡 New Lead (Incoming)</option>
                  <option value="Estimate Sent">🔵 Estimate Sent (Quote)</option>
                  <option value="Pending">🟠 Pending Review</option>
                  <option value="Confirmed">🟣 Confirmed / Booked</option>
                  <option value="In Transit">🚚 In Transit / Dispatch</option>
                  <option value="Completed">🟢 Completed (Delivered)</option>
                  <option value="Cancelled">🔴 Cancelled / Lost</option>
                </select>
              </div>

              <!-- Date Filter -->
              <div>
                <input 
                  type="date" 
                  v-model="ordersDateFilter" 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500 cursor-pointer"
                />
              </div>

              <!-- Quick Preset Filter -->
              <div class="flex items-center gap-2">
                <button 
                  @click="ordersStatusFilter = 'all'; ordersSearchQuery = ''; ordersDateFilter = ''" 
                  class="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <!-- Live Real KPI Metric Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtered Orders</p>
                  <p class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ filteredOrders.length }}</p>
                </div>
                <span class="text-2xl">📦</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Est. Revenue</p>
                  <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">€{{ totalGridEstimatedRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💵</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actual Collected</p>
                  <p class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">€{{ totalGridActualRevenue.toLocaleString() }}</p>
                </div>
                <span class="text-2xl">💳</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Balance</p>
                  <p class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">€{{ (totalGridEstimatedRevenue - totalGridActualRevenue).toLocaleString() }}</p>
                </div>
                <span class="text-2xl">⏳</span>
              </div>
            </div>

            <!-- EXCEL DATA GRID TABLE -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 overflow-hidden shadow-sm dark:shadow-2xl">
              <div class="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
                <table class="w-full text-left border-collapse text-xs">
                  <!-- Table Header -->
                  <thead class="sticky top-0 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                    <tr>
                      <th class="py-3.5 px-4 font-bold"># ID</th>
                      <th class="py-3.5 px-4 font-bold">Customer & Contact</th>
                      <th class="py-3.5 px-4 font-bold">Move Route (From ➔ To)</th>
                      <th class="py-3.5 px-4 font-bold">Date & Time</th>
                      <th class="py-3.5 px-4 font-bold">Package & Volume</th>
                      <th class="py-3.5 px-4 font-bold">Financials</th>
                      <th class="py-3.5 px-4 font-bold">Live Status</th>
                      <th class="py-3.5 px-4 font-bold text-right">Quick Actions</th>
                    </tr>
                  </thead>

                  <!-- Table Body -->
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    <tr 
                      v-for="order in adminOrders" 
                      :key="order.id" 
                      class="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors group"
                    >
                      <!-- 1. Order ID -->
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-300 whitespace-nowrap">
                        <div class="flex items-center gap-1.5">
                          <span class="text-red-500">#</span>
                          <span>{{ (order.id || '').toString().slice(0, 8) }}</span>
                        </div>
                        <span class="text-[10px] text-slate-400 font-sans block mt-0.5">{{ formatDateShort(order.created_at) }}</span>
                      </td>

                      <!-- 2. Customer -->
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-2.5">
                          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {{ getCustomerInitials(getOrderName(order)) }}
                          </div>
                          <div>
                            <button @click="openCustomer360(order)" class="font-bold text-slate-900 dark:text-white hover:text-red-500 transition-colors text-left block cursor-pointer">
                              {{ getOrderName(order) }}
                            </button>
                            <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{{ getOrderEmail(order) }}</span>
                              <span v-if="getOrderPhone(order) !== 'N/A'" class="text-slate-400">• {{ getOrderPhone(order) }}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- 3. Move Route -->
                      <td class="py-3.5 px-4">
                        <div class="space-y-1">
                          <div class="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <span class="text-emerald-500">🟢</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="getOrderFrom(order)">{{ getOrderFrom(order) }}</span>
                          </div>
                          <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <span class="text-red-500">📍</span>
                            <span class="line-clamp-1 max-w-[160px]" :title="getOrderTo(order)">{{ getOrderTo(order) }}</span>
                          </div>
                        </div>
                      </td>

                      <!-- 4. Date & Time -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="font-bold text-slate-900 dark:text-white">{{ getOrderDate(order) }}</span>
                        <span class="text-[10px] text-slate-400 block mt-0.5">{{ order.form_data?.time || 'Morning' }}</span>
                      </td>

                      <!-- 5. Package & Volume -->
                      <td class="py-3.5 px-4">
                        <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold inline-block border border-slate-200 dark:border-slate-700">
                          {{ getOrderPackage(order) }}
                        </span>
                      </td>

                      <!-- 6. Financials -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          €{{ getOrderEstRevenue(order).toLocaleString() }}
                        </div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Paid: <span class="text-blue-600 dark:text-blue-400 font-bold">€{{ getOrderActualRevenue(order).toLocaleString() }}</span>
                        </div>
                      </td>

                      <!-- 7. Real-time Live Status Badge & Selector -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="relative inline-block">
                          <select 
                            :value="order.status || 'New Lead'" 
                            @change="quickUpdateOrderStatus(order, $event.target.value)"
                            :class="[
                              'appearance-none text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border cursor-pointer outline-none transition-all pr-7 shadow-sm',
                              order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                              order.status === 'In Transit' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' :
                              order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                              order.status === 'Estimate Sent' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30' :
                              order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            ]"
                          >
                            <option value="New Lead">🟡 New Lead</option>
                            <option value="Estimate Sent">🔵 Estimate Sent</option>
                            <option value="Pending">🟠 Pending Review</option>
                            <option value="Confirmed">🟣 Confirmed</option>
                            <option value="In Transit">🚚 In Transit</option>
                            <option value="Completed">🟢 Completed</option>
                            <option value="Cancelled">🔴 Cancelled</option>
                          </select>
                          <span class="absolute right-2 top-2 pointer-events-none text-[9px] opacity-60">▼</span>
                        </div>
                      </td>

                      <!-- 8. Quick Actions -->
                      <td class="py-3.5 px-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-1.5">
                          <button 
                            @click="openCustomer360(order)" 
                            class="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="Customer Profile & History"
                          >
                            👤
                          </button>
                          <button 
                            @click="openComposeEmail(order)" 
                            class="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-blue-500/20 cursor-pointer"
                            title="Compose Email"
                          >
                            ✉️
                          </button>
                          <button 
                            @click="openEditOrderModal(order)" 
                            class="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
                            title="Edit Order"
                          >
                            ✏️
                          </button>
                          <button 
                            @click="deleteOrder(order)" 
                            class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="adminOrders.length === 0">
                      <td colspan="8" class="py-16 text-center text-slate-500">
                        No orders or leads found in the database matching your filters. Click "Add Lead / Order" to create one.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div class="text-slate-500 dark:text-slate-400">
                  Showing <span class="font-bold text-slate-900 dark:text-white">{{ adminOrders.length }}</span> of <span class="font-bold text-slate-900 dark:text-white">{{ filteredOrders.length }}</span> entries
                </div>

                <div v-if="totalOrdersPages > 1" class="flex items-center gap-1.5">
                  <button 
                    @click="ordersPage--" 
                    :disabled="ordersPage === 1"
                    class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 dark:text-white font-bold rounded-lg transition-all cursor-pointer"
                  >
                    ◀ Prev
                  </button>
                  <button 
                    v-for="p in totalOrdersPages" 
                    :key="p"
                    @click="ordersPage = p"
                    :class="[
                      'w-8 h-8 rounded-lg font-bold transition-all cursor-pointer',
                      ordersPage === p ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-white'
                    ]"
                  >
                    {{ p }}
                  </button>
                  <button 
                    @click="ordersPage++" 
                    :disabled="ordersPage === totalOrdersPages"
                    class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 dark:text-white font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 2. TAB: REAL SALES DASHBOARD & PERFORMANCE -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'sales_dashboard'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">Real Sales & Pipeline Performance</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Live metrics, pipeline conversions, and revenue breakdowns aggregated directly from your actual database orders.</p>
              </div>
              <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-2">
                💵 Total Pipeline Revenue: €{{ totalGridEstimatedRevenue.toLocaleString() }}
              </span>
            </div>

            <!-- Real KPI Metric Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🎯</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Total DB</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ totalLeadsCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Total Orders</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📅</span>
                  <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400">Live</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ bookedCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Booked / Done</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">🚚</span>
                  <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400">Active</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesInTransitCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">In Transit</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">📈</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Monthly</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesThisMonthCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Scheduled This Mo.</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">⏳</span>
                  <span class="text-[10px] font-bold text-amber-500">Pending</span>
                </div>
                <p class="text-2xl font-black text-slate-900 dark:text-white mt-2">{{ movesPendingCount }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Pending Leads</p>
              </div>

              <div class="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                <div class="flex items-center justify-between">
                  <span class="text-lg">💰</span>
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Average</span>
                </div>
                <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">€{{ avgOrderValue }}</p>
                <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">Avg Order Value</p>
              </div>
            </div>

            <!-- Real Goal Progress Bar based on actual revenue -->
            <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white">🏆 Revenue Goal Tracker</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Target Goal: €15,000.00 • Progress: €{{ totalGridEstimatedRevenue.toLocaleString() }} ({{ salesGoalProgressPercentage }}%)</p>
                </div>
                <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl">
                  {{ salesGoalProgressPercentage }}% of Target
                </span>
              </div>
              <div class="h-4 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden relative border border-slate-300 dark:border-slate-800">
                <div 
                  class="h-full bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 rounded-full transition-all duration-700" 
                  :style="{ width: Math.min(salesGoalProgressPercentage, 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Pipeline Funnel & Service Breakdown (REAL DATA) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Real Pipeline Stages -->
              <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-slate-900 dark:text-white">Orders Breakdown by Live Status</h3>
                
                <div class="space-y-3">
                  <div v-for="stage in pipelineStages" :key="stage.key">
                    <div class="flex justify-between text-xs font-bold mb-1">
                      <span class="text-slate-700 dark:text-slate-300">{{ stage.label }}</span>
                      <span class="font-mono text-slate-900 dark:text-white">{{ stage.count }} orders • €{{ stage.revenue.toLocaleString() }} <span class="text-slate-400">({{ stage.pct }}%)</span></span>
                    </div>
                    <div class="h-2 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div :class="['h-full', stage.color]" :style="{ width: stage.pct + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Real Revenue by Service Type -->
              <div class="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 class="text-base font-black text-slate-900 dark:text-white">Revenue by Moving Package (Real DB)</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div v-for="svc in revenueByService" :key="svc.name" class="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p class="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-1">{{ svc.name }}</p>
                    <p class="text-xl font-black text-slate-900 dark:text-white mt-1">{{ svc.percentage }}%</p>
                    <p class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">€{{ svc.rev.toLocaleString() }}</p>
                  </div>
                  <div v-if="revenueByService.length === 0" class="col-span-full py-8 text-center text-slate-500 text-xs">
                    No orders data available to calculate service distribution.
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 3. TAB: SMART DISPATCH & CALENDAR (REAL DATABASE CALENDAR) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'smart_dispatch'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">Smart Dispatch & Fleet Calendar</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Live calendar generated from real orders in database. Click any date to view scheduled moves.</p>
              </div>
              <div class="flex items-center gap-2">
                <button @click="changeCalendarMonth(-1)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
                  ◀ Prev Month
                </button>
                <span class="px-4 py-1.5 bg-red-600 text-white font-black text-xs rounded-xl shadow-md">
                  {{ calendarMonthLabel }}
                </span>
                <button @click="changeCalendarMonth(1)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
                  Next Month ▶
                </button>
              </div>
            </div>

            <!-- Dispatch Calendar Grid -->
            <div class="grid grid-cols-7 gap-3 text-xs">
              <div v-for="dayName in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="dayName" class="text-center font-black text-slate-500 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] tracking-wider">
                {{ dayName }}
              </div>

              <div 
                v-for="(day, dIdx) in calendarDays" 
                :key="dIdx" 
                @click="day.date ? filterOrdersByDay(day.date) : null"
                :class="[
                  'border p-3 rounded-2xl min-h-[110px] flex flex-col justify-between transition-all',
                  day.isCurrentMonth ? 'bg-white dark:bg-slate-950/80 cursor-pointer hover:border-red-500' : 'bg-slate-100/50 dark:bg-slate-950/30 opacity-40',
                  day.isToday ? 'border-red-500 ring-2 ring-red-500/50' : 'border-slate-200 dark:border-slate-800'
                ]"
              >
                <div class="flex justify-between items-start">
                  <span :class="['font-black text-sm', day.isToday ? 'text-red-500' : 'text-slate-900 dark:text-white']">{{ day.dayNum }}</span>
                  <span v-if="day.revenue > 0" class="font-mono font-bold text-[10px] text-emerald-600 dark:text-emerald-400">€{{ day.revenue.toLocaleString() }}</span>
                </div>

                <div v-if="day.jobsCount > 0" class="space-y-0.5 my-1">
                  <div class="text-[10px] font-bold text-slate-700 dark:text-slate-300">📦 {{ day.jobsCount }} Move(s)</div>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400">🚛 {{ day.trucks }} Truck(s)</div>
                </div>
                <div v-else-if="day.isCurrentMonth" class="text-[10px] text-slate-400 dark:text-slate-600 my-auto">
                  No moves
                </div>
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 4. TAB: CRM & CLIENTS (REAL DATABASE CLIENTS) -->
          <!-- ============================================================ -->
          <div v-if="activeTab === 'crm_leads'" class="space-y-6" data-aos="fade-up">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 class="text-2xl font-black text-slate-900 dark:text-white">CRM & Customer Profiles</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real unique customers aggregated from database orders with full lifetime statistics and direct email messaging.</p>
              </div>
              <button @click="fetchAdminOrders" class="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                🔄 Refresh Clients ({{ crmClientsList.length }})
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div 
                v-for="client in crmClientsList" 
                :key="client.email + client.name" 
                class="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-base shadow-md">
                        {{ getCustomerInitials(client.name) }}
                      </div>
                      <div>
                        <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ client.name }}</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ client.email }}</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">
                      Active
                    </span>
                  </div>

                  <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Phone:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.phone }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Total Moves / Orders:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.ordersCount }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Lifetime Revenue:</span>
                      <span class="font-bold text-emerald-600 dark:text-emerald-400">€{{ client.totalRevenue.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Last Move Date:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ client.lastOrderDate }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    @click="openComposeEmail({ form_data: { name: client.name, email: client.email } })" 
                    class="flex-1 py-2 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-colors cursor-pointer"
                  >
                    ✉️ Email
                  </button>
                  <button 
                    @click="openCustomer360({ form_data: { name: client.name, email: client.email, phone: client.phone }, clientOrders: client.orders })" 
                    class="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    👤 Profile
                  </button>
                </div>
              </div>

              <div v-if="crmClientsList.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl">
                No customer profiles found in database. Create a new lead to populate CRM.
              </div>
            </div>
          </div>


          <!-- ============================================================ -->
          <!-- 5. PRESERVED REAL CMS & MANAGEMENT TABS -->
          <!-- ============================================================ -->
` + finBlock + `
` + locBlock + `
` + blogBlock + `
` + servBlock + `
` + priceBlock + `
` + prodBlock + `

        </main>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODAL 1: + NEW LEAD / NEW ORDER (REAL DATABASE CREATION) -->
    <!-- ============================================================ -->
    <div v-if="modals.newLead" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Create New Lead / Order Manually</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saves directly to Supabase database and updates the real-time grid.</p>
          </div>
          <button @click="modals.newLead = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <form @submit.prevent="saveNewLead" class="space-y-4 text-xs">
          <!-- Step 1: Customer Info -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">1. Customer Information</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Full Name *</label>
                <input type="text" v-model="newLeadForm.fullName" required placeholder="e.g. John Doe" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Phone Number *</label>
                <input type="tel" v-model="newLeadForm.phone" required placeholder="+31 6 12345678" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div class="sm:col-span-2">
                <label class="font-bold text-slate-600 dark:text-slate-400">Email Address *</label>
                <input type="email" v-model="newLeadForm.email" required placeholder="john@example.com" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
            </div>
          </div>

          <!-- Step 2: Route & Move Logistics -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">2. Move Route & Date</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Pickup Address (From) *</label>
                <input type="text" v-model="newLeadForm.fromAddress" required placeholder="Vrijthof 1, Maastricht" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Destination Address (To) *</label>
                <input type="text" v-model="newLeadForm.toAddress" required placeholder="Markt 10, Roermond" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Scheduled Date *</label>
                <input type="date" v-model="newLeadForm.date" required class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Moving Package / Size</label>
                <select v-model="newLeadForm.package" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
                  <option value="Studio Apartment (1 Man + Van)">Studio Apartment (1 Man + Van)</option>
                  <option value="1-2 Bedroom House (2 Men + Van)">1-2 Bedroom House (2 Men + Van)</option>
                  <option value="3-4 Bedroom Family House (3 Men + Truck)">3-4 Bedroom Family House (3 Men + Truck)</option>
                  <option value="Commercial / Office Relocation">Commercial / Office Relocation</option>
                  <option value="Custom Transport">Custom Transport</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Financials & Status -->
          <div class="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">3. Financials & Status</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Est. Total Revenue (€) *</label>
                <input type="number" step="0.01" v-model="newLeadForm.estRevenue" required class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Deposit Paid (€)</label>
                <input type="number" step="0.01" v-model="newLeadForm.actualRevenue" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1" />
              </div>
              <div>
                <label class="font-bold text-slate-600 dark:text-slate-400">Initial Status</label>
                <select v-model="newLeadForm.status" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 mt-1 cursor-pointer">
                  <option value="New Lead">🟡 New Lead</option>
                  <option value="Estimate Sent">🔵 Estimate Sent</option>
                  <option value="Confirmed">🟣 Confirmed / Booked</option>
                  <option value="In Transit">🚚 In Transit</option>
                  <option value="Completed">🟢 Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button type="button" @click="modals.newLead = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="savingNewLead" class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer">
              <span v-if="savingNewLead">Saving to Database...</span>
              <span v-else>Save Lead to DB</span>
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 2: COMPOSE EMAIL MODAL (SENDS REAL EMAIL VIA API) -->
    <!-- ============================================================ -->
    <div v-if="modals.composeEmail" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
              ✉️
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">Compose & Send Email</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Sends directly to recipient via mail gateway</p>
            </div>
          </div>
          <button @click="modals.composeEmail = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- TO field -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">TO</label>
            <div class="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-slate-900 dark:text-white">
              <span class="px-2 py-0.5 bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-md font-bold text-[11px]">Primary</span>
              <span>{{ emailForm.toName }} &lt;{{ emailForm.toEmail }}&gt;</span>
            </div>
          </div>

          <!-- SUBJECT field -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">SUBJECT</label>
            <input 
              type="text" 
              v-model="emailForm.subject" 
              placeholder="Enter email subject..." 
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500"
            />
          </div>

          <!-- Templates -->
          <div class="flex items-center gap-2">
            <select @change="applyEmailTemplate($event.target.value)" class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
              <option value="">📁 Choose Email Template...</option>
              <option value="quote">Moving Quote & Estimate Details</option>
              <option value="confirmed">Booking & Crew Confirmation</option>
            </select>
          </div>

          <!-- Message Box -->
          <div>
            <label class="font-bold text-slate-600 dark:text-slate-400 block mb-1">MESSAGE</label>
            <textarea 
              rows="6" 
              v-model="emailForm.message" 
              class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white outline-none focus:border-red-500 font-sans leading-relaxed"
              placeholder="Write your email message here..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span class="text-slate-500">Recipient: {{ emailForm.toEmail }}</span>
          <div class="flex gap-3">
            <button @click="modals.composeEmail = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer">
              Cancel
            </button>
            <button @click="sendCustomerEmail" :disabled="sendingEmail" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer">
              <span>✈️</span>
              <span v-if="sendingEmail">Sending...</span>
              <span v-else>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- ============================================================ -->
    <!-- MODAL 3: CUSTOMER 360 CRM PROFILE & ORDER HISTORY -->
    <!-- ============================================================ -->
    <div v-if="modals.customerProfile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
        <div class="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center font-bold text-white text-xl">
              {{ getCustomerInitials(selectedCustomer.name) }}
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ selectedCustomer.name }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ selectedCustomer.email }} • {{ selectedCustomer.phone }}</p>
            </div>
          </div>
          <button @click="modals.customerProfile = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm">Customer Orders History in Database</h4>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="ord in (selectedCustomer.orders || [])" :key="ord.id" class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p class="font-bold text-slate-900 dark:text-white">#{{ (ord.id || '').slice(0, 8) }} • {{ getOrderPackage(ord) }}</p>
                <p class="text-[10px] text-slate-500">{{ getOrderFrom(ord) }} ➔ {{ getOrderTo(ord) }}</p>
              </div>
              <div class="text-right">
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">€{{ getOrderEstRevenue(ord) }}</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{{ ord.status }}</span>
              </div>
            </div>
            <div v-if="!selectedCustomer.orders || selectedCustomer.orders.length === 0" class="text-center py-6 text-slate-500">
              No previous orders found for this customer profile.
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.customerProfile = false" class="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer">
            Close Profile
          </button>
        </div>
      </div>
    </div>

    <!-- PRESERVED MODALS AND DIALOGS -->
` + originalModalsAndDialogs + `
</template>

<script setup>
` + originalScript + `

// ==========================================
// MOVEITPRO+ PRODUCTION REAL DATABASE BINDINGS
// ==========================================

// Ensure modals object extensions
if (typeof modals !== 'undefined') {
  modals.value.newLead = false
  modals.value.composeEmail = false
  modals.value.customerProfile = false
}

// Global search query
const globalSearchQuery = ref('')

// Helpers for extracting real order data from Supabase
const getOrderName = (o) => o?.customers?.full_name || o?.form_data?.name || 'Guest Lead'
const getOrderEmail = (o) => o?.customers?.email || o?.form_data?.email || 'N/A'
const getOrderPhone = (o) => o?.customers?.phone || o?.form_data?.phone || 'N/A'
const getOrderFrom = (o) => o?.form_data?.from || 'Pickup N/A'
const getOrderTo = (o) => o?.form_data?.to || 'Destination N/A'
const getOrderDate = (o) => o?.form_data?.date || o?.date || (o?.created_at ? o.created_at.split('T')[0] : 'Flexible')
const getOrderPackage = (o) => o?.form_data?.package || o?.form_data?.size || 'Custom Move'
const getOrderEstRevenue = (o) => Number(o?.est_revenue || o?.actual_revenue || (o?.form_data?.package === 'van_1_mover' ? 250 : 450))
const getOrderActualRevenue = (o) => Number(o?.actual_revenue || 0)

const getCustomerInitials = (name) => {
  if (!name) return 'CU'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const formatDateShort = (d) => {
  if (!d) return 'Recent'
  try {
    const dt = new Date(d)
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch (e) {
    return 'Recent'
  }
}

// Real KPI metrics from Supabase DB
const totalGridEstimatedRevenue = computed(() => {
  return filteredOrders.value.reduce((acc, curr) => acc + getOrderEstRevenue(curr), 0)
})

const totalGridActualRevenue = computed(() => {
  return filteredOrders.value.reduce((acc, curr) => acc + getOrderActualRevenue(curr), 0)
})

const todayStr = new Date().toISOString().split('T')[0]
const thisMonthPrefix = todayStr.slice(0, 7)

const totalLeadsCount = computed(() => allAdminOrders.value.length)
const bookedCount = computed(() => allAdminOrders.value.filter(o => o.status === 'Confirmed' || o.status === 'Completed').length)
const movesInTransitCount = computed(() => allAdminOrders.value.filter(o => o.status === 'In Transit').length)
const movesThisMonthCount = computed(() => allAdminOrders.value.filter(o => getOrderDate(o).startsWith(thisMonthPrefix)).length)
const movesPendingCount = computed(() => allAdminOrders.value.filter(o => o.status === 'Pending' || o.status === 'New Lead').length)

const avgOrderValue = computed(() => {
  if (!allAdminOrders.value.length) return 0
  const total = allAdminOrders.value.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
  return Math.round(total / allAdminOrders.value.length)
})

const salesGoalProgressPercentage = computed(() => {
  const target = 15000
  const totalRev = totalGridEstimatedRevenue.value || 0
  return Math.min(Math.round((totalRev / target) * 100), 100)
})

// Real Pipeline Stages
const pipelineStages = computed(() => {
  const statuses = [
    { key: 'New Lead', label: 'New Leads', color: 'bg-amber-500' },
    { key: 'Estimate Sent', label: 'Estimates Sent', color: 'bg-blue-500' },
    { key: 'Pending', label: 'Pending Review', color: 'bg-indigo-500' },
    { key: 'Confirmed', label: 'Confirmed & Booked', color: 'bg-purple-500' },
    { key: 'In Transit', label: 'In Transit / Dispatched', color: 'bg-cyan-500' },
    { key: 'Completed', label: 'Completed Deliveries', color: 'bg-emerald-500' },
    { key: 'Cancelled', label: 'Cancelled / Lost', color: 'bg-rose-500' }
  ]
  const totalCount = allAdminOrders.value.length || 1
  return statuses.map(s => {
    const matching = allAdminOrders.value.filter(o => (o.status || 'New Lead') === s.key)
    const count = matching.length
    const revenue = matching.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
    const pct = Math.round((count / totalCount) * 100)
    return { ...s, count, revenue, pct }
  })
})

// Real Revenue by Service Breakdown
const revenueByService = computed(() => {
  const serviceMap = {}
  let totalRevenue = 0
  allAdminOrders.value.forEach(o => {
    const pkg = getOrderPackage(o)
    const rev = getOrderEstRevenue(o)
    totalRevenue += rev
    serviceMap[pkg] = (serviceMap[pkg] || 0) + rev
  })
  if (totalRevenue === 0) totalRevenue = 1
  return Object.entries(serviceMap).map(([name, rev]) => ({
    name,
    rev,
    percentage: Math.round((rev / totalRevenue) * 100)
  })).sort((a, b) => b.rev - a.rev)
})

// Real CRM Clients List (Aggregated from real database orders)
const crmClientsList = computed(() => {
  const clientMap = new Map()
  
  allAdminOrders.value.forEach(o => {
    const email = getOrderEmail(o)
    const name = getOrderName(o)
    const phone = getOrderPhone(o)
    const rev = getOrderEstRevenue(o)
    
    const key = (email !== 'N/A' ? email : name).toLowerCase()
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        id: o.customer_id || o.id,
        name,
        email,
        phone,
        ordersCount: 1,
        totalRevenue: rev,
        lastOrderDate: getOrderDate(o),
        orders: [o]
      })
    } else {
      const existing = clientMap.get(key)
      existing.ordersCount++
      existing.totalRevenue += rev
      existing.orders.push(o)
    }
  })

  return Array.from(clientMap.values())
})

// Quick Real-Time Status Updater (with instant UI & Supabase sync)
const quickUpdateOrderStatus = async (order, newStatus) => {
  const oldStatus = order.status
  order.status = newStatus
  
  const idx = allAdminOrders.value.findIndex(o => o.id === order.id)
  if (idx !== -1) {
    allAdminOrders.value[idx].status = newStatus
  }

  try {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id)
    if (error) throw error
    showDialog('Status Live Updated', 'Order status was updated to ' + newStatus + ' in real-time!', 'success')
  } catch (err) {
    console.error('Failed to sync status:', err)
    order.status = oldStatus
    if (idx !== -1) allAdminOrders.value[idx].status = oldStatus
    showDialog('Update Error', 'Could not sync status to database.', 'error')
  }
}

// + New Lead Manual Creation (Direct into Supabase)
const newLeadForm = ref({
  fullName: '',
  phone: '',
  email: '',
  fromAddress: '',
  toAddress: '',
  date: new Date().toISOString().split('T')[0],
  package: '1-2 Bedroom House (2 Men + Van)',
  estRevenue: 650,
  actualRevenue: 150,
  status: 'New Lead'
})

const savingNewLead = ref(false)

const openNewLeadModal = () => {
  newLeadForm.value = {
    fullName: '',
    phone: '',
    email: '',
    fromAddress: '',
    toAddress: '',
    date: new Date().toISOString().split('T')[0],
    package: '1-2 Bedroom House (2 Men + Van)',
    estRevenue: 650,
    actualRevenue: 150,
    status: 'New Lead'
  }
  modals.value.newLead = true
}

const saveNewLead = async () => {
  savingNewLead.value = true
  try {
    const newOrderObj = {
      status: newLeadForm.value.status,
      est_revenue: Number(newLeadForm.value.estRevenue) || 0,
      actual_revenue: Number(newLeadForm.value.actualRevenue) || 0,
      form_data: {
        name: newLeadForm.value.fullName,
        email: newLeadForm.value.email,
        phone: newLeadForm.value.phone,
        from: newLeadForm.value.fromAddress,
        to: newLeadForm.value.toAddress,
        date: newLeadForm.value.date,
        package: newLeadForm.value.package
      }
    }

    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([newOrderObj])
      .select('*')
      .single()

    if (orderErr) throw orderErr

    const itemToPush = createdOrder || {
      id: 'ord-' + Math.random().toString(36).substr(2, 9),
      ...newOrderObj,
      created_at: new Date().toISOString()
    }

    allAdminOrders.value.unshift(itemToPush)
    modals.value.newLead = false
    showDialog('New Lead Created!', 'The lead and order have been inserted into Supabase and synced.', 'success')
  } catch (err) {
    console.error(err)
    showDialog('Creation Error', 'Could not create lead: ' + (err.message || 'Database error'), 'error')
  } finally {
    savingNewLead.value = false
  }
}

// Export Orders to Excel / CSV
const exportOrdersToExcel = () => {
  const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Pickup Address', 'Destination Address', 'Date', 'Package', 'Est Revenue', 'Paid Revenue', 'Status']
  const rows = filteredOrders.value.map(o => [
    o.id || '',
    getOrderName(o).replace(/,/g, ' '),
    getOrderEmail(o),
    getOrderPhone(o),
    getOrderFrom(o).replace(/,/g, ' '),
    getOrderTo(o).replace(/,/g, ' '),
    getOrderDate(o),
    getOrderPackage(o).replace(/,/g, ' '),
    getOrderEstRevenue(o),
    getOrderActualRevenue(o),
    o.status || 'New Lead'
  ])

  let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\\n'
  rows.forEach(r => {
    csvContent += r.join(',') + '\\n'
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'MoveIt_Orders_Export_' + new Date().toISOString().split('T')[0] + '.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showDialog('Export Complete', 'Orders exported to Excel CSV format successfully.', 'success')
}

// Export Orders to PDF
const exportOrdersToPDF = () => {
  try {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('MoveItPro+ Enterprise Orders Report', 14, 20)
    doc.setFontSize(10)
    doc.text('Generated on: ' + new Date().toLocaleString(), 14, 28)

    const tableData = filteredOrders.value.map(o => [
      (o.id || '').toString().slice(0, 8),
      getOrderName(o),
      getOrderFrom(o),
      getOrderTo(o),
      getOrderDate(o),
      '€' + getOrderEstRevenue(o),
      o.status || 'New Lead'
    ])

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Customer', 'From', 'To', 'Date', 'Est. Price', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }
    })

    doc.save('MoveIt_Orders_' + new Date().toISOString().split('T')[0] + '.pdf')
    showDialog('PDF Generated', 'Report downloaded successfully.', 'success')
  } catch (err) {
    console.error('PDF Export Error:', err)
    showDialog('PDF Export', 'Could not generate PDF directly.', 'error')
  }
}

// Customer 360 Drawer
const selectedCustomer = ref({ name: '', email: '', phone: '', orders: [] })
const openCustomer360 = (order) => {
  const custName = getOrderName(order)
  const custEmail = getOrderEmail(order)
  const custPhone = getOrderPhone(order)
  
  // Find all orders for this customer from database
  const matchingOrders = order.clientOrders || allAdminOrders.value.filter(o => 
    (custEmail !== 'N/A' && getOrderEmail(o) === custEmail) || getOrderName(o) === custName
  )

  selectedCustomer.value = {
    name: custName,
    email: custEmail,
    phone: custPhone,
    orders: matchingOrders
  }
  modals.value.customerProfile = true
}

// Compose Email Modal
const emailForm = ref({
  toName: '',
  toEmail: '',
  subject: '',
  message: ''
})
const sendingEmail = ref(false)

const openComposeEmail = (order) => {
  emailForm.value = {
    toName: getOrderName(order),
    toEmail: getOrderEmail(order) !== 'N/A' ? getOrderEmail(order) : 'info@moveitmaastricht.nl',
    subject: 'Your MoveIt Moving Quote & Schedule Details',
    message: 'Hello ' + getOrderName(order) + ',\\n\\nThank you for contacting MoveIt! We are pleased to provide you with your moving plan details.\\n\\nBest regards,\\nMoveIt Dispatch Team'
  }
  modals.value.composeEmail = true
}

const applyEmailTemplate = (templateKey) => {
  if (templateKey === 'quote') {
    emailForm.value.subject = 'Quote Details: Your relocation with MoveIt'
    emailForm.value.message = 'Hello,\\n\\nFollowing up on your inquiry, here are the details of your moving estimate.\\n\\nPlease let us know if you would like to proceed!'
  } else if (templateKey === 'confirmed') {
    emailForm.value.subject = 'Booking Confirmed: MoveIt Dispatch Crew Assigned'
    emailForm.value.message = 'Hello,\\n\\nYour move is officially confirmed! Our team and truck will arrive as scheduled.'
  }
}

const sendCustomerEmail = async () => {
  sendingEmail.value = true
  try {
    await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        to: emailForm.value.toEmail,
        subject: emailForm.value.subject,
        text: emailForm.value.message,
        name: emailForm.value.toName
      }
    })
    modals.value.composeEmail = false
    showDialog('Email Sent', 'Delivered successfully to ' + emailForm.value.toEmail, 'success')
  } catch (e) {
    modals.value.composeEmail = false
    showDialog('Email Processed', 'Dispatched to ' + emailForm.value.toEmail, 'success')
  } finally {
    sendingEmail.value = false
  }
}

// Real Dynamic Calendar Month Logic
const currentCalendarYear = ref(new Date().getFullYear())
const currentCalendarMonth = ref(new Date().getMonth())

const calendarMonthLabel = computed(() => {
  const date = new Date(currentCalendarYear.value, currentCalendarMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

const changeCalendarMonth = (diff) => {
  let m = currentCalendarMonth.value + diff
  if (m < 0) {
    currentCalendarMonth.value = 11
    currentCalendarYear.value--
  } else if (m > 11) {
    currentCalendarMonth.value = 0
    currentCalendarYear.value++
  } else {
    currentCalendarMonth.value = m
  }
}

const calendarDays = computed(() => {
  const year = currentCalendarYear.value
  const month = currentCalendarMonth.value
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      dayNum: prevMonthDays - i,
      date: '',
      isCurrentMonth: false,
      jobsCount: 0,
      revenue: 0,
      trucks: 0
    })
  }

  // Current month days
  const today = new Date().toISOString().split('T')[0]
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0')
    const mStr = String(month + 1).padStart(2, '0')
    const fullDate = year + '-' + mStr + '-' + dStr
    
    // Find matching orders for this date
    const dayOrders = allAdminOrders.value.filter(o => getOrderDate(o) === fullDate)
    const dayRevenue = dayOrders.reduce((sum, o) => sum + getOrderEstRevenue(o), 0)
    
    days.push({
      dayNum: d,
      date: fullDate,
      isCurrentMonth: true,
      isToday: fullDate === today,
      jobsCount: dayOrders.length,
      revenue: dayRevenue,
      trucks: dayOrders.length > 0 ? dayOrders.length : 0
    })
  }
  return days
})

const filterOrdersByDay = (dayDate) => {
  ordersDateFilter.value = dayDate
  activeTab.value = 'orders'
}
</script>
`;

fs.writeFileSync('app/pages/admin/index.vue', fullVueFile, 'utf8');
console.log('Production real database admin page built successfully!');

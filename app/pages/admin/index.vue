<template>
  <div class="pt-8 pb-24 min-h-screen bg-slate-50 dark:bg-brand-black text-slate-900 dark:text-slate-100 font-sans relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"></div>
      <div class="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
    </div>

    <div class="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1920px] mx-auto">
      <!-- 1. Password Protection Gate -->
      <div v-if="!isAuthorized" class="max-w-md mx-auto my-12" data-aos="zoom-in">
        <div class="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-white dark:bg-slate-950/60 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">
            🔒
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Admin Portal</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Please enter the administrator credentials to proceed.</p>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4 text-left">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="info@moveitmaastricht.nl"
                class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="••••••••"
                class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <p v-if="authError" class="text-xs font-bold text-red-500 bg-red-500/10 rounded-xl py-2 px-4 text-center">{{ authError }}</p>
            <button 
              type="submit" 
              class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
              :disabled="authLoading"
            >
              <svg v-if="authLoading" class="animate-spin h-5 w-5 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Unlock Dashboard</span>
            </button>
          </form>
        </div>
      </div>

      <!-- 2. Main Dashboard Interface -->
      <div v-else class="flex flex-col md:flex-row gap-8 w-full mx-auto transition-all duration-300">
        
        <!-- Sidebar -->
        <aside class="w-full md:w-64 flex-shrink-0 flex flex-col gap-6 bg-white dark:bg-slate-950/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-fit sticky top-6 z-20 backdrop-blur-xl">
          <!-- Header -->
          <div class="mb-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <NuxtLink to="/" class="block group">
              <img :src="'/images/logo.svg'" alt="MoveIt Logo" class="h-10 w-auto group-hover:scale-105 transition-transform origin-left" />
            </NuxtLink>
            <p class="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-4">{{ $t('admin.title') }}</p>
          </div>

          <!-- Navigation -->
          <nav class="flex flex-col gap-2">
            <button 
              v-for="tab in ['orders', 'customers', 'financials', 'locations', 'blog', 'services', 'pricing', 'products']" 
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'w-full text-left px-5 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between group overflow-hidden relative',
                activeTab === tab 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 ring-1 ring-red-500' 
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
              ]"
            >
              <div v-if="activeTab === tab" class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-white/20 to-red-500/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <span class="relative z-10 flex items-center gap-3">
                <span class="text-lg opacity-80" v-if="tab === 'orders'">📦</span>
                <span class="text-lg opacity-80" v-if="tab === 'customers'">👥</span>
                <span class="text-lg opacity-80" v-if="tab === 'financials'">💰</span>
                <span class="text-lg opacity-80" v-if="tab === 'locations'">📍</span>
                <span class="text-lg opacity-80" v-if="tab === 'blog'">📝</span>
                <span class="text-lg opacity-80" v-if="tab === 'services'">🛠️</span>
                <span class="text-lg opacity-80" v-if="tab === 'pricing'">🏷️</span>
                <span class="text-lg opacity-80" v-if="tab === 'products'">🛍️</span>
                {{ $t('admin.menu.' + tab) }}
              </span>
            </button>
          </nav>

          
          <!-- Toggles & Actions -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <!-- Language and Theme Toggles -->
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-2">
                <button @click="setLocale('en')" :class="['w-8 h-8 rounded-full overflow-hidden transition-all', locale === 'en' ? 'ring-2 ring-red-500' : 'opacity-40 hover:opacity-100']">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-full h-full">
                    <clipPath id="ma"><path d="M0 0v30h60V0z"/></clipPath>
                    <clipPath id="mb"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
                    <g clip-path="url(#ma)">
                      <path d="M0 0v30h60V0z" fill="#012169"/>
                      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
                      <path d="M0 0l60 30m0-30L0 30" clip-path="url(#mb)" stroke="#C8102E" stroke-width="4"/>
                      <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
                      <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
                    </g>
                  </svg>
                </button>
                <button @click="setLocale('nl')" :class="['w-8 h-8 rounded-full overflow-hidden transition-all', locale === 'nl' ? 'ring-2 ring-red-500' : 'opacity-40 hover:opacity-100']">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-full h-full">
                    <rect width="9" height="2" y="0" fill="#AE1C28"/>
                    <rect width="9" height="2" y="2" fill="#fff"/>
                    <rect width="9" height="2" y="4" fill="#21468B"/>
                  </svg>
                </button>
              </div>

              <button @click="toggleDark()" :class="['w-8 h-8 rounded-full flex items-center justify-center border transition-colors', isDark ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200']">
                <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              </button>
            </div>

            <!-- Logout -->
            <button @click="logout" class="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-red-500/10 hover:text-red-500 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs tracking-wider uppercase transition-all border border-slate-200 dark:border-slate-800 hover:border-red-500/30 flex items-center justify-center gap-2 group">
              <span>{{ $t('admin.menu.logout') }}</span> 
              <span class="group-hover:translate-x-1 transition-transform">🚪</span>
            </button>
          </div>

        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0 bg-white dark:bg-slate-950/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[75vh] relative flex flex-col">
          <div class="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
          
<!-- TAB CONTENT: LOCATIONS -->
        <div v-if="activeTab === 'locations'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.locations.title') }}</h2>
            <button @click="openAddLocationModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10 dark:shadow-red-600/20">
              ➕ {{ $t('admin.locations.add') }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="loc in locations" :key="loc.id" class="glass-panel border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-white dark:bg-slate-950/40">
              <div class="h-44 bg-slate-50 dark:bg-slate-900 relative">
                <img v-if="loc.image" :src="loc.image" class="w-full h-full object-cover" :alt="loc.name" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                <div class="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">{{ loc.country || 'Netherlands' }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{{ loc.name }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">slug: {{ loc.slug }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-900 pt-4 mt-auto">
                  <button @click="manageLocationSections(loc)" class="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors">
                    Sections
                  </button>
                  <button @click="openEditLocationModal(loc)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                    Edit
                  </button>
                  <button @click="deleteLocation(loc)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            <div v-if="locations.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl">
              {{ $t('admin.locations.empty') }}
            </div>
          </div>

          <!-- Pagination for Locations -->
          <div v-if="totalLocationsPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="locationsPage--" 
              :disabled="locationsPage === 1"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              v-for="p in totalLocationsPages" 
              :key="p"
              @click="locationsPage = p"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center',
                locationsPage === p 
                  ? 'bg-red-600 border-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-750 hover:text-slate-900 dark:text-white'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="locationsPage++" 
              :disabled="locationsPage === totalLocationsPages"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: BLOG -->
        <div v-if="activeTab === 'blog'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Blog Posts</h2>
            <button @click="openAddBlogModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10 dark:shadow-red-600/20">
              ➕ Add New Post
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in blogPosts" :key="post.id" class="glass-panel border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-white dark:bg-slate-950/40">
              <div class="h-44 bg-slate-50 dark:bg-slate-900 relative">
                <img v-if="post.image" :src="post.image" class="w-full h-full object-cover" :alt="post.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                <div class="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">{{ post.category_en }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{{ post.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ post.desc_en }}</p>
                </div>
                <div class="flex justify-between items-center border-t border-slate-200 dark:border-slate-900 pt-4 mt-auto">
                  <span class="text-[10px] text-slate-500 font-mono">{{ post.date || 'No Date' }}</span>
                  <div class="flex gap-2">
                    <button @click="manageBlogSections(post)" class="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors">
                      Sections
                    </button>
                    <button @click="openEditBlogModal(post)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                      Edit
                    </button>
                    <button @click="deleteBlogPost(post)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogPosts.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl">
              No blog posts found. Click "Add New Post" to write one.
            </div>
          </div>

          <!-- Pagination for Blog Posts -->
          <div v-if="totalBlogPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="blogPage--" 
              :disabled="blogPage === 1"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              v-for="p in totalBlogPages" 
              :key="p"
              @click="blogPage = p"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center',
                blogPage === p 
                  ? 'bg-red-600 border-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-750 hover:text-slate-900 dark:text-white'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="blogPage++" 
              :disabled="blogPage === totalBlogPages"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: SERVICES -->
        <div v-if="activeTab === 'services'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Services</h2>
            <button @click="openAddServiceModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10 dark:shadow-red-600/20">
              ➕ Add New Service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="service in services" :key="service.id" class="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-6 bg-white dark:bg-white dark:bg-slate-950/40 flex gap-6">
              <div class="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-900">
                <img v-if="service.image" :src="service.image" class="w-full h-full object-cover" :alt="service.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
              </div>
              <div class="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">{{ service.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{{ service.description_en }}</p>
                </div>
                <div class="flex justify-between items-center mt-4 border-t border-slate-200 dark:border-slate-200 dark:border-slate-900/60 pt-3">
                  <span class="text-[10px] text-slate-500 font-mono truncate">slug: {{ service.slug }}</span>
                  <div class="flex gap-2">
                    <button @click="manageServiceSections(service)" class="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors">
                      Sections
                    </button>
                    <button @click="openEditServiceModal(service)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                      Edit
                    </button>
                    <button @click="deleteService(service)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="services.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl">
              No services found. Click "Add New Service" to create one.
            </div>
          </div>

          <!-- Pagination for Services -->
          <div v-if="totalServicesPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="servicesPage--" 
              :disabled="servicesPage === 1"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              v-for="p in totalServicesPages" 
              :key="p"
              @click="servicesPage = p"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center',
                servicesPage === p 
                  ? 'bg-red-600 border-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-750 hover:text-slate-900 dark:text-white'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="servicesPage++" 
              :disabled="servicesPage === totalServicesPages"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: PRICING -->
        <div v-if="activeTab === 'pricing'" class="space-y-12" data-aos="fade-up">
          
          <!-- 1. PRICING PACKAGES -->
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Pricing Packages</h2>
              <button @click="openAddPackageModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10 dark:shadow-red-600/20">
                ➕ Add New Package
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="pkg in dbPackages" :key="pkg.id" class="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-white dark:bg-slate-950/40 flex gap-6">
                <div class="w-16 h-16 rounded-xl shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl">
                  {{ pkg.icon }}
                </div>
                <div class="flex-grow flex flex-col justify-between min-w-0">
                  <div>
                    <div class="flex justify-between items-start">
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">{{ pkg.name_en }}</h3>
                      <span v-if="pkg.popular" class="px-2 py-0.5 bg-red-600/20 text-red-500 border border-red-500/30 rounded-full text-[9px] font-black uppercase tracking-wider">Popular</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Price: {{ pkg.price_en }} {{ pkg.unit_en }} | Price (NL): {{ pkg.price_nl }} {{ pkg.unit_nl }}
                    </p>
                  </div>
                  <div class="flex justify-between items-center mt-4 border-t border-slate-200 dark:border-slate-200 dark:border-slate-900/65 pt-3">
                    <span class="text-[10px] text-slate-500 font-mono truncate">key: {{ pkg.key_name }}</span>
                    <div class="flex gap-2">
                      <button @click="openEditPackageModal(pkg)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                        Edit
                      </button>
                      <button @click="deletePackage(pkg)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="dbPackages.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl">
                No pricing packages found. Run seeding to import default values or add a new one.
              </div>
            </div>
          </div>
        </div>

        <!-- TAB CONTENT: PRODUCTS -->
        <div v-if="activeTab === 'products'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">Manage Products</h2>
            <button @click="openAddProductModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10 dark:shadow-red-600/20">
              ➕ Add New Product
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="prod in products" :key="prod.id" class="glass-panel border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-white dark:bg-slate-950/40">
              <div class="h-44 bg-slate-50 dark:bg-slate-900 relative">
                <img v-if="getFirstProductImage(prod.image)" :src="getFirstProductImage(prod.image)" class="w-full h-full object-cover" :alt="prod.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-600 text-xs uppercase font-bold tracking-wider">No Image</div>
                <div class="absolute top-3 left-3 px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">€{{ prod.price }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{{ prod.title_en }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ prod.description_en }}</p>
                </div>
                <div class="flex justify-between items-center border-t border-slate-200 dark:border-slate-900 pt-4 mt-auto">
                  <span class="text-[10px] text-slate-500 font-mono">slug: {{ prod.slug }}</span>
                  <div class="flex gap-2">
                    <button @click="openEditProductModal(prod)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                      Edit
                    </button>
                    <button @click="deleteProduct(prod)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="products.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl">
              No products found. Click "Add New Product" to create one.
            </div>
          </div>

          <!-- Pagination for Products -->
          <div v-if="totalProductsPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="productsPage--" 
              :disabled="productsPage === 1"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              v-for="p in totalProductsPages" 
              :key="p"
              @click="productsPage = p"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center',
                productsPage === p 
                  ? 'bg-red-600 border-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-750 hover:text-slate-900 dark:text-white'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="productsPage++" 
              :disabled="productsPage === totalProductsPages"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: ORDERS -->
        <div v-if="activeTab === 'orders'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.orders.title') }}</h2>
            <button @click="fetchAdminOrders" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all">
              🔄 Refresh
            </button>
          </div>
          
          <div class="flex flex-col md:flex-row gap-4 mt-6 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <input type="text" v-model="ordersSearchQuery" :placeholder="$t('admin.orders.search')" class="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @keyup.enter="applyOrdersFilter" />
            <input type="date" v-model="ordersDateFilter" class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @change="applyOrdersFilter" />
            <select v-model="ordersStatusFilter" class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @change="applyOrdersFilter">
              <option value="all">{{ $t('admin.orders.status.all') }}</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button @click="applyOrdersFilter" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">Search</button>
          </div>
<div v-if="loadingAdminOrders" class="text-center py-8 text-slate-500">Loading orders...</div>
          <div class="grid grid-cols-1 gap-6" v-else>
            <div v-for="order in adminOrders" :key="order.id" class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6">
              <div class="flex-grow space-y-3">
                <div class="flex justify-between items-center">
                  <div class="flex gap-3 items-center">
                    <span class="text-sm font-bold text-slate-500">ID: {{ order.id.split('-')[0] }}</span>
                    <select v-model="order.status" @change="updateOrderStatus(order)" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer">
                      <option>Pending</option>
                      <option>In Transit</option>
                      <option>Shipped</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <span class="text-xs text-slate-400">{{ order.created_at }}</span>
                </div>
                <div class="text-sm">
                  <p><strong>Customer:</strong> {{ order.customers?.full_name || 'N/A' }} ({{ order.customers?.email || 'N/A' }})</p>
                  <p><strong>Date:</strong> {{ order.form_data?.date }}</p>
                  <p><strong>From:</strong> {{ order.form_data?.from }} | <strong>To:</strong> {{ order.form_data?.to }}</p>
                  <p><strong>Package:</strong> {{ order.form_data?.package }}</p>
                  <div v-if="order.form_data?.images?.length" class="mt-3 flex gap-2 overflow-x-auto pb-2">
                    <img v-for="(img, idx) in order.form_data.images" :key="idx" :src="img" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                  </div>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                  <button @click="openEditOrderModal(order)" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                    Edit
                  </button>
                  <button @click="deleteOrder(order)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination for Orders -->
          <div v-if="totalOrdersPages > 1" class="flex justify-center items-center gap-2 mt-8">
            <button 
              @click="ordersPage--" 
              :disabled="ordersPage === 1"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ◀
            </button>
            <button 
              v-for="p in totalOrdersPages" 
              :key="p"
              @click="ordersPage = p"
              :class="[
                'w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center justify-center',
                ordersPage === p 
                  ? 'bg-red-600 border-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-600/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-750 hover:text-slate-900 dark:text-white'
              ]"
            >
              {{ p }}
            </button>
            <button 
              @click="ordersPage++" 
              :disabled="ordersPage === totalOrdersPages"
              class="w-10 h-10 bg-slate-100 dark:bg-slate-800 border border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: CUSTOMERS -->
        <div v-if="activeTab === 'customers'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.customers.title') }}</h2>
            <button @click="fetchAdminCustomers" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all">
              🔄 Refresh
            </button>
          </div>
          
          <div class="flex flex-col md:flex-row gap-4 mt-6 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <input type="text" v-model="customersSearchQuery" :placeholder="$t('admin.customers.search')" class="flex-grow bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-500" @keyup.enter="applyCustomersFilter" />
            <button @click="applyCustomersFilter" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">Search</button>
          </div>
<div v-if="loadingAdminCustomers" class="text-center py-8 text-slate-500">Loading customers...</div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" v-else>
            <div v-for="customer in adminCustomers" :key="customer.id" class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 class="font-bold text-lg mb-1">{{ customer.full_name || 'No Name' }}</h3>
              <p class="text-sm text-slate-500 mb-2">{{ customer.email }}</p>
              <p class="text-xs text-slate-400">Phone: {{ customer.phone || 'N/A' }}</p>
              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button @click="editCustomer(customer)" class="text-xs text-red-500 font-bold hover:underline">Edit Info</button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB CONTENT: FINANCIALS -->
        <div v-if="activeTab === 'financials'" class="space-y-6" data-aos="fade-up">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 class="text-2xl font-black text-slate-900 dark:text-white">{{ $t('admin.financials.title') }}</h2>
              
              <div class="flex flex-col md:flex-row items-center gap-2">
                  <select v-model="financialFilter" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white">
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                      <option value="custom">Custom Range</option>
                  </select>
                  
                  <div v-if="financialFilter === 'custom'" class="flex items-center gap-2">
                      <input type="date" v-model="financialCustomFrom" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
                      <span class="text-slate-500">to</span>
                      <input type="date" v-model="financialCustomTo" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white" />
                  </div>

                  <button @click="fetchFinancials" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-sm transition-all text-slate-900 dark:text-white whitespace-nowrap">
                    🔄 Refresh
                  </button>
              </div>
            </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-red-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ $t('admin.financials.summary.expenses') }}</p>
              <p class="text-3xl font-black text-red-500">€{{ totalExpenses }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-emerald-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Income</p>
              <p class="text-3xl font-black text-emerald-500">€{{ totalIncome }}</p>
            </div>
            <div class="glass-panel p-6 rounded-2xl border-l-4 border-blue-500">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{{ $t('admin.financials.summary.profit') }}</p>
              <p class="text-3xl font-black text-blue-500">€{{ totalIncome - totalExpenses }}</p>
            </div>
          </div>

          <div class="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 class="font-bold text-lg mb-4">Add Expense</h3>
            <form @submit.prevent="addExpense" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Category</label>
                <select v-model="expenseForm.category" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm" required>
                  <option>Fuel</option>
                  <option>Electricity</option>
                  <option>Maintenance</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Amount (€)</label>
                <input type="number" step="0.01" v-model="expenseForm.amount" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" required />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Date</label>
                <input type="date" v-model="expenseForm.date" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm" required />
              </div>
              <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-2.5 text-sm transition-all">Add Expense</button>
            </form>
          </div>
          
          <div class="mt-8">
            <h3 class="font-bold text-lg mb-4">Recent Expenses</h3>
            <div class="space-y-3">
              <div v-for="exp in expensesList" :key="exp.id" class="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div>
                  <span class="font-bold text-sm">{{ exp.category }}</span>
                  <span class="text-xs text-slate-500 ml-3">{{ exp.date }}</span>
                </div>
                <span class="font-black text-red-500">-€{{ exp.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        </main>
      </div>
    </div>

    
    <!-- Custom Confirm/Alert Dialog -->
    <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6" data-aos="zoom-in" data-aos-duration="200">
        <div class="w-16 h-16 mx-auto bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">{{ confirmDialog.title }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">{{ confirmDialog.message }}</p>
        </div>
        <div class="flex gap-3 justify-center pt-2">
          <button v-if="!confirmDialog.isAlert" @click="confirmDialog.cancel && confirmDialog.cancel()" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="confirmDialog.confirm && confirmDialog.confirm()" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">OK</button>
        </div>
      </div>
    </div>

    <!-- MODAL: EDIT ORDER -->
    <div v-if="modals.order" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">Edit Order</h3>
          <button @click="modals.order = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</label>
            <input type="text" v-model="orderForm.date" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ $t('admin.orders.details.from') }}</label>
            <input type="text" v-model="orderForm.from" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ $t('admin.orders.details.to') }}</label>
            <input type="text" v-model="orderForm.to" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Package</label>
            <input type="text" v-model="orderForm.package" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>

          <!-- Financial Fields -->
          <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 class="text-sm font-black text-red-500 uppercase">Financials</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Revenue</label>
                <input type="number" v-model="orderForm.est_revenue" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Revenue</label>
                <input type="number" v-model="orderForm.actual_revenue" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Hours</label>
                <input type="number" v-model="orderForm.est_hours" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Hours</label>
                <input type="number" v-model="orderForm.actual_hours" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Fuel (L)</label>
                <input type="number" v-model="orderForm.est_fuel_litres" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Fuel (L)</label>
                <input type="number" v-model="orderForm.actual_fuel_litres" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Distance</label>
                <input type="number" v-model="orderForm.est_distance" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Distance</label>
                <input type="number" v-model="orderForm.actual_distance" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Est Fuel Cost</label>
                <input type="number" v-model="orderForm.est_fuel_cost" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Actual Fuel Cost</label>
                <input type="number" v-model="orderForm.actual_fuel_cost" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attached Images ({{ orderForm.images?.length || 0 }})</label>
            <div class="flex flex-wrap gap-3">
              <div v-for="(img, idx) in orderForm.images" :key="idx" class="relative group">
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <img :src="img" class="w-full h-full object-cover" />
                </div>
                <button @click="removeOrderImage(idx)" class="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md">✕</button>
              </div>
              <div class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 rounded-xl w-16 h-16 flex flex-col items-center justify-center cursor-pointer relative transition-colors group">
                <span class="text-xl text-slate-400 group-hover:text-red-500">+</span>
                <input type="file" @change="onOrderImageUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div v-if="uploadingOrderImage" class="text-[10px] text-red-500 animate-pulse mt-1">Uploading image...</div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.order = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveOrder" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT LOCATION -->
    <div v-if="modals.location" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? $t('admin.locations.edit') : $t('admin.locations.add') }}</h3>
          <button @click="modals.location = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Section 1: Basic Information -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">1. Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location Name</label>
                <input type="text" v-model="locationForm.name" placeholder="e.g. Maastricht" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</label>
                <input type="text" v-model="locationForm.slug" placeholder="e.g. maastricht" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country (optional)</label>
                <input type="text" v-model="locationForm.country" placeholder="e.g. Germany 🇩🇪" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 2: Media Assets -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">2. Media Assets</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Main Cover Image -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Main Cover Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.image" :src="locationForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Van -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Moving Van Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_van" :src="locationForm.images_van" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_van')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Boxes -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Boxes Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_boxes" :src="locationForm.images_boxes" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_boxes')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Room -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Room/Furniture Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_room" :src="locationForm.images_room" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_room')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>
            </div>
            <div v-if="uploading" class="text-xs text-red-500 animate-pulse">Uploading to Cloudinary...</div>
          </div>

          <!-- Section 3: Hero & SEO Metadata -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">3. Hero & SEO Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Title EN</label>
                <input type="text" v-model="locationForm.hero_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Title NL</label>
                <input type="text" v-model="locationForm.hero_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Subtitle EN</label>
                <input type="text" v-model="locationForm.hero_subtitle_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hero Subtitle NL</label>
                <input type="text" v-model="locationForm.hero_subtitle_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Title EN</label>
                <input type="text" v-model="locationForm.seo_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Title NL</label>
                <input type="text" v-model="locationForm.seo_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Description EN</label>
                <textarea v-model="locationForm.seo_desc_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Description NL</label>
                <textarea v-model="locationForm.seo_desc_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Keywords EN</label>
                <input type="text" v-model="locationForm.seo_keywords_en" placeholder="moving, maastricht, removals" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">SEO Keywords NL</label>
                <input type="text" v-model="locationForm.seo_keywords_nl" placeholder="verhuizen, maastricht, verhuisbedrijf" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 4: Content Section Textareas -->
          <div class="bg-white dark:bg-white dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">4. Section Contents (Divide paragraphs with newlines)</h4>
            <div class="space-y-6">
              <!-- Introduction Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Introduction Title EN</label>
                  <input type="text" v-model="locationForm.intro_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Introduction Title NL</label>
                  <input type="text" v-model="locationForm.intro_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Intro Text EN</label>
                  <textarea v-model="locationForm.intro_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Intro Text NL</label>
                  <textarea v-model="locationForm.intro_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Residential Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Title EN</label>
                  <input type="text" v-model="locationForm.residential_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Title NL</label>
                  <input type="text" v-model="locationForm.residential_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Text EN</label>
                  <textarea v-model="locationForm.residential_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Text NL</label>
                  <textarea v-model="locationForm.residential_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Commercial Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Title EN</label>
                  <input type="text" v-model="locationForm.commercial_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Title NL</label>
                  <input type="text" v-model="locationForm.commercial_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Text EN</label>
                  <textarea v-model="locationForm.commercial_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commercial Text NL</label>
                  <textarea v-model="locationForm.commercial_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Packing Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Title EN</label>
                  <input type="text" v-model="locationForm.packing_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Title NL</label>
                  <input type="text" v-model="locationForm.packing_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Text EN</label>
                  <textarea v-model="locationForm.packing_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Packing Text NL</label>
                  <textarea v-model="locationForm.packing_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Insights Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Title EN</label>
                  <input type="text" v-model="locationForm.insights_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Title NL</label>
                  <input type="text" v-model="locationForm.insights_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Text EN</label>
                  <textarea v-model="locationForm.insights_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Insights Text NL</label>
                  <textarea v-model="locationForm.insights_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Cost Factors Section -->
              <div class="border-b border-slate-200 dark:border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Title EN</label>
                  <input type="text" v-model="locationForm.costs_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Title NL</label>
                  <input type="text" v-model="locationForm.costs_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Text EN</label>
                  <textarea v-model="locationForm.costs_text_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost Factors Text NL</label>
                  <textarea v-model="locationForm.costs_text_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Neighborhoods Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods Title EN</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods Title NL</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods EN (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_en" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Neighborhoods NL (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_nl" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.location = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveLocation" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Location' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT BLOG POST -->
    <div v-if="modals.blog" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Blog Post' : 'Add New Blog Post' }}</h3>
          <button @click="modals.blog = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug (e.g. 10-tips-stress-free)</label>
            <input type="text" v-model="blogForm.slug" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Date</label>
            <input type="text" v-model="blogForm.date" placeholder="e.g. May 10, 2026" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title EN</label>
            <input type="text" v-model="blogForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title NL</label>
            <input type="text" v-model="blogForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category EN</label>
            <input type="text" v-model="blogForm.category_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category NL</label>
            <input type="text" v-model="blogForm.category_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Read Time EN</label>
            <input type="text" v-model="blogForm.read_time_en" placeholder="e.g. 5 min read" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Read Time NL</label>
            <input type="text" v-model="blogForm.read_time_nl" placeholder="e.g. 5 min leestijd" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
            <textarea v-model="blogForm.desc_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
            <textarea v-model="blogForm.desc_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Content EN (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Content NL (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-3 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="blogForm.image" :src="blogForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-xs text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'blog')" accept="image/*" class="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-2 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.blog = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveBlogPost" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT SERVICE -->
    <div v-if="modals.service" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h3>
          <button @click="modals.service = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service Slug (e.g. lift-rental)</label>
            <input type="text" v-model="serviceForm.slug" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title EN</label>
            <input type="text" v-model="serviceForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title NL</label>
            <input type="text" v-model="serviceForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Description EN</label>
            <textarea v-model="serviceForm.description_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Description NL</label>
            <textarea v-model="serviceForm.description_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-3">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="serviceForm.image" :src="serviceForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'service')" accept="image/*" class="text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-1 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button @click="modals.service = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveService" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Service' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE SERVICE SECTIONS -->
    <div v-if="modals.sections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedService.title_en }}" page.</p>
          </div>
          <button @click="modals.sections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <!-- Section list and editor -->
        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addServiceSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in serviceSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateServiceSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteServiceSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="serviceSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this service.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.sections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE BLOG SECTIONS -->
    <div v-if="modals.blogSections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedBlog ? selectedBlog.title_en : '' }}" post.</p>
          </div>
          <button @click="modals.blogSections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addBlogSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in blogSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateBlogSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteBlogSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this post.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.blogSections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE LOCATION SECTIONS -->
    <div v-if="modals.locationSections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Customize Sections</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedLocation ? selectedLocation.name : '' }}" location page.</p>
          </div>
          <button @click="modals.locationSections = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-white dark:bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
                <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="addLocationSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                Add Section
              </button>
            </div>
          </div>

          <!-- Existing Sections List -->
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in locationSections" :key="sec.id" class="p-5 border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50 dark:bg-slate-900/60 relative space-y-3">
              <div v-if="editingSectionId === sec.id" class="space-y-4">
                <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Edit Section #{{ idx + 1 }}</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title EN</label>
                    <input type="text" v-model="editSectionForm.title_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Title NL</label>
                    <input type="text" v-model="editSectionForm.title_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content EN</label>
                    <textarea v-model="editSectionForm.content_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Content NL</label>
                    <textarea v-model="editSectionForm.content_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                    <input type="number" v-model.number="editSectionForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 text-xs" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Optional Section Image</label>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        <img v-if="editSectionForm.image" :src="editSectionForm.image" class="w-full h-full object-cover" />
                        <span v-else class="text-[8px] text-slate-600">None</span>
                      </div>
                      <input type="file" @change="e => onFileChange(e, 'edit_section')" accept="image/*" class="text-[10px] text-slate-500 dark:text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-100 dark:bg-slate-800 file:text-slate-800 dark:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                    </div>
                    <div v-if="uploading" class="text-[10px] text-red-500 animate-pulse">Uploading image...</div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-200 dark:border-slate-800/80">
                  <button @click="cancelSectionEdit" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs border border-slate-700">
                    Cancel
                  </button>
                  <button @click="updateLocationSection" :disabled="uploading" class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md">
                    Save Changes
                  </button>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div class="flex justify-between items-start gap-4">
                  <h5 class="font-bold text-slate-800 dark:text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                  <div class="flex gap-2">
                    <button @click="editSection(sec)" class="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg text-xs font-bold">
                      ✏️ Edit
                    </button>
                    <button @click="deleteLocationSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                  <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 md:col-span-2 mt-2">
                    <img :src="sec.image" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="locationSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-100 dark:bg-white dark:bg-slate-950/20 rounded-2xl border border-slate-200 dark:border-slate-900">
              No custom sub-sections added yet for this location page.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.locationSections = false" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>


    <!-- MODAL: ADD/EDIT PRICING PACKAGE -->
    <div v-if="modals.pricingPackage" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Pricing Package' : 'Add New Pricing Package' }}</h3>
          <button @click="modals.pricingPackage = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Package Identifier Key (e.g., package1)</label>
              <input type="text" v-model="packageForm.key_name" placeholder="e.g. package1" :disabled="isEditing" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Icon Emoji</label>
              <input type="text" v-model="packageForm.icon" placeholder="e.g. 🚐" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name EN</label>
              <input type="text" v-model="packageForm.name_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name NL</label>
              <input type="text" v-model="packageForm.name_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price EN</label>
              <input type="text" v-model="packageForm.price_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price NL</label>
              <input type="text" v-model="packageForm.price_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit EN (optional)</label>
              <input type="text" v-model="packageForm.unit_en" placeholder="e.g. /hr" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unit NL (optional)</label>
              <input type="text" v-model="packageForm.unit_nl" placeholder="e.g. /uur" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Button Text EN</label>
              <input type="text" v-model="packageForm.cta_text_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Button Text NL</label>
              <input type="text" v-model="packageForm.cta_text_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CTA Link (URL or Page Path)</label>
              <input type="text" v-model="packageForm.cta_link" placeholder="e.g. /contact" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="flex items-center space-x-3 pt-6">
              <input type="checkbox" id="pkgPopular" v-model="packageForm.popular" class="w-4 h-4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded text-red-600 focus:ring-red-500" />
              <label for="pkgPopular" class="text-sm font-bold text-slate-700 dark:text-slate-300">Mark as Most Popular</label>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tag EN</label>
              <input type="text" v-model="packageForm.tag_en" placeholder="e.g. VAN ONLY" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tag NL</label>
              <input type="text" v-model="packageForm.tag_nl" placeholder="e.g. ALLEEN BUS" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
              <textarea v-model="packageForm.description_en" placeholder="You handle the lifting - we handle the drive." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
              <textarea v-model="packageForm.description_nl" placeholder="U regelt het tillen - wij regelen de rit." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Best For EN (Format: Icon|Text - one per line)</label>
              <textarea v-model="packageForm.best_for_raw_en" placeholder="e.g.&#10;🎓|Students&#10;🛋|Single-item moves" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Best For NL (Format: Icon|Text - one per line)</label>
              <textarea v-model="packageForm.best_for_raw_nl" placeholder="e.g.&#10;🎓|Studenten&#10;🛋|Enkele meubelstukken" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inclusions EN (one per line)</label>
              <textarea v-model="packageForm.includes_raw_en" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inclusions NL (one per line)</label>
              <textarea v-model="packageForm.includes_raw_nl" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.pricingPackage = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="savePackage" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Package' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT PRODUCT -->
    <div v-if="modals.product" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
          <button @click="modals.product = false" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Title EN</label>
              <input type="text" v-model="productForm.title_en" placeholder="e.g. Roll of Tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Title NL</label>
              <input type="text" v-model="productForm.title_nl" placeholder="e.g. Rol Tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</label>
              <input type="text" v-model="productForm.slug" placeholder="e.g. roll-of-tape" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price (€)</label>
              <input type="number" step="0.01" v-model.number="productForm.price" placeholder="e.g. 3.95" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">WhatsApp Number override (optional)</label>
              <input type="text" v-model="productForm.whatsapp_number" placeholder="e.g. 31684094271" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
              <input type="number" v-model.number="productForm.sort_order" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-red-500 text-sm" />
            </div>
            <div class="space-y-3 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product Images (First is Cover)</label>
              
              <!-- Image grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div 
                  v-for="(imgUrl, i) in productImagesList" 
                  :key="i" 
                  class="relative group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden aspect-square bg-white dark:bg-slate-950 flex items-center justify-center p-1"
                >
                  <img :src="imgUrl" class="w-full h-full object-contain" />
                  
                  <!-- Cover badge -->
                  <div v-if="i === 0" class="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-md z-10">
                    Cover
                  </div>
                  
                  <!-- Overlay actions on hover -->
                  <div class="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                    <button 
                      v-if="i > 0" 
                      type="button" 
                      @click="setProductCoverImage(i)" 
                      class="text-[9px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded w-full text-center transition-all cursor-pointer"
                    >
                      Make Cover
                    </button>
                    <button 
                      type="button" 
                      @click="removeProductImage(i)" 
                      class="text-[9px] bg-slate-800 hover:bg-slate-700 text-red-500 font-bold px-2 py-1 rounded w-full text-center border border-red-500/30 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <!-- Add new image box -->
                <div class="border-2 border-dashed border-slate-350 dark:border-slate-850 hover:border-red-500/50 rounded-xl flex flex-col items-center justify-center aspect-square p-4 transition-colors relative cursor-pointer group/upload">
                  <span class="text-2xl text-slate-400 group-hover/upload:text-red-500 transition-colors font-light">+</span>
                  <span class="text-[9px] font-bold text-slate-400 group-hover/upload:text-red-500 transition-colors uppercase mt-1">Upload</span>
                  <input type="file" @change="onProductImageUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div v-if="uploading" class="text-xs text-red-500 animate-pulse mt-1">Uploading image to Cloudinary...</div>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description EN</label>
              <textarea v-model="productForm.description_en" placeholder="Strong adhesive tape..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-20 text-xs"></textarea>
            </div>
            <div class="space-y-1 md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description NL</label>
              <textarea v-model="productForm.description_nl" placeholder="Sterke verpakkingstape..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-red-500 h-20 text-xs"></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button @click="modals.product = false" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveProduct" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Product' }}
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM DIALOG NOTIFICATION -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="dialog.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="glass-panel w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl text-center transform transition-all scale-100">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" :class="dialog.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500' : 'bg-red-100 dark:bg-red-900/30 text-red-500'">
            <svg v-if="dialog.type === 'success'" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ dialog.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ dialog.message }}</p>
          <button @click="dialog.show = false" class="mt-8 w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            Done
          </button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
definePageMeta({ layout: false })

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const { t, locale, setLocale } = useI18n()

const localePath = useLocalePath()
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)


// Authorization State
const isAuthorized = ref(false)
const emailInput = ref('')
const passwordInput = ref('')
const authLoading = ref(false)
const authError = ref('')

// --- DIALOG LOGIC ---
const dialog = ref({
  show: false,
  title: '',
  message: '',
  type: 'success'
})

const showDialog = (title, message, type = 'success') => {
  dialog.value = { show: true, title, message, type }
}

// Supabase client
const supabase = useSupabaseClient()

// --- CONFIRM DIALOG LOGIC ---
const confirmDialog = ref({ isOpen: false, title: '', message: '', isAlert: false, confirm: null, cancel: null })

const showConfirm = (title, message, isAlert = false) => {
  return new Promise((resolve) => {
    confirmDialog.value = {
      isOpen: true,
      title,
      message,
      isAlert,
      confirm: () => {
        confirmDialog.value.isOpen = false
        resolve(true)
      },
      cancel: () => {
        confirmDialog.value.isOpen = false
        resolve(false)
      }
    }
  })
}

// Supabase client


// --- ORDERS LOGIC ---

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

const updateOrderStatus = async (order) => {
  try {
    const { error } = await supabase.from('orders').update({ status: order.status }).eq('id', order.id)
    if (error) throw error
    const idx = allAdminOrders.value.findIndex(o => o.id === order.id);
    if (idx !== -1) allAdminOrders.value[idx].status = order.status;
    showDialog('Status Updated', 'The order status has been updated successfully.', 'success')
  } catch (err) {
    console.error(err)
    showDialog('Update Failed', 'An error occurred while updating the order status.', 'error')
  }
}

const selectedItem = ref(null)
const orderForm = ref({ id: '', date: '', from: '', to: '', package: '', images: [] })
const uploadingOrderImage = ref(false)

const openEditOrderModal = (order) => {
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

const removeOrderImage = (index) => {
  orderForm.value.images.splice(index, 1)
}

const onOrderImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const fileData = new FormData()
  fileData.append('file', file)
  
  uploadingOrderImage.value = true
  try {
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: fileData
    })
    if (res && res.url) {
      if (!orderForm.value.images) orderForm.value.images = []
      orderForm.value.images.push(res.url)
    }
  } catch (e) {
    await showConfirm("Notice", 'Failed to upload image.', true)
  } finally {
    uploadingOrderImage.value = false
  }
}

const saveOrder = async () => {
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
    await showConfirm("Notice", 'Error updating order: ' + error.message, true)
  }
}

const deleteOrder = async (order) => {
  if (!supabase) { console.error('No supabase client'); return }
  if (!(await showConfirm('Confirmation', 'Are you sure you want to delete this order?'))) return
  
  console.log('Deleting order ID:', order.id, 'type:', typeof order.id)
  
  const { data, error, count } = await supabase
    .from('orders')
    .delete()
    .eq('id', order.id)
    .select()
  
  console.log('Delete result - data:', data, 'error:', error, 'count:', count)
  
  if (!error) {
    allAdminOrders.value = allAdminOrders.value.filter(o => o.id !== order.id)
    if (ordersPage.value > totalOrdersPages.value) {
      ordersPage.value = Math.max(1, totalOrdersPages.value)
    }
    totalIncome.value = totalIncome.value - Number(order.actual_revenue || 0)
    await new Promise(r => setTimeout(r, 500))
    await fetchFinancials()
    console.log('Order deleted successfully, financials refreshed')
  } else {
    console.error('Delete error:', error)
    await showConfirm("Notice", 'Error deleting order: ' + error.message + ' (Code: ' + error.code + ')', true)
  }
}

// --- CUSTOMERS LOGIC ---

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
    supabase.from('customers').update({ full_name: newName, phone: newPhone }).eq('id', customer.id).then(async ({error}) => {
      if(error) await showConfirm("Notice", 'Error updating', true)
      else fetchAdminCustomers()
    })
  }
}

// --- FINANCIALS LOGIC ---
const totalExpenses = ref(0)
const totalIncome = ref(0)

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

const expensesList = ref([])

const expenseForm = ref({
  category: 'Fuel',
  amount: 0,
  date: new Date().toISOString().split('T')[0]
})


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
  doc.text(`Generated on: ${dateStr} | Filter: ${filterStr}`, 14, 30);
  
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
  doc.text(`€${totalExpenses.value.toLocaleString()}`, 18, 53);
  doc.setTextColor(16, 185, 129);
  doc.text(`€${totalIncome.value.toLocaleString()}`, 79, 53);
  doc.setTextColor(59, 130, 246);
  doc.text(`€${(totalIncome.value - totalExpenses.value).toLocaleString()}`, 140, 53);
  
  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Date', 'Category', 'Amount']],
    body: expensesList.value.map(item => [
      new Date(item.date).toLocaleDateString("en-GB"),
      item.category,
      `€${item.amount.toLocaleString()}`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 70 }
  });
  
  doc.save("MoveIt_Financial_Report.pdf");
}

const exportCSV = async () => {
  if (!expensesList.value || expensesList.value.length === 0) {
    await showConfirm("Notice", 'No data to export', true);
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
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
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

const fetchFinancials = async () => {
  // Reset values immediately to avoid showing stale data
  totalIncome.value = 0
  totalExpenses.value = 0
  
  try {
    const { data: exps, error: expErr } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (expErr) throw expErr
    
    const { data: ords, error: ordErr } = await supabase
      .from('orders')
      .select('id, form_data, created_at, actual_revenue')
    if (ordErr) throw ordErr
    
    let filteredExps = exps || []
    let filteredOrds = ords || []
    
    const now = new Date()
    
    const filterByDate = (dateStr) => {
        // In 'all' mode, include everything regardless of date
        if (financialFilter.value === 'all') return true
        if (!dateStr) return false
        const d = new Date(dateStr)
        if (financialFilter.value === 'today') {
            return d.toDateString() === now.toDateString()
        } else if (financialFilter.value === 'week') {
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            return d >= startOfWeek
        } else if (financialFilter.value === 'month') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'year') {
            return d.getFullYear() === now.getFullYear()
        } else if (financialFilter.value === 'custom') {
            if(!financialCustomFrom.value || !financialCustomTo.value) return true
            const start = new Date(financialCustomFrom.value)
            const end = new Date(financialCustomTo.value)
            end.setHours(23, 59, 59, 999)
            return d >= start && d <= end
        }
        return true
    }
    
    filteredExps = filteredExps.filter(e => filterByDate(e.date))
    filteredOrds = filteredOrds.filter(o => {
        // Try multiple date fields
        const orderDate = o.form_data?.date || o.created_at || null
        if (financialFilter.value === 'all') return true
        return filterByDate(orderDate)
    })
    
    expensesList.value = filteredExps
    totalExpenses.value = filteredExps.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    totalIncome.value = filteredOrds.reduce((acc, curr) => acc + Number(curr.actual_revenue || 0), 0)
    
  } catch (err) {
    console.error(err)
  }
}

const addExpense = async () => {
  try {
    const { error } = await supabase.from('expenses').insert({
      category: expenseForm.value.category,
      amount: expenseForm.value.amount,
      date: expenseForm.value.date
    })
    if (error) throw error
    expenseForm.value.amount = 0
    fetchFinancials()
    await showConfirm("Notice", 'Expense added!', true)
  } catch (err) {
    console.error(err)
    await showConfirm("Notice", 'Failed to add expense', true)
  }
}

// Ensure these are fetched when tabs switch

const handleLogin = async () => {

  authLoading.value = true
  authError.value = ''
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    })
    if (error) throw error
    
    isAuthorized.value = true
    loadAllData()
  } catch (err) {
    authError.value = err.message || 'Incorrect email or password. Access denied.'
  } finally {
    authLoading.value = false
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  isAuthorized.value = false
  emailInput.value = ''
  passwordInput.value = ''
}

// Check auth on mount
onMounted(async () => {
  if (process.client) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      isAuthorized.value = true
      loadAllData()
    }
  }
})

// Tab control
const activeTab = ref('locations')

watch(activeTab, (newTab) => {
  if (newTab === 'orders' && adminOrders.value.length === 0) fetchAdminOrders()
  if (newTab === 'customers' && adminCustomers.value.length === 0) fetchAdminCustomers()
  if (newTab === 'financials' && expensesList.value.length === 0) fetchFinancials()
})

// Data arrays
const locations = ref([])
const blogPosts = ref([])
const services = ref([])
const serviceSections = ref([])
const products = ref([])

// Pricing state
const dbPackages = ref([])

const packageForm = ref({
  key_name: '',
  icon: '🚐',
  popular: false,
  name_en: '',
  name_nl: '',
  price_en: '',
  price_nl: '',
  unit_en: '',
  unit_nl: '',
  cta_text_en: '',
  cta_text_nl: '',
  cta_link: '/contact',
  tag_en: '',
  tag_nl: '',
  description_en: '',
  description_nl: '',
  best_for_raw_en: '',
  best_for_raw_nl: '',
  includes_raw_en: '',
  includes_raw_nl: '',
  sort_order: 0
})

// Pagination Setup

const totalOrdersCount = computed(() => filteredOrders.value ? filteredOrders.value.length : 0)
const totalLocationsCount = ref(0)
const totalBlogPostsCount = ref(0)
const totalServicesCount = ref(0)
const totalProductsCount = ref(0)
const totalCustomersCount = computed(() => filteredCustomers.value ? filteredCustomers.value.length : 0)

const itemsPerPage = 10
const ordersPage = ref(1)
const customersPage = ref(1)
const locationsPage = ref(1)



const totalOrdersPages = computed(() => {
  return Math.ceil(totalOrdersCount.value / itemsPerPage) || 1
})
const blogPage = ref(1)
const servicesPage = ref(1)



const totalLocationsPages = computed(() => {
  return Math.ceil(totalLocationsCount.value / itemsPerPage) || 1
})



const totalBlogPages = computed(() => {
  return Math.ceil(totalBlogPostsCount.value / itemsPerPage) || 1
})



const totalServicesPages = computed(() => {
  return Math.ceil(totalServicesCount.value / itemsPerPage) || 1
})

const productsPage = ref(1)



const totalProductsPages = computed(() => {
  return Math.ceil(totalProductsCount.value / itemsPerPage) || 1
})

// Load all data from Supabase
const loadAllData = async () => {
  if (!supabase) return
  
  const locStart = (locationsPage.value - 1) * itemsPerPage
  const { data: locs, count: locCount } = await supabase.from('locations').select('*', { count: 'exact' }).order('name').range(locStart, locStart + itemsPerPage - 1)
  if (locs) locations.value = locs
  if (locCount !== null) totalLocationsCount.value = locCount

  const blogStart = (blogPage.value - 1) * itemsPerPage
  const { data: blogs, count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(blogStart, blogStart + itemsPerPage - 1)
  if (blogs) blogPosts.value = blogs
  if (blogCount !== null) totalBlogPostsCount.value = blogCount

  const servStart = (servicesPage.value - 1) * itemsPerPage
  const { data: servs, count: servCount } = await supabase.from('services').select('*', { count: 'exact' }).order('id').range(servStart, servStart + itemsPerPage - 1)
  if (servs) services.value = servs
  if (servCount !== null) totalServicesCount.value = servCount

  // Load Pricing Packages
  const { data: pkgs } = await supabase.from('pricing_packages').select('*').order('sort_order')
  if (pkgs) dbPackages.value = pkgs

  const prodStart = (productsPage.value - 1) * itemsPerPage
  const { data: prods, count: prodCount } = await supabase.from('products').select('*', { count: 'exact' }).order('sort_order').range(prodStart, prodStart + itemsPerPage - 1)
  if (prods) products.value = prods
  if (prodCount !== null) totalProductsCount.value = prodCount
}
// Modals display control
const modals = ref({
  order: false,
  location: false,
  blog: false,
  service: false,
  sections: false,
  blogSections: false,
  locationSections: false,
  pricingPackage: false,
  product: false
})

const productImagesList = ref([])

const getProductImagesList = (imageStr) => {
  if (!imageStr) return []
  try {
    const parsed = JSON.parse(imageStr)
    if (Array.isArray(parsed)) return parsed
  } catch (e) {
    // not JSON
  }
  if (imageStr.includes(',') && (imageStr.startsWith('http') || imageStr.startsWith('/'))) {
    return imageStr.split(',').map(img => img.trim()).filter(Boolean)
  }
  return [imageStr]
}

const getFirstProductImage = (imageStr) => {
  const imgs = getProductImagesList(imageStr)
  return imgs[0] || ''
}

const onProductImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (res && res.url) {
      productImagesList.value.push(res.url)
    }
  } catch (err) {
    await showConfirm("Notice", 'Failed to upload image.', true)
  } finally {
    uploading.value = false
  }
}

const setProductCoverImage = (index) => {
  if (index <= 0 || index >= productImagesList.value.length) return
  const item = productImagesList.value.splice(index, 1)[0]
  productImagesList.value.unshift(item)
}

const removeProductImage = (index) => {
  productImagesList.value.splice(index, 1)
}

const productForm = ref({
  slug: '',
  title_en: '',
  title_nl: '',
  description_en: '',
  description_nl: '',
  price: 0,
  image: '',
  whatsapp_number: '',
  sort_order: 0
})

const openAddProductModal = () => {
  isEditing.value = false
  selectedItem.value = null
  productImagesList.value = []
  productForm.value = {
    slug: '',
    title_en: '',
    title_nl: '',
    description_en: '',
    description_nl: '',
    price: 0,
    image: '',
    whatsapp_number: '',
    sort_order: products.value.length + 1
  }
  modals.value.product = true
}

const openEditProductModal = (prod) => {
  isEditing.value = true
  selectedItem.value = prod
  productImagesList.value = getProductImagesList(prod.image)
  productForm.value = { ...prod }
  modals.value.product = true
}

const saveProduct = async () => {
  if (!supabase || !productForm.value.slug) return

  const payload = { 
    ...productForm.value,
    image: JSON.stringify(productImagesList.value)
  }

  if (isEditing.value && selectedItem.value) {
    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', selectedItem.value.id)

    if (!error) {
      const idx = products.value.findIndex(p => p.id === selectedItem.value.id)
      if (idx !== -1) products.value[idx] = { ...selectedItem.value, ...payload }
      modals.value.product = false
    } else {
      await showConfirm("Notice", 'Error updating product: ' + error.message, true)
    }
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()

    if (!error && data) {
      products.value.push(data[0])
      products.value.sort((a, b) => a.sort_order - b.sort_order)
      modals.value.product = false
    } else {
      await showConfirm("Notice", 'Error creating product: ' + error.message, true)
    }
  }
}

const deleteProduct = async (prod) => {
  if (!supabase || !confirm(`Delete product "${prod.title_en}"?`)) return
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', prod.id)

  if (!error) {
    products.value = products.value.filter(p => p.id !== prod.id)
    if (productsPage.value > totalProductsPages.value) {
      productsPage.value = Math.max(1, totalProductsPages.value)
    }
  } else {
    await showConfirm("Notice", 'Error deleting product: ' + error.message, true)
  }
}

</script>

<style scoped>
.glass-panel {
  @apply bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl;
}
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

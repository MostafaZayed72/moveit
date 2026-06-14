<template>
  <div class="pt-32 pb-24 min-h-screen bg-slate-900 text-slate-100 font-sans relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"></div>
      <div class="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 max-w-6xl relative z-10">
      <!-- 1. Password Protection Gate -->
      <div v-if="!isAuthorized" class="max-w-md mx-auto my-12" data-aos="zoom-in">
        <div class="glass-panel p-10 rounded-3xl border border-slate-800 bg-slate-950/60 shadow-2xl text-center space-y-6">
          <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">
            🔒
          </div>
          <div>
            <h2 class="text-3xl font-black text-white mb-2">Admin Portal</h2>
            <p class="text-sm text-slate-400">Please enter the administrator credentials to proceed.</p>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4 text-left">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                type="email" 
                v-model="emailInput" 
                placeholder="info@moveitmaastricht.nl"
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <input 
                type="password" 
                v-model="passwordInput" 
                placeholder="••••••••"
                class="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-base"
                required
              />
            </div>
            <p v-if="authError" class="text-xs font-bold text-red-500 bg-red-500/10 rounded-xl py-2 px-4 text-center">{{ authError }}</p>
            <button 
              type="submit" 
              class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
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
      <div v-else>
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">
              Move<span class="text-red-500">It</span> Dashboard
            </h1>
            <p class="text-slate-400 mt-1">Manage locations, blog posts, and service pages.</p>
          </div>
          <button @click="logout" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700 flex items-center gap-2">
            Logout <span>🚪</span>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-slate-800 mb-8 overflow-x-auto overflow-y-hidden gap-2 scrollbar-none">
          <button 
            v-for="tab in ['locations', 'blog', 'services']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-4 font-bold text-sm tracking-wider uppercase transition-all whitespace-nowrap border-b-2 -mb-[2px]',
              activeTab === tab ? 'border-red-600 text-red-500' : 'border-transparent text-slate-400 hover:text-white'
            ]"
          >
            {{ tab }}
          </button>
        </div>

        <!-- TAB CONTENT: LOCATIONS -->
        <div v-if="activeTab === 'locations'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-white">Manage Locations</h2>
            <button @click="openAddLocationModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10">
              ➕ Add New Location
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="loc in paginatedLocations" :key="loc.id" class="glass-panel border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col bg-slate-950/40">
              <div class="h-44 bg-slate-900 relative">
                <img v-if="loc.image" :src="loc.image" class="w-full h-full object-cover" :alt="loc.name" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                <div class="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">{{ loc.country || 'Netherlands' }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ loc.name }}</h3>
                  <p class="text-xs text-slate-400 line-clamp-2">slug: {{ loc.slug }}</p>
                </div>
                <div class="flex justify-end gap-2 border-t border-slate-900 pt-4 mt-auto">
                  <button @click="openEditLocationModal(loc)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                    Edit
                  </button>
                  <button @click="deleteLocation(loc)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            <div v-if="locations.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-950/20 border border-slate-900 rounded-3xl">
              No locations found. Click "Add New Location" to create one.
            </div>
          </div>

          <!-- Pagination for Locations -->
          <div v-if="totalLocationsPages > 1" class="flex justify-center items-center gap-4 mt-8">
            <button 
              @click="locationsPage--" 
              :disabled="locationsPage === 1"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              ◀ Previous
            </button>
            <span class="text-sm font-bold text-slate-400">Page {{ locationsPage }} of {{ totalLocationsPages }}</span>
            <button 
              @click="locationsPage++" 
              :disabled="locationsPage === totalLocationsPages"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: BLOG -->
        <div v-if="activeTab === 'blog'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-white">Manage Blog Posts</h2>
            <button @click="openAddBlogModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10">
              ➕ Add New Post
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="post in paginatedBlogPosts" :key="post.id" class="glass-panel border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col bg-slate-950/40">
              <div class="h-44 bg-slate-900 relative">
                <img v-if="post.image" :src="post.image" class="w-full h-full object-cover" :alt="post.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                <div class="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase">{{ post.category_en }}</div>
              </div>
              <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{{ post.title_en }}</h3>
                  <p class="text-xs text-slate-400 line-clamp-2">{{ post.desc_en }}</p>
                </div>
                <div class="flex justify-between items-center border-t border-slate-900 pt-4 mt-auto">
                  <span class="text-[10px] text-slate-500 font-mono">{{ post.date || 'No Date' }}</span>
                  <div class="flex gap-2">
                    <button @click="openEditBlogModal(post)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                      Edit
                    </button>
                    <button @click="deleteBlogPost(post)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="blogPosts.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-950/20 border border-slate-900 rounded-3xl">
              No blog posts found. Click "Add New Post" to write one.
            </div>
          </div>

          <!-- Pagination for Blog Posts -->
          <div v-if="totalBlogPages > 1" class="flex justify-center items-center gap-4 mt-8">
            <button 
              @click="blogPage--" 
              :disabled="blogPage === 1"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              ◀ Previous
            </button>
            <span class="text-sm font-bold text-slate-400">Page {{ blogPage }} of {{ totalBlogPages }}</span>
            <button 
              @click="blogPage++" 
              :disabled="blogPage === totalBlogPages"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>

        <!-- TAB CONTENT: SERVICES -->
        <div v-if="activeTab === 'services'" class="space-y-6" data-aos="fade-up">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-white">Manage Services</h2>
            <button @click="openAddServiceModal" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/10">
              ➕ Add New Service
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="service in paginatedServices" :key="service.id" class="glass-panel border border-slate-800 rounded-2xl overflow-hidden p-6 bg-slate-950/40 flex gap-6">
              <div class="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                <img v-if="service.image" :src="service.image" class="w-full h-full object-cover" :alt="service.title_en" />
                <div v-else class="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
              </div>
              <div class="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <h3 class="text-lg font-bold text-white truncate">{{ service.title_en }}</h3>
                  <p class="text-xs text-slate-400 line-clamp-2 mt-1">{{ service.description_en }}</p>
                </div>
                <div class="flex justify-between items-center mt-4 border-t border-slate-900/60 pt-3">
                  <span class="text-[10px] text-slate-500 font-mono truncate">slug: {{ service.slug }}</span>
                  <div class="flex gap-2">
                    <button @click="manageServiceSections(service)" class="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors">
                      Manage Sections
                    </button>
                    <button @click="openEditServiceModal(service)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700">
                      Edit
                    </button>
                    <button @click="deleteService(service)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="services.length === 0" class="col-span-full py-16 text-center text-slate-500 bg-slate-950/20 border border-slate-900 rounded-3xl">
              No services found. Click "Add New Service" to create one.
            </div>
          </div>

          <!-- Pagination for Services -->
          <div v-if="totalServicesPages > 1" class="flex justify-center items-center gap-4 mt-8">
            <button 
              @click="servicesPage--" 
              :disabled="servicesPage === 1"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              ◀ Previous
            </button>
            <span class="text-sm font-bold text-slate-400">Page {{ servicesPage }} of {{ totalServicesPages }}</span>
            <button 
              @click="servicesPage++" 
              :disabled="servicesPage === totalServicesPages"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl text-sm font-bold border border-slate-700 transition-all cursor-pointer"
            >
              Next ▶
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: ADD/EDIT LOCATION -->
    <div v-if="modals.location" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
          <h3 class="text-xl font-black text-white">{{ isEditing ? 'Edit Location' : 'Add New Location' }}</h3>
          <button @click="modals.location = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Section 1: Basic Information -->
          <div class="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">1. Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location Name</label>
                <input type="text" v-model="locationForm.name" placeholder="e.g. Maastricht" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slug</label>
                <input type="text" v-model="locationForm.slug" placeholder="e.g. maastricht" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country (optional)</label>
                <input type="text" v-model="locationForm.country" placeholder="e.g. Germany 🇩🇪" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 2: Media Assets -->
          <div class="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">2. Media Assets</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Main Cover Image -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Cover Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.image" :src="locationForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location')" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Van -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Moving Van Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_van" :src="locationForm.images_van" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_van')" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Boxes -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Boxes Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_boxes" :src="locationForm.images_boxes" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_boxes')" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>

              <!-- Sub-image: Room -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room/Furniture Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="locationForm.images_room" :src="locationForm.images_room" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'location_room')" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                </div>
              </div>
            </div>
            <div v-if="uploading" class="text-xs text-red-500 animate-pulse">Uploading to Cloudinary...</div>
          </div>

          <!-- Section 3: Hero & SEO Metadata -->
          <div class="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">3. Hero & SEO Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Title EN</label>
                <input type="text" v-model="locationForm.hero_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Title NL</label>
                <input type="text" v-model="locationForm.hero_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle EN</label>
                <input type="text" v-model="locationForm.hero_subtitle_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Subtitle NL</label>
                <input type="text" v-model="locationForm.hero_subtitle_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Title EN</label>
                <input type="text" v-model="locationForm.seo_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Title NL</label>
                <input type="text" v-model="locationForm.seo_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Description EN</label>
                <textarea v-model="locationForm.seo_desc_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Description NL</label>
                <textarea v-model="locationForm.seo_desc_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-16 text-sm"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Keywords EN</label>
                <input type="text" v-model="locationForm.seo_keywords_en" placeholder="moving, maastricht, removals" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Keywords NL</label>
                <input type="text" v-model="locationForm.seo_keywords_nl" placeholder="verhuizen, maastricht, verhuisbedrijf" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
              </div>
            </div>
          </div>

          <!-- Section 4: Content Section Textareas -->
          <div class="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 class="font-black text-sm text-red-500 uppercase tracking-wider">4. Section Contents (Divide paragraphs with newlines)</h4>
            <div class="space-y-6">
              <!-- Introduction Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Introduction Title EN</label>
                  <input type="text" v-model="locationForm.intro_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Introduction Title NL</label>
                  <input type="text" v-model="locationForm.intro_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intro Text EN</label>
                  <textarea v-model="locationForm.intro_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intro Text NL</label>
                  <textarea v-model="locationForm.intro_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Residential Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residential Title EN</label>
                  <input type="text" v-model="locationForm.residential_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residential Title NL</label>
                  <input type="text" v-model="locationForm.residential_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residential Text EN</label>
                  <textarea v-model="locationForm.residential_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residential Text NL</label>
                  <textarea v-model="locationForm.residential_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Commercial Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commercial Title EN</label>
                  <input type="text" v-model="locationForm.commercial_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commercial Title NL</label>
                  <input type="text" v-model="locationForm.commercial_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commercial Text EN</label>
                  <textarea v-model="locationForm.commercial_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Commercial Text NL</label>
                  <textarea v-model="locationForm.commercial_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Packing Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Packing Title EN</label>
                  <input type="text" v-model="locationForm.packing_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Packing Title NL</label>
                  <input type="text" v-model="locationForm.packing_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Packing Text EN</label>
                  <textarea v-model="locationForm.packing_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Packing Text NL</label>
                  <textarea v-model="locationForm.packing_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Insights Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insights Title EN</label>
                  <input type="text" v-model="locationForm.insights_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insights Title NL</label>
                  <input type="text" v-model="locationForm.insights_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insights Text EN</label>
                  <textarea v-model="locationForm.insights_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insights Text NL</label>
                  <textarea v-model="locationForm.insights_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Cost Factors Section -->
              <div class="border-b border-slate-900 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost Factors Title EN</label>
                  <input type="text" v-model="locationForm.costs_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost Factors Title NL</label>
                  <input type="text" v-model="locationForm.costs_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost Factors Text EN</label>
                  <textarea v-model="locationForm.costs_text_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost Factors Text NL</label>
                  <textarea v-model="locationForm.costs_text_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-24 text-xs"></textarea>
                </div>
              </div>

              <!-- Neighborhoods Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Neighborhoods Title EN</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Neighborhoods Title NL</label>
                  <input type="text" v-model="locationForm.neighborhoods_title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Neighborhoods EN (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_en" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Neighborhoods NL (Comma-separated)</label>
                  <input type="text" v-model="locationForm.neighborhoods_list_nl" placeholder="Centrum, Wyck, Céramique" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
          <button @click="modals.location = false" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveLocation" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Location' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT BLOG POST -->
    <div v-if="modals.blog" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl my-8 space-y-6">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 class="text-xl font-black text-white">{{ isEditing ? 'Edit Blog Post' : 'Add New Blog Post' }}</h3>
          <button @click="modals.blog = false" class="text-slate-400 hover:text-white">✕</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slug (e.g. 10-tips-stress-free)</label>
            <input type="text" v-model="blogForm.slug" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Date</label>
            <input type="text" v-model="blogForm.date" placeholder="e.g. May 10, 2026" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title EN</label>
            <input type="text" v-model="blogForm.title_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title NL</label>
            <input type="text" v-model="blogForm.title_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category EN</label>
            <input type="text" v-model="blogForm.category_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category NL</label>
            <input type="text" v-model="blogForm.category_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Read Time EN</label>
            <input type="text" v-model="blogForm.read_time_en" placeholder="e.g. 5 min read" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Read Time NL</label>
            <input type="text" v-model="blogForm.read_time_nl" placeholder="e.g. 5 min leestijd" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description EN</label>
            <textarea v-model="blogForm.desc_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description NL</label>
            <textarea v-model="blogForm.desc_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Content EN (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-1 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Content NL (Markdown/HTML)</label>
            <textarea v-model="blogForm.content_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-32 text-sm"></textarea>
          </div>
          <div class="space-y-3 md:col-span-2">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="blogForm.image" :src="blogForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-xs text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'blog')" accept="image/*" class="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-2 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button @click="modals.blog = false" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveBlogPost" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT SERVICE -->
    <div v-if="modals.service" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 class="text-xl font-black text-white">{{ isEditing ? 'Edit Service' : 'Add New Service' }}</h3>
          <button @click="modals.service = false" class="text-slate-400 hover:text-white">✕</button>
        </div>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Service Slug (e.g. lift-rental)</label>
            <input type="text" v-model="serviceForm.slug" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Title EN</label>
            <input type="text" v-model="serviceForm.title_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Title NL</label>
            <input type="text" v-model="serviceForm.title_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Short Description EN</label>
            <textarea v-model="serviceForm.description_en" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Short Description NL</label>
            <textarea v-model="serviceForm.description_nl" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-red-500 h-16 resize-none text-sm"></textarea>
          </div>
          <div class="space-y-3">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Cover Image</label>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0">
                <img v-if="serviceForm.image" :src="serviceForm.image" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] text-slate-600">No Image</span>
              </div>
              <div class="flex-grow">
                <input type="file" @change="e => onFileChange(e, 'service')" accept="image/*" class="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
                <div v-if="uploading" class="text-xs text-red-500 mt-1 animate-pulse">Uploading to Cloudinary...</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button @click="modals.service = false" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="saveService" :disabled="uploading" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isEditing ? 'Save Changes' : 'Create Service' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: MANAGE SERVICE SECTIONS -->
    <div v-if="modals.sections" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div class="glass-panel w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl my-8 space-y-6 flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
          <div>
            <h3 class="text-xl font-black text-white">Customize Sections</h3>
            <p class="text-xs text-slate-400 mt-1">Manage sub-sections inside the "{{ selectedService.title_en }}" page.</p>
          </div>
          <button @click="modals.sections = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <!-- Section list and editor -->
        <div class="flex-grow overflow-y-auto space-y-6 pr-2">
          <!-- Add new section form -->
          <div class="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
            <h4 class="font-bold text-sm text-white border-b border-slate-800/80 pb-2">➕ Add New Section</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section Title EN</label>
                <input type="text" v-model="sectionForm.title_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Section Title NL</label>
                <input type="text" v-model="sectionForm.title_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Content EN</label>
                <textarea v-model="sectionForm.content_en" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Content NL</label>
                <textarea v-model="sectionForm.content_nl" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 h-16 text-xs"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort Order</label>
                <input type="number" v-model.number="sectionForm.sort_order" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:border-red-500 text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Optional Section Image</label>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img v-if="sectionForm.image" :src="sectionForm.image" class="w-full h-full object-cover" />
                    <span v-else class="text-[8px] text-slate-600">None</span>
                  </div>
                  <input type="file" @change="e => onFileChange(e, 'section')" accept="image/*" class="text-[10px] text-slate-400 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[8px] file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer hover:file:bg-slate-700" />
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
            <h4 class="font-bold text-sm text-white">Existing Sections</h4>
            <div v-for="(sec, idx) in serviceSections" :key="sec.id" class="p-5 border border-slate-800/80 rounded-2xl bg-slate-900/60 relative space-y-3">
              <div class="flex justify-between items-start gap-4">
                <h5 class="font-bold text-slate-200 text-xs">Section #{{ idx + 1 }} — {{ sec.title_en }}</h5>
                <button @click="deleteServiceSection(sec)" class="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs">
                  🗑️ Delete
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="text-[11px] text-slate-400"><strong>Title NL:</strong> {{ sec.title_nl }}</div>
                <div class="text-[11px] text-slate-400"><strong>Sort Order:</strong> {{ sec.sort_order }}</div>
                <div class="text-[11px] text-slate-400 md:col-span-2"><strong>Content EN:</strong> {{ sec.content_en }}</div>
                <div class="text-[11px] text-slate-400 md:col-span-2"><strong>Content NL:</strong> {{ sec.content_nl }}</div>
                <div v-if="sec.image" class="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 md:col-span-2 mt-2">
                  <img :src="sec.image" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div v-if="serviceSections.length === 0" class="text-center py-8 text-xs text-slate-500 bg-slate-950/20 rounded-2xl border border-slate-900">
              No custom sub-sections added yet for this service.
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-800 shrink-0">
          <button @click="modals.sections = false" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs border border-slate-700">Done</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { $supabase } = useNuxtApp()
const { t } = useI18n()

// Authorization State
const isAuthorized = ref(false)
const emailInput = ref('')
const passwordInput = ref('')
const authLoading = ref(false)
const authError = ref('')

const handleLogin = async () => {
  authLoading.value = true
  authError.value = ''
  try {
    const res = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: { 
        email: emailInput.value,
        password: passwordInput.value 
      }
    })
    if (res.success) {
      isAuthorized.value = true
      if (process.client) {
        localStorage.setItem('moveit_admin_authorized', 'true')
        localStorage.setItem('moveit_admin_email', emailInput.value)
        localStorage.setItem('moveit_admin_password', passwordInput.value)
      }
      loadAllData()
    }
  } catch (err) {
    authError.value = 'Incorrect email or password. Access denied.'
  } finally {
    authLoading.value = false
  }
}

const logout = () => {
  isAuthorized.value = false
  emailInput.value = ''
  passwordInput.value = ''
  if (process.client) {
    localStorage.removeItem('moveit_admin_authorized')
    localStorage.removeItem('moveit_admin_email')
    localStorage.removeItem('moveit_admin_password')
  }
}

// Check auth on mount
onMounted(() => {
  if (process.client) {
    const savedAuth = localStorage.getItem('moveit_admin_authorized')
    const savedEmail = localStorage.getItem('moveit_admin_email')
    const savedPassword = localStorage.getItem('moveit_admin_password')
    if (savedAuth === 'true' && savedEmail && savedPassword) {
      emailInput.value = savedEmail
      passwordInput.value = savedPassword
      handleLogin()
    }
  }
})

// Tab control
const activeTab = ref('locations')

// Data arrays
const locations = ref([])
const blogPosts = ref([])
const services = ref([])
const serviceSections = ref([])

// Pagination Setup
const itemsPerPage = 10
const locationsPage = ref(1)
const blogPage = ref(1)
const servicesPage = ref(1)

const paginatedLocations = computed(() => {
  const start = (locationsPage.value - 1) * itemsPerPage
  return locations.value.slice(start, start + itemsPerPage)
})

const totalLocationsPages = computed(() => {
  return Math.ceil(locations.value.length / itemsPerPage) || 1
})

const paginatedBlogPosts = computed(() => {
  const start = (blogPage.value - 1) * itemsPerPage
  return blogPosts.value.slice(start, start + itemsPerPage)
})

const totalBlogPages = computed(() => {
  return Math.ceil(blogPosts.value.length / itemsPerPage) || 1
})

const paginatedServices = computed(() => {
  const start = (servicesPage.value - 1) * itemsPerPage
  return services.value.slice(start, start + itemsPerPage)
})

const totalServicesPages = computed(() => {
  return Math.ceil(services.value.length / itemsPerPage) || 1
})

// Load all data from Supabase
const loadAllData = async () => {
  if (!$supabase) return
  
  // Load Locations
  const { data: locs } = await $supabase.from('locations').select('*').order('name')
  if (locs) locations.value = locs

  // Load Blog Posts
  const { data: blogs } = await $supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (blogs) blogPosts.value = blogs

  // Load Services
  const { data: servs } = await $supabase.from('services').select('*').order('id')
  if (servs) services.value = servs
}


// 1. Locations Logic
const locationForm = ref({
  slug: '', name: '', country: '', image: '',
  images_boxes: '', images_van: '', images_room: '',
  hero_title_en: '', hero_title_nl: '', hero_subtitle_en: '', hero_subtitle_nl: '',
  seo_title_en: '', seo_title_nl: '', seo_desc_en: '', seo_desc_nl: '', seo_keywords_en: '', seo_keywords_nl: '',
  intro_title_en: '', intro_title_nl: '', intro_text_en: '', intro_text_nl: '',
  residential_title_en: '', residential_title_nl: '', residential_text_en: '', residential_text_nl: '',
  commercial_title_en: '', commercial_title_nl: '', commercial_text_en: '', commercial_text_nl: '',
  packing_title_en: '', packing_title_nl: '', packing_text_en: '', packing_text_nl: '',
  insights_title_en: '', insights_title_nl: '', insights_text_en: '', insights_text_nl: '',
  costs_title_en: '', costs_title_nl: '', costs_text_en: '', costs_text_nl: '',
  neighborhoods_title_en: '', neighborhoods_title_nl: '', neighborhoods_list_en: '', neighborhoods_list_nl: ''
})

const openAddLocationModal = () => {
  isEditing.value = false
  locationForm.value = {
    slug: '', name: '', country: '', image: '',
    images_boxes: '', images_van: '', images_room: '',
    hero_title_en: '', hero_title_nl: '', hero_subtitle_en: '', hero_subtitle_nl: '',
    seo_title_en: '', seo_title_nl: '', seo_desc_en: '', seo_desc_nl: '', seo_keywords_en: '', seo_keywords_nl: '',
    intro_title_en: '', intro_title_nl: '', intro_text_en: '', intro_text_nl: '',
    residential_title_en: '', residential_title_nl: '', residential_text_en: '', residential_text_nl: '',
    commercial_title_en: '', commercial_title_nl: '', commercial_text_en: '', commercial_text_nl: '',
    packing_title_en: '', packing_title_nl: '', packing_text_en: '', packing_text_nl: '',
    insights_title_en: '', insights_title_nl: '', insights_text_en: '', insights_text_nl: '',
    costs_title_en: '', costs_title_nl: '', costs_text_en: '', costs_text_nl: '',
    neighborhoods_title_en: '', neighborhoods_title_nl: '', neighborhoods_list_en: '', neighborhoods_list_nl: ''
  }
  modals.value.location = true
}

const openEditLocationModal = (loc) => {
  isEditing.value = true
  selectedItem.value = loc
  locationForm.value = { ...loc }
  modals.value.location = true
}

const saveLocation = async () => {
  if (!$supabase || !locationForm.value.slug) return
  
  if (isEditing.value && selectedItem.value) {
    const { error } = await $supabase.from('locations').update({ ...locationForm.value }).eq('id', selectedItem.value.id)
    if (!error) {
      const idx = locations.value.findIndex(l => l.id === selectedItem.value.id)
      if (idx !== -1) locations.value[idx] = { ...locationForm.value }
      modals.value.location = false
    } else {
      alert('Error updating location: ' + error.message)
    }
  } else {
    const { data, error } = await $supabase.from('locations').insert([{ ...locationForm.value }]).select()
    if (!error && data) {
      locations.value.push(data[0])
      locations.value.sort((a, b) => a.name.localeCompare(b.name))
      modals.value.location = false
    } else {
      alert('Error creating location: ' + error.message)
    }
  }
}

const deleteLocation = async (loc) => {
  if (!$supabase || !confirm(`Delete location "${loc.name}"?`)) return
  const { error } = await $supabase.from('locations').delete().eq('id', loc.id)
  if (!error) {
    locations.value = locations.value.filter(l => l.id !== loc.id)
    if (locationsPage.value > totalLocationsPages.value) {
      locationsPage.value = Math.max(1, totalLocationsPages.value)
    }
  }
}


// 2. Blog Posts Logic
const blogForm = ref({ slug: '', date: '', title_en: '', title_nl: '', desc_en: '', desc_nl: '', content_en: '', content_nl: '', category_en: '', category_nl: '', read_time_en: '', read_time_nl: '', image: '' })
const isEditing = ref(false)
const selectedItem = ref(null)
const uploading = ref(false)

const onFileChange = async (e, type) => {
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
      if (type === 'blog') blogForm.value.image = res.url
      else if (type === 'service') serviceForm.value.image = res.url
      else if (type === 'section') sectionForm.value.image = res.url
      else if (type === 'location') locationForm.value.image = res.url
      else if (type === 'location_van') locationForm.value.images_van = res.url
      else if (type === 'location_boxes') locationForm.value.images_boxes = res.url
      else if (type === 'location_room') locationForm.value.images_room = res.url
    }
  } catch (err) {
    alert('Failed to upload image to Cloudinary.')
  } finally {
    uploading.value = false
  }
}

const openAddBlogModal = () => {
  isEditing.value = false
  blogForm.value = { slug: '', date: '', title_en: '', title_nl: '', desc_en: '', desc_nl: '', content_en: '', content_nl: '', category_en: '', category_nl: '', read_time_en: '', read_time_nl: '', image: '' }
  modals.value.blog = true
}

const openEditBlogModal = (post) => {
  isEditing.value = true
  selectedItem.value = post
  blogForm.value = { ...post }
  modals.value.blog = true
}

const saveBlogPost = async () => {
  if (!$supabase || !blogForm.value.slug) return
  
  if (isEditing.value && selectedItem.value) {
    const { error } = await $supabase.from('blog_posts').update({ ...blogForm.value }).eq('id', selectedItem.value.id)
    if (!error) {
      const idx = blogPosts.value.findIndex(p => p.id === selectedItem.value.id)
      if (idx !== -1) blogPosts.value[idx] = { ...blogForm.value }
      modals.value.blog = false
    } else {
      alert('Error updating post: ' + error.message)
    }
  } else {
    const { data, error } = await $supabase.from('blog_posts').insert([{ ...blogForm.value }]).select()
    if (!error && data) {
      blogPosts.value.unshift(data[0])
      modals.value.blog = false
    } else {
      alert('Error creating post: ' + error.message)
    }
  }
}

const deleteBlogPost = async (post) => {
  if (!$supabase || !confirm(`Delete post "${post.title_en}"?`)) return
  const { error } = await $supabase.from('blog_posts').delete().eq('id', post.id)
  if (!error) {
    blogPosts.value = blogPosts.value.filter(p => p.id !== post.id)
    if (blogPage.value > totalBlogPages.value) {
      blogPage.value = Math.max(1, totalBlogPages.value)
    }
  }
}


// 3. Services Logic
const serviceForm = ref({ slug: '', title_en: '', title_nl: '', description_en: '', description_nl: '', image: '' })

const openAddServiceModal = () => {
  isEditing.value = false
  serviceForm.value = { slug: '', title_en: '', title_nl: '', description_en: '', description_nl: '', image: '' }
  modals.value.service = true
}

const openEditServiceModal = (service) => {
  isEditing.value = true
  selectedItem.value = service
  serviceForm.value = { ...service }
  modals.value.service = true
}

const saveService = async () => {
  if (!$supabase || !serviceForm.value.slug) return
  
  if (isEditing.value && selectedItem.value) {
    const { error } = await $supabase.from('services').update({ ...serviceForm.value }).eq('id', selectedItem.value.id)
    if (!error) {
      const idx = services.value.findIndex(s => s.id === selectedItem.value.id)
      if (idx !== -1) services.value[idx] = { ...serviceForm.value }
      modals.value.service = false
    } else {
      alert('Error updating service: ' + error.message)
    }
  } else {
    const { data, error } = await $supabase.from('services').insert([{ ...serviceForm.value }]).select()
    if (!error && data) {
      services.value.push(data[0])
      modals.value.service = false
    } else {
      alert('Error creating service: ' + error.message)
    }
  }
}

const deleteService = async (service) => {
  if (!$supabase || !confirm(`Delete service "${service.title_en}" and all its sections?`)) return
  const { error } = await $supabase.from('services').delete().eq('id', service.id)
  if (!error) {
    services.value = services.value.filter(s => s.id !== service.id)
    if (servicesPage.value > totalServicesPages.value) {
      servicesPage.value = Math.max(1, totalServicesPages.value)
    }
  }
}


// 4. Service Inner Sections Logic
const selectedService = ref(null)
const sectionForm = ref({ title_en: '', title_nl: '', content_en: '', content_nl: '', image: '', sort_order: 0 })

const manageServiceSections = async (service) => {
  if (!$supabase) return
  selectedService.value = service
  sectionForm.value = { title_en: '', title_nl: '', content_en: '', content_nl: '', image: '', sort_order: 0 }
  
  // Load sections for this service
  const { data: secs } = await $supabase
    .from('service_sections')
    .select('*')
    .eq('service_id', service.id)
    .order('sort_order')
    
  if (secs) serviceSections.value = secs
  modals.value.sections = true
}

const addServiceSection = async () => {
  if (!$supabase || !selectedService.value) return
  
  const { data, error } = await $supabase.from('service_sections').insert([{
    service_id: selectedService.value.id,
    ...sectionForm.value
  }]).select()
  
  if (!error && data) {
    serviceSections.value.push(data[0])
    serviceSections.value.sort((a, b) => a.sort_order - b.sort_order)
    sectionForm.value = { title_en: '', title_nl: '', content_en: '', content_nl: '', image: '', sort_order: 0 }
  } else {
    alert('Error adding section: ' + (error ? error.message : 'Unknown error'))
  }
}

const deleteServiceSection = async (sec) => {
  if (!$supabase || !confirm(`Delete this section?`)) return
  const { error } = await $supabase.from('service_sections').delete().eq('id', sec.id)
  if (!error) {
    serviceSections.value = serviceSections.value.filter(s => s.id !== sec.id)
  }
}

// Modals display control
const modals = ref({
  location: false,
  blog: false,
  service: false,
  sections: false
})
</script>

<style scoped>
.glass-panel {
  @apply bg-slate-950/70 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl;
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

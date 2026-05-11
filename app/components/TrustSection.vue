<template>
  <div class="py-12 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
    <div class="container mx-auto px-6">
      <div class="flex flex-wrap items-center justify-center gap-10 md:gap-20 transition-all duration-500">
        <!-- Google Reviews -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="bg-white p-2.5 rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
            <svg class="h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span class="ml-2 font-bold text-slate-600">Google</span>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-0.5">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <span class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">4.9/5 Rating</span>
          </div>
        </div>

        <!-- Trustpilot -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="flex items-center gap-2">
            <svg class="w-8 h-8 text-[#00b67a]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.427 9.21l3.763 2.734L19.76 16.5l3.765 2.732L21.43 24l-3.765-2.73L13.9 24l2.095-4.768L12.23 16.5l3.765-2.732-2.095-4.768h7.527zM24 9.21h-7.527l-2.095-4.768L12.283 9.21H4.756l6.09 4.425-2.326 5.31L14.61 14.52l6.09 4.425-2.326-5.31L24 9.21z"/>
            </svg>
            <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Trustpilot</span>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-1">
              <div v-for="i in 5" :key="i" class="w-4 h-4 bg-[#00b67a] flex items-center justify-center rounded-sm">
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
            <span class="text-xs font-black text-[#00b67a] uppercase tracking-tight">Excellent</span>
          </div>
        </div>

        <!-- Erkende Verhuizers -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] text-center leading-none shadow-lg shadow-red-600/20 rotate-3 transition-transform group-hover:rotate-0">
            ERKENDE<br/>VERHUIZERS
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Certified Member</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Dutch Association</span>
          </div>
        </div>

        <!-- SIRE -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="border-4 border-red-600 px-3 py-1.5 text-red-600 font-black text-xl italic rounded-lg">SIRE</div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Quality Verified</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">NL Standards</span>
          </div>
        </div>

        <!-- Marktplaats -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="font-black text-2xl text-blue-600 italic tracking-tighter">Marktplaats</div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">Top Rated Partner</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

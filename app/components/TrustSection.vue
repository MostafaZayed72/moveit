<template>
  <div class="py-12 border-y border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
    <div class="container mx-auto px-6">
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
        <!-- Google Reviews -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="bg-white p-2 rounded-lg shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" class="h-6" />
          </div>
          <div class="flex flex-col">
            <div class="flex gap-0.5">
              <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">4.9 Rating (500+ Reviews)</span>
          </div>
        </div>

        <!-- Trustpilot -->
        <div class="flex items-center gap-2 group cursor-pointer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Trustpilot_logo.svg" alt="Trustpilot" class="h-8" />
          <div class="flex flex-col">
            <div class="flex gap-0.5 bg-[#00b67a] p-0.5 rounded">
              <div v-for="i in 5" :key="i" class="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Excellent</span>
          </div>
        </div>

        <!-- Erkende Verhuizers (Dutch Moving Association) -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-[10px] text-center leading-none shadow-lg">
            ERKENDE<br/>VERHUIZERS
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-800 dark:text-white uppercase">Certified Member</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">Dutch Moving Association</span>
          </div>
        </div>

        <!-- SIRE (Dutch Trust Symbol) -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="border-2 border-red-600 px-2 py-1 text-red-600 font-black text-sm italic">SIRE</div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-slate-800 dark:text-white uppercase">Quality Verified</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">NL Professional Standards</span>
          </div>
        </div>

        <!-- Marktplaats -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="font-black text-xl text-blue-600 italic">Marktplaats</div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Top Rated Partner</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

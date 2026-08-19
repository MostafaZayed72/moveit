const fs = require('fs');
const file = 'f:\\أبورك\\MoveIt\\app\\pages\\admin\\index.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Add confirmDialog state
if (!content.includes('const confirmDialog = ref')) {
    const stateHookStr = `const isEditing = ref(false)
const selectedItem = ref(null)`
    
    const stateHookReplacement = `const confirmDialog = ref({ isOpen: false, title: '', message: '', isAlert: false, resolve: null })
const showConfirm = (title, message, isAlert = false) => {
  return new Promise((resolve) => {
    confirmDialog.value = {
      isOpen: true,
      title,
      message,
      isAlert,
      confirm: () => {
        confirmDialog.value.isOpen = false;
        resolve(true);
      },
      cancel: () => {
        confirmDialog.value.isOpen = false;
        resolve(false);
      }
    }
  })
}

const isEditing = ref(false)
const selectedItem = ref(null)`

    content = content.replace(stateHookStr, stateHookReplacement);
}

// 2. Add confirmDialog HTML right before the end of the template (or after the first modal)
if (!content.includes('confirmDialog.isOpen')) {
    const modalHook = `<!-- MODAL: EDIT ORDER -->`
    const dialogHTML = `
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
          <button v-if="!confirmDialog.isAlert" @click="confirmDialog.cancel" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all border border-slate-700">Cancel</button>
          <button @click="confirmDialog.confirm" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">OK</button>
        </div>
      </div>
    </div>

    <!-- MODAL: EDIT ORDER -->`
    
    content = content.replace(modalHook, dialogHTML);
}

// 3. Replace alert and confirm usages in functions
// Examples:
// if (!confirm("Are you sure?")) return
// => if (!(await showConfirm('Confirmation', "Are you sure?"))) return
content = content.replace(/if\s*\(!confirm\((.*?)\)\)\s*return/g, 'if (!(await showConfirm("Confirmation", $1))) return');
content = content.replace(/alert\((.*?)\)/g, 'await showConfirm("Notice", $1, true)');

fs.writeFileSync(file, content, 'utf8');
console.log('Dialogs updated successfully!');

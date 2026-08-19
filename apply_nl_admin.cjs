const fs = require('fs');

const indexFile = 'f:/أبورك/MoveIt/app/pages/admin/index.vue';
let content = fs.readFileSync(indexFile, 'utf8');

// 1. Fix the sidebar text
content = content.replace(
    /\{\{\s*tab\s*\}\}/g,
    "{{ $t('admin.menu.' + tab) }}"
);

// 2. Fix Admin Dashboard Title
content = content.replace(
    />Admin Dashboard</g,
    ">{{ $t('admin.title') }}<"
);

// 3. Fix the Manage titles
content = content.replace(
    />Manage Orders</g,
    ">{{ $t('admin.orders.title') }}<"
);
content = content.replace(
    />Manage Customers</g,
    ">{{ $t('admin.customers.title') }}<"
);
content = content.replace(
    />Financial Overview</g,
    ">{{ $t('admin.financials.title') }}<"
);
content = content.replace(
    />Manage Locations</g,
    ">{{ $t('admin.locations.title') }}<"
);

// 4. Fix Logout button
content = content.replace(
    /<span>Logout<\/span>/g,
    "<span>{{ $t('admin.menu.logout') }}</span>"
);

// 5. Fix "Add New Location"
content = content.replace(
    /Add New Location/g,
    "{{ $t('admin.locations.add') }}"
);

// 6. Fix "No locations found"
content = content.replace(
    /No locations found\. Click "{{ \$t\('admin\.locations\.add'\) }}" to create one\./g,
    "{{ $t('admin.locations.empty') }}"
);
content = content.replace(
    /No locations found\. Click "Add New Location" to create one\./g,
    "{{ $t('admin.locations.empty') }}"
);

// 7. Fix placeholders
content = content.replace(
    /placeholder="Search orders \(ID, Name, Email\)\.\.\."/g,
    `:placeholder="$t('admin.orders.search')"`
);
content = content.replace(
    /placeholder="Search customers \(Name, Email, Phone\)\.\.\."/g,
    `:placeholder="$t('admin.customers.search')"`
);

// Save
fs.writeFileSync(indexFile, content, 'utf8');
console.log('Fixed admin translations robustly!');

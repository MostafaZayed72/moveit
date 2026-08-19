const fs = require('fs');
let content = fs.readFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', 'utf8');

const replacements = [
    ['>Admin Dashboard<', '>{{ $t(\'admin.title\') }}<'],
    ['>ORDERS<', '>{{ $t(\'admin.menu.orders\') }}<'],
    ['>CUSTOMERS<', '>{{ $t(\'admin.menu.customers\') }}<'],
    ['>FINANCIALS<', '>{{ $t(\'admin.menu.financials\') }}<'],
    ['>LOCATIONS<', '>{{ $t(\'admin.menu.locations\') }}<'],
    ['>BLOG<', '>{{ $t(\'admin.menu.blog\') }}<'],
    ['>SERVICES<', '>{{ $t(\'admin.menu.services\') }}<'],
    ['>PRICING<', '>{{ $t(\'admin.menu.pricing\') }}<'],
    ['>PRODUCTS<', '>{{ $t(\'admin.menu.products\') }}<'],
    ['>Logout<', '>{{ $t(\'admin.menu.logout\') }}<'],
    
    // Titles
    ['>Manage Orders<', '>{{ $t(\'admin.orders.title\') }}<'],
    ['>Manage Customers<', '>{{ $t(\'admin.customers.title\') }}<'],
    ['>Financial Overview<', '>{{ $t(\'admin.financials.title\') }}<'],
    ['>Manage Locations<', '>{{ $t(\'admin.locations.title\') }}<'],
    
    // Some buttons
    ['>Add New Location<', '>{{ $t(\'admin.locations.add\') }}<'],
    ['placeholder="Search orders (ID, Name, Email)..."', ':placeholder="$t(\'admin.orders.search\')"'],
    ['placeholder="Search customers (Name, Email, Phone)..."', ':placeholder="$t(\'admin.customers.search\')"'],
];

for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
}

fs.writeFileSync('f:/أبورك/MoveIt/app/pages/admin/index.vue', content);
console.log('Applied i18n replacements to admin page');

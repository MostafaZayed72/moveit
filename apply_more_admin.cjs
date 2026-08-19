const fs = require('fs');

const indexFile = 'f:/أبورك/MoveIt/app/pages/admin/index.vue';
let content = fs.readFileSync(indexFile, 'utf8');

const replacements = [
    // Orders table headers
    ['<th>Order ID</th>', '<th>{{ $t(\'admin.orders.table.id\') }}</th>'],
    ['<th>Customer</th>', '<th>{{ $t(\'admin.orders.table.customer\') }}</th>'],
    ['<th>Date</th>', '<th>{{ $t(\'admin.orders.table.date\') }}</th>'],
    ['<th>Service</th>', '<th>{{ $t(\'admin.orders.table.service\') }}</th>'],
    ['<th>Status</th>', '<th>{{ $t(\'admin.orders.table.status\') }}</th>'],
    ['<th>Total</th>', '<th>{{ $t(\'admin.orders.table.total\') }}</th>'],
    ['<th>Actions</th>', '<th>{{ $t(\'admin.orders.table.actions\') }}</th>'],

    // Orders Filter dropdown
    ['<option value="all">All Statuses</option>', '<option value="all">{{ $t(\'admin.orders.status.all\') }}</option>'],
    ['<option value="pending">Pending</option>', '<option value="pending">{{ $t(\'admin.orders.status.pending\') }}</option>'],
    ['<option value="confirmed">Confirmed</option>', '<option value="confirmed">{{ $t(\'admin.orders.status.confirmed\') }}</option>'],
    ['<option value="completed">Completed</option>', '<option value="completed">{{ $t(\'admin.orders.status.completed\') }}</option>'],
    ['<option value="cancelled">Cancelled</option>', '<option value="cancelled">{{ $t(\'admin.orders.status.cancelled\') }}</option>'],

    // Customers table headers
    ['<th>Name</th>', '<th>{{ $t(\'admin.customers.table.name\') }}</th>'],
    ['<th>Email</th>', '<th>{{ $t(\'admin.customers.table.email\') }}</th>'],
    ['<th>Phone</th>', '<th>{{ $t(\'admin.customers.table.phone\') }}</th>'],
    ['<th>Total Orders</th>', '<th>{{ $t(\'admin.customers.table.orders\') }}</th>'],
    ['<th>Total Spent</th>', '<th>{{ $t(\'admin.customers.table.spent\') }}</th>'],
    ['<th>Joined</th>', '<th>{{ $t(\'admin.customers.table.joined\') }}</th>'],

    // Financials table headers
    ['<th>Type</th>', '<th>{{ $t(\'admin.financials.table.type\') }}</th>'],
    ['<th>Amount</th>', '<th>{{ $t(\'admin.financials.table.amount\') }}</th>'],
    
    // Financials summary
    ['>Total Revenue<', '>{{ $t(\'admin.financials.summary.revenue\') }}<'],
    ['>Total Expenses<', '>{{ $t(\'admin.financials.summary.expenses\') }}<'],
    ['>Net Profit<', '>{{ $t(\'admin.financials.summary.profit\') }}<'],
    ['>Pending Payments<', '>{{ $t(\'admin.financials.summary.pending\') }}<'],

    // Buttons
    ['>Search<', '>Search<'], // Wait, didn't translate Search button text yet, let's leave it or translate.

    // Order Details Modal
    ['>Order Details<', '>{{ $t(\'admin.orders.details.title\') }}<'],
    ['>Order Info<', '>{{ $t(\'admin.orders.details.orderInfo\') }}<'],
    ['>Customer Info<', '>{{ $t(\'admin.orders.details.customerInfo\') }}<'],
    ['>Move Details<', '>{{ $t(\'admin.orders.details.moveDetails\') }}<'],
    ['>Inventory & Items<', '>{{ $t(\'admin.orders.details.inventory\') }}<'],
    ['>Financials & Payment<', '>{{ $t(\'admin.orders.details.financials\') }}<'],
    ['>Est. Cost<', '>{{ $t(\'admin.orders.details.cost\') }}<'],
    ['>Total Volume<', '>{{ $t(\'admin.orders.details.totalVolume\') }}<'],
    ['>From<', '>{{ $t(\'admin.orders.details.from\') }}<'],
    ['>To<', '>{{ $t(\'admin.orders.details.to\') }}<'],
    ['>Move Date<', '>{{ $t(\'admin.orders.details.date\') }}<'],
    ['>Floor<', '>{{ $t(\'admin.orders.details.floor\') }}<'],
    ['>Elevator<', '>{{ $t(\'admin.orders.details.elevator\') }}<'],
    ['>Parking Space<', '>{{ $t(\'admin.orders.details.parkingSpace\') }}<'],
    ['>Close<', '>{{ $t(\'admin.orders.details.close\') }}<'],
    ['>Save Changes<', '>{{ $t(\'admin.orders.details.save\') }}<'],
];

for (const [search, replace] of replacements) {
    content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
}

fs.writeFileSync(indexFile, content, 'utf8');
console.log('Applied additional translations!');

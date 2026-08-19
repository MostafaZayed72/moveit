const fs = require('fs');

const enFile = 'f:/أبورك/MoveIt/app/locales/en.json';
const nlFile = 'f:/أبورك/MoveIt/app/locales/nl.json';

const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const nlData = JSON.parse(fs.readFileSync(nlFile, 'utf8'));

const adminEn = {
    title: "Admin Dashboard",
    menu: {
        orders: "ORDERS",
        customers: "CUSTOMERS",
        financials: "FINANCIALS",
        locations: "LOCATIONS",
        blog: "BLOG",
        services: "SERVICES",
        pricing: "PRICING",
        products: "PRODUCTS",
        logout: "Logout"
    },
    orders: {
        title: "Manage Orders",
        search: "Search orders (ID, Name, Email)...",
        status: {
            all: "All Statuses",
            pending: "Pending",
            confirmed: "Confirmed",
            completed: "Completed",
            cancelled: "Cancelled"
        },
        table: {
            id: "Order ID",
            customer: "Customer",
            date: "Date",
            service: "Service",
            status: "Status",
            total: "Total",
            actions: "Actions"
        },
        details: {
            title: "Order Details",
            orderInfo: "Order Info",
            customerInfo: "Customer Info",
            moveDetails: "Move Details",
            inventory: "Inventory & Items",
            financials: "Financials & Payment",
            cost: "Est. Cost",
            totalVolume: "Total Volume",
            from: "From",
            to: "To",
            date: "Move Date",
            floor: "Floor",
            elevator: "Elevator",
            yes: "Yes",
            no: "No",
            parkingSpace: "Parking Space",
            close: "Close",
            save: "Save Changes"
        }
    },
    customers: {
        title: "Manage Customers",
        search: "Search customers (Name, Email, Phone)...",
        table: {
            name: "Name",
            email: "Email",
            phone: "Phone",
            orders: "Total Orders",
            spent: "Total Spent",
            joined: "Joined",
            actions: "Actions"
        }
    },
    financials: {
        title: "Financial Overview",
        summary: {
            revenue: "Total Revenue",
            expenses: "Total Expenses",
            profit: "Net Profit",
            pending: "Pending Payments"
        },
        table: {
            orderId: "Order ID",
            date: "Date",
            customer: "Customer",
            amount: "Amount",
            status: "Status",
            type: "Type"
        }
    },
    locations: {
        title: "Manage Locations",
        add: "Add New Location",
        empty: "No locations found. Click 'Add New Location' to create one.",
        sections: "Sections",
        edit: "Edit"
    }
};

const adminNl = {
    title: "Beheerdersdashboard",
    menu: {
        orders: "BESTELLINGEN",
        customers: "KLANTEN",
        financials: "FINANCIËN",
        locations: "LOCATIES",
        blog: "BLOG",
        services: "DIENSTEN",
        pricing: "PRIJZEN",
        products: "PRODUCTEN",
        logout: "Uitloggen"
    },
    orders: {
        title: "Beheer Bestellingen",
        search: "Zoeken (ID, Naam, E-mail)...",
        status: {
            all: "Alle statussen",
            pending: "In behandeling",
            confirmed: "Bevestigd",
            completed: "Voltooid",
            cancelled: "Geannuleerd"
        },
        table: {
            id: "Bestel-ID",
            customer: "Klant",
            date: "Datum",
            service: "Dienst",
            status: "Status",
            total: "Totaal",
            actions: "Acties"
        },
        details: {
            title: "Bestelgegevens",
            orderInfo: "Bestelinformatie",
            customerInfo: "Klantinformatie",
            moveDetails: "Verhuisgegevens",
            inventory: "Inventaris & Items",
            financials: "Financiën & Betaling",
            cost: "Geschatte kosten",
            totalVolume: "Totale volume",
            from: "Van",
            to: "Naar",
            date: "Verhuisdatum",
            floor: "Verdieping",
            elevator: "Lift",
            yes: "Ja",
            no: "Nee",
            parkingSpace: "Parkeerplaats",
            close: "Sluiten",
            save: "Opslaan"
        }
    },
    customers: {
        title: "Beheer Klanten",
        search: "Zoeken (Naam, E-mail, Telefoon)...",
        table: {
            name: "Naam",
            email: "E-mail",
            phone: "Telefoon",
            orders: "Totaal Bestellingen",
            spent: "Totaal Besteed",
            joined: "Lid sinds",
            actions: "Acties"
        }
    },
    financials: {
        title: "Financieel Overzicht",
        summary: {
            revenue: "Totale Omzet",
            expenses: "Totale Uitgaven",
            profit: "Netto Winst",
            pending: "Openstaande Betalingen"
        },
        table: {
            orderId: "Bestel-ID",
            date: "Datum",
            customer: "Klant",
            amount: "Bedrag",
            status: "Status",
            type: "Type"
        }
    },
    locations: {
        title: "Beheer Locaties",
        add: "Nieuwe Locatie",
        empty: "Geen locaties gevonden. Klik op 'Nieuwe Locatie' om er een aan te maken.",
        sections: "Secties",
        edit: "Bewerken"
    }
};

enData.admin = adminEn;
nlData.admin = adminNl;

fs.writeFileSync(enFile, JSON.stringify(enData, null, 2), 'utf8');
fs.writeFileSync(nlFile, JSON.stringify(nlData, null, 2), 'utf8');
console.log("Updated locales");

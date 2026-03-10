// admin.js - JavaScript pour l'interface d'administration

// Données de test pour l'admin
const adminData = {
    dashboard: {
        occupancy: 78,
        dailyRevenue: 4850,
        activeBookings: 42,
        occupiedTables: '12/20',
        monthlyRevenue: 145500,
        checkinsToday: 8,
        checkoutsToday: 6,
        averageStay: 3.2
    },
    reservations: [
        {
            id: 1001,
            guestName: "Martin Dupont",
            roomType: "Suite",
            checkin: "2023-06-15",
            checkout: "2023-06-18",
            status: "confirmed",
            total: 840,
            payment: "card"
        },
        {
            id: 1002,
            guestName: "Sophie Leroy",
            roomType: "Chambre Deluxe",
            checkin: "2023-06-14",
            checkout: "2023-06-16",
            status: "in-house",
            total: 360,
            payment: "room-charge"
        }
    ],
    clients: [
        {
            id: 501,
            name: "Jean Martin",
            email: "jean.martin@email.com",
            phone: "+33123456789",
            totalStays: 5,
            lastStay: "2023-05-20",
            preferences: ["vue ville", "lit king-size", "journal quotidien"]
        }
    ],
    orders: [
        {
            id: 2001,
            table: 5,
            items: ["Filet de bœuf", "Soufflé au chocolat"],
            total: 54,
            status: "served",
            time: "19:45"
        }
    ],
    stock: [
        {
            id: 3001,
            item: "Filet de bœuf",
            category: "viandes",
            quantity: 15,
            minQuantity: 10,
            unit: "kg",
            expiry: "2023-06-20"
        }
    ],
    staff: [
        {
            id: 101,
            name: "Marie Laurent",
            role: "réceptionniste",
            schedule: "7h-15h",
            email: "marie.l@lawmar.com"
        }
    ],
    expenses: [
        {
            id: 4001,
            category: "alimentation",
            description: "Commande de vins",
            amount: 1250,
            date: "2023-06-10",
            supplier: "Cave des Champs"
        }
    ]
};

// Vérification de connexion
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    initAdminDashboard();
    setupEventListeners();
});

function checkAdminAuth() {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        // Rediriger vers la page d'accueil si non connecté
        window.location.href = 'index.html';
        return;
    }
    
    // Mettre à jour le badge du rôle
    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) {
        roleBadge.textContent = getRoleName(userRole);
    }
    
    // Restreindre l'accès selon le rôle
    restrictAccessByRole(userRole);
}

function getRoleName(role) {
    const roles = {
        'reception': 'Réception',
        'serveur': 'Serveur',
        'cuisine': 'Cuisine',
        'manager': 'Manager'
    };
    return roles[role] || role;
}

function restrictAccessByRole(role) {
    // Cacher certaines sections selon le rôle
    if (role !== 'manager') {
        document.querySelectorAll('[data-role="manager"]').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    if (role === 'cuisine') {
        document.querySelectorAll('[data-role="reception"], [data-role="serveur"]').forEach(el => {
            el.style.display = 'none';
        });
    }
}

function initAdminDashboard() {
    updateDashboardStats();
    loadReservations();
    loadClientList();
    loadOrders();
    loadStock();
    loadStaffSchedule();
    loadExpenses();
    
    // Initialiser les graphiques
    initCharts();
}

function updateDashboardStats() {
    const stats = adminData.dashboard;
    
    // Mettre à jour les cartes statistiques
    document.getElementById('occupancy-rate').textContent = stats.occupancy + '%';
    document.getElementById('daily-revenue').textContent = stats.dailyRevenue.toLocaleString() + '€';
    document.getElementById('active-bookings').textContent = stats.activeBookings;
    document.getElementById('occupied-tables').textContent = stats.occupiedTables;
    
    // Mettre à jour d'autres statistiques si les éléments existent
    const monthlyRevenueEl = document.getElementById('monthly-revenue');
    const checkinsTodayEl = document.getElementById('checkins-today');
    const checkoutsTodayEl = document.getElementById('checkouts-today');
    
    if (monthlyRevenueEl) monthlyRevenueEl.textContent = stats.monthlyRevenue.toLocaleString() + '€';
    if (checkinsTodayEl) checkinsTodayEl.textContent = stats.checkinsToday;
    if (checkoutsTodayEl) checkoutsTodayEl.textContent = stats.checkoutsToday;
}

function loadReservations() {
    const reservationsContainer = document.getElementById('reservations-list');
    if (!reservationsContainer) return;
    
    adminData.reservations.forEach(reservation => {
        const statusClass = getStatusClass(reservation.status);
        const statusText = getStatusText(reservation.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${reservation.id}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.roomType}</td>
            <td>${formatDate(reservation.checkin)}</td>
            <td>${formatDate(reservation.checkout)}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>${reservation.total}€</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewReservation(${reservation.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="checkInReservation(${reservation.id})">
                    <i class="fas fa-sign-in-alt"></i>
                </button>
            </td>
        `;
        reservationsContainer.appendChild(row);
    });
}

function loadClientList() {
    const clientsContainer = document.getElementById('clients-list');
    if (!clientsContainer) return;
    
    adminData.clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.totalStays}</td>
            <td>${formatDate(client.lastStay)}</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="viewClient(${client.id})">
                    <i class="fas fa-user"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editClient(${client.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        clientsContainer.appendChild(row);
    });
}

function loadOrders() {
    const ordersContainer = document.getElementById('orders-list');
    if (!ordersContainer) return;
    
    adminData.orders.forEach(order => {
        const statusClass = getOrderStatusClass(order.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>Table ${order.table}</td>
            <td>${order.items.join(', ')}</td>
            <td>${order.total}€</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
            <td>${order.time}</td>
            <td>
                <button class="btn btn-sm btn-outline-success" onclick="markOrderServed(${order.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="cancelOrder(${order.id})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        ordersContainer.appendChild(row);
    });
}

function loadStock() {
    const stockContainer = document.getElementById('stock-list');
    if (!stockContainer) return;
    
    adminData.stock.forEach(item => {
        const quantity = item.quantity;
        const minQuantity = item.minQuantity;
        const isLowStock = quantity <= minQuantity;
        
        const row = document.createElement('tr');
        row.className = isLowStock ? 'table-warning' : '';
        row.innerHTML = `
            <td>${item.item}</td>
            <td>${item.category}</td>
            <td>${quantity} ${item.unit}</td>
            <td>${minQuantity} ${item.unit}</td>
            <td>${formatDate(item.expiry)}</td>
            <td>
                ${isLowStock ? 
                    '<span class="badge bg-danger">Stock faible</span>' : 
                    '<span class="badge bg-success">OK</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="orderStock(${item.id})">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editStock(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        stockContainer.appendChild(row);
    });
}

function loadStaffSchedule() {
    const scheduleContainer = document.getElementById('staff-schedule');
    if (!scheduleContainer) return;
    
    adminData.staff.forEach(staff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.name}</td>
            <td><span class="badge bg-info">${staff.role}</span></td>
            <td>${staff.schedule}</td>
            <td>${staff.email}</td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="editStaff(${staff.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStaff(${staff.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        scheduleContainer.appendChild(row);
    });
}

function loadExpenses() {
    const expensesContainer = document.getElementById('expenses-list');
    if (!expensesContainer) return;
    
    adminData.expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td><span class="badge bg-secondary">${expense.category}</span></td>
            <td>${expense.description}</td>
            <td>${expense.supplier}</td>
            <td>${expense.amount}€</td>
            <td>
                <button class="btn btn-sm btn-outline-info" onclick="viewExpense(${expense.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editExpense(${expense.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        expensesContainer.appendChild(row);
    });
}

function initCharts() {
    // Simuler l'initialisation des graphiques
    // Dans une implémentation réelle, utiliser Chart.js ou une autre bibliothèque
    
    const occupancyChart = document.getElementById('occupancy-chart');
    const revenueChart = document.getElementById('revenue-chart');
    
    if (occupancyChart) {
        occupancyChart.innerHTML = '<canvas id="occupancyChartCanvas"></canvas>';
        // Initialiser Chart.js ici
    }
    
    if (revenueChart) {
        revenueChart.innerHTML = '<canvas id="revenueChartCanvas"></canvas>';
        // Initialiser Chart.js ici
    }
}

// Fonctions utilitaires
function getStatusClass(status) {
    const classes = {
        'confirmed': 'bg-warning',
        'in-house': 'bg-success',
        'checked-out': 'bg-secondary',
        'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function getStatusText(status) {
    const texts = {
        'confirmed': 'Confirmée',
        'in-house': 'En séjour',
        'checked-out': 'Départ',
        'cancelled': 'Annulée'
    };
    return texts[status] || status;
}

function getOrderStatusClass(status) {
    const classes = {
        'pending': 'bg-warning',
        'preparing': 'bg-info',
        'ready': 'bg-primary',
        'served': 'bg-success',
        'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Fonctions d'action
function viewReservation(id) {
    const reservation = adminData.reservations.find(r => r.id === id);
    if (reservation) {
        alert(`Réservation #${id}\nClient: ${reservation.guestName}\nChambre: ${reservation.roomType}\nDates: ${formatDate(reservation.checkin)} au ${formatDate(reservation.checkout)}\nTotal: ${reservation.total}€`);
    }
}

function checkInReservation(id) {
    if (confirm('Confirmer le check-in de cette réservation?')) {
        alert(`Check-in effectué pour la réservation #${id}`);
        // Envoyer une requête au serveur
    }
}

function viewClient(id) {
    const client = adminData.clients.find(c => c.id === id);
    if (client) {
        alert(`Client #${id}\nNom: ${client.name}\nEmail: ${client.email}\nTéléphone: ${client.phone}\nSéjours: ${client.totalStays}\nPréférences: ${client.preferences.join(', ')}`);
    }
}

function markOrderServed(id) {
    if (confirm('Marquer cette commande comme servie?')) {
        alert(`Commande #${id} marquée comme servie`);
        // Mettre à jour l'état dans les données et rafraîchir l'affichage
    }
}

function orderStock(id) {
    const item = adminData.stock.find(s => s.id === id);
    if (item) {
        const quantity = prompt(`Commander ${item.item}. Quantité actuelle: ${item.quantity}${item.unit}. Quantité à commander:`, '10');
        if (quantity) {
            alert(`Commande de ${quantity}${item.unit} de ${item.item} effectuée`);
            // Envoyer la commande au serveur
        }
    }
}

function setupEventListeners() {
    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Déconnexion?')) {
                localStorage.removeItem('userRole');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Formulaire d'ajout de réservation
    const addReservationForm = document.getElementById('add-reservation-form');
    if (addReservationForm) {
        addReservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Traiter l'ajout de réservation
            alert('Nouvelle réservation ajoutée');
            this.reset();
        });
    }
    
    // Formulaire de prise de commande
    const takeOrderForm = document.getElementById('take-order-form');
    if (takeOrderForm) {
        takeOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Traiter la prise de commande
            alert('Nouvelle commande prise');
            this.reset();
        });
    }
    
    // Formulaire d'ajout de dépense
    const addExpenseForm = document.getElementById('add-expense-form');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Traiter l'ajout de dépense
            alert('Nouvelle dépense enregistrée');
            this.reset();
        });
    }
}

// Fonction pour générer une facture
function generateInvoice(bookingId) {
    const booking = adminData.reservations.find(r => r.id === bookingId);
    if (!booking) return;
    
    const invoiceContent = `
        FACTURE LAWMAR HOTEL
        ====================
        
        Numéro: INV-${bookingId}
        Date: ${new Date().toLocaleDateString('fr-FR')}
        
        Client: ${booking.guestName}
        Chambre: ${booking.roomType}
        Période: ${formatDate(booking.checkin)} - ${formatDate(booking.checkout)}
        
        Montant: ${booking.total}€
        Méthode de paiement: ${booking.payment}
        
        TVA: ${(booking.total * 0.2).toFixed(2)}€
        Total TTC: ${booking.total}€
        
        Merci de votre confiance!
    `;
    
    // Dans une implémentation réelle, générer un PDF
    alert('Facture générée:\n\n' + invoiceContent);
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Facture #INV-${bookingId}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .invoice { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .details { margin: 30px 0; }
                    .total { font-size: 1.2em; font-weight: bold; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <h1>LAWMAR HOTEL</h1>
                        <p>123 Avenue des Champs-Élysées, 75008 Paris</p>
                        <p>Facture #INV-${bookingId}</p>
                    </div>
                    <div class="details">
                        <p><strong>Client:</strong> ${booking.guestName}</p>
                        <p><strong>Période:</strong> ${formatDate(booking.checkin)} - ${formatDate(booking.checkout)}</p>
                        <p><strong>Chambre:</strong> ${booking.roomType}</p>
                    </div>
                    <div class="total">
                        <p>Total: ${booking.total}€</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
        </html>
    `);
}

// Fonction pour exporter les données
function exportData(type) {
    let data, filename;
    
    switch(type) {
        case 'reservations':
            data = JSON.stringify(adminData.reservations, null, 2);
            filename = 'reservations.json';
            break;
        case 'clients':
            data = JSON.stringify(adminData.clients, null, 2);
            filename = 'clients.json';
            break;
        case 'revenue':
            data = JSON.stringify(adminData.dashboard, null, 2);
            filename = 'revenue.json';
            break;
        default:
            return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Rafraîchir les données périodiquement
setInterval(() => {
    // Simuler une mise à jour des données
    adminData.dashboard.occupiedTables = `${Math.floor(Math.random() * 20)}/20`;
    adminData.dashboard.dailyRevenue = 4850 + Math.floor(Math.random() * 500);
    updateDashboardStats();
}, 30000); // Toutes les 30 secondes
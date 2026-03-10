// script.js - Version Saint-Louis, Sénégal

// Données de l'hôtel spécifiques à Saint-Louis
const hotelData = {
    "location": {
        "ville": "Saint-Louis",
        "pays": "Sénégal",
        "devise": "XOF",
        "deviseSymbole": "F CFA",
        "indicatif": "+221",
        "patrimoine": "UNESCO"
    },
    "chambres": [
        {
            "id": 1,
            "type": "standard",
            "nom": "Chambre Standard",
            "description": "Chambre confortable avec lit double, décorée avec des tissus wax locaux et vue sur la cour intérieure.",
            "prix": 65000,
            "equipements": ["Wi-Fi gratuit", "TV écran plat", "Mini-bar", "Climatisation", "Coffre-fort", "Salle de bain privée"],
            "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            "id": 2,
            "type": "deluxe",
            "nom": "Chambre Deluxe Vue Fleuve",
            "description": "Chambre spacieuse avec lit king-size, balcon privé offrant une vue magnifique sur le fleuve Sénégal.",
            "prix": 95000,
            "equipements": ["Wi-Fi gratuit", "TV Smart 55\"", "Mini-bar premium", "Climatisation", "Coffre-fort", "Machine à café", "Balcon privé"],
            "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            "id": 3,
            "type": "suite",
            "nom": "Suite Fleuve",
            "description": "Suite luxueuse avec séjour séparé, décoration africaine contemporaine et vue panoramique sur le fleuve.",
            "prix": 150000,
            "equipements": ["Wi-Fi fibre", "2 TV 65\"", "Mini-bar complet", "Climatisation", "Jacuzzi", "Service majordome", "Accès lounge"],
            "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            "id": 4,
            "type": "presidentielle",
            "nom": "Suite Présidentielle",
            "description": "Suite d'exception sur deux niveaux avec terrasse privée, salon, salle à manger et vue à 360° sur Saint-Louis.",
            "prix": 250000,
            "equipements": ["Wi-Fi fibre", "3 TV 75\"", "Mini-bar luxe", "Climatisation", "3 salles de bain", "Terrasse avec jacuzzi", "Service majordome 24h"],
            "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ],
    "services": [
        {
            "id": 1,
            "nom": "Visite Île Historique",
            "description": "Découverte du patrimoine UNESCO avec guide certifié.",
            "prix": 25000,
            "duree": "3h"
        },
        {
            "id": 2,
            "nom": "Parc National Langue de Barbarie",
            "description": "Excursion en pirogue et observation des oiseaux.",
            "prix": 45000,
            "duree": "6h"
        },
        {
            "id": 3,
            "nom": "Transfert Aéroport",
            "description": "Transfert en véhicule climatisé.",
            "prix": 25000,
            "duree": "20min"
        }
    ],
    "menu": {
        "specialites": [
            {"nom": "Thieboudienne", "description": "Riz au poisson, légumes et condiments", "prix": 12500},
            {"nom": "Yassa Poulet", "description": "Poulet mariné au citron et oignons", "prix": 11000},
            {"nom": "Mafé", "description": "Ragoût à la sauce arachide", "prix": 10500}
        ]
    },
    "avis": [
        {
            "nom": "Marie Ndiaye",
            "note": 5,
            "commentaire": "Séjour magique ! L'authentique teranga sénégalaise combinée au confort d'un hôtel 5 étoiles.",
            "date": "15/06/2023",
            "origine": "Dakar"
        }
    ]
};

// Gestion du multilinguisme
let currentLanguage = 'fr';
const translations = {
    fr: {
        "welcome": "Bienvenue au Lawmar Saint-Louis",
        "bookNow": "Réserver maintenant",
        "rooms": "Chambres",
        "dining": "Restauration",
        "services": "Services",
        "gallery": "Galerie",
        "contact": "Contact",
        "currency": "XOF (Franc CFA)"
    },
    en: {
        "welcome": "Welcome to Lawmar Saint-Louis",
        "bookNow": "Book Now",
        "rooms": "Rooms",
        "dining": "Dining",
        "services": "Services",
        "gallery": "Gallery",
        "contact": "Contact",
        "currency": "XOF (CFA Franc)"
    },
    wo: {
        "welcome": "Ñoo ko Lawmar Saint-Louis",
        "bookNow": "Téegal",
        "rooms": "Néegu",
        "dining": "Leek",
        "services": "Xareem",
        "gallery": "Natte",
        "contact": "Tëriin",
        "currency": "XOF (Franc CFA)"
    }
};

function changeLanguage(lang) {
    currentLanguage = lang;
    // Mettre à jour tous les éléments avec des attributs data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Mettre à jour le texte du dropdown de langue
    const langDropdown = document.getElementById('languageDropdown');
    if (langDropdown) {
        const langNames = {
            'fr': 'FR 🇫🇷',
            'en': 'EN 🇬🇧', 
            'wo': 'WO 🇸🇳'
        };
        langDropdown.innerHTML = `<i class="fas fa-globe"></i> ${langNames[lang] || lang.toUpperCase()}`;
    }
    
    // Sauvegarder la préférence de langue
    localStorage.setItem('preferredLanguage', lang);
}

// Système de réservation avec XOF
document.addEventListener('DOMContentLoaded', function() {
    // Charger la langue préférée
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    changeLanguage(savedLanguage);
    
    // Initialiser les dates du formulaire de réservation
    initBookingDates();
    
    // Gestion du formulaire de réservation
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processBooking();
        });
    }
    
    // Vérification de disponibilité
    const checkAvailabilityBtn = document.getElementById('check-availability');
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', checkAvailability);
    }
    
    // Connexion admin
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const role = document.getElementById('admin-role').value;
            
            // Simulation de connexion
            if (email && password) {
                localStorage.setItem('userRole', role);
                localStorage.setItem('userEmail', email);
                window.location.href = 'admin.html';
            } else {
                alert('Veuillez remplir tous les champs');
            }
        });
    }
});

function initBookingDates() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    
    if (checkin && checkout) {
        checkin.min = today;
        checkin.value = today;
        checkout.min = tomorrowStr;
        checkout.value = tomorrowStr;
    }
}

function formatXOF(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function checkAvailability() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('room-type').value;
    const transfer = document.getElementById('transfer')?.checked;
    const excursion = document.getElementById('excursion')?.checked;
    
    if (!checkin || !checkout) {
        alert('Veuillez sélectionner les dates de séjour');
        return;
    }
    
    // Calculer le nombre de nuits
    const startDate = new Date(checkin);
    const endDate = new Date(checkout);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
        alert('La date de départ doit être après la date d\'arrivée');
        return;
    }
    
    // Trouver le prix de la chambre
    const room = hotelData.chambres.find(r => r.type === roomType);
    let totalPrice = room ? room.prix * nights : 0;
    
    // Ajouter les services additionnels
    if (transfer) totalPrice += 25000;
    if (excursion) {
        const adults = parseInt(document.getElementById('adults').value);
        totalPrice += 25000 * adults;
    }
    
    // Afficher le résultat
    const availabilityResult = document.getElementById('availability-result');
    const totalPriceElement = document.getElementById('total-price');
    
    if (totalPriceElement) {
        totalPriceElement.textContent = formatXOF(totalPrice);
    }
    
    if (availabilityResult) {
        availabilityResult.classList.remove('d-none');
    }
    
    // Faire défiler jusqu'au formulaire
    availabilityResult.scrollIntoView({ behavior: 'smooth' });
}

function processBooking() {
    const guestName = document.getElementById('guest-name').value;
    const guestEmail = document.getElementById('guest-email').value;
    const guestPhone = document.getElementById('guest-phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    // Validation
    if (!guestName || !guestEmail || !guestPhone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Générer un numéro de confirmation
    const confirmationNumber = 'LWMR-' + Math.floor(100000 + Math.random() * 900000);
    
    // Afficher confirmation
    alert(`Réservation confirmée!\n\nNuméro: ${confirmationNumber}\nClient: ${guestName}\nEmail: ${guestEmail}\n\nUn email de confirmation a été envoyé.`);
    
    // Réinitialiser
    document.getElementById('booking-form').reset();
    document.getElementById('availability-result').classList.add('d-none');
    initBookingDates();
    
    // Fermer le modal
    const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    if (bookingModal) {
        bookingModal.hide();
    }
}

// Fonction pour générer une facture en XOF
function generateInvoice(bookingData) {
    const invoiceContent = `
        FACTURE HOTEL LAWMAR SAINT-LOUIS
        ================================
        
        Rue Blaise Diagne, Île de Saint-Louis
        Sénégal 🇸🇳
        Tél: +221 33 938 10 00
        
        Client: ${bookingData.guestName}
        Email: ${bookingData.guestEmail}
        Tél: ${bookingData.guestPhone}
        
        Chambre: ${bookingData.roomType}
        Période: ${bookingData.checkin} - ${bookingData.checkout}
        Nuits: ${bookingData.nights}
        
        Montant: ${formatXOF(bookingData.totalPrice)} XOF
        Paiement: ${bookingData.paymentMethod}
        
        Numéro: ${bookingData.confirmationNumber}
        Date: ${new Date().toLocaleDateString('fr-FR')}
        
        Jërëjëf! Merci de votre confiance!
    `;
    
    return invoiceContent;
}

// Fonction pour convertir en devise locale
function convertToXOF(amountEUR) {
    // Taux approximatif: 1 EUR = 655 XOF
    return Math.round(amountEUR * 655);
}
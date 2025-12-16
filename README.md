# Apparte Aide - Système de Location d'Appartements Meublés

Site web complet pour la gestion de location d'appartements meublés à Bukavu, RD Congo.

## 🏢 À propos

Apparte Aide gère environ 35 appartements meublés répartis dans 5 quartiers de Bukavu :
- Muhumba
- Nguba
- Avenue Gouverneur
- Hippodrome
- Labotte

## 🛠 Technologies utilisées

- **Front-end** : HTML, CSS, JavaScript (Vanilla), Bootstrap 5
- **Back-end** : Supabase Edge Functions (TypeScript/Deno)
- **Base de données** : MySQL (Supabase)
- **QR Code** : Bibliothèque qrcode (npm)

## 📋 Fonctionnalités

### Interface Utilisateur (Public)
- **Page d'accueil** : Présentation de l'entreprise et services
- **Liste des appartements** : Affichage en cartes avec filtres (quartier, statut)
- **Carrousel d'images** : Plusieurs photos par appartement avec Bootstrap carousel
- **Formulaire de réservation** :
  - Informations personnelles (nom, téléphone)
  - Sélection d'appartement par quartier et type
  - Dates d'arrivée et de départ
  - Nombre d'adultes et enfants
  - Motif du séjour
  - Montant et acompte
- **Génération automatique** :
  - Ticket ID unique (format: AA-TIMESTAMP-CODE)
  - QR Code pour chaque réservation
- **Mes réservations** : Recherche par téléphone ou ticket
- **Vérification QR Code** : Page publique pour vérifier une réservation

### Interface Administrateur (/admin/)
- **Connexion sécurisée** : Login admin avec session
- **Tableau de bord** avec gestion complète :
  - **Appartements** : CRUD complet (Create, Read, Update, Delete)
    - Upload multiple d'images par URL
    - Gestion des caractéristiques (chambres, équipements, statut)
  - **Réservations** : Liste, modification, changement de statut
  - **Tickets** : Affichage des demandes support
  - **Paiements** : Historique des transactions
  - **Vérification QR** : Scan et validation des réservations

## 🗄 Structure de la Base de Données

### Tables principales
- `users` : Clients et administrateurs
- `appartements` : Liste des appartements
- `appartement_images` : Images multiples par appartement
- `reservations` : Réservations avec QR codes
- `tickets` : Support client
- `paiements` : Historique des paiements

### Sécurité
- Row Level Security (RLS) activé sur toutes les tables
- Politiques restrictives selon le type d'utilisateur
- Lecture publique uniquement pour les appartements

## 🚀 Démarrage

### Prérequis
- Compte Supabase configuré
- Variables d'environnement dans `.env` :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Production
```bash
npm run build
```

## 🔐 Accès Admin

**URL** : `/admin/`

**Identifiants par défaut** :
- Téléphone : `+243000000000`
- Mot de passe : `Admin123!`

⚠️ **Important** : Changez ces identifiants en production !

## 📱 Utilisation

### Pour les clients
1. Consultez les appartements disponibles
2. Réservez via le formulaire
3. Recevez votre QR code et numéro de ticket
4. Conservez-les pour accéder à vos réservations

### Pour les administrateurs
1. Connectez-vous via `/admin/`
2. Gérez les appartements (ajout, modification, images)
3. Suivez les réservations et leur statut
4. Vérifiez les QR codes des clients
5. Gérez les paiements et tickets support

## 🎨 Interface utilisateur

Le design utilise Bootstrap 5 avec :
- Navigation responsive
- Cartes pour afficher les appartements
- Carrousels Bootstrap pour les galeries photos
- Formulaires validés
- Badges de statut colorés
- Interface admin intuitive avec sidebar

## 🔄 API Endpoints

L'API unique (`/functions/v1/api`) gère toutes les opérations :
- `?entity=appartements` : CRUD appartements
- `?entity=images` : Gestion des images
- `?entity=reservations` : CRUD réservations
- `?entity=verify_qr` : Vérification QR codes
- `?entity=tickets` : Support client
- `?entity=paiements` : Gestion paiements
- `?entity=admin_login` : Authentification admin

## 📦 Structure du projet

```
/
├── index.html              # Page d'accueil
├── appartements.html       # Liste des appartements
├── appartements.js         # Logique affichage appartements
├── reservation.html        # Formulaire de réservation
├── reservation.js          # Logique réservation + QR
├── mes-reservations.html   # Recherche réservations client
├── mes-reservations.js     # Logique recherche
├── verify-qr.html         # Vérification QR public
├── verify-qr.js           # Logique vérification
├── config.js              # Configuration API
├── api-client.js          # Client API centralisé
├── admin/
│   ├── index.html         # Login admin
│   ├── login.js          # Logique login
│   ├── dashboard.html     # Tableau de bord
│   └── dashboard.js       # Logique admin complète
└── supabase/
    └── functions/
        └── api/
            └── index.ts   # Edge Function principale
```

## ✨ Caractéristiques principales

- ✅ QR Code automatique à chaque réservation
- ✅ Upload multiple d'images par appartement
- ✅ Système de tickets unique (AA-TIMESTAMP-CODE)
- ✅ Interface admin séparée et sécurisée
- ✅ Recherche de réservations par téléphone ou ticket
- ✅ Vérification instantanée des QR codes
- ✅ Gestion complète des paiements et acomptes
- ✅ Design responsive et moderne
- ✅ Base de données sécurisée avec RLS

## 📝 Notes importantes

1. **Images** : Les images sont stockées via URLs. Pour une solution complète, intégrez Supabase Storage
2. **Paiements** : Le système enregistre les montants mais n'intègre pas de passerelle de paiement
3. **Sécurité** : En production, implémentez bcrypt pour les mots de passe admin
4. **QR Codes** : Générés en base64 data URL et stockés directement en base de données

## 🤝 Support

Pour toute question, contactez l'administrateur système.

---

**Apparte Aide** - Location d'appartements meublés à Bukavu

# Villa First - Plateforme de Colocation a Bali

Application MVP de mise en relation entre proprietaires de villas et colocataires a Bali, avec systeme de matching de vibes.

## Fonctionnalites

### Pour les Colocataires
- Recherche de villas avec filtres avances (zone, prix, vibes)
- Profil personnalise avec centres d'interet et personnalite
- Systeme de matching intelligent avec scores de compatibilite
- Visualisation des colocs actuels d'une villa
- Reservation avec paiement simule (3 etapes)
- Messagerie integree avec auto-reponse demo
- Dashboard avec suivi des reservations et matchs

### Pour les Proprietaires
- Publication de villas en 5 etapes (infos, prix, equipements, photos, recap)
- Gestion des annonces avec stats
- Statistiques (vues, favoris, taux d'occupation)
- Reception et gestion des demandes
- Messagerie avec les locataires
- Notification de succes apres publication

## Technologies

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + Shadcn/ui
- **Base de donnees** : SQLite + Prisma ORM v5
- **Authentification** : Context API (session localStorage)
- **Icons** : Lucide React

## Installation

```bash
# Installer les dependances
npm install

# Generer le client Prisma
npx prisma generate

# Remplir la base de donnees avec des donnees de test
npm run seed

# Lancer le serveur de developpement
npm run dev
```

Ouvrez http://localhost:3000

## Mode Demonstration

L'application est en mode demonstration avec :
- Donnees fictives pre-remplies (10 utilisateurs, 8 villas, 32 messages)
- Paiements simules (aucun vrai paiement)
- Reponses automatiques dans le chat
- Switch de profil utilisateur via la barre demo en haut de page

### Comptes de test

**Colocataires :**
- alex.thompson@gmail.com - Digital Nomad entrepreneur (USA)
- sophie.martin@gmail.com - Yoga instructor (France)
- jake.wilson@gmail.com - Content creator (Australie)
- maria.garcia@gmail.com - Software engineer (Espagne)
- tom.anderson@gmail.com - Fitness coach (UK)

**Proprietaires :**
- wayan.putra@gmail.com - Proprietaire indonesien (2 villas)
- david.chen@gmail.com - Expat canadien (2 villas)
- emma.rodriguez@gmail.com - Expat mexicaine (1 villa)
- john.smith@gmail.com - Expat americain (2 villas)
- lisa.wong@gmail.com - Expat singapourienne (1 villa)

## Design

Design premium noir/or avec :
- Fond noir profond (#0A0A0A)
- Surfaces gris fonce (#1A1A1A)
- Accent or champagne (#D4AF37)
- Effets glassmorphism (glass-card, glass-card-hover)
- Animations smooth et glow effects (glow-button, gradient-border)

## Responsive

100% responsive :
- Mobile : < 640px (bottom navigation)
- Tablet : 640-1024px
- Desktop : > 1024px (sidebar navigation)

## Structure du Projet

```
villa-coloc/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/login/         # Authentification
│   │   │   ├── bookings/           # Reservations
│   │   │   ├── messages/           # Messagerie
│   │   │   ├── users/[id]/         # Donnees utilisateur
│   │   │   └── villas/             # Villas (CRUD + recherche)
│   │   ├── dashboard/              # Dashboard colocataire
│   │   ├── dashboard-owner/        # Dashboard proprietaire
│   │   │   └── publish/            # Publication villa (5 etapes)
│   │   ├── login/                  # Page de connexion
│   │   ├── messages/               # Messagerie
│   │   ├── villas/                 # Pages villas
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Detail villa
│   │   │       └── booking/        # Reservation (3 etapes)
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing page
│   ├── components/                 # Composants reutilisables
│   │   ├── ui/                     # Shadcn/ui components
│   │   ├── DashboardLayout.tsx     # Layout avec sidebar/mobilenav
│   │   ├── DemoModeBanner.tsx      # Barre demo switch utilisateur
│   │   ├── MobileNav.tsx           # Navigation mobile
│   │   ├── Sidebar.tsx             # Sidebar desktop
│   │   └── UserProfileModal.tsx    # Modal profil utilisateur
│   └── lib/
│       ├── AuthContext.tsx          # Gestion auth
│       ├── mockPayment.ts          # Paiement simule
│       └── prisma.ts               # Client Prisma
├── prisma/
│   ├── schema.prisma               # Schema DB (6 modeles)
│   └── seed.ts                     # Donnees de test
└── public/                         # Assets statiques
```

## API Routes

| Route | Methode | Description |
|-------|---------|-------------|
| `/api/auth/login` | POST | Connexion par email |
| `/api/villas` | GET | Liste des villas avec filtres |
| `/api/villas/[id]` | GET | Detail d'une villa |
| `/api/villas/suggested` | GET | Villas suggerees |
| `/api/villas/create` | POST | Creer une villa |
| `/api/bookings` | GET/POST | Reservations |
| `/api/messages` | GET/POST | Messages |
| `/api/messages/[id]/read` | PATCH | Marquer comme lu |
| `/api/users/[id]` | GET | Profil utilisateur |
| `/api/users/[id]/villas` | GET | Villas d'un proprio |
| `/api/users/[id]/matches` | GET | Matchs d'un user |
| `/api/users/[id]/bookings` | GET | Reservations d'un user |
| `/api/zones` | GET | Liste des zones |

## Base de Donnees

6 modeles Prisma :
- **User** : Colocataires et proprietaires
- **VibeProfile** : Profil de personnalite et preferences
- **Villa** : Annonces de villas
- **Booking** : Reservations
- **Message** : Messagerie
- **Match** : Compatibilite entre colocataires

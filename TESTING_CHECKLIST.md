# Villa Coloc Bali - Testing Checklist

## Comptes de test

| Email | Type | Nom |
|---|---|---|
| alex.thompson@gmail.com | COLOCATAIRE | Alex Thompson |
| sophie.martin@gmail.com | COLOCATAIRE | Sophie Martin |
| jake.wilson@gmail.com | COLOCATAIRE | Jake Wilson |
| maria.garcia@gmail.com | COLOCATAIRE | Maria Garcia |
| tom.anderson@gmail.com | COLOCATAIRE | Tom Anderson |
| wayan.putra@gmail.com | PROPRIETAIRE | Wayan Putra |
| david.chen@gmail.com | PROPRIETAIRE | David Chen |
| emma.rodriguez@gmail.com | PROPRIETAIRE | Emma Rodriguez |
| john.smith@gmail.com | PROPRIETAIRE | John Smith |
| lisa.wong@gmail.com | PROPRIETAIRE | Lisa Wong |

---

## 1. PARCOURS COLOCATAIRE

### 1.1 Login + Dashboard
- [x] Aller sur /login
- [x] Cliquer sur un email colocataire (ex: alex.thompson@gmail.com)
- [x] Redirect vers /dashboard
- [x] Stats affichees (bookings, matches, messages)
- [x] Villas suggerees visibles
- [x] DemoModeBanner visible en haut

### 1.2 Sidebar Navigation
- [x] Lien "Dashboard" -> /dashboard (200)
- [x] Lien "Explorer" -> /villas (200)
- [x] Lien "Mes Matchs" -> /dashboard/matches (200)
- [x] Lien "Messages" -> /messages (200)
- [x] Lien "Reservations" -> /dashboard/bookings (200)
- [x] Lien "Mon Profil" -> /dashboard/profile (200)

### 1.3 Rechercher une Villa
- [x] GET /api/villas retourne les villas (200)
- [x] Filtre par zone fonctionne (ex: ?zone=Canggu -> 3 resultats)
- [x] Filtre par prix fonctionne
- [x] Cliquer sur une villa -> /villas/[id] affiche les details
- [x] Colocs actuels visibles sur la page detail
- [x] Infos proprietaire affichees

### 1.4 Reserver une Villa
- [x] Bouton "Reserver" sur la page detail
- [x] Formulaire de reservation fonctionnel
- [x] Paiement simule
- [x] POST /api/bookings cree le booking (status: CONFIRMED)
- [x] availableRooms decremente

### 1.5 Mes Reservations (/dashboard/bookings)
- [x] Tab "En cours" : bookings CONFIRMED avec endDate > now
- [x] Tab "Passees" : bookings CONFIRMED avec endDate <= now
- [x] Tab "Annulees" : bookings CANCELLED
- [x] Cards horizontales desktop / verticales mobile
- [x] Photo villa + titre + zone + proprietaire
- [x] Dates, duree, prix total, chambre
- [x] Numero de transaction affiche
- [x] Bouton "Voir la villa" -> /villas/[id]
- [x] Bouton "Contacter le proprio" -> /messages
- [x] Bouton "Annuler" avec confirmation 2 etapes
- [x] PATCH /api/bookings/[id]/cancel fonctionne
- [x] Empty states pour chaque tab

### 1.6 Mes Matchs (/dashboard/matches)
- [x] Matchs groupes par villa
- [x] Titre villa + zone en header de groupe
- [x] Cards avec avatar, nom, age, nationalite
- [x] Score de compatibilite en cercle SVG colore
- [x] Filtre dropdown : Tous / Score > 80% / Score > 60%
- [x] Bouton "Voir le profil" ouvre UserProfileModal
- [x] Bouton "Message" redirect /messages
- [x] Empty state si aucun match

### 1.7 Mon Profil (/dashboard/profile)
- [x] Section 1 : Infos personnelles (nom, age, nationalite, langues)
- [x] Langues en toggle chips multi-select (12 langues)
- [x] Avatar avec initiales
- [x] Bouton "Sauvegarder" avec feedback (spinner -> check)
- [x] PATCH /api/users/[id] met a jour le user
- [x] Section 2 : Profil Vibes
- [x] Budget slider 200-800 EUR
- [x] Duree souhaitee (6 options)
- [x] Zones preferees (6 zones checkboxes)
- [x] Centres d'interet (20 options)
- [x] Lifestyle (14 options)
- [x] 5 sliders personnalite (1-10)
- [x] Bio textarea avec compteur
- [x] PATCH /api/users/[id]/vibe-profile fonctionne
- [x] Section 3 : Preview profil
- [x] Mini-card avec avatar, tags, barres personnalite, bio
- [x] Bouton "Voir le profil complet" ouvre UserProfileModal
- [x] loginById rafraichit le contexte apres sauvegarde

### 1.8 Messages (/messages)
- [x] Liste de conversations
- [x] Envoi de message
- [x] Statut lu/non-lu
- [x] GET /api/messages?userId=X retourne les messages (15 pour Alex)

---

## 2. PARCOURS PROPRIETAIRE

### 2.1 Login + Dashboard Owner
- [x] Cliquer sur un email proprietaire (ex: wayan.putra@gmail.com)
- [x] Redirect vers /dashboard-owner
- [x] Stats affichees (villas, bookings, revenus)

### 2.2 Sidebar Navigation
- [x] Lien "Dashboard" -> /dashboard-owner (200)
- [x] Lien "Mes Villas" -> /dashboard-owner/villas (200)
- [x] Lien "Publier" -> /dashboard-owner/publish (200)
- [x] Lien "Demandes" -> /dashboard-owner/requests (200)
- [x] Lien "Messages" -> /messages (200)
- [x] Lien "Statistiques" -> /dashboard-owner/stats (200)
- [x] Lien "Avis" -> /dashboard-owner/reviews (200)
- [x] Lien "Parametres" -> /dashboard-owner/settings (200)

### 2.3 Mes Villas (/dashboard-owner/villas)
- [x] Bandeau stats : total, actives, occupees, reservations
- [x] Grille 3 cols desktop / 2 tablette / 1 mobile
- [x] Cards avec photo, badge statut (Active/Pause), prix
- [x] Titre + zone + vibes tags
- [x] Stats en ligne : vues, favoris, reservations
- [x] Barre de disponibilite chambres (couleur selon taux)
- [x] Bouton "Voir" -> /villas/[id]
- [x] Bouton "Modifier" -> alert V2
- [x] Bouton "Pause/Activer" -> PATCH /api/villas/[id] verified toggle
- [x] Bouton "Supprimer" -> confirmation + DELETE /api/villas/[id]
- [x] Bouton header "Publier une villa" -> /dashboard-owner/publish
- [x] Empty state si aucune villa

### 2.4 Publier une Villa (/dashboard-owner/publish)
- [x] Wizard multi-etapes
- [x] Step 1 : Infos de base (titre, zone, location)
- [x] Step 2 : Pricing (EUR/USD/IDR, deposit)
- [x] Step 3 : Photos
- [x] Step 4 : Description et amenities
- [x] POST /api/villas/create

### 2.5 Demandes (/dashboard-owner/requests)
- [x] Tab "En attente" : bookings PENDING (3 dans le seed)
- [x] Tab "Acceptees" : bookings CONFIRMED
- [x] Tab "Refusees" : bookings CANCELLED
- [x] Cards horizontales avec zone user (avatar, nom, age, nationalite)
- [x] Lien "Voir le profil complet" ouvre UserProfileModal
- [x] Villa concernee + zone
- [x] Dates, duree, prix, chambre
- [x] Date d'envoi de la demande
- [x] Bouton "Accepter" (vert) -> PATCH status=CONFIRMED
- [x] Bouton "Refuser" (rouge) -> PATCH status=CANCELLED
- [x] Bouton "Discuter" -> /messages
- [x] GET /api/bookings/owner?ownerId=X retourne les bookings
- [x] Wayan a 4 bookings (2 CONFIRMED + 2 PENDING)
- [x] Empty states pour chaque tab

---

## 3. VERIFICATION TECHNIQUE

### 3.1 Compilation
- [x] `npx tsc --noEmit` : 0 erreurs TypeScript
- [x] Toutes les 17 pages compilent (HTTP 200)
- [x] Toutes les APIs compilent sans erreur
- [x] Zero warnings dans les logs serveur

### 3.2 APIs testees
- [x] POST /api/auth/login (email -> user + vibeProfile)
- [x] GET /api/zones (6 zones avec compteurs)
- [x] GET /api/villas (filtres zone, prix, vibe)
- [x] GET /api/villas/[id] (detail + roommates)
- [x] GET /api/villas/suggested?zones=X&limit=Y
- [x] POST /api/villas/create
- [x] PATCH /api/villas/[id] (update verified, title, description)
- [x] DELETE /api/villas/[id] (cascade matches + bookings)
- [x] GET /api/users/[id] (user + vibeProfile)
- [x] PATCH /api/users/[id] (update name, age, nationality, languages)
- [x] GET /api/users/[id]/villas (villas du proprio + bookings)
- [x] GET /api/users/[id]/matches (matchs + vibeProfile)
- [x] PATCH /api/users/[id]/vibe-profile (create/update)
- [x] GET /api/bookings?userId=X
- [x] POST /api/bookings (create + decrement rooms)
- [x] GET /api/bookings/owner?ownerId=X
- [x] PATCH /api/bookings/[id] (update status + rooms management)
- [x] PATCH /api/bookings/[id]/cancel (cancel + increment rooms)
- [x] GET /api/messages?userId=X
- [x] POST /api/messages
- [x] PATCH /api/messages/[id]/read

### 3.3 Imports et code propre
- [x] Aucun import inutilise
- [x] Aucune variable inutilisee
- [x] Aucune fonction inutilisee

### 3.4 Seed data
- [x] 10 users (5 colocataires + 5 proprietaires)
- [x] 5 vibe profiles
- [x] 8 villas (6 zones)
- [x] 8 bookings (5 CONFIRMED + 3 PENDING)
- [x] 32+ messages (6 conversations)
- [x] 8 matchs (scores 22-87)

---

## 4. PAGES RESTANTES (Coming Soon)

| Page | Status |
|---|---|
| /dashboard-owner/stats | Coming soon placeholder |
| /dashboard-owner/reviews | Coming soon placeholder |
| /dashboard-owner/settings | Coming soon placeholder |
| /dashboard-owner/messages | Coming soon placeholder |
| /dashboard/messages | Coming soon placeholder |

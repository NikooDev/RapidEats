# Rapid Eats
Application de gestion de livraison pour restaurant


## Demo

https://rapid-eats.vercel.app/


## Fonctionnalités

- Authentification (signup, login)
- Gestion de profil
- Historique de commandes
- Annulation de commandes
- Possibilité de choisir des produits dans plusieurs restaurants avant de passer une commande
- Tracker qui s'adapte selon le nombre de restaurants à livrer et le temps de route
- Formulaire de recherche (restaurants et menus)
- Affichage des restaurants sur une Map
- Tracking du livreur sur une Map avec l'API Graphhopper
- Gestion autonome des status des livreurs


## Tech Stack

**Client:** SvelteKit, Firebase

**Server:** Firebase-admin


## Architecture

- /lib
    - /actions : Contient les actions d'authentification
    - /assets : Fichiers CSS
    - /components : Tous les composants réutilisables
    - /config : Configuration de l'application
    - /firebase : Dossier de gestion de requêtes firebase
    - /helpers : Fonctions réutilisables
    - /icons : Icônes SVG de l'application
    - /interfaces : Types de données
    - /stores : Stores SvelteKit
    - /validator : Validation de formulaire
- /routes

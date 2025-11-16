# Projet JS EPSI B3

Application de paris virtuels avec une connexion via twitch et un système de points

## Installation

Cloner le projet 

```
git clone https://github.com/Mashyumaru/League-of-Bets.git
```

Installer les dépendances 
```
# Dépendances principales
npm install react react-dom react-router-dom pocketbase

# Dépendances de développement
npm install -D vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
```

Lancer le projet

```
npm run dev
```

## Fonctionnalités principales

- Authentification via twitch
- Système de points (pas d'argent)
- Paris sur des matchs
- Augmentation de la mise sans possibilité de changer d'équipe
- Historique des paris
- Statistiques des paris

## Pages 

- Acceuil
    - Avec liste des matchs (en cours, à venir, terminé)
- Mes paris
- Regles 

## Technologies

- React
- React Router
- Tailwind CSS
- Vite
- PocketBase

## Voies d'amelioration

Premièrement, il manque une interface administrateur pour gérer les matchs et mettre a jour correctement le solde des points des utilisateurs.

Deuxièmement, une feature principale de mon projet, le gain de point en regardant un stream twitch spécifique.

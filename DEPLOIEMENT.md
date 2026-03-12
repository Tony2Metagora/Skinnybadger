# 🚀 Guide de Déploiement GitHub Pages

## Étape 1 : Créer le repository sur GitHub

1. Aller sur [GitHub](https://github.com/tony2metagora)
2. Cliquer sur **New repository**
3. Nom du repository : `Skinnybadger`
4. Description : "Application de suivi fitness - Programme musculation 4 semaines"
5. Laisser en **Public**
6. **NE PAS** initialiser avec README, .gitignore ou license (déjà présents)
7. Cliquer sur **Create repository**

## Étape 2 : Initialiser Git et pousser le code

Ouvrir un terminal dans le dossier du projet et exécuter :

```bash
# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - SkinnyBadger fitness tracker"

# Renommer la branche en main
git branch -M main

# Ajouter le remote
git remote add origin https://github.com/tony2metagora/Skinnybadger.git

# Pousser le code
git push -u origin main
```

## Étape 3 : Activer GitHub Pages

1. Aller sur le repository : `https://github.com/tony2metagora/Skinnybadger`
2. Cliquer sur **Settings** (en haut à droite)
3. Dans le menu de gauche, cliquer sur **Pages**
4. Dans **Source**, sélectionner **GitHub Actions**
5. Le workflow se déclenchera automatiquement

## Étape 4 : Vérifier le déploiement

1. Aller dans l'onglet **Actions** du repository
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours
3. Attendre que le workflow soit vert (✓)
4. L'application sera disponible à : `https://tony2metagora.github.io/Skinnybadger/`

## 🔄 Mises à jour futures

Pour mettre à jour l'application :

```bash
# Faire vos modifications dans le code

# Ajouter les changements
git add .

# Commit
git commit -m "Description des changements"

# Pousser
git push
```

Le déploiement se fera automatiquement via GitHub Actions.

## 🛠️ Commandes utiles

```bash
# Vérifier le statut
git status

# Voir l'historique
git log --oneline

# Créer une nouvelle branche
git checkout -b nom-de-branche

# Revenir à main
git checkout main

# Tester le build localement
npm run build

# Tester en local
npm run dev
```

## 📱 Tester sur mobile

Une fois déployé, vous pouvez :
1. Ouvrir l'URL sur votre téléphone
2. Ajouter à l'écran d'accueil (iOS/Android)
3. Utiliser comme une application native

## ⚠️ Notes importantes

- Les données sont stockées dans le **localStorage** du navigateur
- Les données sont **locales à chaque appareil**
- Effacer les données du navigateur supprimera vos données
- Pas de synchronisation entre appareils (pas de backend)

## 🐛 Dépannage

### Le site ne se charge pas
- Vérifier que le workflow GitHub Actions est terminé (✓)
- Attendre 2-3 minutes après le déploiement
- Vider le cache du navigateur (Ctrl+Shift+R)

### Les images ne s'affichent pas
- Vérifier que les images sont dans le dossier `public/`
- Vérifier les noms de fichiers (sensible à la casse)

### Erreur 404
- Vérifier que le `basePath` dans `next.config.js` correspond au nom du repository
- Le nom doit être exactement `Skinnybadger` (sensible à la casse)

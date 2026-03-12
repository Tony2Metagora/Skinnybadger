# SkinnyBadger - Fitness Tracker 🏋️

Application web mobile-first pour suivre un programme de musculation de 4 semaines avec suivi des métriques de santé.

## 🎯 Fonctionnalités

### 💪 Onglet Entraînement
- Saisie de séances (2 par semaine sur 4 semaines)
- **Bloc A** : Pompes, Cossack squat, Dead bug (score principal)
- **Bloc B** : Exercices kettlebell 12kg
- Mode séance express (Bloc A uniquement)
- Historique complet des séances avec répétitions par série
- Indicateurs de progression par rapport aux objectifs (✅/🔼/🔽)
- Liens YouTube pour les techniques d'exercices

### 📊 Onglet Suivi
- **Poids** : suivi hebdomadaire avec graphique d'évolution
- **Pas** : suivi quotidien avec objectif de 25 000 pas/semaine et graphique
- **Alcool** : suivi quotidien des verres consommés avec graphique
- **Graphiques d'entraînement** : évolution du score total Bloc A et par exercice
- Badge de réussite 🏆 à la fin du programme (Semaine 4, Séance 2)

## 🚀 Installation

```bash
npm install
```

## 💻 Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## 📦 Build

```bash
npm run build
```

Le build génère un dossier `out/` avec les fichiers statiques.

## 🌐 Déploiement sur GitHub Pages

### Configuration initiale

1. Créer un repository sur GitHub nommé `Skinnybadger`
2. Initialiser git et pousser le code :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tony2metagora/Skinnybadger.git
git push -u origin main
```

3. Activer GitHub Pages :
   - Aller dans **Settings** > **Pages**
   - Source : **GitHub Actions**

4. Le workflow GitHub Actions se déclenchera automatiquement à chaque push sur `main`

### Déploiement manuel

```bash
npm run build
```

Puis pousser le dossier `out/` sur la branche `gh-pages` ou utiliser le workflow automatique.

### URL de l'application

Une fois déployée : `https://tony2metagora.github.io/Skinnybadger/`

## 📱 Responsive

L'application est optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)

## 🛠️ Technologies

- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **LocalStorage** - Persistance des données (pas de backend requis)

## 📝 Données stockées

Toutes les données sont stockées localement dans le navigateur :
- `skinnybadger_sessions` - Historique des séances d'entraînement
- `skinnybadger_weight` - Entrées de poids
- `skinnybadger_steps` - Entrées de pas quotidiens
- `skinnybadger_alcohol` - Entrées d'alcool quotidiennes

## 🎨 Design

- Thème clair avec fond gris clair
- Cartes blanches avec bordures
- Boutons orange pour les actions principales
- Interface intuitive et épurée

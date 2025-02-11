# RecycleHub

## 📌 Description
**RecycleHub** est une application de gestion de recyclage qui met en relation des particuliers et des collecteurs agréés pour automatiser le processus de collecte des déchets. L'application est développée en tant que **Single Page Application (SPA)** utilisant **Angular 17+**, avec **IndexedDB** pour la persistance des données.

## 🚀 Fonctionnalités
### 1️⃣ Inscription & Connexion
- Création de compte pour les particuliers avec :
  - Email et mot de passe
  - Nom et prénom
  - Adresse complète
  - Numéro de téléphone
  - Date de naissance
  - Photo de profil (optionnel)
- Les collecteurs sont pré-enregistrés manuellement en **localStorage**.
- Possibilité de modification/suppression du compte.
- **Pas d'administration** prévue dans l'application.

### 2️⃣ Demande de Collecte
- Création d'une demande avec :
  - Type de déchet (plastique, verre, papier, métal)
  - Photos des déchets (optionnel)
  - Poids estimé (minimum 1000g)
  - Adresse de collecte
  - Date et créneau horaire (09h00 - 18h00)
  - Notes supplémentaires (optionnel)
- Gestion des demandes :
  - Modification/Suppression des demandes **en attente**
  - Maximum **3 demandes simultanées** non validées ou rejetées
  - Poids total des collectes limité à **10 kg**

### 3️⃣ Processus de Collecte
- Le collecteur peut :
  - Accéder aux demandes disponibles dans sa ville
  - Accepter une demande et la mettre à jour à chaque étape :
    - **En attente**
    - **Occupée** (acceptation de la demande)
    - **En cours** (collecte en cours)
    - **Validée** (collecte terminée avec succès)
    - **Rejetée** (collecte non conforme)
  - Vérifier, peser, photographier et valider la collecte.

### 4️⃣ Système de Points
- Attribution automatique des points après validation de la collecte :
  - **Plastique** → 2 points/kg
  - **Verre** → 1 point/kg
  - **Papier** → 1 point/kg
  - **Métal** → 5 points/kg
- Conversion des points en bons d'achat :
  - **100 points** = 50 Dh
  - **200 points** = 120 Dh
  - **500 points** = 350 Dh

## 🛠️ Technologies Utilisées
- **Angular 17+** (architecture **standalone**)
- **NgRx** (gestion d'état)
- **RxJS** (programmation réactive)
- **IndexedDB** (base de données locale)
- **Reactive Forms / Template Driven Forms**
- **Guards, Resolvers**
- **Bootstrap / Tailwind** (design responsive)
- **Routing, Services, Pipes, Databinding**
- **Validation métier et gestion des erreurs**

## 📂 Structure du Projet
```
RecycleHub/
│-- src/
│   ├── core/  # Services, Guards, Resolvers
│   ├── features/
│   │   ├── auth/  # Login, Register, Profile
│   │   ├── collection/  # Request Form, Request List, Request Detail
│   │   ├── points/  # Points History, Points Conversion
│   ├── app.component.ts
│   ├── app-routing.module.ts
│   ├── index.html
│-- angular.json
│-- package.json
│-- README.md
```

## 🔧 Installation & Lancement
1. **Cloner le projet** :
   ```sh
   git clone https://github.com/votre-repo/RecycleHub.git
   cd RecycleHub
   ```
2. **Installer les dépendances** :
   ```sh
   npm install
   ```
3. **Démarrer l'application** :
   ```sh
   ng serve
   ```
   L'application sera accessible à `http://localhost:4200/`

## 🛠️ Contribuer
Les contributions sont les bienvenues ! Pour proposer une amélioration :
1. **Fork** le repo
2. **Créer une branche** (`feature/ma-nouvelle-fonctionnalité`)
3. **Commit** (`git commit -m "Ajout de ..."`)
4. **Push** (`git push origin feature/ma-nouvelle-fonctionnalité`)
5. **Créer une Pull Request** 🚀

## 📜 Licence
Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---
Développé avec ❤️ par **Douaa Chemnane**.


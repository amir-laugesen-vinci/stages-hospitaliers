🚀 Stack technique

Backend :

Node.js + TypeScript

Express

Prisma (ORM)

SQLite (base embarquée pour le test, persistante via Docker volume)

OpenAPI / Swagger (/api/docs)

Frontend :

React + TypeScript

Vite

Ant Design (UI)

Containerisation :

Docker + docker-compose

⚙️ Installation locale
1. Cloner le projet
git clone https://github.com/amir-laugesen-vinci/stages-hospitaliers.git
cd stages-hospitaliers

2. Lancer le backend
cd backend
npm install
npx prisma generate
npm run dev


Backend accessible sur http://localhost:4000/api

3. Lancer le frontend
cd ../frontend
npm install
npm run dev


Frontend accessible sur http://localhost:5173

🐳 Exécution via Docker

Depuis la racine du projet :

docker compose up


Frontend : http://localhost:5173

Backend : http://localhost:4000/api

Documentation OpenAPI : http://localhost:4000/api/docs

📚 Fonctionnalités

Lister toutes les demandes de stage

Créer une nouvelle demande (formulaire validé côté client + serveur)

Filtrer par service ou statut

Modifier le statut d’une demande

Voir les détails d’une demande (GET /api/requests/:id)

Validation : email, champs requis, cohérence des dates (fin > début)

🧩 Choix techniques

SQLite : pratique pour le test (aucune configuration).
En production, Prisma permet de basculer vers PostgreSQL sans modifier le code.

Ant Design : interface claire et standardisée.

Swagger : pour tester facilement les routes API.

Docker : un seul docker compose up suffit à tout lancer.

💡 Notes

Les données sont stockées dans backend/prisma/dev.db (volume Docker backend_data).


📄 Auteur

Amir Laugesen
Développeur Full-Stack – Test technique Opal Solutions
# Utilise une image Node.js officielle
FROM node:20

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port (change-le si nécessaire)
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]

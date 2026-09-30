# Utilisation d'une image legere Node.js basee sur Alpine Linux
FROM node:20-alpine

# Definition du dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dependances en premier (optimisation du cache Docker)
COPY package*.json ./

# Installation des dependances (y compris nodemon pour le dev)
RUN npm install

# Copie du reste du code source
COPY . .

# Port expose par l'application
EXPOSE 5000

# Commande par defaut : demarrage avec rechargement automatique
CMD ["npm", "run", "dev"]

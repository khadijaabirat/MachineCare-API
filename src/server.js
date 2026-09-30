const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connexion a la base de donnees MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Serveur lance sur le port ${PORT}`);
});

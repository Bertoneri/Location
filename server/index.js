require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((err) => console.error('❌ Erreur MongoDB :', err));

// Modèle Mongoose
const Reservation = mongoose.model('Reservation', {
  nom: String,
  email: String,
  dateDebut: Date,
  dateFin: Date
});

// 🔐 Clé secrète admin
const ADMIN_SECRET = 'secret2025'; // Tu peux changer cette clé ici

// 🟩 POST - Créer une réservation
app.post('/api/reservation', async (req, res) => {
  const { nom, email, dateDebut, dateFin } = req.body;

  try {
    const nouvelleReservation = new Reservation({ nom, email, dateDebut, dateFin });
    await nouvelleReservation.save();
    console.log('📦 Réservation enregistrée :', nouvelleReservation);
    res.json({ message: 'Réservation enregistrée ✅' });
  } catch (err) {
    console.error('❌ Erreur enregistrement :', err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement' });
  }
});

// 🔒 GET - Obtenir les réservations (admin ou utilisateur)
app.get('/api/reservation', async (req, res) => {
  const adminCode = req.headers['x-admin-code']; // récupère le code secret dans les headers

  try {
    const reservations = await Reservation.find();

    // Si admin, retourne tout
    if (adminCode === ADMIN_SECRET) {
      return res.json(reservations);
    }

    // Sinon, retourne seulement les dates (pas de nom/email)
    const dates = reservations.map(r => ({
      dateDebut: r.dateDebut,
      dateFin: r.dateFin
    }));
    return res.json(dates);

  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
});

app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));

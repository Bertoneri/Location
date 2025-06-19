const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  nom: String,
  email: String,
  dateDebut: String,
  dateFin: String
});

module.exports = mongoose.model('Reservation', reservationSchema);

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('API de réservation'));
app.listen(4000, () => console.log('Serveur sur le port 4000'));

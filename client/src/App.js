// ✅ App.js (version avec interface admin avec code sécurisé)
import React, { useState, useEffect } from 'react';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    dateDebut: null,
    dateFin: null
  });

  const [reservations, setReservations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchReservations = async (admin = false) => {
    const headers = admin ? { 'x-admin-code': adminCode } : {};
    const res = await fetch('http://localhost:4000/api/reservation', { headers });
    const data = await res.json();
    if (res.ok) setReservations(data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const isDateReserved = (date) => {
    return reservations.some(res => {
      const start = new Date(res.dateDebut);
      const end = new Date(res.dateFin);
      return date >= start && date <= end;
    });
  };

  const isRangeAvailable = (start, end) => {
    return !reservations.some(res => {
      const resStart = new Date(res.dateDebut);
      const resEnd = new Date(res.dateFin);
      return (start <= resEnd && end >= resStart);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!form.dateDebut || !form.dateFin) {
      setErrorMessage("Veuillez choisir une date de début et de fin.");
      return;
    }
    if (!isRangeAvailable(form.dateDebut, form.dateFin)) {
      setErrorMessage("❌ Une ou plusieurs dates sont déjà réservées. Veuillez en choisir d'autres.");
      return;
    }
    const res = await fetch('http://localhost:4000/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        dateDebut: form.dateDebut?.toISOString(),
        dateFin: form.dateFin?.toISOString()
      })
    });
    const data = await res.json();
    alert(data.message);
    fetchReservations();
    setForm({ nom: '', email: '', dateDebut: null, dateFin: null });
  };

  const handleAdminLogin = () => {
    if (adminCode === 'secret2025') {
      setIsAdmin(true);
      fetchReservations(true);
    } else {
      alert("Code incorrect");
    }
  };

  return (
    <div className="App">
      <header className="hero">
        <h1>Un séjour inoubliable à Miramas 🌞</h1>
        <p>
          Découvrez notre appartement tout confort idéalement situé à 5 min à pied de la gare 🚉, avec accès rapide à Paris et Marseille.
          Plongez au cœur de la Provence entre le calme du lac Saint-Suspy 🌅, les parcours verdoyants du golf ⛳, le charme du vieux Miramas 🏰
          et le plaisir du shopping au village de marques 🛍️. En prime ? Une pause gourmande au célèbre glacier Le Quillet 🍦.
        </p>
        <p>
          Parfait pour un week-end en amoureux, des vacances en famille ou un déplacement professionnel ✨
        </p>
        <div className="photo-placeholder">[📸 Photos à venir]</div>
      </header>

      <section className="carousel-section">
        <h2>À découvrir à Miramas</h2>
        <Slider dots infinite speed={500} slidesToShow={3} slidesToScroll={1}
          responsive={[{ breakpoint: 1024, settings: { slidesToShow: 2 } }, { breakpoint: 600, settings: { slidesToShow: 1 } }]}
        >
          <div><img src="/images/gare-miramas.jpg" alt="Gare de Miramas" /></div>
          <div><img src="/images/lac-saint-suspy.jpg" alt="Lac Saint-Suspy" /></div>
          <div><img src="/images/golf-miramas.jpg" alt="Golf de Miramas" /></div>
          <div><img src="/images/miramas-le-vieux.jpg" alt="Vieux Miramas" /></div>
          <div><img src="/images/glace-le-quillet.jpg" alt="Glacier Le Quillet" /></div>
          <div><img src="/images/village-des-marques.jpg" alt="Village de Marques" /></div>
        </Slider>
      </section>

      <section className="form-section">
        <h2>Réserver maintenant</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="nom" placeholder="Votre nom" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Votre email" onChange={handleChange} required />
          <label>Date de début :</label>
          <DatePicker selected={form.dateDebut} onChange={(date) => setForm({ ...form, dateDebut: date })} selectsStart startDate={form.dateDebut} endDate={form.dateFin} dateFormat="dd/MM/yyyy" placeholderText="Choisir une date de début" className="calendar-input" filterDate={(date) => !isDateReserved(date)} />
          <label>Date de fin :</label>
          <DatePicker selected={form.dateFin} onChange={(date) => setForm({ ...form, dateFin: date })} selectsEnd startDate={form.dateDebut} endDate={form.dateFin} minDate={form.dateDebut} dateFormat="dd/MM/yyyy" placeholderText="Choisir une date de fin" className="calendar-input" filterDate={(date) => !isDateReserved(date)} />
          <button type="submit">Réserver</button>
        </form>
      </section>

      <section className="admin-section">
        {!isAdmin && (
          <div>
            <input
              type="password"
              value={adminCode}
              placeholder="Code admin"
              onChange={(e) => setAdminCode(e.target.value)}
            />
            <button onClick={handleAdminLogin}>Connexion Admin</button>
          </div>
        )}

        {isAdmin && (
          <div>
            <h2>📋 Réservations (Admin)</h2>
            <ul>
              {reservations.map((r, i) => (
                <li key={i}>
                  {r.nom} – {r.email} <br />
                  du {new Date(r.dateDebut).toLocaleDateString()} au {new Date(r.dateFin).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;

// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="jumbotron jumbotron-fluid bg-dark text-light">
        <div className="container">
          <h1 className="display-4">Découvrez les événements à venir !</h1>
          <p className="lead">Explorez notre sélection d'événements passionnants pour des expériences inoubliables.</p>
          <Link to="/MoodTracker" className="btn btn-primary">Voir les événements</Link>
        </div>
      </div>
      <div className="container mt-5">
        <h2>Des suggestions pour améliorer votre page d'accueil :</h2>
        <ul>
          <li>Afficher une liste d'événements populaires ou recommandés directement sur la page d'accueil.</li>
          <li>Intégrer un carrousel d'images mettant en valeur les moments forts de vos événements passés.</li>
          <li>Permettre aux utilisateurs de s'abonner à une newsletter pour recevoir des mises à jour sur les événements à venir.</li>
          <li>Inclure des témoignages ou des critiques d'utilisateurs sur des événements précédents pour renforcer la confiance.</li>
          <li>Proposer une fonctionnalité de recherche d'événements par catégorie, lieu ou date.</li>
          <li>Créer une section FAQ pour répondre aux questions courantes des visiteurs.</li>
          <li>Intégrer des boutons de partage sur les réseaux sociaux pour encourager les utilisateurs à partager leurs découvertes.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;

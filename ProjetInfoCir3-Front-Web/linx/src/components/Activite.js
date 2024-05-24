import React from 'react';
import { useLocation } from 'react-router-dom';

const Activite = () => {
    const location = useLocation();
    const { cardTitle } = location.state || {};

    return (
        <div>
            <h1>Activité</h1>
            {cardTitle && <p>Vous vous êtes inscrit à l'activité: {cardTitle}</p>}
        </div>
    );
};

export default Activite;

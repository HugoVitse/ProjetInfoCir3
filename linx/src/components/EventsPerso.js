import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBListGroup, MDBInputGroup, MDBBtn, MDBIcon, MDBListGroupItem, MDBInput } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventsPerso = () => {
    const { email } = useParams();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get('jwt');
      try {
        const decoded = jwtDecode(token);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        navigate('/Login');
      }
    };

    retrieveCookie();
  }, [navigate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get('http://localhost/evenements', { withCredentials: true });
  
        // Filter events based on the criteria
        const filteredEvents = eventsResponse.data.filter(event => {
          const eventDate = new Date(event.date);
          const today = new Date();
          return eventDate < today &&
                 Array.isArray(event.participants) &&
                 event.participants.includes(email);
        });
  
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchData();
  }, [email]); // Depend on email to refetch events when it changes


  // Filter events based on searchTerm
  const filteredEvents = events.filter(event =>
    event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBContainer className="mt-5">
        {/* Back button */}
      <div style={{ position: 'fixed', top: '10px', right: '10px'}}>
        <MDBBtn color="primary" onClick={() => navigate(`/Account/${encodeURIComponent(email)}`)}>
          <MDBIcon icon="arrow-left" className="me-2" />
          Retour au profil
        </MDBBtn>
      </div>

      <MDBInputGroup className="mb-3 mt-4">
        <MDBInput
          label="Recherche"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </MDBInputGroup>

      <MDBListGroup>
        <h3>Historique des Événements Participés</h3>
        {events.map(event => (
          <MDBListGroupItem key={event.id} className="rounded-3 mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="w-75">
                <h5 className="mb-1">{event.activity.title}</h5>
                <p className="mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="mb-1">Adresse: {event.activity.adresse}</p>
              </div>
              <img src={event.activity.image} alt="Event" className="img-fluid rounded-start" style={{ maxWidth: '150px', maxHeight: '150px' }} />
            </div>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </MDBContainer>
  );
};

export default EventsPerso;

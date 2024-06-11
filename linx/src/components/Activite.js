import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBInput, MDBBtn, MDBCardImage, MDBRow, MDBCol, MDBTextArea, MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';
import ReactStars from 'react-rating-stars-component';
import { useNavigate } from "react-router-dom";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AutoComplete } from 'primereact/autocomplete';

import "primereact/resources/themes/lara-light-cyan/theme.css";

import dayjs from 'dayjs';
import Config from '../config.json';

const interestsList = [
  'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs',
  'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis',
  'Sport', 'Nourriture', 'La mode'
];

const Activite = () => {
  const location = useLocation();
  const { cardTitle, cardDescription, cardImg, cardDate, adresse, custom } = location.state || {};
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [realCustom, setRealCustom] = useState(false);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [date, setDate] = useState(new dayjs(Date.now()));
  const [invites, setInvites] = useState('');
  const [type, settype] = useState('');
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [autoAdresses, setAutoAdresses] = useState([]);
  const [currentAdresse, setCurrentAdresse] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [eventCreated, setEventCreated] = useState(false); // State to manage event creation message

  const images = [
    'https://mdbootstrap.com/img/new/slides/041.jpg',
    'https://mdbootstrap.com/img/new/slides/042.jpg',
    'https://mdbootstrap.com/img/new/slides/043.jpg'
  ];

  useEffect(() => {
    setRealCustom(custom);
  }, []);

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get("jwt");
      try {
        jwtDecode(token);
      } catch {
        navigate("/Login");
      }
    };

    retrieveCookie();
  }, [navigate]); 

  useEffect(() => {
    if (type && invites && date) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [type, invites, date]);

  const handleCommentChange = (e) => setComment(e.target.value);
  const handleRatingChange = (newRating) => setRating(newRating);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment && rating) {
      const now = new Date();
      const newComment = {
        text: comment,
        rating,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      };
      setComments([...comments, newComment]);
      setComment('');
      setRating(0);
    }
  };

  const createEvent = async () => {
    const data = {
      activity: {
        title: realCustom ? customTitle : cardTitle,
        description: realCustom ? customDescription : cardDescription,
        image: realCustom ? document.querySelector(".active img").getAttribute("src") : cardImg,
        adresse: realCustom ? currentAdresse : adresse
      },
      nbinvities: invites,
      types : type,
      date: date.toString()
    };

    console.log(data);
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/createEvenement`, data, { withCredentials: true });

    setEventCreated(true);
    
    setRealCustom(false);
    setCustomTitle("");
    setCustomDescription("");
    setCurrentAdresse("");
    settype("");
    setInvites("");
    setDate(new dayjs(Date.now()));

    setTimeout(() => {
      setEventCreated(false);
      setTimeout(() => {
        navigate("/Evenements");
      }, 2000);
    }, 2000);
  };

  const changeInput = (e) => {
    if (e.target.value > 0) {
      setInvites(e.target.value);
    } else {
      setInvites(1);
    }
  };

  const changeType = (e) => {
    console.log(e.target.value);
    if (e.target.value.length > 0) {
      settype(e.target.value);
    } else {
      settype("Sortir entre amis");
    }
  };

  const newAdresses = async () => {
    console.log(currentAdresse);
    if (currentAdresse.length > 0) {
      const data = {
        "address": {
          "regionCode": "FR",
          "addressLines": [currentAdresse]
        }
      };
      const response = await axios.post("https://addressvalidation.googleapis.com/v1:validateAddress?key=YOUR_API_KEY", data);
      setAutoAdresses([response.data.result.address.formattedAddress]);
    }
  };

  const search = (event) => {
    newAdresses();
  };

  return (
    <MDBContainer>
      <h1>Créer un évènement</h1>
      <MDBCard className='mb-4'>
        <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!realCustom ?
            <>
              <MDBCardImage
                src={cardImg}
                alt='...'
                position='top'
                style={{ maxWidth: '50%', maxHeight: '50%', objectFit: 'cover', marginBottom: '2%' }}
              />
              <MDBCardTitle>{cardTitle}</MDBCardTitle>
              <MDBCardText style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                {cardDescription}
              </MDBCardText>
              <MDBCardText>
                <small className="text-muted">{cardDate}</small>
              </MDBCardText>
            </> :
            <>
              <MDBCardText> Evenement personnalisé</MDBCardText>
              <MDBCarousel className='mb-3' style={{ width: "50%" }} showControls interval={3600000}>
                {images.map((image, index) => (
                  <MDBCarouselItem itemId={index + 1}>
                    <img src={image} className='d-block w-100' alt='...' />
                  </MDBCarouselItem>
                ))}
              </MDBCarousel>
              <MDBRow className='m-3' style={{ width: "50%" }}>
                <MDBInput value={customTitle} onChange={(e) => { setCustomTitle(e.target.value) }} label="Titre" id="form1" type="text" />
              </MDBRow>
              <MDBRow className='m-3' style={{ width: "50%" }}>
                <MDBTextArea style={{ width: "50%" }} value={customDescription} onChange={(e) => { setCustomDescription(e.target.value) }} label="Description" id="textAreaExample" rows="{4}" />
              </MDBRow>
              <MDBRow className='m-3' style={{ width: "50%" }}>
                <div style={{ width: "100%" }} className="card flex justify-content-center p-0">
                  <AutoComplete id="auto" style={{ width: "100%" }} value={currentAdresse} suggestions={autoAdresses} completeMethod={search} onChange={(e) => { setCurrentAdresse(e.value) }} />
                </div>
              </MDBRow>
            </>
          }
        </MDBCardBody>
      </MDBCard>

      <MDBCard className='mb-4'>
      <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <MDBRow className="w-100 mb-3">
          <MDBCol size='6'>
            <MDBCardText className="text-center mb-2">Centre d'intérêt</MDBCardText>
            <select value={type} onChange={changeType} className="form-select">
              <option disabled>Choisir un intérêt</option>
              {interestsList.map(interest => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size='6'>
            <MDBCardText className="text-center mb-2">Nombre d'invités max</MDBCardText>
            <MDBInput value={invites} onChange={changeInput} label="Invités" id="typeNumber" type="number" className="w-75" />
          </MDBCol>
        </MDBRow>
        <MDBRow className="w-100">
          <MDBCol size='12'>
            <MDBCardText className="text-center mb-2">Date de l'évènement</MDBCardText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker className="d-flex justify-content-center" label="Basic date picker" value={date} onChange={setDate} />
            </LocalizationProvider>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
      <MDBCard className='d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
        <MDBBtn onClick={createEvent} disabled={buttonDisabled}>Créer l'évènement</MDBBtn>
      </MDBCard>

      {eventCreated && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '9999' }}>
          <p>L'événement a été créé avec succès!</p>
        </div>
      )}
    </MDBContainer>
  );
};

export default Activite;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { MDBContainer, MDBCard,MDBCardBody, MDBCardTitle, MDBCardText, MDBInput, MDBBtn, MDBCardImage, MDBRow , MDBCol, MDBTable, MDBTextArea,MDBCarousel, MDBCarouselItem} from 'mdb-react-ui-kit';
import ReactStars from 'react-rating-stars-component';
import { useNavigate } from "react-router-dom";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { AutoComplete } from 'primereact/autocomplete';
import Config from '../config.json'

import "primereact/resources/themes/lara-light-cyan/theme.css";

import dayjs, { Dayjs } from 'dayjs';

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
  const [eventCreated, setEventCreated] = useState(false);
  const [message] = useState([
    { text: 'Que pensez-vous de cette activité ?', sender: 'user1@example.com', type: 'received' }
  ]);
    const images = [
        'https://media.gqmagazine.fr/photos/603e6a8da9360b0585bcbc6a/16:9/w_2560%2Cc_limit/108387402',
        'https://www.fnacspectacles.com/magazine/fileadmin/_processed_/d/4/csm_parc-asterix-attraction_58dfd74118.jpg',
        'https://lemagdelaconso.ouest-france.fr/images/dossiers/2023-02/mini/zoo-173704-1200-600.jpg',
        'https://media.lesechos.com/api/v1/images/view/5bd2ee868fe56f1954726719/1280x720/2203698-theatres-prives-parisiens-si-convoites-mais-si-fragiles-web-tete-0302222880640.jpg',
        'https://img.freepik.com/vecteurs-libre/silhouette-danse-salon-dessinee-main_23-2150922361.jpg?size=626&ext=jpg&ga=GA1.1.1788614524.1718409600&semt=sph',
        'https://www.shogun-japon.com/cdn/shop/articles/Type-de-manga.jpg?v=1642615082',
        'https://cdn-europe1.lanmedia.fr/var/europe1/storage/images/europe1/medias-tele/exclusif-les-series-tele-preferes-des-francais-sont-3999594/56169328-1-fre-FR/EXCLUSIF-Les-series-tele-preferes-des-Francais-sont.jpg',


    ]

    useEffect(()=>{
        setRealCustom(custom)
        
    },[])

  

    useEffect(()=>{
        console.log(customTitle)
    },[customTitle])

    useEffect(() => {
        const retrieveCookie = () => {
          const token = Cookies.get("jwt");
          try {
            jwtDecode(token);
          } catch {
            navigate("/Login");
          }
        }
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

    useEffect(()=>{
        console.log(date)
    },[date])

    const createEvent = async () => {
        const data = {
          activity: {
            title: realCustom ? customTitle : cardTitle,
            description: realCustom ? customDescription : cardDescription,
            image: realCustom ? document.querySelector(".active img").getAttribute("src") : cardImg,
            adresse: realCustom ? currentAdresse : adresse
          },
          nbinvities: invites,
          type: type,
          messages: message,
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
          }, 500);
        }, 2000);
      };

    const changeInput = (e) => {
        if(e.target.value > 0){
            setInvites(e.target.value)
        }
        else{
            setInvites(1)
        }
    }

    const changeType = (e) => {
        console.log(e.target.value);
        if (e.target.value.length > 0) {
          settype(e.target.value);
        } else {
          settype("Sortir entre amis");
        }
      };

    const newAdresses = async()=>{
        console.log(currentAdresse)
        if(currentAdresse.length>0){
            const data = {
                "address": {
                    "regionCode": "FR",
                    "addressLines": [currentAdresse ]
                }
                
            }
            const reponse = await axios.post("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0",data)
            setAutoAdresses([reponse.data.result.address.formattedAddress])
        }
        
    }

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 }
    ]

    const search = (event) => {
        newAdresses()
    }
  return (
    <div className="bg-theme text-theme">
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center align-items-center">
          <MDBCol size="6">
          <div className="carousel-container mb-3 bg-dark" style={{ padding: "20px", borderRadius: "15px", height: "100%" }}>
            {realCustom && (
              <MDBCarousel className='mb-3' style={{ width: "100%" }} showControls interval={3600000}>
                {images.map((image, index) => (
                  <MDBCarouselItem itemId={index + 1}>
                    <img src={image} className='d-block w-100' alt='...' />
                  </MDBCarouselItem>
                ))}
              </MDBCarousel>
            )}

            <h4 className='text-light text-center'>Sélectionne une image !</h4>
            </div>
          </MDBCol>
          <MDBCol size="6">
            <MDBCard className="mb-4 bg-dark" style={{paddingTop:'15px', borderRadius:'15px'}}>
              <MDBCardBody className="bg-dark" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {!realCustom ?
                  <>
                    <MDBCardImage
                      src={cardImg}
                      alt="..."
                      position="top"
                      style={{ maxWidth: "100%", maxHeight: "50%", objectFit: "cover", marginBottom: "2%" }}
                    />
                    <MDBCardTitle>{cardTitle}</MDBCardTitle>
                    <MDBCardText style={{ overflowWrap: "break-word", wordWrap: "break-word", wordBreak: "break-word" }}>
                      {cardDescription}
                    </MDBCardText>
                    <MDBCardText>
                      <small className="text-muted">{cardDate}</small>
                    </MDBCardText>
                  </> :
                  <>
                    <h4 className='text-white'> <strong>Evénement personnalisé</strong></h4>
                    <MDBRow className="m-3" style={{ width: "100%" }}>
                      <div className="card flex justify-content-center p-0">
                        <AutoComplete
                          value={currentAdresse}
                          suggestions={autoAdresses}
                          completeMethod={search}
                          onChange={(e) => { setCurrentAdresse(e.value) }}
                          placeholder="Adresse"
                          dropdown
                          style={{ width: '100%' }}
                        />
                      </div>
                    </MDBRow>
                    <MDBRow className='m-3 bg-light' style={{ width: "100%" }}>
                      <MDBInput value={customTitle} onChange={(e) => { setCustomTitle(e.target.value) }} label="Titre" id="form1" type="text" />
                    </MDBRow>
                    <MDBRow className='m-3 bg-light' style={{ width: "100%" }}>
                      <MDBTextArea style={{ width: "100%" }} value={customDescription} onChange={(e) => { setCustomDescription(e.target.value) }} label="Description" id="textAreaExample" rows="4" />
                    </MDBRow>
                  </>
                }
              </MDBCardBody>
            </MDBCard>
    
            <MDBCard className='mb-4 bg-dark'>
              <MDBCardBody className="bg-dark" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius:'15px' }}>
                <MDBRow className="w-100 mb-3">
                  <MDBCol size='6'>
                    <MDBCardText className="text-white text-center mb-2">Centre d'intérêt</MDBCardText>
                    <select value={type} onChange={changeType} className="form-select">
                      <option >Choisir un intérêt</option>
                      {interestsList.map(interest => (
                        <option key={interest} value={interest}>{interest}</option>
                      ))}
                    </select>
                  </MDBCol>
                  <MDBCol size='6'>
                    <MDBCardText className="text-white text-center mb-2 ">Nombre d'invités max</MDBCardText>
                    <MDBInput value={invites} onChange={changeInput} label="Invités" id="typeNumber" type="number" className="bg-light" />
                  </MDBCol>
                </MDBRow>
                <MDBRow className="w-100" >
                  <MDBCol size='12'>
                    <MDBCardText className="text-white text-center mb-2">Date de l'évènement</MDBCardText>
                    <div className='bg-light'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker className="d-flex justify-content-center" value={date} onChange={setDate} />
                      </LocalizationProvider>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
    
            <MDBCard className='bg-dark d-flex align-items-center justify-content-center' style={{ height: "10vh" }}>
              <MDBBtn className="custom-btn-secondary" onClick={createEvent} disabled={buttonDisabled}>Créer l'évènement</MDBBtn>
            </MDBCard>
    
            {eventCreated && (
              <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '9999' }}>
                <p>L'événement a été créé avec succès!</p>
              </div>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Activite;
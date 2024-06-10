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

import "primereact/resources/themes/lara-light-cyan/theme.css";

import dayjs, { Dayjs } from 'dayjs';
import Config from '../config.json'

const Activite = () => {
    const location = useLocation();
    const { cardTitle, cardDescription, cardImg, cardDate ,adresse,custom} = location.state || {};
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [realCustom,setRealCustom] = useState(false)
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();
    const [date, setDate] = useState(new dayjs(Date.now()));
    const [invites,setInvites] = useState('')
    const [customTitle,setCustomTitle] = useState("")
    const [customDescription,setCustomDescription] = useState("")
    const [autoAdresses, setAutoAdresses] = useState([])
    const [currentAdresse, setCurrentAdresse] = useState("")

    const images = [
        'https://mdbootstrap.com/img/new/slides/041.jpg',
        'https://mdbootstrap.com/img/new/slides/042.jpg',
        'https://mdbootstrap.com/img/new/slides/043.jpg'

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

    const createEvent = async()=>{

        

        console.log(customTitle)

        const data = {
            activity:{
                title:realCustom?customTitle:cardTitle,
                description: realCustom?customDescription:cardDescription,
                image: realCustom?document.querySelector(".active img").getAttribute("src"):cardImg,
                adresse:realCustom?currentAdresse:adresse
            },
            nbinvities:invites,
            date:date.toString()
        }

        console.log(data)
        const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/createEvenement`,data,{withCredentials:true})
    
    
    }
    useEffect(()=>{
        console.log(invites)
    },[invites])

    const changeInput = (e) => {
        if(e.target.value > 0){
            setInvites(e.target.value)
        }
        else{
            setInvites(1)
        }
    }

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
        <MDBContainer className='contourpage'>
            <h1>Créer un évènement</h1>
            <MDBCard className='mb-4'>
                
                <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!realCustom?
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
                        </>:
                        <>
                            <MDBCardText> Evenement personnalisé</MDBCardText>
                           
                            <MDBCarousel className='mb-3' style={{width:"50%"}} showControls interval={3600000} >
                                {images.map((image, index) => (
                                    <MDBCarouselItem itemId={index+1}>
                                        <img src={image} className='d-block w-100' alt='...' />
                                    </MDBCarouselItem>
                                ))}
                            </MDBCarousel>
                            
                            <MDBRow className='m-3' style={{width:"50%"}}>
                                <MDBInput  value={customTitle} onChange={(e)=>{setCustomTitle(e.target.value)}} label="Titre" id="form1" type="text" />
                            </MDBRow>
                            <MDBRow  className='m-3' style={{width:"50%"}}>
                                <MDBTextArea style={{width:"50%"}} value={customDescription} onChange={(e)=>{setCustomDescription(e.target.value)}}  label="Description" id="textAreaExample" rows="{4}" />
                            </MDBRow>
                            <MDBRow className='m-3' style={{width:"50%"}}>
                                <div  style={{width:"100%"}} className="card flex justify-content-center p-0">  
                                    <AutoComplete id="auto" style={{width:"100%"}}  value={currentAdresse} suggestions={autoAdresses} completeMethod={search} onChange={(e)=>{setCurrentAdresse(e.value)}} />
                                </div>
                            </MDBRow>
                   
                        </>
                    }
                </MDBCardBody>

        
                        
            
            
            </MDBCard>

            <MDBCard className='mb-4'>
                <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDBRow>
                        <MDBCol size='3' className="d-flex align-items-center justify-content-center p-0">
                            <MDBCardText>Nombres d'invités max</MDBCardText>
                        </MDBCol>
                        <MDBCol size='3' className="d-flex align-items-center justify-content-center pe-5">
                            <MDBInput value={invites} onChange={changeInput} label="Invités" id="typeNumber" type="number" />
                        </MDBCol>
                        <MDBCol size='3' className="d-flex align-items-center justify-content-center ps-5">
                            <MDBCardText>Date de l'évènement</MDBCardText>
                        </MDBCol>
                        <MDBCol size='3'className="d-flex align-items-center justify-content-center p-0">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Basic date picker" value={new dayjs(date)}  onChange={setDate}/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

            <MDBCard className='d-flex align-items-center justify-content-center ' style={{height:"10vh"}}>
                <MDBBtn onClick={createEvent}>Créer l'évènement</MDBBtn>
            </MDBCard>
            

            
        </MDBContainer>
    );
};

export default Activite;
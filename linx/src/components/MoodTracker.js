import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import {
  MDBContainer, MDBCarousel, MDBCardImage, MDBCarouselItem, MDBCard, MDBCardBody, MDBRange, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../css/MoodTracker.css';
import Cookies from 'js-cookie';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import Calendar from './Calendar';
import axios from 'axios';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const MoodTracker = () => {
  const [formData, setFormData] = useState({
    sleepQuality: 0,
    stressLevel: 0,
    energyLevel: 0,
    moral: 0,
    additionalActivity: 0,
    date: getTodayDateDDMMYYYY(),
    average: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [today, settoday] = useState(true);
  const [years, setyears] = useState([]);
  const [sleep, setsleep] = useState([]);
  const [stress, setstress] = useState([]);
  const [energ, setenerg] = useState([]);
  const [moral, setmoral] = useState([]);
  const [add, setadd] = useState([]);
  const [ind, setind] = useState(0);
  const radarChartRef = useRef(null);
  const chartInstance = useRef(null);

  const calculateAverage = (data) => {
    const { sleepQuality, stressLevel, energyLevel, moral, additionalActivity } = data;
    const total = parseInt(sleepQuality) + parseInt(stressLevel) + parseInt(energyLevel) + parseInt(moral) + parseInt(additionalActivity);
    return Math.ceil(total / 5);
  };

  const handleSliderChange = (value, name) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: parseInt(value) };
      return { ...newData, average: calculateAverage(newData) };
    });
  };

  function getTodayDateDDMMYYYY() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear();
  
    return `${dd}-${mm}-${yyyy}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost/FillMoodTracker', formData, { withCredentials: true });
      setFormData({
        sleepQuality: 0,
        stressLevel: 0,
        energyLevel: 0,
        moral: 0,
        additionalActivity: 0,
        date: getTodayDateDDMMYYYY(),
        average: 0
      });
      setBasicModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {

    const retrieveCookie = () => {
      const token = Cookies.get("jwt");
      try {
        jwtDecode(token);
      } catch {
        navigate("/");
      }
    };
  
    retrieveCookie();
  
    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        const yearsArray = [];
        const sleepArray = [];
        const stressArray = [];
        const energArray = [];
        const moralArray = [];
        const addArray = [];
        const todayDate = getTodayDateDDMMYYYY();
        
        response.data.moodTrackerData.forEach((data, i) => {
          yearsArray.push(data.date);
          sleepArray.push(data.sleepQuality);
          stressArray.push(data.stressLevel);
          energArray.push(data.energyLevel);
          moralArray.push(data.moral);
          addArray.push(data.additionalActivity);
          setind(i)
          if (data.date === todayDate) {
            settoday(false);
          }
        });
        setyears(yearsArray);
        setsleep(sleepArray);
        setstress(stressArray);
        setenerg(energArray);
        setmoral(moralArray);
        setadd(addArray);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    
  }, []);

  useEffect(()=>{
    if(years.length>1 && sleep.length>1 && add.length>1 && moral.length>1 && energ.length>1 && stress.length>1){
      GetCanva();
    }
 

  },[years,sleep,add,moral,energ,stress])


  const GetCanva = () =>{

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = radarChartRef.current.getContext('2d');
  
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sommeil', 'Sport', 'Alimentation', 'Social', 'Moral'],
        datasets: [
          {
            label: 'Mood Actuel',
            data: [
              formData.sleepQuality || sleep[ind],
              formData.stressLevel || stress[ind],
              formData.energyLevel || energ[ind],
              formData.moral || moral[ind],
              formData.additionalActivity || add[ind],

              
            ],
            backgroundColor: 'rgba(54, 245, 39, 0.37)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: false,
            },
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };

  }

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-800">
      <MDBCard className="w-50 h-10">
        <MDBCardBody>
          {/* Afficher le bouton ou le texte en fonction de today */}
          {today ? (
            <MDBBtn className="w-100 mb-3 btn-success" onClick={() => setBasicModal(true)}>
              Questionnaire Quotidien
            </MDBBtn>
          ) : (
            <MDBBtn className="w-100 mb-3 btn-danger" style={{ cursor: 'auto' }}>
              Questionnaire Quotidien NON Disponible
            </MDBBtn>
          )}
          {/* Carrousel */}
          <MDBCarousel showControls fade>
            {/* Première Carrousel */}
            <MDBCarouselItem className="w-100 d-block " itemId={1}>
              <h5>Première Slide</h5>
              <Calendar />
            </MDBCarouselItem>
            
            {/* Carrousel du MoodBoard Quotidien */}
            <MDBCarouselItem className="w-100 d-block vh-80" itemId={2}>
              <h5>MoodBoard Quotidien, Date : {years[ind]} </h5>
              <canvas ref={radarChartRef} id="radarChart" style={{ marginTop: '20px', width: '100%', height: '400px' }}></canvas>
            </MDBCarouselItem>

            {/* Troisième Carrousel */}
            <MDBCarouselItem className="w-100 d-block vh-80" itemId={3}>
              <h5>Troisième Slide</h5>
              <MDBCardImage
                src='https://mdbootstrap.com/img/new/standard/city/042.webp'
                alt='...'
                style={{ height: '80%' }}
              />
            </MDBCarouselItem>
          </MDBCarousel>
  
          {/* Pop-up Questionnaire */}
          <MDBModal open={basicModal} toggle={() => setBasicModal(false)} tabIndex='-1' staticBackdrop>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader>
                  <h5 className="modal-title" id="exampleModalLabel">Le rendez-vous quotidien !</h5>
                  <MDBBtn className="btn-close" color="none" onClick={() => setBasicModal(false)}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <div style={{ padding: '20px' }}>
                    <h3 className="text-center mb-4">Suivi quotidien de l'humeur</h3>
                      
                      <div className="mb-3">
                        <label htmlFor="sleepQuality" className="form-label">Avez-vous bien dormi ? (note sur 10)</label>
                        <MDBRange id="sleepQuality" name="sleepQuality" min="0" max="10" value={formData.sleepQuality} onChange={(e) => handleSliderChange(e.target.value, 'sleepQuality')} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="stressLevel" className="form-label">Avez-vous fait du sport aujourd'hui ? (note sur 10)</label>
                        <MDBRange id="stressLevel" name="stressLevel" min="0" max="10" value={formData.stressLevel} onChange={(e) => handleSliderChange(e.target.value, 'stressLevel')} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="energyLevel" className="form-label">Notez vos interactions avec des personnes. (note sur 10)</label>
                        <MDBRange id="energyLevel" name="energyLevel" min="0" max="10" value={formData.energyLevel} onChange={(e) => handleSliderChange(e.target.value, 'energyLevel')} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="moral" className="form-label">Vous êtes-vous senti anxieux, heureux, ou autre ? (note sur 10)</label>
                        <MDBRange id="moral" name="moral" min="0" max="10" value={formData.moral} onChange={(e) => handleSliderChange(e.target.value, 'moral')} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="additionalActivity" className="form-label">Avez-vous bien mangé aujourd'hui ?</label>
                        <MDBRange id="additionalActivity" name="additionalActivity" min="0" max="10" value={formData.additionalActivity} onChange={(e) => handleSliderChange(e.target.value, 'additionalActivity')} />
                      </div>
                    </div>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="primary" onClick={handleSubmit}>Envoyez vos réponses</MDBBtn>
                  </MDBModalFooter>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    );  
};

export default MoodTracker;

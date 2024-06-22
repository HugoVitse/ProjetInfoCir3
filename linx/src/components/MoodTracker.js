import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import {
  MDBContainer, MDBCard, MDBCardBody, MDBCarousel, MDBCarouselItem, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import Chart from 'chart.js/auto';
import Calendar from './Calendar';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/MoodTracker.css';

const MoodTracker = () => {
  const [formData, setFormData] = useState({
    sleepLevel: 0,
    sportLevel: 0,
    socialLevel: 0,
    moralLevel: 0,
    eatLevel: 0,
    date: getTodayDateDDMMYYYY(),
    average: 0
  });
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  const [today, settoday] = useState(true);
  const [years, setYears] = useState([]);
  const [sleepLevel, setSleep] = useState([]);
  const [sportLevel, setStress] = useState([]);
  const [socialLevel, setEnerg] = useState([]);
  const [moralLevel, setMoral] = useState([]);
  const [eatLevel, setAdd] = useState([]);
  const [startDate, setstartDate] = useState([]);
  const [endDate, setendDate] = useState([]);
  const [avera, setaverag] = useState([]);
  const [ind, setInd] = useState(0);
  const radarChartRef = useRef(null);
  const barChartRef = useRef(null);

  const calculateAverage = (data) => {
    const { sleepLevel, sportLevel, socialLevel, moralLevel, eatLevel} = data;
    const total = parseInt(sleepLevel) + parseInt(sportLevel) + parseInt(socialLevel) + parseInt(moralLevel) + parseInt(eatLevel);
    return Math.ceil(total / 5);
  };

  const handleSliderChange = (value, name) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: parseInt(value) };
      return { ...newData, average: calculateAverage(newData) };
    });
  };

  function getTodayDateDDMMYYYY() {
    let date = new Date();
    let formattedDate = date.toDateString();
    return formattedDate;
  }

  const getThisWeekDates = () => {
    const todayString = getTodayDateDDMMYYYY();
    const today = new Date(todayString);

    const dayOfWeek = today.getDay();
    console.log(dayOfWeek);
    
    // Calculate start date
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const startDateString = startDate.toDateString();
    console.log(startDateString);
    
    // Calculate end date
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7));
    const endDateString = endDate.toDateString();
    console.log(endDateString);
    
    return { startDate: startDateString, endDate: endDateString };
};


  console.log(getThisWeekDates());

  const decomposerDate = (dateString) =>{

    const moisNoms = {
      "Jan": 1,
      "Feb": 2,
      "Mar": 3,
      "Apr": 4,
      "May": 5,
      "Jun": 6,
      "Jul": 7,
      "Aug": 8,
      "Sep": 9,
      "Oct": 10,
      "Nov": 11,
      "Dec": 12
    };

    console.log(dateString)

    const dateArray = dateString.split(" ");
    const jour = parseInt(dateArray[2], 10);
    const mois = moisNoms[dateArray[1]];
    const annee = parseInt(dateArray[3], 10);

    return {
        jour: jour,
        mois: mois,
        annee: annee
    };
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost/FillMoodTracker', formData, { withCredentials: true });
      setFormData({
        sleepLevel: 0,
        sportLevel: 0,
        socialLevel: 0,
        moralLevel: 0,
        eatLevel: 0,
        date: getTodayDateDDMMYYYY(),
        average: 0
      });
      setBasicModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
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

    const fetchData = async () => {
  retrieveCookie();
  try {
    const response = await axios.get('http://localhost/getMoodTracker', { withCredentials: true });
    const yearsArray = [];
    const sleepArray = [];
    const stressArray = [];
    const energArray = [];
    const moralArray = [];
    const addArray = [];
    const Average = [];
    const todayDate = getTodayDateDDMMYYYY();

    response.data.moodTrackerData.forEach((data, i) => {
      yearsArray.push(data.date);
      sleepArray.push(data.sleepLevel);
      stressArray.push(data.sportLevel);
      energArray.push(data.socialLevel);
      moralArray.push(data.moralLevel);
      addArray.push(data.eatLevel);
      Average.push(data.average);
      setInd(i);
      if (data.date === todayDate) {
        settoday(false);
      }
    });

    console.log(yearsArray);
    console.log(sleepArray);
    console.log(stressArray);
    console.log(energArray);
    console.log(moralArray);
    console.log(addArray);
    console.log(Average);

    setYears(yearsArray);
    setSleep(sleepArray);
    setStress(stressArray);
    setEnerg(energArray);
    setMoral(moralArray);
    setAdd(addArray);
    setaverag(Average);
  } catch (error) {
    console.error(error);
  }
};
    fetchData();
  }, []);

  useEffect(() => {
    if (radarChartRef.current && barChartRef.current) {
      if (years.length > 0 && sleepLevel.length > 0 && eatLevel.length > 0 && moralLevel.length > 0 && socialLevel.length > 0 && sportLevel.length > 0 && avera.length > 0) {
        GetCanvas();
        GetBar();
      }
    }
  }, [years, sleepLevel, eatLevel, moralLevel, socialLevel, sportLevel, avera]);

  const GetCanvas = () => {
    if (radarChartRef.chartInstance) {
      radarChartRef.chartInstance.destroy();
    }

    console.log(ind);


    const ctx = radarChartRef.current.getContext('2d');

    radarChartRef.chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sommeil', 'Sport', 'Alimentation', 'Social', 'Moral'],
        datasets: [
          {
            label: 'Mood Actuel',
            data: [
              sleepLevel[ind],
              sportLevel[ind],
              socialLevel[ind],
              moralLevel[ind],
              eatLevel[ind],
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
              color: 'blue', // Changez ici pour la couleur désirée
              display: false,
            },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              font: {
                color: 'red', // Changez ici pour la couleur désirée
              },
            },
          },
        },
        // maintainAspectRatio: false,
      },
    });
  };

  const fillMissingDays = (avera) => {
    const filledData = new Array(7).fill(0);
    const thisWeek = getThisWeekDates();
    
    years.forEach((data, index) => {
      const date = decomposerDate(data);
      const dateObj = new Date(date.annee, date.mois - 1, date.jour);
      const dayOfWeek = dateObj.getDay();
      
      if (dateObj >= new Date(thisWeek.startDate) && dateObj < new Date(thisWeek.endDate)) {
        filledData[dayOfWeek === 0 ? 6 : dayOfWeek - 1] = avera[index];
      }
    });
    
    return filledData;
  };
 

  const GetBar = () => {
    if (barChartRef.chartInstance) {
      barChartRef.chartInstance.destroy();
    }
  
    const ctx = barChartRef.current.getContext('2d');
    const { startDate, endDate } = getThisWeekDates();
  
    setstartDate(startDate);
    setendDate(endDate);
  
    const filledData = fillMissingDays(avera);
  
    barChartRef.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        datasets: [
          {
            label: 'Mood Actuel',
            data: filledData,
            backgroundColor: 'rgba(54, 245, 39, 0.37)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              font: {
                size: 14,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                style: 'normal',
                weight: 'bold',
              },
              color: 'blue', // Couleur des étiquettes
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'blue', // Couleur des légendes
            },
          },
        },
      },
    });
  };


  return (
    <div style={{ height: '100vh', maxWidth: '100%', overflowX: 'hidden', overflowY: 'hidden' }}>
    <MDBContainer fluid className="bg-theme text-theme contourpage d-flex align-items-center justify-content-center vh-100">
      <MDBCard className="w-50 h-100">
        <MDBCardBody className="bg-theme">
          {/* Boutons pour Questionnaire Quotidien */}
          {today ? (
            <MDBBtn className="w-100 mb-3 btn-success" onClick={() => setBasicModal(true)}>
              Questionnaire Quotidien
            </MDBBtn>
          ) : (
            <MDBBtn className="w-100 mb-3 btn-danger">
              Questionnaire Quotidien NON Disponible
            </MDBBtn>
          )}
          {/* ----- */}
          <MDBCarousel showControls fade interval={10000}> 
            {/* Interval : temps de défilement du Carousel */}
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme" itemId={1}>
              <h5 className="mb-4">Calendrier</h5>
              <div className="text-theme-inv " style={{ width: '100%', height: '70vh' }}>
                <Calendar />
              </div>
            </MDBCarouselItem>
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme" itemId={2}>
              <h5 className="mb-4">MoodBoard du jour : {years[ind]}</h5>
              <div className="text-center text-theme-inv bg-light d-flex justify-content-center" style={{ width: '95%', height: '50vh' }}>
                <canvas ref={radarChartRef} id="radarChart"></canvas>
              </div>
            </MDBCarouselItem>
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme" itemId={3}>
              <h5 className="mb-4">MoodBoard de la Semaine : Du {startDate} au {endDate}</h5>
              <div className="text-theme-inv bg-light" style={{ width: '100%', height: '50vh' }}>
                <canvas ref={barChartRef} id="barChart"></canvas>
              </div>
            </MDBCarouselItem>
          </MDBCarousel>


          {/* Pop-up Questionnaire Quotidien */}
          <MDBModal open={basicModal} toggle={() => setBasicModal(false)} tabIndex='-1' staticBackdrop>
            <MDBModalDialog centered>
              <MDBModalContent>
                <MDBModalHeader className='bg-theme-nuance text-theme'>
                  <h5 className="modal-title" id="exampleModalLabel">Le rendez-vous quotidien !</h5>
                  <MDBBtn className="btn-close" color="none" onClick={() => setBasicModal(false)}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody className='bg-theme-nuance2 text-theme'>
                  <div style={{ padding: '20px' }}>
                    <h3 className="text-center mb-4"><strong>Suivi quotidien de l'humeur</strong></h3>

                    <div className="mb-3">
                      <label htmlFor="sleepLevel" className="form-label text-theme"><strong>Avez-vous bien dormi ?</strong> (note sur 10)</label>
                      <input type="range" className="form-range" id="sleepLevel" name="sleepLevel" min="0" max="10" value={formData.sleepLevel} onChange={(e) => handleSliderChange(e.target.value, 'sleepLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sportLevel" className="form-label text-theme"><strong>Avez-vous fait du sport aujourd'hui ?</strong> (note sur 10)</label>
                      <input type="range" className="form-range" id="sportLevel" name="sportLevel" min="0" max="10" value={formData.sportLevel} onChange={(e) => handleSliderChange(e.target.value, 'sportLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="socialLevel" className="form-label text-theme"><strong>Notez vos interactions avec des personnes.</strong> (note sur 10)</label>
                      <input type="range" className="form-range" id="socialLevel" name="socialLevel" min="0" max="10" value={formData.socialLevel} onChange={(e) => handleSliderChange(e.target.value, 'socialLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="moralLevel" className="form-label text-theme"><strong>Vous êtes-vous senti anxieux, heureux, ou autre ?</strong> (note sur 10)</label>
                      <input type="range" className="form-range" id="moralLevel" name="moralLevel" min="0" max="10" value={formData.moralLevel} onChange={(e) => handleSliderChange(e.target.value, 'moralLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="eatLevel" className="form-label text-theme"><strong>Avez-vous bien mangé aujourd'hui ?</strong></label>
                      <input type="range" className="form-range" id="eatLevel" name="eatLevel" min="0" max="10" value={formData.eatLevel} onChange={(e) => handleSliderChange(e.target.value, 'eatLevel')} />
                    </div>
                  </div>
                </MDBModalBody>
                <MDBModalFooter className='bg-theme-nuance text-theme'>
                  <MDBBtn color="primary" onClick={handleSubmit}>Envoyez vos réponses</MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    </div>
  );
};

export default MoodTracker;
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
    sleepQuality: 0,
    stressLevel: 0,
    energyLevel: 0,
    moral: 0,
    additionalActivity: 0,
    date: getTodayDateDDMMYYYY(),
    average: 0
  });
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  const [today, settoday] = useState(true);
  const [years, setYears] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [stress, setStress] = useState([]);
  const [energ, setEnerg] = useState([]);
  const [moral, setMoral] = useState([]);
  const [add, setAdd] = useState([]);
  const [avera, setaverag] = useState([]);
  const [ind, setInd] = useState(0);
  const radarChartRef = useRef(null);
  const barChartRef = useRef(null);

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

  function getTodayDateDDMMYYYY (){
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  }

  const getDayOfWeek = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript
    return date.getDay();
}


  const getThisWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7));

    const startDateFormatted = `${String(startDate.getDate()).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${startDate.getFullYear()}`;
    const endDateFormatted = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()}`;

    return { startDate: startDateFormatted, endDate: endDateFormatted };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const response = await axios.get('http://localhost/infos', { withCredentials: true });
    const yearsArray = [];
    const sleepArray = [];
    const stressArray = [];
    const energArray = [];
    const moralArray = [];
    const addArray = [];
    const Average = [];
    const todayDate = getTodayDateDDMMYYYY();
    const thisWeek = getThisWeekDates();

    response.data.moodTrackerData.forEach((data, i) => {
      yearsArray.push(data.date);
      sleepArray.push(data.sleepQuality);
      stressArray.push(data.stressLevel);
      energArray.push(data.energyLevel);
      moralArray.push(data.moral);
      addArray.push(data.additionalActivity);
      Average.push(data.average);
      setInd(i);
      if (data.date === todayDate) {
        settoday(false);
      }
      if (data.date === thisWeek.startDate) {
        setInd(i);
      }
    });
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
      if (years.length > 0 && sleep.length > 0 && add.length > 0 && moral.length > 0 && energ.length > 0 && stress.length > 0 && avera.length > 0) {
        GetCanvas();
        GetBar();
      }
    }
  }, [years, sleep, add, moral, energ, stress, avera, ind]);

  const GetCanvas = () => {
    if (radarChartRef.chartInstance) {
      radarChartRef.chartInstance.destroy();
    }

    const ctx = radarChartRef.current.getContext('2d');

    radarChartRef.chartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sommeil', 'Sport', 'Alimentation', 'Social', 'Moral'],
        datasets: [
          {
            label: 'Mood Actuel',
            data: [
              sleep[ind],
              stress[ind],
              energ[ind],
              moral[ind],
              add[ind],
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
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const filledData = new Array(7).fill(0);
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    startOfWeek.setHours(0, 0, 0, 0);

    years.forEach((date, index) => {
      const [day, month, year] = date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();

      if (dateObj >= startOfWeek && dateObj < new Date(startOfWeek).setDate(startOfWeek.getDate() + 7)) {
        filledData[dayOfWeek - 1] = avera[index];
      }
    });
    return filledData;
  };
  

  const GetBar = () => {
    if (barChartRef.chartInstance) {
      barChartRef.chartInstance.destroy();
    }
  
    const ctx = barChartRef.current.getContext('2d');
    const currentDayOfWeek = getDayOfWeek(years[ind]);
    const { startDate, endDate } = getThisWeekDates();
    
    const filledData = fillMissingDays(avera, startDate, endDate);
  
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
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme-inv" itemId={1}>
              <h5 className="mb-4">Calendrier</h5>
              <div className="text-theme-inv bg-light" style={{ width: '100%', height: '70vh' }}>
                <Calendar />
              </div>
            </MDBCarouselItem>
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme-inv" itemId={2}>
              <h5 className="mb-4">MoodBoard du jour :</h5>
              <div className="text-center text-theme-inv bg-light d-flex justify-content-center" style={{ width: '95%', height: '50vh' }}>
                <canvas ref={radarChartRef} id="radarChart"></canvas>
              </div>
            </MDBCarouselItem>
            <MDBCarouselItem className="w-100 d-flex flex-column justify-content-center align-items-center text-theme-inv" itemId={3}>
              <h5 className="mb-4">MoodBoard de la Semaine</h5>
              <div className="text-theme-inv bg-light" style={{ width: '100%', height: '50vh' }}>
                <canvas ref={barChartRef} id="barChart"></canvas>
              </div>
            </MDBCarouselItem>
          </MDBCarousel>


          {/* Pop-up Questionnaire Quotidien */}
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
                      <input type="range" className="form-range" id="sleepQuality" name="sleepQuality" min="0" max="10" value={formData.sleepQuality} onChange={(e) => handleSliderChange(e.target.value, 'sleepQuality')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="stressLevel" className="form-label">Avez-vous fait du sport aujourd'hui ? (note sur 10)</label>
                      <input type="range" className="form-range" id="stressLevel" name="stressLevel" min="0" max="10" value={formData.stressLevel} onChange={(e) => handleSliderChange(e.target.value, 'stressLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="energyLevel" className="form-label">Notez vos interactions avec des personnes. (note sur 10)</label>
                      <input type="range" className="form-range" id="energyLevel" name="energyLevel" min="0" max="10" value={formData.energyLevel} onChange={(e) => handleSliderChange(e.target.value, 'energyLevel')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="moral" className="form-label">Vous êtes-vous senti anxieux, heureux, ou autre ? (note sur 10)</label>
                      <input type="range" className="form-range" id="moral" name="moral" min="0" max="10" value={formData.moral} onChange={(e) => handleSliderChange(e.target.value, 'moral')} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="additionalActivity" className="form-label">Avez-vous bien mangé aujourd'hui ?</label>
                      <input type="range" className="form-range" id="additionalActivity" name="additionalActivity" min="0" max="10" value={formData.additionalActivity} onChange={(e) => handleSliderChange(e.target.value, 'additionalActivity')} />
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
    </div>
  );
};

export default MoodTracker;

import React, { useState, useEffect, useRef } from 'react';
import {
  MDBContainer,MDBCarousel, MDBCarouselItem, MDBCard, MDBCardBody, MDBRange, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';
import { Modal, Ripple, initMDB } from 'mdb-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
//import axios from 'axios';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
initMDB({ Modal, Ripple });

const MoodTracker = () => {
  const [formData, setFormData] = useState({
    sleepQuality: null,
    stressLevel: null,
    energyLevel: null,
    moral: '',
    additionalActivity: '',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);

  const radarChartRef = useRef(null);
  const chartInstance = useRef(null);

  const handleSliderChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // Just for testing purposes, replace with your submission logic
  };

  useEffect(() => {
    initMDB({ Modal, Ripple });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    //Attributs du graphiques pentagone
    const ctx = radarChartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sommeil', 'Sport', 'Alimentation', 'Social', 'Moral'],
        datasets: [
          {
            label: 'Mood Actuel',
            data: [
              formData.sleepQuality || 5,
              formData.stressLevel || 5,
              formData.energyLevel || 5,
              formData.moral || 5,
              formData.additionalActivity || 5,
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
  }, [formData]);

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center vh-100" style={{ background: 'linear-gradient(#2e006c, #003399)' }}>
      <MDBCard className="w-50">
        <MDBCardBody>
          <form>
            <button type="button" className="btn btn-primary w-100" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#exampleModal">
              Questionnaire Quotidien
            </button>
            
            {/* Caroussel  */}

            <MDBCarousel showIndicators showControls fade>
              {/* Première Caroussel */}
              <MDBCarouselItem
                className="w-100 d-block"
                itemId={1}>

                <h5>Première Slide</h5>
                
                
              </MDBCarouselItem>
              {/* Fin Caroussel 1 */}
              
              {/* Caroussel du MoodBoard Quotidien */}
              <MDBCarouselItem
                className="w-100 d-block"
                itemId={2}>

                <h5>MoodBoard Quotidien</h5>

                <canvas ref={radarChartRef} id="radarChart" style={{ marginTop: '20px', width: '100%', height: '400px' }}></canvas>
              </MDBCarouselItem>
              {/* Fin MoodBoard Quotidien */}

              {/* Troisième Caroussel */}
              <MDBCarouselItem
                className="w-100 d-block"
                itemId={3}>

                <h5>Troisième Slide</h5>

                
              </MDBCarouselItem>
              {/* Fin */}


            </MDBCarousel>
            {/* Fin Caroussel  */}



            {/* Pop-up Questionnaire */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Le rendez-vous quotidien !</h5>
                    <button type="button" className="btn-close" data-mdb-ripple-init data-mdb-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div style={{ padding: '20px' }}>
                      <h3 className="text-center mb-4">Suivi quotidien de l'humeur</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="sleepQuality" className="form-label">Avez-vous bien dormi ? (note sur 10)</label>
                          <MDBRange id="sleepQuality" name="sleepQuality" min="0" max="10" value={formData.sleepQuality} onChange={(e) => handleSliderChange(e.target.value, 'sleepQuality')} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="stressLevel" className="form-label">Avez-vous fait du sport aujourd'hui ? (note sur 10)</label>
                          <MDBRange id="stressLevel" name="stressLevel" min="0" max="10" value={formData.stressLevel} onChange={(e) => handleSliderChange(e.target.value, 'stressLevel')} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="energyLevel" className="form-label">Notez vos intéractions avec des personnes. (note sur 10)</label>
                          <MDBRange id="energyLevel" name="energyLevel" min="0" max="10" value={formData.energyLevel} onChange={(e) => handleSliderChange(e.target.value, 'energyLevel')} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="moral" className="form-label">Vous êtes-vous senti anxieux, heureux, ou autre ? (note sur 10)</label>
                          <MDBRange id="moral" name="moral" min="0" max="10" value={formData.moral} onChange={(e) => handleSliderChange(e.target.value, 'moral')} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="additionalActivity" className="form-label">Avez-vous bien manger aujourd'hui ?</label>
                          <MDBRange id="miam" name="miam" min="0" max="10" value={formData.additionalActivity} onChange={(e) => handleSliderChange(e.target.value, 'additionalActivity')} />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-mdb-ripple-init>Envoyez vos réponses</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Fin Pop-up */}
          </form>

          
          
         
        
        </MDBCardBody>
      </MDBCard>

      <MDBModal show={modalOpen} getOpenState={(e) => setModalOpen(e)} tabIndex="-1">
        <MDBModalDialog centered className="modal-lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Registration Successful</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleModal}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Your registration was successful!</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleModal}>Close</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
};

export default MoodTracker;

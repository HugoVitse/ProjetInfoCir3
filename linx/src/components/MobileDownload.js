import React from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBCarousel,
  MDBCarouselItem,
  MDBRow,
  MDBCol,
  MDBCardImage,
  MDBIcon
} from 'mdb-react-ui-kit';
import Config from '../config.json';


const MobileDownload = () => {

  const handleDownloadAndroid = () => {
    window.location.href = `${Config.scheme}://${Config.urlapi}:${Config.portapi}/downloads/Linx.apk`;
  };

  const handleDownloadIOS = () => {
    window.location.href = `${Config.scheme}://${Config.urlapi}:${Config.portapi}/downloads/Linx.ipa`;
  };

  const images = [
    'https://media.gqmagazine.fr/photos/603e6a8da9360b0585bcbc6a/16:9/w_2560%2Cc_limit/108387402',
    'https://www.fnacspectacles.com/magazine/fileadmin/_processed_/d/4/csm_parc-asterix-attraction_58dfd74118.jpg',
    'https://cdn-europe1.lanmedia.fr/var/europe1/storage/images/europe1/medias-tele/exclusif-les-series-tele-preferes-des-francais-sont-3999594/56169328-1-fre-FR/EXCLUSIF-Les-series-tele-preferes-des-Francais-sont.jpg'
  ];

  const androidImage = 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg';
  const iosImage = 'https://cdn.iconscout.com/icon/free/png-256/free-ios-apple-572947.png?f=webp';

  const advantages = [
    {
      icon: '💡',
      title: 'Facilité d\'utilisation',
      description: 'Interface intuitive pour une expérience utilisateur agréable.'
    },
    {
      icon: '🔒',
      title: 'Sécurité renforcée',
      description: 'Protocoles de sécurité avancés pour protéger vos données personnelles.'
    },
    {
      icon: '⚡',
      title: 'Performance optimisée',
      description: 'Fonctionne rapidement et efficacement sur tous les appareils.'
    }
  ];

  return (
    <MDBContainer fluid className="bg-theme" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2 className='text-theme' style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>Téléchargez notre application mobile</h2>
        <p className='text-muted' style={{ fontSize: '1.2rem' }}>
          Profitez de toutes les fonctionnalités de notre application où que vous soyez !
        </p>
      </div>

      <MDBRow className="justify-content-center" style={{ padding: '20px 0' }}>
        <MDBCol md="8" lg="6">
          <MDBCard className="mb-4 shadow-lg bg-theme-nuance" style={{ borderRadius: '15px' }}>
            <MDBCardBody className="text-center p-5">
              <MDBCarousel showControls interval={5000} className="mb-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                {images.map((image, index) => (
                  <MDBCarouselItem key={index} itemId={index + 1}>
                    <MDBCardImage src={image} className="d-block w-100 carousel-image" alt={`Slide ${index}`} style={{ height: '300px', objectFit: 'cover' }} />
                  </MDBCarouselItem>
                ))}
              </MDBCarousel>

              <MDBRow className="align-items-center mb-4">
                <MDBCol size="12" className="d-flex align-items-center justify-content-center mb-3">
                  <img src={androidImage} alt="Android" style={{ width: '40px', marginRight: '15px' }} />
                  <MDBBtn onClick={handleDownloadAndroid} color="success" className="w-100" style={{ fontSize: '1rem', padding: '10px 20px' }}>
                    <MDBIcon fab icon="android" className="me-2" /> Télécharger pour Android (.apk)
                  </MDBBtn>
                </MDBCol>
                <MDBCol size="12" className="d-flex align-items-center justify-content-center">
                  <img src={iosImage} alt="iOS" style={{ width: '40px', marginRight: '15px' }} />
                  <MDBBtn onClick={handleDownloadIOS} color="primary" className="w-100" style={{ fontSize: '1rem', padding: '10px 20px' }}>
                    <MDBIcon fab icon="apple" className="me-2" /> Télécharger pour iOS (.ipa)
                  </MDBBtn>
                </MDBCol>
              </MDBRow>

              <p className="mb-0 mt-4" style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                Besoin d'aide ? Contactez notre support technique.
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <div className='bg-theme' style={{ padding: '50px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Avantages de notre application</h3>
        </div>
        <MDBRow className="justify-content-center">
          {advantages.map((advantage, index) => (
            <MDBCol key={index} md="4" className="mb-4">
              <div className='bg-theme-nuance' style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{advantage.icon}</div>
                <h5 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>{advantage.title}</h5>
                <p style={{ color: '#7f8c8d' }}>{advantage.description}</p>
              </div>
            </MDBCol>
          ))}
        </MDBRow>
      </div>

      <footer className='bg-theme-nuance text-theme' style={{ padding: '30px 0', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <a href="#!" style={{ margin: '0 10px' }}>Réseaux sociaux</a>
          <a href="#!" style={{ margin: '0 10px' }}>Blog</a>
          <a href="#!" style={{ margin: '0 10px' }}>Conditions d'utilisation</a>
          <a href="#!" style={{ margin: '0 10px' }}>Politique de confidentialité</a>
        </div>
        <div>
          <p style={{ margin: 0 }}>Contactez-nous: support@example.com | +33 123 456 789</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Linx</p>
        </div>
      </footer>
    </MDBContainer>
  );
};

export default MobileDownload;

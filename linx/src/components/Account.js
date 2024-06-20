import React, { useState, useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBListGroupItem, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBInput, MDBCardText, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

const Account = ({ users }) => {
  const { emailurl } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [initialInterests, setInitialInterests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [pp, setPp] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get('jwt');
      try {
        jwtDecode(token);
      } catch {
        navigate('/Login');
      }
    };

    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        console.log('Data received from API:', response.data);
        setEmail(response.data.email || '');
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setDescription(response.data.description || '');
        setSelectedInterests(response.data.activities || []);
        setInitialInterests(response.data.activities || []);
        setProfileImage(response.data.image || null);
        setFriends(response.data.friends || []);
        if (response.data.dateOfBirth) {
          const calculatedAge = calculateAge(new Date(response.data.dateOfBirth));
          setAge(calculatedAge);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [emailurl, navigate]);

  useEffect(() => {
    // Vérifier si emailurl correspond à un utilisateur existant
    const foundUser = users.find(user => user.email === emailurl);
    if (!foundUser) {
      // Rediriger vers la page d'accueil si l'utilisateur n'existe pas
      navigate('/');
    }
  }, [emailurl, navigate, users]);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 200) {
      setDescription(e.target.value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file && file.type === 'image/png') {
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setErrorMessage('');
        setPp(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Veuillez sélectionner un fichier PNG.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (pp) {
        await axios.post('http://localhost/updateInfoWeb', { picture: pp, firstName: firstName, lastName: lastName, selectedInterests: selectedInterests, description: description}, { withCredentials: true });
      } else {
        await axios.post('http://localhost/updateInfoWeb', {picture:"", firstName: firstName, lastName: lastName, selectedInterests: selectedInterests, description: description}, { withCredentials: true });
      }
      console.log(pp, firstName, lastName, selectedInterests, description);
      setInitialInterests(selectedInterests);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveProfile = () => {
    const filteredInterests = selectedInterests.filter(interest => interest.trim() !== '');
    setSelectedInterests(filteredInterests);
    setIsEditing(false);
    handleSubmit();
  };
  
  const handleAddInterest = (interest) => {
    setSelectedInterests([...selectedInterests, interest]);
  };
  
  const handleRemoveInterest = (interest) => {
    const newInterests = selectedInterests.filter(item => item !== interest);
    setSelectedInterests(newInterests);
  };
  
  const interestsList = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse', 'Manga/Anime', 'Séries', 'Échecs',
    'Moto', 'Lecture', 'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées', 'Sortir entre amis',
    'Sport', 'Nourriture', 'La mode'
  ];
  
  const InterestsComponent = ({ interestsList, selectedInterests, isEditing, handleAddInterest, handleRemoveInterest }) => {
    const interestsPerRow = 4;
    const boxWidth = 100 / interestsPerRow - 2 * 10; // Adjusting for margins
  
    return (
      <MDBListGroupItem className="font-italic" style={{ padding: '20px', backgroundColor: 'bg-theme-nuance', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <strong style={{ fontSize: '1.2em', color: 'text-theme' }}>Centres d'intérêts : </strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {interestsList.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            const isInitialSelected = initialInterests.includes(interest);
  
            if (isEditing || isSelected) {
              return (
                <div
                  key={interest}
                  className="interest-item bg-theme-nuance2"
                  style={{
                    flex: `1 1 calc(${boxWidth}% - 20px)`,
                    margin: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => isEditing ? isSelected ? handleRemoveInterest(interest) : handleAddInterest(interest) : null}
                >
                  {isEditing && (
                    <>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ marginRight: '10px' }}
                      />
                      <label>{interest}</label>
                    </>
                  )}
                  {!isEditing && isSelected && (
                    <span style={{ fontWeight: 'bold', color: 'text-theme' }}>{interest}</span>
                  )}
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        <style jsx>{`
          .interest-item:hover {
            transform: scale(1.05);
          }
        `}</style>
      </MDBListGroupItem>
    );
  };
  
  // Composant Account principal
  return (
    <div className="bg-theme text-theme">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard className='bg-theme text-theme'>
              <div className="bg-theme-inv text-theme-inv rounded-top text-white d-flex flex-row" style={{ height: '200px' }}>
                <div className="bgms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <label htmlFor="profile-image">
                    <MDBCardImage 
                      src={isEditing ? profileImage : "http://localhost/"+profileImage || "https://via.placeholder.com/150"}
                      alt="Generic placeholder image" 
                      className=" mb-2 img-thumbnail" 
                      fluid 
                      style={{ width: '150px', height: '150px', objectFit: 'contain', zIndex: '1' }} 
                    />
                  </label>
                  <input
                    id="profile-image"
                    ref={inputRef}
                    type="file"
                    accept="image/png"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {emailurl === email && (isEditing ? (
                    <MDBBtn className='mt-4 custom-btn-primary' onClick={handleSaveProfile} style={{ overflow: 'visible' }}>Sauvegarder</MDBBtn>
                  ) : (
                    <MDBBtn className='mt-4 custom-btn-primary' onClick={handleEditProfile} style={{ overflow: 'visible' }}>Modifier</MDBBtn>
                  ))}
                </div>
  
                {/* Partie Nom/Prénom/Âge */}
                <div className="ms-3" style={{ marginTop: '140px' }}>
                  <MDBTypography tag="h5">
                    {isEditing ? <MDBInput className="mb-2" label="LastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ marginTop: '-20px', color: 'white' }} /> : lastName} {' '}
                    {isEditing ? <MDBInput label="FirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ color: 'white' }} /> : firstName}
                  </MDBTypography>
  
                  <MDBCardText>
                    {age} ans
                  </MDBCardText>
                </div>
              </div>
              {/* Fin */}
  
              <div className="p-4 ">
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5"><strong>253</strong></MDBCardText>
                    <MDBCardText className="small text-muted mb-0"><strong>Events</strong></MDBCardText>
                  </div>
                  <div className=" px-3" style={{color:'red'}}>
                    <Link to="/Friends" className='text-theme'>
                      <MDBCardText className="mb-1 h5"><strong>{friends.length}</strong></MDBCardText>
                      <MDBCardText className="small text-muted mb-0"><strong>Amis</strong></MDBCardText>
                    </Link>
                  </div>
                </div>
              </div>
  
              <MDBCardBody className="p-4">
                {/* Case à propos de moi */}
                <div className="mb-4 bg-theme-nuance text-theme text-center" style={{borderRadius:'25px'}}>
                  <p className="lead fw-normal">À propos de moi</p>
                  <div className="p-2 bg-theme-nuance text-theme" style={{borderRadius:'25px'}}>
                    <hr className='barreHr'/>
                    <MDBCardText className="font-italic">
                      <strong>Description :</strong><br />
                      {isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBCardText>
                    <hr className='barreHr'/>
  
                    {/* Centres d'intérêts */}
                    <InterestsComponent
                      interestsList={interestsList}
                      selectedInterests={selectedInterests}
                      isEditing={isEditing}
                      handleAddInterest={handleAddInterest}
                      handleRemoveInterest={handleRemoveInterest}
                    />
        
                    {/* Fin centres d'intérêts */}
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
  };
  
  export default Account;  
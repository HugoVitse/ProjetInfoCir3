import React, { useState, useRef, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBListGroup, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBListGroupItem, MDBInput, MDBCardText, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [pp, setPp] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get("jwt");
      try {
        jwtDecode(token);
      } catch {
        navigate("/Login");
      }
    };

    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        setEmail(response.data.email || '');
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setDescription(response.data.description || '');
        setSelectedInterests(response.data.activities || []);
        setProfileImage(response.data.image || null);
        if (response.data.dateOfBirth) {
          const calculatedAge = calculateAge(new Date(response.data.dateOfBirth));
          setAge(calculatedAge);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate]);

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
      await axios.post('http://localhost/setPicture', { picture: pp, firstName: firstName, lastName: lastName, selectedInterests: selectedInterests}, { withCredentials: true });
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

  return (
    <div className="bg-theme text-theme">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard className='bg-theme text-theme'>
              <div className="bg-theme-inv text-theme-inv rounded-top text-white d-flex flex-row" style={{ height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <label htmlFor="profile-image">
                    <MDBCardImage 
                      src={profileImage || "https://via.placeholder.com/150"}
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
                  {isEditing ? (
                    <MDBBtn className='mt-4' color="black" onClick={handleSaveProfile} style={{ overflow: 'visible' }}>Save</MDBBtn>
                  ) : (
                    <MDBBtn className='mt-4' color="black" onClick={handleEditProfile} style={{ overflow: 'visible' }}>Edit Profile</MDBBtn>
                  )}
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
                    <MDBCardText className="mb-1 h5">253</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">1026</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">478</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div>
                </div>
              </div>

              <MDBCardBody className="p-4">
                {/* Case à propos de moi */}
                <div className="mb-4 bg-theme text-theme">
                  <p className="lead fw-normal">À propos de moi</p>
                  <div className="p-2 bg-theme text-theme">
                    <MDBCardText className="font-italic">
                      <strong>Description :</strong><br />
                      {isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBCardText>

                    {/* Centres d'intérêts */}
                    <MDBListGroupItem className="font-italic">
                      <strong>Centres d'intérêts : </strong> <br />
                      {interestsList.map(interest => (
                        <li key={interest} style={{ display: 'flex', marginLeft: '35%', alignItems: 'center' }}>
                          {isEditing ? (
                            <div>
                              <input
                                type="checkbox"
                                checked={selectedInterests.includes(interest)}
                                onChange={() => selectedInterests.includes(interest) ? handleRemoveInterest(interest) : handleAddInterest(interest)}
                              />
                              <label>{interest}</label>
                            </div>
                          ) : (
                            selectedInterests.includes(interest) && <span>{interest}</span>
                          )}
                        </li>
                      ))}
                    </MDBListGroupItem>
                    {/* Fin centres d'intérêts */}
                  </div>
                </div>
                <MDBCard className="mb-4 shadow-3 bg-theme">
                  <MDBCardBody>
                    <h2 className="text-center mb-4">Historique des activités</h2>
                    <MDBListGroup flush className="mb-4">
                      {/* Exemple d'élément d'historique des activités */}
                      <MDBListGroupItem className='bg-theme text-theme'>
                        <h5 className="fw-bold">Nom de l'activité</h5>
                        <p>Description de l'activité réalisée.</p>
                        <p className="text-muted">Date: 01/01/2024</p>
                      </MDBListGroupItem>
                      {/* Vous pouvez répéter cet élément pour chaque activité dans l'historique */}
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Account;
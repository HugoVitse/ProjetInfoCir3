import React, { useState, useRef, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBListGroup, MDBListGroupItem, MDBInput } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddImageBtn, setShowAddImageBtn] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get("jwt");
      try {
        jwtDecode(token);
      } catch {
        navigate("/Login");
      }
    }
  
    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        setEmail(response.data.email || '');
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setDescription(response.data.description || '');
        setSelectedInterests(response.data.activities || []);
        setProfileImage(response.data.profileImage || null);
  
        // Calculate and set age
        if (response.data.dateOfBirth) {
          const calculatedAge = calculateAge(new Date(response.data.dateOfBirth));
          setAge(calculatedAge);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
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
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    setShowAddImageBtn(true);
  }

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 200) {
      setDescription(e.target.value);
    }
  }

  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file && file.type === 'image/png') {
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Veuillez sélectionner un fichier PNG.');
    }
  }

  const handleSelectImage = () => {
    inputRef.current.click();
  }

  const handleAddInterest = (interest) => {
    setSelectedInterests([...selectedInterests, interest]);
  }
  
  const handleRemoveInterest = (interest) => {
    const newInterests = selectedInterests.filter(item => item !== interest);
    setSelectedInterests(newInterests);
  }
  
  const handleSaveProfile = () => {
    // Filter out empty or unchecked interests
    const filteredInterests = selectedInterests.filter(interest => interest.trim() !== '');
    setSelectedInterests(filteredInterests);
    setIsEditing(false);
    setShowAddImageBtn(false);
    // Here you can save the profile with updated data including selected interests
  }

  const interestsList = [
    'Cinéma',
    'Attractions',
    'Animaux',
    'Théâtre',
    'Danse',
    'Manga/Anime',
    'Séries',
    'Échecs',
    'Moto',
    'Lecture',
    'Jeux vidéos',
    'Musique',
    'BD/Comics',
    'Voyager',
    'Musées',
    'Sortir entre amis',
    'Sport',
    'Nourriture',
    'La mode'
  ];

  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="8">
          <MDBCard className="mb-4 shadow-3">
            <MDBCardBody>
              <h2 className="text-center mb-4">Mon Compte</h2>
              <MDBRow>
                <MDBCol md="4" className="text-center">
                  <label htmlFor="profile-image">
                    <img
                      src={profileImage || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-3"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
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
                  {showAddImageBtn && (
                    <MDBBtn color="primary" size="sm" className="mb-2" onClick={handleSelectImage}>Modifier Image</MDBBtn>
                  )}
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <h4>{firstName} {lastName}</h4>
                  <p className="text-muted">{email}</p>
                  {isEditing ? (
                    <MDBBtn color="primary" className="mb-2" onClick={handleSaveProfile}>Save</MDBBtn>
                  ) : (
                    <MDBBtn color="primary" className="mb-2" onClick={handleEditProfile}>Edit Profile</MDBBtn>
                  )}
                </MDBCol>
                <MDBCol md="8">
                  <MDBListGroup flush>
                    <MDBListGroupItem>
                      <strong>Nom : </strong>{isEditing ? <MDBInput type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /> : lastName}
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Prénom : </strong>{isEditing ? <MDBInput type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /> : firstName}
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Âge : </strong>{age} ans
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Description : </strong>{isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Gouts : </strong>
                      <ul>
                        {interestsList.map(interest => (
                          <li key={interest} style={{ display: 'flex', alignItems: 'center' }}>
                            {isEditing ? (
                              <div>
                                <input
                                  type="checkbox"
                                  checked={selectedInterests.includes(interest)}
                                  onChange={() => selectedInterests.includes(interest) ? handleRemoveInterest(interest) : handleAddInterest(interest)}
                                />
                                <label style={{ marginLeft: '5px' }}>{interest}</label>
                              </div>
                            ) : (
                              selectedInterests.includes(interest) && <span>{interest}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
          <MDBCard className="mb-4 shadow-3">
            <MDBCardBody>
              <h2 className="text-center mb-4">Historique des activités</h2>
              <MDBListGroup flush className="mb-4">
                {/* Exemple d'élément d'historique des activités */}
                <MDBListGroupItem>
                  <h5 className="fw-bold">Nom de l'activité</h5>
                  <p>Description de l'activité réalisée.</p>
                  <p className="text-muted">Date: 01/01/2024</p>
                </MDBListGroupItem>
                {/* Vous pouvez répéter cet élément pour chaque activité dans l'historique */}
              </MDBListGroup>

              <MDBListGroup flush className="mb-4">
                {/* Exemple d'élément d'historique des activités */}
                <MDBListGroupItem>
                  <h5 className="fw-bold">Nom de l'activité</h5>
                  <p>Description de l'activité réalisée.</p>
                  <p className="text-muted">Date: 01/01/2024</p>
                </MDBListGroupItem>
                {/* Vous pouvez répéter cet élément pour chaque activité dans l'historique */}
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Account;
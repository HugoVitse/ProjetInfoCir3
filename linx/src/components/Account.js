import React, { useState, useRef, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBListGroup, MDBListGroupItem, MDBInput, MDBCardText, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
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
  const [interests, setInterests] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fnc = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });
        setEmail(response.data.email || '');
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setDescription(response.data.description || '');
        setInterests(response.data.activities || []);
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
    fnc();
  }, []);

  const retrieveCookie = () => {
    const token = Cookies.get("jwt");
    try {
      const decodedToken = jwtDecode(token);
    } catch {
      navigate("/Login");
    }
  }

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

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif')) {
        reader.onloadend = () => {
            setProfileImage(reader.result);
            setErrorMessage('');
        };
        reader.readAsDataURL(file);
    } else {
        setErrorMessage('Veuillez sélectionner un fichier PNG, JPEG, JPG ou GIF.');
    }
}

  const handleSelectImage = () => {
    inputRef.current.click();
  }

  const handleAddInterest = () => {
    setInterests([...interests, '']);
  }
  
  const handleInterestChange = (index, value) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  }
  
  const handleRemoveInterest = (index) => {
    const newInterests = interests.filter((_, i) => i !== index);
    setInterests(newInterests);
  }
  
  const handleSaveProfile = () => {
    const filteredInterests = interests.filter(interest => interest.trim() !== '');
    setInterests(filteredInterests);
    setIsEditing(false);
    setShowAddImageBtn(false);
  }

  return (
    <div className="gradient-custom-2" style={{ background: 'linear-gradient(#7C4DFF, #6200EA)' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                <label htmlFor="profile-image">
                    <MDBCardImage src={profileImage || "https://via.placeholder.com/150"}
                    alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1' }} />
                         </label>
                         <input
                             id="profile-image"
                             ref={inputRef}
                             type="file"
                             accept="image/png, image/jpeg, image/jpg, image/gif"
                             style={{ display: 'none' }}
                             onChange={handleImageChange}
                         />
                         {showAddImageBtn && (
                             <MDBBtn color="black" size="sm" onClick={handleSelectImage}>Modifier Image</MDBBtn>
                         )}
                         {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                         {isEditing ? (
                            <MDBBtn color="black" onClick={handleSaveProfile} style={{height: '36px', overflow: 'visible'}}>Save</MDBBtn>
                        ) : (
                            <MDBBtn color="black" onClick={handleEditProfile} style={{height: '36px', overflow: 'visible'}}>Edit Profile</MDBBtn>
                        )}
                 
                  
                </div>

              {/* Partie Nom/Prénom/Âge */}
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">
                    {isEditing ? <MDBInput type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /> : lastName} {isEditing ? <MDBInput type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/> : firstName}
                  </MDBTypography>

                  <MDBCardText>
                    {isEditing ? <MDBInput type="number" value={age} onChange={(e) => setAge(e.target.value)} /> : age} ans
                  </MDBCardText>
                </div>
              {/* Fin */}
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
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

              <MDBCardBody className="text-black p-4">
                {/* Case à propos de moi */}
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">À propos de moi</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>

                    <MDBCardText className="font-italic mb-1">
                      <strong>Description :</strong><br></br>
                      {isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBCardText>

                    {/* Centres d'intérêts */}
                    <MDBListGroupItem className="font-italic mb-0">
                        <strong>Centres d'intérêts : </strong> <br></br>
                        <ul>
                            {isEditing ? (
                                interests.map((interest, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MDBInput
                                            type="text"
                                            value={interest}
                                            onChange={(e) => handleInterestChange(index, e.target.value)}
                                            className="me-2"
                                        />
                                        <MDBBtn color="danger" size="sm" onClick={() => handleRemoveInterest(index)}>Supprimer</MDBBtn>
                                    </li>
                                ))
                            ) : (
                                interests.map((interest, index) => interest.trim() !== '' && <li key={index} className="text-dark">{interest}</li>)
                            )}
                        </ul>
                        {isEditing && (
                            <MDBBtn color="success" size="sm" onClick={handleAddInterest}>Ajouter un goût</MDBBtn>
                        )}
                        
                    </MDBListGroupItem>
                    {/* Fin centres d'intérêts */}
                    {/* Fin à propos de moi */}

                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Historique des événements</MDBCardText>
                  <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>
                </div>
                <MDBRow>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                </MDBRow>
                <MDBRow className="g-2">
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                  <MDBCol className="mb-2">
                    <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                      alt="image 1" className="w-100 rounded-3" />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
    
    // ----------
    // <MDBContainer fluid className="d-flex flex-column align-items-center vh-100" style={{background:'linear-gradient(#7C4DFF, #6200EA)'}}>
    //     <MDBCard className="shadow-3 vh-100" style={{borderRadius:'15px', width: '80%', maxWidth: '600px'}}>
    //         <MDBCardBody style={{background:'linear-gradient(#7C4DFF, #6200EA)'}}>
    //             <MDBRow className="d-flex justify-content-center align-items-center">


                        

  );
}

export default Account;

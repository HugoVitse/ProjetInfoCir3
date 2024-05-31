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
    <MDBContainer fluid className="d-flex flex-column align-items-center vh-100" style={{background:'linear-gradient(#7C4DFF, #6200EA)'}}>
        <MDBCard className="shadow-3 vh-100" style={{borderRadius:'15px', width: '80%', maxWidth: '600px'}}>
            <MDBCardBody style={{background:'linear-gradient(#7C4DFF, #6200EA)'}}>
                <MDBRow className="d-flex justify-content-center align-items-center">
                    {/* Photo de profil */}
                    <MDBCol md="4" className="text-center">
                        <label htmlFor="profile-image">
                            <img
                                src={profileImage || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: '150px', height: '150px' }}
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
                            <MDBBtn color="black" size="sm" onClick={handleSelectImage}>Modifier Image</MDBBtn>
                        )}
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </MDBCol>

                    <MDBCol md="8" className="d-flex flex-column align-items-center">
                        <h4 className='text-light'>{firstName} {lastName}</h4>
                        <p className="text-white-50">{email}</p>
                        {isEditing ? (
                            <MDBBtn color="black" onClick={handleSaveProfile}>Save</MDBBtn>
                        ) : (
                            <MDBBtn color="black" onClick={handleEditProfile}>Edit Profile</MDBBtn>
                        )}
                    </MDBCol>
                </MDBRow>

                <MDBListGroup flush className="text-center mt-4">
                    <MDBListGroupItem className="bg-transparent text-light">
                        <table className="w-100">
                            <tbody>
                                <tr>
                                    <td><strong>Nom : </strong>{isEditing ? <MDBInput type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /> : lastName}</td>
                                    <td><strong>Prénom : </strong>{isEditing ? <MDBInput type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /> : firstName}</td>
                                    <td><strong>Âge : </strong>{isEditing ? <MDBInput type="number" value={age} onChange={(e) => setAge(e.target.value)} /> : age}</td>
                                </tr>
                            </tbody>
                        </table>
                    </MDBListGroupItem>

                    <MDBListGroupItem className="bg-transparent text-light">
                        <strong>Description : </strong>{isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBListGroupItem>

                    <MDBListGroupItem className="bg-transparent text-light">
                        <strong>Gouts : </strong>
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
                                interests.map((interest, index) => interest.trim() !== '' && <li key={index} className="text-light">{interest}</li>)
                            )}
                        </ul>
                        {isEditing && (
                            <MDBBtn color="success" size="sm" onClick={handleAddInterest}>Ajouter un goût</MDBBtn>
                        )}
                    </MDBListGroupItem>
                </MDBListGroup>
            </MDBCardBody>
        </MDBCard>
    </MDBContainer>
  );
}

export default Account;

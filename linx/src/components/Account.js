import React, { useState, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBListGroup, MDBListGroupItem, MDBInput } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddImageBtn, setShowAddImageBtn] = useState(false);
  const [lastName, setLastName] = useState('Doe');
  const [firstName, setFirstName] = useState('John');
  const [age, setAge] = useState(34);
  const [description, setDescription] = useState('Passionné par la technologie et les voyages. Toujours curieux d\'apprendre de nouvelles choses et de rencontrer de nouvelles personnes.');
  const [interests, setInterests] = useState(['Lecture', 'Voyages', 'Musique', 'Sport']);
  const [profileImage, setProfileImage] = useState(null);
  const inputRef = useRef(null);

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
                  <p className="text-muted">johndoe@example.com</p>
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
                      <strong>Âge : </strong>{isEditing ? <MDBInput type="number" value={age} onChange={(e) => setAge(e.target.value)} /> : age}
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Description : </strong>{isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <strong>Gouts : </strong>
                      <ul>
                        {isEditing ? (
                          interests.map((interest, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                              <MDBInput
                                type="text"
                                value={interest}
                                onChange={(e) => handleInterestChange(index, e.target.value)}
                              />
                              <MDBBtn color="danger" size="sm" onClick={() => handleRemoveInterest(index)}>Supprimer</MDBBtn>
                            </li>
                          ))
                        ) : (
                          interests.map((interest, index) => interest.trim() !== '' && <li key={index}>{interest}</li>)
                        )}
                      </ul>
                      {isEditing && (
                        <MDBBtn color="success" size="sm" onClick={handleAddInterest}>Ajouter un goût</MDBBtn>
                      )}
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Account;
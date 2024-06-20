import React, { useState, useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBListGroupItem, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBInput, MDBCardText, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

const Account = () => {
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
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const retrieveCookie = () => {
      try {
        const jwt = Cookies.get("jwt");
        const decodedToken = jwtDecode(jwt);
        setEmail(decodedToken.email);
      } catch {
        navigate('/Login');
      }
    };

    const fetchUsers = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/getAllUsers', { withCredentials: true });

        if (emailurl.length > 0 && response.data.length > 0) {
          const foundUser = response.data.find(user => user.email === emailurl);
          if (!foundUser) {
            navigate('/');
          } else {
            setUsers(foundUser);
            setFirstName(foundUser.firstName || '');
            setLastName(foundUser.lastName || '');
            setDescription(foundUser.description || '');
            setSelectedInterests(foundUser.activities || []);
            setInitialInterests(foundUser.activities || []);
            setProfileImage(foundUser.image || null);
            setFriends(foundUser.friends || []);

            if (foundUser.dateOfBirth) {
              const calculatedAge = calculateAge(new Date(foundUser.dateOfBirth));
              setAge(calculatedAge);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchUsers();
  }, [emailurl, navigate]);

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

    if (file && file.type === 'image/jpeg') {  // Accept only JPEG images
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setErrorMessage('');
        setPp(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Veuillez sélectionner un fichier JPG.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (pp) {
        await axios.post('http://localhost/updateInfoWeb', { picture: pp, firstName, lastName, selectedInterests, description }, { withCredentials: true });
      } else {
        await axios.post('http://localhost/updateInfoWeb', { picture: '', firstName, lastName, selectedInterests, description }, { withCredentials: true });
      }
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFirstName(users.firstName || '');
    setLastName(users.lastName || '');
    setDescription(users.description || '');
    setSelectedInterests(initialInterests || []);
    setProfileImage(users.image || null);
    setPp('');
    setErrorMessage('');
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
      <MDBListGroupItem className="font-italic" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <strong style={{ fontSize: '1.2em', color: '#343a40' }}>Centres d'intérêts : </strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {interestsList.map(interest => {
            const isSelected = selectedInterests.includes(interest);
            const isInitialSelected = initialInterests.includes(interest);

            if (isEditing || isSelected) {
              return (
                <div
                  key={interest}
                  className="interest-item"
                  style={{
                    flex: `1 1 calc(${boxWidth}% - 20px)`,
                    margin: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    backgroundColor: '#ffffff',
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
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>{interest}</span>
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

  return (
    <div className="bg-theme text-theme">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard className='bg-theme text-theme'>
              <div className="bg-theme-inv text-theme-inv rounded-top text-white d-flex flex-row" style={{ height: '200px' }}>
                <div className="ms-4 mt-4 d-flex flex-column" style={{ width: '150px' }}>
                <label htmlFor="profile-image">
                  <div style={{ width: '150px', height: '150px', marginBottom:'20px' }}>
                    <MDBCardImage 
                      src={isEditing ? profileImage : profileImage ? `http://localhost/${profileImage}` : "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="mb-1 img-thumbnail"
                      style={{ width: '150px', height: '150px', objectFit: 'cover', zIndex: '1' }} 
                      fluid 
                    />
                  </div>
                </label>
                {isEditing && (
                  <input
                    id="profile-image"
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                )}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {console.log('emailurl:'+emailurl+'emaile:'+email)}
                {emailurl === email && (isEditing ? (
                  <div className="mt-4 d-flex">
                    <MDBBtn color="black" onClick={handleSaveProfile} style={{ overflow: 'visible', marginRight: '10px' }}>Save</MDBBtn>
                    <MDBBtn color="danger" onClick={handleCancelEdit} style={{ overflow: 'visible' }}>Cancel</MDBBtn>
                  </div>
                ) : (
                  <MDBBtn className='mt-4' color="black" onClick={handleEditProfile} style={{ overflow: 'visible' }}>Edit Profile</MDBBtn>
                ))}
                </div>


                <div className="ms-4" style={{ marginTop: '120px' }}>
                  <MDBTypography tag="h5">
                    {isEditing ? <MDBInput label="LastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ marginTop: '-40px', color: 'white', marginBottom:'10px' }} /> : lastName} {' '}
                    {isEditing ? <MDBInput label="FirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ color: 'white' }} /> : firstName}
                  </MDBTypography>

                  <MDBCardText>
                    {age} ans
                  </MDBCardText>
                </div>
              </div>

              <div className="p-1 ">
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">253</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Events</MDBCardText>
                  </div>
                  <div className="px-3">
                    <Link to="/Friends" style={{ color: '#563d7c' }}>
                      <MDBCardText className="mb-1 h5">{friends.length}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Amis</MDBCardText>
                    </Link>
                  </div>
                </div>
              </div>

              <MDBCardBody className="p-4">
                <div className="mb-4 bg-theme text-theme">
                  <p className="lead fw-normal">À propos de moi</p>
                  <div className="p-2 bg-theme text-theme">
                    <MDBCardText className="font-italic">
                      <strong>Description :</strong><br />
                      {isEditing ? <MDBInput type="textarea" value={description} onChange={handleDescriptionChange} /> : description}
                    </MDBCardText>

                    <InterestsComponent
                      interestsList={interestsList}
                      selectedInterests={selectedInterests}
                      isEditing={isEditing}
                      handleAddInterest={handleAddInterest}
                      handleRemoveInterest={handleRemoveInterest}
                    />
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

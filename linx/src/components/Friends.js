import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBListGroup, MDBInputGroup, MDBListGroupItem, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Config from '../config.json';

const Friends = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState(0);
  const [description, setDescription] = useState('');
  const [friends, setFriends] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get('jwt');
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email);
      } catch {
        navigate('/Login');
      }
    };

    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { withCredentials: true });
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setDescription(response.data.description || '');
        setProfileImage(response.data.image || null);
        setFriends(response.data.friends || []);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`, { withCredentials: true });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    const pollFriends = async () => {
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { withCredentials: true });
        setFriends(response.data.friends || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des amis :', error);
      }
    };

    fetchData();
    fetchUsers();

    const interval = setInterval(pollFriends, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [navigate]);

  const sendFriendRequest = async (friendEmail) => {
    try {
      const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`, { email: friendEmail }, { withCredentials: true });
      if (response.status === 200) {
        setSentFriendRequests(prevRequests => [...prevRequests, friendEmail]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami :', error);
    }
  };

  const removeFriend = async (friendEmail) => {
    try {
      const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/deleteFriend`, { email: friendEmail }, { withCredentials: true });
      if (response.status === 200) {
        setFriends(prevFriends => prevFriends.filter(email => email !== friendEmail));
        console.log("Suppression réussie")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ami :', error);
    }
  };

  const renderUsers = () => {
    let friendsList = [];
    let otherUsersList = [];

    users.forEach(user => {
      if (user.email === email) {
        return;
      }

      if (friends.includes(user.email)) {
        friendsList.push(user);
      } else {
        otherUsersList.push(user);
      }
    });

    const filteredUsers = users.filter(user => {
      if (user.email === email) {
        return false;
      }
      return (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const renderUserList = (userList) => {
      if (userList.length === 0) {
        return (
          <MDBListGroupItem>
            Aucun utilisateur trouvé.
          </MDBListGroupItem>
        );
      }

      return userList.map((user) => (
        <MDBListGroupItem key={user._id} className={friends.includes(user.email) ? 'friend-item' : ''}>
          <div className="d-flex align-items-center">
            <img
              src={`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${user.email}.png`}
              alt={`${user.firstName} ${user.lastName}`}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <div className="m-3">
              <h5>{`${user.firstName} ${user.lastName}`}</h5>
            </div>
            {friends.includes(user.email) && (
              <MDBBtn color="danger" onClick={() => removeFriend(user.email)} className="ms-auto">
                <MDBIcon icon="user-minus" className="me-2" />
                Supprimer l'ami
              </MDBBtn>
            )}
            {!friends.includes(user.email) && !sentFriendRequests.includes(user.email) && (
              <MDBBtn color="primary" onClick={() => sendFriendRequest(user.email)} className="ms-auto">
                <MDBIcon icon="user-plus" className="me-2" />
                Ajouter
              </MDBBtn>
            )}
            {sentFriendRequests.includes(user.email) && !friends.includes(user.email) && (
              <MDBBtn color="secondary" disabled className="ms-auto">
                Demande d'ami envoyée
              </MDBBtn>
            )}
          </div>
        </MDBListGroupItem>
      ));
    };

    return (
      <MDBContainer className="mt-5 p-4" style={{ maxWidth: '800px' }}>
        {/* Page title */}
        <div className="text-center mb-4">
          <h1>Mes Amis</h1>
        </div>

        {/* Search input */}
        <MDBInputGroup className="mb-3">
          <MDBInput
            label="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </MDBInputGroup>

        {/* Friends list */}
        <div className="scrollable-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <MDBListGroup>
            <h3 className="mb-3">Amis</h3>
            {renderUserList(searchTerm ? filteredUsers.filter(user => friends.includes(user.email)) : friendsList)}
          </MDBListGroup>
        </div>

        {/* Other users list */}
        {searchTerm && (
          <div className="scrollable-section" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px' }}>
            <MDBListGroup>
              <h3 className="mb-3">Autres utilisateurs</h3>
              {renderUserList(filteredUsers.filter(user => !friends.includes(user.email) && !sentFriendRequests.includes(user.email)))}
            </MDBListGroup>
          </div>
        )}
      </MDBContainer>
    );
  };

  return (
    <div>
      {/* Back button */}
      <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
        <MDBBtn color="primary" onClick={() => navigate('/Account')}>
          <MDBIcon icon="arrow-left" className="me-2" />
          Retour au profil
        </MDBBtn>
      </div>

      {renderUsers()}
    </div>
  );
};

export default Friends;

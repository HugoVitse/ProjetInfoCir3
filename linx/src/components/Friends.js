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
  const [sentFriendRequests, setSentFriendRequests] = useState([]); // État pour gérer les demandes d'amis envoyées
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

    fetchData();
    fetchUsers();
  }, [navigate]);

  const sendFriendRequest = async (friendEmail) => {
    try {
      const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`, { email: friendEmail }, { withCredentials: true });
      if (response.status === 200) {
        // Mettre à jour localement les demandes d'amis envoyées si l'ajout côté serveur réussit
        setSentFriendRequests(prevRequests => [...prevRequests, friendEmail]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami :', error);
    }
  };

  const renderUsers = () => {
    // Filtrer les amis et les autres utilisateurs
    let friendsList = [];
    let otherUsersList = [];

    users.forEach(user => {
      if (user.email === email) {
        return; // Ne pas afficher l'utilisateur connecté lui-même
      }

      if (friends.includes(user.email)) {
        friendsList.push(user);
      } else {
        otherUsersList.push(user);
      }
    });

    // Filtrer les utilisateurs en fonction du terme de recherche
    const filteredUsers = users.filter(user => {
      if (user.email === email) {
        return false; // Ne pas afficher l'utilisateur connecté lui-même
      }
      return (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Fonction pour rendre une liste d'utilisateurs
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
              src={`http://localhost/${user.profileImage}`}
              alt={`${user.firstName} ${user.lastName}`}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <div className="m-3">
              <h5>{`${user.firstName} ${user.lastName}`}</h5>
              {/* Ajoutez ici d'autres détails de l'utilisateur si nécessaire */}
            </div>
            {!friends.includes(user.email) && !sentFriendRequests.includes(user.email) && (
              <MDBBtn color="primary" onClick={() => sendFriendRequest(user.email)}>
                <MDBIcon icon="user-plus" className="me-2" />
                Ajouter
              </MDBBtn>
            )}
            {sentFriendRequests.includes(user.email) && (
              <MDBBtn color="secondary" disabled>
                Demande d'ami envoyée
              </MDBBtn>
            )}
          </div>
        </MDBListGroupItem>
      ));
    };

    return (
      <MDBContainer className="mt-5">
        <MDBInputGroup className="mb-3">
          <MDBInput
            label="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </MDBInputGroup>

        <MDBListGroup>
          {/* Section pour afficher les amis */}
          <h3>Amis</h3>
          {renderUserList(searchTerm ? filteredUsers.filter(user => friends.includes(user.email)) : friendsList)}

          {/* Section pour afficher les autres utilisateurs */}
          {searchTerm && (
            <>
              <h3>Autres utilisateurs</h3>
              {renderUserList(filteredUsers.filter(user => !friends.includes(user.email)))}
            </>
          )}
        </MDBListGroup>
      </MDBContainer>
    );
  };

  return (
    <div>
      {renderUsers()}
    </div>
  );
};

export default Friends;
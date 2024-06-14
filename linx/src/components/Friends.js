import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBListGroup, MDBInputGroup, MDBListGroupItem, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const navigate = useNavigate();

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
        setEmail(response.data.email || '');
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
        const response = await axios.get('http://localhost/getAllUsers', { withCredentials: true });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchData();
    fetchUsers();
  }, [navigate]);

  const addFriend = async (email) => {
    try {
      const response = await axios.post('http://localhost/addFriend', { email }, { withCredentials: true });
      if (response.status === 200) {
        // Mettre à jour localement la liste des amis si l'ajout côté serveur réussit
        setFriends(prevFriends => [...prevFriends, email]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ami :', error);
    }
  };

  const renderUsers = () => {
    // Filtrer les amis et les autres utilisateurs
    let friendsList = [];
    let otherUsersList = [];

    users.forEach(user => {
      if (friends.includes(user.email)) {
        friendsList.push(user);
      } else {
        otherUsersList.push(user);
      }
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
        <MDBListGroupItem key={user._id}>
          <div className="d-flex align-items-center">
            <img
              src={`http://localhost/${user.profileImage}`}
              alt={`${user.firstName} ${user.lastName}`}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <div className="ms-3">
              <h5>{`${user.firstName} ${user.lastName}`}</h5>
              {/* Ajoutez ici d'autres détails de l'utilisateur si nécessaire */}
            </div>
            {!friends.includes(user.email) && (
              <MDBBtn color="primary" onClick={() => addFriend(user.email)}>
                Ajouter
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
          {renderUserList(friendsList)}

          {/* Section pour afficher les autres utilisateurs */}
          <h3>Autres utilisateurs</h3>
          {renderUserList(otherUsersList)}
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

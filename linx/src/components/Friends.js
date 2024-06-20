import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBListGroup, MDBInputGroup, MDBListGroupItem, MDBInput, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Config from '../config.json';


const Friends = () => {
  const { emailurl } = useParams();
  const [friends, setFriends] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [sentFriendRequests, setSentFriendRequests] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    const retrieveCookie = () => {
      try {
        const jwt = Cookies.get('jwt');
        const decodedToken = jwtDecode(jwt);
        setEmail(decodedToken.email);
      } catch {
        navigate('/Login');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`, { withCredentials: true });
        setUsers(response.data || []);

        const use = response.data.filter(user => user.email === emailurl);        
        const friend = [];

        // Vérifiez que use[0] est bien un objet
        if (use[0] && typeof use[0] === 'object') {
          // Accédez à la propriété friends
          const friends = use[0].friends;

          if (Array.isArray(friends)) {
            friends.forEach(friendEmail => {
              if (friendEmail !== emailurl) {
                friend.push(friendEmail);
              }
            });
          }
        }
        setFriends(friend);

      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    retrieveCookie();
    fetchUsers();


  }, [friends, navigate]);

  const sendFriendRequest = async (friendEmail) => {
    console.log(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`, { email: friendEmail })
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
      if (user.email === emailurl) {
        return;
      }

      if (friends.includes(user.email)) {
        friendsList.push(user);
      } else {
        const _usr = users.find((usr)=>usr.email==user.email)
        
        if(Object.keys(_usr).includes('friendRequests')){
          if(!_usr.friendRequests.includes(emailurl) ){
            otherUsersList.push(user);
          }
        }
      
      }
    });

    const filteredUsers = users.filter(user => {
      if (user.email === emailurl) {
        return false;
      }
      return (
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });



    const filteredOtherUsers = otherUsersList.filter(user => {
      if (user.email === emailurl) {
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
            {emailurl === email && (
              <>
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
              </>
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
              {renderUserList(filteredOtherUsers)}
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
        <MDBBtn color="primary" onClick={() => navigate(`/Account/${encodeURIComponent(emailurl)}`)}>
          <MDBIcon icon="arrow-left" className="me-2" />
          Retour au profil
        </MDBBtn>
      </div>

      {renderUsers()}
    </div>
  );
};

export default Friends;
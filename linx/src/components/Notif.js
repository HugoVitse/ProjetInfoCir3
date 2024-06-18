import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import axios from 'axios';
import Config from '../config.json';

const Notif = ({ updateNotificationStatus }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const jwt = Cookies.get("jwt");
    try {
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { headers: { Cookie: `jwt=${jwt}` }, withCredentials: true });
      console.log('Data received from API:', response.data);
      setFriendRequests(response.data.friendRequests || []);
      updateNotificationStatus(response.data.friendRequests && response.data.friendRequests.length > 0);
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

  useEffect(() => {
    fetchData();
    fetchUsers();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [updateNotificationStatus]);

  const acceptFriendRequest = async (email) => {
    const data = { email: email };
    const jwt = Cookies.get("jwt");

    try {
      await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/acceptFriendRequest`, data, { headers: { Cookie: `jwt=${jwt}` }, withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (email) => {
    const data = { email: email };
    const jwt = Cookies.get("jwt");

    try {
      await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/rejectFriendRequest`, data, { headers: { Cookie: `jwt=${jwt}` }, withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const getUserDetails = (email) => {
    return users.find(user => user.email === email) || {};
  };

  return (
    <div className="bg-theme text-theme vh-100">
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center">
          <MDBCol lg="9" xl="7">
            <MDBCard className="bg-light text-dark" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <MDBCardBody className="p-4">
                <h2 className="text-center mb-4">Notifications</h2>
                <hr />
                <br></br>
                <h4 className='center'><i class="far fa-envelope"></i> Vous avez {friendRequests.length} {friendRequests.length === 1 ? 'notification' : 'notifications'}</h4>
                {friendRequests.length === 0 ? (
                  <p className="text-center">Aucune nouvelle notification</p>
                ) : (
                  friendRequests.map((request, index) => {
                    const userDetails = getUserDetails(request);
                    return (
                      <div key={index} className="mb-3 d-flex align-items-center" style={{backgroundColor:'white', borderRadius:'15px', margin:'5%', padding:'2%'}}>
                        {userDetails.profileImage && (
                          <img
                            src={`http://localhost/${userDetails.profileImage}`}
                            alt={`${userDetails.firstName} ${userDetails.lastName}`}
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        )}
                        <div className="ms-3">
                          <p className="mb-0"><strong>{`${userDetails.firstName} ${userDetails.lastName}`}</strong></p>
                          <p className="text-muted mb-0">{request}</p>
                        </div>
                        <MDBBtn onClick={() => acceptFriendRequest(request)} className="ms-auto custom-btn-primary">Accepter</MDBBtn>
                        <MDBBtn onClick={() => rejectFriendRequest(request)} className="ms-2 custom-btn-secondary w-1"><i className="fas fa-xmark"></i></MDBBtn>
                      </div>
                    );
                  })
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Notif;

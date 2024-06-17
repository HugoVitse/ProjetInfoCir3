import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import axios from 'axios';
import Config from '../config.json';

const Notif = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRequestListComp, setFriendRequestListComp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const jwt = Cookies.get("jwt");
      try {
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { headers: { Cookie: `jwt=${jwt}` }, withCredentials: true });
        console.log('Data received from API:', response.data);
        // Manipulate response data as needed and set state
        setFriendRequests(response.data.friendRequests || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const acceptFriendRequest = async (email) => {
    const data = {
      email: email
    };

    const jwt = Cookies.get("jwt");

    try {
      const rep = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/acceptFriendRequest`, data, { headers: { Cookie: `jwt=${jwt}` }, withCredentials: true });
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`, { withCredentials: true });
      setFriendRequests(response.data.friendRequests || []);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div className="bg-theme text-theme">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard className='bg-theme text-theme'>
              {/* Your JSX content here */}
              <MDBCardBody className="p-4">
                {/* Example: Rendering friend requests */}
                {friendRequests.map((request, index) => (
                  <div key={index}>
                    <p>{request}</p>
                    <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                  </div>
                ))}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Notif;

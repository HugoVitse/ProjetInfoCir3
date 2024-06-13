import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
  MDBTypography, MDBBtn, MDBInput, MDBBadge, MDBAvatar
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messagerie = () => {
  const navigate = useNavigate();
  const { activityName, idEvent } = useParams();  
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pp, setpp] = useState('');

  const updateMessageTypes = (messages, email) => {
    return messages.map(message => ({
      ...message,
      type: message.sender === email ? 'sent' : 'received'
    }));
  };

  const retrieveCookie = () => {
    const token = Cookies.get("jwt");
    try {
      jwtDecode(token);
    } catch {
      navigate("/Login");
    }
  };

  const getUserInfo = async (messages) => {
    try {
      
      const response = await axios.get('http://localhost/getInfosemail/' +email, { withCredentials: true });
      setFirstName(response.data.firstName || '');
      setLastName(response.data.lastName || '');
      setpp(response.data.image || '');
    } catch (error) {
      console.error(`Error fetching user info for ${email}:`, error);
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get(`http://localhost/getMessage/${idEvent}`, { withCredentials: true });
        const updatedMessages = updateMessageTypes(response.data.messages, email);
        const userInfoMap = {};
        for (const message of updatedMessages) {
          if (!userInfoMap[message.sender]) {
            userInfoMap[message.sender] = await getUserInfo(message.sender);
          }
        }
        setUserInfo(userInfoMap);
        setMessages(updatedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    getInfo();
    fetchData();
  }, [navigate]);

  const requete = async (updatedMessages) => {
    try {
      await axios.post('http://localhost/setMessagerie', { id: idEvent, messages: updatedMessages }, { withCredentials: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { text: newMessage, sender: email, type: 'sent' }];
      setMessages(updatedMessages);
      setNewMessage('');
      requete(updatedMessages);
      window.location.reload();
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard className="my-5">
            <MDBCardBody>
              <MDBTypography tag="h4" className="text-center mb-4">
                Messagerie - {decodeURIComponent(activityName)}
              </MDBTypography>
              <div className="message-list" style={{ height: '400px', overflowY: 'scroll', marginBottom: '20px' }}>
                {messages.map((message, index) => (
                  <MDBCardText key={index} className={`message ${message.type === 'sent' ? 'text-end' : 'text-start'}`}>
                    <MDBAvatar className="d-inline-block" src={userInfo[message.sender]?.image} alt="avatar" circle />
                    <div className="d-inline-block ml-3">
                      <MDBBadge color={message.type === 'sent' ? 'info' : 'warning'}>
                        {message.text}
                      </MDBBadge>
                      <div>
                        {userInfo[message.sender]?.firstName} {userInfo[message.sender]?.lastName}
                      </div>
                    </div>
                  </MDBCardText>
                ))}
              </div>
              <div className="input-group">
                <MDBInput
                  label="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <MDBBtn color="primary" onClick={handleSendMessage}>Send</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Messagerie;

import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem,
  MDBTypography, MDBBtn, MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import from 'jwt-decode' instead of 'jwt-decode'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messagerie = () => {
  const navigate = useNavigate();
  const { activityName, idEvent } = useParams();
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const retrieveCookie = () => {
    const token = Cookies.get('jwt');
    try {
      const decodedToken = jwtDecode(token);
      setEmail(decodedToken.email);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/Login');
    }
  };

  const getUserInfo = async (email) => {
    try {
      const response = await axios.get(`http://localhost/getInfosEmail/${email}`, { withCredentials: true });
      return {
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        pp: response.data.image || ''
      };
    } catch (error) {
      console.error(`Error fetching user info for ${email}:`, error);
      return {};
    }
  };

  const updateMessageTypes = (messages, email) => {
    return messages.map(message => ({
      ...message,
      type: message.sender === email ? 'sent' : 'received'
    }));
  };

  const setChatWithUserInfo = async (messages, email) => {
    const updatedMessages = updateMessageTypes(messages, email);
    const chatWithUserInfo = [];

    for (const message of updatedMessages) {
      const user = await getUserInfo(message.sender); // Fetch user info for each message sender
      chatWithUserInfo.push({
        ...message,
        fn: user.firstName,
        ln: user.lastName,
        pp: user.pp
      });
    }

    return chatWithUserInfo;
  };

  useEffect(() => {
    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get(`http://localhost/getMessage/${idEvent}`, { withCredentials: true });
        const updatedMessages = updateMessageTypes(response.data.messages, email);
        const chatWithUserInfo = await setChatWithUserInfo(updatedMessages, email);
        setMessages(updatedMessages);
        setChat(chatWithUserInfo);

        setUserInfo(
          await Promise.all(
            response.data.participants.map(async participant => {
              const userInfo = await getUserInfo(participant);
              return {
                email: participant,
                userInfo: {
                  firstName: userInfo.firstName,
                  lastName: userInfo.lastName,
                  pp: userInfo.pp
                }
              };
            })
          )
        );

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [email, idEvent]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { text: newMessage, sender: email, type: 'sent' }];
      setMessages(updatedMessages);
      setNewMessage('');
      try {
        await axios.post('http://localhost/setMessagerie', { id: idEvent, messages: updatedMessages }, { withCredentials: true });
        window.location.reload();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard className="mt-3 mb-0" style={{ maxHeight: '100vh' }}>
            <MDBTypography tag="h4" className="text-center mb-4 mt-4">
              Messagerie - {decodeURIComponent(activityName)}
            </MDBTypography>
            <MDBCardBody style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
              <div className="message-list" style={{ marginBottom: '20px' }}>
                {chat.map((message, index) => (
                  <MDBCardText key={index} className={`message ${message.type === 'sent' ? 'text-end' : 'text-start'}`}>
                    <div className={`d-flex align-items-center ${message.type === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                      {message.type === 'received' && (
                        <img
                          src={`http://localhost/${message.pp}`}
                          alt={`${message.fn}'s profile`}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                        />
                      )}
                      <div className={`message-bubble ${message.type === 'sent' ? 'bg-primary text-white' : 'bg-light text-dark'} p-2 rounded`} style={{ maxWidth: '70%' }}>
                        <div className="message-content">
                          <strong>{message.fn} {message.ln}</strong>
                          <p className="mb-0">{message.text}</p>
                        </div>
                      </div>
                      {message.type === 'sent' && (
                        <img
                          src={`http://localhost/${message.pp}`}
                          alt={`${message.fn}'s profile`}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '10px' }}
                        />
                      )}
                    </div>
                  </MDBCardText>
                ))}
              </div>
            </MDBCardBody>
            <div className="input-group mt-3 mb-3">
              <MDBInput
                label="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <MDBBtn color="primary" onClick={sendMessage}>Send</MDBBtn>
            </div>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4">
          <MDBCard className="my-5">
            <MDBCardBody>
              <MDBTypography tag="h4" className="text-center mt-4 mb-4">
                Participants
              </MDBTypography>
              <MDBListGroup light className='mb-4'>
                <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                  {userInfo ? (
                    userInfo.map((info, index) => (
                      <div key={index} className='d-flex align-items-center'>
                        <img
                          src={`http://localhost/${info.userInfo.pp}`}
                          alt={`${info.userInfo.firstName}'s profile`}
                          style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                          className='me-3'
                        />
                        <div>
                          <p className='fw-bold mb-1'>{info.userInfo.firstName} {info.userInfo.lastName}</p>
                          <p className='text-muted mb-0'>{info.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <li>No users available</li>
                  )}
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Messagerie;

import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
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
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center">
        <MDBCol md="8">
          <MDBCard className="mt-3 mb-0" style={{maxHeight: '100vh'}}>
            <MDBTypography tag="h4" className="text-center mb-4 mt-4">
                Messagerie - {decodeURIComponent(activityName)}
            </MDBTypography>
            <MDBCardBody style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
              <div className="message-list" style={{marginBottom: '20px' }}>
                {chat.map((message, index) => (
                  <MDBCardText key={index} className={`message ${message.type === 'sent' ? 'text-end' : 'text-start'}`}>
                    <div>
                      <img src={"http://localhost/"+message.pp} alt={`${message.fn}'s profile`} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px' }} />
                      <strong>{message.fn} {message.ln}</strong>: {message.text}
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
                Users
              </MDBTypography>
              <ul className="list-unstyled">
                {userInfo ? (
                  userInfo.map((info, index) => (
                    <li key={index}>
                      <img
                        src={`http://localhost/${info.userInfo.pp}`}
                        alt={`${info.userInfo.firstName}'s profile`}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                      />
                      <strong>{info.email}</strong> - {info.userInfo.firstName} {info.userInfo.lastName}
                    </li>
                  ))
                ) : (
                  <li>No users available</li>
                )}
              </ul>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Messagerie;

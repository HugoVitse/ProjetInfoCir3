import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem,
  MDBTypography, MDBBtn, MDBInput
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
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const retrieveCookie = () => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/Login');
      }
    } else {
      navigate('/Login');
    }
  };

  const getUserInfo = async (email) => {
    try {
      const response = await axios.get(`http://localhost/getAllUsers`, { withCredentials: true });
      const usr = response.data.find(user => user.email === email);
      if (usr) {
        return {
          firstName: usr.firstName || '',
          lastName: usr.lastName || '',
          pp: `profile_pictures/${usr.email}.png` || ''
        };
      }
      return {};
    } catch (error) {
      console.error(`Error fetching user info for ${email}:`, error);
      return {};
    }
  };

  const setChatWithUserInfo = async (messages) => {
    const chatWithUserInfo = await Promise.all(messages.map(async (message) => {
      const user = await getUserInfo(message.author);
      return {
        ...message,
        fn: user.firstName,
        ln: user.lastName,
        pp: user.pp
      };
    }));
    return chatWithUserInfo;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      retrieveCookie();
      if (email) {
        try {
          setTimeout(async() => {
            const response = await axios.get(`http://localhost/getMessage/${idEvent}`, { withCredentials: true });
            const chatWithUserInfo = await setChatWithUserInfo(response.data);
            setChat(chatWithUserInfo);
          }, 1500);

          const responses = await axios.get(`http://localhost/getEvents`, { withCredentials: true });
          const usr = responses.data.find(activite => activite.activity.title === decodeURIComponent(activityName));
          console.log(usr);

          const userInfoList = await Promise.all(usr.participants.map(async (participant) => {
            const userInfo = await getUserInfo(participant);
            return {
              email: participant,
              userInfo: {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                pp: userInfo.pp
              }
            };
          }));

          setUserInfo(userInfoList);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [email, chat]);

  const sendMessage = async () => {
    if (newMessage.trim()){
      try {
        await axios.post('http://localhost/sendMessage', {id: idEvent, message: newMessage}, { withCredentials: true });
        const updatedMessages = [...messages, {author: email, message: newMessage }];
        setMessages(updatedMessages);
        setNewMessage('');
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
                  <MDBCardText key={index} className={`message ${message.author === email ? 'text-end' : 'text-start'}`}>
                    <div className={`d-flex align-items-center ${message.author === email ? 'justify-content-end' : 'justify-content-start'}`}>
                      {message.author !== email && (
                        <a href={`/Account/${encodeURIComponent(message.author)}`}>
                          <img
                            src={`http://localhost/${message.pp}`}
                            alt={`${message.fn}'s profile`}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                          />
                        </a>
                      )}
                      <div className={`message-bubble ${message.author === email ? 'bg-primary text-white' : 'bg-light text-dark'} p-2 rounded`} style={{ maxWidth: '70%' }}>
                        <div className="message-content">
                          <strong>{message.fn} {message.ln}</strong>
                          <p className="mb-0">{message.message}</p>
                        </div>
                      </div>
                      {message.author === email && (
                        <a href={`/Account/${encodeURIComponent(message.author)}`}>
                          <img
                            src={`http://localhost/${message.pp}`}
                            alt={`${message.fn}'s profile`}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '10px' }}
                          />
                        </a>
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
                {userInfo.length > 0 ? (
                  userInfo.map((info, index) => (
                    <MDBListGroupItem key={index} className='d-flex justify-content-between align-items-center'>
                      <div className='d-flex align-items-center'>
                        <a href={`/Account/${encodeURIComponent(info.email)}`}>
                          <img
                            src={`http://localhost/${info.userInfo.pp}`}
                            alt={`${info.userInfo.firstName}'s profile`}
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                            className='me-3'
                          />
                        </a>
                        <div>
                          <p className='fw-bold mb-1'>{info.userInfo.firstName} {info.userInfo.lastName}</p>
                          <p className='text-muted mb-0'>{info.email}</p>
                        </div>
                      </div>
                    </MDBListGroupItem>
                  ))
                ) : (
                  <MDBListGroupItem>No users available</MDBListGroupItem>
                )}
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Messagerie;

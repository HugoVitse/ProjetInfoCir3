import React, { useState, useEffect, useRef } from 'react';
import {
  MDBContainer, MDBRow, MDBInputGroup, MDBCol, MDBCard, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem,
  MDBTypography, MDBBtn, MDBInput
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import Config from '../config.json';
import MobileDownload from './MobileDownload';
import { UserAgent } from "react-useragent";
import pusher from './pusherConfig';


const Messagerie = () => {
  const navigate = useNavigate();
  const { activityName, idEvent } = useParams();
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [lastMessageIndex, setLastMessageIndex] = useState(-1); // Indice du dernier message ajouté
  const messageEndRef = useRef(null);

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
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`, { withCredentials: true });

      const usr = response.data.find(user => user.email === email);
      if (usr) {
        return {
          firstName: usr.firstName || '',
          lastName: usr.lastName || '',
          pp: usr.image || ''
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
    if(idEvent.length > 0){
      const fetchData = async () => {
        retrieveCookie();
  
          try {
            const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMessage/${idEvent}`, { withCredentials: true });
            const chatWithUserInfo = await setChatWithUserInfo(response.data.chat);
            setChat(chatWithUserInfo);
  
           
            const userInfoList = await Promise.all(response.data.participants.map(async (participant) => {
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
        
      };
  
      fetchData();
  
      const channel = pusher.subscribe(idEvent);
      channel.bind('my-event', async (data) => {
        console.log('Received event with data:', data);
        const chatWithUserInfo = await setChatWithUserInfo(data);
        setChat(chatWithUserInfo);
      });
  
      return () => {
        pusher.unsubscribe(idEvent);
      };
    }
    
  }, [idEvent]);

  useEffect(() => {
    // Scroll automatique seulement si le dernier message a changé
    if (lastMessageIndex !== chat.length - 1) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setLastMessageIndex(chat.length - 1);
    }
  }, [chat, lastMessageIndex]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/sendMessage`, { id: idEvent, message: newMessage }, { withCredentials: true });
        const updatedMessages = [...messages, { author: email, message: newMessage }];
        setMessages(updatedMessages);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <UserAgent>
    {({ ua }) => {
      return ua.mobile ? <MobileDownload /> :
      
    <MDBContainer fluid className="bg-theme py-4 px-lg-5" style={{ minHeight: '100vh' }}>
      <MDBRow className="justify-content-center">
        <MDBCol md="8" lg="9">
          <MDBCard className="bg-theme-nuance shadow-sm rounded mb-4">
            <MDBCardBody className="bg-theme-nuance p-4">
              <MDBTypography tag="h4" className="text-theme text-center mb-4" style={{ fontWeight: 'bold'}}>
                Messagerie - {decodeURIComponent(activityName)}
              </MDBTypography>
              <div className="bg-theme-nuance2 message-list p-3" style={{ maxHeight: '60vh', overflowY: 'auto', borderRadius: '10px' }}>
                {chat.map((message, index) => (
                  <MDBCardText key={index} className={`message ${message.author === email ? 'text-end' : 'text-start'}`} style={{ marginBottom: '10px' }}>
                    <div className={`d-flex align-items-center ${message.author === email ? 'justify-content-end' : 'justify-content-start'}`}>
                      {message.author !== email && (
                        <a href={`/Account/${encodeURIComponent(message.author)}`}>
                          <img
                            src={`${Config.scheme}://${Config.urlapi}/${message.pp}`}
                            alt={`${message.fn}'s profile`}
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                            className="profile-img me-2"
                          />
                        </a>
                      )}
                      <div className={`message-bubble ${message.author === email ? 'bg-primary text-white' : 'bg-light text-dark'} p-3`} style={{ borderRadius: '15px', maxWidth: '70%' }}>
                        <div className="message-content">
                          <strong>{message.fn} {message.ln}</strong>
                          <p className="mb-0">{message.message}</p>
                        </div>
                      </div>
                      {message.author === email && (
                        <a href={`/Account/${encodeURIComponent(message.author)}`}>
                          <img
                            src={`${Config.scheme}://${Config.urlapi}/${message.pp}`}
                            alt={`${message.fn}'s profile`}
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                            className="profile-img ms-2"
                          />
                        </a>
                      )}
                    </div>
                  </MDBCardText>
                ))}
                <div ref={messageEndRef} />
              </div>
              <div className="input-group mt-3">
                <MDBInputGroup className="bg-light mb-3" style={{ borderRadius: '35px', overflow: 'hidden', border: 'none' }}>
                  <MDBInput
                    label="Ecrivez votre message ici..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}

                    style={{ borderRadius: '35px', border: 'none' }}
                  />
                </MDBInputGroup>
                <MDBBtn className='text-theme' onClick={sendMessage} style={{ borderRadius: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><i class="far fa-paper-plane"></i></MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" lg="3">
          <MDBCard className=" bg-theme-nuance shadow-sm rounded h-100 mb-4">
            <MDBCardBody className="p-4">
              <MDBTypography tag="h4" className=" text-theme text-center mb-4" style={{ fontWeight: 'bold' }}>
                Participants
              </MDBTypography>
              <hr className='barreHr' />
              <p className='text-theme'><strong><u>Nombre de participants :</u> {userInfo.length}</strong></p>
              <MDBListGroup light className='mb-4'>
                {userInfo.length > 0 ? (
                  userInfo.map((info, index) => (
                    <MDBListGroupItem key={index} className='text-theme bg-theme-nuance2 d-flex justify-content-between align-items-center rounded mb-3' style={{border:'none'}}>
                      <a href={`/Account/${encodeURIComponent(info.email)}`}>
                        <img
                          src={`${Config.scheme}://${Config.urlapi}/${info.userInfo.pp}`}
                          alt={`${info.userInfo.firstName}'s profile`}
                          style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                          className="profile-img me-3"
                        />
                      </a>
                      <div>
                        <p className='fw-bold mb-1' style={{marginRight:'20px'}}>{info.userInfo.firstName} {info.userInfo.lastName}</p>
                      </div>
                    </MDBListGroupItem>
                  ))
                ) : (
                  <MDBListGroupItem className='text-theme text-center rounded'>No users available</MDBListGroupItem>
                )}
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    }}
    </UserAgent>
  );
};

export default Messagerie;
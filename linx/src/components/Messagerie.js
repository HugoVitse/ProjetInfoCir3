import React, { useState, useEffect } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
  MDBTypography, MDBBtn, MDBInput, MDBBadge
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messagerie = () => {
  const navigate = useNavigate();
  const { activityName } = useParams();  
  const { idEvent } = useParams();
  const [email, setemail] = useState("");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const retrieveCookie = () => {
    const token = Cookies.get("jwt");
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setemail(decodedToken.email);
    } catch {
      navigate("/Login");
    }
  };

  useEffect(() => {
    const fnc = async () => {
      retrieveCookie();
      try {
        const messArray = [];
        const response = await axios.get('http://localhost/getMessagerie/'+idEvent, { withCredentials: true });
        response.data.messages.forEach((data, i) => {
          messArray.push(data.date);          
        });
        setMessages(messArray);
        console.log(messArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fnc();
  }, [messages]);

  const handleSendMessage = async() => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: email, type: 'sent' }]);
      setNewMessage('');
    }
    await axios.post('http://localhost/setMessagerie', { id : idEvent, messages: messages}, { withCredentials: true });
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
                    <MDBBadge color={message.type === 'sent' ? 'info' : 'warning'}>{message.text}</MDBBadge>
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
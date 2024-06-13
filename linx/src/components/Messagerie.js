import React, { useState } from 'react';
import {
  MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText,
  MDBTypography, MDBBtn, MDBInput, MDBBadge
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useParams } from 'react-router-dom';

const Messagerie = () => {
  const { activityName } = useParams();  // Récupérer le nom de l'activité depuis l'URL
  const [messages, setMessages] = useState([
    { text: 'Hello! How are you?', type: 'received' },
    { text: 'I am good, thank you! How about you?', type: 'sent' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, type: 'sent' }]);
      setNewMessage('');
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

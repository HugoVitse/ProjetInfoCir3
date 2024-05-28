import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBInput, MDBBtn, MDBCardImage } from 'mdb-react-ui-kit';
import ReactStars from 'react-rating-stars-component';

const Activite = () => {
    const location = useLocation();
    const { cardTitle, cardDescription, cardImg } = location.state || {};
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
  
    

    const handleCommentChange = (e) => setComment(e.target.value);
    const handleRatingChange = (newRating) => setRating(newRating);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment && rating) {
            const now = new Date();
            const newComment = {
                text: comment,
                rating,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
            };
            setComments([...comments, newComment]);
            setComment('');
            setRating(0);
        }

    };

    return (
        <MDBContainer>
            <h1>Activité</h1>
            <MDBCard className='mb-4'>
                <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDBCardImage
                        src={cardImg}
                        alt='...'
                        position='top'
                        style={{ maxWidth: '50%', maxHeight: '50%', objectFit: 'cover' }}
                    />
                    <MDBCardTitle>{cardTitle}</MDBCardTitle>
                    <MDBCardText style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                        {cardDescription}
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>

            <MDBCard className='mb-4'>
                <MDBCardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MDBCardTitle>Laisser un avis</MDBCardTitle>
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <ReactStars
                            count={5}
                            onChange={handleRatingChange}
                            size={24}
                            activeColor="#ffd700"
                            value={rating}
                        />
                    </div>
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <MDBInput
                            type="textarea"
                            label="Commentaire"
                            value={comment}
                            onChange={handleCommentChange}
                            required
                            style={{ width: '80%' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <MDBBtn type="submit">Soumettre</MDBBtn>
                        </div>
                    </form>
                </MDBCardBody>
            </MDBCard>

            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle>Avis des utilisateurs</MDBCardTitle>
                    {comments.length === 0 ? (
                        <MDBCardText>Aucun avis pour le moment.</MDBCardText>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index}>
                                <MDBCardText><span style={{ textDecoration: 'underline' }}>Commentaire:</span> {comment.text}</MDBCardText>
                                <MDBCardText>Note:
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        activeColor="#ffd700"
                                        value={comment.rating}
                                        edit={false}
                                    />
                                </MDBCardText>
                                <MDBCardText>Date: {comment.date}, {comment.time}</MDBCardText>
                                <hr />
                            </div>
                        ))
                    )}
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default Activite;
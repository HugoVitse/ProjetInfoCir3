import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
  };

  const tileContent = ({}) => {
    const randomNum = 0;
    const backgroundColor ='';
    
    if (randomNum > 5) {
        const backgroundColor = 'green';
    } else if (randomNum > 0) {
        const backgroundColor = 'red';
    }
    return (
      <div style={{ backgroundColor, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ color: 'black'}}>{randomNum}/10</span>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '100%', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom:'20px' }}>Calendrier</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Calendar
          onChange={onChange}
          value={date}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default MyCalendar;

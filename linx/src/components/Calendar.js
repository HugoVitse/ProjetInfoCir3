import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyCalendar = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [moy, setMoy] = useState([]);

  function decomposerDate(dateString) {
    var dateArray = dateString.split("-");
    var annee = parseInt(dateArray[2], 10);
    var mois = parseInt(dateArray[1], 10);
    var jour = parseInt(dateArray[0], 10);
    
    return {
        jour: jour,
        mois: mois,
        annee: annee
    };
  }

  useEffect(() => {
    const retrieveCookie = () => {
      const token = Cookies.get("jwt");
      try {
        jwtDecode(token);
      } catch {
        navigate("/");
      }
    };

    retrieveCookie();

    const fetchData = async () => {
      retrieveCookie();
      try {
        const response = await axios.get('http://localhost/infos', { withCredentials: true });

        const yearsArray = [];
        const moyArray = [];

        response.data.moodTrackerData.forEach((data, i) => {
          yearsArray.push(data.date);
          moyArray.push(data.average);
        });

        setYears(yearsArray);
        setMoy(moyArray);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [navigate, years, moy]);

  const interpolate = (start, end, value) => {
    let k = (value - 0) / 10;
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = (value) => {
    let r = interpolate(255, 0, value);
    let g = interpolate(0, 255, value);
    let b = interpolate(0, 0, value);
    return `rgb(${r},${g},${b})`;
  };

  const tileContent = ({ date, view }) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

    for (let i = 0; i < moy.length; i++) {
      var decomposedDate = decomposerDate(years[i]);
      if (view === 'month' && date.getDate() === decomposedDate.jour && date.getMonth() === decomposedDate.mois - 1 && date.getFullYear() === decomposedDate.annee) {
        return (
          <p style={{ backgroundColor: color(moy[i]), textAlign: 'center', margin: 0, padding: 0 }}>{moy[i]}</p>
        );
      }
    }

    if (isToday) {
      return <div style={{ backgroundColor: 'transparent' }}></div>; // Pour laisser le background de la date d'aujourd'hui transparent
    }

    return null;
  };

  return (
    <div style={{ maxWidth: '100%', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom:'20px' }}>Calendrier</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Calendar
          tileContent={tileContent}
        />
      </div>
    </div>
  );
};

export default MyCalendar;

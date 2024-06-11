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
          <div style={{ backgroundColor: color(moy[i]), textAlign: 'center', margin: 'auto', padding: '2px', borderRadius: '50%', width: '80%', height: '80%', animation: 'pulse 1s infinite' }}>{moy[i]}</div>
        );
      }
    }

    if (isToday) {
      return <div style={{ backgroundColor: 'transparent' }}></div>; // Pour laisser le background de la date d'aujourd'hui transparent
    }

    return null;
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', backgroundColor: '#f8f9fa', padding: '20px' }}>
      <Calendar
        tileContent={tileContent}
      />
    </div>
  );
};

export default MyCalendar;

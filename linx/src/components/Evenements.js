import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import {
    MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn, 
    MDBInput, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon,MDBContainer
} from 'mdb-react-ui-kit';
import axios from 'axios';
import Config from '../config.json';



const Evenements = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortCriteria, setSortCriteria] = useState('date');
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);

    const [latlog,setlatlong] = useState({})
    const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0"


    const openPopup = (title, description, img, date) => {
        setSelectedCard({ title, description, img, date });
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const Activite = () => {
        navigate('/Activite', {
            state: {
                cardTitle: selectedCard.title,
                cardDescription: selectedCard.description,
                cardImg: selectedCard.img,
                cardDate: selectedCard.date
            }
        });
    };

    const retrieveCookie = () => {
        const token = Cookies.get("jwt");
        if (!token) {
            navigate("/Login");
            return false;
        }
        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            return true;
        } catch {
            navigate("/Login");
            return false;
        }
    };

    useEffect(() => {
        const fetchActivities = async () => {
            if (!retrieveCookie()) return;

            try {
                const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/activities`, { withCredentials: true });
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities', error);
            }
        };

        fetchActivities();
    }, []);

    useEffect(()=>{
        const wrap = async()=>{
            if(activities.length>0){
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(activities[0].adresse)}&key=${googlekey}`);
                console.log(response.data)
                setlatlong(response.data.results[0].geometry.location)
                // const realtab = activities.reduce(async(acc,value,index)=>{
                //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?addres=${encodeURI(value.adresse)}`);
                    
                //     const returns = {
                //         ...value,
                //         realadress:response.data
                //     }
                //     return returns
    
                // })
                // console.log(realtab)
            }
        }
        wrap()
        
    },[activities])

    useEffect(() => {    
        const sortedActivities = [...activities].sort((a, b) => {
            if (sortCriteria === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
        });
    
        setFilteredActivities(
            sortedActivities.filter(activity =>
                activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, activities, sortOrder, sortCriteria]);

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleSortCriteriaChange = (criteria) => {
        setSortCriteria(criteria);
    };

    

    const selectedBtn = async(e) =>{
        const ide = e.target.id
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(activities[ide].adresse)}&key=${googlekey}`);
        console.log(response.data)
        setlatlong(response.data.results[0].geometry.location)
        console.log(ide)
    }   

   

    return (
        <MDBRow className='mx-0 vh-100'>
            <MDBCol size='3' className='vh-100' style={{borderBottom:"2px solid black",overflow:"scroll"}}>
                <MDBRow style={{height:"7%", borderBottom:"2px solid black"}}>
                    <MDBCol className='vh-20'>

                    </MDBCol>
                </MDBRow>
                <MDBRow style={{height:"93%"}}>
                    <MDBCol className='vh-80'>
                        {filteredActivities.map((activity, index) => (
                            <MDBBtn id={index} onClick={selectedBtn} style={{width:"100%",marginTop:"10px"}}>{activity.name}</MDBBtn>
                        ))}
                    </MDBCol>
                </MDBRow>
                
            </MDBCol>
            <MDBCol size='9' className='px-0' style={{border:"2px solid black"}}>
                <gmp-map center={`${latlog.lat}, ${latlog.lng}`} zoom="13" map-id="DEMO_MAP_ID">
                    <gmp-advanced-marker position={`${latlog.lat}, ${latlog.lng}`} title="My location"></gmp-advanced-marker>
                </gmp-map>
            </MDBCol>
        </MDBRow>
    );
};

export default Evenements;
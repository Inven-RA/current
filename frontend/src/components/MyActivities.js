import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyComponents = {
  SecondNavbar: function DatePicker(props) {
    return (
      <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
        {/* Rest of the code */}
      </Navbar>
    );
  },
  
  StoredActivities: function DatePicker(props) {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      fetch(process.env.REACT_APP_BACKEND + '/activity')
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          setActivities(data);
        })
        .catch(console.log);
    }, []);
    
    const handleReloadPage = (id) => {
      navigate(`/start-activity/${id}`);
      window.location.reload();
    };
    
        return (
      <div style={{ marginLeft: '5em' }}>
        <div style={{ marginBottom: '2em' }}>
          <ListGroup style={{ width: '95%', margin: 'auto' }}>
            {activities.map((activity) => (
              <ListGroup.Item key={activity.id}>
                <h3 style={{ fontWeight: 'bold' }}>{activity.name} </h3>
                <p>{activity.properties && activity.properties.map((props) => props.description)[0]}</p>
  
                <Link to={`/start-activity/${activity._id}`}
                  onClick={() => handleReloadPage(activity._id)}
                  style={{ color: 'black' }}>
                  <h6>Start Activity</h6>
                </Link>
  
                <Link to="#" style={{ color: 'black' }}>Check Details (NI)</Link>
                <Link to="#" style={{ color: 'black' }}>
                  <h6>Remove (NI)</h6>
                </Link>
                <div style={{ fontWeight: 'bold' }} className="activity-status green">Deployed</div>
                <input type='hidden' id="jsonparams" value = {activity.json_params_url}></input>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  }
}

const theme = createTheme();

export default function MyIaps() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MyComponents.SecondNavbar color="blue" />
      <hr></hr>
      <MyComponents.StoredActivities number="1" />
    </ThemeProvider>
  );
}

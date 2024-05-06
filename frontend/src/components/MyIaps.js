import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navbar, Nav, NavItem, ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


var _iaps = [];

const MyComponents = {
  SecondNavbar: function DatePicker(props) {
    return <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
      <Nav className="mr-auto">
        <NavItem>
          <Button variant="outlined"><Link to="/create-iap"><FontAwesomeIcon icon={faEdit} /> Create IAP</Link></Button></NavItem>
      </Nav>
      <Nav>
        <NavItem><Link to="#" style={{ color: 'black' }}>Filter (NI)</Link></NavItem>
        <NavItem><Link to="#" style={{ color: 'black' }}>Order (NI)</Link></NavItem>
      </Nav>
    </Navbar>;
  },

  StoredIAPs: function DatePicker(props) {

    const [iaps, setIaps] = useState([]);
    /*
    useEffect(() => {
      fetch(process.env.REACT_APP_BACKEND + '/iap')
        .then(res => res.json())
        .then((data) => {
          //console.log(data)
          setIaps(data)
        })
        .catch(console.log);
    }, []);
    */

    useEffect(() => {
      fetch('http://localhost:8000/iaps')
        .then(res => res.json())
        .then((data) => {
          //console.log(data)
          setIaps(data)
        })
        .catch(console.log);
    }, []);

    const navigate = useNavigate();

    const handleReloadPage = (id) => {
      navigate(`/iap-analytics/${id}`); // Navigate to the target page
      window.location.reload(); // Reload the target page
    };


    return (
      <div style={{ marginLeft: '5em' }}>
        <div style={{ marginBottom: '2em' }}>
          <ListGroup style={{ width: '95%', margin: 'auto' }}>
            {_iaps.map((iap) => (
              <ListGroup.Item key={iap.id}>
                <h3 style={{ fontWeight: 'bold' }}>{iap.name} </h3>
                <Link to="#" style={{ color: 'black' }}>Preferences (NI) </Link>
                <Link to="#" style={{ color: 'black' }}>Clone (NI) </Link>
                <Link to={`/iap-analytics/${iap.id}`} 
                      onClick={() => handleReloadPage(iap.id)}
                      style={{ color: 'black' }}>Check Statistics</Link>
                <Link to="#" style={{ color: 'black' }}><h6>Remove (NI)</h6></Link>
                <div style={{ fontWeight: 'bold' }}className="iap-status green">Deployed</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>);
  }
}

const theme = createTheme();

class ChooseIAP extends React.Component {


  componentDidMount() {

    axios.get('/iaps') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        // Handle the response data
        _iaps = response.data;

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />

      <MyComponents.SecondNavbar color="blue" />
      <hr></hr>
      <MyComponents.StoredIAPs number="1" />

      </ThemeProvider>
    );
  }
}

export default ChooseIAP
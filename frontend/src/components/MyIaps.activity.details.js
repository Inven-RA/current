import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import ProgressBar from "react-bootstrap/ProgressBar";
import axios from 'axios';
import { useParams } from 'react-router-dom';



// Global Vars
var scores = [];        
var users = [];
var objectives = []; 
var analytics = []; 
var analytics_ids = [];
var objectivesAnalytics = []; 
var objectivesAnalytics_objIDs = [];
var objectiveID;
 

const MyComponents = {
  SecondNavbar: function DatePicker(props) {
    return  <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
    <Nav className="mr-auto">
      <NavItem>
        <Button variant="outlined"><Link to="/create-iap"><FontAwesomeIcon icon={faEdit}/> Create IAP</Link></Button>
      </NavItem>
    </Nav>
    <Nav>
      <NavItem><Link to="#"  style={{color:'black'}}>Filter</Link></NavItem>
      <NavItem><Link to="#"  style={{color:'black'}}>Order</Link></NavItem>
    </Nav>
  </Navbar>;
  },

  IapDropDownBtn: function DatePicker(props) {
    return <div class="dropdown">
                <button class="dropbtn">IAP Activities</button>
                <div class="dropdown-content">
                    <a href="/iapActivityDetails">IAP Activities</a>
                    <a href="/iapLearnerDetails">IAP Learners</a>
                </div>
            </div>;
  }, 

  IapActivities: function DatePicker(props) {

    const { id } = useParams();
    objectiveID = id;
    console.log("objectiveID: "+objectiveID);
    
    return <div class="scroolWrapper">

        <MyComponents.IapDropDownBtn number="1" />

        <div class="scroll">
            <div>
                <button>
                    <img src="https://camo.githubusercontent.com/b7b7dca15c743879821e7cfc14e8034ecee3588e221de0a6f436423e304d95f5/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67" alt="Logo" />
                    <h5>Read Documentation</h5>
                </button>
            </div>
            <div>
            <button>
                <img src="https://camo.githubusercontent.com/b7b7dca15c743879821e7cfc14e8034ecee3588e221de0a6f436423e304d95f5/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67" alt="Logo" />
                <h5>Forms</h5>
                </button>
            </div>
            <div>
            <button>
                <img src="https://camo.githubusercontent.com/b7b7dca15c743879821e7cfc14e8034ecee3588e221de0a6f436423e304d95f5/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67" alt="Logo" />
                <h5>Test Activity</h5>
                </button>
            </div>
            <div>
            <button>
                <img src="https://camo.githubusercontent.com/b7b7dca15c743879821e7cfc14e8034ecee3588e221de0a6f436423e304d95f5/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67" alt="Logo" />
                <h5>Configure Hardware</h5>
                </button>
            </div>

            </div>
    </div>
    ;
  },

  IapActivitiesDetails: function DatePicker(props) {
    //console.log(iap._id)
    return <div class="screen">
      <div class="activityTitle">
        <h2>Read Documentation</h2>
      </div>
      <div class="progressBar"><ProgressBar variant="success" now={60} /></div>
      <div class="moreDetails">
        [here the stats or more details about the progress of the activity]
      </div>
    </div>;
  }
}

const theme = createTheme();

class MyIaps extends React.Component {

  componentDidMount() {

    axios.get('/users') // Assuming the server is running on the same host and port as your React app
      .then(response => {

        for (var i = 0; i < response.data.length; i++){
          users.push(response.data[i].id);
        }

        var myUsers = localStorage.getItem( 'Users_ID' ) || -1; 
        if (myUsers != -1) {
          users = myUsers.split(",");  
        }
        else {
          localStorage.setItem("Users_ID", users);
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });


      axios.get('/objectives') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        
        // Handle the response data
        for (var i = 0; i < response.data.length; i++){
          if (response.data[i].iap_id == objectiveID){ // objectivo corresponde à IAP que etsamos a analisar 
            objectives.push(response.data[i].name);
          }
        }
        
        var myObjectives = localStorage.getItem( 'Objectives' ) || 1; 
        if (myObjectives != 1) {

          if (myObjectives.split(",") != objectives) { 
            localStorage.setItem("changeIAP", "true");
            localStorage.setItem("GenerateContent", "true");
          }
          else {
            localStorage.setItem("changeIAP", "false;");
          }
          objectives = myObjectives.split(",");  

        }
        else {
          localStorage.setItem("changeIAP", "false;");
          localStorage.setItem("Objectives", objectives);
        }

                
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/allAnalytics') 
      .then(response => {

        for (var i = 0; i < response.data.length; i++){
            analytics.push(response.data[i]);
            analytics_ids.push(response.data[i].id);
        }

        var myAnalytics = localStorage.getItem( 'Analytics' ) || 1; 
        if (myAnalytics != 1) {
          analytics = myAnalytics.split(",");  
        }

        var myAnalytics_ids = localStorage.getItem( 'Analytics_ids' ) || 1; 
        if (myAnalytics_ids != 1) {
          analytics_ids = myAnalytics_ids.split(",");  
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/objectivesanalytics') 
      .then(response => {
        // Handle the response data

        for (var i = 0; i < response.data.length; i++){
          if (objectiveID == response.data[i].objective_id){  
            objectivesAnalytics.push(response.data[i]);
            objectivesAnalytics_objIDs.push(response.data[i].objective_id); // clear
          }
        }

        console.log(objectivesAnalytics);

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      axios.get('/scores') 
      .then(response => {

        // Handle the response data
        for (var i = 0; i < response.data.length; i++){
          if (analytics_ids.includes(response.data[i].analytics_id)){ 
            scores.push(response.data[i]); // score de um user numa analitica 
          }
        }

        var myScores = localStorage.getItem( 'Scores' ) || 1; 
        if (myScores != 1) {
          scores = myScores.split(",");  
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

  }


  render(){

    return (
      <div>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div class="tittleWrapper">
              <div class="iapTittle"><h2>Military Flying Training</h2></div>
          </div>
          <hr></hr> 
          <div class="bigWrapperActivities">
              <MyComponents.IapActivities number="1" />
              <MyComponents.IapActivitiesDetails number="1" />
          </div>
        
        </ThemeProvider>

      </div>
    );
  }
}

export default MyIaps
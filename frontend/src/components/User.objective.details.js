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
import { useEffect, useState } from 'react';
import { display, fontWeight } from '@mui/system';

// Global Vars
var scores = [];        
var users = [];
var objectives = []; 
var analytics = []; 
var analytics_ids = [];
var objectivesAnalytics = []; 
var objectivesAnalytics_objIDs = [];
var user_ID;
var objectiveID;


const MyComponents = { 

  
    IapActivities: function DatePicker(props) {
  
      const { userID, objID} = useParams();
      const [objectiveName, setObjectiveName] = useState('hello');

      user_ID = userID;
      objectiveID = objID;
      console.log("user_ID: "+user_ID);
      console.log("objectiveID: "+objectiveID);

      let objective_name = "hello";

      axios.get('/objectives') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        
        // Handle the response data
        for (var i = 0; i < response.data.length; i++){
          if (response.data[i].id == objectiveID){ // objectivo corresponde à IAP que etsamos a analisar 
            setObjectiveName(response.data[i].name);
            break; // Exit the loop after finding the objective name
          }
        }

        console.log(objective_name);
                
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });

      
      return <div> <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
            <Nav >
                <div class="two">
                    <h1>Learner {userID} <br></br>
                        <span>{'> '}{objectiveName}</span>
                    </h1>
                </div>
            </Nav>
        </Navbar>
        <hr></hr>
        <h4 class="subTitle">Analitics Progress:</h4>
        </div>     
      ;
    },
  
    IapActivitiesDetails: function DatePicker(props) {

        // Define the arrays as state variables
        const [analytics, setAnalytics] = useState([]);
        const [objectivesAnalytics, setObjectivesAnalytics] = useState([]);

        useEffect(() => {
        // Perform the requests in parallel using Promise.all()
        Promise.all([axios.get('/allAnalytics'), axios.get('/objectivesanalytics')])
            .then(responses => {
            const allAnalytics = responses[0].data;
            const objectivesAnalytics = responses[1].data;

            setAnalytics(allAnalytics);
            setObjectivesAnalytics(objectivesAnalytics);

            // Log the populated arrays
            //console.log(allAnalytics);
            //console.log(objectivesAnalytics);
            })
            .catch(error => {
                console.error(error);
            });
        }, []);

        
        var correspondent_analytics = [];
        var correspondent_analytics_ids = [];

        // ver quais os analytics ids deste objectivo:
        for (var a = 0; a < objectivesAnalytics.length; a++) {
            if (objectivesAnalytics[a].objective_id.toString() == objectiveID){
                correspondent_analytics_ids.push(objectivesAnalytics[a].analytics_id);
            }
        }
        // ver quais as analytics deste objectivo:
        for (var a = 0; a < analytics.length; a++) {
            if (correspondent_analytics_ids.includes(analytics[a].id)){
                correspondent_analytics.push(analytics[a]);
            }
        }
        //console.log(correspondent_analytics);
        var correspondent_scores = [];
        var correspondent_scores_analytics_ids = [];   
        for (var s = 0; s < scores.length; s++) {
            if (correspondent_analytics_ids.includes(scores[s].analytics_id) && user_ID == scores[s].user_id){
                correspondent_scores.push(scores[s]);
                correspondent_scores_analytics_ids.push(scores[s].analytics_id);
            }
        }
        //console.log(correspondent_scores);


        // criar array para iterar no return
        var show = [];
        var row = [];
        var variant;
        for (var i = 0; i < correspondent_analytics.length; i++) {
            row = [];
            row.push(correspondent_analytics[i].name);

            variant = "success";
            var hasTryied = false;
            for (var j = 0; j < correspondent_scores.length; j++){
                if(correspondent_scores[j].analytics_id == correspondent_analytics[i].id){
                    hasTryied = true;
                    row.push(correspondent_scores[j].score);
                    if (correspondent_scores[j].score < 50) {
                        variant = "danger";
                    } else if (correspondent_scores[j].score < 75) {
                        variant = "warning";
                    }
                    row.push(variant);
                    break;
                }
            }
            if (hasTryied == false){
                row.push(0);
                variant = "danger";
                row.push(variant);
            }

            row.push(correspondent_analytics[i].type);
            row.push(correspondent_analytics[i].api_link);
            show.push(row);

        }

        //console.log(show);



        return ( 
            <div>
            {show.map((row, index) => (
                  <div class="analytics">
                  <hr/>
                    <div class="activityTitle">
                        <h2>{row[0]}</h2>
                    </div>
                    <ProgressBar variant={row[2]} now={row[1]} label={`${row[1]}%`}
                        style={{display: row[3] == 'Qualitative' ? 'none' : row[3] == 'Bool' ? 'none' : 'default'}}>
                        <div className={`progress-bar variant-bg${row[2]}`} 
                                style={{  width: row[1] < 10 ? '20px' : `${row[1]}%`,
                                        backgroundColor: row[2] == 'success' ? '#3cb371': row[2] == 'warning' ? '#f5c71a' : '#cb4154'}}>
                            {row[1]}
                        </div>
                    </ProgressBar>
                    <div class="qualiOrBool"
                        style={{display: row[3] == 'Qualitative' ? 'default' : row[3] == 'Bool' ? 'default' : 'none'}}>
                        <div class="done" style={{display: row[1] == 100 ? 'default' : 'none',fontFamily: 'Lucida Console', fontSize: '20px'}}>DONE ✅</div>
                        <div class="notDone" style={{display: row[1] == 0 ? 'default' : 'none',fontFamily: 'Lucida Console', fontSize: '20px'}}>NOT DONE ❌</div>
                    </div>
                    <div class="analyticDetails">
                        <span style={{fontWeight:'bold'}}>Type:</span> {row[3]}<br></br>
                        <span style={{fontWeight:'bold'}}>Link:</span> <a href={row[4]}>{row[4]}</a>
                    </div>
                  </div>
             
            ))}
            <hr/>

            </div>
        );
    }
  }

const theme = createTheme();

class Details extends React.Component {

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

        //console.log(analytics);

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
         
          <div >
            <MyComponents.IapActivities number="1" />
            <div class="wrapAll">
                <MyComponents.IapActivitiesDetails number="1" />
            </div>
          </div>
        
        </ThemeProvider>

      </div>
    );
  }
}

export default Details
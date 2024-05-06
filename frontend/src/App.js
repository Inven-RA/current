import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Iaps from './components/iaps';
import Activities from './components/activities';
import ActivityAnalytics from './components/activity_analytics';
import IAPAnalytics from './components/iap_analytics';
import EditIAP from './components/edit_iap';
import DeployedIaps from './components/deployed_iaps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import StartActivity from './components/StartActivity';

import { UserProvider } from "./contexts/user.context";
import Home from "./components/Home.page";
import Login from "./components/Login.page";
import PrivateRoute from "./components/PrivateRoute.page";
import Signup from "./components/Signup.page";
import CustomNavBar from './components/CustomNavBar';
import { UserContext } from './contexts/user.context';
import Profile from "./components/Profile.page";
import MyIaps from './components/MyIaps';
import MyActivities from './components/MyActivities';
import MyIapActivityDetails from './components/MyIaps.activity.details';
import MyIapLearnerDetails from './components/MyIaps.learners.details';
import Analitics from './components/iap_analytics';
import CreateActivityForm from './components/create_activity';
import axios from 'axios';
import UserObjectiveDetails from './components/User.objective.details';
import ObjectiveDetailsPage from './components/Objective.details.page';
import UserIapDetails from './components/User.iap.details';
import UserAllIaps from './components/User.all.iaps.details';



import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams
} from "react-router-dom";

//const db = require('./database');
axios.defaults.baseURL = 'http://localhost:8000';


class App extends Component {
  

  componentDidMount() {
    //console.log("Here");
    axios.get('/users') // Assuming the server is running on the same host and port as your React app
      .then(response => {
        // Handle the response data
        //console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        //console.error(error);
      });
  }

  EditIAP = () => {
    const params = useParams();
    const id = params.id;
    return <EditIAP id={id} />
  }
  
  LoadActivityAnalytics = () => {
    const params = useParams();
    const id = params.id;
    return <ActivityAnalytics id={id} />
  } 

  Analitics = () => {
    const params = useParams();
    const id = params.id;
    return <Analitics id={id} />
  }
    StartActivity = () => {
    const params = useParams();
    const id = params._id;
    return <StartActivity id={id} />
  }

  render() {

    console.log("env: " + JSON.stringify(process.env))
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <UserProvider>
          <CustomNavBar/>
            <Routes>
              <Route exact path="/customNavBar" element={<CustomNavBar />} />
              <Route exact path="/create-iap" element={<EditIAP />} />
              <Route exact path="/edit-iap/:id" element={<this.EditIAP />} />
              <Route exact path="/live-iaps" element={<MyIaps />} />
              <Route exact path="/activities" element={<MyActivities />} />
              <Route exact path="/act-analytics/1" element={<this.LoadActivityAnalytics />} />
              <Route path="/iap-analytics/:id" element={<this.Analitics />} />
              <Route exact path="/" element={<Iaps />} />
              
              <Route exact path="/start-activity/:id" element={<this.StartActivity />} />

              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/myIaps" element={<MyIaps />} />
              <Route exact path="/myActivities" element={<MyActivities />} />
              <Route exact path="/iapActivityDetails/:id" element={<MyIapActivityDetails />} />
              <Route exact path="/iapLearnerDetails" element={<MyIapLearnerDetails />} />
              
              <Route exact path="/createActivity" element={<CreateActivityForm />} />
              <Route exact path="/userObjectiveDetails/:userID/:objID" element={<UserObjectiveDetails/>}/>
              <Route exact path="/objectiveDetailsPage/:objID" element={<ObjectiveDetailsPage/>}/>
              <Route exact path="/userIapDetails/:userID/:iapID" element={<UserIapDetails/>}/>
              <Route exact path="/userAllIaps/:userID" element={<UserAllIaps/>}/>
              
              {/* We are protecting our Home Page from unauthenticated */}
              {/* users by wrapping it with PrivateRoute here. Put private pages here*/}
              <Route element={<PrivateRoute />}>

              </Route>
            </Routes>
          </UserProvider>
        </div>
      </Router>
    );
  }

}


export default App;
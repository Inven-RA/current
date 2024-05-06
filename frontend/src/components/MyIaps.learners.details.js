import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'


const MyComponents = {
  SecondNavbar: function DatePicker(props) {
    return  <Navbar bg="blue" variant="green" style={{ marginBottom: '1em' }}>
    <Nav className="mr-auto">
      <NavItem>
        <Button variant="outlined"><Link to="/create-iap"><FontAwesomeIcon icon={faEdit}/> Create IAP</Link></Button></NavItem>
    </Nav>
    <Nav>
      <NavItem><Link to="#"  style={{color:'black'}}>Filter (NI)</Link></NavItem>
      <NavItem><Link to="#"  style={{color:'black'}}>Order (NI)</Link></NavItem>
    </Nav>
  </Navbar>;
  },

  IapDropDownBtn: function DatePicker(props) {
    return <div class="dropdown">
                <button class="dropbtn">Dropdown Value</button>
                <div class="dropdown-content">
                    <a href="/iapActivityDetails">IAP # Activities</a>
                    <a href="/iapLearnerDetails">IAP # Learners</a>
                </div>
            </div>;
  }, 

  IapLearnersID: function DatePicker(props) {
    return <div class="scroolWrapper">

        <MyComponents.IapDropDownBtn number="1" />

        <div class="scroll">
          <button>
            <h5>5215255215252</h5>
          </button>
          <button>
            <h5>5215122155</h5>
          </button>
          <button>
            <h5>2515215521</h5>
          </button>
          <button>
            <h5>426547</h5>
          </button>
          <button>
            <h5>245155512521</h5>
          </button>
          <button>
            <h5>51251515252</h5>
          </button>
          <button>
            <h5>312312312</h5>
          </button>
          <button>
            <h5>52152524</h5>
          </button>

        </div>
    </div>
    ;
  },

  IapLearnersDetails: function DatePicker(props) {
    return <div class="screen">
      <div class="activityTitle">
        <h2>«Learner ID»</h2>
      </div>
      <div class="progressBar">
        [Progress Bar here]<br></br>
        [here the stats or more details about the progress of the Learner in this IAP]</div>
      <div class="moreDetails">
        <div id="scrollActDone">
          <h4>% of Activities Done</h4>
          <button>Activity #</button>
          <button>Activity #</button>
          <button>Activity #</button>
          <button>Activity #</button> 
          <button>Activity #</button>
          <button>Activity #</button>
          <button>Activity #</button>
          <button>Activity #</button>
          <button>Activity #</button>
        </div>
        <div id="scrollActAnaliticsDone">
          <h4>Activity # Analitics</h4>
          <div>Analitic #</div>
          <div>Analitic #</div>
          <div>Analitic #</div>
          
        </div>
      </div>
    </div>;
  }
}

const theme = createTheme();

export default function MyIaps() {
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <div class="tittleWrapper">
            <div class="iapTittle"><h2>IAP #</h2></div>
        </div>
        <hr></hr>
        <div class="bigWrapperUsers">
            <MyComponents.IapLearnersID number="1" />
            <MyComponents.IapLearnersDetails number="1" />
        </div>
      
    </ThemeProvider>
  );
}
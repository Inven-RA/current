import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from '../contexts/user.context';
import { Link } from "react-router-dom";
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@mui/material'

 

export default class CustomNavBar extends Component {

  static contextType = UserContext;

  state = {
    isLoggedIn : false,
  }


  componentDidMount() {
    this.checkifLoggedIn().then(result =>
      this.setState({
        isLoggedIn: result
      })
      );
  }

  logOut = async () => {
    const { logOutUser} = this.context;
    try {
      // Calling the logOutUser function from the user context.
      const loggedOut = await logOutUser();
      // Now we will refresh the page, and the user will be logged out and
      // redirected to the login page because of the <PrivateRoute /> component.
      if (loggedOut) {
        window.location.reload(true);
      }
    } catch (error) {
      alert(error)
    }
  }

  checkifLoggedIn = async() => {
    const { isUserLoggedIn } = this.context;

    return isUserLoggedIn();
  }

  render() {
    let loginOrLogoutAndProfile;
    if(!this.state.isLoggedIn) {
      loginOrLogoutAndProfile = <NavItem><Link to="/login"><FontAwesomeIcon icon={faCoffee}/> Login</Link></NavItem>
    } else {
      loginOrLogoutAndProfile =  <Nav>
                                  <NavItem><Link to="/profile"><FontAwesomeIcon icon={faCoffee} /> Profile</Link></NavItem>
                                  <NavItem><Button onClick={this.logOut} style={{ color:'gray'}}>Logout</Button></NavItem>
                                </Nav>
    }

    return (
      <Navbar bg="dark" variant="dark" style={{ marginBottom: '1em' }}>
            <Navbar.Brand href="#">Inven!RA</Navbar.Brand>
            <Nav className="mr-auto">
              <NavItem><Link to="/">Store</Link></NavItem>
              <NavItem><Link to="/live-iaps">My IAPs</Link></NavItem>
              <NavItem><Link to="/activities">My Activities</Link></NavItem>
            </Nav>
            {loginOrLogoutAndProfile}
          </Navbar>
    );
  }
}
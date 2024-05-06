import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import { Link } from "react-router-dom";
import { UserContext } from '../contexts/user.context';
 
import "../css/style.css";

export default class Iaps extends Component {

  static contextType = UserContext;

  state = {
    iaps: [],
    activities: [],
    isLoggedIn : false,
    selectedFilter: "all",
  }

  handleFilterChange = (event) => {
    this.setState({ selectedFilter: event.target.value });
  };
  

  componentDidMount() {
    this.checkifLoggedIn().then(result =>
      this.setState({
        isLoggedIn: result
      })
      );
    /*
    fetch(process.env.REACT_APP_BACKEND + '/iap')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ iaps: data })
      })
      .catch(console.log)

      fetch(process.env.REACT_APP_BACKEND + '/activity')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ activities: data })
      })
      .catch(console.log)
      */

      fetch('http://localhost:8000/iaps')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ iaps: data })
      })
      .catch(console.log)

      fetch('http://localhost:8000/activities')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ activities: data })
      })
      .catch(console.log)

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
    
    /*let button;
    if (this.state.isLoggedIn) {
      button = <Button class="notImplemented" variant="contained" onClick={this.logOut}><span>Logout</span></Button>
    } else {
      button = <Link to="/login" class="login-button" style={{verticalalign:"middle"}} ><span>Login</span></Link>
    }*/

    const { iaps } = this.state;
    const { activities } = this.state;


    const filteredIaps = this.state.iaps.filter(
      (iap) =>
        this.state.selectedFilter === "all" ||
        this.state.selectedFilter === "IAP"
    );

    const filteredActivities = this.state.activities.filter(
      (activity) =>
        this.state.selectedFilter === "all" ||
        this.state.selectedFilter === "Activity"
    );
  

    return (
      <div>
        <center><h1>Store</h1></center>
        <div class="search-container">
      <form>
          <label for="search-input">Search:</label>
          <input type="text" id="search-input" placeholder="Search for Activities or IAPs"></input>
          <button type="submit">Search</button>
        </form>
      </div>

      <div class="filter-container">
        <label for="filter-select">Filter:</label>
        <select id="filter-select" onChange={this.handleFilterChange}>
        <option value="all">All</option>
        <option value="Activity">Activity</option>
        <option value="IAP">IAP</option>
      </select>
      </div>




        <br></br>

        <center><h3> IAPs </h3></center> 
        <CardColumns style={{ width: '75%', margin: 'auto' }}>
          {iaps.map((iap) => (
            <Card key={iap.id}>
              <Card.Header as="h5">{iap.name}</Card.Header>
              <Card.Body>
                <Card.Text>{iap.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Link to="#">Add to your IAPs</Link>
              </Card.Footer>
            </Card>
          ))}
        </CardColumns>

        <br></br>
        
      <center><h3> Activities </h3></center>   
      <CardColumns style={{ width: '75%', margin: 'auto' }}>
          {activities.map((activity) => (
            <Card key={activity.id}>
              <Card.Header as="h5">{activity.name}</Card.Header>
              <Card.Body>
                <Card.Text>{activity.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Link to="#">Add to your Activities</Link>
              </Card.Footer>
            </Card>
          ))}
        </CardColumns>
   
      </div>
    );
  }
}
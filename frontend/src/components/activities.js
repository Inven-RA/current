import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import {
  Link
} from "react-router-dom";
class Activities extends Component {
  
  componentDidMount() {
    fetch(process.env.REACT_APP_BACKEND + '/activity')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ activities: data })
      })
      .catch(console.log)
  }
  


  state = {
    activities: []
  }

  render() {


    return (
      <div>
        <center><h1>Registered Activities</h1></center>
        <br/>

        <CardColumns style={{ width: '75%', margin: 'auto' }}>
          {this.state.activities.map((activity, index) => (

            <Card key={index}>
              <Card.Header as="h5">{activity.name}</Card.Header>
              <Card.Body>
                <Card.Title>{activity.properties && activity.properties.map((props) => props.description)[0]}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">ConfigURL: <a href={activity.config_url}>Go to config</a></Card.Subtitle>
                <Card.Text>
                  UserURL: <a href={activity.config_url}>Go to user page</a><br/>
                  Configuration: <a href={activity.json_params_url}>Load JSON</a><br/>
                  Analytics: <Link to={'/act-analytics/' + activity._id}>Check</Link> | <a href={activity.analytics_url}>Load JSON</a>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </CardColumns>
      </div>
    );
  }
}

export default Activities
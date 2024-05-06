import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import ProgressBar from "react-bootstrap/ProgressBar";

class ActivityAnalytics extends Component {

  componentDidMount() {
    fetch(process.env.REACT_APP_BACKEND + '/activity/' + this.props.id)
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ activity: data })
        console.log("Activity Data" + JSON.stringify(this.state.activity))

        if (this.state.activity.analytics) {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "activityID": "1234" }) // mockup
            // body: JSON.stringify({ "activityID": this.state.activity._id })
          }

          fetch("https://inventivetraining.herokuapp.com/api/analyticsGetDocRoute", requestOptions)
            .then(async response => {
              const data = await response.json();
              if (!response.ok) {
                const error = (data && data.message) || response.status;
                console.log('Error getting provider analytics: ' + JSON.stringify(error))
                return Promise.reject(error);
              }
              console.log('Provider Response: ' + JSON.stringify(data))
              this.setState({ analytics: data })
            })
            .catch(error => {
              this.setState({ errorMessage: error });
              console.error('There was an error!', error);
            })
        }
      })
      .catch(console.log)
  }

  state = {
    activity: {},
    analytics: []
  }

  render() {

    return (

      <div>
        <center><h1>Analytics for "{this.state.activity.name}" activity</h1></center>
        <br /><br />

        <Container fluid="xl">

          <h3>Analytics JSON: <a href={this.state.activity.analytics}>Download</a></h3><br />

          {this.state.analytics && this.state.analytics.map((student) =>
            <div key={student.inveniraStdID}>
              <h4>Student ID - {student.inveniraStdID}</h4>
              <h5>Qualitative Analytics - <a href={student.qualAnalyticsURL}>Check on provider</a></h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {student.quantAnalytics && student.quantAnalytics.map((analytic, index) =>
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{analytic.name}</td>
                      <td>{analytic.type || "Not available"}</td>
                      <td>{JSON.stringify(analytic.value)}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <h6>Total Completion</h6>
              <ProgressBar variant="success" now={45} />
              <br /><br />
            </div>
          )}

          <div>
            <h6>Sample progress bars</h6>
            <ProgressBar variant="success" now={40} />
            <ProgressBar variant="info" now={20} />
            <ProgressBar variant="warning" now={60} />
            <ProgressBar variant="danger" now={80} />
          </div>

        </Container>

      </div>
    );
  }
}

export default ActivityAnalytics
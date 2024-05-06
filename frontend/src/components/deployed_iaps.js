import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import {
  Link
} from "react-router-dom";
import Container from 'react-bootstrap/Container';

class DeployedIaps extends Component {

  state = {
    iaps: [],
    show_modal: false
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_BACKEND + '/deploy/list')
      .then(res => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ iaps: data })
      })
      .catch(console.log)
  }

  handleModalShow() { this.setState({ show_modal: true }); };
  handleModalClose() { this.setState({ show_modal: false }); };

  loadActivities() { };

  ActivitiesModal = () => {

    return (
      <div>
        {/* <Button variant="primary" onClick={() => this.handleModalShow()}>Launch demo modal</Button> */}
        <Link onClick={() => this.handleModalShow()} to="#">Check activities</Link>

        <Modal
          show={this.state.show_modal}
          size="xl"
          onEnter={() => this.loadActivities()}
          onHide={() => this.handleModalClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Activites for deployment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            These URLs should be shared on your target environment.
            For Moodle usage, the user id should be added as a url parameter (such as '&userId=100')<br/><br/>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Activity Name</th>
                  <th>Deployment URL</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>1</td>
                      {this.state.iaps.map((iap, index) => (
                        <td>{iap.name}</td>
                      ))}
                      {this.state.iaps.map((iap, index) => (
                        <td><a href={process.env.REACT_APP_BACKEND +"/deploy/activity?id="+iap._id}>{process.env.REACT_APP_BACKEND +"/deploy/activity?id="+iap._id}</a></td>
                      ))}
                  </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalClose()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  render() {

    return (
      <div>
        <center><h1>Deployed IAPs</h1></center><br />

        <Container fluid>

          <CardColumns style={{ width: '75%', margin: 'auto' }}>
            {this.state.iaps.map((iap, index) => (

              <Card key={index}>
                <Card.Header as="h5">{iap.name}</Card.Header>
                <Card.Body>
                  <Card.Text>{iap.properties && iap.properties.map((props) => props.description)[0]}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  {/* <Link to={() => this.handleModalShow()}>Check activities</Link> */}
                  <this.ActivitiesModal></this.ActivitiesModal>
                  <Link to={'/iap-analytics/' + iap._id} style={{ float: "right" }}>View Analytics</Link>
                </Card.Footer>
              </Card>
            ))}
          </CardColumns>
        </Container>

      </div>
    );
  }
}

export default DeployedIaps
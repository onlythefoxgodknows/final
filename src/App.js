import React from 'react';
import {Form, Button, Container, Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import fire from './firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      email: "",
      password: "",
      accounts: []
    })
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.saveToDB = this.saveToDB.bind(this);
    this.retrieveFromDB = this.retrieveFromDB.bind(this);
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  saveToDB = e => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db.collection("accounts").add({
      email: this.state.email,
      password: this.state.password
    })
    this.retrieveFromDB()
  }

  componentDidMount() {
    this.retrieveFromDB();
    console.log(this.state);
  }

  retrieveFromDB() {
    const db = fire.firestore();
    db.collection("accounts").get().then(data => {
      const accounts = []
      data.forEach(doc => {
        const data = doc.data();
        accounts.push(data)
      })
      this.setState({
        accounts: accounts
      })
    })
  }

  render() {
    let dropdown = this.state.accounts.map(value => <Dropdown.Item href="#/action-1">{value.email}</Dropdown.Item>)
    return(
        <Container>
          <Row>
            <Col>
              <Form className={"form-data card-2"}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address: {this.state.email}</Form.Label>
                  <Form.Control type="email" value={this.state.email} onChange={this.handleEmail} placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password: {this.state.password}</Form.Label>
                  <Form.Control type="password" value={this.state.password} onChange={this.handlePassword} placeholder="Password" />
                </Form.Group>
                <Button variant="primary" onClick={this.saveToDB}>
                  Submit
                </Button>
              </Form>
            </Col>
            <Col>
              <div className={"form-data card-2"}>
                <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                  {dropdown}
                </DropdownButton>
              </div>
            </Col>
          </Row>
        </Container>
    )
  }
}


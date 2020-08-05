import React from 'react';
import {Form, Button, Container, Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import fire from './firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      dir: "in",
      frametype: "",
      ipsrc: "",
      ipdest: "",
      iptype: "TCP",
      srcport: "",
      destport: "",
      packets: []
    })
    this.handleDir = this.handleDir.bind(this);
    this.handleFrameType = this.handleFrameType.bind(this);
    this.handleIPSrc = this.handleIPSrc.bind(this);
    this.handleIPDest = this.handleIPDest.bind(this);
    this.handleIPType = this.handleIPType.bind(this);
    this.handleSRCPort = this.handleSRCPort.bind(this);
    this.handleDestPort = this.handleDestPort.bind(this);
    this.saveToDB = this.saveToDB.bind(this);
    this.retrieveFromDB = this.retrieveFromDB.bind(this);
    this.populateDB = this.populateDB.bind(this);
    this.deleteDB = this.deleteDB.bind(this);
  }

  handleDir(e) {
    this.setState({
      dir: e.target.value
    })
  }

  handleFrameType(e) {
    this.setState({
      frametype: e.target.value
    })
  }
  
  handleIPSrc(e) {
    this.setState({
      ipsrc: e.target.value
    })
  }

  handleIPDest(e) {
    this.setState({
      ipdest: e.target.value
    })
  }

  handleIPType(e) {
    this.setState({
      iptype: e.target.value
    })
  }

  handleSRCPort(e) {
    this.setState({
      srcport: e.target.value
    })
  }

  handleDestPort(e) {
    this.setState({
      destport: e.target.value
    })
  }

  saveToDB = e => {
    e.preventDefault();
    const db = fire.firestore();
    const userRef = db.collection("packets").add({
      dir: this.state.dir,
      frametype: this.state.frametype,
      ipsrc: this.state.ipsrc,
      ipdest: this.state.ipdest,
      iptype: this.state.iptype,
      srcport: this.state.srcport,
      destport: this.state.destport
    })
    this.retrieveFromDB()
  }

  populateDB = e => {
    e.preventDefault();
    const db = fire.firestore();
    let initialPackets = [
      {dir: "in", frametype: "0x0800", ipdest: "192.5.48.1", iptype: "TCP", destport: "80"},
      {dir: "in", frametype: "0x0800", ipdest: "192.5.48.2", iptype: "TCP", destport: "25"},
      {dir: "in", frametype: "0x0800", ipdest: "192.5.48.3", iptype: "TCP", destport: "53"},
      {dir: "in", frametype: "0x0800", ipdest: "192.5.48.3", iptype: "UDP", destport: "53"},
      {dir: "out", frametype: "0x0800", ipsrc: "192.5.48.1", iptype: "TCP", srcport: "80"},
      {dir: "out", frametype: "0x0800", ipsrc: "192.5.48.2", iptype: "TCP", srcport: "25"},
      {dir: "out", frametype: "0x0800", ipsrc: "192.5.48.3", iptype: "TCP", srcport: "53"},
      {dir: "out", frametype: "0x0800", ipsrc: "192.5.48.3", iptype: "UDP", srcport: "53"},
    ]
    initialPackets.forEach(packet => {
      let userRef = db.collection("packets").add(packet)
    })
    this.retrieveFromDB()
  }

  componentDidMount() {
    this.retrieveFromDB()
  }

  retrieveFromDB() {
    const db = fire.firestore();
    db.collection("packets").get().then(data => {
      const packets = []
      data.forEach(doc => {
        const data = doc.data();
        packets.push(data)
      })
      this.setState({
        packets: packets
      })
    })
  }

  deleteDB = e => {
    e.preventDefault();
    const db = fire.firestore();
    db.collection("packets").delete();
    this.retrieveFromDB();
  }

  render() {
    let dropdown = this.state.packets.map(value => <Dropdown.Item href="#/action-1">{value.dir}</Dropdown.Item>)
    let table = this.state.packets.map(packet =>
        <tr>
          <td>{packet.dir}</td>
          <td>{packet.frametype}</td>
          <td>{packet.ipsrc}</td>
          <td>{packet.ipdest}</td>
          <td>{packet.iptype}</td>
          <td>{packet.srcport}</td>
          <td>{packet.destport}</td>
        </tr>)
    let ipsrcComponent = this.state.dir == "out" ?
        <Form.Group controlId="formBasicipsrc">
          <Form.Label>IP Src {this.state.ipsrc}</Form.Label>
          <Form.Control type="text" value={this.state.ipsrc} onChange={this.handleIPSrc} placeholder="IP Source" />
        </Form.Group> : null;

    let ipdestComponent = this.state.dir == "in" ?
        <Form.Group controlId="formBasicipdest">
          <Form.Label>IP Dest {this.state.ipdest}</Form.Label>
          <Form.Control type="text" value={this.state.ipdest} onChange={this.handleIPDest} placeholder="IP Destination" />
        </Form.Group> : null;

      let srcportComponent = this.state.dir == "out" ?
          <Form.Group controlId="formBasicsrcport">
            <Form.Label>Src Port {this.state.srcport}</Form.Label>
            <Form.Control type="text" value={this.state.srcport} onChange={this.handleSRCPort} placeholder="Source Port" />
          </Form.Group> : null;

      let destportComponent = this.state.dir == "in" ?
          <Form.Group controlId="formBasicdestport">
            <Form.Label>Dest Port {this.state.destport}</Form.Label>
            <Form.Control type="text" value={this.state.destport} onChange={this.handleDestPort} placeholder="Destination Port" />
          </Form.Group> : null;


    return(
        <Container>
          <Row>
            <Col>
              <Button style={{margin: "1em"}} variant="success" onClick={this.populateDB}>
                Populate Database
              </Button>
              <Form className={"form-data card-2"}>
                <Form.Group controlId="select">
                  <Form.Label>Dir</Form.Label>
                  <Form.Control onChange={this.handleDir} as="select">
                    <option>in</option>
                    <option>out</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formBasicframetype">
                  <Form.Label>Frame Type{this.state.frametype}</Form.Label>
                  <Form.Control type="text" value={this.state.frametype} onChange={this.handleFrameType} placeholder="Frame Type" />
                </Form.Group>

                {ipsrcComponent}

                {ipdestComponent}

                <Form.Group controlId="selectiptype">
                  <Form.Label>Ip Type</Form.Label>
                  <Form.Control onChange={this.handleIPType} as="select">
                    <option>TCP</option>
                    <option>UDP</option>
                  </Form.Control>
                </Form.Group>

                {srcportComponent}

                {destportComponent}
                <Button variant="primary" onClick={this.saveToDB}>
                  Submit
                </Button>
              </Form>
            </Col>
            <Col>
              <table>
                <tr>
                  <th>Dir</th>
                  <th>Frame Type</th>
                  <th>IP Src</th>
                  <th>IP Dest</th>
                  <th>IP Type</th>
                  <th>Src Port</th>
                  <th>Dest Port</th>
                </tr>
                {table}
              </table>
            </Col>
          </Row>
        </Container>
    )
  }
}


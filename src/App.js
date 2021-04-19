
import './App.css';
import firebase from "./firebase";
import {useEffect, useState} from "react";
import {Col, Container, Navbar, Row, Card, Button} from "react-bootstrap";


function App() {
    //list of objects I want to use
    let newList = []

    //initial state containing an object with the look I want for the page
    const [looks, updateLooks] = useState({backgrounds: "#edf1f5", image: "https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2017/04/1493235373large_react_apps_A-01.png", primaryHex : "#032644", secondHex: "#383b40"})

    //state containing the look of each panel and a way to update the list of panels
    const [list, updatelist] = useState([{background: "#edf1f5", image: "https://designshack.net/wp-content/uploads/placeholder-image.png", name: "hello", primaryHex: "#032644", secondHex: "black"}])



    //styling! Notice how im using the state for this. That means I can update anytime and it will reflect

    let bodyStyler = {backgroundColor: looks.backgrounds};

    let bodyImage = {background: `url(${looks.backgrounds})`}

    let headStyler = {backgroundColor: looks.secondHex, marginBottom: 20, color: "white", textAlign: "center"}


    const styles = {
        card: {
            backgroundColor: looks.primaryHex,
            padding: '4rem',
            color: 'white',
            height: '30rem',
            width: '40rem',
            marginBottom: 20

        },
        cardImage: {
                objectFit: 'cover',
                width: '30vw',
                height: '30vh'
        }
    }


    //helper to update the look of the page based on the current panels' keys

    function update(back,image, primary, second) {

        updateLooks(looks =>({...looks, backgrounds: back, image: image, primaryHex: primary, secondHex: second }) )

    }



//important! This gets the database reference and finds the list of objects. Then, it updates the state containing the list when it fires
    function fetcher() {

        //reference to firebase
        let panelbase = firebase.database().ref();

        //gets the part that contains the key 'panels' then returns a snapshot
        panelbase.child("panels").get().then(function (snapshot) {

            if (snapshot.exists()) {

                //object of objects here
                let objectList = snapshot.val()

                //keys of each
                let keys = Object.keys(objectList)

                //transforms the object into a list of objects
                newList = keys.map(key => {

                    return objectList[key]
                })

                //updates the list of objects with the new one
               updatelist(newList)


            } else {
                console.log("No data available");
            }

            //error block
        }).catch(function (error) {
            console.error(error);
        });
    }

    return(

        //return container with each list (less than= to 7 means its a hex so ill use background color. If not, then use the url since its a link)

        <Container style = {looks.backgrounds.length<=7 ? bodyStyler : bodyImage} fluid>

            <Navbar style = {headStyler} className= 'p-2'  >

                <Navbar.Brand>

                    <img
                        src= {looks.image}
                        width="150"
                        height="75"
                        className="mr-4"
                        alt="Logo"
                    />
                    {''}
                    Dynamic Example

                </Navbar.Brand>

                <Button variant= "outline-info" onClick={()=>fetcher()}> Fetcher </Button>

            </Navbar>

            <Row>

                <Col md={{span:6, offset:3}}>

                    <Row>
                {
                    //important part here! takes the list of objects and creates a col for each one

                    list.map((panel, index) => {

                        return <Col sm ={{span: 6, offset: 3}} key = {index}>

                            <Card style={styles.card}>

                                <Card.Img variant="top" src= {panel.image} style = {styles.cardImage} />

                                <Card.Body>

                                    <Card.Title>{panel.name}</Card.Title>

                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the bulk of
                                        the card's content.
                                    </Card.Text>

                                    <Button variant="primary" onClick =  { ()=>

                                    {update(panel.background, panel.image, panel.primaryHex, panel.secondHex)}

                                    }>Change Everything</Button>

                                </Card.Body>

                            </Card>

                        </Col>
                    })}
                    </Row>
                </Col>
            </Row>

        </Container>
    );


}

export default App;

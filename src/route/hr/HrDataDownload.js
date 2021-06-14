import { Button } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider'
import { db, firebasevalue } from '../../firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../student/styles/Common.css'
// import './styles/hrdashboard.css'
import Sidebar from './components/Sidebar'
import { faDownload, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons'
import DownloadData from './components/DownloadData'
import { Link } from 'react-router-dom'
import MakeOffer from './components/MakeOffer'
import NothingToShow from '../../components/NothingToShow'

function HrDataDownload() {
    const { currentUser } = useAuth()
    const [studentDataArray, setStudentDataArray] = useState([])
    const [modalData, setModalData] = useState()
    const [show,setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [makeOfferShow,setMakeOfferShow] = useState(false);
    const handleMakeOfferClose = () => setMakeOfferShow(false);
    const handleMakeOfferShow = (data) => {
        setMakeOfferShow(true)
        setModalData(data)
    };

    useEffect(()=>{
        var unsubscribe = db.collection("users").doc(currentUser.uid).onSnapshot((doc)=>{
            if(doc.exists)
            {
                setStudentDataArray(doc.data().studentData)
            }
        })
        return unsubscribe;
    },[])

    

    return (
        <Container fluid>
            <Row>
                <Col lg={1}>
                    <Sidebar />
                </Col>
                <Col lg={11}>
                    <div className="page-header">
                        Resources
                    </div>
                    <Container fluid>
                        <Row className="my-2 card-container">
                            {studentDataArray && (studentDataArray.length > 0) && studentDataArray.map((data,key)=>{
                                return(
                                    <Col lg={3} className="card my-2 mx-1" key={key}>
                                        <div className="mx-3 my-3 d-flex flex-column justify-content-center">
                                            <h5>Name: {data.name}</h5>
                                            <h6>E-mail: <a href={"mailto:" + data.email}>{data.email}</a></h6>
                                        </div>
                                        <div>
                                            <span className="mx-3 my-2 profile-tags">{data.topic}</span>
                                        </div>
                                        <div className="my-3 d-flex justify-content-center">
                                            <Link to={`/profile/${data.id}`}>
                                                <Button variant="primary">
                                                    View Profile <FontAwesomeIcon icon={faUser} />
                                                </Button>
                                            </Link>
                                            <Button variant="danger" className="mx-2" onClick={()=>handleMakeOfferShow(data)}>
                                                Make Offer <FontAwesomeIcon icon={faPaperPlane} />
                                            </Button>
                                        </div>
                                    </Col>
                                )
                            })}
                            {studentDataArray && studentDataArray.length < 1 &&(<NothingToShow />)
                            }
                        </Row>
                    </Container>
                    <Button className="floating-r-btn" variant="light" onClick={handleShow}>Download <FontAwesomeIcon icon={faDownload}/></Button>
                    <DownloadData show={show} onHide={handleClose} />
                    <MakeOffer show={makeOfferShow} onHide={handleMakeOfferClose} data={modalData} /> 
                </Col>
            </Row>
        </Container>
    )
}

export default HrDataDownload

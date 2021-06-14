import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'
import NothingToShow from '../../components/NothingToShow'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HrOffers() {

    const [Jobs, SetJobs]=useState([])
    const [FilteredJobs, SetFilteredJobs]=useState()
    const [toggle, setToggle] = useState(false)
    const toggleState = (toggle) => setToggle(!toggle);
    const {currentUser}=useAuth()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(()=>{
        var unsubscribe= db.collection("users").doc(currentUser.uid).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                console.log(docs.data())
                SetJobs(docs.data().sentOffers)
                SetFilteredJobs(docs.data().sentOffers)
            }
            else
                SetFilteredJobs([])
        })
        return unsubscribe
    },[])

    function handleFilter(keyword){
        if(keyword==="")
        SetFilteredJobs(Jobs)
        else
        {
            var Filteredarr= Jobs.filter(Job=>
                Job.title.toLowerCase().includes(keyword.toLowerCase())
                || Job.responsibility.toLowerCase().includes(keyword.toLowerCase())
                || Job.location.toLowerCase().includes(keyword.toLowerCase())
                || Job.company.toLowerCase().includes(keyword.toLowerCase())
                || Job.code.toLowerCase().includes(keyword.toLowerCase())
                || Job.topic.toLowerCase().includes(keyword.toLowerCase())
                
                )

            SetFilteredJobs(Filteredarr)
        }
    }

    return (
        <Container fluid>
            <Col>
                <Row>
                    <Col lg={1}>
                        <Sidebar/>
                    </Col>
                    <Col lg={11}>
                        <div className="page-header">
                            Offers
                        </div>
                        <Container fluid>
                            <Row>
                                <Col lg={12} className="p-0">
                                <Form.Group controlId="formSearch">
                                    <Form.Control type="text" placeholder="Search Offers" onChange={(e)=>{handleFilter(e.target.value)}}  />
                                </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                        {FilteredJobs && FilteredJobs.length > 0 && FilteredJobs.map((job , key)=>{
                            return (
                                <Container fluid key={key} className="award-container">
                                    <Row>
                                        <Col lg={12}>
                                            <div className="status">
                                                {job.actionTaken && job.isAccepted && (<span><FontAwesomeIcon icon={faCheckCircle} className="success"/> Accepted</span>)}
                                                {job.actionTaken && !job.isAccepted && (<span><FontAwesomeIcon icon={faTimesCircle} className="failure" /> Declined</span>)}
                                            </div>
                                            <div>
                                                <h3>{job.title} <span>#{job.code}</span></h3>
                                                <h4>Student Name: <span> {job.candidateName}</span></h4>
                                                <h4>Student Email: <span> {job.candidateEmail}</span></h4>
                                                <p>{job.description.substring(0,250)}...</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            )
                        })}
                        {FilteredJobs && FilteredJobs.length < 1 && 
                        (<NothingToShow />)
                        }
                    </Col>
                </Row>
            </Col>
        </Container>
    )
}

export default HrOffers

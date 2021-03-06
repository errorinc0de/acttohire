import { faFileSignature } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { db, firebasevalue } from '../../firebase'
import Sidebar from './components/Sidebar'
import './styles/jobDetails.css'
function JobDet() {
    const {jobid} = useParams()
    const history = useHistory()
    const [jobDetails , setJobDetails]=useState()
    const [loading,setLoading] = useState(true)
    const [applied,setApplied] =useState(false)
    const [rejected,setRejected] =useState(false)
    const [accepted,setAccepted] =useState(false)

    const {currentUser} = useAuth()
    useEffect(()=>{
        if(jobid)
        {
            var unsubscribe = db.collection("jobListing").doc(jobid).onSnapshot((doc)=>{
                if(doc.exists)
                {
                    
                    doc.data().candidates.forEach(candidate => {
                        if(candidate.id === currentUser.uid)
                        {
                            setApplied(true)
                        }
                    });
                    doc.data().rejected.forEach(candidate => {
                        if(candidate.id === currentUser.uid)
                        {
                            setApplied(false)
                            setRejected(true)
                            setAccepted(false)
                        }
                    });
                    doc.data().accepted.forEach(candidate => {
                        if(candidate.id === currentUser.uid)
                        {
                            setApplied(false)
                            setRejected(false)
                            setAccepted(true)
                        }
                    });
                    setLoading(false)
                    setJobDetails(doc.data())
                }
                else
                {
                    history.push('/jobs')
                }
            })
        }else
        {
            history.push('/jobs')
        }

        return unsubscribe
    },[])

    function applyNow()
    {
        db.collection("jobListing").doc(jobid).update({
            candidates : firebasevalue.arrayUnion({
                id: currentUser.uid,
                name : currentUser.displayName
            })
        })
    }

    return (
        <>
        {!loading && (
            <Container fluid className="dashboard-body">
                <Row noGutters>
                    <Col lg={1} className="p-0">
                        <Sidebar />
                    </Col>
                    <Col lg={11} className="m-body">
                    <div className="page-header">
                        {jobDetails && jobDetails.company}
                    </div>
                    <div className="job-details">
                        <Row>
                            <Col lg={10}>
                                <h5>{jobDetails && jobDetails.title} <span>#{jobDetails && jobDetails.code}</span></h5>
                                <span className="tags">
                                {jobDetails && jobDetails.topic}
                                </span>
                                <span className="tags">
                                {jobDetails && jobDetails.duration}
                                </span>
                                <span className="tags">
                                {jobDetails && jobDetails.role}
                                </span>
                            </Col>
                            <Col lg={2}>

                                <h6>Payscale<br /><span>Rs. {jobDetails && jobDetails.payscale} /-</span></h6>
                                
                                {applied &&  <div className="text-info"><FontAwesomeIcon icon={faFileSignature} /> You have already applied</div>}
                                {rejected &&  <div className="text-danger"><FontAwesomeIcon icon={faFileSignature} /> Your application has been rejected. </div>}
                                {accepted && <div className="text-success"><FontAwesomeIcon icon={faFileSignature} /> Your application has been accepted. </div> }
                                {!applied && !rejected && !accepted && <Button variant="light" onClick={applyNow} className="floating-r-btn mr-5"><FontAwesomeIcon icon={faFileSignature} />Apply Now</Button>}
                                
                            </Col>
                        </Row>
                        <h3>Responsibilities</h3>
                        <p>{jobDetails && jobDetails.responsibility}</p>
                    </div>
                    <div className="queries-container">
                        <div className="queries">
                            <h6>For Queries :</h6>
                            <h5>{jobDetails && jobDetails.postedBy.name}</h5>
                            <h4>{jobDetails && jobDetails.postedBy.email}</h4>
                        </div>
                    </div>
                    </Col>
                </Row>
            </Container>
        )}
        </>
    )
}

export default JobDet

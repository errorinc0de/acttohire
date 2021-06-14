import { Col, Container, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import { Button } from 'react-bootstrap'
import { db, firebasevalue } from '../../firebase'
import { useAuth } from '../../context/AuthProvider'
import { faCheck, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PostJob from './components/PostJob'
import '../student/styles/awards.css'
import '../student/styles/Common.css'
import '../college/styles/collegedashboard.css'
import NothingToShow from '../../components/NothingToShow'

function HrDashboard() {
  const { currentUser } = useAuth()
  const { history } = useHistory()
  const [requests,setRequests] = useState([])
  const [show, setShow] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [inactiveJobs, setInActiveJobs] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where('postedBy.uid', '==', currentUser.uid ).onSnapshot((docs)=>{
      if(!docs.empty){
        setTotalJobs(docs.size)

        var request = []
        var active =0
        var inactive =0
        var processed =0

        docs.forEach((doc) => {
          processed++
          if(doc.data().isActive)
            active++
          else
            inactive++

          Object.entries(doc.data().candidates).forEach(candidate=>{
            var obj = {
              jobCode: doc.data().code,
              jobTitle: doc.data().title,
              jobId: doc.id,
              applicant: candidate[1]
            }
            request.push(obj)
          })
          
          if(processed === docs.size) 
          {
            setInActiveJobs(inactive)
            setActiveJobs(active)
          }
      })
      setRequests(request)
    }})
    return unsubscribe;
  },[])

  function acceptRequest(jobId, applicant, key) {
    db.collection("jobListing").doc(jobId).update({
      candidates: firebasevalue.arrayRemove(applicant),
      accepted: firebasevalue.arrayUnion({
        name: applicant.name,
        id: applicant.id
      })
    }).then(console.log("Success!"))
    .catch(err=>console.log(err));
  }

  function declineRequest(jobId, applicant, key) {
    db.collection("jobListing").doc(jobId).update({
      candidates: firebasevalue.arrayRemove(applicant),
      rejected: firebasevalue.arrayUnion({
        name: applicant.name,
        id: applicant.id
      })
    }).then(()=>{
      console.log("Success!")
    })
    .catch(err=>console.log(err));
  }

  return (
      <Container fluid className="dashboard-body">
        <Row noGutters>
          <Col lg={1}></Col>
          <Col lg={4} className="my-3 topic-container">
            <Container fluid>
              <Row className="heading-container my-3">
                <Col lg={12} className="heading">
                  Requests
                </Col>
              </Row>
              <Row className="my-1 my-5 card-container">
                {
                  requests && requests.length>0 && requests.map((request,key)=>{
                    return(
                      <Col lg={12} className="card m-1" key={key}>
                        <h5 className="mb-2">Name: {request.applicant.name}</h5>
                        <h6 className="my-2">Job Title: {request.jobTitle} </h6>
                        <h6 className="my-2">Job Code: {request.jobCode} </h6>
                        <div className="buttons mx-auto py-2">
                          <Button onClick={()=>history.push(`/profile/${request.applicant.id}`)} className="button-view-profile mx-2">View Profile <FontAwesomeIcon icon={faUser}/></Button>
                          <Button onClick={()=>{acceptRequest(request.jobId,request.applicant,key)}} className="button-accept-profile mx-2">Accept <FontAwesomeIcon icon={faCheck} /></Button>
                          <Button onClick={()=>{declineRequest(request.jobId,request.applicant,key)}} className="button-decline-profile mx-2">Reject <FontAwesomeIcon icon={faTimes} /></Button>
                        </div>
                      </Col>
                    )
                  })
                }
                {requests && requests.length<1 &&(
                  <NothingToShow />
                )}
              </Row>
            </Container>
          </Col>
          <Col lg={7} className="main-dashboard-container my-5">
              <Container fluid>
                  <Row className="my-3">
                  <Col lg={4} xs={12}>
                      <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                          <h6> Total Jobs </h6>
                          <h2>{totalJobs}</h2>
                      </div>
                      </div>
                  </Col>
                  <Col lg={4} xs={12}>
                      <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                          <h6> Active Jobs </h6>
                          <h2>{activeJobs}</h2>
                      </div>
                      </div>
                  </Col>
                  <Col lg={4} xs={12}>
                      <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                          <h6> Inactive / Past Jobs </h6>
                          <h2>{inactiveJobs}</h2>
                      </div>
                      </div>
                  </Col>
                  <Col lg={12} xs={12}>
                      <div className="dashboard-card-theme">
                      <div className={(currentUser && currentUser.activePlan === 'Gold') ? "dashboard-card-theme-container gold-bg" :(currentUser && currentUser.activePlan === 'Bronze')? "dashboard-card-theme-container bronze-bg":"dashboard-card-theme-container silver-bg"}>
                          <h6> Current Active Plan </h6>
                          <h2>{currentUser && currentUser.activePlan}</h2>
                          <span>Quota : {currentUser && currentUser.quota}</span>
                          <span className="validity">Valid upto: {currentUser && currentUser.expireDate?.toDate().toString().substring(0,15)}</span>
                      </div>
                      </div>
                  </Col>
                  </Row>
              </Container>
              </Col>
              <Col lg={1} className="p-0">
                <Sidebar />
              </Col>
          </Row>
          <Button className="floating-r-btn" variant="light" onClick={handleShow}>POST JOBS</Button>
          <PostJob show={show} onHide={handleClose} /> 
      </Container>
    )
}

export default HrDashboard;

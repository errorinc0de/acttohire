import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'
import PostJob from './components/PostJob'
import NothingToShow from '../../components/NothingToShow'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Hr_jobs() {
    const [Jobs, SetJobs]=useState([])
    const [FilteredJobs, SetFilteredJobs]=useState()
    const [toggle, setToggle] = useState(false)
    const toggleState = (toggle) => setToggle(!toggle);
    const {currentUser}=useAuth()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(()=>{
        var unsubscribe= db.collection("jobListing").where("postedBy.uid","==", currentUser.uid).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var Jobsarr=[]
                docs.forEach(doc=> {
                    Jobsarr.push({id:doc.id,...doc.data()})
                    
                });
                SetJobs(Jobsarr)
                SetFilteredJobs(Jobsarr)
            }
            else
                SetFilteredJobs([])
        })
        return unsubscribe
    },[])

    function deletePost(postId)
    {
        db.collection("jobListing").doc(postId).delete()
    }
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

        <Container fluid className="dashboard-body">
        <Row noGutters>
          <Col lg={1} className="p-0">
              <Sidebar />
          </Col>
          <Col lg={11} className="m-body">
              <div className="page-header">
                 Jobs
              </div>
              <Button className="floating-r-btn" variant="light" onClick={handleShow}>POST JOBS</Button>
              <Container fluid>
                  <Row>
                      <Col lg={12} className="p-0">
                      <Form.Group controlId="formSearch">
                          <Form.Control type="text" placeholder="Search Jobs" onChange={(e)=>{handleFilter(e.target.value)}}  />
                      </Form.Group>
                      </Col>
                  </Row>
              </Container>
                      {FilteredJobs && FilteredJobs.length > 0 && FilteredJobs.map((job , key)=>{
                          return (
                            <Container fluid key={key} className="award-container">
                                <Row>
                                    <Link to={'/hr-jobs/'+job.id}>
                                        <Col lg={12} className="p-0">
                                            <div>
                                                <h3>{job.title} <span>#{job.code}</span></h3>
                                                <h4>By : <span> {job.company}</span></h4>
                                                <p>{job.responsibility.substring(0,250)}...</p>
                                                <h5>Posted on : <span>{job.postedOn?.toDate().toString().substring(0, 10)}</span></h5>
                                            </div>
                                        </Col>
                                    </Link>
                                    <Button variant="light" className="delete-btn" onClick={()=>{deletePost(job.id)}}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                                </Row>
                            </Container>
                          )
                      })}
                      {FilteredJobs && FilteredJobs.length < 1 && 
                      (<NothingToShow />)
                      }
          </Col>
          </Row>
          <PostJob show={show} onHide={handleClose} /> 
      </Container>
    )
}

export default Hr_jobs
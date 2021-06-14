import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'

function College_jobs() {
    const [Jobs, SetJobs]=useState()
    const [FilteredJobs, SetFilteredJobs]=useState()
    useEffect(()=>{
        var unsubscribe= db.collection("jobListing").where("isActive","==", true).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var Jobsarr=[]
                docs.forEach(doc=> {
                    Jobsarr.push({id:doc.id,...doc.data()})
                    
                });
                SetJobs(Jobsarr)
                SetFilteredJobs(Jobsarr)
            }
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

        <Container fluid className="dashboard-body">
        <Row noGutters>
          <Col lg={1} className="p-0">
              <Sidebar />
          </Col>
          <Col lg={11} className="m-body">
              <div className="page-header">
                 Jobs
              </div>
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
                              <Link to={'/college-job/'+job.id}><Container fluid key={key}>
                                  <Row>
                                      <Col lg={12} className="p-0">
                                          <div className="award-container">
                                              <h3>{job.title} <span>#{job.code}</span></h3>
                                              <h4>By : <span> {job.company}</span></h4>
                                              <p>{job.responsibility.substring(0,250)}...</p>
                                              <h5>Posted on : <span>{job.postedOn.toDate().toString().substring(0, 15)}</span></h5>
                                          </div>
                                      </Col>
                                  </Row>
                              </Container></Link>
                          )
                      })}
          </Col>
          </Row>
      </Container>
    )
}

export default College_jobs

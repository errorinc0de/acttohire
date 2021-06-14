import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'
import './styles/awards.css' 
function Job() {

    const [jobList,setJobList] =useState()
    const [filteredJobList,setFilteredJobList] =useState()

    const {currentUser} = useAuth()

    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            var unsubscribe = db.collection("jobListing").where("isActive","==",true).onSnapshot((docs)=>{
                if(!docs.empty)
                {
                    var jobs = []

                    docs.forEach(doc => {
                        jobs.push({id:doc.id,...doc.data()})
                    });
                    console.log(jobs)
                    setJobList(jobs)
                    setFilteredJobList(jobs)
                }
              })
          
              return unsubscribe
        }
    },[currentUser])

    function handleFilter(keyword)
    {
        if (keyword === "")
        {
            setFilteredJobList(jobList)
        }
        else 
        {
            var newArray=jobList.filter(job => 
                job.title.toLowerCase().includes(keyword.toLowerCase()) 
            || job.responsibility.toLowerCase().includes(keyword.toLowerCase())
            || job.code.toLowerCase().includes(keyword.toLowerCase())
            || job.company.toLowerCase().includes(keyword.toLowerCase())
            || job.topic.toLowerCase().includes(keyword.toLowerCase())
            || job.location.toLowerCase().includes(keyword.toLowerCase())
            )
            setFilteredJobList(newArray)
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
                            <Form.Control type="text" placeholder="Search Achievement" onChange={(e)=>handleFilter(e.target.value)} />
                        </Form.Group>
                        </Col>
                    </Row>
                </Container>
                        {filteredJobList && filteredJobList.length > 0 && filteredJobList.map((job , key)=>{
                            return (
                                <Link to={'/job/'+job.id}><Container fluid key={key}>
                                    <Row>
                                        <Col lg={12} className="p-0">
                                            <div className="award-container">
                                                <h3>{job.title} <span>#{job.code}</span></h3>
                                                <h4>By : <span> {job.company}</span></h4>
                                                <p>{job.responsibility.substring(0,250)}...</p>
                                                <h5>Posted on : <span>{job.postedOn.toDate().toString().substring(0, 10)}</span></h5>
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

export default Job

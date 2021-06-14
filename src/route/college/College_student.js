import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'

function College_student() {

    const [users, Setusers]=useState()
    const [Filteredusers, SetFilteredusers]=useState()
    const{currentUser}=useAuth()
    useEffect(()=>{
        var unsubscribe= db.collection("users").where("collegeUid","==", currentUser.uid).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var userarr=[]
                docs.forEach(doc=> {
                    userarr.push(doc.data())
                    
                });
                Setusers(userarr)
                SetFilteredusers(userarr)
            }
        })
        return unsubscribe
    },[])
        function handleFilter(keyword){
            if(keyword==="")
            SetFilteredusers(users)
            else
            {
                var Filteredarr= users.filter(user=>
                    user.displayName.toLowerCase().includes(keyword.toLowerCase())
                   
                    || user.email.toLowerCase().includes(keyword.toLowerCase())
                    || user.rollno.toLowerCase().includes(keyword.toLowerCase())
                    || user.universityRoll.toLowerCase().includes(keyword.toLowerCase())
                    || user.uid.toLowerCase().includes(keyword.toLowerCase())
                    
                    
                    )

                SetFilteredusers(Filteredarr)
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
                 Student Details
              </div>
              <Container fluid>
                  <Row>
                      <Col lg={12} className="p-0">
                      <Form.Group controlId="formSearch">
                          <Form.Control type="text" placeholder="Search student details" onChange={(e)=>{handleFilter(e.target.value)}}  />
                      </Form.Group>
                      </Col>
                  </Row>
              </Container>
                      {Filteredusers && Filteredusers.length > 0 && Filteredusers.map((student , key)=>{
                          return (
                              <Link to={'/profile/'+student.uid}><Container fluid key={key}>
                                  <Row>
                                      <Col lg={12} className="p-0">
                                          <div className="award-container">
                                          {student.isHired &&(<span className="tags">Hired</span>)}
                                              <h3>{student.displayName} <span>#{student.rollno}</span></h3>
                                              <h4>Email: <span> {student.email}</span></h4>
                                              <h5>Graduation Date: <span> {student.gradDate}</span></h5>
                                              {student.universityRoll && <div className="tags bg-theme text-light">{student.universityRoll}</div>}
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



export default College_student

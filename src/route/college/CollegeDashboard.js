import { Col, Container, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import './styles/collegedashboard.css'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthProvider'
import NothingToShow from '../../components/NothingToShow'
function CollegeDashboard() {

  const [activeJobsCount, setActiveJobsCount] =useState(0)
  const [studentCount, setStudentCount] =useState(0)
  const [unemployedStudentCount, setUnemployedStudentCount] =useState(0)
  const [employedStudentCount, setEmployedStudentCount] =useState(0)
  const [topics, setTopics] =useState([])
  const [users,setUsers]=useState([])
  const [topicCount,setTopiCount]=useState([])

  const {currentUser} = useAuth()

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where("isActive","==",true).onSnapshot((docs)=>{
      setActiveJobsCount(docs.size)
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    var unsubscribe = db.collection("users").where("collegeUid","==",currentUser.uid).onSnapshot((docs)=>{
      setStudentCount(docs.size)

      var unempoyedCount = 0
      var employedCount = 0
      var studentData=[]

      var topic = []
      docs.forEach((doc)=>{

        studentData.push(doc.data())
        var data = doc.data()
        if(data.isHired === false)
        {
          unempoyedCount++
        }else
        {
          employedCount++;
        }
        var topicList = data.topicList 

        if(topicList){
          topicList.forEach((topicitem)=>{
            if(topic.indexOf(topicitem) === -1)
            {
                topic.push(topicitem)
            }
          })
        }
        
      })
      
      setUsers(studentData)
      setTopics(topic)
      setUnemployedStudentCount(unempoyedCount)
      setEmployedStudentCount(employedCount)
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    if(users && topics)
    {
        var topicCount=[]
        topics.forEach((topic)=>{
          var count = 0;
          users.forEach((user)=>{
            if(user.topicList.indexOf(topic) !== -1)
            {
              count++;
            }
          })
          topicCount.push(count)
        })
        setTopiCount(topicCount)
    }
  },[users,topics])

    return (
        <Container fluid className="dashboard-body">
          <Row noGutters>
          <Col lg={1} className="p-0">
            </Col>
            <Col lg={3} className="my-3 topic-container">
              <Container fluid>
              <Row className="heading-container mt-3">
                    <Col lg={12} className="heading">
                      Student Topics
                    </Col>
              </Row>
                {topics && topics.length > 0 && topics.map((topic,index)=>{
                  return(
                    <Row className="m-1 my-5 topic">
                      <Col lg={12} className="info">
                        {topic}
                        <h6>{topicCount[index]}</h6>
                      </Col>
                    </Row>
                  )
                })}
                {topics && topics.length <1 && (
                  <NothingToShow />
                )}
              </Container>
            </Col>
            <Col lg={8} className="m-body main-dashboard-container">
              <Container fluid>
                <Row className="my-3">
                  <Col lg={6} xs={12}>
                    <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                        <h6>Total Students</h6>
                        <h2>{studentCount}</h2>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xs={12}>
                    <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                        <h6>Active Jobs</h6>
                        <h2>{activeJobsCount}</h2>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col lg={6} xs={12}>
                    <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                        <h6>Un-Employed Students</h6>
                        <h2>{unemployedStudentCount}</h2>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} xs={12}>
                    <div className="dashboard-card-theme">
                      <div className="dashboard-card-theme-container">
                        <h6>Employed Students</h6>
                        <h2>{employedStudentCount}</h2>
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
        </Container>
    )
}

export default CollegeDashboard

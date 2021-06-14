import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import { db, firebasevalue, timestamp } from '../../firebase'
import { useAuth } from '../../context/AuthProvider'
import { ToastContainer, toast } from 'react-toastify';
// import './styles/dashboard.css'
function Dashboard() {

  const {currentUser} = useAuth()

  const [topics,setTopics]=useState()
  const [loading,setLoading]=useState(false)
  const [selectedTopic, setSelectedTopic] =useState(null)
  const [availableJobsCount,setAvailableJobsCount] = useState(0)
  const [appliedJobsCount,setAppliedJobsCount] = useState(0)
  const [acceptedJobsCount,setAcceptedJobsCount] = useState(0)
  const [rejectedJobsCount,setRejectedJobsCount] = useState(0)
  const [posts, setPosts] =useState([])

  const postRef = useRef()
  const keywordsRef =useRef()

  useEffect(()=>{
    var unsubscribe = db.collection("appData").doc("appData").onSnapshot((docs)=>{
      if(docs.exists)
      {
        setTopics(docs.data().topics)
      }
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where("isActive","==",true).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        setAvailableJobsCount(docs.size)
      }
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where("candidates","array-contains",{id:currentUser.uid,name:currentUser.displayName}).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        setAppliedJobsCount(docs.size)
      }
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where("accepted","array-contains",{id:currentUser.uid,name:currentUser.displayName}).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        setAcceptedJobsCount(docs.size)
      }
    })
    return unsubscribe
  },[])

  useEffect(()=>{
    var unsubscribe = db.collection("jobListing").where("rejected","array-contains",{id:currentUser.uid,name:currentUser.displayName}).onSnapshot((docs)=>{
      if(!docs.empty)
      {
        setRejectedJobsCount(docs.size)
      }
    })
    return unsubscribe
  },[])

  function postNow(e)
  {
    e.preventDefault()

    setLoading(true)
    db.collection("posts").add({
      post : postRef.current.value,
      topic:selectedTopic,
      keywords:keywordsRef.current.value,
      addedOn:timestamp,
      topicList:firebasevalue.arrayUnion(selectedTopic),
      author :{
        uid:currentUser.uid,
        displayName:currentUser.displayName  
      },
    }).then(()=>{
      setLoading(false)
      toast.success('Your activity has been recorded', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        setSelectedTopic(null)
        postRef.current.value=''
        keywordsRef.current.value=''
    }).catch((error)=>{console.error(error)})



    
    if(currentUser.topics.hasOwnProperty(selectedTopic))
    {
      db.collection("users").doc(currentUser.uid).update({
      topicList:firebasevalue.arrayUnion(selectedTopic),
      ["topics."+selectedTopic+".count"]:firebasevalue.increment(1),
      ["topics."+selectedTopic+".points"]:firebasevalue.increment(5)
      })
    }
    else
    {
      db.collection("users").doc(currentUser.uid).update({
        points: firebasevalue.increment(5),
        topicList:firebasevalue.arrayUnion(selectedTopic),
        ["topics."+selectedTopic]:{
            label:selectedTopic,
            count: firebasevalue.increment(1),
            points:firebasevalue.increment(5)
        }})
    }
  }

  useEffect(()=>{
    var unsubscribe = db.collection("posts").where("author.uid","==",currentUser.uid).orderBy("addedOn","desc").onSnapshot((docs)=>{
      if(!docs.empty)
      {
          var postsList=[]
          docs.forEach((doc)=>{
            postsList.push(doc.data())
          })
          setPosts(postsList)
      }
    })

    return unsubscribe
  },[])

    return (
        <Container fluid className="dashboard-body">
          <Row noGutters>
            <Col lg={1} className="p-0">
              <Sidebar />
            </Col>
            <Col lg={11} className="m-body">
                <div className="page-header">
                   Dashboard
                </div>
                <Container fluid>
                  <Row>
                    <Col lg={3}>
                      <div className="stats-card">
                        Available Jobs
                        <span>{availableJobsCount}</span>
                      </div>
                    </Col>
                    <Col lg={3}>
                    <div className="stats-card">
                        Applied Jobs
                        <span>{appliedJobsCount}</span>
                    </div>
                    </Col>
                    <Col lg={3}>
                    <div className="stats-card">
                        Accepted Jobs
                        <span>{acceptedJobsCount}</span>
                    </div>
                    </Col>
                    <Col lg={3}>
                    <div className="stats-card">
                        Rejected Jobs
                        <span>{rejectedJobsCount}</span>
                    </div>
                    </Col>
                    
                  </Row>
                </Container>
                <Container fluid>
                  <Row>
                    <Form onSubmit={postNow}>
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows={7} placeholder="what's your today's activity ?" ref={postRef} />
                      </Form.Group>
                      <Form.Group controlId="formgender">
                        <Form.Label>Topic</Form.Label>
                        <div className="ml-1">
                          {topics && topics.map((topic,key)=>{
                            return(
                              <Button variant="light" className={selectedTopic === topic?("styled-radio styled-radio-selected mr-2"):("styled-radio mr-3")} key={key} onClick={()=>{setSelectedTopic(topic)}}>
                                {topic}
                              </Button>
                            )
                          })}
                        </div>
                      </Form.Group>
                      <Form.Group controlId="formBasicEmail" >
                        <Form.Label>Keywords</Form.Label>
                        <Form.Control type="text" placeholder="html,css,js" ref={keywordsRef} />
                      </Form.Group>
                            <Button variant="primary" disabled ={loading} className="theme-btn" type="submit">
                              {loading?(
                                  <Spinner animation="border" role="status">
                                  <span className="sr-only">Loading...</span>
                                </Spinner>):(
                                  <>
                                  Let the world Know !!
                                  </>
                              )}
                             </Button>  
                    </Form>
                  </Row>
                </Container>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  />
                <div className="bio-holder">
                            <h4>My posts </h4>
                            {posts && posts.length>0 && posts.map((post)=>{
                                    return (<div className="post-container">
                                        <p>{post.post}</p>
                                        <h6>{post.topic}</h6>
                                        <h5>{post.addedOn && post.addedOn.toDate().toString().substring(0,15)}</h5>
                                    </div>)
                                })}
                </div>
            </Col>
          </Row>
        </Container>
    )
}

export default Dashboard

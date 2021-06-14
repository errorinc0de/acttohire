import { Container,Row , Col, Button, Form, Modal,Spinner } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { db,timestamp } from '../../../firebase'
import { useAuth } from "../../../context/AuthProvider"
import '../styles/downloadData.css'

function PostJob(props) {
    const JobCodeRef = useRef();
    const DurationRef = useRef();
    const LocationRef = useRef();
    const PayscaleRef = useRef();
    const ResponsibilityRef = useRef();
    const RoleRef = useRef();
    const TitleRef = useRef();
    const {currentUser} = useAuth();
    const [topics,setTopics]=useState()
    const [loading,setLoading] = useState(false)
    const [selectedTopic, setSelectedTopic] =useState(null)
    const [error ,setError] = useState()
    

    function handleClose()
    {
        props.onHide()
    }

    function PostJobs(event) {
        event.preventDefault();
        setLoading(true);

        if(!selectedTopic)
        {
            setError(true)
            setLoading(true)
            return;
        }
        db.collection("jobListing").add({
            title: TitleRef.current.value,
            topic: selectedTopic,
            role: RoleRef.current.value,
            company: currentUser.company,
            code: JobCodeRef.current.value,
            duration: DurationRef.current.value,
            location: LocationRef.current.value,
            payscale: PayscaleRef.current.value,
            responsibility: ResponsibilityRef.current.value,
            postedBy: {
                name: currentUser.displayName,
                uid: currentUser.uid
            },
            isActive: true,
            postedOn: timestamp,
            candidates: [],
            accepted: [],
            rejected: []
        }).then(()=>{
            props.onHide();
            setLoading(false)
        }).catch(()=>{setLoading(false)})
    }

    useEffect(()=>{
        var unsubscribe = db.collection("appData").doc("appData").onSnapshot((docs)=>{
          if(docs.exists)
          {
            setTopics(docs.data().topics)
          }
        })
    
        return unsubscribe
    },[])

    return (
        <Modal size="xl" centered show={props.show} onHide={handleClose}>
            <Modal.Header className="post-job-modal-head">
                <Modal.Title>Post New Job</Modal.Title>
            </Modal.Header>
            <Modal.Body className="post-job-modal-body">
                <Form className="post-job-form" onSubmit={PostJobs}>
                    <Container fluid>
                        <Row noGutters>
                            <Col lg={6}>
                            <Form.Group controlId="TitleId" className="my-2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter Job Title" className="form-field" ref={TitleRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="RoleId" className="my-2">
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select" className="form-field" placeholder="Enter Job Title"  ref={RoleRef} required>
                                    <option value = "Full-Time">Full-Time</option>
                                    <option value = "Part-Time">Part-Time</option>
                                    <option value = "Internship">Internship</option>
                                    <option value = "Contract Based">Contract Based</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="LocationId" className="my-2">
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" className="form-field" placeholder="Enter Job Location" ref={LocationRef} required />
                            </Form.Group>
                            <Form.Group controlId="TopicId" className="my-2">
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
                            </Col>
                            <Col>
                            <Form.Group controlId="CodeId" className="my-2">
                                <Form.Label>Job Code</Form.Label>
                                <Form.Control type="text" className="form-field" placeholder="Enter Job Code" ref={JobCodeRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="DurationId" className="my-2">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type="text" className="form-field" placeholder="Enter Job Duration" ref={DurationRef} required />
                            </Form.Group>
                            <Form.Group controlId="PayscaleId" className="my-2">
                                <Form.Label>Salary</Form.Label>
                                <Form.Control type="number" className="form-field" placeholder="Enter Salary in INR" min={100} ref={PayscaleRef} required />
                            </Form.Group>
                            <Form.Group controlId="ResponsibilityId" className="my-2">
                                <Form.Label>Job Responsibility</Form.Label>
                                <Form.Control as="textarea" rows={5} className="form-field" placeholder="Enter Job Responsibility" ref={ResponsibilityRef} required />
                            </Form.Group>
                            
                            </Col>
                        </Row>
                    </Container>
                    {error && <div className="error">Please Select a topic</div>}
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary" className="theme-btn my-4 px-3" disabled={loading}>
                        {loading?(
                            <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                            </Spinner>):(
                            <>
                            Post opportunity 
                            </>
                        )}
                            
                        </Button>
                        <Button variant="danger" className=" w-25 my-4 mx-3 px-3" onClick={handleClose} disabled={loading}>
                            Close
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default PostJob

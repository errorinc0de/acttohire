import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../context/AuthProvider'
import { db,firebasevalue, timestamp } from '../../../firebase'

function AddAwardsModal(props) {

    const titleRef=useRef()
    const organizationRef=useRef()
    const descriptionRef=useRef()
    const dateRef=useRef()
    const credentialIdRef=useRef()
    const credentialURLRef=useRef()
    const [topics,setTopics]=useState()
    const [loading,setLoading]=useState(false)
    const [selectedTopic, setSelectedTopic] =useState(null)

    const {currentUser}=useAuth()

    function handleClose()
    {
        props.onHide()
    }

    function handleSubmit(e)
    {
        e.preventDefault()
        setLoading(true)

        if(currentUser.topics.hasOwnProperty(selectedTopic))
        {
            if(credentialURLRef.current.value)
            {
                db.collection("users").doc(currentUser.uid).update({
                    ["awards."+credentialIdRef.current.value]:{
                    title : titleRef.current.value,
                    description:descriptionRef.current.value,
                    issuedBy:organizationRef.current.value,
                    credentialID:credentialIdRef.current.value,
                    issuedOn:dateRef.current.value,
                    credentialURL:credentialURLRef.current.value,
                    addedOn:timestamp,
                    topic: selectedTopic},
                    topicList:firebasevalue.arrayUnion(selectedTopic),
                    ["topics."+selectedTopic+".count"]:firebasevalue.increment(1),
                    ["topics."+selectedTopic+".points"]:firebasevalue.increment(22),
                }).then(()=>{
                                    handleClose()
                                    setLoading(false)
                        })
            }else
            {
                    db.collection("users").doc(currentUser.uid).update({
                        ["awards."+credentialIdRef.current.value]:{
                        title : titleRef.current.value,
                        description:descriptionRef.current.value,
                        issuedBy:organizationRef.current.value,
                        credentialID:credentialIdRef.current.value,
                        issuedOn:dateRef.current.value,
                        addedOn:timestamp,
                        topic: selectedTopic},
                        topicList:firebasevalue.arrayUnion(selectedTopic),
                        ["topics."+selectedTopic+".count"]:firebasevalue.increment(1),
                        ["topics."+selectedTopic+".points"]:firebasevalue.increment(20),
                    }).then(()=>{
                                    handleClose()
                                    setLoading(false)
                    })
            }
        }
        else
        {
            if(credentialURLRef.current.value)
        {
            db.collection("users").doc(currentUser.uid).update({
                ["awards."+credentialIdRef.current.value]:{
                title : titleRef.current.value,
                description:descriptionRef.current.value,
                issuedBy:organizationRef.current.value,
                credentialID:credentialIdRef.current.value,
                issuedOn:dateRef.current.value,
                credentialURL:credentialURLRef.current.value,
                addedOn:timestamp,
                topic: selectedTopic},
                topicList:firebasevalue.arrayUnion(selectedTopic),
                ["topics."+selectedTopic]:{
                    label:selectedTopic,
                    count: firebasevalue.increment(1),
                    points: firebasevalue.increment(22)
                }
            }).then(()=>{

                            handleClose()
                            setLoading(false)
                })
        }else
        {
            db.collection("users").doc(currentUser.uid).update({
                ["awards."+credentialIdRef.current.value]:{
                title : titleRef.current.value,
                description:descriptionRef.current.value,
                issuedBy:organizationRef.current.value,
                credentialID:credentialIdRef.current.value,
                issuedOn:dateRef.current.value,
                addedOn:timestamp,
                topic: selectedTopic},
                topicList:firebasevalue.arrayUnion(selectedTopic),
                ["topics."+selectedTopic]:{
                    label:selectedTopic,
                    count: firebasevalue.increment(1),
                    points: firebasevalue.increment(20)
                }
            }).then(()=>{
                            handleClose()
                            setLoading(false)
            })
        }
        }
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
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Give your achievement title" ref={titleRef} required />
                        </Form.Group>
                        <Form.Group controlId="issuingOrganization">
                            <Form.Label>Issuing organization </Form.Label>
                            <Form.Control type="text" placeholder="Ex. IBM" ref={organizationRef} required />
                        </Form.Group>
                        <Form.Group controlId="achievement">
                            <Form.Control as="textarea" placeholder="Describe your achievement" ref={descriptionRef} rows = {3} required/>
                        </Form.Group>
                        <Form.Group controlId="issuingOrganization">
                            <Form.Label>Issue Date </Form.Label>
                            <Form.Control type="month" ref={dateRef} required />
                        </Form.Group>
                        <Form.Group controlId="issuingOrganization">
                            <Form.Label>Credential ID</Form.Label>
                            <Form.Control type="text" ref={credentialIdRef} required />
                        </Form.Group>
                        <Form.Group controlId="issuingOrganization">
                            <Form.Label>Credential URL</Form.Label>
                            <Form.Control type="url" ref={credentialURLRef} />
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
                        <div className="d-flex align-items-center justify-content-center ml-auto">
                            <Button type="submit" disabled={loading} variant="primary" className="bg-theme-1 theme-btn my-4">
                            {loading?(
                                  <Spinner animation="border" role="status">
                                  <span className="sr-only">Loading...</span>
                                </Spinner>):(
                                  <>
                                  Let the world Know !!
                                  </>
                              )}
                            </Button>
                            <Button variant="secondary" className="bg-theme-1 w-100 my-4 mx-2" onClick={handleClose}>
                                    Close
                            </Button>
                        </div>
                    </Form>
            </Modal.Body>      
                
        </Modal>
    )
}

export default AddAwardsModal

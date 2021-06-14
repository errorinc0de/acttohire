import { Button, Form, Modal, Row } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { db, firebasevalue } from '../../../firebase'
import { useAuth } from "../../../context/AuthProvider"
import '../styles/downloadData.css'

function MakeOffer(props) {
    
    const JobCodeRef = useRef();
    const DurationRef = useRef();
    const LocationRef = useRef();
    const PayscaleRef = useRef();
    const ResponsibilityRef = useRef();
    const RoleRef = useRef();
    const TitleRef = useRef();
    const [loading,setLoading] = useState(false)
    const {currentUser} = useAuth()

    function handleClose() {
        props.onHide();
    }

    function handleMakeOffer(event){
        event.preventDefault();
        setLoading(true);
        db.collection("users").doc(props.data.id).update({
            offers: firebasevalue.arrayUnion({
                company: currentUser.company,
                email: currentUser.email,
                name: currentUser.displayName,
                description: ResponsibilityRef.current.value,
                title: TitleRef.current.value,
                role: RoleRef.current.value,
                code: JobCodeRef.current.value,
                duration: DurationRef.current.value,
                location: LocationRef.current.value,
                payscale: PayscaleRef.current.value,
                responsibility: ResponsibilityRef.current.value
            })
        }).then(()=>{
            props.onHide();
            setLoading(false)
        }).catch(()=>{setLoading(false)})
    }

    return (
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Header>
                Make Offer Form
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleMakeOffer}>
                    <Form.Group controlId="TitleId" className="my-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Job Title" className="form-field" ref={TitleRef} required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="RoleId" className="my-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control as="select" className="form-field" custom placeholder="Enter Job Title" className="mx-3" ref={RoleRef} required>
                            <option value = "Full-Time">Full-Time</option>
                            <option value = "Part-Time">Part-Time</option>
                            <option value = "Internship">Internship</option>
                            <option value = "Contract Based">Contract Based</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="CodeId" className="my-2">
                        <Form.Label>Job Code</Form.Label>
                        <Form.Control type="text" className="form-field" placeholder="Enter Job Code" ref={JobCodeRef} required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="LocationId" className="my-2">
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" className="form-field" placeholder="Enter Job Location" ref={LocationRef} required />
                    </Form.Group>
                    <Form.Group controlId="DurationId" className="my-2">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type="text" className="form-field" placeholder="Enter Job Duration" ref={DurationRef} required />
                    </Form.Group>
                    <Form.Group controlId="PayscaleId" className="my-2">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="number" className="form-field" placeholder="Enter Salary in INR" min={100} ref={PayscaleRef} required />
                    </Form.Group>
                    <Form.Group controlId="ResponsibilityId">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="Enter Job Description" ref={ResponsibilityRef}/>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="primary" className="my-4 px-3" disabled={loading}>
                            Send
                        </Button>
                        <Button variant="danger" className="my-4 mx-3 px-3" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Form>
                {console.log(props.data)}
            </Modal.Body>
        </Modal>
    )
}

export default MakeOffer

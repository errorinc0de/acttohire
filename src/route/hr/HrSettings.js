import React from 'react'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'
import { ToastContainer, toast } from 'react-toastify';
import { db } from '../../firebase';
import Sidebar from './components/Sidebar'

function College_Settings() {
    const [step,setStep]=useState(1)
    const [loading,setLoading]=useState(false)

    const companyRef = useRef()
    const countryRef = useRef()
    const stateRef = useRef()
    const contactRef = useRef()
    const nameRef = useRef()
    const history = useHistory()
    const {currentUser}= useAuth()

    function handleUpdate(e){
        e.preventDefault()
        setLoading(true)
        console.log(currentUser)
        db.collection("users").doc(currentUser.uid).update({
            contact: contactRef.current.value,
            state: stateRef.current.value,
            country: countryRef.current.value,
            company: companyRef.current.value,
            displayName: nameRef.current.value
        }).then(()=>{
            toast.success('Your details has been updated', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            setLoading(false)
        })

    }
    
    return (
        <Container fluid>
            <Row noGutters>
                <Col lg={1} className="p-0">
                    <Sidebar />
                </Col>
                <Col lg={11} className="m-body">
                    <div className="page-header">
                        Settings
                    </div>
                    <Container fluid>
                        <Row noGutters>
                            <Col lg={6} xs={12}>
                                <Form className="hr_register_form" onSubmit={handleUpdate}>
                                    <Form.Group controlId="register_name">
                                        <Form.Label> Your Name </Form.Label>
                                        <Form.Control type="text" placeholder="Enter your name" defaultValue={currentUser.displayName} ref={nameRef} required />
                                    </Form.Group>
                                    <Form.Group controlId="register_name_company">
                                        <Form.Label> Company Name </Form.Label>
                                        <Form.Control type="text" placeholder="Enter the name of the company" defaultValue={currentUser.company} ref={companyRef} required />
                                    </Form.Group>
                                    <Form.Group controlId="register_number">
                                        <Form.Label> Contact Number</Form.Label>
                                        <Form.Control type="number" placeholder="Enter your phone number" ref={contactRef} maxLength={10} defaultValue={currentUser.contact} required />
                                    </Form.Group>
                                    <Form.Group controlId="register_country">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control type="text" placeholder="Country" ref={countryRef} defaultValue={currentUser.country} required/>
                                    </Form.Group>
                                    <Form.Group controlId="register_state">
                                        <Form.Label> State</Form.Label>
                                        <Form.Control type="text" placeholder="State" ref={stateRef} defaultValue={currentUser.state} required/>
                                    </Form.Group>
                                    <Button variant="primary" disabled ={loading} className="theme-btn my-3" type="submit">
                                        {loading?(
                                            <Spinner animation="border" role="status">
                                            <span className="sr-only">Loading...</span>
                                          </Spinner>):(
                                            <>
                                            Update settings <FontAwesomeIcon icon={faAngleRight}/>
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Col>
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
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default College_Settings

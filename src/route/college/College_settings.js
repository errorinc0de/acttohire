import React, { useState } from 'react'
import  {useRef} from 'react'
import { Button, Col, Container, Form, Row,Spinner} from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'
import { db } from '../../firebase';
import Sidebar from './components/Sidebar'
import { ToastContainer, toast } from 'react-toastify';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function College_settings() {

    const Contact_clgRef=useRef()
    const College_nameRef=useRef()
    const College_addRef=useRef()
    const College_extraRef=useRef()
    const {currentUser}= useAuth()

    const [loading,setLoading]=useState(false) 

    function handleRegister1(e){
        e.preventDefault()
        setLoading(true)
        db.collection("users").doc(currentUser.uid).update({
            displayName: College_nameRef.current.value,
            contact: Contact_clgRef.current.value,
            clg_address: College_addRef.current.value,
            extras: College_extraRef.current.value
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
        <Container fluid className="dashboard-body">
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
                      <Col lg={12} className="p-0">
                      <Form onSubmit={handleRegister1}  className="w-50">
                            <Form.Group controlId="formBasicName" >
                                <Form.Label>College Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" defaultValue={currentUser.displayName} ref={College_nameRef} required/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicName" >
                                <Form.Label>College Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter Address" defaultValue={currentUser.clg_address} ref={College_addRef} required />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPhonenumber">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="text" placeholder="Enter Phone number" defaultValue={currentUser.contact} ref={Contact_clgRef} required/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPhonenumber">
                                <Form.Label>Extras</Form.Label>
                                <Form.Control as="textarea" rows={5} placeholder="Extras" defaultValue={currentUser.extras} ref={College_extraRef} required/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" disabled ={loading} className="theme-btn" type="submit">
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

                      </Col>
                  </Row>
              </Container>
        </Col>
        </Row>
    </Container>
    )
}

export default College_settings

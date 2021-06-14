import { faAngleRight, faArrowRight ,faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'

function College_registration() {

    const [step,setStep]=useState(1)
    const[loading,setLoading]=useState(false)

    const[error,setError]=useState(false)
    const [clg_name,setName]=useState()
    const [password,setPassword]=useState()
    const [email,setEmail]=useState()

    const clg_addressRef= useRef()
    const contactRef= useRef()
    const extrasRef= useRef()
    const history= useHistory()

    const {currentUser,College_registration}= useAuth()


    function handleRegister(e)
    {
        e.preventDefault()
        setLoading(true)
        if(!clg_name)
        {
            setError("Please enter your name")
            setLoading(false)
            return
        }
        else if(!email)
        {
            setError("Please enter your name")
            setLoading(false)
            return
        }
        else if(!password)
        {
            setError("Please enter your Password")
            setLoading(false)
            return
        }
        else if(!contactRef.current.value)
        {
            setError("Please enter your contact number")
            setLoading(false)
            return
        }
        else if(!clg_addressRef.current.value)
        {
            setError("Please enter your college address")
            setLoading(false)
            return 
        }
        else if(!extrasRef.current.value)
        {
            setError("Please enter anything you want to write")
            setLoading(false)
            return 
        }
        else
        {
            College_registration(clg_name,email,password,contactRef.current.value, clg_addressRef.current.value,extrasRef.current.value)
            .then(()=>history.push("/college-subscription")).catch((error)=>{
                setError(error.message)
                setLoading(false)
            })
        }
    }
    
    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            history.push("/college-subscription")
        }
    },[currentUser])
    return (
            <div className="login-container">
                <Container className="login-holder bg-white">
                    <Row>
                        <Col lg={5} className="login-pattern-container">
                            <div className="login-description">
                                <div className="brand">B-Plan</div>
                                <h1>Welcome to your world of success !!</h1>
                                <p>Join our network to keep track of your students and let them shine :) </p>
                                <div className="login-down">
                                    <h3>Don't have an account ?</h3>
                                    <Link to="/college-login">
                                        Sign Up Now {' '}
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </div>
                            </div> 
                        </Col>
                        <Col lg={7} className="d-flex align-items-center justify-content-center">
                            <div className="login-form-container">
                            <div className="login-form-top">
                            <h2>Register</h2>
                            {error && <div className="error">{error}</div>}
                            </div>
                        <ul className="progress-holder">
                            <li className={step===1 ? ("bg-theme text-light"):("pointer")} onClick={()=>{setStep(1)}} >1</li>
                            <li className={step===2 ?("bg-theme text-light"):("pointer")} onClick={()=>{setStep(2)}}>2</li>
                        </ul>
                        <Form className="clg_register_form" onSubmit={handleRegister}>
                            {step===1 && (
                                <>
                                    <Form.Group controlId="register_name_company">
                                        <Form.Label> College Name </Form.Label>
                                        <Form.Control type="text" defaultValue={clg_name} placeholder="Enter the name of the college " onChange={(e)=>{setName(e.target.value)}}required />
                                    </Form.Group>
                                    <Form.Group controlId="register_email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" defaultValue={email} placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}required/>
                                    </Form.Group>
                                    <Form.Group controlId="register_password">
                                        <Form.Label> Password </Form.Label>
                                        <Form.Control type="password" defaultValue={password} placeholder="Enter password" onChange={(e)=> {setPassword(e.target.value)}} required/>
                                    </Form.Group>
                                    <Button variant="primary" className="theme-btn" onClick={()=>{setStep(2)}}>
                                       Next <FontAwesomeIcon icon={faAngleRight}/>
                                    </Button>
                                </>
                            )
                            }
                            {step===2 && (
                            <>
                                <Form.Group controlId="register_number">
                                    <Form.Label> Contact Number</Form.Label>
                                    <Form.Control type="number" placeholder="Enter your phone number" ref={contactRef} required />
                                </Form.Group>
                                <Form.Group controlId="register_address">
                                    <Form.Label>College Address</Form.Label>
                                    <Form.Control type="text" placeholder="College Address" ref={clg_addressRef} required/>
                                </Form.Group>
                                <Form.Group controlId="register_extras">
                                    <Form.Label>Extras</Form.Label>
                                    <Form.Control type="text" placeholder="Extras" ref={extrasRef} required/>
                                </Form.Group>
                                <br></br>
                                <Container fluid>
                                <Row>
                                    <Col lg={6}>
                                    <Button variant="light" className="w-100" onClick={()=>{setStep(1)}}>
                                    <FontAwesomeIcon icon={faAngleLeft}/> {' '} Prev 
                                    </Button>
                                    </Col>
                                    <Col lg={6}>
                                    <Button variant="primary" disabled ={loading} className="theme-btn" type="submit">
                                        {loading?(
                                            <Spinner animation="border" role="status">
                                            <span className="sr-only">Loading...</span>
                                          </Spinner>):(
                                            <>
                                            Take me in <FontAwesomeIcon icon={faAngleRight}/>
                                            </>
                                        )}
                                    </Button>
                                    </Col>
                                </Row>
                            </Container>
                            </>
                        )
                        }
                    </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default College_registration

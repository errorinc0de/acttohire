import { faAngleRight, faArrowRight ,faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'

function HrRegister() {

    const [step,setStep] = useState(1)
    const [loading,setLoading] = useState(false)

    const [error,setError] = useState(false)
    const [name,setName] = useState()
    const [password,setPassword] = useState()
    const [email,setEmail] = useState()
    const [company, setCompany] = useState()

    const countryRef = useRef()
    const stateRef = useRef()
    const contactRef = useRef()
    const history = useHistory()

    const {currentUser,hrRegister}= useAuth()


    function handleRegister1(e)
    {
        e.preventDefault()
        setLoading(true)
        if(!name)
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
        else if(!countryRef.current.value)
        {
            setError("Please enter your Country")
            setLoading(false)
            return
        }
        else if(!stateRef.current.value)
        {
            setError("Please enter your state")
            setLoading(false)
            return 
        }
        else if(!contactRef.current.value)
        {
            setError("Please enter your contact number")
            setLoading(false)
            return
        }
        else
        {
            hrRegister(email,password,name,company,countryRef.current.value,stateRef.current.value,contactRef.current.value).then(()=>{    
            }).then(()=>history.push('/hr-subscription')).catch((error)=>{
                setError(error.message)
            })
        }
    }
    return (
            <div className="login-container">
                <Container className="login-holder bg-white">
                    <Row>
                        <Col lg={5} className="login-pattern-container">
                            <div className="login-description">
                                <div className="brand">B-Plan</div>
                                <h1>Welcome to your world of success !!</h1>
                                <p>Join our network to hire the best talents from the institutions, who can be an asset for your organization. </p>
                                <div className="login-down">
                                    <h3>Have an account ?</h3>
                                    <Link to="/hr-login">
                                        Login In Now {' '}
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
                        <Form className="hr_register_form" onSubmit={handleRegister1}>
                            {step===1 && (
                                <>
                                    <Form.Group controlId="register_name_hr">
                                        <Form.Label> Your Name </Form.Label>
                                        <Form.Control type="text" placeholder="Enter your name " onChange={(e)=>{setName(e.target.value)}} required />
                                    </Form.Group>
                                    <Form.Group controlId="register_name_company">
                                        <Form.Label> Company Name </Form.Label>
                                        <Form.Control type="text" placeholder="Enter the name of the company " onChange={(e)=>{setCompany(e.target.value)}} required />
                                    </Form.Group>
                                    <Form.Group controlId="register_email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}required/>
                                    </Form.Group>
                                    <Form.Group controlId="register_password">
                                        <Form.Label> Password </Form.Label>
                                        <Form.Control type="password" placeholder="Enter password" onChange={(e)=> {setPassword(e.target.value)}} required/>
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
                                <Form.Group controlId="register_country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" placeholder="Country" ref={countryRef} required/>
                                </Form.Group>
                                <Form.Group controlId="register_state">
                                    <Form.Label> State</Form.Label>
                                    <Form.Control type="text" placeholder="State" ref={stateRef} required/>
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

export default HrRegister

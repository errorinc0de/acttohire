import { faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'

function College_login() {

    const[loading,setLoading]= useState(false)
    const[error,setError]= useState(false)

    const emailRef = useRef()
    const passwordRef = useRef()

    const history= useHistory()
    
    const {currentUser,collegeLogin}=useAuth()

    function handleLogin(e)
    {
        e.preventDefault()
        setLoading(true)
        if(passwordRef.current.value.length < 6)
        {
            setError("Password must be greater than 5 characters")
            setLoading(false)
            return
        }else
        {
            collegeLogin(emailRef.current.value,passwordRef.current.value)
            .catch((error)=>{
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
                                <Link to="/college-registration">
                                    Sign Up Now {' '}
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col lg={7} className="d-flex align-items-center justify-content-center">
                        <div className="login-form-container">
                        <div className="login-form-top">
                        <h2>Login</h2>
                        {error && <div className="error">{error}</div>}
                        </div>
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
                                    <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" ref={passwordRef} />
                                </Form.Group>
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
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default College_login

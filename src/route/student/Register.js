import { faAngleLeft, faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import { db } from '../../firebase';
import './styles/login.css'
function Register() {

    const [step,setStep]=useState(1)
    const [error,setError]=useState()
    const [loading,setLoading]=useState(false)
    const [collegeList,setCollegeList]=useState()
    const [name,setName]=useState()
    const [sex,setSex]=useState()
    const [password,setPassword]=useState()
    const [email,setEmail]=useState()



    const CollegeRef = useRef()
    const rollRef = useRef()
    const univRollRef = useRef()
    const graduationDateRef = useRef()


    const {currentUser,register} =useAuth()
    const history = useHistory()

    function handleRegister(e)
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
        else if(!sex)
        {
            setError("Please enter your gender")
            setLoading(false)
            return
        }
        else if(!password)
        {
            setError("Please enter your Password")
            setLoading(false)
            return
        }
        else if(!CollegeRef.current.value)
        {
            setError("Please select your College")
            setLoading(false)
            return
        }
        else if(!rollRef.current.value)
        {
            setError("Please enter your College Roll")
            setLoading(false)
            return
        }
        else if(!univRollRef.current.value)
        {
            setError("Please enter your university Roll")
            setLoading(false)
            return
        }
        else if(!graduationDateRef.current.value)
        {
            setError("Please select graduation date")
            setLoading(false)
            return
        }
        else
        {
            var collegeId = collegeList.filter(college=>college.displayName === CollegeRef.current.value)
            register(email,password,name,CollegeRef.current.value,rollRef.current.value,univRollRef.current.value,graduationDateRef.current.value,sex,collegeId[0].id).then(()=>{
                        }).then(()=>{
                           history.push("/dashboard").catch((error)=>{
                setError(error.message)
            })
        })
    }
    }


    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            history.push("/dashboard")
        }
    },[])
    
    useEffect(() => {
        var unsubscribe = db.collection("users").where("isCollege","==",true).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var collegeListArr = []
                docs.forEach((doc)=>{
                    collegeListArr.push({id:doc.id,...doc.data()})
                })
                setCollegeList(collegeListArr)
            }
        })
        return unsubscribe
    }, [])

    return (
        <div className="login-container">
        <Container className="login-holder bg-white">
            <Row>
                <Col lg={5} className="login-pattern-container">
                    <div className="login-description">
                        <div className="brand">B-Plan</div>
                        <h1>Welcome to your world of success !!</h1>
                        <p>Join our network to keep track of your fellow classmates and let them know who you are ! . Recruiters always have their eyes on you :) </p>

                        <div className="login-down">
                            <h3>Have an account ?</h3>
                            <Link to="/">
                                Login In Now {' '}
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </div>
                    </div>
                </Col>
                <Col lg={7} className="d-flex align-items-center justify-content-center">
                    <div className="login-form-container">
                    <div className="login-form-top">
                    <h2>Sign Up</h2>
                    {error && <div className="error">{error}</div>}
                    </div>
                    <ul className="progress-holder">
                        <li className={step===1 && "bg-theme text-light"}>1</li>
                        <li className={step===2 && "bg-theme text-light"}>2</li>
                    </ul>
                    <Form className="login-form" onSubmit={handleRegister}>
                        {step===1 && (
                            <>
                                <Form.Group controlId="formname">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your name" onChange={(e)=>{setName(e.target.value)}} required/>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email"onChange={(e)=>{setEmail(e.target.value)}} required/>
                                </Form.Group>
                                <Form.Group controlId="formgender">
                                    <Form.Label>Sex</Form.Label>
                                    <div className="ml-1">
                                    <Form.Check inline label="Male" onClick={()=>{setSex("Male")}} name="group1" type="radio"/>
                                    <Form.Check inline label="Female" onClick={()=>{setSex("Female")}} name="group1" type="radio"/>
                                    <Form.Check inline label="Prefer Not to Say" onClick={()=>{setSex("Other")}} name="group1" type="radio"/>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} required/>
                                </Form.Group>
                                <Button variant="primary" className="theme-btn" onClick={()=>{setStep(2)}}>
                                    Next <FontAwesomeIcon icon={faAngleRight}/>
                                </Button>
                            </>
                        )

                        }
                        {step===2 && (
                            <>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>College</Form.Label>
                                <Form.Control as="select"  ref={CollegeRef} required>
                                    <option value="" hidden>Please select your College</option>
                                {collegeList && collegeList.length > 0 && collegeList.map((college)=>{
                                    return(<option value={college.displayName}>{college.displayName}</option>)
                                })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Roll Number</Form.Label>
                                <Form.Control type="text" placeholder="Enter college roll number" ref={rollRef} required/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>University Roll No.</Form.Label>
                                <Form.Control type="text" placeholder="Enter University roll" required ref={univRollRef}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Graduation date</Form.Label>
                                <Form.Control type="date" required ref={graduationDateRef} />
                            </Form.Group>
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
                        )}
                    </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
    )
}

export default Register

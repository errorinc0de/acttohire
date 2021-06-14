import React from 'react'
import { faAngleRight, faArrowRight ,faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { useEffect, useRef, useState } from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import '../student/styles/login.css'
import { db } from '../../firebase';

function Student_settings() {

    const Contact_stuRef=useRef()
    const Student_nameRef=useRef()
    const Student_addRef=useRef()
    const Student_graddateRef=useRef()
    const {currentUser}= useAuth()
    function handleRegister1(e){
        e.preventDefault()
        console.log(currentUser)
        db.collection("users").doc(currentUser.uid).update({
            student_name:Student_nameRef.current.value,
            student_contact:Contact_stuRef.current.value,
            student_address: Student_addRef.current.value,
            grad_date: Student_graddateRef.current.value
        })
    }
    return (
        <div>
            <Form onSubmit={handleRegister1}>
                <Form.Group controlId="formBasicName" >
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" ref={Student_nameRef} required/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicAddress" >
                    <Form.Label>College Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter Address" ref={Student_addRef} required />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPhonenumber">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control type="text" placeholder="Enter Phone number" ref={Contact_stuRef} required/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicGraddate">
                    <Form.Label>Graduation Date</Form.Label>
                    <Form.Control type="text" placeholder="mm/yy/dd" ref={Student_graddateRef} required/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Student_settings

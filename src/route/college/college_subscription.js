import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import './styles/subscription.css'

function preLoadRazorpay()
{
    return new Promise((resolve =>{
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
    script.onload = () =>{ resolve(true)}
    script.onerror = () =>{ resolve(false)}
}))   

}

function College_subscription() {
    const {currentUser,logout} = useAuth()
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(true)
    const history = useHistory()
    async function pay()
    {
        const res  = await preLoadRazorpay() 
        if(!res)
        {
            setError(true)
            return
        }
        
        var options = {
            "key": "rzp_test_jYsN1St1V3XsrK", 
            "amount": "500000",
            "currency": "INR",
            "name": "ActToHire",
            "description": "College subcription to secure student's future",
            "image": "logo.jpg",
            "handler": function (response){

                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getDate();
                var oneyearafter = new Date(year + 1, month, day);
                
                db.collection("users").doc(currentUser.uid).update({
                    expireDate:oneyearafter,
                    lastReciept :response.razorpay_payment_id
                })
                
            },
            "prefill": {
                "name": currentUser.displayName,
                "email": currentUser.email,
                "contact": currentUser.contact
            },
            "theme": {
                "color": "#0D1238"
            }
        };
        const paymentOBJ = new window.Razorpay(options);
        paymentOBJ.open()
    }

    useEffect(() => {
        if(currentUser && currentUser.uid)
        {
            if(currentUser.expireDate)
            {
                var today = new Date()
                if( today <= currentUser.expireDate.toDate())
                {
                    history.push("/college-dashboard")
                }else
                {
                    setLoading(false)
                }
            }
            else
                setLoading(false)
        }
    }, [currentUser])


    async function handleLogout() {    
        try {
          await logout()
          history.push("/college-login")
        } catch {
          console.log("Failed to log out")
        }
    }

    return (
        <Container fluid>
            {!loading && (
                <Row noGutters>
                <Col lg={4} className="subscription subscription-bg p-0">
                </Col>
                <Col lg={8}>
                    <div class="subscription-desc">
                        <h2>Student's subcription</h2>
                        <div className="p-5">
                        <h4>Subscribe to secure your student future !!</h4>
                        <h3>RS.5000/-</h3>
                        <p>
                            Join our network for a minimal subscription fee of Rs 5000 and let your students come to the spotlight of dream companies . Boost and Boast your hiring records by providing the correct data of student activities throughout their academic life to a pool of HRs who are waiting to take the best talents they find . Come up and take a step further to make their future brighter . 
                        </p>
                        </div>
                        <Container fluid>
                            <Row>
                                <Col xs={6}>
                                    <Button variant="primary" className="theme-btn" onClick={pay}>Pay and Secure their future !</Button>
                                </Col>
                                <Col xs={6}>
                                    <Button variant="danger" className="w-100" onClick={handleLogout}>Logout</Button>
                                </Col>
                            </Row>
                        </Container>
                       
                    </div>
                </Col>
            </Row>
            ) }
        </Container>
    )
}

export default College_subscription

import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { db, firebasevalue } from '../../firebase'
import '../college/styles/subscription.css'

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

function HrSubscription() {
    const {currentUser,logout} = useAuth()
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(true)
    const history = useHistory()

    async function pay(amount,quota,type)
    {
        const res  = await preLoadRazorpay() 
        if(!res)
        {
            setError(true)
            return
        }
        
        var options = {
            "key": "rzp_test_jYsN1St1V3XsrK", 
            "amount": amount,
            "currency": "INR",
            "name": "ActToHire",
            "description": "Hr subcription to Hire talents",
            "image": "logo.jpg",
            "handler": function (response){

                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getDate();
                if(month === 12)
                {
                    var expireDate = new Date(year + 1, 1 , day);
                }
                else
                {
                    var expireDate = new Date(year, month + 1 , day);
                }
                
                db.collection("users").doc(currentUser.uid).update({
                    quota:firebasevalue.increment(quota),
                    expireDate,
                    activePlan:type,
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
                    history.push("/hr-dashboard")
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

    function skipNow()
    {
        history.push("/hr-dashboard")
    }

    return (
        <Container fluid>
            {!loading && (
                <Row noGutters>
                <Col lg={1} className="subscription subscription-bg p-0">
                </Col>
                <Col lg={11}>
                    <Container fluid>
                        <Row>
                            <Col lg={4}>
                            <div class="subscription-desc">
                                <h5>Silver</h5>
                                <div className="p-3">
                                <h4>Subscribe to Silver membership !! </h4>
                                <h3>RS. 5000 /<span>month</span></h3>
                                <p>
                                    Are you a startup?
                                    <br />
                                    We recommend this pack for you to watch out for the best talents from the institutions. Subscribe to our Silver tier and enjoy the following benefits ; )
                                    <br />
                                    <br />
                                    <br />
                                    <ul className="justify-content-center">
                                        <li>Retrieve 50 students' data</li>
                                        <li>Make offer to available students</li>
                                        <li>Keep an eye on student activity-profile</li>
                                        <li>Keep track of active posted jobs</li>
                                        <li>Keep track of past posted jobs</li>
                                        <li>Handle job's activity/inactivity status</li>
                                    </ul>
                                </p>
                            </div>
                            <Button variant="primary" className="theme-btn" onClick={()=>pay(500000,50,"Silver")}>Subscribe Now !</Button>
                                        
                            
                            </div>
                            </Col>
                            <Col lg={4}>
                                <div class="subscription-desc">
                                    <h5>Gold</h5>
                                    <div className="p-3">
                                    <h4>Subscribe to Gold <br></br> membership !!</h4>
                                    <h3>RS. 10000 /<span>month</span></h3>
                                    <p>
                                        Looking to accelerate your organization's turn-over? Looking for best candidates who can make you achieve the goals?
                                        <br />
                                        We recommend this pack for you to watch out for the best talents from the institutions. Subscribe to our Gold tier and enjoy the following benefits ; )
                                        <br />
                                        <br />
                                        <br />
                                        <ul className="justify-content-center">
                                            <li>Retrieve 200 students' data</li>
                                            <li>Make offer to available students</li>
                                            <li>Keep an eye on student activity-profile</li>
                                            <li>Keep track of active posted jobs</li>
                                            <li>Keep track of past posted jobs</li>
                                            <li>Handle job's activity/inactivity status</li>
                                        </ul>
                                    </p>
                                    </div>
                                   
                                    <Button variant="primary" className="theme-btn" onClick={()=>pay(1000000,200,"Gold")}>Subscribe Now !</Button>
                                            
                                
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div class="subscription-desc">
                                    <h5>Platinum</h5>
                                    <div className="p-3">
                                    <h4>Subscribe to Platinum membership !!</h4>
                                    <h3>RS. 20000 /<span>month</span></h3>
                                    <p>
                                        We understand the workforce your company needs to achieve client deadlines. Meet your organization's requirements through this pack!
                                        <br />
                                        We recommend this pack for you to track the best talents from the institutions. Subscribe to our Platinum tier and enjoy the following benefits ; )
                                        <br />
                                        <br />
                                        <br />
                                        <ul className="justify-content-center">
                                            <li>Retrieve 500 students' data</li>
                                            <li>Make offer to available students</li>
                                            <li>Keep an eye on student activity-profile</li>
                                            <li>Keep track of active posted jobs</li>
                                            <li>Keep track of past posted jobs</li>
                                            <li>Handle job's activity/inactivity status</li>
                                        </ul>
                                    </p>
                                    </div>
                                    
                                    <Button variant="primary" className="theme-btn" onClick={()=>pay(2000000,500,"Platinum")}>Subscribe Now !</Button>                               
                            
                                </div>
                            </Col>
                        </Row>
                        
                        <Button variant="light" className="floating-r-btn bg-theme-1 text-light" onClick={skipNow}>Skip Now</Button>
                    </Container>
                    
                    <Button variant="light" className="floating-r-btn mt-5" onClick={handleLogout}>Logout</Button>
                </Col>
            </Row>
            ) }
        </Container>
    )
}

export default HrSubscription

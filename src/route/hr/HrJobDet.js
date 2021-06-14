import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import Sidebar from './components/Sidebar'
import '../student/styles/jobDetails.css'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
function HrJobDet() {
    const {jobid} = useParams()
    const history = useHistory()
    const [jobDetails , setJobDetails]=useState()
    const [loading,setLoading] = useState(true)

    const {currentUser} = useAuth()
    useEffect(()=>{
        if(jobid)
        {
            var unsubscribe = db.collection("jobListing").doc(jobid).onSnapshot((doc)=>{
                if(doc.exists)
                {
                    setLoading(false)
                    setJobDetails(doc.data())
                }
                else
                {
                    history.push('/jobs')
                }
            })
        }else
        {
            history.push('/jobs')
        }

        return unsubscribe
    },[])

    return (
        <>
        {!loading && (
            <Container fluid className="dashboard-body">
                <Row noGutters>
                    <Col lg={1} className="p-0">
                        <Sidebar />
                    </Col>
                    <Col lg={11} className="m-body">
                    <Container fluid className="p-0">
                        <Row noGutters>
                        <Col>
                            <div className="page-header">
                                Jobs
                            </div>
                            </Col>
                            <Col className="d-flex align-items-end flex-column">
                                <BootstrapSwitchButton
                                    className="toggle-btn"
                                    checked={jobDetails && jobDetails.isActive}
                                    onlabel='Activate Job'
                                    offlabel='Deactivate Job'
                                    onChange={()=>db.collection("jobListing").doc(jobid).update({isActive: !jobDetails.isActive})}
                                />
                            </Col>

                        </Row>
                    </Container>
                    <div className="job-details">
                        <Row>
                            <Col lg={10}>
                                <h5>{jobDetails && jobDetails.title} <span>#{jobDetails && jobDetails.code}</span></h5>
                                <span className="tags">
                                {jobDetails && jobDetails.topic}
                                </span>
                                <span className="tags">
                                {jobDetails && jobDetails.duration}
                                </span>
                                <span className="tags">
                                {jobDetails && jobDetails.role}
                                </span>
                            </Col>
                            
                        </Row>
                        <h3>Responsibilities</h3>
                        <p>{jobDetails && jobDetails.responsibility}</p>
                    </div>
                    </Col>
                </Row>
            </Container>
        )}
        </>
    )
}

export default HrJobDet

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'
import AddAwardsModal from './components/AddAwardsModal'
import Sidebar from './components/Sidebar'
import './styles/awards.css' 
import './styles/Common.css' 

function Awards() {

    const [filteredAwards , setFilteredAwards] =useState()
    const [awards , setAwards] =useState()
    const [show, setShow] = useState(false);

    const {currentUser} =useAuth()


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleFilter(keyword)
    {
        if (keyword === "")
            setFilteredAwards(awards)
        else 
        {
            var newArray=awards.filter(award => 
               award.description.toLowerCase().includes(keyword.toLowerCase()) 
            || award.title.toLowerCase().includes(keyword.toLowerCase())
            || award.issuedBy.toLowerCase().includes(keyword.toLowerCase())
            )
            setFilteredAwards(newArray)
        }
    }

    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            var unsubscribe = db.collection("users").doc(currentUser.uid).onSnapshot((docs)=>{
                if(docs.exists)
                {
                    let result = Object.keys(docs.data().awards)
                   .map(key => (docs.data().awards[key]));
                  setAwards(result)
                  setFilteredAwards(result)
                }
              })
          
              return unsubscribe
        }
    },[currentUser])

    return (
        <Container fluid className="dashboard-body">
          <Row noGutters>
            <Col lg={1} className="p-0">
                <Sidebar />
            </Col>
            <Col lg={11} className="m-body">
                <div className="page-header">
                   Awards
                </div>
                <Button variant ="light" className="floating-r-btn" onClick={handleShow} >
                        Add Achievement
                </Button>

                <Container fluid>
                    <Row>
                        <Col lg={12} className="p-0">
                        <Form.Group controlId="formSearch">
                            <Form.Control type="text" placeholder="Search Achievement" onChange={(e)=>handleFilter(e.target.value)} />
                        </Form.Group>
                        </Col>
                    </Row>
                </Container>
                        {filteredAwards && filteredAwards.length > 0 && filteredAwards.map((award , key)=>{
                            return (
                                <Container fluid key={key}>
                                    <Row>
                                        <Col lg={12} className="p-0">
                                            <div className="award-container">
                                                <h3>{award.title}</h3>
                                                <p>{award.description}</p>
                                                <h4>Issued By : <span> {award.issuedBy}</span></h4>
                                                <h5>Issued on : <span>{award.issuedOn}</span></h5>
                                                <h5><span>#{award.credentialID}</span></h5>
                                                {award.credentialURL && (<a href={award.credentialURL} className="external-link" target="_blank" ><FontAwesomeIcon icon={faExternalLinkAlt}/></a>)}
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                                
                            )
                        })}
                    
                    <AddAwardsModal show={show} onHide={handleClose}/>
            </Col>
          </Row>
        </Container>
    )
}

export default Awards

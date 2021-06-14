import React, { useRef, useState, useEffect } from 'react'
import { Row,Container, Col,Image, Button, Form,Spinner } from 'react-bootstrap'
import Sidebar from './components/Sidebar'
import './styles/profile.css'
import { useAuth } from '../../context/AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faUserTie } from '@fortawesome/free-solid-svg-icons'
import './styles/awards.css'
import './styles/profile.css'
import { db, storageRef } from '../../firebase'
import './styles/profile.css'
 function Profile() {

    const [editBio,setEditBio] = useState(false)
    const [loading,setLoading]= useState(false)
    const [dp,setDp]=useState("https://jacksimonvineyards.com/wp-content/uploads/2016/05/mplh.jpg")
    const {currentUser} = useAuth()
    const bioRef= useRef()
    const fileRef=useRef()

    function updateBio(e)
    {
        e.preventDefault();
        setLoading(true)
        db.collection("users").doc(currentUser.uid).update({
            bio:bioRef.current.value
        }).then(()=>{
            setEditBio(false)
            setLoading(false)
        })
    }
    function changeImage(e)
    {
        console.log(e.target.files)

        storageRef.child(e.target.files[0].name).put(e.target.files[0]).then(()=>{
            storageRef.child(e.target.files[0].name).getDownloadURL().then((url) => {
                db.collection("users").doc(currentUser.uid).update({
                    photoURL:url
                })
            })
        })
    }

    useEffect(() => {
        if(currentUser && currentUser.uid)
        {
            if(currentUser.photoURL)
                setDp(currentUser.photoURL)
            else
                setDp("https://jacksimonvineyards.com/wp-content/uploads/2016/05/mplh.jpg")
        }
    }, [currentUser])

     return ( 
        <Container fluid className="dashboard-body">
          <Row noGutters>
            <Col lg={1} className="p-0">
                <Sidebar />
            </Col>
            <Col lg={11} className="m-body">
                <div className="page-header">
                   Profile
                </div>
                <Container className="my4">
                    <Row>
                        <Col lg={2}  md={3} xs={6}>
                            <Image src={dp} fluid roundedCircle onClick={()=>fileRef.current.click()}/>
                            <Form.File 
                                id="custom-file"
                                className="hidden"
                                ref={fileRef}
                                onChange={(e)=>changeImage(e)}
                                accept="image/*"
                            />
                            {currentUser && currentUser.isHired ? (<div className="hired-div"><FontAwesomeIcon icon={faUserTie} />   Hired</div>):(<div className="unhired-div"><FontAwesomeIcon icon={faUserTie} /> Avialable for hire</div>)}
                        </Col>
                        <Col>
                        <div className="award-container profile-container mb2">
                            <h2>{currentUser && currentUser.sex.substring(0,1)}</h2>
                            <h3>{currentUser && currentUser.displayName} <span>#{currentUser && currentUser.rollno}</span></h3>
                            <h4><span> {currentUser && currentUser.email}</span></h4>
                            <h5>University Roll: <span>{currentUser && currentUser.universityRoll}</span></h5>
                            <h5>College: <span>{currentUser && currentUser.college}</span></h5>
                            <h5>Graduation Year <span>{currentUser && currentUser.gradDate}</span></h5>
                            {currentUser && currentUser.topicList && currentUser.topicList.map((topic,key)=>{
                                return(<span className="profile-tags" key={key}>{topic}</span>)
                            })}
                        </div>

                        <div className="bio-holder">
                            <h4>Bio <Button variant="light" onClick={()=>setEditBio(true)}><FontAwesomeIcon icon={faPenAlt}/> Edit</Button></h4>
                            {editBio ?(<Form onSubmit={updateBio}>
                                <Form.Group controlId="bio">
                                    <Form.Label>Update Bio </Form.Label>
                                    <Form.Control as="textarea" rows={6} defaultValue={currentUser && currentUser.bio} ref={bioRef} required />
                                </Form.Group>
                                <Button type="submit" disabled={loading} variant="primary" className="bg-theme1 theme-btn my4">
                                    {loading?(
                                        <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                        </Spinner>):(
                                        <>
                                        Let the world Know !!
                                        </>
                                    )}
                                    </Button>
                            </Form>):(<p>{currentUser && currentUser.bio}</p>)}

                        </div>
                        </Col>
                    </Row>
                </Container>
            </Col>
            </Row>
        </Container>
     )
 }

 export default Profile
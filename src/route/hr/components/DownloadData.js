import { Button, Form, Modal, Row } from 'react-bootstrap'
import React, { useEffect, useRef, useState } from 'react'
import { db, firebasevalue } from '../../../firebase'
import { useAuth } from "../../../context/AuthProvider"
import {Link} from 'react-router-dom'
import '../styles/downloadData.css'

function DownloadData(props) {
    const requestCountRef = useRef()
    const { currentUser } = useAuth()
    const [availableData,setAvailableData] = useState()
    const [topics,setTopics]=useState()
    const [loading,setLoading] = useState(false)
    const [selectedTopic, setSelectedTopic] =useState(null)
    const [studentDataArray, setStudentDataArray] = useState([])
    const [errorMessage,setErrorMessage] = useState()
    const [filteredArray, setFilteredArray] = useState([])
    const [expired ,setExpired]=useState(null)

    useEffect(()=>{
        var unsubscribe = db.collection("users").where("isHired", "==", false).get().then((docs)=>{
            if(!docs.empty){
                var studentArray = []
                docs.forEach(doc=>{
                    if(doc.data().visitedBy && (doc.data().visitedBy.indexOf(currentUser.uid)===(-1))){
                        var obj = {
                            id: doc.id,
                            name: doc.data().displayName,
                            emailId: doc.data().email,
                            topics: doc.data().topics
                        }
                        studentArray.push(obj);
                    }
                })
                setStudentDataArray(studentArray);
                setAvailableData(studentArray.length);
            }
        }).catch(error=>{setErrorMessage(error.message)})
        return unsubscribe;
    },[])

    useEffect(()=>{
        if(studentDataArray){
            console.log(studentDataArray.length)
        }
        var unsubscribe = db.collection("appData").doc("appData").onSnapshot((docs)=>{
          if(docs.exists){
            setTopics(docs.data().topics)
          }
        })
    
        return unsubscribe
    },[])

    function handleClose() {
        props.onHide();
    }

    function handleDownload(event) {
        event.preventDefault();
        setLoading(true);
        var index = 0;
        setLoading(true);
        if(selectedTopic == null){
            setErrorMessage("Please Select Relevant Topic");
        } else {
            for(index = 0; index < filteredArray.length && index < requestCountRef.current.value;index++){
                db.collection("users").doc(currentUser.uid).update({
                    studentData: firebasevalue.arrayUnion({id: filteredArray[index].id, name: filteredArray[index].name, email: filteredArray[index].email, topic:filteredArray[index].topic}),
                    quota: firebasevalue.increment(-1)
                })
                db.collection("users").doc(filteredArray[index].id).update({
                    visitedBy: firebasevalue.arrayUnion(currentUser.uid)
                }).then(()=>{
                    props.onHide()
                })
            }
        }
        setLoading(false);
        setFilteredArray((filteredArray)=>{
            filteredArray.slice(index,);
        });
        setStudentDataArray((studentDataArray)=>{
            studentDataArray.slice(index,);
        })

    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            if(currentUser.expireDate)
            {
                var today = new Date()
                if( today >= currentUser.expireDate.toDate())
                {
                    setExpired(true)
                }
                else
                    setExpired(false)
            }
        }
    },[currentUser])


    return (
        <>
            <Modal centered show={props.show} onHide={handleClose}>
                <Modal.Header>
                    Download Data
                </Modal.Header>
                <Modal.Body>
                    <div className="my-2 mx-2 d-flex justify-content-center quota-limit-alert">You have {currentUser.quota} downloads left! </div>
                    {(!expired && expired !==null )?(<Form onSubmit={handleDownload} className="my-2 mx-2">
                        <Form.Group controlId="TopicId" className="my-2">
                            <Form.Label>Topic</Form.Label>
                            <div className="ml-1">
                                {topics && topics.map((topic,key)=>{
                                    return(
                                    <Button variant="light" className={selectedTopic === topic?("styled-radio styled-radio-selected mr-2"):("styled-radio mr-3")} key={key} onClick={()=>{
                                        setSelectedTopic(topic)
                                        setErrorMessage();
                                        var filterArray = []
                                        if(studentDataArray && studentDataArray.length>0){
                                            studentDataArray.forEach(data=>{
                                                if(topic in data.topics) {
                                                    filterArray.push({id: data.id, topicPoints: data.topics[topic].points, email: data.emailId, name: data.name, topic: topic})
                                                }
                                            })
                                            if(filterArray.length===0) {
                                                setErrorMessage("No relevant data available!")
                                            }
                                            sortByKey(filterArray,"topicPoints");
                                            setFilteredArray(filterArray);
                                            console.log(filteredArray)
                                        }
                                        else {
                                            setErrorMessage("No relevant data available!")
                                        }
                                    }}>
                                        {topic}
                                    </Button>
                                    )
                                })}
                            </div>
                        </Form.Group>
                        {filteredArray && filteredArray.length > 0 && (<Form.Group controlId="dataCountId">
                            <Form.Label>Number of Data to be Retrieved</Form.Label>
                            <Form.Control type="number" min={1} max={filteredArray.length} ref={requestCountRef} required></Form.Control>
                        </Form.Group>)}
                        
                        {errorMessage && (<div className="my-2 mx-2 d-flex justify-content-center quota-limit-alert">
                            {errorMessage}
                        </div>)}
                        <div className="d-flex justify-content-center">
                            <Button type="submit" variant="primary" className="my-4 px-3" disabled={loading}>
                                Retrieve
                            </Button>
                            <Button variant="danger" className="my-4 mx-3 px-3" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </Form>):(
                        <Link to ="/hr-subscription">
                            <div className="my-2 mx-2 d-flex justify-content-center quota-limit-alert">Please Topup to continue</div>
                        </Link>
                    ) }
                    
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DownloadData

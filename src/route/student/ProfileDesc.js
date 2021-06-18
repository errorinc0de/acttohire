import React, { useEffect, useRef, useState } from 'react'
import { Row,Container, Col,Image, Button, Form,Spinner,Tabs,Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import './styles/profile.css'
import { useAuth } from '../../context/AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faUserTie } from '@fortawesome/free-solid-svg-icons'
import './styles/awards.css'
import './styles/profile.css'
import { db } from '../../firebase'
import { Bar, Pie } from 'react-chartjs-2';
import './styles/profile.css'
import './styles/dashboard.css'

import { useParams } from 'react-router'

 function ProfileDesc() {

    const [dp,setDp]=useState("https://jacksimonvineyards.com/wp-content/uploads/2016/05/mplh.jpg")
    const {profileid} = useParams()
    const [profile,setProfile]=useState()
    const [posts,setPosts]=useState([])
    const [awardsList,setAwardsList]=useState([])
    const [data , setData] =useState(null)
    const [leaderBoard,setLeaderBoard]=useState(null)
    const [finalLeaderBoard,setFinalLeaderBoard]=useState(null)
    const [monthlyData , setMonthlyData] =useState(null)
    const [currentmonthData , setcurrentmonthData] =useState(null)
    const[awards ,setAwards]=useState(null)
    const [topics , setTopics] = useState(null)
    const [selectedTopic ,setSelectedTopic] = useState(null)
    const [currentprofile ,setCurrentProfile] = useState()
    const [yearFilters,setYearFilters] = useState()
    const [selectedYear,setSelectedYear] = useState()
    const [yearData,setYearData] = useState(null)


    const fileRef =useRef()

    useEffect(()=>{
        var unsubscribe =db.collection("users").doc(profileid).onSnapshot((docs)=>{
            setCurrentProfile (docs.data())
        })

        return unsubscribe
    },[profileid])
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      const pieoptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
        },
      };


    useEffect(()=>{

        if(currentprofile && currentprofile.uid)
        {
            var topicList =[]
            var processed =0
            for(const key in currentprofile.topics)
            {
                topicList.push(currentprofile.topics[key].label)
                if(processed===0)
                    setSelectedTopic(currentprofile.topics[key].label)
                processed++

            }
            setTopics(topicList)

            if(currentprofile.photoURL)
            {
                setDp(currentprofile.photoURL)
            }
        }
    },[currentprofile])

    useEffect(()=>{
        if(currentprofile && currentprofile.uid)
        {
            var chartLabel = []
            var chartData =[]


            for (const key in currentprofile.topics) {
                chartLabel.push(currentprofile.topics[key].label)
                chartData.push(currentprofile.topics[key].count)
            }

            console.log(chartLabel)
            console.log(chartData)
            const data = {
                labels:chartLabel,
                datasets: [
                  {
                    label: "Topic Chart",
                    data: chartData,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              };

              setData(data)

              var dt = new Date();
              var month = dt.getMonth();
              var year = dt.getFullYear();
              var daysInMonth = new Date(year, month, 0).getDate();
              var monthLabel =[]
              var monthlist=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
              for(var i=0 ;i<daysInMonth;i++)
              {
                monthLabel.push(i+1+" "+monthlist[month])
              }

              db.collection("posts").where("author.uid","==",currentprofile.uid).onSnapshot((docs)=>{
                var currentmonthData = new Array(daysInMonth).fill(0)
                if(!docs.empty)
                {
                    docs.forEach((doc)=>{
                        if(doc.data() !== null)
                        {
                            if(doc.data().addedOn.toDate().getMonth() === month)
                            {
                                currentmonthData[doc.data().addedOn.toDate().getDate()] =currentmonthData[doc.data().addedOn.toDate().getDate()]+1
                            }
                        }
                    })
                }


                for (const key in currentprofile.awards)
                {
                    if(currentprofile.awards[key].addedOn.toDate().getMonth() === month)
                      {
                          currentmonthData[currentprofile.awards[key].addedOn.toDate().getDate()] +=1
                     }
                }

                setcurrentmonthData(currentmonthData)
                const monthdata= {
                    labels: monthLabel,
                    datasets: [{
                        label: 'Activity Per Day',
                        data: currentmonthData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                       ],
                        borderColor: [
                            'rgba(255,99,132,1)',

                        ],
                        borderWidth: 1
                    }]
                }
                setMonthlyData(monthdata)
              })





            var awardLabel = []

            for (const key in currentprofile.topics) {
                awardLabel.push(currentprofile.topics[key].label)
            }
            var awardDataset = new Array(awardLabel.length).fill(0)
            for (const key in currentprofile.awards) {
                var label = currentprofile.awards[key].topic
                var index = awardLabel.indexOf(currentprofile.awards[key].topic)
                awardDataset[index] +=1
            }
            const awarddata = {
                labels:awardLabel,
                datasets: [
                  {
                    label: "Topic Chart",
                    data: awardDataset,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                     'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              };

              setAwards(awarddata)


        }
    },[currentprofile])



    function compare(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
          return result * sortOrder;
      }
  }

    useEffect(()=>{
        if(topics && topics.length>0)
        {
            if(selectedTopic)
            {
              db.collection("users").where("isStudent","==",true).where("topicList","array-contains",selectedTopic).onSnapshot((docs)=>{
                var selectedLeaderBoardDetails =[]
                if(!docs.empty)
                {
                  var item=0
                  docs.forEach((doc)=>{
                    item++;
                      if(doc.exists)
                      {
                        selectedLeaderBoardDetails.push({
                          pos:item,
                          name:doc.data().displayName,
                          email:doc.data().email,
                          points:doc.data().topics[selectedTopic].points,
                          uid:doc.id
                        })
                      }
                      if(item === docs.size)
                      {
                        selectedLeaderBoardDetails.sort(compare("points"))
                        setLeaderBoard(selectedLeaderBoardDetails)
                      }
                  })
                }
                else
                {
                  setLeaderBoard([])
                }
             })
           }
        }
    },[topics,selectedTopic])


    useEffect(()=>{
      if(leaderBoard && leaderBoard.length>0)
      {
        var upDatedArray =[]
        var index=0;
        leaderBoard.forEach((student)=>{
          index++;
          upDatedArray.push({
            pos:index,
            name:student.name,
            email:student.email,
            points:student.points,
            uid:student.uid
          })
          if(index===leaderBoard.length)
          {
            setFinalLeaderBoard(upDatedArray)
          }
        })
      }
    },[leaderBoard])

    function CellFormatter(cell, row) {
      return (<div><Link to={"/profile/"+row.uid}>{cell}</Link></div>);
    }



    useEffect(() => {
      if(currentprofile && currentprofile.uid)
      {
        setYearFilters([parseInt(currentprofile.gradDate.substring(0,4))-3,parseInt(currentprofile.gradDate.substring(0,4))-2,parseInt(currentprofile.gradDate.substring(0,4))-1,parseInt(currentprofile.gradDate.substring(0,4))])
        var dt = new Date();
        var year = dt.getFullYear();
        setSelectedYear(year)
      }
    }, [currentprofile])


    useEffect(() => {

      if(currentprofile)
      {
        var unsubscribe = db.collection("posts").where("author.uid","==",currentprofile.uid).onSnapshot((docs)=>{ 

          var topicsList = currentprofile.topicList
  
          var dataset=[]
  
          var bgcolor = [
            'rgb(20,36,89)',
            'rgb(255,8,80)',
            'rgb(239,126,50)',
            'rgb(192,35,35)',
            'rgb(25,169,121)',
            'rgb(255,204,0)',
            'rgb(239,139,44)',
            'rgb(162,184,108)',
            'rgb(2,163,139)',
            'rgb(163, 2, 96)',
          ]
  
          topicsList.forEach((topic)=>{
            var data = new Array(12).fill(0)
  
            for (var month = 1 ; month <= 12 ; month++)
            {
                docs.forEach((doc)=>{
                  var docMonth =doc.data().addedOn.toDate().getMonth()
                  var docYear =doc.data().addedOn.toDate().getFullYear()
                  if(docMonth === month && doc.data().topic ===topic && docYear===selectedYear) 
                  {
                    data[month-1] += 1
                  }
                })
            }
            const index = Math.floor(Math.random()*bgcolor.length);
  
            dataset.push({label:topic,data:data,backgroundColor:bgcolor[index]})
  
              bgcolor.splice(index, 1);
            
  
          })
  
          const data = {
            labels: ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
            datasets: dataset
          };
    
          setYearData(data)
  
        })
      }
      return unsubscribe

    }, [selectedYear , currentprofile])


    useEffect(() => {
        var unsubscribe = db.collection("users").doc(profileid).onSnapshot((profile)=>{
            if(profile.exists)
            {
                setProfile(profile.data())
                var myData = Object.keys(profile.data().awards).map(key => {
                    return profile.data().awards[key];
                })
                setAwardsList(myData)
            }
        })
        return  unsubscribe
    }, [])


    useEffect(()=>{
        var unsubscribe = db.collection("posts").where("author.uid","==",profileid).orderBy("addedOn","desc").onSnapshot((docs)=>{
          if(!docs.empty)
          {
              var postsList=[]
              docs.forEach((doc)=>{
                postsList.push(doc.data())
              })
              setPosts(postsList)
          }
        })
    
        return unsubscribe
      },[])
     return ( 
        <Container fluid className="dashboard-body">
          <Row noGutters>
            <Col lg={12} className="m-body">
                <div className="page-header">
                   Profile
                </div>
                <Container className="my4">
                    <Row>
                        <Col lg={2}  md={3} xs={6}>
                            <Image src={dp} fluid roundedCircle />
                            {profile && profile.isHired ? (<div className="hired-div"><FontAwesomeIcon icon={faUserTie} />   Hired</div>):(<div className="unhired-div"><FontAwesomeIcon icon={faUserTie} /> Avialable for hire</div>)}
                        </Col>
                        <Col>
                        <div className="award-container profile-container mb2">
                            <h2>{profile && profile.sex.substring(0,1)}</h2>
                            <h3>{profile && profile.displayName} <span>#{profile && profile.rollno}</span></h3>
                            <h4><span> {profile && profile.email}</span></h4>
                            <h5>University Roll: <span>{profile && profile.universityRoll}</span></h5>
                            <h5>College: <span>{profile && profile.college}</span></h5>
                            <h5>Graduation Year <span>{profile && profile.gradDate}</span></h5>
                            {profile && profile.topicList && profile.topicList.map((topic,key)=>{
                                return(<span className="profile-tags" key={key}>{topic}</span>)
                            })}
                        </div>

                        <div className="bio-holder">
                            <h4>Bio </h4>
                            <p>{profile && profile.bio}</p>
                        </div>

                        <Row>
                        <Col lg={12} className="stats-container">
                            <h3>Year chart</h3>
                            <Form.Label>Year Filter</Form.Label>
                            <div className="ml-1">
                                {yearFilters && yearFilters.length>0 && yearFilters.map((year,key)=>{
                                    return(
                                    <Button variant="light" className={selectedYear === year?("styled-radio styled-radio-selected mr-2"):("styled-radio mr-3")} key={key} onClick={()=>{setSelectedYear(year)}}>
                                        {year}
                                    </Button>
                                    )
                                })}
                            </div>
                        </Col>

                        <Col lg={12} className="monthly-chat">
                            <Bar data={yearData} options={options}/>
                        </Col>
                      

                        <Col lg={12} className="stats-container">
                            <h3>Monthly chart</h3>
                        </Col>
                        <Col lg={12} className="monthly-chat">
                        <Bar data={monthlyData} options={options} />
                        </Col>

                        <Col lg={6} className="stats-container">
                            <h3>Topic Chart</h3>
                            <div className="pie-chart">
                              <Pie data={data} options={pieoptions} />
                            </div>
                            
                        </Col>
                        <Col lg={6} className="stats-container">
                            <h3>Award/Achievement Chart</h3>
                            <div className="pie-chart">
                              <Pie data={awards} options={pieoptions} />
                            </div>
                        </Col>
                    </Row>

                        <Tabs defaultActiveKey="awards" id="uncontrolled-tab-example">
                        <Tab eventKey="awards" title="Awards / Achievements">
                                {awardsList && awardsList.length>0 && awardsList.map((award)=>{
                                    return (<div className="post-container">
                                        <h3>{award.title} <span>#{award.credentialID}</span></h3>
                                        <p>{award.description}</p>
                                        <h6>{award.topic}</h6>
                                        <h5>{award.addedOn.toDate().toString().substring(0,15)}</h5>
                                    </div>)
                                })}
                            </Tab>
                        <Tab eventKey="posts" title="Activities">
                                {posts && posts.length>0 && posts.map((post)=>{
                                    return (<div className="post-container">
                                        <p>{post.post}</p>
                                        <h6>{post.topic}</h6>
                                        <h5>{post.addedOn.toDate().toString().substring(0,15)}</h5>
                                    </div>)
                                })}
                            </Tab>
                            
                            
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </Col>
            </Row>
        </Container>
     )
 }

 export default ProfileDesc
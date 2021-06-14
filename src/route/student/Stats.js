import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthProvider';
import { db } from '../../firebase';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Sidebar from './components/Sidebar';
import './styles/stats.css'
import { Link } from 'react-router-dom';
function Stats() {
    const [data , setData] =useState(null)
    const [leaderBoard,setLeaderBoard]=useState(null)
    const [finalLeaderBoard,setFinalLeaderBoard]=useState(null)
    const [monthlyData , setMonthlyData] =useState(null)
    const [currentmonthData , setcurrentmonthData] =useState(null)
    const[awards ,setAwards]=useState(null)
    const [topics , setTopics] = useState(null)
    const [selectedTopic ,setSelectedTopic] = useState(null)
    const [posts,setPosts]=useState([])

    const {currentUser} = useAuth()
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

        if(currentUser && currentUser.uid)
        {
            var topicList =[]
            var processed =0
            for(const key in currentUser.topics)
            {
                topicList.push(currentUser.topics[key].label)
                if(processed===0)
                    setSelectedTopic(currentUser.topics[key].label)
                processed++

            }
            setTopics(topicList)
        }
    },[currentUser])

    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            var chartLabel = []
            var chartData =[]


            for (const key in currentUser.topics) {
                chartLabel.push(currentUser.topics[key].label)
                chartData.push(currentUser.topics[key].count)
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

              db.collection("posts").where("author.uid","==",currentUser.uid).onSnapshot((docs)=>{
                var currentmonthData = new Array(daysInMonth).fill(0)
                if(!docs.empty)
                {
                    docs.forEach((doc)=>{
                        if(doc.data() !== null)
                        {
                            if(doc.data().addedOn.toDate().getMonth() === month)
                            {
                              console.log(doc.data().addedOn.toDate().getDate())
                              currentmonthData[doc.data().addedOn.toDate().getDate()-1] +=1
                            }
                        }
                    })
                }


                for (const key in currentUser.awards)
                {
                    if(currentUser.awards[key].addedOn.toDate().getMonth() === month)
                      {
                          currentmonthData[currentUser.awards[key].addedOn.toDate().getDate()-1] +=1
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

            for (const key in currentUser.topics) {
                awardLabel.push(currentUser.topics[key].label)
            }
            var awardDataset = new Array(awardLabel.length).fill(0)
            for (const key in currentUser.awards) {
                var label = currentUser.awards[key].topic
                var index = awardLabel.indexOf(currentUser.awards[key].topic)
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
    },[currentUser])



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


    return (
        <Container fluid className="dashboard-body">
          <Row noGutters>
            <Col lg={1} className="p-0">
                <Sidebar />
           </Col>
            <Col lg={11} className="m-body">
                <div className="page-header">
                   My Stats
                </div>
                <Container>
                    <Row className="d-flex align-items-center justify-content-center">
                        <Col lg={12} className="stats-container">
                            <h3>Monthly chart</h3>
                            <Bar data={monthlyData} options={options}  className="monthly-chat" />
                        </Col>
                        <Col lg={4} className="stats-container">
                            <h3>Topic Chart</h3>
                            <Pie data={data} className="pie-chart" options={pieoptions} />
                        </Col>
                        <Col lg={4} className="stats-container">
                            <h3>Award/Achievement Chart</h3>
                            <Pie data={awards} className="pie-chart"options={pieoptions} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} className="stats-container ">
                            <h3>LeaderBoard</h3>
                            <Form.Group controlId="formgender">
                            <Form.Label>Topic</Form.Label>
                            <div className="ml-1">
                            {topics && topics.length>0 && topics.map((topic,key)=>{
                                return(
                                <Button variant="light" className={selectedTopic === topic?("styled-radio styled-radio-selected mr-2"):("styled-radio mr-3")} key={key} onClick={()=>{setSelectedTopic(topic)}}>
                                    {topic}
                                </Button>
                                )
                            })}

                            <BootstrapTable data={finalLeaderBoard} striped pagination search>
                                  <TableHeaderColumn isKey dataField='pos'>Position</TableHeaderColumn>
                                  <TableHeaderColumn dataField='name' dataFormat={CellFormatter} >Student Name</TableHeaderColumn>
                                  <TableHeaderColumn dataField='email'>Student Email</TableHeaderColumn>
                                  <TableHeaderColumn dataField='points'>Points</TableHeaderColumn>
                              </BootstrapTable>

                            </div>
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                    {posts && posts.length>0 && posts.map((post)=>{
                      return (<div className="post-container">
                          <p>{post.post}</p>
                          <h6>{post.topic}</h6>
                          <h5>{post.addedOn.toDate().toString().substring(0,15)}</h5>
                      </div>)
                    })}
                    </Row>
                </Container>
            </Col>
            </Row>
        </Container>
    )
}

export default Stats
import React, { useState,useEffect } from 'react';
import {Carousel,Row,Col, ListGroup} from 'react-bootstrap';
import main2 from '../../assets/images/main2.jpg'
import main3 from '../../assets/images/main3.jpg'
import main4 from '../../assets/images/main4.jpg'
import main5 from '../../assets/images/main5.jpg'
import { UpcomingEvent } from './Events';
import {RiArrowRightSFill} from 'react-icons/ri';
import styled from 'styled-components';
import MyTable from '../MyTable';
import MyDiv from '../MyDiv';
import { useHistory } from 'react-router-dom';
import {url} from '../../services/config';

const StyledListItem = styled(ListGroup.Item)`
    padding : 10px;

    &:hover{
        background : #6A1010;
        color : white;

    }
`

const StyledButton = styled.button `
    text-align : center;
    background : gray;
    color : white;
    border : none;
    width: 70%;
    padding : 12px;
    margin-top: 10px;
    margin-bottom : 10px;
    border-radius : 5px;

    &:hover{
        background : #6A1010;
    }

`

const Home = () => {

    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const history = useHistory()
    // const [isLoading, setIsLoading] = useState(false);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

    useEffect(()=>{
        let unsubscribe = false;
        const fetchData = (url, setFunction) =>{
            if(unsubscribe) return;
            fetch(url,requestOptions)
                .then(res=>res.json())
                .then(res=>setFunction(res.data))
                .catch(e=>{ 
                    console.log(e)
                })
            }

        fetchData(url+"notice", setAnnouncements);

        return () =>{
            unsubscribe = true;
        }
    },[])

    useEffect(()=>{
        let unsubscribe = false;
    
        const fetchData = (url, setFunction) =>{
            if(unsubscribe) return;

            fetch(url,requestOptions)
                .then(res=>res.json())
                .then(res=>setFunction(res.data))
                .catch(e=>{ 
                    console.log(e)
                })
        }
        fetchData(url+"events", setEvents);

        return () =>{
            unsubscribe = true;
        }
    },[])

    const items = [
        {
            src: main2,
            description : "first",
        },
        {
            src: main3,
            description : "second",
        },
        {
            src: main4,
            description : "third",
        },
        {
            src: main5,
            description : "fourth"
        }
    ]
    
    const handleButtonClick = (url)=>{
        history.push(url)
    }

    return (
        <div style={{minHeight:"100vh"}}>
            <Carousel fade>
                {items.map((item,i)=>{
                    return(
                        <Carousel.Item key={i}>
                        <img src={item.src} alt="main_image" style={{
                            width: "100%",
                            height: "500px"}}/>
                    </Carousel.Item>
                    )
                })}
            </Carousel>
            <div className="home-middle">
                <p>Korean Graduate Student Association</p>
            </div>
            <div>
                <MyDiv breakPoint={10}>
                    <Row className="justify-content-center" style={{marginTop:"40px", marginBottom:"40px"}}>
                        <Col md={6}>
                            <Row className="justify-content-center">
                                <StyledButton onClick={()=>handleButtonClick("/about/aboutKGSA")}>
                                    KGSA 소개 <RiArrowRightSFill/>
                                </StyledButton>
                            </Row>
                            <Row className="justify-content-center">
                                <StyledButton onClick={()=>handleButtonClick("/about/aboutUMass")}>
                                    UMass 소개 <RiArrowRightSFill/>
                                </StyledButton>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row className="justify-content-center">
                                <StyledButton onClick={()=>handleButtonClick("/about/aboutHistory")}>
                                    주요 연혁 <RiArrowRightSFill/>
                                </StyledButton>
                            </Row>
                            <Row className="justify-content-center">
                                <StyledButton onClick={()=>handleButtonClick("/contact")}>
                                    Contact Us <RiArrowRightSFill/>
                                </StyledButton>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="justify-content-center" style={{marginTop:"40px", marginBottom:"40px"}}> 
                        <Col md={6}>
                            {announcements && 
                                <ListGroup>
                                    <StyledListItem onClick={()=>handleButtonClick("/announcements")}>공지사항 <RiArrowRightSFill/></StyledListItem>
                                    <MyTable simple={true} data={announcements} url="announcements"/>
                                </ListGroup>
                            }                       
                        </Col>
                        <Col md={6}>
                            {events && 
                                <ListGroup>
                                    <StyledListItem onClick={()=>handleButtonClick("/events")}>Upcoming Event <RiArrowRightSFill/></StyledListItem>
                                    <UpcomingEvent simple={true} events={events}/>
                                </ListGroup>
                            }     
                        </Col>
                    </Row>
                </MyDiv>
            </div>

        </div>
    )

}

export default Home
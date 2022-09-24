import {  Button, Offcanvas,Row, ListGroup } from "react-bootstrap"
import { getUser, removeSession } from "../services/LoginHelper"
import "bootstrap/dist/css/bootstrap.min.css"
import {StyledNav as Navbar } from './Styles';
import { useReducer, useState } from "react";
import {GiHamburgerMenu} from 'react-icons/gi';
import {BiChat,BiCalendarEvent, BiPhotoAlbum } from 'react-icons/bi';
import {FaGraduationCap} from 'react-icons/fa';
import {AiOutlineSetting,AiOutlineHome,AiOutlineInfoCircle,AiOutlineNotification,AiOutlineMail} from 'react-icons/ai';
import {RiArrowDropDownLine,RiAdminLine,RiUserLine ,RiArrowDropUpLine} from 'react-icons/ri';

import styled from 'styled-components';
import { useHistory } from "react-router-dom";

import umass_logo from '../assets/images/UMassAmherst_horiz.png'

const StyledSubButton = styled.button`
    text-align: center;
    width: 50%;
    border : none;
    color : white;
    background-color : #6A1010;
    height : 7vh;
    font-size: 12pt;

    &:hover{
        background-color : gray;
        border-radius : 6px;
    }
`

const StyledButton = styled.button`
    text-align: start;
    padding :10px;
    width: 100%;
    border : none;
    color : white;
    background-color : #6A1010;
    height : 7vh;
    font-size: 13pt;

    &:hover{
        background-color : gray;
        border-radius : 6px;

    }
`
const StyledSettingButton = styled.button`
    text-align: center;
    border : none;
    color : white;
    background-color : #6A1010;
    height : 7vh;
    font-size: 20pt;
    margin-left: 10px;
    margin-right: 10px;

    &:hover{
        color : black;
    }
`
const StyledP = styled.p`
    font-size : ${props=>props.fontSize? props.fontSize : null};
    color : white;
    margin : 10px;
    &:hover{
        color : black;
    }
`

const user = getUser();

const MyNavbar = ()=>{
    const reducer = (state, action) =>{
        switch (action.type) {
            case 'userDashboard' :
                return {...state, userDashboard:action.value}
            case 'home':
                return {...state, home:action.value}
            case 'about':
                return { ...state, about: action.value}
            case 'anncmnt':
                return { ...state, anncmnt: action.value}     
            case 'forum' :
                return { ...state, forum: action.value}  
            case 'event' :
                return { ...state, event: action.value}  
            case 'gallery' :
                return { ...state, gallery: action.value}  
            case 'contact' :
                return { ...state, contact: action.value}   
            case 'openedAll':
                return { ...state, openedAll : action.value}                    
            default:
                return state;
        }
    }
    const [{about,anncmnt,forum,event,gallery,contact,userDashboard,openedAll}, dispatch] = useReducer(reducer,{
        home : false,
        about : false,
        anncmnt : false,
        forum : false,
        event : false,
        gallery : false,
        contact :false,
        userDashboard :false,
        openedAll : false
    })
    const [showMenu, setShowMenu] = useState(false)
    const handlOnClose  = ()=>setShowMenu(false)
    const handleClick = ()=>setShowMenu(!showMenu)

    const handleOpenAllMenu = ()=>{
        
        dispatch({type:'about', value:!openedAll})
        dispatch({type:'anncmnt', value:!openedAll})
        dispatch({type:'forum', value:!openedAll})
        dispatch({type:'event', value:!openedAll})
        dispatch({type:'gallery', value:!openedAll})
        dispatch({type:'contact', value:!openedAll})
        dispatch({type:'openedAll', value:!openedAll})
    
    }
    const handleCloseAllMenu = ()=>{
        dispatch({type:'userDashboard', value:false})
        dispatch({type:'about', value:false})
        dispatch({type:'anncmnt', value:false})
        dispatch({type:'forum', value:false})
        dispatch({type:'event', value:false})
        dispatch({type:'gallery', value:false})
        dispatch({type:'contact', value:false})
    }
    
    const history = useHistory();

    const handleLikedButtonClick = (link) =>{
        history.push(link);
        handleCloseAllMenu();
        handlOnClose();
    }
    const renderLogin =()=>{
        return (
                <div>
                    <Button variant="secondary" onClick={()=>history.push('/login')}>Login</Button>         
                    <StyledP onClick={()=>history.push('/signup')}>Sign up</StyledP>
                </div>
        )
    }
    return (
        <Navbar>
            <StyledSettingButton onClick={handleClick}><GiHamburgerMenu/></StyledSettingButton>
            <StyledP fontSize="20pt" onClick={()=>handleLikedButtonClick("/")}><FaGraduationCap/> UMass Amherst KGSA</StyledP>
            <Offcanvas style={{background:"#6A1010"}} show={showMenu} onHide={handlOnClose} scroll={true} backdrop={true}>
                <Offcanvas.Header style={{color:"white", textAlign:"center"}} closeButton>
                    <StyledSettingButton onClick={handleClick}><GiHamburgerMenu/></StyledSettingButton>
                    <StyledP fontSize="20pt" onClick={()=>handleLikedButtonClick("/")}><FaGraduationCap/> KGSA</StyledP>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div style={{textAlign:"center", color:"white"}}>
                        {user?
                        <div className="justify-content-center">
                            <h1 style={{fontSize:"30pt"}} >{user.admin? <RiAdminLine/> : <RiUserLine/>}</h1>
                            <Row className="justify-content-center"> 
                                {user.admin? <p>Admin</p> : <p>Member</p>}
                                <h5>{user.username}</h5> 
                                <StyledP
                                    onClick={()=>dispatch({type:'userDashboard', value:!userDashboard})}
                                >
                                <AiOutlineSetting/>
                                </StyledP>
                                {userDashboard &&
                                <div>
                                    {/* <Button variant="secondary" onClick={()=>dispatch({type:'userDashboard',value:!userDashboard})}>
                                        User Dashboard
                                    </Button> */}
                                    {userDashboard && 
                                    <div>
                                        <StyledP onClick={()=>handleLikedButtonClick(`/userdashboard/myAccount`)}>My Account</StyledP>
                                        <StyledP onClick={()=>handleLikedButtonClick(`/userdashboard/myActivity`)}>My Activity</StyledP>
                                        <StyledP onClick={()=>handleLikedButtonClick(`/userdashboard/editAccount`)}>Edit Account</StyledP>
                                        <StyledP onClick={()=>handleLikedButtonClick(`/userdashboard/deleteAccount`)}>Delete Account</StyledP>
                                    </div>
                                    }
                                    <Button variant='secondary' onClick={()=>removeSession()}>
                                        Log Out
                                    </Button> 
                                </div>                             
                                }
                            </Row>
                        </div>
                        : renderLogin()}
                      <hr style={{borderTop: "3px solid"}}/>
                    </div>
                    <ListGroup variant="flush">
                        <StyledButton onClick={handleOpenAllMenu}>
                            {!openedAll? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>} 펼쳐보기
                        </StyledButton>
                        <StyledButton onClick={()=>handleLikedButtonClick("/")}>
                            <AiOutlineHome/> Home
                        </StyledButton> 
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'about', value:!about})}>
                            <AiOutlineInfoCircle/> About {!about? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {about && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/about/aboutKGSA")}>
                                        KGSA 소개
                                    </StyledSubButton>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/about/aboutUMass")}>
                                        UMass 소개
                                    </StyledSubButton>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/about/aboutHistory")}>
                                        주요 연혁
                                    </StyledSubButton>                                
                                </ListGroup>
                            </Row>
                        }
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'anncmnt', value:!anncmnt})}>
                            <AiOutlineNotification/> 공지사항 {!anncmnt? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {anncmnt && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/announcements")}>
                                        공지사항
                                    </StyledSubButton>                               
                                </ListGroup>
                            </Row>
                        }
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'forum', value:!forum})}>
                            <BiChat/> 게시판 {!forum? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {forum && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/market")}>
                                        벼룩시장
                                    </StyledSubButton>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/housing")}>
                                        하우징
                                    </StyledSubButton>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/resources")}>
                                        정보
                                    </StyledSubButton>                                
                                </ListGroup>
                            </Row>
                        }
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'event', value:!event})}>
                            <BiCalendarEvent/> 주요 일정 {!event? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {event && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/events")}>
                                        Upcoming Events
                                    </StyledSubButton>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/events")}>
                                        행사 달력
                                    </StyledSubButton>                            
                                </ListGroup>
                            </Row>
                        }
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'gallery', value:!gallery})}>
                            <BiPhotoAlbum/> 갤러리 {!gallery? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {gallery && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/gallery")}>
                                        갤러리
                                    </StyledSubButton>
                                </ListGroup>
                            </Row>
                        }
                        <hr style={{borderTop: "1px solid"}}/>
                        <StyledButton onClick={()=>dispatch({type:'contact', value:!contact})}>
                            <AiOutlineMail/> Contact {!contact? <RiArrowDropDownLine/> : <RiArrowDropUpLine/>}
                        </StyledButton>
                        {contact && 
                            <Row>
                                <ListGroup variant='flush'>
                                    <StyledSubButton onClick={()=>handleLikedButtonClick("/contact")}>
                                        Contact
                                    </StyledSubButton>                          
                                </ListGroup>
                            </Row>
                        }
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>   
        </Navbar>
    )
}
export default MyNavbar
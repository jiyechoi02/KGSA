import React, { useEffect, useReducer, useState } from 'react';
import {Form, Modal,Alert,ListGroup,Row,Col, Spinner} from 'react-bootstrap';
import { CustomContainer as Container } from '../CustomContainer' ;
import { getToken,getUser } from '../../services/LoginHelper';
import { useFetch } from '../../services/UseAPIs';
import MySpinner from '../MySpinner';
import {StyledButton as Button} from '../Styles';
import CustomPagination from '../CustomPagination';
import MyModal from '../MyModal';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import { initialData, reducer } from '../../services/AlertHelper';
import MyDiv from '../MyDiv';
import {BiMap,BiTime,BiCalendarEvent,BiCalendarHeart,BiCommentDots} from 'react-icons/bi';
import styled from 'styled-components';
import {url} from '../../services/config';
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css'

const localizer = momentLocalizer(moment);
const user = getUser();

const StyledListItem = styled(ListGroup.Item)`
    &:hover{
        background: #4d44444d;
    }
`
export const MyCalendar = ({events}) =>{
    /*
        This is the calendar Component
        if the user is an admin, the user is allowed to add/edit events on the calendar
    */
    
    console.log(url)
    
    const [{success, fail, loading}, dispatch] = useReducer(reducer, initialData);
    const ls = events; 
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({}); // an event that a user selected.
    const [ showAddModal, setShowAddModal] = useState(false);
    const [ selectedDate, setSelectedDate]= useState("");  // a date that a user selected.
    const [ newEvent, setNewEvent ] = useState({
        title:"",
        location : "",
        resource: "",
        start : new Date(),
        end : new Date(),
        time: "",
        allday : true,
    }); // new event data from the add new event modal form.

    const handleSelectedSlot = (e)=>{
        // handle when user selects a data slot
        // the selected data will be shown on the modal form.

        const start = String(e.start);
        var a = [];
        a = start.split(" ");

        setNewEvent({
            start :new Date(a[1] + " " + a[2] + " " + a[3]),
            end : new Date(a[1] + " " + a[2] + " " + a[3]),
        })

        setSelectedDate(a[1] + " " + a[2] + " " + a[3]);
        setShowAddModal(true);
    }

    const handleClose = () =>{
        /* handle to close Add Event Modal  */
        setShowAddModal(false)
        setSelectedDate("");
    }    
    const handleSubmit = (e)=>{      
        /* handle to submit a new event */  
        e.preventDefault();
        sendData();
        handleClose();
    }

    const handleChange = (e)=>{
        /* handle a input data from Form */
        setNewEvent({
            ...newEvent, [e.target.name] : e.target.value
        })
    } 

    const handleSelectedEvent = (e)=>{
        /* handle to show selected Event 
            setSelectedEvent with the event
        */
        setSelectedEvent(e);
        setShowEventModal(true);
    }

    const closeMyModal = ()=>{
        // handle to close My modal 
        dispatch({type:'loading', value:false})
        dispatch({type:'success', value:false})
        window.location.reload();
    }

    const sendData = () =>{

        dispatch({type:'loading' , value : true})

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body : JSON.stringify(newEvent),
          redirect: 'follow'
        };

        fetch(url+"events",requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                dispatch({type:'success' , value : true})
                dispatch({type:'loading' , value : false})

            }
        })
        .then(()=> setSelectedDate(""))
        .catch(error => dispatch({type:'fail' , value : true}))

    }
    return (
        <div>
            <Calendar
                localizer={localizer}
                events = {ls}
                views = {['month']}
                startAccessor="start"
                endAccessor="end"
                selectable={getToken()&&user.admin? true: false}
                onSelectSlot={handleSelectedSlot}
                onSelectEvent={handleSelectedEvent}
                style={calendarStyle}
              />       
            <Modal show={showAddModal} onHide={handleClose}>
                <Modal.Header closeButton style={modalStyle}>
                <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label><BiCalendarEvent/> Start date </Form.Label>
                            <Form.Control type="text" defaultValue={selectedDate} name="date" disabled onChange={handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><BiTime/> Time </Form.Label>
                            <Form.Control type="time" name="time" onChange={handleChange} required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><BiCalendarHeart/> Title</Form.Label>
                            <Form.Control type="text" name="title" onChange={handleChange} required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><BiMap/> Location</Form.Label>
                            <Form.Control type="text" name="location"  onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><BiCommentDots/> Note</Form.Label>
                            <Form.Control as="textarea" name="resource" onChange={handleChange}/>
                        </Form.Group>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>                
                        <Button type="submit">
                            Save Event
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            {showEventModal? 
                <EventViewModal 
                show={showEventModal} 
                onHide={()=>setShowEventModal(false)}
                setSelectedEvent={setSelectedEvent}
                selectedEvent={selectedEvent} 
                setShowModal={setShowEventModal}/>
            : null}
            {loading?
                <MyModal show={loading} closeButton={false}>
                    <Spinner animation="border" variant="secondary" />
                    <span>Loading...</span>
                </MyModal>:
                <MyModal show={success} handleOnClick={closeMyModal} variant='success'><p>Saved a new event successfully!</p></MyModal>}
        </div>
    );
}


export const UpcomingEvent = ({simple,events})=>{
    /*
        This is the upcoming Event component.
        fetch datas by API calls and sort them and diplay events within 5 days
        Admins are also allowed to edit/delete an even here.
    */
    
    // const [{success, fail, loading}, dispatch] = useReducer(reducer, initialData);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState({
        title: "",
        location : "",
        resource : "",
        start : new Date(),
        end : new Date(),
        allday : true,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
    const endOfPage = currentPage * postsPerPage;
    const startOfPage = endOfPage - postsPerPage;

    var upcomingEvents = null;

    const filterEvent = (events) =>{
        /* Sort Events happening within 5 days from current date. */
        let event = new Date(events.start);
        let date = new Date();

        if(event >= date && event <= date.setDate(date.getDate()+5)){
            return true;
        }
        return false;
    }

    const currentEvents = (events)=>{
        /* get Event data for current page */ 
        if(simple) return events.slice(0,2);
        return events.slice(startOfPage,endOfPage);
    }

    const handleRowClick = (item)=>{
        /*  */
        setShowModal(true);
        setSelectedData(item)
    }
    const handleClose = ()=>{
        setShowModal(false);
    }

    const parseDateString = (date)=>{
        const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const parses = date.split("-");
        // console.log(parseInt(parses[1]))
        return [parses[0], months[parseInt(parses[1])-1], parses[2]]
    }

    // if(response) data = response.data.filter(filterEvent);
    // if(isLoading) dispatch({type:'loading', value : isLoading})
    // if(error) return <div>{error}</div>
    if(events){
        upcomingEvents = events.filter(filterEvent);
    }

    return ( 
        <>
        { upcomingEvents? (
            <div>
            {currentEvents(upcomingEvents).length? 
                (<>
                        <ListGroup>
                            {!simple && 
                                <ListGroup.Item style={{backgroundColor:"#6A1010", color:"white"}}>
                                    <BiCalendarEvent/>
                                </ListGroup.Item>
                            }
                            {currentEvents(upcomingEvents).map(item=> {
                                    var [eventdate, time] = item.start.split("T");
                                    var [year, month, date] = parseDateString(eventdate);
                                    return (
                                            <StyledListItem key={item._id} onClick={()=>handleRowClick(item)}> 
                                                <Row className="align-items-center justify-content-between">
                                                    <Col sm={1} style={{color:"#4d4444", fontWeight:"bolder"}}>
                                                        <h1>{date}</h1>
                                                    </Col>
                                                    <Col sm={2} style={{fontSize:"12pt"}}>
                                                        <h5>{month+"/"+year}</h5>
                                                    </Col>
                                                    <Col sm={4} style={{fontSize:"15pt"}}>
                                                        <h4>{item.title}</h4>
                                                    </Col>
                                                    <Col sm={3} style={{fontSize:"12pt"}}>
                                                        <p style={{marginBottom:"2px"}}><BiMap/> {item.location} </p>
                                                        {/* <p style={{marginBottom:"2px"}}>date:{month +"/" + date + "/" + year}</p> */}
                                                        <p style={{marginBottom:"2px"}}><BiTime/> {item.time}</p>
                                                    </Col>
                                                </Row>
                                            </StyledListItem>
                            )})}        
                        </ListGroup>
                        
                        {simple? (<></>): (
                        <CustomPagination postsPerPage={postsPerPage} totalPosts={upcomingEvents.length} paginate={setCurrentPage}/>
                    )}
                </>)
                :<Alert variant='secondary' style={{textAlign:'center',padding:"20px"}}><p>No upcoming events</p></Alert>} 
                {showModal? <EventViewModal show={showModal} onHide={handleClose} setSelectedEvent={setSelectedData} selectedEvent={selectedData} setShowModal={setShowModal}/> : null}
            </div>)
        :(<MySpinner/>)}
        </>
    )
}

export const EventViewModal = ({setSelectedEvent, selectedEvent, show, setShowModal, onHide})=>{
    
    const [showDeletedAlert, setShowDeletedAlert] = useState(false);
    const [editDisable, setEditDisable] = useState(true);
    const [showUpdatedAlert, setShowUpdatedAlert] = useState(false);

    const handleDelete = ()=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          body : JSON.stringify(selectedEvent),
          redirect: 'follow'
        };

        fetch(url+"events",requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                setShowDeletedAlert(true);
            }
        })
        .catch(error => console.log('err',error))
    }

    const handleUpdate = ()=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // console.log(selectedEvent);

        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body : JSON.stringify(selectedEvent),
          redirect: 'follow'
        };

        fetch(url+"events",requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                setShowUpdatedAlert(true);
            }
        })
        .catch(error => console.log('err',error))
    }

    const closeAlert =()=>{
        setShowDeletedAlert(false);
        setShowUpdatedAlert(false);
        setShowModal(false);
        window.location.reload();

    }

    const handleChange = (e)=>{
        setSelectedEvent({
            ...selectedEvent, [e.target.name] : e.target.value
        })
    }

    return (
        <>
        <Modal show={show} onHide={onHide} className='eventModal'>
            <Modal.Header closeButton className='eventModal-header'>
                <Modal.Title style={{fontWeight:'bold'}}>View Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdate} style={{wordBreak: 'break-all'}}>
                    <Form.Group>
                        <Form.Label><BiCalendarHeart/> Title </Form.Label>
                        <Form.Control type="text" name="title" defaultValue={selectedEvent.title} disabled={editDisable} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label><BiCalendarEvent/> Date </Form.Label>
                        <Form.Control type="text" name="date" disabled defaultValue={String(selectedEvent.start).split("T")[0]} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label><BiTime/> Time</Form.Label>
                        <Form.Control type="time" name="time"  disabled={editDisable} defaultValue={selectedEvent.time} onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label><BiMap/> Location</Form.Label>
                        <Form.Control type="text" name="location"  disabled={editDisable} defaultValue={selectedEvent.location} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label><BiCommentDots/> Note</Form.Label>
                        <Form.Control as="textarea" name="resource"  disabled={editDisable} defaultValue={selectedEvent.resource} onChange={handleChange}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {getToken()&&user.admin? 
                <>
                    { editDisable?
                        <>
                        <Button onClick={()=> setEditDisable(false)}>Edit</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                        </> : 
                        <Button onClick={handleUpdate}>Save Update</Button>     
                    }
                </>
                :null}
                <Button onClick={()=>setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
        <MyModal show={showDeletedAlert} handleOnClick={closeAlert} variant='success'>
            <p>Deleted the event successfully!</p>
        </MyModal>
        <MyModal show={showUpdatedAlert} handleOnClick={closeAlert} variant='success'>
            <p>Updated the event successfully!</p>
        </MyModal>
        </>
    )
}

const Events = ({simple}) => {

    var events = [new Object({
        title: "",
        start : null,
        end : null,
        time: "",
        allDay: false,
        resource: null
    })]
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
    const {response, isLoading, error } = useFetch(url+"events",requestOptions)
    
    useEffect(()=>{
        if(response){
            events = response.data;
        }    
    },[response])

    return (
        <Container>
            {!isLoading?
                <MyDiv>
                    <Container containerSize="myContainer--small">주요 일정</Container>
                    <div style={{textAlign:'center',margin:'20px'}}><h1>Upcoming Events</h1></div>
                    <UpcomingEvent simple={simple? simple : false} events={events}/>
                    {simple? null :
                    <>
                        <div style={{textAlign:'center',margin:'20px'}}><h1>행사 달력</h1></div>
                        <MyCalendar events={events}/>
                    </>}
                </MyDiv>
            : <MySpinner/> }
        </Container>
    )
}

const modalStyle = {
    backgroundColor: '#6A1010',
    color: 'white'
}

const calendarStyle={
    minHeight: '100vh'
}

export default Events
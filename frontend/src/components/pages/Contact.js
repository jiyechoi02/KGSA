import React, { useState, useReducer } from 'react';
import {Form, Row, Col, Spinner} from 'react-bootstrap';
import contact_img from '../../assets/images/contact.jpg'
import { CustomContainer as Container } from '../CustomContainer' ;
import MyModal from '../MyModal';
import MyDiv from '../MyDiv';
// import emailjs from 'emailjs-com';
import {reducer, initialData} from '../../services/AlertHelper';
import {StyledButton} from '../Styles';
import {BiMessageSquareDetail} from 'react-icons/bi';
import {RiAccountPinBoxLine ,RiKakaoTalkFill} from 'react-icons/ri';
import {HiOutlineMail} from 'react-icons/hi'
import {FaFacebookSquare, FaInstagramSquare} from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css';

const Contact = () =>{
    const TEMPLATE_ID = 'template_t3by3qv';
    const SERVICE_ID = 'service_n10zokg';
    const USER_ID = 'user_9x5OpEmuDoRRPamPUnu59';

    const [{success, fail, loading}, dispatch]= useReducer(reducer, initialData);

    const [ data, setData ] = useState({
        from_name:"",
        to_name:"KGSA",
        message:"",
        reply_to:""
    });

    const handleChange = (e) =>{
        setData({
            ...data,[e.target.name]:e.target.value
        })
   }
    const handleSubmit = (e)=>{
        e.preventDefault();

        dispatch({type:'loading', value : true})

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        import('emailjs-com')
        .then(({emailjs})=>{
            emailjs.sendForm(SERVICE_ID,TEMPLATE_ID,e.target,USER_ID)
        })
        .then((res)=>{
            if(res.status === 200){
                dispatch({type:'success', value : true})
                dispatch({type:'loading', value : false})
            }
        })
        .catch((err)=>{
            dispatch({type:'fail', value : true})
        })
    }

    const handleOnClick = ()=>{
        dispatch({type:'success', value : false})
        dispatch({type:'fail', value : false})
        dispatch({type: 'loading', value : false})

        setData({
            from_name:"",
            to_name:"KGSA",
            message:"",
            reply_to:""            
        })

    }
    return (
    <Container>
        <MyDiv>
            <Container containerSize="myContainer--small">Contact</Container>
            <div>
                <Row className="sns-container">
                    <Col className="contact-info"> 
                        <Row>
                            <img src = {contact_img} alt="contact us" style={{"maxWidth":"100%", "height":"50%", "borderRadius": "10%"}}/> 
                        </Row>
                        <Row style={{ margin:"10px"}}>
                            <ul>
                                <li>
                                    <HiOutlineMail/> Email : kgsa_umass@gmail.com
                                </li>
                                <li>
                                    <RiKakaoTalkFill/> KakaoTalk : kgsa_umass
                                </li>
                                <li> 
                                    <a href="https://www.facebook.com/groups/123384061073912"
                                    target="_blank" rel="noreferrer">
                                        <FaFacebookSquare/> KSGA Facebook
                                    </a>
                                </li>
                                <li> 
                                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                                        <FaInstagramSquare/> KSGA Instagram
                                    </a>
                                </li>
                            </ul>
                        </Row>
                    </Col>
                    <Col>
                        <Form className="text-center" onSubmit={handleSubmit} >
                            <Form.Group className="mb-3">
                                <Form.Label><RiAccountPinBoxLine size={30}/>TO</Form.Label>
                                <Form.Control type="text" placeholder="KGSA" name="to_name" value={data.to_name} disabled/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><RiAccountPinBoxLine size={30}/>FROM</Form.Label>
                                <Form.Control type="text" placeholder="Name*" name="from_name" onChange={handleChange} value={data.from_name} required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><HiOutlineMail size={30}/>EMAIL</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="reply_to" onChange={handleChange} value={data.reply_to}/>
                                <Form.Label className="text-muted"> If you want a reply, please leave your email.</Form.Label>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><BiMessageSquareDetail size={30}/>MESSAGE</Form.Label>
                                <Form.Control as="textarea" rows={10}placeholder="Message*"  name="message" onChange={handleChange}  value={data.message} required/>
                            </Form.Group>
                            <StyledButton type="submit">Sumbit</StyledButton>
                        </Form>       
                    </Col>     
                </Row>
            </div>
            {loading?
                <MyModal show={loading} handleOnClick={handleOnClick}>
                    <Spinner animation="border" variant="secondary" />
                    <span>Loading...</span>
                </MyModal>:
                <MyModal show={success} handleOnClick={handleOnClick} variant="success"><p>Has sent an email to KGSA successfully</p></MyModal>}
        </MyDiv>    
    </Container>
    )
};

export default Contact;
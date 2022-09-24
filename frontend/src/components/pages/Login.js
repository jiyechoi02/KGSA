import React, {useState, useReducer} from 'react';
import {useHistory } from 'react-router-dom';
import {Form, Row,Col, Alert, Spinner} from 'react-bootstrap';
import { CustomContainer } from '../CustomContainer';
import { FaUserAlt} from 'react-icons/fa';
import {RiLockPasswordFill} from 'react-icons/ri';
import '../../styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setSession} from '../../services/LoginHelper';
import {StyledButton as Button} from '../Styles';
import { initialData,reducer } from '../../services/AlertHelper';
import {url} from '../../services/config';

const Login = ()=>{
    const [{success, fail, loading}, dispatch] = useReducer(reducer, initialData)
    const [ input, setInput ] = useState({});
    const history = useHistory();

    const handleSubmit = (e) =>{
        e.preventDefault();
        sendInput();        
    };

    const handleChange = (e) =>{
        if(success) dispatch({type: "success", value: false})
        if(fail) dispatch({type: "fail", value: false})

        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    };

    const sendInput = () => { 
        var abortController = new AbortController();
        var signal = abortController.signal;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(input),
            redirect: 'follow',
            signal: signal
        };

        dispatch({type: "loading", value:true})

        fetch(url+"auth/login", requestOptions)
            .then(res=> res.json())
            .then(res => {
                dispatch({type: "loading", value:false})

                if(res.success){
                    setSession(res.token, res.data);
                    dispatch({type: "success", value: true})
                    window.location = "/"
                }else {
                    dispatch({type: "fail", value: true})
                }
            })
            .catch(error => console.log('error', error));
    }
    
    return (
        <CustomContainer>
            <CustomContainer containerSize="myContainer--small">Login</CustomContainer>
            <div className="login-container">
                    <Row style={{fontSize:'10pt'}}>
                        {fail? 
                            <Alert variant='danger'>Invalid username or password.</Alert>
                        : null}
                    </Row>                    
                    <Row style={{fontSize:'10pt'}}>
                        {success?
                            <Alert variant='success'>You have logged in successfully!</Alert>
                        : null}
                    </Row> 
                    <Row style={{fontSize:'10pt'}}>
                        {loading?
                            <Spinner animation="border"></Spinner>
                        : null}
                    </Row>                     
                <Form onSubmit={handleSubmit} className="login-form-container">              
                        <Form.Group as={Row}>
                            <Form.Label column><FaUserAlt/></Form.Label>
                            <Col sm="20">
                                <Form.Control autoFocus required type="text" name="username" placeholder="Username" onChange={handleChange}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column><RiLockPasswordFill/></Form.Label>
                            <Col sm="20">
                                <Form.Control required type="password" name="password" placeholder="Password" onChange={handleChange}/>
                            </Col>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button  type="submit">Login</Button>
                        </div>
                    </Form>
                    <div className="login-signup-container">
                        <p className="login-signup-text">Don't have an account?</p>
                        <Button onClick={()=>history.push('/signup')}>sign up</Button>
                    </div>
            </div>
        </CustomContainer>
    )
}

export default Login
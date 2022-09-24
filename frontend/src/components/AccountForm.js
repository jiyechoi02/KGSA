import {useState, useReducer} from 'react';
import { useHistory } from 'react-router';
import {Row,Col, Form, Alert} from 'react-bootstrap';
import {BsTag, BsPencil} from 'react-icons/bs';
import {BiUser} from 'react-icons/bi';
import {RiLockPasswordLine} from 'react-icons/ri';
import {AiOutlineMail} from 'react-icons/ai';
import {GiSmartphone} from 'react-icons/gi';
import {FcCheckmark,FcCancel} from 'react-icons/fc';
import {StyledButton as Button} from './Styles';
import MyModal from './MyModal';
import {url} from '../services/config';

const reducer = (state,action) =>{
    switch(action.type){
        case "pw_length" :
            return { ...state, pw_length : action.value };
        case "pw_lower" : 
            return { ...state, pw_lower : action.value};
        case "pw_upper" : 
            return { ...state, pw_upper : action.value};
        case "pw_special" :
            return { ...state, pw_special : action.value};
        case "pw_match" :
            return { ...state, pw_match : action.value};      
        case "valid_username" :
            return { ...state, valid_username : action.value};             
        default :
            return state;
    }
}

const AccountForm = ({form_disable,DBuser,fetchData})=>{
    const [{ pw_length, pw_lower, pw_upper, pw_special, pw_match, valid_username}, dispatch ] = useReducer(reducer, {
        pw_length : false, // at least 8 characters
        pw_lower : false,
        pw_upper : false,
        pw_special : false,
        pw_match : false,
        valid_username : form_disable? true: false,
    })

    const [user, setUser] = useState(DBuser);
    const history = useHistory();
    const [ success, setSuccess ]= useState(false);
    const [ failed, setFailed ] = useState("");
    const [ inputKey, setInputKey] = useState("form");
    const [ showAlert, setShowAlert] = useState(false);
    const [ showChangePw, setShowChangePw] = useState(false);

    const handleChange = (e)=>{
        var value = e.target.value; 
        if(e.target.name == 'firstname' || e.target.name == 'lastname') 
            value = value.toUpperCase();
   
        setUser({
            ...user, [e.target.name] : e.target.value
        });
    }

    const handleUsernameChange = (e)=>{
        if (valid_username) {
            dispatch({type:"valid_username", value: false})
        }

        setUser({
            ...user, [e.target.name] : e.target.value
        });
    }

    const handlePasswordChange = (e)=>{
        if(pw_match){
            dispatch({type:"pw_match", value: false})
        }
        var value = e.target.value;
        checkPasswordValidity(value)
        setUser({
            ...user, [e.target.name] : e.target.value
        }); 

    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // console.log(user)
        if(pw_length && pw_lower && pw_upper && pw_special && pw_match && valid_username){
            fetchData(user);
        }else{
            setShowAlert(true);
        }

    }

    const checkPasswordValidity = (value)=>{
        // var minimum = /?=.{8,}/;
    
        var uppercase = /(?=.*[A-Z])/;
        var lowercase = /(?=.*[a-z])/;
        var special_char = /(?=.*[!@#$%^&*])/;

        if(value.length >= 8) dispatch({type: "pw_length", value : true });
        else dispatch({type: "pw_length", value : false });

        if(lowercase.test(value)) dispatch({type:"pw_lower", value : true });
        else dispatch({type: "pw_lower", value : false });

        if(uppercase.test(value)) dispatch({type:"pw_upper", value : true });
        else dispatch({type: "pw_upper", value : false });

        if(special_char.test(value)) dispatch({type: "pw_special", value : true });
        else dispatch({type: "pw_special", value : false });
    }

    const comparePasswords = (e) =>{
        var pw = user.password;
        var val = e.target.value;
        dispatch({type: "pw_match", value : !pw.localeCompare(e.target.value)});
    }
    
    const verifyUsername = async (e)=>{
        e.preventDefault();
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        
        fetch(`${url}signup/${user.username}`,requestOptions)
        .then(res=>res.json())
        .then(res =>{
            if(res.data.length>0){
                dispatch({type: "valid_username", value : false });
            }else{
                dispatch({type: "valid_username", value : true });
            }
        })
        
    }

    // const resetForm = ()=>{
    //     var date = Date.now().toString()
    //     setInputKey(date);
    //     setSuccess(false);
    //     setFailed(false);
    // }

    
    return (
            <Form onSubmit={handleSubmit} key={inputKey}>
                <Form.Group className="account-form-group">
                    <Row className="justify-content-center">
                        <Col sm={2} style={colStyle}>
                            <Form.Label><BsTag/></Form.Label>
                        </Col>
                        <Col sm={5} style={colStyle}>
                            <Form.Control 
                                style={signupFormControl} 
                                type="text" 
                                name="firstname" 
                                placeholder={user.firstname? user.firstname :"First name*"}
                                onChange={handleChange} 
                                defaultValue={user.firstname}
                                required/>
                        </Col>
                        <Col sm={5} style={colStyle}>
                            <Form.Control 
                                style={signupFormControl} 
                                type="text" 
                                name="lastname" 
                                placeholder={user.lastname? user.lastname : "Last name*"}
                                onChange={handleChange} 
                                defaultValue={user.lastname}
                                required/>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="account-form-group">
                    <Row className="justify-content-center">
                        <Col sm={2} style={colStyle}>
                            <Form.Label><BiUser/></Form.Label>
                        </Col>
                        <Col sm={5} style={colStyle}>
                            <Form.Control 
                                disabled={form_disable} 
                                style={signupFormControl} 
                                type="text" 
                                name="username" 
                                placeholder={user.username? user.username :"Username*"}
                                onChange={handleUsernameChange} 
                                defaultValue={user.username}
                                required/>                        
                        </Col>
                        {!form_disable?
                            <>
                                <Col sm={3} style={colStyle}>
                                    <Button onClick={verifyUsername} margin="0px">Verify</Button>       
                                </Col>     
                                <Col sm={2} style={colStyle}> 
                                    {valid_username? <FcCheckmark/> : <FcCancel/>}             
                                </Col>
                            </>: <Col sm={5}></Col>}
                    </Row>
                </Form.Group>
                    <>
                        <Form.Group className="account-form-group">                                          
                            <Row className="justify-content-center">
                                <Col sm={2} style={colStyle}>
                                    <Form.Label><RiLockPasswordLine/></Form.Label>
                                </Col>
                                <Col sm={10} style={colStyle}>
                                    <Form.Control 
                                        style={signupFormControl} 
                                        type="password" 
                                        name="password" 
                                        placeholder="Password*" 
                                        onChange={handlePasswordChange} 
                                        required/>                            
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="account-form-group">
                            <Row className="justify-content-center">
                                <Col sm={2} style={colStyle}>
                                    <Form.Label><RiLockPasswordLine/></Form.Label>
                                </Col>                            
                                <Col sm={10} style={colStyle}>
                                    <Form.Control 
                                        style={signupFormControl} 
                                        type="password" 
                                        name="passwordconfirm" 
                                        placeholder="Confirm Password*" 
                                        onChange={comparePasswords} 
                                        required/>                            
                                </Col>
                            </Row>    
                            <Row className="justify-content-center">
                                <Col sm={12} style={colStyle}>
                                    <Alert variant={pw_length && pw_lower && pw_upper && pw_special && pw_match? "success" : "danger"} className="account-password-alert">
                                        <p className="account-password-condition">{pw_length? <FcCheckmark/>: <FcCancel/>} Minimum 8 character</p>
                                        <p className="account-password-condition">{pw_upper? <FcCheckmark/>: <FcCancel/>} A uppercase letter</p>
                                        <p className="account-password-condition">{pw_lower? <FcCheckmark/>: <FcCancel/>} A lowercase letter</p>
                                        <p className="account-password-condition">{pw_special? <FcCheckmark/>: <FcCancel/>} A special character</p>
                                        <p className="account-password-condition">{pw_match? <FcCheckmark/>: <FcCancel/>}Passwords match </p>
                                    </Alert>
                                </Col>
                            </Row>                     
                        </Form.Group>
                    </>
                <Form.Group className="account-form-group">
                    <Row className="justify-content-center">
                        <Col sm={2} style={colStyle}>
                            <Form.Label><AiOutlineMail/></Form.Label>
                        </Col>
                        <Col sm={10} style={colStyle}>
                            <Form.Control 
                                style={signupFormControl} 
                                type="email" 
                                name="email" 
                                placeholder={user.email? user.email: "Email*" }
                                onChange={handleChange} 
                                defaultValue={user.email}
                                required/>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="account-form-group">
                    <Row className="justify-content-center">
                        <Col sm={2} style={colStyle}>
                            <Form.Label><GiSmartphone/></Form.Label>
                        </Col>
                        <Col sm={10} style={colStyle}>
                            <Form.Control 
                                style={signupFormControl} 
                                type="type" 
                                name="phone_number" 
                                placeholder= {user.phone_number? user.phone_number :"Phone Number*" }
                                onChange={handleChange} 
                                defaultValue={user.phone_number}
                                required/>
                        </Col>
                    </Row>
                </Form.Group>  
                <Form.Group className="account-form-group">
                    <Row className="justify-content-center">
                        <Col sm={2} style={colStyle}>
                            <Form.Label><BsPencil/></Form.Label>
                        </Col>
                        <Col sm={10} style={colStyle}>
                            <Form.Control 
                                style={signupFormControl} 
                                type="text" 
                                name="major" 
                                placeholder={user.major? user.major: "Major"}
                                defaultValue={user.major}
                                onChange={handleChange}/>
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="justify-content-center">
                    <Col style={colStyle}>
                    <Button type="submit" float="right">Submit</Button>
                    {!form_disable ?<Button float="right" onClick={()=>{history.push('/login')}}>Cancel</Button>  : null}                  
                    </Col>      
                </Row>    
                <MyModal show={showAlert} variant='danger' handleOnClick={()=>{setShowAlert(false)}}><p>Please satisfy the requirement before submission..</p></MyModal>    
            </Form>
    )
}

const signupFormControl = {
    borderRadius:"10px"
 }

 const colStyle ={
    display : 'flex', 
    justifyContent:'center',
    marginBottom : '5px'
 }
 
export default AccountForm;
import {CustomContainer as Container} from '../CustomContainer';
import { Row,Col, Alert,InputGroup,Form, ListGroup, Tab, Tabs} from 'react-bootstrap';
import {useReducer, useState ,useEffect} from 'react';
import '../../styles.css'
import { useHistory, useParams } from "react-router-dom";
import { getUser, removeSession } from "../../services/LoginHelper";
import MyModal from "../MyModal";
import MyDiv from '../MyDiv';
import {StyledButton as Button} from '../Styles';
import AccountForm from "../AccountForm";
import {RiLockPasswordLine} from 'react-icons/ri';
import {BsTag, BsPencil} from 'react-icons/bs';
import {BiUser} from 'react-icons/bi';
import {AiOutlineMail} from 'react-icons/ai';
import {GiSmartphone} from 'react-icons/gi';
import { initialData, reducer } from '../../services/AlertHelper';
import MyTable from '../MyTable';
import {url} from '../../services/config';

const user = getUser();

export const MyAccount = ()=>{
    const [authorized, setAuthorized] = useState(false);
    const history = useHistory()
    const [user, setUser] = useState({
        firstname : "",
        lastname : "",
        username : "",
        password : "",
        email : "",
        phone_number : null,
        major : ""
    });

    const handleBackClick = ()=>{
        history.goBack()
    }
    useEffect(()=>{
        let userData = getUser();
        setUser(userData);
    },[])
    return(
        <MyDiv> 
            <Container containerSize="myContainer--small">나의 계정</Container>
            <Form>
                <Form.Group className="account-form-group">
                    <Row>
                        <Col>
                            <Form.Label><BsTag/></Form.Label>
                        </Col>
                        <Col xs={5}>
                            <InputGroup.Text>{user.firstname}</InputGroup.Text>
                        </Col>
                        <Col xs={5}>
                            <InputGroup.Text>{user.lastname}</InputGroup.Text>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="account-form-group">
                    <Row>
                        <Col>
                            <Form.Label><BiUser/></Form.Label>
                        </Col>
                        <Col xs={10}>
                            <InputGroup.Text>{user.username}</InputGroup.Text>                   
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="account-form-group">
                    <Row>
                        <Col>
                            <Form.Label><AiOutlineMail/></Form.Label>
                        </Col>
                        <Col xs={10}>
                            <InputGroup.Text>{user.email}</InputGroup.Text>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group className="account-form-group">
                    <Row>
                        <Col>
                            <Form.Label><GiSmartphone/></Form.Label>
                        </Col>
                        <Col xs={10}>
                            <InputGroup.Text>{user.phone_number}</InputGroup.Text>
                        </Col>
                    </Row>
                </Form.Group>  
                <Form.Group className="account-form-group">
                    <Row>
                        <Col>
                            <Form.Label><BsPencil/></Form.Label>
                        </Col>
                        <Col xs={10}>
                            <InputGroup.Text>{user.major? user.major : "N/A"}</InputGroup.Text>
                        </Col>
                    </Row>
                </Form.Group>      
                <Button className="account-form-button" onClick={handleBackClick}>Back</Button>
            </Form>            
        </MyDiv>
    )

}

export const LockAccount = ({setAuthorized})=>{
    const [{success, fail, loading}, dispatch] = useReducer(reducer, initialData)

    const history = useHistory();
    const user = getUser()
    const [ pw, setPw] = useState({
        password: ""
    });
    
    const handleChange = (e)=>{
        if(fail) dispatch({type: "fail", value: false})
        if(success) dispatch({type: "success", value: false})

        setPw({...pw, password : e.target.value});
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();

        dispatch({ type: "loading", value: true})
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(pw),
            redirect: 'follow'
        };
        // console.log(pw)
        try{
            const res = await fetch(`${url}auth/myaccount/lock/${user.username}`,requestOptions).then(res=>res.json())
            
            dispatch({ type:"loading", value:false})

            if(res.success){
                setAuthorized(true);
                dispatch({type: "success", value: true})

            }else{
                dispatch({ type:"fail", value:true})
            }
        }catch(e){
            dispatch({ type:"fail", value:true})
        }
 
    }
    return(
            <div style={{background:"#4d44441e", padding:"50px"}}>
                {fail? <Alert className="lock-account-item alert" variant='danger'>Invalid password.</Alert> : null}
                <Form className="lock-account-form" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label className="lock-account-item">
                            <RiLockPasswordLine className={!fail? "lock-account-item icon" : "lock-account-item icon invalid"} />
                        </Form.Label>
                        <Form.Control className={!fail? "lock-account-item control" : "lock-account-item control invalid"} type="password" placeholder="password" onChange={handleChange} required/>
                    </Form.Group>
                    <Button type="submit" className="lock-account-item" >Submit</Button>
                </Form>
            </div>        
    )
}

export const EditAccount = ()=>{
    const [authorized, setAuthorized ] = useState(false);
    const user = getUser();

    const updateAccount = async (user) =>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method : 'PUT',
            headers : myHeaders,
            body : JSON.stringify(user),
            redirect: 'follow'
        };

        try{
            const result = await fetch(`${url}auth/${user.username}`,requestOptions).then(res=>res.json())
        }catch(e){
            console.log(e)
        }

    }
    return (
        <MyDiv>
            <Container containerSize="myContainer--small">Edit Account</Container>
            {!authorized?       
                <LockAccount setAuthorized={setAuthorized}/> 
                : 
            <>
                <AccountForm form_disable={true} DBuser={user} fetchData={updateAccount}/>     
            </>
            } 
        </MyDiv>
    )
}

export const DeleteAccount = ()=>{
    const [{success, fail, loading}, dispatch] = useReducer(reducer,initialData)

    const user = getUser();

    const history = useHistory();
    const [selectedYes, setSelectedYes] = useState(false);
    const [ typedCorrect, setTypedCorrect] = useState(false);
    const [ authorized, setAuthorized ] = useState(false);

    const compareString = (e)=>{
        setTypedCorrect("delete".localeCompare(e.target.value))
    }

    const deleteAccount = async ()=>{
        dispatch({type:'loading', value :true})

        const username = user.username;
        const firstname = user.firstname;

        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
          
        try{
            const res = await fetch(`${url}auth/${username}`, requestOptions).then(res=>res.json())
            dispatch({type:'loading', value :false})
            if(!res.success){
                dispatch({type:'fail', value :true})
            }else{
                dispatch({type:'success', value: true})
                const timer = setTimeout(()=>{
                    removeSession();
                    window.location.replace('/');
                },3000)
            }
        }catch(e){
            console.log(e)
        }
    }

    const handleClose = ()=>{
        removeSession();
        window.location.replace('/');
    }
    return (
        <MyDiv>
           <Container containerSize="myContainer--small">계정 삭제</Container>  
        {!authorized? 
            <LockAccount setAuthorized={setAuthorized}/>: 
            <>
                <ListGroup style={{textAlign:'center'}}>
                        <ListGroup.Item>   
                            <Alert variant="danger">Do you really want to delete this account?</Alert>
                            <Row>
                                <Col>
                                    <Button className="delete-account" onClick={()=>history.goBack()}> Nah, Just Kidding..</Button>                    
                                </Col>
                                <Col>
                                    <Button className="delete-account" onClick={()=>setSelectedYes(true)}> Yes!!!</Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        {selectedYes? 
                        <ListGroup.Item>
                            <InputGroup.Text>Type "delete"...</InputGroup.Text>
                            <Form.Control type="Text" placeholder="delete" onChange={compareString}></Form.Control>
                            <Button className="delete-account" disabled={typedCorrect} onClick={deleteAccount}>Delete</Button>
                        </ListGroup.Item>    
                        : null}
                    </ListGroup>
            </>}
            <MyModal show={success} handleOnClick={handleClose} variant='success'>
                <p>
                    Too sad to see you go!
                </p> 
                <p>
                    But we deleted your account successfully.
                </p>
            </MyModal>
        </MyDiv>
    )
}
export const MyActivity = ()=>{
    const history = useHistory();

    const [marketData, setMarketData] = useState([]);
    const [housingData, setHousingData] = useState([]);


    useEffect(()=>{
        var requestOptions = {
            method : 'GET',
            redirect : 'follow'
        }

        let unsubscribe = false;

        const fetchMarketData = ()=>{
            if(unsubscribe) return;

            fetch(`${url}market/${user.username}`,requestOptions)
            .then(res=>res.json())
            .then(res=>setMarketData(res.data))
            .catch(err => console.log(err))
    
        }

        fetchMarketData();

        return ()=>{
            unsubscribe = true;
        }
    },[])

    useEffect(()=>{
        let unsubscribe = false;
        var requestOptions = {
            method : 'GET',
            redirect : 'follow'
        }
        
        const fetchHousingData = ()=>{
            if(unsubscribe) return;
            
            fetch(`${url}housing/${user.username}`,requestOptions)
            .then(res=>res.json())
            .then(res=>setHousingData(res.data))
            .catch(err => console.log(err))
        }

        fetchHousingData();

        return ()=>{
            unsubscribe = true;
        }
    },[])


    return (
        <MyDiv>
            <Container containerSize="myContainer--small">나의 활동</Container>
            <Tabs defaultActiveKey="market">
                <Tab eventKey="market" title="Market">
                    <MyTable simple={false} data={marketData} url="market"/>
                </Tab>
                <Tab eventKey="housing" title="Housing">
                    <MyTable simple={false} data={housingData} url="housing"/>
                </Tab>
            </Tabs>
        </MyDiv>
    )
}

const UserDashboard =() =>{
    const {menu} = useParams()
    const componentList = {
        deleteAccount : DeleteAccount,
        myAccount : MyAccount,
        myActivity : MyActivity,
        editAccount : EditAccount,
    }
    
    const [showMenu, setShowMenu]=useState(true);
    
    const handleCloseMenu =()=>setShowMenu(false)
    const toggleMenu = ()=>setShowMenu(!showMenu);

    var MyComponent = componentList[menu];

    return (
        <Container>
            <MyComponent/>
        </Container>

    )
}

export default UserDashboard;
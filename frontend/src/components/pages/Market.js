import { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { Row,Modal ,Col} from "react-bootstrap";
import { CustomContainer as Container } from '../CustomContainer' ;
import MyTable from "../MyTable";
import MyModal from '../MyModal';
import MySpinner from '../MySpinner';
import {StyledButton as Button} from '../Styles';
import ViewPost from '../ViewPost';
import Comments from '../Comments';
import {RiArrowGoBackFill} from 'react-icons/ri';
import {getUser,getToken} from '../../services/LoginHelper';
import Editor from "../Editor";
import { useFetch } from "../../services/UseAPIs";
import MyDiv from "../MyDiv";
import EditPost from "../EditPost";
import {url} from '../../services/config';

const user = getUser()

export const MarketEditPost = ()=>{
    const {_id} = useParams();
    let data =null;
    const {response, isLoading, error} = useFetch(`${url}market/posts/${_id}`)

    useEffect(()=>{
        if(response){
            if(response.success) {
                data = { 
                    title : response.data.title,
                    contents : response.data.contents,
                    username : response.data.username,
                    price : response.data.price,
                    keys : response.data.keys
                }
            }
        }
    },[response])


    const updataData = (dataToUpdate,dispatch) =>{

        var requestOptions = {
            method : 'PUT', 
            body : dataToUpdate,
            redirect: 'follow'
        };

        fetch(`${url}market/${_id}`,requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                    dispatch({type:"success", value:true})
            }
            else dispatch({type:"fail", value:true})
        })
        .catch(error => dispatch({type:"fail", value:true}))
        .finally(()=>{
            dispatch({type:"loading", value:false})
        })
    }
    
    return (
        <Container>
            <MyDiv>
                <Container containerSize="myContainer--small">벼룩시장</Container> 
                {response && <EditPost onSubmit={updataData} initialData={data} price={true}/>}
            </MyDiv>
        </Container>
    )
}
export const MarketNewPost = ()=>{

    const postData = (data,dispatch)=>{
        var myHeaders = new Headers();

        var requestOptions = {
            method: 'POST', 
            body: data,
            redirect: 'follow'
        };
        fetch(url+'market', requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                    dispatch({type:"success", value:true})
            }
            else dispatch({type:"fail", value:true})
        })
        .catch(error => dispatch({type:"fail", value:true}))
        .finally(()=>{
            dispatch({type:"loading", value:false})
        })
    }
    return(
        <Container>
            <MyDiv>
                <Container containerSize="myContainer--small">벼룩시장</Container>                
                <Editor price={true} onSubmit={postData} address={true} initialData={{username:user.username}}/>
            </MyDiv>
        </Container>        
    )
}

export const MarketPostView = () =>{
    const { _id } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);
    const [ showConfirm, setShowConfirm] = useState(false);
    const history = useHistory();
    // const [data, setData] =useState();

    let data = null;
    const {response, isLoading, error} = useFetch(`${url}market/posts/${_id}`)
    
    useEffect(()=>{
        if(response) {
            if(response.success)
                data = response.data
        }
    
    },[response])
    
    const handleGoBack = () =>{
        // go back to announcement page
        // history.push('/market');
        history.goBack();
    }
    
    const handleDelete = ()=>{
        setShowConfirm(true);
    }   

    const deletePost = ()=>{
        var requestOptions = {
            method : 'DELETE',
            redirect: 'follow'
        };
        fetch(`${url}market/${_id}/${user.username}`,requestOptions)
        .then(res => res.json())
        .then(() => setIsDeleted(true))
        .catch(error => console.log('error', error));
    }
    
    const handleUpdate =()=>{
        history.push(`/market/edit/${_id}`)
    }

    const updateViews = ()=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method : 'PUT',
            redirect: 'follow'
        };

        fetch(`${url}market/views/${_id}`,requestOptions)
        .then(res=>res.text())
        .catch(err=>console.log('err',err));

    }
    useEffect(()=>{
        updateViews();        
    },[])

    return(
            <Container>
                {!data? <MySpinner/> :
                <MyDiv>
                    <Container containerSize="myContainer--small">벼룩시장</Container>
                    <Row>
                        <Col lg={5}>
                            <Button onClick={handleGoBack}><RiArrowGoBackFill/> Back</Button>
                        </Col>
                    </Row>
                    {data &&
                        <>
                            <Row>
                                <ViewPost data={data} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
                            </Row>
                            <Row>
                                <Comments forumItem="market" _id={_id}/>
                            </Row>
                        </>
                    }    
                </MyDiv>
                }
                <MyModal show={isDeleted} handleOnClick={handleGoBack} variant='success'>
                    <p>The post has been deleted successfully</p>
                </MyModal>
                <MyModal show={showConfirm} handleOnClick={()=>setShowConfirm(false)}>
                        <Modal.Body style={{textAlign:"center"}}>
                            <p>Are you sure about that??</p>
                            <Button margin="0px" onClick={deletePost}>Confirm</Button>
                        </Modal.Body>
                </MyModal>                
            </Container> 
    )
}

export const Market = ()=>{
    const {response, isLoading, erro } = useFetch(url+"market")
    const token = getToken();
    const history = useHistory();

    const handleClick = ()=>{
        history.push(`/market/post`)
    }

    return (
        <Container>
            {!response? <MySpinner/> :
                <MyDiv>
                    <Container containerSize="myContainer--small">벼룩시장</Container>
                    <Row>
                        <Col>
                            <Button onClick={handleClick} disabled={!token? true:false}>New Post</Button>
                        </Col>
                    </Row>
                    <Row>
                        {response && <MyTable simple={false} notices={response.notices} data={response.posts} url="market"/>}
                    </Row>
                </MyDiv>
            }
        </Container>
    )
}


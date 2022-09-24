import { useEffect, useState } from "react";
import {useHistory,useParams} from 'react-router-dom';
import { getUser,getToken } from '../../services/LoginHelper';
import { useFetch } from "../../services/UseAPIs";

import {Row, Col,Modal,Alert} from 'react-bootstrap';
import {CustomContainer as Container} from '../CustomContainer'

import Editor from '../Editor';
import MyTable from "../MyTable";
import MyModal from '../MyModal';
import MySpinner from '../MySpinner';
import ViewPost from '../ViewPost';
import Comments from '../Comments';
import MyDiv from "../MyDiv";
import EditPost from "../EditPost";

import {url} from '../../services/config';
import {StyledButton as Button} from '../Styles';
import {RiArrowGoBackFill} from 'react-icons/ri';

const user = getUser();
const token = getToken();

export const AnncmntEditPost = ()=>{

    const {_id} = useParams();
    let data = null;
    const {response, isLoading, error} = useFetch(`${url}notice/posts/${_id}`)

    useEffect(()=>{
        if(response){
            if(response.success) {
                data = { 
                    title : response.data.title,
                    contents : response.data.contents,
                    username : response.data.username,
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

        fetch(`${url}notice/edit/${_id}`,requestOptions)
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
        <Container >
            <Container containerSize="myContainer--small">공지 사항</Container>
            {isLoading? <MySpinner/> :
                <MyDiv>
                    {response && <EditPost onSubmit={updataData} initialData={data}/>}
                    {error? <div>{error}</div>: null}
                </MyDiv>
            }
        </Container>
    )
}

export const AnncmntNewPost = ()=>{
    const data = {
        username : user.username,
    }

    const postData = (data,dispatch)=>{

        var requestOptions = {
            method: 'POST', 
            body: data,
            redirect: 'follow'
        };
        fetch(url+'notice', requestOptions)
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
                <Container containerSize="myContainer--small">공지사항</Container>
                <Editor initialData={data} onSubmit={postData}/>
            </MyDiv>
        </Container>)
}

export const AnncmntPostView = (props) =>{

    const { _id } = useParams(); // get id,username params
    const [isDeleted, setIsDeleted] = useState(false);
    const [ showConfirm, setShowConfirm] = useState(false);
    const history = useHistory();
    let data = null;
    const {response} = useFetch(`${url}notice/posts/${_id}`)

    
    if(response) {
        if(response.success)
            data = response.data
    }

    const handleGoBack = () =>{
        // go back to announcement page
        history.push('/announcements');
    }
    
    const handleDelete = ()=>{
        // handle when the post delete button clicked
        setShowConfirm(true);
    }   
    
    const handleUpdate =()=>{
        // go to the post update page 
        history.push(`/announcements/edit/${_id}/${user.username}`);
    }

    const deletePost = ()=>{
        // delete post 
        var requestOptions = {
            method : 'DELETE',
            redirect: 'follow'
        };
        fetch(`${url}notice/${_id}/${user.username}`,requestOptions)
        .then(res => res.json())
        .then(() => setIsDeleted(true))
        .catch(error => console.log('error', error));
    }

    useEffect(()=>{
        const updateViews = ()=>{
            // update the number of views 
    
            var requestOptions = {
                method : 'PUT',
                redirect: 'follow'
            };
    
            fetch(`${url}notice/views/${_id}`,requestOptions)
            .then(res=>res.text())
            .catch(err=>console.log('err',err));
        }
        updateViews();        
    },[])
    
    return(
        <Container>
            {!data? <MySpinner/> :
                    <MyDiv>
                        <Container containerSize="myContainer--small">공지사항</Container>
                        <Row className="justify-content-between">
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
                                    <Comments forumItem="notice" _id={_id}/>
                                </Row>
                            </>
                        }   
                        <Modal show={showConfirm} onHide={()=>setShowConfirm(false)}>
                            <Modal.Header style={{background:"#6A1010"}} closeButton>KGSA</Modal.Header>
                            <Modal.Body style={{textAlign:"center"}}>
                                <Alert variant='danger'>Are you sure about that??</Alert>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={deletePost}>Confirm</Button>
                                <Button onClick={()=>setShowConfirm(false)}>Cancel</Button>
                            </Modal.Footer>
                        </Modal>
                        <MyModal show={isDeleted} handleOnClick={handleGoBack} variant='success'>
                            <p>The post has been deleted successfully</p>
                        </MyModal>
                    </MyDiv>
                }
        </Container>

    )
}

export const Announcements = ({simple})=>{
    
    const history = useHistory();
    const {response} = useFetch(url+"notice")
    const handleNewPostClick = ()=>{
        history.push(`/announcements/post/${token}`)
    }

    return (
        <Container>
            {!response? <MySpinner/>  :
                <MyDiv>
                    <Container containerSize='myContainer--small'>
                        공지사항
                    </Container>
                    <Row>
                        <Col xs={1}>
                            {user && <Button margin="0px" onClick={handleNewPostClick} disabled={!user.admin? true:false}>Add</Button>}
                        </Col>
                    </Row>
                    <Row>
                        {response && <MyTable simple={simple? simple : false} data={response.data} url="announcements"/>}
                    </Row>
                </MyDiv>

            }                         
        </Container>
    )
}

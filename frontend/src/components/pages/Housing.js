import { useEffect, useState } from "react";
import {Row,Col,Modal} from 'react-bootstrap';
import { CustomContainer as Container } from '../CustomContainer' ;
import MyTable from "../MyTable";
import { StyledButton as Button} from "../Styles";
import { getToken,getUser } from "../../services/LoginHelper";
import { useHistory,useParams } from "react-router-dom";
import ViewPost from '../ViewPost';
import Comments from '../Comments';
import {RiArrowGoBackFill} from 'react-icons/ri';
import MyModal from '../MyModal';
import Editor from "../Editor";
import { useFetch } from "../../services/UseAPIs";
import MySpinner from "../MySpinner";
import MyDiv from "../MyDiv";
import EditPost from "../EditPost";
import {url} from '../../services/config';

const user = getUser();
const token = getToken();

export const HousingEditPost = ()=>{
    /*
        Edit page for Hosuing.
        When a user clicks a the user's post and edits it, 
        it fetchs data and Call Editor component by passing the orignal data and submit function.
    */
//    const data = 
    const {_id} = useParams();
    let data =null;
    const {response, isLoading, error}= useFetch(`${url}housing/posts/${_id}`)

    useEffect(()=>{
        if(response){
            if(response.success){
                data = { 
                    title : response.data.title,
                    contents : response.data.contents,
                    address : response.data.address,
                    price : response.data.price,
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

        fetch(`${url}housing/${_id}`,requestOptions)
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
                <Container containerSize="myContainer--small">하우징</Container>  
                {response && <EditPost onSubmit={updataData} initialData={data} price={true} address={true}/>}
            </MyDiv>
        </Container>
    )
}

export const HousingNewPost = ()=>{
    /*
        when a user makes a new post, it call Editor as well but null initial data with user's username, and
        submit function.
    */
    const postData = (data,dispatch)=>{

        var requestOptions = {
            method: 'POST', 
            body: data,
            redirect: 'follow'
        };
        fetch(url+'housing', requestOptions)
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
                <Container containerSize="myContainer--small">하우징</Container>                
                <Editor price={true} onSubmit={postData} address={true} initialData={{username:user.username}}/>
            </MyDiv>
        </Container>
    )
}

export const HousingPostView = () =>{
    /*
        this is a housing post view page. 
        when a user clicks a post, it fetchs data with the post id. 
    */
    const { _id } = useParams();
    // const data = props.location.state.data
    let data = null;
    const [isDeleted, setIsDeleted] = useState(false);
    const [ showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();
    const {response, isLoading, error} = useFetch(`${url}housing/posts/${_id}`)
    
    useEffect(()=>{
        if(response) {
            if(response.success)
                data = response.data
        }
    },[response])

    const handleDelete = ()=>{
        setShowConfirm(true);
    }   

    const deletePost = ()=>{
        var requestOptions = {
            method : 'DELETE',
            redirect: 'follow'
        };
        fetch(`${url}housing/${data._id}/${user.username}`,requestOptions)
        .then(res => res.text())
        .then((res) => {
            setIsDeleted(true)
        })
        .catch(error => console.log('error', error));
    }
    
    const handleUpdate =()=>{
        history.push(`/housing/${data._id}`);
        // history.push({
        //     pathname: `/housing/edit/${data._id}`,
        //     state: { data: data }
        // })
    }

    const handleClose = ()=>{
        history.goBack();
    }
    const updateViews = ()=>{

        var requestOptions = {
            method : 'PUT',
            redirect: 'follow'
        };

        fetch(`${url}housing/views/${_id}`,requestOptions)
        .then(res=>res.text())
        .catch(err=>console.log('err',err));

    }
    useEffect(()=>{
        // update the post's Views
        updateViews();        
    },[])

    return(
            <Container>
                <MyDiv>
                    {!response? <div><MySpinner/></div>   :
                    <>
                        <Container containerSize="myContainer--small">하우징</Container>                
                        <Row>
                            <Col lg={5}>
                                <Button onClick={handleClose}><RiArrowGoBackFill/> Back</Button>
                            </Col>
                        </Row>
                        {data &&
                            <>
                                <Row>
                                    <ViewPost data={data} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
                                </Row>
                                <Row>
                                    <Comments forumItem="housing" _id={_id}/>
                                </Row>
                            </>
                        }    
                        <MyModal show={isDeleted} handleOnClick={handleClose} variant="success">
                            <p>The post has been deleted successfully</p>
                        </MyModal>
                        <MyModal show={showConfirm} handleOnClick={()=>setShowConfirm(false)}>
                            <Modal.Body style={{textAlign:"center"}}>
                                <p>Are you sure about that??</p>
                                <Button margin="0px" onClick={deletePost}>Confirm</Button>
                            </Modal.Body>
                        </MyModal>
                    </>
                }          
                </MyDiv>
            </Container> 
    )
}

export const Housing = ()=>{
    /*
        fetch the whole housing data and pass it to MyTable.
    */
    const {response, isLoading, error} = useFetch(url+"housing")
    const history = useHistory();

    const handleClick = ()=>{
        history.push(`/housing/post`)
    }
    return (
        <Container>
            {!response? <MySpinner/>  : 
            <MyDiv>
                <Container containerSize="myContainer--small">하우징</Container>
                <Row>
                    <Col>
                        <Button onClick={handleClick} disabled={!token? true:false}>New Post</Button>
                    </Col>
                </Row>
                <Row>
                    {response && <MyTable simple={false} data={response.posts} notices={response.notices} url="housing"/>}
                </Row>
            </MyDiv>
            }
        </Container>
    )
}

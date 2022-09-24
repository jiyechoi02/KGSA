import React, {useState, useEffect, useReducer} from 'react'
import '../../styles.css';
import { StyledButton as Button } from '../Styles';
import { Card, Col, Form, Row,Carousel, ListGroup, Alert} from 'react-bootstrap';
import { CustomContainer as Container } from '../CustomContainer' ;
import { getUser } from '../../services/LoginHelper';
import { initialData, reducer } from '../../services/AlertHelper';
import MyModal from '../MyModal';
import MySpinner from '../MySpinner';
import { checkAuth } from '../AuthButtons';
import {RiDeleteBin2Line,RiCheckboxMultipleBlankLine} from 'react-icons/ri';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import MyDiv from '../MyDiv';
import {url} from '../../services/config';

const user = getUser();

const StyledP = styled.p`
    color : black;
    font-size : 13pt;
    &:hover{
        color : red;
    }
`

export const GalleryNewPost = () =>{
    const [{success, fail,loading}, dispatch] = useReducer(reducer,initialData)

    const [uploadedFiles, setUploadedFiles] = useState([])
    const [inputKey, setInputKey]= useState("inputKey")
    const [ inputFileKey, setInputFileKey] = useState("inputFileKey");
    const [ data, setData] = useState({
        name : "",
        caption : "",
    });

    const handleFileChange = (e)=>{
        const files = e.target.files
        if(files.length> 10){
            console.log("Too many files") // replace it to Alert 
            // setInputFileKey(new Date()) //set a random key to reset the file form 
        }

        for(let i =0; i<files.length; i++){
            setUploadedFiles(prev=> [...prev, files[i]])
        }

        setInputFileKey(new Date())
    }

    const handleInputChange = (e)=>{
        setData({...data, [e.target.name] : e.target.value})
    }

    const handleSumbit = (e) => {
        e.preventDefault();
        dispatch({type:"loading", value : true})
        
        var formData = new FormData();
        formData.append("name", data.name);
        formData.append("caption", data.caption);

        for (let i =0; i< uploadedFiles.length; i ++){
            formData.append("imgCollection", uploadedFiles[i]);
        }
 
        var requestOptions = {
            method: 'POST', 
            body: formData,
        };

        fetch(url+"gallery", requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.success){
                    dispatch({type:"loading", value:false})
                    dispatch({type:"success", value:true})
                }
                else dispatch({type:"fail", value:true})
            })
            .catch(error => dispatch({type:"fail", value:true}))
            .finally(()=>{
                dispatch({type:"loading", value:false})
            })
    }

    const handleSuccessClick = ()=>{
        dispatch({type:"success", value:false})
        setInputFileKey(new Date())
        setInputKey(new Date())
    }
    
    const renderUploadedFilesList = ()=>{
        const list = uploadedFiles.map((item,i)=>{
            console.log(item)
            return (
                <li key={i} style={{fontSize:'10pt'}}>
                    <Row>
                        <Col xs={10}>
                            {item.name}
                        </Col>
                        <Col xs={2}>
                            <StyledP onClick={()=>handleDeleteUploadFiles(i)}><RiDeleteBin2Line/></StyledP>
                        </Col>
                    </Row>
                </li>
            )
        })

        return list
    }

    const handleDeleteUploadFiles = (index)=>{
        setUploadedFiles(uploadedFiles.filter((item,i)=> i!== index));
    }
    return (
        <Container>
            <MyDiv>
                <Container containerSize="myContainer--small">갤러리</Container>
                <Form onSubmit={handleSumbit} className="editor-form"  key={inputKey}>
                    <Form.Control className="editor-form-control"  type="text" name="name" placeholder="Title" onChange={handleInputChange}/>            
                    <Form.Control className="editor-form-control"  type="file" multiple onChange={handleFileChange} key={inputFileKey} accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"/>  
                    {uploadedFiles && 
                        <ul>
                            {renderUploadedFilesList()}
                        </ul>
                    }
                    <Form.Control className="editor-form-control" as="textarea" name="caption" placeholder="Caption" onChange={handleInputChange} rows={3}/>
                    <Button margin="0px" type="submit">Submit</Button>
                </Form>
                <MyModal show={loading} closeButton={false}>
                    <MySpinner/>
                </MyModal>
                <MyModal show={success} handleOnClick={handleSuccessClick} variant='success'>
                    <p>uploaded images successfully!</p>
                </MyModal>
                <MyModal show={fail} handleOnClick={()=>dispatch({type:"fail", value: false})} variant='danger'>
                    <p>Opps, something is wrong.</p>
                    <p>Try Again</p>
                </MyModal>
            </MyDiv>
        </Container>
    )
}

const StyledCard = styled(Card)`
width: 18rem;
&:hover{
    transform: scale(0.97); 
}
`


export const GalleryView = (props)=>{
    const data = props.location.state.data
    // const {_id} = useParams();
    const [deleted, setDeleted] = useState(false)
    const history = useHistory()
    let srcs = []

    useEffect(()=>{
        if(data) srcs = data.imgCollection.urls
    },[data])

    const handleDelete = ()=>{
        const keys = data.imgCollection.keys
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            method : 'DELETE',
            redirect: 'follow',
            headers : myHeaders,
            body : JSON.stringify({keys : keys})
        };

        fetch(`${url}gallery/${data._id}`,requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success) setDeleted(true)
            else console.log(res)
        })
        .catch(err=>console.log('err',err));
    }   
    const handleUpdate = ()=>{

    }

    const handleDeleteModalClose = ()=>{
        setDeleted(false)
        history.push('/gallery');
    }

    return (
        <Container>
            {data? 
                <MyDiv breakPoint={8}>
                    <Container containerSize="myContainer--small">갤러리</Container>
                    <ListGroup variant="secondary">
                        <ListGroup.Item variant="secondary" style={{textAlign:"center"}}>
                            <Row>
                                <Col xs={9} style={{textAlign:'start'}}>
                                    <p>{data.name}</p>
                                </Col>
                                <Col xs={3}>
                                    <Row>
                                        {checkAuth("",handleDelete,handleUpdate)}
                                    </Row>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item style={{fontSize:"10pt"}}>
                            <Row>
                                <Col><p>Views : 10</p></Col>
                                <Col><p>Date:{data.createdAt}</p></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item style={{textAlign:"center"}}>
                            <Carousel>
                                {srcs.map((item,i)=>{
                                    return(
                                        <Carousel.Item key={i}>
                                            <img src={item} alt="Error" width="80%" height="80%"/>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>{data.caption}</p>
                        </ListGroup.Item>
                    </ListGroup> 
                </MyDiv>
            :null}
            <MyModal show={deleted} handleOnClick={handleDeleteModalClose} variant='success'>
                <p>The Post has been deleted successfully. </p>
            </MyModal>
        </Container>
    )

}
const Gallery = () =>{
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [album, setAlbum] = useState([])
    const [{success, fail,loading},dispatch] = useReducer(reducer,initialData)
    const history = useHistory()

    useEffect(()=>{
        let unsubscribe = false;

        const fetchData = ()=>{
            if(unsubscribe) return;

            dispatch({type:"loading", value:true})
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
            
            fetch(url+'gallery',requestOptions)
            .then(res=>res.json())
            .then(res=>{
                // console.log(res)
                if(res.success){
                    // const data = res.data;
                    // for(let i = 0; i<data.length; i++){
                    //     const obj = data[i];
                    //     const imgCollection = obj.imgCollection;
                    //     for(let j = 0; j<imgCollection.length; j++){
                    //         const newObjct = {
                    //             name: obj.name,
                    //             caption: obj.caption,
                    //             src : obj.imgCollection[j]
                    //         }
                    //         setAlbum([...album, newObjct])
                    //     }
                    // }
                    setAlbum(res.data)
                    dispatch({type:'success', value:true})
                }else{
                    dispatch({type:'fail', value:true})

                }
            })
            .catch(e=>dispatch({type:'fail', value:true})
            )
            // .finally(()=>{
            //     dispatch({type:"loading", value:false})
            // })
            
        }
        fetchData()

        return ()=>{
            unsubscribe = true;
        }
    },[])

    const handleCardClick =(item)=>{
        history.push({
            pathname: `/gallery/view/${item._id}`,
            state: { data: item }
        })
    }
    return (
        <Container>
            {/* <Container containerSize="myContainer--medium"> */}
                <MyDiv breakPoint={11}>
                    {loading? <MySpinner/> :
                    <>  
                        <Container containerSize="myContainer--small">갤러리</Container>
                        {user && user.admin &&                 
                            <Button onClick={()=>history.push(`/gallery/post/${user.username}`)}>New Photos</Button>}
                        {success && 
                            <div style={{display:'flex',flexFlow: 'row wrap' }}>
                                {album.map((item,i)=>{
                                    return (
                                        <StyledCard key={i} border="light" onClick={()=>handleCardClick(item)}>
                                            <Card.Img variant="top" src={item.imgCollection.urls[0]} style={{width:"18rem" ,height:"300px"}}/>
                                            <Card.Body>
                                                <Card.Title style={{fontSize:'14pt'}}>
                                                    {item.name}
                                                    {item.imgCollection.length >=2? <RiCheckboxMultipleBlankLine/> : null }
                                                </Card.Title>
                                                <Card.Text style={{fontSize:'10pt'}}>{item.caption}</Card.Text>
                                            </Card.Body>
                                            <Card.Footer style={{fontSize:'8pt'}}>
                                                <Row>
                                                    <Col>
                                                        photo by : 최지예
                                                    </Col>
                                                    <Col>
                                                        date : 8/21/2021
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </StyledCard>
                                    )
                                })}
                            </div>
                        }   
                        {fail && 
                            <Alert variant="danger" style={{textAlign:"center"}}>Sorry, something is wrong..Try it again later</Alert>
                        }
                    </>
                    }
                </MyDiv>
                {showUploadModal && 
                <div>
                    <Button onClick={()=>setShowUploadModal(false)}>Cancel</Button>
                    <GalleryNewPost/>
                </div>}
            {/* </Container> */}
        </Container>
    )
};

export default Gallery;
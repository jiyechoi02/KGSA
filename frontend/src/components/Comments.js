// import { Button } from "bootstrap";s

import { useEffect, useState } from "react"
import { Col, Form, ListGroup, Row,Alert } from "react-bootstrap"
import { RiDeleteBin2Line,RiEditLine} from 'react-icons/ri';
import { getToken, getUser } from "../services/LoginHelper";
import { StyledButton } from "./Styles";
import {BsChatQuote} from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import {url} from '../services/config';

const user = getUser();
const userCompare=(username)=>{
    return !user.username.localeCompare(username);
}

const Comments = ({forumItem, _id})=>{
    const user = getUser();
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState({
        username : user? user.username : "",
        comment : ""
    })

    const [inputKey, setInputKey]= useState("inputKey");
    const [ editing,setEditing] = useState(false);
    const history = useHistory();

    const handleChange=(e)=>{
        setNewComment({
            ...newComment, comment : e.target.value
        })
    }

    const handleOnSubmit =(e)=>{
        e.preventDefault();
        if(!editing){
            addNewComment();
        }else{
            updateCommnet(newComment._id)
        }
        // setInputKey(e.target.value);
    }

    const fetchData = ()=>{
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

        fetch(`${url}${forumItem}/comments/${_id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setComments(result.data)
        })
        .catch(error => console.log('error', error));
    }

    const addNewComment = ()=>{

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(newComment),
            redirect: 'follow'
          };
          
          fetch(`${url}${forumItem}/comments/${_id}`, requestOptions)
            .then(response => response.text())
            .then(res=> setInputKey(res))
            .catch(error => console.log('error', error));
    } 

    const updateCommnet = (cid)=>{
        console.log("?")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body : JSON.stringify(newComment),
            redirect: 'follow'
          };
          
          fetch(`${url}${forumItem}/comments/${_id}/${cid}`, requestOptions)
            .then(response => response.text())
            .then(res=> setInputKey(res))
            .catch(error => console.log('error', error));

        setEditing(false)
    }

    const deleteComment = (cid)=>{
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
          
          fetch(`${url}${forumItem}/comments/${_id}/${cid}`, requestOptions)
            .then(response => response.text())
            .then(res=> setInputKey(res))
            .catch(error => console.log('error', error));
        
        setEditing(false)
    }

    useEffect(()=>{
        fetchData()
    },[inputKey])

    const renderForm = ()=>{
        var value = ""
        let component = null

        if(!getToken()){
            component = (<Alert variant="danger" style={{textAlign:'center'}}>
                            <p>Please Login to make a comment</p>
                            <StyledButton onClick={()=>history.push('/login')}>Go to Login</StyledButton>
                        </Alert>)
        }
        else {
            component = (<Form onSubmit={handleOnSubmit}>
                            <Form.Group>
                                <Form.Label>
                                    {!editing? "New comment" : "Edit comment"}
                                </Form.Label>                   
                                    <Form.Control 
                                        as="textarea"
                                        placeholder="Kindness and politeness are not overrated at all." 
                                        rows={3} 
                                        name="comment" 
                                        onChange={handleChange}
                                        defaultValue={editing? newComment.comment : null}
                                        key={inputKey}
                                    />
                            </Form.Group>
                            <StyledButton type="submit" float="right">Submit</StyledButton>
                        </Form>)
        }
        return component

    }
    return (
        <div>
            <ListGroup>
                {comments.map((item,i)=>{
                        return (
                            <ListGroup.Item key={i} variant="secondary">
                                <Row className="align-items-center">
                                    <Col xs={2}>
                                        <BsChatQuote style={{fontSize:"25pt"}}/>
                                    </Col>
                                    <Col  xs={7}>
                                        <Row style={{fontSize:"10pt"}}>
                                            user: {item.username}
                                        </Row>
                                        <Row  style={{fontSize:"12pt"}}>
                                            {item.comment}
                                        </Row>
                                    </Col>
                                    <Col xs={2} style={{fontSize:"10pt"}}>
                                        <Row>작성시간</Row>
                                        <Row>
                                            {item.updatedAt.split('T')[0]}
                                        </Row>
                                        <Row>
                                            {item.updatedAt.split('T')[1].substring(0,11)}
                                        </Row>
                                    </Col>
                                    <Col xs={1}>
                                        {user && userCompare(item.username)?
                                            <>
                                                <RiDeleteBin2Line onClick={()=>{deleteComment(item._id)}}/>
                                                <RiEditLine onClick={()=>{setEditing(true); setNewComment(item)}}/>
                                            </>
                                        : null}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )
                    })}
                <ListGroup.Item variant="secondary">
                    {renderForm()}
                </ListGroup.Item> 
            </ListGroup>
        </div>
    )
}

export default Comments;

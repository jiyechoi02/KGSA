import React from 'react';
import ReactHtmlParser from 'react-html-parser'
import { ListGroup,Col,Row,Carousel} from 'react-bootstrap';
import {AiOutlineUser,AiOutlineFile} from 'react-icons/ai';
import {RiMoneyDollarBoxLine} from 'react-icons/ri';
import {BiMap} from 'react-icons/bi';
import {checkAuth} from './AuthButtons';
import "bootstrap/dist/css/bootstrap.min.css"

const fileUrl = "https://kgsa-upload-to-s3-bucket.s3.us-west-2.amazonaws.com/"
const ViewPost = ({data,handleDelete,handleUpdate}) =>{
    var updatedAt = "";
    
    if(data)  updatedAt=data.updatedAt.substr(0,10) + " " + data.updatedAt.substr(11,11); 
    
    const renderPreview = ()=>{
        if(data.keys){
            const preview = data.keys.map((item,i)=>{
                return (
                    <Carousel.Item key={i}>
                        <img src={fileUrl+item} width="100%" height="450px"/>
                    </Carousel.Item>
                )
            })
    
            return preview;
        }
        return null;
    }
    return(
    <div>
        <ListGroup style={{minWidth:"100%"}}>    
            <ListGroup.Item variant="secondary">
                <Row className="align-items-center">
                    {/* <Col xs={10}>{data.title + " [" + Object.keys(data.comments).length + "]"} </Col> */}
                    <Col xs={7}><h5>{data.title}</h5></Col> 
                    {checkAuth(data.username,handleDelete,handleUpdate)}
                </Row>
            </ListGroup.Item>
            <ListGroup.Item style={{fontSize:'10pt'}}> 
                <Row className="align-items-center justify-content-between">
                    <Col xs={6}>
                        Updated at {updatedAt}                   
                    </Col>
                    <Col xs={2}>Views: {data.views}</Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item style={{fontSize:'10pt'}}><AiOutlineUser/> User : {data.username}</ListGroup.Item>
            {data.price? <ListGroup.Item style={{fontSize:'10pt'}}><RiMoneyDollarBoxLine/> Price : $ {data.price}</ListGroup.Item> : null}
            {data.address? <ListGroup.Item style={{fontSize:'10pt'}}><BiMap/> Address : {data.address}</ListGroup.Item> : null}
            {data.keys? <Carousel>{renderPreview()}</Carousel> : null}
            <ListGroup.Item style={{fontSize: "12pt"}}>{ReactHtmlParser (data.contents)}</ListGroup.Item>
        </ListGroup>
    </div>
    )
}

export default ViewPost
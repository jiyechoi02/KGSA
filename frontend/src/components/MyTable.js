import React, {useState} from 'react';
import {ListGroup, Col,Row} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import CustomPagination from './CustomPagination';
import '../styles.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {getToken, getUser} from '../services/LoginHelper';
import {GrView} from 'react-icons/gr';
import {BiCommentDetail} from 'react-icons/bi';
import {BsCardList} from 'react-icons/bs';
import {AiOutlineUser,AiFillNotification} from 'react-icons/ai';
import {MdInsertPhoto} from 'react-icons/md';

import styled from 'styled-components';


const StyledListItem = styled(ListGroup.Item)`
    background : ${prop=>prop.pinned? '#6a101021': null};
    padding-left : 40px;
    &:hover{
        background: #cecece;
    }
`

const colStyle = {
    fontSize:"10pt"
}

const divStyle ={
    maxWidth:"100vh"
}

const listStlye ={
    borderRadius:"5px"
}

const MyTable = ({simple, data,url, notices}) => {
    /**
     * Props :
        * simple : if it is true, no pagination needed
        * data : posts 
        * notices : pinned posts
        * url : for API calls to backend
     */
    const token = getToken();
    const user = getUser();
    
    const [ currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;
    const [selectedAll, setSelectedAll] = useState(false);

    const endOfPage = currentPage * postsPerPage;
    const startOfPage = endOfPage - postsPerPage;
    const currentPosts = (data)=>{
        if(simple) return data.slice(0,3);
        return data.slice(startOfPage,endOfPage);
    }

    const history = useHistory();

    const handleClick = (item)=>{ 
        history.push({
            pathname: `/${url}/view/${item._id}`,
            state: { data: item }
        })
    }

    // const handleSelectAll= (e)=>{
    //     setSelectedAll(!selectedAll);
    // }
    
    const parseTime = (time)=>{
        return time.substr(0,5)
    }

    return (
        <>
        <div>
            <ListGroup>
                {!simple&&
                    <StyledListItem variant="secondary">
                        <BsCardList/>
                    </StyledListItem>
                }
                {notices? notices.map((item,i)=>{
                    return(
                        <StyledListItem key={i} onClick={()=>handleClick(item)} pinned="true">
                        <Row>
                            <Col sm={7}>
                                <Row>
                                    <h5><AiFillNotification/> {item.title} {item.keys.length? <MdInsertPhoto/> :null}</h5>
                                </Row>
                                <Row style={colStyle}>
                                    <p>작성시간:{item.createdAt.substr(0,10) + " " + parseTime(item.createdAt.substr(11,12))}</p>
                                </Row>
                            </Col>
                            <Col style={colStyle} sm={5}>
                                <Row className="justify-content-start">
                                    <Col xs={6}><AiOutlineUser/>:{item.username}</Col>
                                    <Col xs={3}><BiCommentDetail/>:{Object.keys(item.comments).length}</Col>
                                    <Col xs={3}><GrView/>:{item.views}</Col>
                                </Row>                               
                            </Col>
                        </Row>
                        </StyledListItem>
                    )
                })
                :null}
                {currentPosts(data).map((item,i)=>{
                    return(
                        <StyledListItem key={i} onClick={()=>handleClick(item)}>
                        <Row>
                            <Col sm={7}>
                                <Row>
                                    <h5>{item.title} {item.keys.length? <MdInsertPhoto/> :null}</h5>
                                </Row>
                                <Row style={colStyle}>
                                    <p>작성시간:{item.createdAt.substr(0,10) + " " + parseTime(item.createdAt.substr(11,12))}</p>
                                </Row>
                            </Col>
                            <Col style={colStyle} sm={5}>
                                <Row className="justify-content-start">
                                    <Col xs={5}><AiOutlineUser/>:{item.username}</Col>
                                    <Col xs={3}><BiCommentDetail/>:{Object.keys(item.comments).length}</Col>
                                    <Col xs={4}><GrView/>:{item.views}</Col>
                                </Row>                               
                            </Col>
                        </Row>
                        </StyledListItem>
                    )
                })}
            </ListGroup>
        </div>
                { simple? (<></>):
                (<CustomPagination postsPerPage={postsPerPage} totalPosts = {data.length} paginate={setCurrentPage}></CustomPagination>)}
        </>        
    )

}

export default MyTable;
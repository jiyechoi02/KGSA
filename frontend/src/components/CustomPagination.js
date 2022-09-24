import React, {useState} from 'react';
import {Pagination, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const pageContainerStyle={
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    margin: "10px"
}
const CustomPagination = ({postsPerPage, totalPosts,paginate}) => {

    const countePagination = Math.ceil(totalPosts/postsPerPage);
    const items = [];
    const [ currentPage, setCurrentPage ] = useState(1);

    const handleClick= (i)=>{
        if(i >= 1 && i <= countePagination) {
            setCurrentPage(i);
            paginate(i);
        }
    }
    for(let i=1; i < countePagination+1; i++){
        items.push(
            <Pagination.Item key={i} active={i==currentPage} activeLabel="" onClick={()=>{ setCurrentPage(i); paginate(i)} }>
                {i}
            </Pagination.Item>
        );
    }

    return (
        <Container style={pageContainerStyle}>
            <Pagination size='sm'>
                <Pagination.Prev onClick={()=>handleClick(currentPage-1)}/>
                {items}
                <Pagination.Next onClick={()=>handleClick(currentPage+1)}/>
            </Pagination>
        </Container>
    )
}

export default CustomPagination;
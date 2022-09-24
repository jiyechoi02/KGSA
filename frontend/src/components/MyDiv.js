import {Row, Col} from 'react-bootstrap';

const MyDiv = (props)=>{
    let breakPoint = props.breakPoint? props.breakPoint : 7
    return(
        <Row className="justify-content-center">
            <Col md={breakPoint} style={{paddingBottom: "20px"}}>
                {props.children}
            </Col>
        </Row>

    )
}

export default MyDiv;
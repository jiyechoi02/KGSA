import {Modal,Alert} from 'react-bootstrap';
import {StyledButton as Button} from './Styles';

const ModalHeaderStyle = {
    background : '#6A1010',
    color : '#fff'
}

const MyModal = (props) =>{
    /**
     * props :
        * variant : to decide alert variant
        * closeButton : if it true, the modal has close button 
        * handleOnClick : handle click close or close button 
        * show : when the modal shows 
     * 
     */

    var variant = props.variant? props.variant : 'primary';
    var onHide = props.handleOnClick? props.handleOnClick : ()=>{}
    var disableClose
    if(props.disableClose== undefined || props.disableClose) disableClose = true
    else disableClose = false

    return (
    <Modal show={props.show} onHide={onHide}>
        <Modal.Header closeButton={disableClose} style={ModalHeaderStyle}>
            KGSA 
        </Modal.Header>
        <Modal.Body style={{textAlign:"center"}}>
            <Alert variant={variant}>
                {/* <p><AiOutlineNotification/></p> */}
                {props.children}
            </Alert>
        </Modal.Body>
        {disableClose?
            <Modal.Footer>
                <Button margin="0px" onClick={props.handleOnClick}>Close</Button>
            </Modal.Footer> : null
        }
    </Modal>
    )
}

export default MyModal;
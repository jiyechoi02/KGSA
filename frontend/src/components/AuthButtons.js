import { Col,Button } from "react-bootstrap";
import {RiEditLine, RiDeleteBin2Line} from 'react-icons/ri';
import {getToken, getUser} from '../services/LoginHelper';
import styled from 'styled-components';

const user = getUser();
const StyledP = styled.p`
    color : black;
    font-size : 13pt;
    margin:0px;
    &:hover{
        color : red;
    }
`

export const checkAuth = (postUsername,handleDelete,handleUpdate)=>{
    var Buttons = null

    if (getToken() && (!user.username.localeCompare(postUsername)) || getToken() && user.admin){
        Buttons = (
            <Col>
                <StyledP onClick={handleDelete} style={{marginLeft:'10px', float:"right"}}><RiDeleteBin2Line/></StyledP>
                <StyledP onClick={handleUpdate} style={{marginRight:'10px',float:"right"}}><RiEditLine/></StyledP>
            </Col>
    )}
    return Buttons;
}
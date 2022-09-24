import styled from "styled-components"
import {Button, ListGroup, Navbar,Nav} from 'react-bootstrap';

var primary = "#6A1010";
var secondary = "#4d4444e1";
var highlight = "#4d444";

export const StyledTitle = styled.div`
    min-height: 25vh;
    background-image: url("./assets/images/korea.jpg");
    background-size: cover;
    box-shadow: inset 0 0 0 2000px rgba(106,16,16,0.4);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #efefef;
    font-size:5vh;

`

export const StyledButton = styled(Button)`
    
    color :  white;
    background-color : ${primary}; 
    border : none;
    margin-top: 10px;
    margin-bottom :10px;
    float : ${prop=>prop.float};

    &:hover{
        background-color : ${secondary};
        color : white;
    }
`;


export const StyledListItem = styled(ListGroup.Item)`
    text-align: center;
    background-color : ${secondary};
    color : white;
    font-size: 12pt;

    &:hover{
        background-color : ${primary};
        color : white;
        border : none;
    }

    &:active{
        background-color : ${secondary};
    }

`;


export const StyledNav = styled(Navbar)`
    background-color : ${primary};
    color : white;
`;

export const StyledNavCollapse = styled(Navbar.Collapse)`
    background-color : ${primary};
    color : white;
`;

export const StyledNavLink = styled(Nav.Link)`
    color : white;
`;


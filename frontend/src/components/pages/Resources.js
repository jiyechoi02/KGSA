import MyDiv from "../MyDiv";
import {CustomContainer as Container} from '../CustomContainer';
import { ListGroup, Tab, Tabs } from "react-bootstrap";
import {RiArrowRightSFill} from 'react-icons/ri';
import styled from 'styled-components';

const StyledListItem = styled(ListGroup.Item)`
    &:hover{
        background-color : #6A1010;
        color : white;
    }
`

export const Resources = ()=>{
    return (
        <Container>
            <MyDiv>
                <Container containerSize="myContainer--small">정보 </Container>
                <div>
                    <h3>주요 사이트 링크 목록</h3>
                    <Tabs>
                        <Tab eventKey="school" title="학교">
                            <ListGroup>
                                <StyledListItem>
                                    <a style={{color:'black'}} href="https://www.umass.edu/"  rel="noreferrer"  target="_blank">UMass 바로 가기 <RiArrowRightSFill/></a>
                                </StyledListItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="job" title="취업/채용">
                            <ListGroup>
                                <StyledListItem>
                                    <a style={{color:'black'}} href="https://hibrain.net/" rel="noreferrer"  target="_blank"> 하이브레인 바로 가기 <RiArrowRightSFill/></a>
                                </StyledListItem>
                            </ListGroup>                    
                        </Tab>
                        <Tab eventKey="living" title="생활">
                            <ListGroup>
                                <StyledListItem>
                                    <a style={{color:'black'}} href="https://www.bostonkorea.com/" rel="noreferrer" target="_blank"> 보스톤코리아 바로 가기 <RiArrowRightSFill/></a>
                                </StyledListItem>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey="etc" title="기타">   
                        </Tab>
                    </Tabs>
                </div>
            </MyDiv>
        </Container>
    )
}
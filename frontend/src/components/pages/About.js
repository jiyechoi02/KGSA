import React from "react";
import { CustomContainer as Container } from '../CustomContainer' ;
import MyDiv from "../MyDiv";
import { useParams } from "react-router-dom";
import umass_logo from "../../assets/images/umass_logo.png"
import kgsa_pic from "../../assets/images/kgsa_photo.jpeg"

export const AboutUmass = ()=>{
    return (
        <div>
            <Container containerSize="myContainer--small">UMass Amherst 소개</Container>
            <div class="aboutUmass" >
                <div style={{textAlign:"center"}}>
                    <img src={umass_logo}/>
                </div>
                <div style={{marginTop:"20px"}}>
                    <p>매사추세츠앰허스트대학교는 미국 매사추세츠주 앰허스트에 있는 공립 종합대학교이다.
                    1863년에 매사추세츠농업대학으로 설립되었고 1931년에 매사추세츠주대학으로, 1947년에 매사추세츠앰허스트대학교로 이름이 바뀌었다. 
                    이 대학에는 9개 단과대학이 있고 109개 학부 과정, 77개 석사 과정, 48개 박사 과정이 있다. 매사추세츠앰허스트대학교는 매우 높은 연구 활동을 하는 'R1 박사대학'에 속해 있다. 
                    동문과 교수 중에는 4명의 노벨상 수상자와 많은 퓰리처상 수상자와 그래미상, 에미상, 아카데미상 수상자가 있다. </p>
                    
                    <p> 출처 [네이버 지식백과] 매사추세츠앰허스트대학교 [University of Massachusetts Amherst] (세계의 대학) </p>
                </div>
                <div>
                    <p> 주요 Links </p>
                    <ul style={{listStyleType: "circle"}}>
                        <li><a href="https://www.umass.edu/">Umass Amherst Website Link</a></li>
                        <li><a href="https://en.wikipedia.org/wiki/University_of_Massachusetts_Amherst">Learn more</a></li>
                    </ul>

                </div>
            </div>
        </div>
        )
}

export const AboutKGSA = ()=>{
    return (
        <div>
            <Container containerSize="myContainer--small">KGSA 소개</Container>
            <div class="aboutUmass" >
            <div style={{textAlign:"center"}}>
                    <img src={kgsa_pic} style={{ height:"50%", width:"100%"}}/>
                </div>
                <div style={{marginTop:"20px"}}>
                    <p> Korean Graduate Student Association (KGSA)는 University of Massachusetts Amherst에 재학 중인 한인 대학원생들로 이루어진 그룹입니다.
                        한인 유학생들이 Amherst에서 잘 적응하고 학업/연구에 집중 할 수 있도록 다양한 정보와 이벤트들을 주최하고 있습니다.
                    </p>
                </div>
                <div>
                    <p> 주요 Links </p>
                    <ul style={{listStyleType: "circle"}}>
                        <li><a href="https://www.facebook.com/groups/123384061073912">Facebook</a></li>
                    </ul>

                </div>
            </div>
        </div>
        )
}

export const HistoryOfKGSA = ()=>{
    return(
            <Container containerSize="myContainer--small">주요 연혁</Container>
        )
}

const aboutList ={
    aboutKGSA : AboutKGSA,
    aboutUMass : AboutUmass,
    aboutHistory : HistoryOfKGSA
}

const About = () => {
    const {menu} = useParams();
    const AboutContent = aboutList[menu]

    return (
    <div>
        <Container>
            <MyDiv>
                <AboutContent/>
            </MyDiv>
        </Container>
    </div>
    )
};

export default About
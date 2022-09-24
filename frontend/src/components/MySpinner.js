import {Spinner,Container} from 'react-bootstrap';

const MySpinner = () =>{
   return (<div style={{textAlign:"center", marginTop:"100px"}}>
        <Spinner animation="border" variant="secondary" />
        <p>Loading...</p>
   </div>)
}

export default MySpinner;
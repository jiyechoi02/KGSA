import {useReducer} from 'react';
import { useHistory } from 'react-router';
import { CustomContainer as Container } from '../CustomContainer';
import MyModal from '../MyModal';
import AccountForm from '../AccountForm';
import { initialData, reducer } from '../../services/AlertHelper';
import {useFetch} from '../../services/UseAPIs';
import {url} from '../../services/config';
import MyDiv from '../MyDiv';

const SignUp =()=>{
    const fetchData = useFetch();
    const [{success, fail, loading}, dispatch] = useReducer(reducer, initialData)
    const user = {
        firstname : "",
        lastname : "",
        username : "",
        password : "",
        email : "",
        phone_number : null,
        major : "",
    };
    const history = useHistory();
    
    const handleCloseMyModal =()=>{
        if(success){
            history.push('/login')
        }
        dispatch({type:'success', value:false})
        dispatch({type:'fail', value:false })
    }
    const createUser = async (user)=>{
        dispatch({type:'loading', value:true})

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method : 'POST',
            headers : myHeaders,
            body : JSON.stringify(user),
            redirect : 'follow'
        };
        
        fetch(url+'signup', requestOptions)
        .then(res=>res.json())
        .then(res=>{
            if(res.success){
                    console.log(res)
                    dispatch({type:"success", value:true})
            }
            else dispatch({type:"fail", value:true})
        })
        .catch(error => dispatch({type:"fail", value:true}))
        .finally(()=>{
            dispatch({type:"loading", value:false})
        })
        
    }

    return (
        <Container>
            <Container containerSize="myContainer--small">Sign Up</Container>
            <MyDiv breakPoint={7}>
            {loading? <div>loading...</div>:
                    <>
                        <MyModal show={success} handleOnClick={handleCloseMyModal} variant='success'>
                            <p>Congrats! Your account has created!</p>
                        </MyModal>
                        <MyModal show={fail} handleOnClick={handleCloseMyModal} variant='danger'>
                            <p>Oops, sorry,Failed to create a new account. Try again..</p>
                        </MyModal>
                    </>
            }                
            <AccountForm form_disable={false} DBuser={user} fetchData={createUser}/>
            </MyDiv>
        </Container>

    )
}

export default SignUp;
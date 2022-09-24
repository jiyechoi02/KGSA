import {Route, Redirect} from 'react-router-dom'
import {getToken, getUser } from '../services/LoginHelper';

const AdmintRoutes = ({component : Component, ...rest}) =>{
    const user = getUser();
    return (
        <Route 
            {...rest}
            render = {props =>
            (
                getToken() && user.admin ? <Component {...props}/> : <Redirect to={{pathname:'/'}}/> 
            )}/>
    )
}

export default AdmintRoutes;
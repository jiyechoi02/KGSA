import {Route, Redirect} from 'react-router-dom';
import { getToken } from '../services/LoginHelper';

const PrivateRoutes = ({component: Component, ...rest}) =>{
    return (
        <Route 
            {...rest}
            render = {props =>(
                getToken()? <Component {...props}/> : <Redirect to={{pathname: '/login'}}/>
            )}/>
    )
}

export default PrivateRoutes;
import { Route,Redirect} from "react-router-dom";

const PublicRoutes = ({component: Component,...rest})=>{

    return(
        <Route
        {...rest}
        render={props =>(
            <Component {...props}/>
        )}/>
    )

}

export default PublicRoutes;
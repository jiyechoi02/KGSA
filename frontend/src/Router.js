import React from 'react';
import { Route, Switch } from "react-router-dom";
import ScrollToTop from './services/ScrollToTop';
import Home from "./components/pages/Home";
import About from "./components/pages/About"
import Events from "./components/pages/Events"
import {Announcements,AnncmntNewPost,AnncmntPostView,AnncmntEditPost} from "./components/pages/Announcements"
import Gallery, { GalleryNewPost, GalleryView } from "./components/pages/Gallery"
import Contact from "./components/pages/Contact"
import Login from './components/pages/Login'
import "bootstrap/dist/css/bootstrap.min.css"
import Signup from './components/pages/SignUp';
import UserDashboard from './components/pages/UserDashboard';
import PrivateRoutes from './Routes/PrivateRoutes';
import PublicRoutes from './Routes/PublicRoutes';
import AdmintRoutes from './Routes/AdminRoutes';
import MyNavbar from './components/MyNavbar';
import { Market, MarketEditPost, MarketNewPost, MarketPostView } from './components/pages/Market';
import { Housing, HousingEditPost, HousingNewPost, HousingPostView } from './components/pages/Housing';
import { Resources } from './components/pages/Resources';
export default function Routes(){


    return (
        <>
            <MyNavbar/>
            <ScrollToTop/>
            <Switch>   
                <PublicRoutes exact path = "/" component={Home}/>
                <PublicRoutes path='/events' component={Events}/>
                <PublicRoutes path="/about/:menu" component={About} />
                <PublicRoutes exact path="/announcements" component={Announcements} />
                <PublicRoutes path="/contact" component={Contact} />
                <PublicRoutes path="/login" component={Login}/>
                <PublicRoutes path="/signup" component={Signup}/>
                <PublicRoutes path="/resources" component={Resources}/>

                {/* <AdmintRoutes exact path="/announcements/edit/:token" component={AnncmntEditPage}/> */}
                <PublicRoutes  path="/announcements/view/:_id" component={AnncmntPostView} />
                <AdmintRoutes  path="/announcements/post/:username" component={AnncmntNewPost}/>
                <AdmintRoutes  path="/announcements/edit/:_id/:username" component={AnncmntEditPost}/>

                <PrivateRoutes exact path="/userdashboard/:menu" component={UserDashboard}/>

                <PublicRoutes exact path="/gallery" component={Gallery}/>
                <PublicRoutes path="/gallery/view/:_id" component={GalleryView}/>
                <PublicRoutes path="/gallery/post/:username" component={GalleryNewPost}/>

                <PublicRoutes exact path ='/market' component={Market}/>
                <PublicRoutes exact path ='/market/view/:_id' component={MarketPostView}/>
                <PrivateRoutes path = '/market/post' component={MarketNewPost}/>  
                <PrivateRoutes path = '/market/edit/:_id' component={MarketEditPost}/>                              

                <PublicRoutes exact path ='/housing' component={Housing}/>
                <PublicRoutes exact path ='/housing/view/:_id' component={HousingPostView}/>   
                <PrivateRoutes path = '/housing/post/' component={HousingNewPost}/>                
                <PrivateRoutes path = '/housing/edit/:_id' component={HousingEditPost}/>                              

            </Switch>
        </>
    )
}

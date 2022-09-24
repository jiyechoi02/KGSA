
export function setSession(token, user){
    
    try{
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('user',JSON.stringify(user));
    }catch{
        console.error();
        return false;
    }
    return true;
}

export function removeSession(){
    try{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user'); 
        window.location.reload();
    }catch{
        console.error();
        return false;
    }
    return true;
}

export function getUser(){
    let user = sessionStorage.getItem('user');
    if(user)
        return JSON.parse(user);
    else
        return null;
}

export function getToken(){
    let token = sessionStorage.getItem('token');
    if(token) return JSON.parse(token);
    else return null;
}

export function checkAdmin(){
    let user = getUser();
    return user.admin;
}
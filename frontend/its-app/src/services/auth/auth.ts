import jwt_decode from "jwt-decode";
import axios from "axios";

export const Logout = () => {
    localStorage.removeItem('user');
}

export const AdminOrNot = ():boolean =>{
    let data = JSON.parse(localStorage.getItem('user') || '{}')
    if(data.user_role_name === "Admin"){
        return true
    }else{
        return false
    }
}

export const fetcher = (url: any) => axios.get(url, {
    headers: {
        Authorization : `${JSON.parse(localStorage.getItem('user') || '{}').token}`
    }
}).then(res => res.data)

export const setToken = (token: any) => {
    let decode = jwt_decode(token.token)
    let data = Object.assign(decode, token)
    // console.log("data_user", data)
    localStorage.setItem("user", JSON.stringify(data));
}

export const checkToken = (): boolean => {
    let data = JSON.parse(localStorage.getItem('user') || '{}')
    console.log("data_user", data)
    const currentTime = Date.now() / 1000;
    if (data && data.exp > currentTime) {
        return true;
    } else {
        Logout()
        return false
    }
}
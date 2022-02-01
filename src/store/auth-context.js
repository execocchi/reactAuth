import React,{useState,useEffect, useCallback}from "react"

let logoutTimer;

const AuthContext=React.createContext({
    token:"",
    password:"",
    userEmail:"",
    isLoggedIn:false,
    changeUserEmail:(userEmail)=>{},
    changePassword:(password)=>{},
    login:(token)=>{},
    logout:()=>{}
});

    const calculateTokenRemainingTime=(expirationTime)=>{
        const currentTime=new Date().getTime();
        const adjExpirationTime=new Date(expirationTime).getTime();
        const remainingDuration=adjExpirationTime-currentTime;
        return remainingDuration
    }

    const retrieveStoreToken=()=>{
        const storedToken=localStorage.getItem("token")
        const storedExpirationDate=localStorage.getItem("expirationTime")
        const remainingTime=calculateTokenRemainingTime(storedExpirationDate)

        if(remainingTime<=6000){
            localStorage.removeItem("token")
            localStorage.removeItem("expirationTime")
            return null
        }

        return {
            token:storedToken,
            duration:remainingTime
        }
    }

 export const AuthContextProvider=(props)=>{
    const tokenData=retrieveStoreToken()
    let initialToken;
    if(tokenData){
        initialToken=tokenData.token
    }
    
    const[token,setToken]=useState(initialToken)
    const[password,setPassword]=useState(null)
    const[userEmail,setUserEmail]=useState("") 

    const userIsLoggedIn=!!token;

    const changePasswordHandler=(password)=>{
        setPassword(password)
        localStorage.setItem("password",JSON.stringify(password))
    }

    const changeUserEmailHandler=(userEmail)=>{
        setUserEmail(userEmail)
        localStorage.setItem("userEmail",JSON.stringify(userEmail))
    }

    const logoutHandler=useCallback(()=>{
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime")
        if(logoutTimer){
        clearTimeout(logoutTimer)
        }
    },[]);

    const loginHandler=(token,expirationTime)=>{
        setToken(token)
        localStorage.setItem("token",token);
        localStorage.setItem("expirationTime",expirationTime);
        const remainingTime=calculateTokenRemainingTime(expirationTime)
        logoutTimer=setTimeout(logoutHandler,remainingTime)
    };

    useEffect(() => {
       if(tokenData){
        console.log(tokenData.duration)
        logoutTimer=setTimeout(logoutHandler,tokenData.duration)
       }
    }, [tokenData,logoutHandler]);

    const contextValue={
        token,
        password,
        userEmail,
        isLoggedIn:userIsLoggedIn,
        changeUserEmail:changeUserEmailHandler,
        changePassword:changePasswordHandler,
        login:loginHandler,
        logout:logoutHandler
    };


    return<AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext
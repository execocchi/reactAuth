/* eslint-disable react-hooks/exhaustive-deps */
import {useHistory } from 'react-router-dom';
import{useEffect} from "react"
import classes from "./Error.module.css"
import errorImg from "../../imgs/errorSvg.png"

const Error = () => {
    const history=useHistory()

    useEffect(() => {
        const timer=setTimeout(()=>{
            history.replace("/")
        },2500)
        return () => {
            console.log("cleanUp")
          clearTimeout(timer)
        };
    }, []);
 
    
    return( 
    <div>
        <h2 className={classes.error}>
        Ups!Something went wrong,error 404,Page not found
        </h2>
        <div className={classes.error}>
        <img src={errorImg} alt="error"/>
        </div>       
    </div>);
};

export default Error;

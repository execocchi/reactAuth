/* eslint-disable no-useless-escape */
import classes from './ProfileForm.module.css';
import React,{useState,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../store/auth-context';
import swal from 'sweetalert';

const ProfileForm = () => {
  const history=useHistory()
  const[newPassword,setNewPassword]=useState("")
  const[isLoading,setIsLoading]=useState(false)
  const[isError,setIsError]=useState(false)
  const authCtx=useContext(AuthContext);

  const oldPassword=JSON.parse(localStorage.getItem("password"))
  const userEmail=JSON.parse(localStorage.getItem("userEmail"))
  const rePassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  const passwordIsValid=rePassword.test(newPassword)
 
  const passwordChangeHandler=(e)=>{
    setNewPassword(e.target.value)
  }
  
  const submitHandler=(e)=>{
    e.preventDefault();


    if(!passwordIsValid){
      setIsError(true)
      setNewPassword("")
      return
    }
    
    if(oldPassword===newPassword){
      setIsError(true)
      setNewPassword("")
      return
    }

    setIsLoading(true)
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAUvHTPzalnXkVNnSqspCi5ykkO-oJx46U",{
      idToken:authCtx.token,
      password:newPassword,
      returnSecureToken:false
    })
    .then(res=>{
      setIsLoading(false)
      swal({
        title:"Caution",
        text:"Are you sure , you want to change your password?",
        icon:"warning",
        buttons:true,
        dangerMode:true,
      }).then(res=>{
        if(res){
          swal({
            title:`password changed successfully to ${newPassword}`,
            icon:"success",
            time:"1500",
          })
          history.replace("/")
          authCtx.changePassword(newPassword)
        }
      })
    })
    .catch(err=>{
      setIsLoading(false)
      swal({
        title:err.message,
        icon:"error",
      })
    })
   
    setNewPassword("")
  }
  
  
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <h2>{userEmail}</h2>
        <label>Your password</label>
        <p>{oldPassword}</p>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password'  value={newPassword}onChange={passwordChangeHandler}
        ></input>
         {isError && <p className={classes.error}>Password must  be different from the older one ,contain 8 characters at least  , one capital letter,one special character ,and a number </p>}
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
        {isLoading&& <p className={classes.isLoading}>Sending request....</p>}
      </div>
    </form>
  );
}

export default ProfileForm;

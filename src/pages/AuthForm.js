/* eslint-disable no-useless-escape */
import React,{useState,useEffect,useContext } from 'react';
import { useHistory } from "react-router-dom"
import swal from 'sweetalert';
import axios from "axios"
import classes from './AuthForm.module.css';
import AuthContext from '../store/auth-context';
/* import{userSchema} from "../Validations/UserValidation" */


const AuthForm = () => {
  const history=useHistory()
  const authCtx=useContext(AuthContext)
  const[roles,setRoles]=useState(null)
  const[showRoles,setShowRoles]=useState(false)
  const[enteredName,setEnteredName]=useState("")
  const[enteredEmail,setEnteredEmail]=useState("")
  const[enteredAge,setEnteredAge]=useState("")
  const[enteredPassword,setEnteredPassword]=useState("")
  const[enteredConfirmPassword,setEnteredConfirmPassword]=useState("")
  const[inputNameIsTouched,setInputNameIsTouched]=useState(false)
  const[inputEmailIsTouched,setInputEmailIsTouched]=useState(false)
  const[inputPasswordIsTouched,setInputPasswordIsTouched]=useState(false)
  const[inputConfirmPasswordIsTouched,setInputConfirmPasswordIsTouched]=useState(false)
  const[isLoading,setIsLoading]=useState(false)
  const[isLogin, setIsLogin] = useState(true);
 
  
  
  /*name validation helpers*/
  const fullName=enteredName.split(" ")
  const [name,surName]=fullName
  const enteredNameIsInValid=(!name ||!surName)||(name.length<3||surName.length<3);
  const inputNameIsInvalid=(!enteredName ||enteredNameIsInValid) && inputNameIsTouched;
  /*email validation helpers*/
  const reEmail=/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
  const validEmail=reEmail.test(enteredEmail)
  const inputEmailIsInvalid=!validEmail && inputEmailIsTouched
  /* age validation helper*/
  let validAge=Number(enteredAge>0)|| Number(enteredAge!=="")
  /*password validation helpers*/
  const rePassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  const passwordIsValid=rePassword.test(enteredPassword)
  const inputPasswordIsInvalid=!passwordIsValid && inputPasswordIsTouched
  /*confirmPassword validation helpers*/
  const confirmPasswordIsValid=enteredPassword===enteredConfirmPassword
  const inputConfirmPasswordIsInvalid=!confirmPasswordIsValid && inputConfirmPasswordIsTouched
  
  /*get role request*/
  const getRole=async()=>{
    const roleRequest= await axios.get("http://ongapi.alkemy.org/api/roles")
    const data= await roleRequest.data.data
    const rolesMap=(data.map(role=><option key={Math.random()}>{role.name}</option>))
    setRoles(rolesMap)
  }
    
  useEffect(() => {
    getRole();
  }, []);

  /*function handlers*/
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    
  };

  const roleChangeHandler=(e)=>{
    setShowRoles(e.target.value)

  }
    
  const nameInputChangeHanlder=(e)=>{
    setEnteredName(e.target.value)
  }

  const nameInputBlurHanlder=()=>{
    setInputNameIsTouched(true)
  
  }
  const emailInputHandler=(e)=>{
    setEnteredEmail(e.target.value)
  }
  const emailBlurHandler=()=>{
    setInputEmailIsTouched(true)

  }
  const ageInputHandler=(e)=>{
    setEnteredAge(e.target.value)
   
  }
  const passwordInputHandler=(e)=>{
    setEnteredPassword(e.target.value)
  }
  const passwordBlurHandler=()=>{
    setInputPasswordIsTouched(true)
  }
  const confirmPasswordInputHandler=(e)=>{
    setEnteredConfirmPassword(e.target.value)
  }
  const confirmPasswordBlurHandler=()=>{
    setInputConfirmPasswordIsTouched(true)
  }
  
  
  /*submit form*/
  
  const submitHandler=(e)=>{
    e.preventDefault();
    setInputNameIsTouched(true)
    setInputEmailIsTouched(true)
    setInputPasswordIsTouched(true)    
    setInputConfirmPasswordIsTouched(true)

    /*inputs validation*/
    if(enteredNameIsInValid&&!isLogin){
       console.log("no existe")
      return
    } 
    
    if(!validEmail){
      return
    }
    
        
    if (!passwordIsValid){
      return
    }   
    
    if(!confirmPasswordIsValid&&!isLogin){
      return
    }   
     
    if(!showRoles&&!isLogin){
      return
    }

      /*send data helpers*/
      let description
      if(showRoles==="Standard"){
        description="Standard User"
        console.log(description)
      }
      if(showRoles==="Administrador"){
        description="Admin"
        console.log(description)
      }
      let sentAge
      if(!validAge){
       sentAge=-1
      }


      /*request API*/
      setIsLoading(true)
      if(!isLogin){
        axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAUvHTPzalnXkVNnSqspCi5ykkO-oJx46U",{
        name:`${name}_${surName}*${sentAge}*${description}`,
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true
      }).then(res=>{
        swal({
          title:"User created successfully",
          text:"Status Code:201",
          icon:"success",
          timer:"1500",
          buttons:false
        })
       setTimeout(()=>{history.replace("/")},1500)
      })
      .catch(err=>{
        setIsLoading(false)
        const errorMessage="Something went wrong, authentication failed"
        swal({
          title:errorMessage,
          text:"Status Code:400",
          icon:"error",
        })
      })
      }else{
      axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUvHTPzalnXkVNnSqspCi5ykkO-oJx46U",{
        email:enteredEmail,
        password:enteredPassword,
        returnSecureToken:true
      }).then(res=>{
        setIsLoading(false)
        console.log(res.data)
        history.replace("/")
        const expirationTime= new Date(new Date().getTime()+(+res.data.expiresIn*1000));
        authCtx.login(res.data.idToken,expirationTime.toString())
        swal({
          text:`Welcome ${enteredEmail}`,
          timer:"1500",
          buttons:false
        })
        
      }).catch(err=>{
        setIsLoading(false)
        const errorMessage="Something went wrong, authentication failed"
        swal({
          title:errorMessage,
          text:"Status Code:400",
          icon:"error",
          
        })
      })
    } 
      authCtx.changeUserEmail(enteredEmail);
      authCtx.changePassword(enteredPassword);
      

      /*alkemy api post request*/
      /* axios.post("http://ongapi.alkemy.org/api/register",{
        name:`${enteredName.split("_")}*${enteredAge}*${showRoles}*${description}`,
        email:enteredEmail,
        password:enteredPassword,
      })
      .then(res=>console.log(res))
      .catch(err=>{
        console.log(err)
        
      }) */
   
      
      setEnteredName("")
      setEnteredEmail("")
      setEnteredAge("")
      setEnteredPassword("")
      setEnteredConfirmPassword("")
      setInputConfirmPasswordIsTouched(false)
      setInputPasswordIsTouched(false)
      setInputEmailIsTouched(false)
      setInputNameIsTouched(false)
    
  }
  /*Yup Validation*/
  /* const createUserYupHandler=async(e)=>{
    e.preventDefault()
    let userData={
      name:e.target[0].value,
      email:e.target[1].value,
      age:e.target[2].value,
      password:e.target[3].value,
      confirmPassword:e.target[4].value,
      role:e.target[5].value
    }
    console.log(userData)
    const isValid=await userSchema.isValid(userData)
    console.log(isValid)
  }
 */

  /*form validation*/
  let formIsValid=false
  
    if(validEmail&&passwordIsValid&&confirmPasswordIsValid&&(enteredName||!enteredNameIsInValid)&&showRoles){
    formIsValid=true
    }
    if(isLogin){
      formIsValid=true
    }

 
  
  return (
    <section className={classes.auth}>
      <h1> {isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler} /* onSubmit={createUserYupHandler} */>
        {!isLogin&& <div className={classes.control} >
          <label htmlFor='name'>Your Name </label>
          <input type='text' id='name'value={enteredName} onChange={nameInputChangeHanlder} onBlur={nameInputBlurHanlder}  />
            {inputNameIsInvalid&&<p className={classes.description}> Each Name and Last name must have at least 2 characters,  and contain a space between them</p>}
        </div>}
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email'  value={enteredEmail}onChange={emailInputHandler} onBlur={emailBlurHandler} />
          {inputEmailIsInvalid&& <p className={classes.description}>Enter a valid email,email must contain  "@" symbol</p>}
        </div>
        {!isLogin&& <div className={classes.control}>
          <label htmlFor='age'>Your Age</label>
          <input type='number' id='age' value={enteredAge} onChange={ageInputHandler} />
        </div>}
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' value={enteredPassword}  onChange={passwordInputHandler}  onBlur={passwordBlurHandler}/>
          {inputPasswordIsInvalid && <p className={classes.description}>Password must be  8 characters at least  , contain one capital letter,one special character,and a number </p>}
        </div>
        {!isLogin&& <div className={classes.control}>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input type='password' id='confirmPassword' value={enteredConfirmPassword} onChange={confirmPasswordInputHandler} onBlur={confirmPasswordBlurHandler} />
         {inputConfirmPasswordIsInvalid&& <p className={classes.description}>Passwords must match</p>} 
        </div>}
        {!isLogin&&<div className={`${classes.control} ${classes.role}`}>
          <label >Your Role</label>
          <select value={showRoles} onChange={roleChangeHandler} >
            <option ></option>
           {roles}
          </select>
        </div>}
        <div className={classes.actions}>
          {!isLoading&&<button disabled={!formIsValid}>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading&& <p className={classes.loading}>Sending request....</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;

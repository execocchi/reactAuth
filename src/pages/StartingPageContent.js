import classes from './StartingPageContent.module.css';
import {Link} from 'react-router-dom';
import React,{useContext} from "react"
import AuthContext from '../store/auth-context';
import avatarImg from "../../src/imgs/avatar.jpg"

const StartingPageContent = (props) => {
  const authCtx=useContext(AuthContext)
  

  const isLoggedIn=authCtx.isLoggedIn
  const userEmail=JSON.parse(localStorage.getItem("userEmail"))

  return (
    <section className={classes.starting}>
      {!isLoggedIn&&
      <React.Fragment>
       <h1>Welcome to Alkemy</h1>
      <Link to="/auth" className={classes.link}>Login</Link>
      </React.Fragment>}
      {isLoggedIn&& 
      <React.Fragment>
      <h1>Welcome to Alkemy {userEmail}</h1>
      <div>
        <img src={avatarImg} alt="profile img"/>
      </div>
      </React.Fragment>}
    </section>
  );
};

export default StartingPageContent;

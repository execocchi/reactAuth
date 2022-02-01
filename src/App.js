import { Switch, Route } from 'react-router-dom';
import React,{useContext} from "react"
import Layout from './components/Layout/Layout';
import Error from "./components/Error/Error"
import AuthForm from "./pages/AuthForm"
import StartingPageContent from './pages/StartingPageContent';
import UserProfile from './pages/UserProfile';
import AuthContext from './store/auth-context';


function App() {
 const authCtx=useContext(AuthContext)
 
  
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <StartingPageContent />
        </Route>
        {!authCtx.isLoggedIn&& 
        <Route  path='/auth' exact>
          <AuthForm   />
        </Route>}  
        {authCtx.isLoggedIn&&
        <Route  path='/profile' exact>
          <UserProfile  />
        </Route> } 
        <Route path="*">
          <Error/>
        </Route>
      </Switch>   
    </Layout>
  );
}

export default App;

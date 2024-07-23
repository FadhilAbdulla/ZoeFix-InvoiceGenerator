import React, { useEffect,useState,createContext } from 'react';
import {Navigate, Route, Routes, useLocation } from 'react-router-dom';

import SignIn from './SignIn';
import ForgetPassword from './ForgetPassword';
import SignUp from './SignUp';
import DefaultLayout from './Sidebar/DefaultLayout';
import Verification from './Verification';
import Error404 from '../MainPage/ErrorPage/Error404';
import Error401 from '../MainPage/ErrorPage/Error401';
import Configuring from './Configuring';

export const ApplicationAttributes = createContext();

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {return <Navigate to={'/signIn'} />}
  }, []);
  const [B2BName, setB2BName] = useState();
  const [B2BCode, setB2BCode] = useState();
  const [OutletName, setOutletName] = useState();
  const [OutletCode, setOutletCode] = useState();
  const [AgentCode, setAgentCode] = useState();
  const [RoundOff, setRoundOff] = useState();
  const [B2BCountry, setB2BCountry] = useState("In");
  const [B2BCurrency, setB2BCurrency] = useState("INR");
  const [B2BCurrencyCode, setB2BCurrencyCode] = useState("₹");
  const [B2BUser, setB2BUser] = useState(false);
  const [HeaderLoading, setHeaderLoading] = useState(false);

  if (location.pathname === '/') {return <Navigate to={'/signIn'} />}
  console.log(location.pathname)
  //B2BCode ? <DefaultLayout/> : <Navigate to="/settingUp"/> 
  return (
    <ApplicationAttributes.Provider value={{
      B2BName,B2BCountry,B2BCurrency, B2BCode, OutletCode, RoundOff, B2BCurrencyCode,AgentCode,B2BUser,OutletName,HeaderLoading, 
      setB2BCurrencyCode,setRoundOff,setOutletCode,setB2BCode,setB2BName,setB2BCountry,setB2BCurrency,setAgentCode,setB2BUser,setOutletName,setHeaderLoading
      }}>
      <Routes>
          {/* <Route exact path="/" element={<Navigate to={'/signIn'} />} /> */}
          <Route path="/signIn" element={<SignIn/>} />
          <Route path="/forgetPassword" element={<ForgetPassword/>} />
          <Route path="/verification" element={<Verification/>} />
          <Route path="/signUp" element={<SignUp/>} />
          <Route path="/zoefix/*" element={<DefaultLayout/>  } />
          <Route path="/settingUp" element={<Configuring/>} />
          <Route path="/error401" element={<Error401/>} />
          <Route path="*" element={<Error404/>} />
      </Routes>
    </ApplicationAttributes.Provider>
  );
};

export default App;

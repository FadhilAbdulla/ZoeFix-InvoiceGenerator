import React,{useEffect} from 'react'
import { Link } from 'react-router-dom';
import { ApplicationLogout } from '../Functions/CommonFunctions';


const Error401 = () => {
  useEffect(()=>{
    document.body.classList.add("error-page");
  })
  const removeClass =()=>{
    ApplicationLogout()
    document.body.classList.remove("error-page");
  }
  return (
    <>
      <div className="main-wrapper">
        <div className="error-box">
          <h1>401</h1>
          <h3 className="h2 mb-3">
            <i className="fas fa-exclamation-circle" /> Oops! No Assigned Outlet Found!
          </h3>
          <p className="h4 font-weight-normal">
            Sorry, You are not Authorized to any outlet.
          </p>
          <Link to="/signIn" className="btn btn-primary" onClick={removeClass}>
            SignIn With Another Account
          </Link>
        </div>
      </div>


    </>
  )
}

export default Error401;
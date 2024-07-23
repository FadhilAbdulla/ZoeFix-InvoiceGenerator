import React, { useState,useContext } from "react";
import {LoginImage,Logo,GoogleIcon} from "../EntryFile/imagePath";
import { Helmet } from "react-helmet";
import { Link ,useNavigate} from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { ConstructorEventGetNoParams,PublicApiFormSubmitEvent } from "../Event/ConstructorEvent";
import { AddNewBuisenessAccount } from "../api/Aws-api";
import { CircleSpinner,ClassicSpinner} from "react-spinners-kit";
import { successMessage,errorMessage } from "../MainPage/Functions/CommonFunctions";
import { ApplicationAttributes } from './App'


const SignUp = (props) => {
  const [addmore, setAddmore] = useState(false);
  const [usedGoogle,setUsedGoogle] = useState(false)
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const navigate = useNavigate()

  const {setB2BName} = useContext(ApplicationAttributes)

  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    const params = { 
      "b2b_email" : email.toLowerCase(),
      "b2b_mobile" : mobile,
      "b2b_alias_name" : name,
      "verified" : usedGoogle,
      "b2b_address" : {
          "StreetAddress" : streetAddress,
          "City":city,
          "State" : state,
          "Country" : country,
          "PinCode" : pincode
      }
    }
    const responsedata = await PublicApiFormSubmitEvent(AddNewBuisenessAccount,params)
    console.log(params)
    if (responsedata === "mobile-exist"){errorMessage("The Mobile Number Provided is already linked with another account");setLoading(false);navigate("/signIn")}
    else if (responsedata === "email-exist"){errorMessage("The Email Id Provided is already linked with another account");setLoading(false);navigate("/signIn")}
    else if (responsedata[0] === "user_registered"){localStorage.setItem('UserKey', JSON.stringify({"b2b_code" : responsedata[1]}));setLoading(false);navigate("/verification");successMessage("Succesfully creted new account")}
    else if (responsedata[0] === "email-verification-pending"){errorMessage("please verify your credentials");localStorage.setItem('UserKey', JSON.stringify(responsedata[1]));navigate('/verification')}
    else if (responsedata[0] === "user_registered_verified") {
      localStorage.setItem('UserData', JSON.stringify(responsedata[3]))
      navigate("/settingUp");localStorage.setItem('authToken',responsedata[1]);localStorage.setItem('lastLoginTime', Date.now())
      setLoading(false);localStorage.setItem('UserKey', JSON.stringify({agent_code : responsedata[2]}));successMessage("Succesfully creted new account");setB2BName(name)
    }
    else {errorMessage("Something Gone Wrong");setLoading(false)}
    //navigate('/verification');
  };

  const fetchdatafromgoogle = async(user) => {
    const responsedata = await ConstructorEventGetNoParams(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
    headers: {Authorization: `Bearer ${user.access_token}`,Accept: 'application/json'}})
    console.log(responsedata)
    setUsedGoogle(true)
    setName(responsedata.name)
    setEmail(responsedata.email)
  };

  const google_login = useGoogleLogin({
    onSuccess: codeResponse => {console.log(codeResponse);fetchdatafromgoogle(codeResponse)},
    onError: (error) => console.log('Login Failed:', error)
  });
  const noemailorphoneprovided = (e) => {
    e.preventDefault();
    errorMessage("please provide email or phone number")
  }

  return (
    <>
      <div className="main-wrapper">
        <Helmet>
          <title>Spice County - SignUp</title>
          <meta name="description" content="SignUp page" />
        </Helmet>
        <div className="account-content">
          <div className="login-wrapper">
            <div className="login-content">
              <div className="login-userset">
                
                  
                  { loading ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClassicSpinner size={30} color ="black" loading={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}/>
                  </div>
                  :
                  <div>
                    <div className="login-logo">
                    <img src={Logo} alt="img" />
                  </div>
                  <div className="login-userheading">
                    <h3>Start Your Business</h3>
                    <h4>Empower your business by sharing your owner details</h4>
                  </div>
                  <form onSubmit={email ? onSubmit : mobile ? onSubmit : noemailorphoneprovided }>
                  <div className="form-login">
                    <label>Full Name / Organization Name </label>
                    <div className="form-addons">
                      
                        <input
                          type="text"
                          maxLength="30"
                          value={name}
                          onChange={(e) => setName(e.target.value) }
                          placeholder="Enter your full name"
                          required
                        />
                        <div className="iconify-position-signup">
                        <iconify-icon icon="ph:user" style={{  color: 'grey' }} ></iconify-icon>
                        </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <label>Email </label>
                    <div className="form-addons">
                      <input
                        type="email"
                        disabled={usedGoogle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value) }
                        placeholder="Enter your email address"
                      />
                      <div className="iconify-position-signup">
                      <iconify-icon icon="tabler:mail" style={{  color: 'grey' }} ></iconify-icon>
                      </div>
                    </div>
                  </div>
                  <div className="form-login">
                    <label>Mobile </label>
                    <div className="pass-group">
                      <input
                        onChange={(e) => setMobile(e.target.value) }
                        type="text"
                        value={mobile}
                        placeholder="Enter your Mobile Number "
                        pattern="[0-9]{10}"
                        // className="pass-input"
                      />
                      <div className="iconify-position-signup">
                      <iconify-icon icon="ph:device-mobile-thin" style={{  color: 'grey' }} ></iconify-icon>
                      </div>
                    </div>
                  </div>
                  {addmore ? 
                  <div className="form-login row">
                    <label className="">
                      Address
                    </label>
                    <div className="form-addons">
                      <input 
                      maxLength="40"
                      type="text" 
                      className="form-control m-b-20"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value) }
                       />
                      
                      <div className="row mt-4">
                        <div className="col-md-6">
                        <label className="">City</label>
                          <div className="form-addons form-login">
                            <input
                              type="text"
                              placeholder="City"
                              maxLength="19"
                              value={city}
                              onChange={(e) => setCity(e.target.value) } 
                            />
                            <div className="iconify-position-signup">
                            <iconify-icon icon="mdi:office-building-location-outline" style={{  color: 'grey' }} ></iconify-icon>
                            </div>
                          </div>
                          <label className="">Country</label>
                          <div className="form-addons form-login">
                            <input
                              type="text"
                              placeholder="Country"
                              maxLength="19"
                              value={country}
                              onChange={(e) => setCountry(e.target.value) } 
                            />
                            <div className="iconify-position-signup">
                            <iconify-icon icon="gis:search-country" style={{  color: 'grey' }} ></iconify-icon>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="">State/Province</label>
                          <div className="form-addons form-login">
                            <input
                              type="text"
                              placeholder="State/Province"
                              maxLength="19"
                              value={state}
                              onChange={(e) => setState(e.target.value) } 
                            />
                            <div className="iconify-position-signup">
                            <iconify-icon icon="fa6-solid:city" style={{  color: 'grey' }} ></iconify-icon>
                            </div>
                          </div>
                          <label className="">ZIP code</label>
                          <div className="form-addons">
                            <input
                              type="text"
                              placeholder="ZIP code"
                              maxLength="19"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value) } 
                            />
                            <div className="iconify-position-signup">
                            <iconify-icon icon="ic:baseline-location-on" style={{  color: 'grey' }} ></iconify-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : <div className="signinform-changed">
                    <h4>
                      <span  className="hover-a" onClick={()=>setAddmore(true)}>
                        Add More ...
                      </span>
                    </h4>
                  </div> }
                  <div className="form-login">
                    <button type="submit" className="btn btn-login">
                      Submit
                    </button>
                  </div>
                  {addmore ? "" :
                  "" }
                  <div className="form-setlogin">
                    <h4>Or sign up with</h4>
                  </div>
                  <div className="form-sociallink-googlelogin" onClick={() => google_login()}>
                          <img src={GoogleIcon} className="me-2" alt="google" />
                          Sign Up using Google
                  </div>

                </form>
                <div className="signinform text-center mt-4">
                    <h4>
                      Already a user?{" "}
                      <Link to="/signIn" className="hover-a ">
                        Sign In
                      </Link>
                    </h4>
                </div>
                </div>}
              </div>
            </div>
            <div className="login-img">
              <img src={LoginImage} alt="img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;

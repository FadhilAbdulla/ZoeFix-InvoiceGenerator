import React,{useState,useContext} from 'react';
import { LoginImage, Logo, MailIcon, GoogleIcon, FacebookIcon } from '../EntryFile/imagePath'
import { Link,useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import { useGoogleLogin } from '@react-oauth/google';
import { SphereSpinner ,ClassicSpinner  } from 'react-spinners-kit';
import { ConstructorEventGetNoParams,PublicApiFormSubmitEvent } from '../Event/ConstructorEvent';
import { handleSignIn } from '../api/Aws-api';
import { successMessage,errorMessage } from "../MainPage/Functions/CommonFunctions";
import { ApplicationAttributes } from './App'


const SignInPage = (props) => {

    const[eye,seteye]=useState(false);
    const[loading,setLoading] = useState(false);
    const[sentotp,setSentOtp] = useState(false);
    const [usedGoogle,setUsedGoogle] = useState(false)
    const[otp,setOtp] = useState('')
    const[email,setEmail] = useState('')
    const {setB2BName,setAgentCode} = useContext(ApplicationAttributes)
    const navigate = useNavigate()

    const ChangeEye = () =>{
        seteye(!eye)
    }
    const FetchData = async (params) => {
        // setLoading(true)
        // console.log(params)
        // const responsedata = await PublicApiFormSubmitEvent(handleSignIn,params)
        // if (responsedata === "user-verified"){setSentOtp(true);successMessage("otp sent succesfully")}
        // else if (responsedata[0] === "otp-verified"){
        //     localStorage.setItem('UserData', JSON.stringify(responsedata[3]))
        //     localStorage.setItem('authToken',  responsedata[2]);localStorage.setItem('lastLoginTime', Date.now());navigate("/zoefix/dashboard")
        //     localStorage.setItem('UserKey', JSON.stringify(responsedata[1]));successMessage("otp verified succesfully");setB2BName("sample") }
        // else if (responsedata[0] === "googleId-verified"){
        //     localStorage.setItem('UserData', JSON.stringify(responsedata[3]))
        //     localStorage.setItem('authToken',  responsedata[2]);localStorage.setItem('lastLoginTime', Date.now());navigate("/settingUp")
        //     localStorage.setItem('UserKey', JSON.stringify(responsedata[1]));successMessage("account verified succesfully");setB2BName("sample")}
        // else {navigate("/settingUp");navigate("/zoefix/dashboard")}
        navigate("/zoefix/dashboard")
        setLoading(false)
        setUsedGoogle(false)
    }

    const OnCall = () => {
        const params = {"emailOrPhone" : email.toLowerCase()}
        if (otp !== ''){params["user_otp"] = otp}
        FetchData(params)
    }

    const  fetchdatafromgoogleapis =  async(user) =>{
        setUsedGoogle(true)
        const responsedata = await ConstructorEventGetNoParams(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {Authorization: `Bearer ${user.access_token}`,Accept: 'application/json'}})
        FetchData({emailOrPhone : responsedata.email.toLowerCase(),googleId :responsedata.id})
        }
    
    const google_login = useGoogleLogin({
        onSuccess: (codeResponse) => fetchdatafromgoogleapis(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <>
            <div className="main-wrapper">
                <Helmet>
                    <title>ZoeFix - SignIn</title>
                    <meta name="description" content="SignIn page" />
                </Helmet>
                <div className="account-content">
                    <div className="login-wrapper">
                        <div className="login-content">
                            <div className="login-userset">
                            { usedGoogle ?
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ClassicSpinner size={30} color ="black" loading={usedGoogle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}/>
                                </div>
                            :
                            <div>
                                    {/* <div className="login-logo">
                                        <img src={Logo} alt="img" />
                                    </div> */}
                                    <div className="login-userheading">
                                        <h3>Sign In </h3>
                                        <h4>{sentotp ?"An activation code has been dispatched" : "Please login to your account"}</h4>
                                    </div>
                                    {sentotp ? 
                                        <div className="form-login">
                                            <label>OTP</label>
                                            <div className="form-addons">
                                                <input
                                                    type={eye ? "text" : "password" }
                                                    maxLength="6"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value) }
                                                    placeholder="Enter your otp"
                                                    required
                                                />
                                            <div className="iconify-position-signup">
                                            <iconify-icon icon={eye ? "ic:round-remove-red-eye" : "mdi:eye-off"} style={{  color: 'grey' }} onClick={ChangeEye}></iconify-icon>
                                            </div>
                                            </div>
                                        </div>
                                    :<div className="form-login">
                                        <label>Email / Mobile</label>
                                        <div className="form-addons">
                                            <input
                                                type="text"
                                                maxLength="30"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value) }
                                                placeholder="Enter your email address or mobile number"
                                                required
                                            />
                                        </div>
                                    </div>}
                                    {sentotp ? <div className="form-login">
                                        <div className="alreadyuser">
                                            <h4>
                                                <span className="hover-a" onClick={OnCall}>
                                                resend Otp?
                                                </span>
                                            </h4>
                                        </div>
                                    </div>:""}
                                    <div className="form-login">
                                        <button className="btn btn-login" style={{ display: 'flex', alignItems: 'center',justifyContent: 'center' }} disabled={loading} onClick={email && OnCall}>
                                        {loading ? <SphereSpinner  size={15} color="black" loading={loading}/> : sentotp ? "Submit" : "Get OTP" }
                                        </button>
                                    </div>
                                <div className="form-setlogin pt-4" >
                                    <h4>Or sign In with</h4>
                                </div>
                                <div className="form-sociallink-googlelogin" onClick={() => google_login()}>
                                    <img 
                                        src={GoogleIcon}
                                        className="me-2"
                                        alt="google"
                                    />
                                    <span style={{ lineHeight: '100%' }}>Sign In with Google</span>
                                </div>
                                <div className="signinform text-center mt-4">
                                    <h4>
                                        <Link to="/signUp" className="hover-a ">
                                        Click Here to Create a Business Account!
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
    )
}

export default SignInPage;
import React,{useState} from 'react'
import { LoginImage, Logo, MailIcon, } from '../EntryFile/imagePath'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { EmailVerification } from '../api/Aws-api'
import { PublicApiFormSubmitEvent } from '../Event/ConstructorEvent'
import { CircleSpinner, ClassicSpinner} from "react-spinners-kit";
import { successMessage,errorMessage } from "../MainPage/Functions/CommonFunctions";



const Verification = (props) => {
    const [otp, setOtp] = useState("");
    const [credentials, setCredentials] = useState([]);
    const [proceedLoading,setProceedLoading] = useState(false)
    const [otpsent,setOtpsent] = useState(false)
    const [eye,setEye] = useState(false)
    const navigate = useNavigate()

    const ChangeEye = () => {
        setEye(!eye)
    }
    const fetchdata = async() => {
        setProceedLoading(true)
        const storedData = localStorage.getItem('UserKey');
        if (storedData !== "undefined" && storedData !== "null" && storedData !== undefined && storedData !== null){
            const params = JSON.parse(storedData)
            if (otp !== "" ) {params["b2b_otp"] = otp}            
            
            const responsedata = await PublicApiFormSubmitEvent(EmailVerification,params)
            console.log(responsedata,params)
            if (responsedata === "otp-not-sent"){errorMessage("otp not sent")}
            else if (responsedata === "otp-verification-failed"){errorMessage("Sorry,The OTP don't match")}
            else if (responsedata === "otp-expired"){errorMessage("Sorry,The OTP has expired")}
            else if (responsedata[0] === "otp-sent"){setOtpsent(true);successMessage("otp sent succesfully");setCredentials(responsedata[1])}
            else if (responsedata[0] === "otp-verified"){successMessage("otp verified") ; navigate("/settingUp");
                localStorage.setItem('UserData', JSON.stringify(responsedata[3]))
                localStorage.setItem('authToken',  responsedata[1]);localStorage.setItem('lastLoginTime', 
                Date.now());localStorage.setItem('UserKey', JSON.stringify({agent_code : responsedata[2]}))
            }
            else {errorMessage("Something Gone Wrong")}
            setProceedLoading(false)
        }
    }

    return (
        <>
            <div className="main-wrapper">
                <Helmet>
                    <title>Spice County - Verification</title>
                    <meta name="description" content="ForgetPassword page" />
                </Helmet>
                <div className="account-content">
                    <div className="login-wrapper">
                        <div className="login-content">
                            <div className="login-userset ">
                                <div className="login-userheading">
                                    <h3>Verification</h3>
                                    <h4>
                                    {otpsent ?credentials["mail"] ? "An activation code has been dispatched to your Mail Address : " + credentials["mail"] : "An activation code has been dispatched to your Phone Number : " + credentials["phone"] : `To successfully complete the Registration, 
                                    it is vital to verify the email address or mobile number associated with it, 
                                    ensuring a seamless experience.`}
                                    </h4>
                                </div>
                                {otpsent ? 
                                <div>
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
                                <div className="form-login">
                                        <div className="alreadyuser">
                                            <h4> 
                                                <span  className="hover-a" onClick={fetchdata}>
                                                    resend Otp?
                                                </span>
                                            </h4>
                                        </div>
                                    </div>
                                </div> 
                                :""}
                                <div className="form-login">
                                    <span className="btn btn-login" onClick={fetchdata} style={{ display: 'flex', alignItems: 'center',justifyContent: 'center' }} >
                                    {proceedLoading ? <ClassicSpinner size={25} color ="black"/> :otpsent ?"Verify Otp" : "Send Verification Code" }
                                    </span>
                                </div>
                                
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

export default Verification;
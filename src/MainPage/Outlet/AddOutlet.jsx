import React, { useState,useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormSubmitEvent } from '../../Event/ConstructorEvent';
import { AddNewOutlet } from '../../api/Aws-api';
import { CircleSpinner } from 'react-spinners-kit';
import { successMessage,errorMessage,WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions";
import { ApplicationAttributes } from "../../InitialPage/App";

const AddOutlet = (props) => {
    const [loading, setLoading] = useState(false);
    const [addmore, setAddmore] = useState(false);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [mobile,setMobile] = useState("");
    const [website,setWebsite] = useState("");
    const [streetAddress,setStreetAddress] = useState("");
    const [state,setState] = useState("");
    const [country,setCountry] = useState("");
    const [pincode,setPincode] = useState("");
    const [WorkStart,setWorkStart] = useState("");
    const [WorkEnd,setWorkEnd] = useState("");
    const AgentCode = JSON.parse(localStorage.getItem('UserKey'))["agent_code"]
    const {setOutletCode,B2BCode,setOutletName} = useContext(ApplicationAttributes)
    const navigate = useNavigate()

    const onSubmit = async() => {
        setLoading(true)
        console.log(B2BCode,"code")
        const params = {
            "outlet_name" : name,
            "outlet_mobile"  : mobile,
            "outlet_email" : email,
            "outlet_website" : website,
            "outlet_address" : {
                "StreetAddress" : streetAddress,
                "Outlet_State" : state,
                "Country" : country,
                "PinCode" : pincode
            },
            "WorkingHours" : WorkStart ? WorkEnd ? WorkStart + "_" + WorkEnd : "" : ""
        }
        
        const responsedata = await FormSubmitEvent(AddNewOutlet,{"params" : params,"b2b_code" : B2BCode,"agent_code" : AgentCode})
        if (responsedata[0] === "Added"){setOutletCode(responsedata[1]);setOutletName(name);successMessage("New Outlet Added");navigate("/dream-pos/outlet/selectbusinesscase")}
        else {errorMessage("Something Gone Wrong")}
        setLoading(false)
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Create your Business Outlet</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Name <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={name}
                                            onChange={(e) => setName(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Email</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Mobile</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Website</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value) }
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>State</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={state}
                                            onChange={(e) => setState(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Pincode</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value) }
                                        />
                                    </div>
                                </div>
                                {addmore ? 
                                    <div className='row'>
                                        <div className="col-lg-3 col-sm-3 col-12">
                                            <div className="form-group ">
                                                <label>Working From :</label>
                                                    <input 
                                                        type="time" 
                                                        className='time-input'
                                                        value={WorkStart}
                                                        onChange={(e) => setWorkStart(e.target.value) }
                                                    />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-3 col-12">    
                                            <div className="form-group ">
                                                <label>To :</label>
                                                <input 
                                                    type="time" 
                                                    className='time-input'
                                                    value={WorkEnd}
                                                    onChange={(e) => setWorkEnd(e.target.value) }
                                                />
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                :
                                    <div className="signinform-changed">
                                        <h4>
                                        <span  className="hover-a ml-4 fontSize-12" onClick={()=>setAddmore(true)}>   
                                        Add More ...
                                        </span>
                                        </h4>
                                    </div>
                                }
                                
                                
                                <div className="col-lg-12 mt-4">
                                    <button className="btn btn-submit" onClick={name && onSubmit} disabled={loading}>
                                        {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Submit"}
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /add */}
                </div>
            </div>
        </>
    )
}
export default AddOutlet;
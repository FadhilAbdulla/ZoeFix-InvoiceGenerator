import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';
import { ClientHelper } from '../../api/Aws-api';
import { ConstructorEventPost } from '../../Event/ConstructorEvent';
import { successMessage,errorMessage } from '../Functions/CommonFunctions';

const AddNewClients = (props) => {
    const [loading, setLoading] = useState(false);
    const [ClientName,setClientName] = useState("");
    const [ClientEmail,setClientEmail] = useState("");
    const [ClientMobile,setClientMobile] = useState("");
    const [ClientGstNumber,setClientGstNumber] = useState("");
    const [ClientWebsite,setClientWebsite] = useState("");
    const [ClientStreetAddress,setClientStreetAddress] = useState("");
    const [ClientState,setClientState] = useState("");
    const [ClientStateCode,setClientStateCode] = useState("");
    const [ClientCountry,setClientCountry] = useState("");
    const [ClientPincode,setClientPincode] = useState("");
    const navigate = useNavigate()

    const onSubmit = async() => {
        setLoading(true)
        const params = {
            "ClientName" : ClientName,
            "ClientEmail"  : ClientEmail,
            "ClientMobile" : ClientMobile,
            "ClientGstNumber" : ClientGstNumber,
            "ClientWebsite" : ClientWebsite,
            "ClientStreetAddress" : ClientStreetAddress,
            "ClientState" : ClientState,
            "ClientStateCode" : ClientStateCode,
            "ClientCountry" : ClientCountry,
            "ClientPincode" : ClientPincode
        }
        const responsedata = await ConstructorEventPost(ClientHelper,{data : params, operation:"create"})
        if (responsedata["statusCode"] === 200) {successMessage(responsedata["body"]);navigate("/zoefix/clients")}
        else if (responsedata["statusCode"] === 500) {errorMessage(responsedata["body"])}
        else {errorMessage("Server Error")}
        setLoading(false)
    }

    const onCancel = async() => {
        navigate("/zoefix/clients")
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Add your New Client</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Name <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientName}
                                            onChange={(e) => setClientName(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Email</label>
                                        <input 
                                            type="text" 
                                            maxLength="50"
                                            value={ClientEmail}
                                            onChange={(e) => setClientEmail(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Mobile</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientMobile}
                                            onChange={(e) => setClientMobile(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Gst Number</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientGstNumber}
                                            onChange={(e) => setClientGstNumber(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Website</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientWebsite}
                                            onChange={(e) => setClientWebsite(e.target.value) }
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Street Address</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientStreetAddress}
                                            onChange={(e) => setClientStreetAddress(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client State</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientState}
                                            onChange={(e) => setClientState(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client State Code</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientStateCode}
                                            onChange={(e) => setClientStateCode(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Country</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientCountry}
                                            onChange={(e) => setClientCountry(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client Pincode</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ClientPincode}
                                            onChange={(e) => setClientPincode(e.target.value) }
                                        />
                                    </div>
                                </div>
                                {/* {addmore ? 
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
                                } */}
                                
                                
                                <div className="col-lg-12 mt-4">
                                <button className="btn btn-cancel mr-4" onClick={onCancel} disabled={loading}>
                                         Cancel
                                    </button>
                                    <button className="btn btn-submit" onClick={onSubmit} disabled={loading}>
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
export default AddNewClients;
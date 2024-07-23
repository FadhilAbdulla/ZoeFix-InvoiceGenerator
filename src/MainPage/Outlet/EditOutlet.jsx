import React, { useState,useEffect ,useContext} from 'react'
import { FormSubmitEvent,uploadImage } from '../../Event/ConstructorEvent';
import { UpdateOutletDetails,AssignUserToOutlet } from '../../api/Aws-api';
import { CircleSpinner } from 'react-spinners-kit';
import { successMessage,errorMessage,WorkFlowSpecificNameChanger} from "../Functions/CommonFunctions";
import { useLocation ,useNavigate } from "react-router-dom"
import { ApplicationAttributes } from '../../InitialPage/App';
import { Upload } from '../../EntryFile/imagePath';



const EditOutlet = (props) => {
    const [loading, setLoading] = useState(false);
    const [outletCode,setOuletCode] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [mobile,setMobile] = useState("");
    const [website,setWebsite] = useState("");
    const [streetAddress,setStreetAddress] = useState("");
    const [state,setState] = useState("");
    const [country,setCountry] = useState("");
    const [pincode,setPincode] = useState("");
    const [emailValue, setEmailValue] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [PrevEmailList, setPrevEmailList] = useState([]);
    const [OutletData, setOutletData] = useState();
    const [B2BCode, setB2BCode] = useState();
    const [OutletName, setOutletName] = useState();
    const [HeaderImage, setHeaderImage] = useState(null);
    const loc = useLocation()
    const navigate = useNavigate()


    useEffect(()=>{
        const {data} = loc.state ? loc.state : []
        if (data){
            console.log(data)
            setOutletData(data)
            setName(data["outlet_name"] ? data["outlet_name"] : "");setEmail(data["outlet_email"] ? data["outlet_email"] : "");setMobile(data["outlet_mobile"] ? data["outlet_mobile"] : "");setWebsite(data["outlet_website"] ? data["outlet_website"] : " ")
            setStreetAddress(data["outlet_address"] ? data["outlet_address"]["StreetAddress"] : "");setOuletCode(data["outlet_unique_id"] ? data["outlet_unique_id"] : "");
            setState(data["outlet_address"]["Outlet_State"]);setCountry(data["outlet_address"]["Country"]);setPincode(data["outlet_address"]["PinCode"]);
            setB2BCode(data["b2b_code"]);setOutletName(data["outlet_name"])
            const agent_emails = data["outlet_agent"] ? data["outlet_agent"].map(item => item.agent_email) : []
            setEmailList(agent_emails);setPrevEmailList(agent_emails)
        }
      },[])

    const onSubmit = async() => {
        setLoading(true)
        let temp = OutletData;
        temp["outlet_unique_id"] = outletCode;
        temp["outlet_name"] = name
        temp["outlet_mobile"] = mobile
        temp["outlet_email"] = email
        temp["outlet_website"] = website
        temp["outlet_address"]["StreetAddress"] = streetAddress
        temp["outlet_address"]["State"] = state
        temp["outlet_address"]["Country"] = country
        temp["outlet_address"]["PinCode"] = pincode

        const AssignUserToOutletParams = {
            "mailList" : emailList,
            "b2b_code" : B2BCode,
            "outlet_name" : OutletName,
            "outlet_code" : outletCode
          }

        const responsedata = await FormSubmitEvent(UpdateOutletDetails,{"params" :temp , "imgType" : HeaderImage ? HeaderImage.type : "noImage"})
        console.log(AssignUserToOutletParams)
        console.log(emailList,PrevEmailList)
        if (responsedata[0] === "updated"){
            UploadOutletHeaderImage(responsedata[1])
            if (JSON.stringify(emailList.sort()) !== JSON.stringify(PrevEmailList.sort())){
                console.log("user assigning initiated")
                const AssignUserToOutletresponseData = await FormSubmitEvent(AssignUserToOutlet,AssignUserToOutletParams);
                if (AssignUserToOutletresponseData["statusCode"] === 200){
                    successMessage("Updated OuletDetails");navigate("/dream-pos/outlet/listoutlet")
                }
                else {errorMessage("Something Gone Wrong")}
            }
            else {successMessage("Updated OuletDetails");navigate("/dream-pos/outlet/listoutlet")}
        }
        else {errorMessage("Something Gone Wrong")}
        setLoading(false)
        navigate({pathname: "/dream-pos/outlet/listoutlet"})
    }

    const UploadOutletHeaderImage = async (URL) => {
        if (URL !== "NoUrl"){
            const response = await uploadImage(URL,HeaderImage)
            if (response["status"] == 200){
                successMessage("Header Image Uploaded SuccesFully")
            }
            else {errorMessage("Something Gone Wrong While Uploading Header Image")}
        }
        else {console.log("no header Imge")}
    }
    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEmailValue(inputValue);
      };
    
      const handleKeyPress = (e) => {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (e.key === ' ' && emailValue.trim() !== '' || e.key === 'Enter') {
            if (!emailList.includes(emailValue.trim().toLowerCase()) && emailRegex.test(emailValue.trim().toLowerCase())){
                setEmailList([...emailList, emailValue.trim().toLowerCase()]);}
            setEmailValue('');
        }
      };
    
      const removeEmail = (email) => {
        const updatedList = emailList.filter((item) => item !== email);
        setEmailList(updatedList);
      };
      const ClickedAddNewImageButton = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Edit your {WorkFlowSpecificNameChanger("outlet")} Details</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Name </label>
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
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>{WorkFlowSpecificNameChanger("outlet")} Logo</label>
                                        <div className="image-upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled = {HeaderImage ? true : false}
                                                onChange={(e) => setHeaderImage(e.target.files[0])}
                                            />
                                            <div className="image-uploads">
                                                {HeaderImage ? 
                                                    <iconify-icon icon="streamline:interface-file-clipboard-check-checkmark-edit-task-edition-checklist-check-success-clipboard-form" style={{"fontSize": "30px","color" : "orange"}} ></iconify-icon> 
                                                    :
                                                    <img src={Upload} alt="img" /> 
                                                }
                                                <h4>{HeaderImage ? "Image Selected" : "Drag and drop a file to upload"}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                
                                
                                <div className="form-group">
                                        <label>Users</label>
                                        <div className="col-lg-12 col-sm-12 col-12">
                                            {emailList.map((email, index) => (
                                            <span key={index} className="email-tag">
                                                {email}
                                                <span className="remove-tag bg-lightgreen" onClick={() => removeEmail(email)}>
                                                &times;
                                                </span>
                                            </span>
                                            ))}
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                        <input 
                                            type="text" 
                                            maxLength="35"
                                            placeholder='Add New User'
                                            value={emailValue}
                                            onChange={handleEmailChange}
                                            onKeyPress={handleKeyPress}
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-lg-12 mt-4">
                                    <button className="btn btn-cancel me-2" onClick={()=>navigate("/dream-pos/outlet/listoutlet")}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-submit me-2" onClick={name && onSubmit} disabled={loading}>
                                        {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Save Changes"}
                                    </button>
                                    {//<button className="btn btn-cancell" >Cancell</button>
}
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
export default EditOutlet;
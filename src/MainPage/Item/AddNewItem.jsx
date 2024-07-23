import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';
import { ItemHelper } from '../../api/Aws-api';
import { ConstructorEventPost } from '../../Event/ConstructorEvent';
import { successMessage,errorMessage } from '../Functions/CommonFunctions';

const AddNewItem = (props) => {
    const [loading, setLoading] = useState(false);
    const [addmore, setAddmore] = useState(false);
    const [ItemName,setItemName] = useState("")
    const [ItemPrice,setItemPrice] = useState("")
    const [ItemCGST,setItemCGST] = useState("")
    const [ItemIGST,setItemIGST] = useState("")
    const [ItemSGST,setItemSGST] = useState("")
    const [ItemCode,setItemCode] = useState("")
    const [ItemRatePerAmount,setItemRatePerAmount] = useState("")
    const navigate = useNavigate()

    const onSubmit = async() => {
        setLoading(true)
        const params = {
            "ItemName" : ItemName,
            "ItemPrice" : ItemPrice,
            "ItemCGST"  : ItemCGST,
            "ItemIGST" : ItemIGST,
            "ItemSGST" : ItemSGST,
            "ItemCode" : ItemCode,
            "ItemRatePerAmount" : ItemRatePerAmount
        }
        const responsedata = await ConstructorEventPost(ItemHelper,{data : params, operation:"create"})
        if (responsedata["statusCode"] === 200) {successMessage(responsedata["body"]);navigate("/zoefix/item")}
        else if (responsedata["statusCode"] === 500) {errorMessage(responsedata["body"])}
        else {errorMessage("Server Error")}
        setLoading(false)
    }

    const onCancel = async() => {
        navigate("/zoefix/item")
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Add New Bill</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item Name <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemName}
                                            onChange={(e) => setItemName(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item Code (HSN/SAC)</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemCode}
                                            onChange={(e) => setItemCode(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item Price</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemPrice}
                                            onChange={(e) => setItemPrice(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item price per amount</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemRatePerAmount}
                                            onChange={(e) => setItemRatePerAmount(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item CGST %</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemCGST}
                                            onChange={(e) => setItemCGST(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item IGST %</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemIGST}
                                            onChange={(e) => setItemIGST(e.target.value) }
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item SGST %</label>
                                        <input 
                                            type="text" 
                                            maxLength="30"
                                            value={ItemSGST}
                                            onChange={(e) => setItemSGST(e.target.value) }
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
export default AddNewItem;
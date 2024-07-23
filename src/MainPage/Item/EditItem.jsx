import React, { useState,useContext,useEffect } from 'react'
import { Upload } from '../../EntryFile/imagePath';
import { CircleSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from '../../InitialPage/App';
import { FetchItemCategory,UpdateItemDetails } from '../../api/Aws-api';
import { ConstructorEventGet,ConstructorEventPost,uploadImage } from '../../Event/ConstructorEvent';
import { errorMessage, successMessage } from '../Functions/CommonFunctions';
import { useNavigate,useLocation } from 'react-router-dom';


const EditItem = (props) => {
    const [Catogory,setCatogory] = useState()
    const [Catogory_options,setCatogory_options] = useState([])
    const [ItemImage, setItemImage] = useState(null);
    const [Refreshloading,setRefreshLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const {OutletCode} = useContext(ApplicationAttributes)
    const [ProductName, setProductName] = useState(null);
    const [Price, setPrice] = useState(null);
    const [Quantity, setQuantity] = useState(null);
    const [TaxPercentage, setTaxPercentage] = useState(null);
    const [UnitOfMeasure, setUnitOfMeasure] = useState(null);
    const [Description, setDescription] = useState(null); 
    const [FullItemData, setFullItemData] = useState(null);   
    const navigate = useNavigate()
    const loc = useLocation()
 
    
    useEffect(()=>{
        const {data} = loc.state ? loc.state : []
        async function fetchdata(){
          const responseData = await ConstructorEventGet(FetchItemCategory ,{client_code: OutletCode});
          console.log(responseData)
          setCatogory_options(responseData ? responseData : [])
          setRefreshLoading(false)
        }
        //setRefreshLoading(true)
        //fetchdata()
        if (data) {
            setFullItemData(data)
            setCatogory(data["catogory"] ? data["catogory"] : "");setItemImage(data["catogory"] ? data["catogory"] : "");setProductName(data["item_name"] ? data["item_name"] : "");
            setPrice(data["price"] ? data["price"] : "");setQuantity(data["quantity"] ? data["quantity"] : "");
            setTaxPercentage(data["tax_percentage"] ? data["tax_percentage"] : "");setUnitOfMeasure(data["unit_of_measure"] ? data["unit_of_measure"] : "");setDescription(data["Description"] ? data["Description"] : "")
        }
      },[])


      const handleProfileUpload = async(e) => {
        setLoading(true)
        const temp = FullItemData
        temp["catogory"] = Catogory
        temp["item_name"] = ProductName
        temp["price"] = parseInt(Price)
        temp["quantity"] = 1000
        temp["tax_amount"] = 100
        temp["tax_percentage"] = parseInt(TaxPercentage)
        temp["unit_of_measure"] = UnitOfMeasure
        temp["Description"] = Description
        const responsedata = await ConstructorEventPost(UpdateItemDetails,{params : temp,clientCode : OutletCode})
        if (responsedata === "updated"){successMessage("Item Updated");navigate("/dream-pos/item/ListItem")}
        else {errorMessage("Item Updation Failed")}
        setLoading(false)  
    }


    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Edit Item</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                        <CircleSpinner size={20} color ="orange" loading={Refreshloading} /> 
                            <div className="row ">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item Name <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={ProductName}
                                            onChange={(e) => setProductName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12" >
                                    <div className="form-group">
                                        <label>Category <span style={{color: "red"}}>*</span></label>
                                        {/*<select value={Catogory} className="checkInput" onChange={(e) => setCatogory(e.target.value) } disabled>
                                        {Catogory_options && Catogory_options.map((data, index) => (<option value={data["category_code"]}>{data["category_code"]}</option>))}
    </select>*/}
                                        <input type="text" value={Catogory} disabled />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Price <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={Price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input 
                                            type="text" 
                                            value={Quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Tax Percentage</label>
                                        <input
                                            type="text" 
                                            value={TaxPercentage}
                                            onChange={(e) => setTaxPercentage(e.target.value)}
                                        />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Unit of measure</label>
                                        <input 
                                            type="text" 
                                            value={UnitOfMeasure}
                                            onChange={(e) => setUnitOfMeasure(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input 
                                            type="text" 
                                            value={Description}
                                            onChange={(e) => setDescription(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                <button className="btn btn-cancel me-2" onClick={()=>navigate("/dream-pos/item/ListItem")}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-submit me-2" onClick={ProductName && Price && handleProfileUpload} disabled={loading}>
                                    {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Save Changes"}
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
export default EditItem;
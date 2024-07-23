import React,{useState,useContext, useEffect} from 'react';
import { Upload } from '../../EntryFile/imagePath';
import { uploadImage,ConstructorEventPost } from '../../Event/ConstructorEvent';
import { UpdateCategoryDetails } from '../../api/Aws-api';
import { ApplicationAttributes } from '../../InitialPage/App';
import { errorMessage, successMessage } from '../Functions/CommonFunctions';
import { CircleSpinner } from "react-spinners-kit";
import { useNavigate,useLocation } from 'react-router-dom';

const EditCategory = (props) => {
    const [FullCatogoryDetails, setFullCatogoryDetails] = useState();
    const [CatogoryImage, setCatogoryImage] = useState();
    const [CatogoryName, setCatogoryName] = useState(null);
    const [loading,setLoading] = useState(false)
    const {OutletCode} = useContext(ApplicationAttributes)
    const navigate = useNavigate()
    const loc = useLocation()

    useEffect(()=>{
        const {data} = loc.state ? loc.state : []
        if (data){
            setFullCatogoryDetails(data)
            setCatogoryName(data["category_name"] ? data["category_name"] : "");setCatogoryImage(data["category_name"] ? data["category_name"] : "")
        }
    },[])
    const handleProfileUpload = async(e) => {
        setLoading(true)
        const temp = FullCatogoryDetails
        temp["category_name"] = CatogoryName
        //temp["active"] = 
        const responsedata = await ConstructorEventPost(UpdateCategoryDetails,{params : temp,clientCode : OutletCode})
        if (responsedata === "updated"){successMessage("Category Updated");navigate("/dream-pos/item/ListCatogory")}
        else {errorMessage("Category Updation Failed")}
        setLoading(false)
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Edit Category</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Catogory Name <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={CatogoryName}
                                            onChange={(e) => setCatogoryName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <button className="btn btn-cancel me-2" onClick={()=>navigate("/dream-pos/item/ListCatogory")}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-submit me-2" onClick={handleProfileUpload} disabled={loading}>
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

export default EditCategory;
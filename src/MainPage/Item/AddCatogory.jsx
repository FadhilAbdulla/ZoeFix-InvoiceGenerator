import React,{useState,useContext} from 'react';
import { Upload } from '../../EntryFile/imagePath';
import { uploadImage,ConstructorEventPost } from '../../Event/ConstructorEvent';
import { AddNewCatogory } from '../../api/Aws-api';
import { ApplicationAttributes } from '../../InitialPage/App';
import { errorMessage, successMessage } from '../Functions/CommonFunctions';
import { CircleSpinner } from "react-spinners-kit";
import { useNavigate } from 'react-router-dom';

const AddCatogory = (props) => {
    const [CatogoryImage, setCatogoryImage] = useState();
    const [CatogoryName, setCatogoryName] = useState(null);
    const [loading,setLoading] = useState(false)
    const {OutletCode} = useContext(ApplicationAttributes)
    const navigate = useNavigate()

    const handleProfileUpload = async(e) => {
        setLoading(true)
        const params = {
            "active" : false,
            "category_name" : CatogoryName,
            "category_code" : CatogoryName.toLowerCase()
        }
        const responsedata = await ConstructorEventPost(AddNewCatogory,{params : params, imgtype : CatogoryImage && CatogoryImage.type ? CatogoryImage.type : "noImage",clientCode : OutletCode})
        console.log(responsedata,"response")
        if (responsedata === "category-exist") {errorMessage("The category with same name Exist!!!")}
        else if (responsedata !== "created"){
            const response = await uploadImage(responsedata,CatogoryImage)
            if (response["status"] == 200){
                successMessage("Catogory SuccessFully Created")
                navigate("/dream-pos/item/ListCatogory")
            }
        }
        else {successMessage("Catogory SuccessFully Created");navigate("/dream-pos/item/ListCatogory")}
        setLoading(false)
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Add New Category</h4>
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
                                    <div className="form-group">
                                        <label> Catogory Image</label>
                                        <div className="image-upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled = {CatogoryImage ? true : false}
                                                onChange={(e) => setCatogoryImage(e.target.files[0])}
                                            />
                                            <div className="image-uploads">
                                                {CatogoryImage ? 
                                                    <iconify-icon icon="streamline:interface-file-clipboard-check-checkmark-edit-task-edition-checklist-check-success-clipboard-form" style={{"fontSize": "30px","color" : "orange"}} ></iconify-icon> 
                                                    :
                                                    <img src={Upload} alt="img" /> 
                                                }
                                                <h4>Drag and drop a file to upload</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <button  className="btn btn-submit me-2" onClick={CatogoryName && handleProfileUpload} disabled={loading}>
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

export default AddCatogory;
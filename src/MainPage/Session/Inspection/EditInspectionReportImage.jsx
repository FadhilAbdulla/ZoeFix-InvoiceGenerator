import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';


const EditInspectionReportImage = () => {
    const [Images,setImages] = useState([])
    const [ImageSelect,setImageSelect] = useState()
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,setInspectionReportImage} = useContext(SalesAttributes)

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
    })

    const ClickedAddNewImageButton = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }

    const ClickedRemoveImageButton = () => {
        let temp = Images
        temp.splice(ImageSelect, 1)
        setImages(temp)
        setImageSelect()
    }

    const AddedImageFile = (e) => {
        const temp = Array.from(e.target.files)
        const Combined = temp.concat(Images)
        setImages(Combined)
        setImageSelect()
    }

    const onClickNext = () => {
        setInspectionReportImage(Images)
        navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
    }
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Add Images</h4>
                    </div>
                    <div className="page-btn">
                        <button className="btn btn-added" onClick={onClickNext}>
                            Next
                        </button>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="pb-4" >
                            <div className='image-container-inspection-content-addNew' onClick={ClickedAddNewImageButton}>
                            <iconify-Icon icon="akar-icons:plus" style={{paddingTop: "2px"}}/> Add New Image
                            </div>
                            {ImageSelect > -1 ? <div className='image-container-inspection-content-removeButton' onClick={ClickedRemoveImageButton}>
                            <iconify-Icon icon="eva:close-fill" style={{paddingTop: "2px"}}/> Remove Image
                            </div> : "" }
                        </div>
                        <div className="row">
                            {Images.map((image, index) => (
                            <div className="col-lg-3 col-sm-6 col-12 pb-4" onClick={()=>setImageSelect(index)}>
                                <div className={ImageSelect === index ? 'image-container-inspection-image-remove' : 'image-container-inspection'}>
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(image)}
                                        alt={`Image ${index}`}
                                        style={{borderRadius: "10px"}}
                                    />
                                </div>
                            </div>
                            ))
                            } 
                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                accept="image/*"
                                onChange={AddedImageFile}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditInspectionReportImage;

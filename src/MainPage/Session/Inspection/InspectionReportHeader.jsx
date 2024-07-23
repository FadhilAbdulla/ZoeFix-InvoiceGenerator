import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction, errorMessage } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';


const InspectionReportHeader = () => {
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const [AddRow, setAddRow] = useState(false)
    const [NewRawName,setNewRawName] = useState("")
    const {InitiatorCode,setInspectionReportHeaderData} = useContext(SalesAttributes)
    const [TemplateName,setTemplateName] = useState("")
    const [HeaderData, setHeaderData] = useState([
        {"name" : "Project Name" , "data" : "" },
        {"name" : "Main Contractor" , "data" : "" },
        {"name" : "Scope Of Works" , "data" : "" },
        {"name" : "System" , "data" : "" }
    ])


    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        
    }
    )
    const CreateNewTableDataRaw = () => {
        const temp = [...HeaderData]
        let Flag = false
        for (let data of temp){if(data.name === NewRawName){Flag = true}}
        if(!Flag && NewRawName.length > 0){
            setHeaderData([...HeaderData,{"name" : NewRawName , "data" : "" }])
            setNewRawName("")
        }
        setNewRawName("")
        setAddRow(false)
    }
    const SetDataAndNavigate = () => {
        let temp = HeaderData
        temp.push({"name" : "TemplateName" , "data" : TemplateName})
        setInspectionReportHeaderData(temp)
        navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
    }
    const DeleteRawTableDataRAw = (RawName) => {
        const temp = [...HeaderData]
        for (let data of temp){
            if(data.name === RawName){
                temp.splice(temp.indexOf(data),1)
            }
        }
        setHeaderData(temp)
    }
    const HandleDataChange = (value,RawName) => {
        const temp = [...HeaderData]
        for (let data in temp){
            if(temp[data]["name"] === RawName){
                temp[data].data = value
            }
        }
        setHeaderData(temp)
    }

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Add Report Header</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label>Template Name <span style={{color: "red"}}>*</span></label>
                                    <input type="text" onChange={(e) => setTemplateName(e.target.value)}/>
                                </div>
                            </div>
                        {HeaderData.map((item, index) => (
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="form-group" key={index}>
                                        <div style={{display: "inline-flex", alignItems: "center"}}>
                                        <label>{item.name} </label>
                                        <iconify-icon icon="mdi:close-outline" style={{  color: 'red',fontSize: "14px",paddingTop:"0px" , marginBottom: "8px" , paddingLeft:"8px" }} onClick={() => DeleteRawTableDataRAw(item.name)}></iconify-icon>
                                        </div>

                                        <input type="text" value={item.data} onChange={(e) => HandleDataChange(e.target.value,item.name)}/>
                                        
                                    </div>
                                </div>
                            ))
                            }
                        <div className="col-lg-12 mt-4">
                            { !AddRow ? 
                                <div className="AddNewTableIcon" onClick={()=>setAddRow(true)} ><iconify-icon icon="mingcute:add-fill" style={{  color: '#FF9F43',fontSize: "18px"  }}></iconify-icon></div>
                            : <div className="col-lg-4 col-sm-4 col-12">
                                <div className="AddnewTableKey" >
                                
                                    <input type="text" placeholder='Enter the Table Key' onChange={(e) => setNewRawName(e.target.value)}/>
                                    <iconify-icon icon="mdi:tick-outline" style={{  color: 'green',fontSize: "20px",paddingRight : "10px"  }} onClick={CreateNewTableDataRaw}></iconify-icon>
                                    <iconify-icon icon="iconamoon:close-bold" style={{  color: 'red',fontSize: "20px"  }} onClick={() => {setAddRow(false);setNewRawName("")}}></iconify-icon>
                                </div>
                            </div>
                            }
                        </div>
                            
                           
                        <div className="col-lg-12 mt-4">
                            <button className="btn btn-cancel me-2">
                                        Cancel
                                    </button>

                                <button className="btn btn-submit" onClick={()=> TemplateName ? SetDataAndNavigate() : errorMessage("Please Enter a Name for your Template")}>
                                    Next 
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InspectionReportHeader;

import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';
import { ApplicationAttributes } from '../../../InitialPage/App';


const EditInspectionReportHeader = () => {
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,InspectionReportHeaderData,setInspectionReportHeaderData} = useContext(SalesAttributes)
    const {OutletName} = useContext(ApplicationAttributes)
    const [EditPage,setEditPage] = useState(false)
    const [HeaderData, setHeaderData] = useState([])

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        console.log(order_of_execution,InitiatorCode,uri.current,"editpage")
        if (InspectionReportHeaderData.length > 0) {setHeaderData(InspectionReportHeaderData);OultetNameAsDefaultProjectName(InspectionReportHeaderData)}
    },[])

    const HandleDataChange = (value,RawName) => {
        const temp = [...HeaderData]
        for (let data in temp){
            if(temp[data]["name"] === RawName){
                temp[data].data = value
            }
        }
        setHeaderData(temp)
    }

    const OultetNameAsDefaultProjectName = (data) => {
        
        const temp = [...data]
        for (let data in temp){
            if(temp[data]["name"] === "Project Name"){
                temp[data].data = temp[data].data !== "" ? temp[data].data : OutletName
            }
        }
        setHeaderData(temp)
    }

    const SetDataAndNavigate = () => {
        setInspectionReportHeaderData(HeaderData)
        navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
    }

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Edit Report Header</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {HeaderData.map((item, index) => (
                                <div className="col-lg-6 col-sm-6 col-12" key={index}>
                                    <div className="form-group" >
                                        <div style={{display: "inline-flex", alignItems: "center"}}>
                                        <label>{item.name} </label>
                                        </div>
                                        <input type="text" value={item.data} disabled={!EditPage} onChange={(e) => HandleDataChange(e.target.value,item.name)}/> 
                                    </div>
                                </div>
                            ))
                            }                            
                            <div className="col-lg-12 mt-4">
                            { EditPage ? "" :
                                <button className="btn btn-cancel me-2" onClick={() => setEditPage(true)}>
                                    Edit
                                </button>}
                                <button className="btn btn-submit" onClick={SetDataAndNavigate}>
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

export default EditInspectionReportHeader;

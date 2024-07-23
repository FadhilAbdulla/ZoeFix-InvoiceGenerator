import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';

const EditInspectionReportComments = () => {
    const [AddRow, setAddRow] = useState(false)
    const [NewRawName,setNewRawName] = useState("")
    const [TableData, setTableData] = useState([{"name" : "General Comments" , "data" : "" }])
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const uri = useRef(null);
    const navigate = useNavigate()
    const {InitiatorCode,setInspectionReportCommentsData,InspectionReportCommentsData} = useContext(SalesAttributes)
    const [EditPage,setEditPage] = useState(false)

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        if (InspectionReportCommentsData.length > 0) {setTableData(InspectionReportCommentsData)}
    })

    const CreateNewTableDataRaw = () => {
        const temp = [...TableData]
        let Flag = false
        for (let data of temp){if(data.name === NewRawName){Flag = true}}
        if(!Flag && NewRawName.length > 0){
            setTableData([...TableData,{"name" : NewRawName , "data" : "" }])
            setNewRawName("")
        }
        setNewRawName("")
        setAddRow(false)
    }
    const DeleteRawTableDataRAw = (RawName) => {
        const temp = [...TableData]
        for (let data of temp){
            if(data.name === RawName){
                temp.splice(temp.indexOf(data),1)
            }
        }
        setTableData(temp)
    }
    const HandleDataChange = (value,RawName) => {
        const temp = [...TableData]
        for (let data in temp){
            if(temp[data]["name"] === RawName){
                temp[data].data = value
            }
        }
        setTableData(temp)
    }

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                    <h4>Edit Inspection Record</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {TableData.map((item, index) => (
                                <div className="col-lg-12 col-sm-12 col-12" key={index}>
                                    <div className="form-group" >
                                        <div style={{display: "inline-flex", alignItems: "center"}}>
                                        <label>{item.name} </label>
                                        </div>
                                        <textarea type="text" value={item.data} disabled={!EditPage} onChange={(e) => HandleDataChange(e.target.value,item.name)}/>
                                    </div>
                                </div>
                            ))
                            }
                            <div className="col-lg-12 mt-4">
                            {EditPage ? "" : <button className="btn btn-cancel me-2" onClick={() => setEditPage(true)}>
                                Edit
                            </button>}
                            <button className="btn btn-submit" onClick={()=>(navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}}),setInspectionReportCommentsData(TableData))}>
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

export default EditInspectionReportComments;

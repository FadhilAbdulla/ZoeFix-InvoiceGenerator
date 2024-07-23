import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';


const EditInspectionReportTable = () => {
    const [AddRow, setAddRow] = useState(false)
    const [NewRawName,setNewRawName] = useState("")
    const [TableData, setTableData] = useState([])
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,setInspectionReportTableData,InspectionReportTableData} = useContext(SalesAttributes)
    const [EditPage,setEditPage] = useState(false)

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        if (InspectionReportTableData.length > 0) {setTableData(InspectionReportTableData)}
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
                    <h4>Edit Report Data</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {TableData.map((item, index) => (
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
                            { EditPage ? "" : <button className="btn btn-cancel me-2" onClick={() => setEditPage(true)}>
                                Edit
                            </button> 
                        }
                            <button className="btn btn-submit" onClick={()=>(navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}}),setInspectionReportTableData(TableData))} >
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

export default EditInspectionReportTable;

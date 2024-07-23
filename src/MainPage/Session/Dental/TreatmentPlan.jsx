import React, { useState,useContext,useEffect,useRef } from 'react'
import { CircleSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from '../../../InitialPage/App';
import { AddTreatementScript,FetchTreatementPlanForSpecificCustomer } from '../../../api/Aws-api';
import { FormSubmitEvent,ConstructorEventGet } from '../../../Event/ConstructorEvent';
import { ForwardUriFetchFunction, GetDate } from '../../Functions/CommonFunctions';
import { useNavigate,useLocation } from 'react-router-dom';
import { SalesAttributes } from '../index';
import { Table } from 'antd';
import { ClassicSpinner } from "react-spinners-kit";


const TreatmentPlan = (props) => {
    const [TreatmentPlanText,setTreatmentPlanText] = useState("")
    const [TreatmentDoneText,setTreatmentDoneText] = useState("")
    const [BillDetails,setBillDetails] = useState("")
    const [MedicalHistory,setMedicalHistory] = useState("")
    const [HostoryData,setHostoryData] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState();


    const [Refreshloading,setRefreshLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const {OutletCode} = useContext(ApplicationAttributes)
    const {customer_id,customer_name,appointment_id,InitiatorCode} = useContext(SalesAttributes)
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    
    useEffect(()=>{
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        //setRefreshLoading(true)
        fetchdata()
      },[])

      async function fetchdata(){
        setLoading(true)
        const responseData = await ConstructorEventGet(FetchTreatementPlanForSpecificCustomer,{"client_code": OutletCode,"CustomerId" : customer_id});
        if (responseData !== "error"){
            setHostoryData(responseData)
        }
        setLoading(false)
    }

      const handleSubmit = async(e) => {
        setLoading(true)
        const params = {
            "Date" : date,
            "TreatementPlan" : TreatmentPlanText,
            "TreatementDone" : TreatmentDoneText,
            "BillDetails" : BillDetails,
            "MedicalHistory" : MedicalHistory,
            "Customer" : customer_name,
            "CustomerId" : customer_id        }

        const responsedata = await FormSubmitEvent(AddTreatementScript,{params : params, clientCode : OutletCode})
        if (responsedata === "Created"){
            console.log(responsedata)
            navigate( uri.current,{state: {order_of_execution: OrderOfExecution+1 }})
        }
        else { console.error("some error happend on savinf the treatement data")}
        //navigate( uri.current,{state: {order_of_execution: OrderOfExecution+1 }})//should remove
        setLoading(false)
    }
    const columns = [
        Table.EXPAND_COLUMN,
        {
          title: "Date",
          dataIndex: "Date",
          key: "Date",
          render: (text, record) => (
            <div className="productimgname">
              <div style={{ fontSize: "15px", marginLeft: "5px" ,color: "black",whiteSpace: 'pre-wrap'}}>
                {record.Date}
              </div>
            </div>
          ),
          sorter: (a, b) => a.Date.length - b.Date.length,
        }
      ]
      const handleRowSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        setSelectedRowKeys(selectedRowKeys);
      };
      const rowSelection = {
        selectedRowKeys,
        onChange: handleRowSelectChange,
      };
      
    const date = GetDate()
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Treatment Plan</h4>
                            <h6></h6>
                        </div>
                    </div>
                    {/* /add */}
                    <div className='row'>
                        <div className="card ">
                            <div className="card-body">
                            <CircleSpinner size={20} color ="orange" loading={Refreshloading} /> 
                                <div className="row ">
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>Date : {date}</label>                                        
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label>Treatment Plan </label>
                                            <textarea
                                            value={TreatmentPlanText}
                                            onChange={(e) => setTreatmentPlanText(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label>Treatment Done </label>
                                            <textarea
                                            value={TreatmentDoneText}
                                            onChange={(e) => setTreatmentDoneText(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label>Bill Details </label>
                                            <textarea
                                            value={BillDetails}
                                            onChange={(e) => setBillDetails(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label>Medical History </label>
                                            <textarea
                                            value={MedicalHistory}
                                            onChange={(e) => setMedicalHistory(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {
                                        HostoryData && HostoryData.length > 0 ? 
                                            <div className='col-lg-12 ml-4 mb-4 '>
                                                <hr></hr>
                                                History
                                                <div className='mt-4 mb-4'>
                                                    <Table
                                                        className="table datanew dataTable no-footer"
                                                        columns={columns}
                                                        dataSource={HostoryData}
                                                        expandable={{
                                                            expandedRowRender: (record) => (
                                                                <div>
                                                                    <div className="expanded-row-content">
                                                                    <div className="expanded-row-item">
                                                                            <span className="expanded-row-label">Treatment Plan:</span>
                                                                            <span className="expanded-row-value">{record.TreatementPlan}</span>
                                                                        </div>
                                                                        <div className="expanded-row-item">
                                                                            <div className="expanded-row-label">Treatment Done:</div>
                                                                            <div className="expanded-row-value">{record.TreatementDone}</div>
                                                                        </div>
                                                                        <div className="expanded-row-item">
                                                                            <div className="expanded-row-label">Medical History:</div>
                                                                            <div className="expanded-row-value">{record.MedicalHistory}</div>
                                                                        </div>
                                                                        <div className="expanded-row-item">
                                                                            <div className="expanded-row-label">Bill Details:</div>
                                                                            <div className="expanded-row-value">{record.BillDetails}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        }}
                                                        rowKey={(record) => record.treatement_script_id}
                                                        pagination={false}
                                                        loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 

                                                    />
                                                </div>
                                            </div>
                                        : ""
                                    }
                                    <div className="col-lg-12">
                                        <button className="btn btn-submit me-2" onClick={handleSubmit} disabled={loading}>
                                        {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Submit"}
                                        </button>
                                        <button className='btn me-2 btn-cancel' onClick={()=>navigate("/dream-pos/session")}><i className="fas fa-plus" /> Add Another Appointment</button>
                                    </div>
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
export default TreatmentPlan;
//Template For Listing Vacant Desk ,Attributes --> Desk ID,Desk NAme,Salesperson name and id

import React, { useEffect, useState , useRef ,useContext } from "react";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import Tabletop from "../../EntryFile/tabletop"
import { Link ,useLocation,useNavigate} from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import {PlusIcon,search_whites} from "../../EntryFile/imagePath";
import {fetchDeskList, AddSession_Sessiontable} from '../../api/Aws-api';
import { ApplicationAttributes } from "../../InitialPage/App";
import {SalesAttributes} from './index'
import {ConstructorEventGet} from '../../Event/ConstructorEvent'
import {ForwardUriFetchFunction,GetDateTime,CheckWorkFlowCreatingSession,WorkFlowSpecificNameChanger} from '../Functions/CommonFunctions'
import {FormSubmitEvent} from '../../Event/ConstructorEvent'


const Select_desk = (props) => {

  const [data,setData] = useState()
  const [loading,setLoading] = useState(true)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const loc = useLocation()
  const date = GetDateTime()
  const uri = useRef(null);
  const navigate = useNavigate()


  useEffect(() => {
    //fetch datas of vacant desk
    const {order_of_execution} = (loc.state ? loc.state : {})
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode);
    async function fetchdata(){
      const responseData = await ConstructorEventGet(fetchDeskList,{client_code: OutletCode});
      setData(responseData)
      setLoading(false)}
    fetchdata()
  },[])

  const [inputfilter, setInputfilter] = useState(false);
  const {customer_id,appointment_id,customer_name,commission_agent_id,commission_agent_name,appointment_starttime,
    sales_persion_name,sales_persion_id,setSession_id,setDesk_id,setDesk_name,InitiatorCode} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  
  const togglefilter = (value) => {setInputfilter(value);};
  //fetch the details of the user using the app using theie credentials

  const DeskSelected = (record) => {
    if (CheckWorkFlowCreatingSession(parseInt(OrderOfExecution)-1)){addNewDataToCloud(record)}
    else{
      setDesk_id(record.desk_id)
      setDesk_name(record.desk_name)
      console.log(OrderOfExecution,'order of execution from desk selection')
      console.log(uri.current,"uri")
      navigate(uri.current,{state:{order_of_execution: OrderOfExecution+1}})
      //onSubmit(props.history,uri.current,{order_of_execution: OrderOfExecution+1})
    }
  }

  const addNewDataToCloud = async (record) =>  {
    setLoading(true)
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "sales_person_id" : sales_persion_id,
        "sales_person_name":sales_persion_name,
        "desk_id": record.desk_id,
        "desk_name": record.desk_name,
        "session_status" : true,
        "session_startDateTimeStamp" : date,
        //
        "commission_agent_id": commission_agent_id,
        "commission_agent_name":commission_agent_name,
        "customer_id" : customer_id,
        "customer_name" : customer_name,
        "appointment_id" : appointment_id,
        "appointment_starttime": appointment_starttime,
    }}};
    const responseData = await FormSubmitEvent(AddSession_Sessiontable,formData);
    setDesk_id(record.desk_id)
    setDesk_name(record.desk_name)
    setSession_id(responseData[0])
    setLoading(false)
    navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }});
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "desk_id",
      sorter: (a, b) => a.desk_id.length - b.desk_id.length,
      render: (text, record) => <div className="divHoverForTables" onClick={()=> DeskSelected(record)}>{text}</div>
    },
    {
      title: WorkFlowSpecificNameChanger("desk_name") + " Name",
      dataIndex: "desk_name",
      sorter: (a, b) => a.desk_name.length - b.desk_name.length,
      render: (text, record) => <div className="divHoverForTables" onClick={()=> DeskSelected(record)}>{text}</div>
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Choose Your Desk</h4>
              <h6>Desk list</h6>
            </div>
            <div className="page-btn">
              <button className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Desk
              </button>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
            <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter */}
              <div
                className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" :"none"}}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Name" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Phone" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Email" />
                      </div>
                    </div>

                    <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                      <div className="form-group">
                        <a className="btn btn-filters ms-auto">
                          <img src={search_whites} alt="img" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table    
                    className="table datanew dataTable no-footer"      
                    columns={columns}
                    dataSource={data}      
                    pagination={false}
                    rowKey={(record) => record.User_id}
                    loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 

                  />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default Select_desk;
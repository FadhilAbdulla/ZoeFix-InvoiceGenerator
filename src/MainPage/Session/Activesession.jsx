//for listing active session in the selected workflow

import React, { useEffect, useState ,useContext , useRef} from "react";
import Tabletop from "../../EntryFile/tabletop"
import { Link, Navigate } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import {ConstructorEventPost} from '../../Event/ConstructorEvent'
import FeatherIcon from "feather-icons-react";
import { search_whites } from "../../EntryFile/imagePath";
import {ActiveSession_fetch_api} from '../../api/Aws-api'
import {SalesAttributes} from './index'
import {FetchWorkflow_code,WorkFlowSpecificNameChanger,FetchSessionRedirectTemplateFromFetchedWorkflow} from '../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../InitialPage/App";

const Activesession = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  //fetch the active session from the session table
  useEffect(() => {
      async function fetchdata(){
        const fetchrequest = {"tablename" : OutletCode +"_session"};
        const responseData = await ConstructorEventPost(ActiveSession_fetch_api,fetchrequest);
        setData(responseData.errorMessage ? [] : responseData)
        setColumnsForActiveSession(responseData[0])
        setLoading(false)}
      fetchdata()
      setLinkForRedirection()
  },[])

  const workflow_code = FetchWorkflow_code()
  const [inputfilter, setInputfilter] = useState(false);
  const {setSales_persion_name,setCommission_agent_name,setCommission_agent_id,setCustomer_name,setCustomer_id,setSession_id,setSales_persion_id,setDesk_id,setDesk_name,setAppointment_id,setAppointment_starttime,setInitiatorCode} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const [TableColoumns, setTableColoumns] = useState([]);
  var Main_workflow = JSON.parse(localStorage.getItem('session'))
  const order_of_execution = useRef(null);
  const RedirectionUrl = useRef(null);

  //set sales attribute for Clossing the session
  const setdataForsessionClose = (record) => {
    setInitiatorCode("session")
    setSales_persion_name(record.sales_person_name)
    setCommission_agent_name(record.commission_agent_name)
    setCustomer_name(record.customer_name)
    setSession_id(record.session_id)
    setSales_persion_id(record.sales_person_id)
    setDesk_id(record.desk_id)
    setDesk_name(record.desk_name)
    setAppointment_id(record.appointment_id)
    setAppointment_starttime(record.appointment_start_time)
  }
  //set sales attribute for continueing Sales on same session
  const setdataForCart = (record) => {
    setInitiatorCode("session")
    setSales_persion_name(record.sales_person_name)
    setSales_persion_id(record.sales_person_id)
    setCommission_agent_name(record.commission_agent_name)
    setCommission_agent_id(record.commission_agent_id)
    setCustomer_name(record.customer_name)
    setCustomer_id(record.customer_id)
    setSession_id(record.session_id)
    setDesk_id(record.desk_id)
    setDesk_name(record.desk_name)
    setAppointment_id(record.appointment_id)
    setAppointment_starttime(record.appointment_start_time)
  }
  const setLinkForRedirection = () => {
    const redirectionUrlFetched = FetchSessionRedirectTemplateFromFetchedWorkflow()
    RedirectionUrl.current = "/dream-pos/session/" + redirectionUrlFetched
    //for getting the current order of execution of the redirectionUrl in the workflow
    for (let workflow in Main_workflow){
      if (Main_workflow[workflow]["routing_uri"] == redirectionUrlFetched){
        order_of_execution.current = parseInt(workflow)
      }
    }
  }
  const setColumnsForActiveSession = (data)=>{
    var temp = []
    if (data && data["customer_id"]){temp.push({
      title: WorkFlowSpecificNameChanger("customer"),
      dataIndex: "customer_name",
      sorter: (a, b) => a.customer_name.length - b.customer_name.length,
      render: (text, record) => <Link to={RedirectionUrl.current} state={{order_of_execution:order_of_execution.current+1 }} onClick={()=> setdataForCart(record)}>{text}</Link>
      })
    }
    if (data && data["sales_person_id"]){temp.push({
      title: WorkFlowSpecificNameChanger("sales_person"),
      dataIndex: "sales_person_name",
      sorter: (a, b) => a.sales_person_name.length - b.sales_person_name.length,
      render: (text, record) => <Link to={RedirectionUrl.current} state={{order_of_execution:order_of_execution.current+1 }} onClick={()=> setdataForCart(record)}>{text}</Link>
      })
    }
    if (data && data["commission_agent_id"]){temp.push({
      title: WorkFlowSpecificNameChanger("commission_agent"),
      dataIndex: "commission_agent_name",
      sorter: (a, b) => a.commission_agent_name.length - b.commission_agent_name.length,
      render: (text, record) => <Link to={RedirectionUrl.current} state={{order_of_execution:order_of_execution.current+1 }} onClick={()=> setdataForCart(record)}>{text}</Link>
      })
    }
    if (data && data["desk_id"]){temp.push({
      title: WorkFlowSpecificNameChanger("desk_name"),
      dataIndex: "desk_name",
      sorter: (a, b) => a.desk_name.length - b.desk_name.length,
      render: (text, record) => <Link to={RedirectionUrl.current} state={{order_of_execution:order_of_execution.current+1 }} onClick={()=> setdataForCart(record)}>{text}</Link>
      })
    }
    if (data && data["appointment_id"]){temp.push({
      title: WorkFlowSpecificNameChanger("appointment_start_time"),
      dataIndex: "appointment_start_time",
      sorter: (a, b) => a.appointment_start_time.length - b.appointment_start_time.length,
      render: (text, record) => <Link to={RedirectionUrl.current} state={{order_of_execution:order_of_execution.current+1 }} onClick={()=> setdataForCart(record)}>{text}</Link>
      })
    }
    temp.push({title: "Status",dataIndex: "Session_status",render: (_,record) => (record.session_status ? "Active" : "Inactive")},
    {dataIndex: "Delete Button",
      render: (_,record)=>(record.session_status ? <Link to="/dream-pos/session/session_close" onClick={()=> setdataForsessionClose(record)} className="icons-items" ><FeatherIcon icon="x-square" /></Link> : null)})
  setTableColoumns(temp)
  }


  const togglefilter = (value) => {
    setInputfilter(value);
  };


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Active Sessions</h4>
              
            </div>
          </div>
          {/* /product list */}
          {workflow_code == "QS" ?
          <Navigate  to="/dream-pos/session"/> : 
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
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter name" />
                      </div>
                    </div>

                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                         
                    
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
                    columns={TableColoumns}
                    dataSource={data}      
                    pagination={false}
                    rowKey={(record) => record.User_id}
                    loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 
                  />
              
              </div>
            </div>
          </div>
          }
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default Activesession;

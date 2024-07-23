//Template For Listing SalesPerson ,Attributes --> SalesPerson's name,id,phoneNumber,email,address
//in this template we fetch both salesperson data and commission agent data and send the commission agent data to commission agent template as props

import React, { useEffect, useState , useRef ,useContext } from "react";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import Tabletop from "../../EntryFile/tabletop"
import { Link ,useLocation,useNavigate} from "react-router-dom";
import { ClassicSpinner,CircleSpinner } from "react-spinners-kit";
import {PlusIcon,search_whites,Search} from "../../EntryFile/imagePath";
import {guidedata_fetch_api,AddSession_Sessiontable} from '../../api/Aws-api'
import {SalesAttributes} from './index'
import {ConstructorEventPost,FormSubmitEvent} from '../../Event/ConstructorEvent'
import {ForwardUriFetchFunction,CheckWorkFlowCreatingSession,GetDateTime,WorkFlowSpecificNameChanger} from '../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../InitialPage/App";

const Customer = () => {
  const [data,setData] = useState()
  const [Filtereddata,setFiltereddata] = useState()
  const [loading,setLoading] = useState(true)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [SearchValue,setSearchValue] = useState("")
  const loc = useLocation()
  const date = GetDateTime()
  const navigate = useNavigate()

  useEffect(() => {
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    async function fetchdata(){
      const fetchrequest = {"tablename" : OutletCode +"_user"};
      const responseData = await ConstructorEventPost(guidedata_fetch_api,fetchrequest);
      let salespersonArray = responseData.filter(data => data.User_type == "customer");
      setData(salespersonArray)
      setFiltereddata(salespersonArray)
      setLoading(false)}
    fetchdata()
  },[])

  const [Refreshloading,setRefreshLoading] = useState(false)
  const {desk_id,desk_name,appointment_id,appointment_starttime,setSession_id,setCustomer_name,setCustomer_id,commission_agent_name,commission_agent_id,sales_persion_name,sales_persion_id,InitiatorCode} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const uri = useRef(null);
  uri.current = ForwardUriFetchFunction(OrderOfExecution,InitiatorCode);

  //function for setting salespersonname and id when a data is selected from the list
  const set_data = (record) =>  {
    console.log("hdahdjadhjahdj")
    setLoading(true)
    setCustomer_name(record.name)
    setCustomer_id(record.user_id)
    if (CheckWorkFlowCreatingSession(parseInt(OrderOfExecution)-1)){addNewSessionDataToCloud(record.name,record.user_id)}
    else { 
      navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}});
      setLoading(false)
    }
  }


  const addNewSessionDataToCloud = async (Customer_name,Customer_id) =>  {
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "sales_person_id" : String(sales_persion_id),
        "commission_agent_id": String(commission_agent_id),
        "sales_person_name":sales_persion_name,
        "commission_agent_name":commission_agent_name,
        "total_commission_agent_amount" : 300,
        "total_sales_agent_amount" : 300,
        "customer_id" : String(Customer_id),
        "customer_name" : Customer_name,
        "session_status" : true,
        "session_startDateTimeStamp" : date,
        "appointment_id" : appointment_id,
        "appointment_starttime" : appointment_starttime,
        "desk_id" : desk_id,
        "desk_name" : desk_name,

    }}};
    const responseData = await FormSubmitEvent(AddSession_Sessiontable,formData);
    setSession_id(responseData[0])
    setLoading(false)
    console.log("sessionCreated")
    navigate( uri.current,{state: {order_of_execution: OrderOfExecution+1 }});    
  }

  const columns = [
    {
      title: WorkFlowSpecificNameChanger("customer") + " Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record) => <div className={loading ? "" : "divHoverForTables"} onClick={()=> !loading && set_data(record)}>{text}</div>
    },
    {
      title: "Phone",
      dataIndex: "Mobile",

    },
    {
      title: "Email",
      dataIndex: "Email",

    },
    {
      title: "Address",
      dataIndex: "Address",
    },
  ];

  const setSearchValueToTable = (input) => {
    setSearchValue(input)
    const temp = data.filter(item => (
      item.name.toLowerCase().includes(input.toLowerCase()) ||
      item.Mobile.includes(input) ||
      item.Email.toLowerCase().includes(input.toLowerCase()) ||
      item.Address.toLowerCase().includes(input.toLowerCase())
    ))
    console.log(temp)
    setFiltereddata(temp)
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Choose {WorkFlowSpecificNameChanger("customer")}</h4>
              <h6>{WorkFlowSpecificNameChanger("customer")} list</h6>
            </div>
            <div className="page-btn">
              <Link to="/dream-pos/session/addcustomer" state={{ order_of_execution:OrderOfExecution+1,ForwardUri: uri.current }} className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New {WorkFlowSpecificNameChanger("customer")}
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              {/* /Filter */}
              <div className="table-top">
                <div className="search-set">
                  <div className="search-path"></div>
                    <div className="search-input">
                      <input
                        className="form-control form-control-sm search-icon"
                        type="text"
                        placeholder="Search..."
                        value={SearchValue}
                        onChange={(e)=>setSearchValueToTable(e.target.value)}
                      />
                      <span to="#" className="btn btn-searchset">
                        <img src={Search} alt="img" />
                      </span>
                    </div>
                  </div>
                </div>                  
              {/* /Filter */}
              <div className="table-responsive">
                <Table    
                    className="table datanew dataTable no-footer"      
                    columns={columns}
                    dataSource={Filtereddata}      
                    pagination={Filtereddata && Filtereddata.length > 10 ? true : false}
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
export default Customer;